"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
fetch("http://localhost:5000/api/emergency-ads")

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

type DurationOption = 6 | 12 | 24 | 48 | 72;

type EmergencyAd = {
  id: number;
  bloodType: BloodType;
  governorate: string;
  message: string;
  duration: DurationOption;
  createdAt: string;
  expiresAt: string;
};

const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الإسماعيلية",
  "الشرقية",
  "الدقهلية",
  "المنوفية",
  "الفيوم",
  "السويس",
  "بورسعيد",
  "الأقصر",
  "أسوان",
];

const durationOptions: DurationOption[] = [6, 12, 24, 48, 72];

const initialAds: EmergencyAd[] = [
  {
    id: 1,
    bloodType: "A+",
    governorate: "الشرقية",
    message: "عاجل وقوع حادث نحتاج 8 أكياس دم فصيلة A+",
    duration: 24,
    createdAt: "15 ديسمبر 2025، 8:34 م",
    expiresAt: "16 ديسمبر 2025، 8:34 م",
  },
  {
    id: 2,
    bloodType: "O+",
    governorate: "القاهرة",
    message: "عاجل وقوع حادث نحتاج 2 أكياس دم فصيلة O+",
    duration: 24,
    createdAt: "9 ديسمبر 2025، 8:37 م",
    expiresAt: "10 ديسمبر 2025، 8:37 م",
  },
  {
    id: 3,
    bloodType: "B+",
    governorate: "الجيزة",
    message: "عاجل وقوع حادث نحتاج 5 أكياس دم فصيلة B+",
    duration: 24,
    createdAt: "9 ديسمبر 2025، 8:37 م",
    expiresAt: "10 ديسمبر 2025، 8:37 م",
  },
  {
    id: 4,
    bloodType: "A-",
    governorate: "الإسماعيلية",
    message: "عاجل وقوع حادث نحتاج 5 أكياس دم فصيلة A-",
    duration: 24,
    createdAt: "9 ديسمبر 2025، 8:37 م",
    expiresAt: "10 ديسمبر 2025، 8:37 م",
  },
];

function getNowArabic() {
  return new Date().toLocaleString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getFutureArabic(hours: number) {
  const future = new Date(Date.now() + hours * 60 * 60 * 1000);
  return future.toLocaleString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function BloodBadge({ type }: { type: BloodType }) {
  return (
    <span className="inline-flex min-w-[40px] items-center justify-center rounded-lg bg-[#F9D2D2] px-2 py-1 text-sm font-bold text-[#E02323]">
      {type}
    </span>
  );
}

function AdCard({ ad }: { ad: EmergencyAd }) {
  return (
<div className="group rounded-[10px] border border-[#D5D5D5] bg-white px-6 py-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#E02323] hover:shadow-md cursor-pointer">      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm font-light text-[#444444]">{ad.createdAt}</p>

        <div className="flex flex-wrap items-center justify-end gap-2 text-right">
          <span className="text-lg font-bold text-[#817D7D]">{ad.governorate}</span>
          <BloodBadge type={ad.bloodType} />
        </div>
      </div>

      <p className="mb-4 text-right text-lg font-normal text-black">{ad.message}</p>

      <p className="text-right text-sm font-medium text-[#444444]">
        ينتهي: {ad.expiresAt}
      </p>
    </div>
  );
}

export default function EmergencyAdsManagement() {
  const [ads, setAds] = useState<EmergencyAd[]>(initialAds);

  const [bloodType, setBloodType] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState<DurationOption>(24);

  const adsCount = useMemo(() => ads.length, [ads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bloodType || !governorate || !message.trim()) {
      alert("من فضلك كمّل كل البيانات المطلوبة");
      return;
    }

    const newAd: EmergencyAd = {
      id: Date.now(),
      bloodType: bloodType as BloodType,
      governorate,
      message,
      duration,
      createdAt: getNowArabic(),
      expiresAt: getFutureArabic(duration),
    };

    setAds((prev) => [newAd, ...prev]);

    setBloodType("");
    setGovernorate("");
    setMessage("");
    setDuration(24);
  };

  return (
    <section
      dir="rtl"
      className="relative min-h-screen bg-white px-4 py-10 md:px-8 lg:px-12"
    >
      {/* glow background */}

      <div className="relative mx-auto max-w-[1400px]">
        <h2 className="mb-8 text-right text-3xl font-bold text-[#E02323] md:text-4xl">
          إدارة إعلانات الطوارئ
        </h2>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* right side - form */}
          <div className="rounded-[15px] border border-black/10 bg-[rgba(220,227,227,0.14)] p-6 shadow-[0px_3px_25px_rgba(0,0,0,0.09)] md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col items-end gap-8">
              <h3 className="w-full text-right text-[22px] font-bold text-[#E02323]">
                نشر إعلان طوارئ جديد
              </h3>

              <div className="w-full">
                <label className="mb-5 block text-right text-lg font-semibold text-black/55">
                  فصيلة الدم المطلوبة *
                </label>

                <div className="relative">
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="h-12 w-full appearance-none rounded-[10px] border border-[#ccc] bg-[rgba(208,207,206,0.29)] px-4 text-right text-base font-semibold text-black outline-none transition-all duration-300 hover:border-[rgba(208, 207, 206, 0)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus:border-black focus:shadow-[0_2px_10px_rgba(0,0,0,0.12)]"             
                         >                    <option value="">اختيار فصيلة الدم</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                </div>
              </div>

              <div className="w-full">
                <label className="mb-5 block text-right text-lg font-semibold text-black/55">
                  المحافظة *
                </label>

                <div className="relative">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="h-12 w-full appearance-none rounded-[10px] border border-[#ccc] bg-[rgba(208,207,206,0.29)] px-4 text-right text-base font-semibold text-black outline-none transition-all duration-300 hover:border-[rgba(208, 207, 206, 0)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus:border-black focus:shadow-[0_2px_10px_rgba(0,0,0,0.12)]"             
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                </div>
              </div>

              <div className="w-full">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالة الطوارئ هنا..."
                  className="min-h-[169px] w-full resize-none rounded-[10px] border border-[#ccc] bg-[rgba(220,227,227,0.14)] p-4 text-right text-lg font-semibold text-black placeholder:text-[#888] outline-none transition-all duration-300 hover:border-[rgba(208, 207, 206, 0)] focus:shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
              
              />
                  </div>

              <div className="w-full">
                <label className="mb-5 block text-right text-lg font-semibold text-black/55">
                  مدة الإعلان (بالساعات)
                </label>

                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value) as DurationOption)}
                    className="h-12 w-full appearance-none rounded-[10px] border border-[#ccc] bg-[rgba(208,207,206,0.29)] px-4 text-right text-base font-semibold text-black outline-none transition-all duration-300 hover:border-[rgba(208, 207, 206, 0)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus:border-black focus:shadow-[0_2px_10px_rgba(0,0,0,0.12)]"             
                  >
                    {durationOptions.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} ساعة
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                </div>
              </div>

              <button
                       type="submit"
                          className="h-[68px] w-full rounded-2xl border border-[#E02323] bg-[#E02323] text-lg font-black text-white transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:shadow-sm"
                           >
                        نشر الإعلان
              </button>
            </form>
          </div>

          {/* left side - ads list */}
          <div className="rounded-[15px] border border-black/10 bg-[rgba(220,227,227,0.14)] p-6 shadow-[0px_3px_25px_rgba(0,0,0,0.09)] md:p-8">
            <div className="flex flex-col items-end gap-8">
              <h3 className="w-full text-right text-[22px] font-bold text-[#E02323]">
                إعلانات الطوارئ الحالية ({adsCount})
              </h3>

              <div className="w-full space-y-6">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}