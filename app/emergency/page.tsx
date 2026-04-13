"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  Clock3,
  MapPin,
  Megaphone,
  PhoneCall,
  Stethoscope,
  Siren,
} from "lucide-react";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

type EmergencyAd = {
  id: string;
  governorate: string;
  bloodType: BloodType;
  locationNote: string;
  message: string;
  updatedAgo: string;
  createdAt: string;
  expiresAt: string;
};

const toEnglishNumbers = (value: string | number) => {
  return String(value).replace(/[٠-٩]/g, (d) =>
    "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()
  );
};


function UpdateBox({
  updatedAgo,
  createdAt,
}: {
  updatedAgo: string;
  createdAt: string;
}) {
  return (
      <div className="w-full max-w-[190px] rounded-[10px] px-3 py-2"
        style={{ 
          border: "1px solid #9e9b9b",
          backgroundColor: "rgba(218,218,218,0.25)"
        }}>     
<div className="flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(236,121,121,0.6)]">
          <Clock3 className="h-4 w-4 text-[#E02323]" />
        </div>

<div className="text-right leading-none">
            <p className="text-[12px] leading-6 text-[#444444]">آخر تحديث</p>
<p className="text-[12px] font-bold leading-6 text-black">
  {toEnglishNumbers(updatedAgo)}
</p>        </div>
      </div>

      <p className="mt-1 text-center text-[12px] leading-6 text-[#444444]">
  {toEnglishNumbers(createdAt)}
</p>
    </div>
  );
}

function BloodBadge({ type }: { type: BloodType }) {
  return (
    <div className="flex h-[29px] min-w-[33px] items-center justify-center rounded-[8px] bg-[#E02323] px-2 text-[12px] font-bold text-white">
      {type}
    </div>
  );
}

function EmergencyCard({ ad }: { ad: EmergencyAd }) {
  return (
    <div className="rounded-[10px] bg-white px-[24px] py-[23px] shadow-[0px_3px_25px_rgba(0,0,0,0.15)] md:px-[33px]">
      {/* الصف الأول */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* الشمال دلوقتي: المحافظة + الإعلان */}
        <div className="flex flex-col items-end">
         <div className="flex items-center justify-end gap-[22px] w-full">
            <BloodBadge type={ad.bloodType} />

                <div className="flex flex-col items-start gap-[1px] w-full">
                <h3 className="text-right text-[18px] font-bold leading-6 text-black w-full">
                {ad.governorate}
              </h3>

              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#818181]" />
                <span className="text-[12px] leading-6 text-[#444444]">
                  {ad.locationNote}
                </span>
              </div>
            </div>
          </div>

            <div className="mt-[50px] flex items-center gap-4 pr-6">
              <div className="flex h-[29px] w-[33px] items-center justify-center rounded-[8px] bg-[rgba(236,121,121,0.5)]">
              <Siren className="h-5 w-5 text-[#E02323]" />
            </div>

            <p className="text-center text-[14px] leading-6 text-[#555555]">
              {ad.message}
            </p>
          </div>
        </div>

        {/* اليمين دلوقتي: آخر تحديث */}
        <UpdateBox updatedAgo={ad.updatedAgo} createdAt={ad.createdAt} />
      </div>

      {/* الصف الثاني */}
      <div className="mt-[72px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/*الشمال دلوقتي: إعلان طوارئ رسمي */} 
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-[30px] items-center justify-center rounded-[10px] border border-[#818181] bg-[rgba(218,218,218,0.5)]">
          <Bell className="h-4 w-4 text-black fill-black" />
          </div>

          <span className="text-center text-[14px] leading-6 text-[#444444]">
            إعلان طوارئ رسمي
          </span>
        </div>

        {/* اليمين دلوقتي: تاريخ الصلاحية */}
        <div className="flex items-center gap-3">
          <span className="text-center text-[14px] leading-6 text-[#444444]">
              تنتهي الصلاحية:
            </span>


          <div className="flex h-10 items-center justify-center rounded-[10px] border border-[#FFCC00] bg-[rgba(255,204,0,0.2)] px-3">
            <span className="text-center text-[14px] font-bold leading-6 text-[#905B5B]">
        {toEnglishNumbers(ad.expiresAt)}
            </span>
          </div>

          
        </div>
      </div>
    </div>
  );
}
function ResponseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[191px] flex-col items-end gap-4 rounded-[10px] border border-[#DBDBDB] bg-white px-4 py-3">
    <div className="self-start flex h-[50px] w-[50px] items-center justify-center rounded-[10px] border border-[#E02323]">
      {icon}
    </div>    
    <div className="w-full text-right">
        <h3 className="text-[21px] font-semibold leading-[35px] text-black">
          {title}
        </h3>

        <p className="text-[17px] font-light leading-8 text-black">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function EmergencyPage() {

const [ads, setAds] = useState<EmergencyAd[]>([]);
const [activeCount, setActiveCount] = useState(0);
const [lastUpdated, setLastUpdated] = useState("لا يوجد");


const fetchAds = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/emergency-ads");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    console.log("Fetched data:", data);

    setAds(Array.isArray(data.ads) ? data.ads : []);
    setActiveCount(typeof data.activeCount === "number" ? data.activeCount : 0);
    setLastUpdated(data.lastUpdated || "لا يوجد");
  } catch (error) {
    console.error("Fetch ads error:", error);
    setAds([]);
    setActiveCount(0);
    setLastUpdated("لا يوجد");
  }
};
useEffect(() => {
  fetchAds();

  const interval = setInterval(() => {
    fetchAds();
  }, 30000); // كل 30 ثانية

  return () => clearInterval(interval);
}, []);


  return (
    <section
      dir="rtl"
        className="relative bg-white px-4 py-12 md:px-8"   >

      <div className="relative mx-auto max-w-[933px]">
        <div className="text-center">
          <h1 className="font-['Arimo'] text-[28px] font-bold leading-tight md:text-[42px]">
            <span className="text-[#E02323]">إعلانات الطوارئ</span>{" "}
            <span className="text-[#1F2430]">للتبرع بالدم</span>
          </h1>

          <p className="mt-4 font-['Arimo'] text-[16px] text-[#444444] md:text-[20px]">
            هذه الإعلانات تظهر للجميع بدون تسجيل ساهم في إنقاذ الأرواح
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-[14px] leading-6 text-[#333333]">
              يتم تحديث البيانات تلقائياً كل 30 ثانية
            </span>
            <span className="h-[10px] w-[10px] rounded-full bg-[#E02323]" />
          </div>
        </div>

            <div className="mt-10">
              {ads.length > 0 ? (
                <div className="flex flex-col gap-[62px]">
              {ads.map((ad, index) => (
                <EmergencyCard
                  key={ad.id ? ad.id : `${ad.governorate}-${ad.createdAt}-${index}`}
                  ad={ad}
                />
              ))}                </div>

              ) : (
                <div className="rounded-[10px] border border-[#DBDBDB] bg-white px-6 py-10 text-center shadow-[0px_3px_25px_rgba(0,0,0,0.08)]">
                  <p className="text-[20px] font-semibold text-[#1F2430]">
                    لا توجد إعلانات طوارئ حالياً
                  </p>
                  <p className="mt-3 text-[16px] text-[#444444]">
                    ستظهر الإعلانات هنا تلقائياً بعد إضافتها من صفحة إدارة الإعلانات
                  </p>
                </div>
              )}
            </div>
        <div className="mt-24">
          <h2 className="text-right font-['Inter'] text-[32px] font-semibold leading-tight text-black">
            كيف تستجيب للإعلان ؟
          </h2>

          <div className="mt-7 grid grid-cols-1 gap-[24px] md:grid-cols-3 md:gap-[46px]">
            <ResponseCard
              icon={<Megaphone className="h-[27px] w-[27px] text-[#E02323]" />}
              title="توجه فوراً"
              description="توجه إلى أقرب بنك دم في محافظتك مع إثبات الشخصية"
            />

            <ResponseCard
              icon={<PhoneCall className="h-[27px] w-[27px] text-[#E02323]" />}
              title="تحقق من التفاصيل"
              description="تأكد من فصيلة الدم المطلوبة وموقع بنك الدم"
            />

            <ResponseCard
              icon={<Stethoscope className="h-[27px] w-[27px] text-[#E02323]" />}
              title="استعد للتبرع"
              description="احصل على قسط كاف من النوم وتناول وجبة خفيفة قبل التبرع"
            />
          </div>
        </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-10 items-center justify-center rounded-[10px] border border-[#FFCC00] bg-[rgba(255,204,0,0.2)] px-3">
                <span className="text-[14px] font-bold leading-6 text-[#905B5B]">
                الإعلانات النشطة: {activeCount}                </span>
              </div>
              
            </div>
              <div className="flex items-center gap-[8px]">
                <Clock3 className="h-4 w-4 text-[#E02323]" />
                <span className="text-[12px] text-[#444444]">
                  آخر تحديث:
                </span>
                <span className="text-[12px] font-bold text-black">
                  {toEnglishNumbers(lastUpdated)}
                </span>
              </div>   
            </div>       
                  </div>
                </section>
  );
}