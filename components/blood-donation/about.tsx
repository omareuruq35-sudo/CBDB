import React from "react";

export function About() {
  return (
    <section
      className="w-full flex justify-center mt-16 md:mt-24 py-12 md:py-16 relative font-['Roboto']"
      dir="rtl"
    >

      <div className="w-full max-w-[1100px] bg-white rounded-[12px] shadow-[0px_3px_25px_rgba(0,0,0,0.1)] px-4 sm:px-6 md:px-10 py-6 md:py-8 relative overflow-hidden">

        {/* العنوان */}
        <div className="flex flex-col items-center mb-8 md:mb-10">

          <h2 className="text-[26px] md:text-[32px] lg:text-[36px] font-semibold text-black text-center leading-[1.4]">
            فكرة إنشاء البنك المركزي للتبرع بالدم
          </h2>

          <div className="w-[90px] md:w-[110px] h-[3px] md:h-[4px] bg-[#E02323] mt-3 md:mt-4 rounded"></div>

        </div>

        {/* النص */}
        <div className="text-right space-y-4 md:space-y-5 text-[14px] md:text-[16px] lg:text-[18px] leading-[1.9]">

          <p>
            - نشأت فكرة البنك المركزي للتبرع بالدم بناءً على عدة احتياجات مهمة وهي:
          </p>

          <p>
            - إحتياج بعض العمليات الكبيرة والمعقدة مثل عملية القلب المفتوح إلى دم لم
            يسبق له التجميد أو فصل مكوناته من البلازما وكرات الدم البيضاء والحمراء.
          </p>

          <p>
            - حالات حوادث الطرق والقطارات التي تحتاج إلى عدد كبير من المتبرعين أصحاب
            الصحة الجيدة والخالين من أي أمراض وجاهزين للتبرع.
          </p>

          <p>
            - غالبية حوادث الطرق والقطارات تكون في أماكن بعيدة عن ذويهم المستعدين
            لإنقاذ أرواحهم بدمائهم.
          </p>

          <p>
            - النظام المتبع في بنوك الدم المصرية هو إخراج كيس مقابل كيس آخر يدخل
            للبنك مكانه.
          </p>

          <p>
            - لا يتوفر معارف أو أقارب بجانب المتعرض للحادث، ولا يمكن توفير عدد من
            الأقارب والمعارف المتعافين للتبرع لأصحاب العمليات المعقدة.
          </p>

          <p>
            - ومن هنا يوفر البنك بيانات أفراد في صحة جيدة ومتوافقين مع شروط التبرع
            ومستعدين للتبرع عند الحاجة إلى تبرعهم، فقط عند الحاجة إلى مساعدتهم.
          </p>

        </div>

        {/* الفوتر */}
        <div className="text-center mt-10 md:mt-12">

          <p className="italic text-[16px] md:text-[18px] lg:text-[20px] font-semibold">
            "معاً ننقذ حياة.. معاً نبني أمل"
          </p>

          <p className="italic text-gray-500 mt-2 text-sm md:text-base">
            البنك المركزي المصري للتبرع بالدم
          </p>

        </div>

        {/* التوهج الأحمر */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "180px",
            height: "100px",
            background: "#E02323",
            filter: "blur(160px)",
            right: "10px",
            bottom: "10px",
            opacity: 0.3
          }}
        ></div>

      </div>

    </section>
  );
}