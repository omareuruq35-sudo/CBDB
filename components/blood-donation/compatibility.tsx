import React from 'react';

export function Compatibility() {
  return (
    <section
      className="py-12 md:py-16 bg-[#ffffff] flex justify-center items-center font-['Roboto',_sans-serif]"
      dir="rtl"
    >
      <div className="relative w-full max-w-[1100px] bg-white shadow-[0px_3px_25px_rgba(0,0,0,0.09)] rounded-[8px] px-4 sm:px-6 md:px-8 py-6 md:py-8 flex flex-col items-center isolation-isolate">
        
        <div className="w-full text-center mb-6 md:mb-8 shrink-0 flex flex-col items-center gap-[4px]">
          <h2 className="text-[28px] md:text-[34px] lg:text-[38px] font-[600] text-black leading-none">
            توافق فصائل الدم
          </h2>
          <div className="w-[90px] md:w-[104px] border-[3px] md:border-[4px] border-[#E02323]"></div>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12 relative z-10">
          <div className="flex-1 w-full">
            <p className="text-[18px] md:text-[20px] lg:text-[22px] font-[700] leading-[1.8] text-black text-right">
              - عند عملية نقل الدم، يجب أن تتوافق فصيلة دم المتبرع مع فصيلة دم المريض.
              يمكن للمريض تلقي الدم من متبرع من نفس فصيلته، أو من متبرع ذو فصيلة دم
              متوافقة أخرى كما يظهر في الجدول التالي:
            </p>
          </div>

          <div className="w-full max-w-[500px] bg-white p-4 md:p-5 rounded-[12px] shadow-[0px_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 flex justify-center items-center shrink-0">
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
            width: '180px',
            height: '100px',
            right: '-10px',
            bottom: '-20px',
            background: '#E02323',
            filter: 'blur(160px)',
            zIndex: 1,
            opacity: 0.3
          }}
        ></div>
      </div>
    </section>
  );
}