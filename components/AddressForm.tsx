"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

interface AddressFormProps {
  onSubmit: (address: DeliveryAddress) => void;
  isLoading?: boolean;
}

const PHILIPPINE_PROVINCES = [
  "Abra",
  "Agusan del Norte",
  "Agusan del Sur",
  "Aklan",
  "Albay",
  "Antique",
  "Apayao",
  "Aurora",
  "Basilan",
  "Bataan",
  "Batanes",
  "Batangas",
  "Benguet",
  "Biliran",
  "Bohol",
  "Bukidnon",
  "Bulacan",
  "Cagayan",
  "Camarines Norte",
  "Camarines Sur",
  "Camiguin",
  "Capiz",
  "Catanduanes",
  "Cavite",
  "Cebu",
  "Cotabato",
  "Davao de Oro",
  "Davao del Norte",
  "Davao del Sur",
  "Davao Occidental",
  "Davao Oriental",
  "Dinagat Islands",
  "Eastern Samar",
  "Guimaras",
  "Ifugao",
  "Ilocos Norte",
  "Ilocos Sur",
  "Iloilo",
  "Isabela",
  "Kalinga",
  "La Union",
  "Laguna",
  "Lanao del Norte",
  "Lanao del Sur",
  "Leyte",
  "Maguindanao del Norte",
  "Maguindanao del Sur",
  "Marinduque",
  "Masbate",
  "Metro Manila",
  "Misamis Occidental",
  "Misamis Oriental",
  "Mountain Province",
  "Negros Occidental",
  "Negros Oriental",
  "Northern Samar",
  "Nueva Ecija",
  "Nueva Vizcaya",
  "Occidental Mindoro",
  "Oriental Mindoro",
  "Palawan",
  "Pampanga",
  "Pangasinan",
  "Quezon",
  "Quirino",
  "Rizal",
  "Romblon",
  "Samar",
  "Sarangani",
  "Siquijor",
  "Sorsogon",
  "South Cotabato",
  "Southern Leyte",
  "Sultan Kudarat",
  "Sulu",
  "Surigao del Norte",
  "Surigao del Sur",
  "Tarlac",
  "Tawi-Tawi",
  "Zambales",
  "Zamboanga del Norte",
  "Zamboanga del Sur",
  "Zamboanga Sibugay",
].sort();

export function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const [form, setForm] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});

  const validate = () => {
    const newErrors: Partial<DeliveryAddress> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.line1.trim()) newErrors.line1 = "Street address is required";
    if (!form.barangay.trim()) newErrors.barangay = "Barangay is required";
    if (!form.city.trim()) newErrors.city = "City / Municipality is required";
    if (!form.province.trim()) newErrors.province = "Province is required";
    if (!form.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const field = (key: keyof DeliveryAddress, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#6A395B] dark:text-[#F5EDE0]">
        {label} <span className="text-[#8F4D7B]">*</span>
      </label>
      <Input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} className={`border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35] ${errors[key] ? "border-red-400 ring-1 ring-red-400" : ""}`} />
      {errors[key] && <p className="mt-1 text-xs text-[#8F4D7B]">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-[#8F4D7B] dark:text-[#DA90C4]" />
        <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Delivery Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("fullName", "Full Name", "Juan dela Cruz")}
          {field("phone", "Phone Number", "09XX XXX XXXX", "tel")}
        </div>

        {field("line1", "Street / House No. / Building", "123 Rizal Street")}
        {field("line2", "Apartment / Unit / Floor (optional)", "Unit 4B")}
        {field("barangay", "Barangay", "Barangay San Antonio")}

        <div className="grid gap-4 sm:grid-cols-2">
          {field("city", "City / Municipality", "Makati City")}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#6A395B] dark:text-[#F5EDE0]">
              Province <span className="text-[#8F4D7B]">*</span>
            </label>
            <select value={form.province} onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))} className={`w-full rounded-md border border-[#F0D6E8] bg-white px-3 py-2 text-sm text-[#6A395B] focus:outline-none focus:ring-1 focus:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35] dark:text-[#F5EDE0] ${errors.province ? "border-red-400 ring-1 ring-red-400" : ""}`}>
              <option value="">Select province</option>
              {PHILIPPINE_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.province && <p className="mt-1 text-xs text-[#8F4D7B]">{errors.province}</p>}
          </div>
        </div>

        {field("zipCode", "ZIP Code", "1200")}

        <Button type="submit" disabled={isLoading} className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] transition-colors duration-200">
          Proceed to Payment
        </Button>
      </form>
    </div>
  );
}
