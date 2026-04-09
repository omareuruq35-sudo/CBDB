import React from 'react';

export function Hero() {
  return (
    <section
      className="relative w-full flex justify-center items-center bg-white py-20  overflow-hidden font-['Alexandria',_sans-serif]"
      dir="rtl"
    >
      <div className="relative w-[1248px] h-[420px] flex items-center justify-between">

        {/* الصورة - يمين */}
        <div className="relative w-[660px] h-[420px] flex justify-center items-center">

          {/* التوهج الأحمر */}
          <div
            className="absolute"
            style={{
              width: "374px",
              height: "184px",
              background: "#EC7979",
              filter: "blur(300px)",
              top: "57px",
              left: "200px",
              zIndex: 0,
            }}
          ></div>

          <img
            src="/handblood.png"
            alt="Blood Donation"
            className="w-[660px] h-[420px] object-contain relative z-10 mix-blend-multiply"
          />
        </div>

        {/* النص - شمال */}
      <div className="w-[548px] text-right">

  <h1 className="text-[54px] leading-[73px] tracking-[0.15px] text-black">

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