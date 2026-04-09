import React from 'react';

export function Hero() {
  return (
    <section
      className="relative w-full flex justify-center items-center bg-white py-12  md:py-16 overflow-hidden font-['Alexandria',_sans-serif]"
      dir="rtl"
    >
      <div className="relative w-full max-w-[1100px] flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-10 px-4 sm:px-6">

        {/* الصورة */}
        <div className="relative w-full max-w-[560px] flex justify-center items-center">

          <div
            className="absolute"
            style={{
              width: "280px",
              height: "140px",
              background: "#EC7979",
              filter: "blur(220px)",
              top: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          ></div>

          <img
            src="/handblood.png"
            alt="Blood Donation"
            className="w-full max-w-[560px] h-auto object-contain relative z-10 mix-blend-multiply"
          />
        </div>

        {/* النص */}
        <div className="w-full max-w-[500px] text-right">
          <h1 className="text-[30px] md:text-[40px] lg:text-[48px] leading-[1.5] tracking-[0.15px] text-black">

            <span className="font-[700] block">
              منصة مركزية لتنظيم
            </span>

            <span className="block">
              <span className="font-[700]">وإدارة</span>
              <span className="font-light"> التبرع بالدم</span>
            </span>

            <span className="font-light block">
              وفقًا للمعايير الصحية
            </span>

            <span className="font-light block">
              المعتمدة
            </span>

          </h1>
        </div>

      </div>
    </section>
  );
}