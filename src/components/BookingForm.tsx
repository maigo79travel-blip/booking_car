"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plane,
  Car,
  MapPin,
  RefreshCw,
  ChevronRight,
  Phone,
  User,
  Loader2,
} from "lucide-react";
import LocationInput from "./LocationInput";
import { useLanguage } from "@/context/LanguageContext";

const NOI_BAI_COORDS = { lat: "21.2187", lon: "105.8041" };
const HANOI_COORDS = { lat: "21.0285", lon: "105.8542" };

const BookingForm = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"airport" | "long-distance">(
    "airport"
  );
  const [wayType, setWayType] = useState("one-way");
  const [showHotlineModal, setShowHotlineModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form states
  const [fromLocation, setFromLocation] = useState("Hà Nội");
  const [toLocation, setToLocation] = useState("Sân bay Nội Bài");
  const [coords, setCoords] = useState<{
    from: { lat?: string; lon?: string };
    to: { lat?: string; lon?: string };
  }>({
    from: HANOI_COORDS,
    to: NOI_BAI_COORDS,
  });
  const [carType, setCarType] = useState("5");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("08:00");

  // Booking info states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [timeError, setTimeError] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes

  const [mounted, setMounted] = useState(false);

  // Pricing rates (VND/km) derived from price table
  const rates = {
    "5": 9500,
    "7": 11000,
    "16": 16000,
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setShowCountdown(false);
      if (mounted) localStorage.removeItem("BOOKING_COUNTDOWN_END");
    }
    return () => clearInterval(timer);
  }, [showCountdown, timeLeft, mounted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const validateDateTime = (date: string, time: string) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10);
    const selected = new Date(`${date}T${time}`);

    if (selected < now) {
      return t.bookingForm.errorPastTime;
    }
    return "";
  };

  useEffect(() => {
    setMounted(true);
    const today = getMinDateTime();
    const nowTime = getCurrentTime();
    setTripDate(today);
    setTripTime(nowTime);

    // Check for persisted countdown
    const savedEndTime = localStorage.getItem("BOOKING_COUNTDOWN_END");
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Date.now();
      if (endTime > now) {
        const remainingSeconds = Math.round((endTime - now) / 1000);
        setTimeLeft(remainingSeconds);
        setShowCountdown(true);
      } else {
        localStorage.removeItem("BOOKING_COUNTDOWN_END");
      }
    }
  }, []);

  useEffect(() => {
    const error = validateDateTime(tripDate, tripTime);
    setTimeError(error);
  }, [tripDate, tripTime, t]);

  const handleSubmitBooking = async () => {
    // 1. Validation
    const dateError = validateDateTime(tripDate, tripTime);
    if (dateError) {
      alert(dateError);
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(t.bookingForm.errorFillAll);
      return;
    }
    const phoneClean = customerPhone.replace(/[\s\-\+\(\)]/g, "");
    if (phoneClean.length < 9 || phoneClean.length > 15) {
      alert(t.bookingForm.errorInvalidPhone);
      return;
    }

    // 2. Calculate Price (internally)
    setIsCalculating(true);

    setTimeout(async () => {
      const calculatedPrice = getPrice();

      // 3. Submit to Backend
      try {
        const bookingData = {
          fromLocation,
          toLocation,
          carType,
          tripDate,
          tripTime,
          wayType,
          price: calculatedPrice,
          customerName,
          customerPhone,
        };

        await fetch("/api/booking/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        // 4. Show Countdown (Processing State)
        setIsCalculating(false);
        setShowCountdown(true);
        setTimeLeft(120);
        localStorage.setItem(
          "BOOKING_COUNTDOWN_END",
          (Date.now() + 120 * 1000).toString()
        );
      } catch (error: any) {
        console.error("Error submitting:", error);
        setIsCalculating(false);
        alert(
          `Có lỗi kết nối: ${error.message || "Vui lòng kiểm tra lại mạng!"}`
        );
      }
    }, 800);
  };

  const getDistance = (
    lat1?: string,
    lon1?: string,
    lat2?: string,
    lon2?: string
  ) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 30; // Default fallback

    const R = 6371; // Earth's radius in km
    const dLat = ((parseFloat(lat2) - parseFloat(lat1)) * Math.PI) / 180;
    const dLon = ((parseFloat(lon2) - parseFloat(lon1)) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((parseFloat(lat1) * Math.PI) / 180) *
        Math.cos((parseFloat(lat2) * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Math.round(d * 1.35);
  };

  const getPrice = () => {
    let distance = getDistance(
      coords.from.lat,
      coords.from.lon,
      coords.to.lat,
      coords.to.lon
    );

    if (distance < 10) distance = 10;

    const rate = rates[carType as keyof typeof rates] || 9000;
    let price = distance * rate;

    const isAirportTrip =
      fromLocation.toLowerCase().includes("nội bài") ||
      toLocation.toLowerCase().includes("nội bài") ||
      fromLocation.toLowerCase().includes("noi bai") ||
      toLocation.toLowerCase().includes("noi bai");

    const isHanoiTrip =
      fromLocation.toLowerCase().includes("hà nội") ||
      toLocation.toLowerCase().includes("hà nội") ||
      fromLocation.toLowerCase().includes("hanoi") ||
      toLocation.toLowerCase().includes("hanoi");

    if (isAirportTrip && isHanoiTrip && distance < 45) {
      if (carType === "5") price = 250000;
      if (carType === "7") price = 300000;
      if (carType === "16") price = 550000;

      if (
        fromLocation.toLowerCase().includes("hà nội") ||
        fromLocation.toLowerCase().includes("hanoi")
      ) {
        price -= 50000;
      }

      if (wayType === "two-way") {
        if (carType === "5") price = 400000;
        if (carType === "7") price = 500000;
        if (carType === "16") price = 900000;
        return price;
      }
    }

    if (wayType === "two-way") {
      price = price * 1.7;
    }

    return Math.round(price / 1000) * 1000;
  };

  const handleTabChange = (tab: "airport" | "long-distance") => {
    setActiveTab(tab);

    if (tab === "airport") {
      const isAlreadyAirport =
        fromLocation.toLowerCase().includes("nội bài") ||
        toLocation.toLowerCase().includes("nội bài") ||
        fromLocation.toLowerCase().includes("noi bai") ||
        toLocation.toLowerCase().includes("noi bai");

      if (!isAlreadyAirport) {
        setToLocation("Sân bay Nội Bài");
        setCoords((prev) => ({ ...prev, to: NOI_BAI_COORDS }));
      }
    }
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
    setCoords({
      from: coords.to,
      to: coords.from,
    });
  };

  return (
    <>
      <div className="bg-orange-500 rounded-2xl overflow-hidden shadow-2xl w-full flex flex-col">
        {/* Tabs */}
        <div className="flex text-white font-semibold text-sm">
          <button
            onClick={() => handleTabChange("airport")}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 transition-colors ${
              activeTab === "airport"
                ? "bg-orange-500 text-white border-b-2 border-white"
                : "bg-orange-600/70 hover:bg-orange-600 text-white/90"
            }`}
          >
            <Plane size={18} className="rotate-[-45deg]" />
            {t.bookingForm.airportTab}
          </button>
          <button
            onClick={() => handleTabChange("long-distance")}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 transition-colors ${
              activeTab === "long-distance"
                ? "bg-orange-500 text-white border-b-2 border-white"
                : "bg-orange-600/70 hover:bg-orange-600 text-white/90"
            }`}
          >
            <Car size={18} />
            {t.bookingForm.longDistanceTab}
          </button>
        </div>

        {/* Form Content */}
        <div className="p-5 md:p-6 space-y-4">
          {/* Route Inputs */}
          <div className="relative space-y-2.5">
            <LocationInput
              label={t.bookingForm.fromLabel}
              value={fromLocation}
              placeholder={t.bookingForm.fromPlaceholder}
              icon={<MapPin size={20} className="text-orange-500" />}
              onChange={(val, lat, lon) => {
                setFromLocation(val);
                if (lat && lon) {
                  setCoords((prev) => ({ ...prev, from: { lat, lon } }));
                }
              }}
            />

            <div className="absolute right-2 top-[30%] z-10">
              <button
                type="button"
                onClick={swapLocations}
                className="bg-orange-500 rounded-full p-1.5 border-2 border-white hover:rotate-180 transition-transform duration-300 shadow-md cursor-pointer"
                aria-label="Đổi chiều / Swap"
              >
                <RefreshCw size={16} className="text-white" />
              </button>
            </div>

            <LocationInput
              label={t.bookingForm.toLabel}
              value={toLocation}
              placeholder={t.bookingForm.toPlaceholder}
              icon={<MapPin size={20} className="text-red-500" />}
              onChange={(val, lat, lon) => {
                setToLocation(val);
                if (lat && lon) {
                  setCoords((prev) => ({ ...prev, to: { lat, lon } }));
                }
              }}
            />
          </div>

          {/* Options Row: Date & Time */}
          <div className="flex gap-2">
            <div
              className={`bg-white rounded-xl flex-1 py-2 px-3 border-2 ${
                timeError ? "border-red-400" : "border-transparent"
              } transition-colors`}
            >
              <label className="block text-xs text-gray-500 font-bold mb-0.5">
                {t.bookingForm.dateLabel}
              </label>
              <input
                type="date"
                className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                value={tripDate}
                min={getMinDateTime()}
                onChange={(e) => setTripDate(e.target.value)}
              />
            </div>
            <div
              className={`bg-white rounded-xl w-1/3 py-2 px-3 border-2 ${
                timeError ? "border-red-400" : "border-transparent"
              } transition-colors`}
            >
              <label className="block text-xs text-gray-500 font-bold mb-0.5">
                {t.bookingForm.timeLabel}
              </label>
              <input
                type="time"
                className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                value={tripTime}
                onChange={(e) => setTripTime(e.target.value)}
              />
            </div>
          </div>

          {timeError && (
            <p className="text-white text-xs font-semibold bg-red-600/80 px-3 py-1 rounded-lg">
              ⚠️ {timeError}
            </p>
          )}

          {/* Car Type & Way Type */}
          <div className="flex gap-2">
            <div className="bg-white rounded-xl flex-1 py-2 px-3">
              <label className="block text-xs text-gray-500 font-bold mb-0.5">
                {t.bookingForm.carTypeLabel}
              </label>
              <select
                className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                value={carType}
                onChange={(e) => {
                  setCarType(e.target.value);
                }}
              >
                <option value="5">{t.bookingForm.car5Seats}</option>
                <option value="7">{t.bookingForm.car7Seats}</option>
                <option value="16">{t.bookingForm.car16Seats}</option>
              </select>
            </div>
            <div className="bg-white rounded-xl w-1/3 py-2 px-3">
              <label className="block text-xs text-gray-500 font-bold mb-0.5">
                {t.bookingForm.oneWay}/{t.bookingForm.twoWay}
              </label>
              <select
                className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                value={wayType}
                onChange={(e) => {
                  setWayType(e.target.value);
                }}
              >
                <option value="one-way">{t.bookingForm.oneWay}</option>
                <option value="two-way">{t.bookingForm.twoWay}</option>
              </select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex gap-2">
            <div className="bg-white rounded-xl flex-1 py-2 px-3 border-2 border-transparent focus-within:border-white transition-colors flex items-center gap-2">
              <User size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-gray-500 font-bold mb-0.5">
                  {t.bookingForm.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.bookingForm.namePlaceholder}
                  className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl flex-1 py-2 px-3 border-2 border-transparent focus-within:border-white transition-colors flex items-center gap-2">
              <Phone size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-gray-500 font-bold mb-0.5">
                  {t.bookingForm.phoneLabel}
                </label>
                <input
                  type="tel"
                  placeholder={t.bookingForm.phonePlaceholder}
                  className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitBooking}
            disabled={isCalculating || !!timeError}
            className={`w-full ${
              timeError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-950"
            } text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer`}
          >
            {isCalculating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{t.bookingForm.submittingBtn}</span>
              </>
            ) : (
              <>
                <span>{t.bookingForm.submitBtn}</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>

          <p className="text-white/90 text-center text-xs">
            {t.common.hotline}:{" "}
            <a
              href={`tel:${t.common.hotlineNumber.replace(/[^0-9+]/g, "")}`}
              className="font-bold hover:underline"
            >
              {t.common.hotlineNumber}
            </a>
          </p>
        </div>
      </div>

      {/* Countdown Timer Modal */}
      {mounted &&
        showCountdown &&
        createPortal(
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center border-2 border-orange-500 shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-lg relative">
              <div className="mb-6">
                <div className="w-28 h-28 mx-auto rounded-full border-4 border-orange-500 flex items-center justify-center relative bg-orange-50">
                  <span className="text-4xl font-black text-orange-600 tracking-wider">
                    {formatTime(timeLeft)}
                  </span>
                  <div
                    className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-30"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                {t.bookingForm.countdownNotice}...
              </h3>

              <p className="text-gray-600 mb-6 font-medium text-sm md:text-base leading-relaxed px-2">
                {t.bookingForm.successDesc}
              </p>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / 120) * 100}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-400 italic">
                {t.bookingForm.countdownNotice} ({timeLeft}{" "}
                {t.bookingForm.countdownSeconds})
              </p>

              <button
                onClick={() => setShowCountdown(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                aria-label={t.bookingForm.close}
              >
                ✕
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Hotline Notification Modal */}
      {mounted &&
        showHotlineModal &&
        createPortal(
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-orange-500 py-3.5 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-white font-bold text-lg">
                  <div className="w-7 h-7 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-black">
                    !
                  </div>
                  {t.bookingForm.hotlineModalTitle}
                </div>
                <button
                  onClick={() => setShowHotlineModal(false)}
                  className="text-white hover:text-orange-100 font-bold text-xl px-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-8 text-center space-y-6">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {t.bookingForm.hotlineModalDesc}
                </p>

                <a
                  href={`tel:${t.common.hotlineNumber.replace(/[^0-9+]/g, "")}`}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all tracking-wider text-base"
                >
                  {t.bookingForm.callNow}
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default BookingForm;
