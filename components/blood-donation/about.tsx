import React from "react";

export function About() {
  return (
    <section className="w-full flex justify-center mt-32 py-20 pt-5  relative font-['Roboto']" dir="rtl">

      {/* الكارت */}
      <div className="w-[1248px] bg-white rounded-[12px] shadow-[0px_3px_25px_rgba(0,0,0,0.1)] px-16 py-12 relative overflow-hidden">

        {/* العنوان */}
        <div className="flex flex-col items-center mb-12">

          <h2 className="text-[42px] font-semibold text-black text-center">
            فكرة إنشاء البنك المركزي للتبرع بالدم
          </h2>

          <div className="w-[120px] h-[4px] bg-[#E02323] mt-4 rounded"></div>

        </div>

        {/* النص */}
        <div className="text-right space-y-6 text-[18px] leading-[2]">

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
        <div className="text-center mt-14">

          <p className="italic text-[20px] font-semibold">
            "معاً ننقذ حياة.. معاً نبني أمل"
          </p>

          <p className="italic text-gray-500 mt-2">
            البنك المركزي المصري للتبرع بالدم
          </p>

        </div>

        {/* التوهج الأحمر */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "235px",
            height: "126px",
            background: "#E02323",
            filter: "blur(200px)",
            right: "20px",
            bottom: "20px",
            opacity: 0.4
          }}
        ></div>

      </div>

    </section>
  );
}