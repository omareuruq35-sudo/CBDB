import React from 'react';

// لاحظ هنا شلنا كلمة default وغيرنا الاسم لـ Compatibility
export function Compatibility() {
  return (
    <section className="py-20  bg-[#ffffff] flex justify-center items-center font-['Roboto',_sans-serif]" dir="rtl">
      <div className="relative w-[1248px] h-[503px] bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] p-[30px] flex flex-col items-center isolation-isolate overflow-hidden">
        
        <div className="w-full text-center mb-[40px] shrink-0 flex flex-col items-center gap-[4px]">
          <h2 className="text-[40px] font-[600] text-black leading-none">
            توافق فصائل الدم
          </h2>
          <div className="w-[104px] border-[4px] border-[#E02323]"></div>
        </div>

        <div className="w-[1188px] h-[326px] flex flex-row items-center justify-between gap-[117px] relative z-10">
          <div className="flex-1">
            <p className="text-[22px] font-[700] leading-[1.8] text-black text-right">
              - عند عملية نقل الدم، يجب أن تتوافق فصيلة دم المتبرع مع فصيلة دم المريض. يمكن للمريض تلقي الدم من متبرع من نفس فصيلته، أو من متبرع ذو فصيلة دم متوافقة أخرى كما يظهر في الجدول التالي:
            </p>
          </div>

          <div className="w-[500px] h-[326px] bg-white p-6 rounded-[12px] shadow-[0px_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 flex justify-center items-center shrink-0">
            <img 
              src="/blood-table.png" 
              alt="جدول توافق فصائل الدم"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div 
          className="absolute pointer-events-none"
          style={{
            width: '235px',
            height: '126px',
            right: '-18px', 
            top: '410px',   
            background: '#E02323',
            filter: 'blur(200px)', 
            zIndex: 1,
            opacity: 0.35 
          }}
        ></div>
      </div>
    </section>
  );
}