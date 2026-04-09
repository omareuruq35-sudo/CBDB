export function Donation() {
  return (
    <section className="py-20 bg-[#ffffff] flex justify-center items-center font-['Roboto',_sans-serif]" dir="rtl">
      {/* Frame 48096082 - الكارت الأساسي */}
      <div className="relative w-[1248px] h-auto min-h-[1173px] bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] px-[60px] py-[40px] flex flex-col items-start overflow-hidden">
        
        {/* Frame 48096092 - الـ Container الداخلي */}
        <div className="w-[1128px] flex flex-col items-center gap-[40px] self-stretch">
          
          {/* العنوان الرئيسي والخط الأحمر */}
          <div className="w-[617px] flex flex-col items-center gap-[4px]">
            <h2 className="w-full text-[40px] font-[600] leading-[73px] text-center tracking-[0.15px] text-black">
              التبرع بالدم: هدية الحياة
            </h2>
            <div className="w-[104px] border-[4px] border-[#E02323]"></div>
          </div>

          {/* منطقة البوستر */}
          <div className="relative w-[1128px] min-h-[976px] flex flex-col items-center gap-[40px] isolation-isolate">
            
            {/* البوستر الداخلي الأبيض */}
            <div className="relative w-full h-auto min-h-[906px] bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] p-[24px] flex flex-col items-center z-0">
              
              {/* صورة الخلفية (pattern.png) */}
              <div 
                className="absolute inset-[24px] rounded-[4px]"
                style={{
                  backgroundImage: "url('/pattern.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              {/* المحتوى الداخلي مع تعديل مساحات اللوجو */}
              <div className="relative z-10 flex flex-col items-center w-[680px] gap-[24px] pt-[40px]">
                
                {/* اللوجو - دلوقت داخل الخلفية وبمساحة كافية */}
                <div className="flex justify-center">
                  <img src="/log.png" className="w-[280px] h-[280px] object-contain" alt="Logo" />
                </div>

                {/* النصوص التعريفية - تم زيادة المسافات لضمان عدم التداخل */}
                <div className="flex flex-col items-center gap-[12px] w-full">
                  <p className="text-[32px] font-[600] leading-none text-center text-black">
                    تحت رعاية
                  </p>

                  <h3 className="text-[32px] font-[700] leading-[1.4] text-center text-black px-4">
                    الدكتور خالد عبدالغفار نائب رئيس مجلس الوزراء <br /> وزير الصحة و السكان
                  </h3>
                  
                  {/* الخط الأسود */}
                  <div className="w-[380px] border-[3px] border-black my-4"></div>

                  {/* النصوص الحمراء */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[40px] font-[900] leading-tight text-center text-[#E02323]">
                      قطاع الطب العلاجي
                    </p>
                    <p className="text-[40px] font-[900] leading-tight text-center text-[#E02323]">
                      الإدارة المركزية لعمليات الدم
                    </p>
                  </div>
                </div>

                {/* صورة القلب والدم */}
                <div className="mt-[30px] pb-[40px]">
                  <img 
                    src="/blood.png" 
                    className="w-[380px] h-auto object-contain" 
                    alt="Blood Icon" 
                  />
                </div>
              </div>
            </div>

            {/* الرسالة السفلية */}
            <p className="relative z-10 w-full text-[20px] font-[700] leading-[1.6] text-center text-black">
              كل قطرة دم تتبرع بها يمكن أن تكون سبباً في إنقاذ حياة إنسان تبرعك يعني الأمل، والعطاء، والحياة.
            </p>

            {/* الإضاءة الحمراء الخلفية */}
         {/* /*   <div className="absolute w-[235px] h-[126px] left-[956px] top-[842px] bg-[#E02323] blur-[150px] z-[2] opacity-30"></div> */}
          </div>
        </div>
      </div>
    </section>
  );
}