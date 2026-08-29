"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
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
  CheckCircle2,
} from "lucide-react";
import LocationInput from "./LocationInput";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const CAM_RANH_AIRPORT_COORDS = { lat: "11.9981", lon: "109.2194" };
const NHA_TRANG_COORDS = { lat: "12.2388", lon: "109.1967" };

const BookingForm = () => {
  const { t, language } = useLanguage();
  const { contact } = useSiteContent();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"airport" | "long-distance">(
    "airport"
  );
  const [wayType, setWayType] = useState("one-way");
  const [showHotlineModal, setShowHotlineModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form states
  const [fromLocation, setFromLocation] = useState("Sân bay Cam Ranh");
  const [toLocation, setToLocation] = useState("TP. Nha Trang");
  const [coords, setCoords] = useState<{
    from: { lat?: string; lon?: string };
    to: { lat?: string; lon?: string };
  }>({
    from: CAM_RANH_AIRPORT_COORDS,
    to: NHA_TRANG_COORDS,
  });
  const [carType, setCarType] = useState("5");
  const [tripDate, setTripDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tripTime, setTripTime] = useState(() => new Date().toTimeString().slice(0, 5));

  // Booking info states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Pricing rates (VND/km) derived from price table
  const rates = {
    "5": 9500,
    "7": 11000,
    "16": 16000,
  };

  const hotlineNum = contact.hotline || "0878458885";
  const hotlineDisplay = contact.hotline_display || "0878.458.885";
  const quickBookingCopy = {
    vi: "Để đặt xe nhanh, anh/chị vui lòng liên hệ:",
    en: "For a quick booking, please contact:",
    ko: "빠른 예약을 원하시면 아래 번호로 연락해 주세요:",
    ru: "Для быстрого бронирования свяжитесь с нами:",
    zh: "如需快速预订，请联系：",
  }[language];

  // Mount effect
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  // Switch tab handlers
  const handleTabChange = (tab: "airport" | "long-distance") => {
    setActiveTab(tab);
    if (tab === "airport") {
      setFromLocation("Sân bay Cam Ranh");
      setToLocation("TP. Nha Trang");
      setCoords({ from: CAM_RANH_AIRPORT_COORDS, to: NHA_TRANG_COORDS });
    } else {
      setFromLocation("TP. Nha Trang");
      setToLocation("TP. Đà Lạt");
      setCoords({ from: NHA_TRANG_COORDS, to: {} });
    }
  };

  // Real-time time validation check
  const timeError = useMemo(() => {
    if (!tripDate || !tripTime) return null;

    const now = new Date();
    const [year, month, day] = tripDate.split("-").map(Number);
    const [hours, minutes] = tripTime.split(":").map(Number);

    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(selectedDateTime.getTime())) return null;

    if (selectedDateTime.getTime() < now.getTime() - 60000) {
      return t.bookingForm.errorPastTime;
    }

    return null;
  }, [tripDate, tripTime, t]);

  // Calculate distance via OSRM or fallback to Haversine
  const calculateDistance = async (): Promise<number> => {
    if (coords.from.lat && coords.from.lon && coords.to.lat && coords.to.lon) {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${coords.from.lon},${coords.from.lat};${coords.to.lon},${coords.to.lat}?overview=false`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          return Math.round(data.routes[0].distance / 1000); // meters to km
        }
      } catch (err) {
        console.error("OSRM Route error, falling back to math:", err);
      }

      // Haversine fallback formula with 1.3 road curvature factor
      const R = 6371; // Earth radius in km
      const lat1 = (parseFloat(coords.from.lat) * Math.PI) / 180;
      const lat2 = (parseFloat(coords.to.lat) * Math.PI) / 180;
      const dLat =
        ((parseFloat(coords.to.lat) - parseFloat(coords.from.lat)) * Math.PI) /
        180;
      const dLon =
        ((parseFloat(coords.to.lon) - parseFloat(coords.from.lon)) * Math.PI) /
        180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightDistance = R * c;
      return Math.max(5, Math.round(straightDistance * 1.3)); // 1.3x routing factor
    }

    // Default route distances for Nha Trang / Cam Ranh
    if (activeTab === "airport") return 35; // Cam Ranh ⇄ Nha Trang ~ 35km
    return 135; // Nha Trang ⇄ Đà Lạt ~ 135km
  };

  // Submit Handler
  const handleSubmitBooking = async () => {
    if (timeError) {
      alert(timeError);
      return;
    }

    if (!fromLocation.trim() || !toLocation.trim()) {
      alert("Vui lòng nhập đầy đủ điểm đón và điểm đến.");
      return;
    }

    setIsCalculating(true);

    try {
      const distanceKm = await calculateDistance();
      const baseRate = rates[carType as keyof typeof rates] || 9500;
      let calculatedPrice = distanceKm * baseRate;

      // Cam Ranh Airport fixed promotion prices
      if (activeTab === "airport") {
        if (carType === "5") calculatedPrice = 250000;
        else if (carType === "7") calculatedPrice = 300000;
        else if (carType === "16") calculatedPrice = 550000;
      }

      // Two-way discount (70% on return trip)
      const totalPrice =
        wayType === "two-way"
          ? Math.round(calculatedPrice * 1.8)
          : calculatedPrice;

      // Save booking to Supabase API
      const bookingPayload = {
        customer_name: customerName.trim() || "Khách đặt xe",
        phone_number: customerPhone.trim() || "Chưa cung cấp",
        from_location: fromLocation,
        to_location: toLocation,
        trip_type: activeTab,
        way_type: wayType,
        trip_date: tripDate,
        trip_time: tripTime,
        car_type: `${carType} chỗ`,
        distance_km: distanceKm,
        total_price: totalPrice,
      };

      const res = await fetch("/api/booking/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (data.status === "duplicate" || data.status === "exists") {
        setShowHotlineModal(true);
      } else {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setShowSuccessModal(true);
    } finally {
      setIsCalculating(false);
    }
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
    setCoords({ from: coords.to, to: coords.from });
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full flex flex-col">
      <div className="bg-linear-to-br from-[#003366] via-[#174978] to-brand-marine shadow-sm overflow-hidden border border-white/10 h-full flex flex-col justify-between">
        {/* Header Tabs */}
        <div className="flex border-b border-white/10 text-sm md:text-base font-semibold shrink-0">
          <button
            onClick={() => handleTabChange("airport")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "airport"
                ? "bg-[#002244] text-white border-b border-brand-coastal"
                : "bg-white/5 hover:bg-white/10 text-white/90"
            }`}
          >
            <Plane size={18} className="-rotate-45 text-brand-coastal" />
            {t.bookingForm.airportTab}
          </button>
          <button
            onClick={() => handleTabChange("long-distance")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === "long-distance"
                ? "bg-[#002244] text-white border-b border-brand-coastal"
                : "bg-white/5 hover:bg-white/10 text-white/90"
            }`}
          >
            <Car size={18} className="text-brand-coastal" />
            {t.bookingForm.longDistanceTab}
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 md:p-5 space-y-3 flex-1 flex flex-col justify-between">
          {/* Route Inputs */}
          <div className="relative space-y-2">
            <LocationInput
              label={t.bookingForm.fromLabel}
              value={fromLocation}
              placeholder={t.bookingForm.fromPlaceholder}
              icon={<MapPin size={18} className="text-[#174978]" />}
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
                className="bg-[#174978] hover:bg-[#003366] p-1.5 border border-white/80 hover:rotate-180 transition-transform duration-300 shadow-xs cursor-pointer"
                title="Đổi chiều đón trả"
                aria-label="Đổi chiều đón trả"
              >
                <RefreshCw size={13} className="text-white" />
              </button>
            </div>

            <LocationInput
              label={t.bookingForm.toLabel}
              value={toLocation}
              placeholder={t.bookingForm.toPlaceholder}
              icon={<MapPin size={18} className="text-[#174978]" />}
              onChange={(val, lat, lon) => {
                setToLocation(val);
                if (lat && lon) {
                  setCoords((prev) => ({ ...prev, to: { lat, lon } }));
                }
              }}
            />
          </div>

          {/* Date and Time Selector */}
          <div className="flex gap-2">
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors">
              <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                {t.bookingForm.dateLabel}
              </label>
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent cursor-pointer"
              />
            </div>
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors">
              <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                {t.bookingForm.timeLabel}
              </label>
              <input
                type="time"
                value={tripTime}
                onChange={(e) => setTripTime(e.target.value)}
                className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Time Validation Warning */}
          {timeError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs font-medium flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{timeError}</span>
            </div>
          )}

          {/* Car Type & Way Type */}
          <div className="flex gap-2">
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors">
              <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                {t.bookingForm.carTypeLabel}
              </label>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent cursor-pointer"
              >
                <option value="5">{t.bookingForm.car5Seats}</option>
                <option value="7">{t.bookingForm.car7Seats}</option>
                <option value="16">{t.bookingForm.car16Seats}</option>
              </select>
            </div>
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors">
              <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                {t.bookingForm.tripTypeLabel}
              </label>
              <select
                value={wayType}
                onChange={(e) => setWayType(e.target.value)}
                className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent cursor-pointer"
              >
                <option value="one-way">{t.bookingForm.oneWay}</option>
                <option value="two-way">{t.bookingForm.twoWay}</option>
              </select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex gap-2">
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors flex items-center gap-2">
              <User size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                  {t.bookingForm.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.bookingForm.namePlaceholder}
                  className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-white flex-1 py-1.5 px-3 border border-transparent focus-within:border-brand-steel transition-colors flex items-center gap-2">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] text-gray-500 font-semibold mb-0.5">
                  {t.bookingForm.phoneLabel}
                </label>
                <input
                  type="tel"
                  placeholder={t.bookingForm.phonePlaceholder}
                  className="w-full outline-none text-gray-800 font-medium text-sm bg-transparent"
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
                : "bg-[#002244] hover:bg-[#00172e]"
            } text-white font-semibold py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-sm`}
          >
            {isCalculating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>{t.bookingForm.submittingBtn}</span>
              </>
            ) : (
              <>
                <span>{t.bookingForm.submitBtn}</span>
                <ChevronRight size={18} className="text-brand-coastal" />
              </>
            )}
          </button>

          <p className="text-blue-100 text-center text-xs font-medium">
            {quickBookingCopy}{" "}
            <a
              href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
              className="font-semibold text-white hover:underline"
            >
              087.84.58885
            </a>
          </p>
        </div>
      </div>

      {/* Booking Success Modal */}
      {mounted &&
        showSuccessModal &&
        createPortal(
          <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white p-6 md:p-8 text-center border border-gray-100 shadow-xl animate-in zoom-in-95 duration-200 w-full max-w-lg relative">
              {/* Success Checkmark Icon */}
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} className="animate-in zoom-in duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {t.bookingForm.successTitle}
              </h3>

              {/* Main Notice */}
              <p className="text-base font-semibold text-[#174978] mb-2">
                {t.bookingForm.driverContactNotice}
              </p>

              {/* Description */}
              <p className="text-gray-600 mb-6 font-normal text-xs md:text-sm leading-relaxed px-2">
                {t.bookingForm.successDesc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 px-6 bg-[#174978] hover:bg-[#003366] text-white font-semibold text-sm transition-all cursor-pointer shadow-xs"
                >
                  {t.bookingForm.close || "Xác nhận & Đóng"}
                </button>
                <a
                  href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
                  className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Phone size={15} className="text-[#174978]" />
                  <span>{hotlineDisplay}</span>
                </a>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
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
          <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="bg-white shadow-lg w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#174978] py-3 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <div className="w-6 h-6 bg-white text-[#174978] flex items-center justify-center text-xs font-bold">
                    !
                  </div>
                  {t.bookingForm.hotlineModalTitle}
                </div>
                <button
                  onClick={() => setShowHotlineModal(false)}
                  className="text-white hover:text-blue-200 font-semibold text-lg px-1.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-5 text-center space-y-3.5">
                <div className="w-14 h-14 bg-brand-light text-[#174978] flex items-center justify-center mx-auto mb-1">
                  <Phone size={26} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t.bookingForm.hotlineModalDesc}
                </p>
                <div className="pt-1">
                  <a
                    href={`tel:${hotlineNum.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#174978] hover:bg-[#003366] text-white font-semibold text-base py-2.5 px-6 shadow-xs transition-all cursor-pointer"
                  >
                    <Phone size={18} />
                    <span>{hotlineDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BookingForm;
