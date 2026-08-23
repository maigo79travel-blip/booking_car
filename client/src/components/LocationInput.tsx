"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, lat?: string, lon?: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const LocationInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: LocationInputProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Nominatim API: Search within Vietnam (countrycodes=vn)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=vn&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal); // Basic update

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (newVal.trim()) {
        searchLocations(newVal);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 500);
  };

  const handleSelect = (loc: Location) => {
    setQuery(loc.display_name);
    onChange(loc.display_name, loc.lat, loc.lon);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="bg-white rounded-xl flex items-center overflow-hidden border border-transparent focus-within:border-brand-steel transition-colors">
        <div className="w-10 flex justify-center text-gray-400">
          {icon || <MapPin size={18} className="text-[#174978]" />}
        </div>
        <div className="flex-1 py-1.5 px-2 border-l border-gray-100 relative">
          <label className="block text-[11px] text-gray-500 font-bold">
            {label}
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder={placeholder}
              className="w-full outline-none text-gray-800 font-semibold text-sm bg-transparent"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.length >= 3 && setIsOpen(true)}
            />
            {isLoading && (
              <Loader2
                size={14}
                className="animate-spin text-[#174978] mr-2"
              />
            )}
          </div>
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-md border border-gray-100 z-100 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {suggestions.map((loc, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 hover:bg-brand-light transition-colors flex gap-3 items-start border-b last:border-b-0 border-gray-50 cursor-pointer"
              onClick={() => handleSelect(loc)}
            >
              <MapPin
                size={16}
                className="text-[#174978] mt-1 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 line-clamp-1">
                  {loc.display_name.split(",")[0]}
                </span>
                <span className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                  {loc.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
