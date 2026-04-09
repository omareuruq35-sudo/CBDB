export function Donation() {
  return (
    <section
      className="bg-[#ffffff] py-12 md:py-16 flex justify-center font-['Roboto',_sans-serif]"
      dir="rtl"
    >
      <div className="w-full max-w-[1100px] bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] px-4 sm:px-6 md:px-10 py-6 md:py-8 flex flex-col items-start">
        <div className="w-full flex flex-col items-center gap-6 md:gap-8 self-stretch">
          <div className="w-full max-w-[560px] flex flex-col items-center gap-1">
            <h2 className="w-full text-[28px] md:text-[34px] lg:text-[38px] font-[600] leading-[1.5] text-center tracking-[0.15px] text-black">
              التبرع بالدم: هدية الحياة
            </h2>
            <div className="w-[90px] md:w-[104px] border-[3px] md:border-[4px] border-[#E02323]"></div>
          </div>

          <div className="relative w-full flex flex-col items-center gap-6 md:gap-8 isolation-isolate">
            <div className="relative w-full bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] p-4 md:p-6 flex flex-col items-center z-0">
              <div
                className="absolute inset-4 md:inset-6 rounded-[4px]"
                style={{
                  backgroundImage: "url('/pattern.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="relative z-10 flex flex-col items-center w-full max-w-[680px] gap-5 md:gap-6 pt-6 md:pt-10">
                <div className="flex justify-center">
                  <img
                    src="/log.png"
                    className="w-[180px] md:w-[220px] lg:w-[260px] h-auto object-contain"
                    alt="Logo"
                  />
                </div>

                <div className="flex flex-col items-center gap-3 w-full">
                  <p className="text-[24px] md:text-[28px] font-[600] leading-none text-center text-black">
                    تحت رعاية
                  </p>

                  <h3 className="text-[22px] md:text-[28px] lg:text-[30px] font-[700] leading-[1.5] text-center text-black px-2 md:px-4">
                    الدكتور خالد عبدالغفار نائب رئيس مجلس الوزراء
                    <br />
                    وزير الصحة و السكان
                  </h3>

                  <div className="w-full max-w-[380px] border-[2px] md:border-[3px] border-black my-3 md:my-4"></div>

                  <div className="flex flex-col items-center gap-1 md:gap-2">
                    <p className="text-[28px] md:text-[34px] lg:text-[38px] font-[900] leading-tight text-center text-[#E02323]">
                      قطاع الطب العلاجي
                    </p>
                    <p className="text-[28px] md:text-[34px] lg:text-[38px] font-[900] leading-tight text-center text-[#E02323]">
                      الإدارة المركزية لعمليات الدم
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 pb-4 md:pb-8">
                  <img
                    src="/blood.png"
                    className="w-[220px] md:w-[300px] lg:w-[360px] h-auto object-contain"
                    alt="Blood Icon"
                  />
                </div>
              </div>
            </div>

            <p className="relative z-10 w-full text-[16px] md:text-[18px] lg:text-[20px] font-[700] leading-[1.8] text-center text-black px-2">
              كل قطرة دم تتبرع بها يمكن أن تكون سبباً في إنقاذ حياة إنسان تبرعك
              يعني الأمل، والعطاء، والحياة.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}