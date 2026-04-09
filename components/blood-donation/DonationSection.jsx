import Image from "next/image"

export function DonationSection() {
  const features = [
    {
      title: "رعاية صحية شاملة",
      icon: "/icon1.png",
    },
    {
      title: "دماء تنقذ أرواح",
      icon: "/icon4.png",
    },
    {
      title: "تعاون وتكاتف",
      icon: "/icon3.png",
    },
    {
      title: "عطاء بلا حدود",
      icon: "/icon2.png",
    },
  ]

  return (
    <section className="w-full px-4 py-12 md:px-6 md:py-16" dir="rtl">
      
      <div className="relative mx-auto w-full max-w-[1100px] bg-white px-4 py-6 md:px-6 md:py-8 rounded-[10px] shadow-[0px_3px_25px_rgba(0,0,0,0.09)]">

        {/* التوهج الأحمر */}
        <div className="absolute right-[30px] md:right-[50px] bottom-[20px] md:bottom-[30px] h-[100px] w-[180px] md:h-[126px] md:w-[235px] bg-[#E02323] blur-[160px] md:blur-[200px] opacity-50 z-0" />

        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">

          {/* الجزء العلوي */}
          <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">

            {/* الصورة */}
            <div className="flex shrink-0 items-center justify-center">
              <div className="relative h-[220px] w-[220px] md:h-[260px] md:w-[260px] lg:h-[300px] lg:w-[300px] rounded-full overflow-hidden shadow-[0px_3px_25px_rgba(0,0,0,0.09)]">
                <Image
                  src="/logo.png"
                  alt="Central Blood Donation Bank"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* النص */}
            <div className="flex w-full max-w-[700px] flex-col items-end gap-4 text-right">

              <div className="flex w-full flex-col items-end gap-3">

                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-medium leading-7 tracking-[0.15px] text-black">
                  - يعبر شعار الموقع عن تعاون وتكاتف كل المصريين متمثلاً في علم
                  جمهورية مصر العربية في إنقاذ الأرواح بدمائهم في كل وقت وأي مكان
                  بالجمهورية.
                </p>

                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-medium leading-7 tracking-[0.15px] text-black">
                  - تحت مظلة وزارة الصحة المصرية وإشرافها الكامل، نعمل سوياً
                  لبناء شبكة أمان وطنية تضمن توفير الدم الآمن والسليم لكل محتاج.
                </p>

              </div>

              {/* البوكس الوردي */}
              <div className="flex w-full max-w-[720px] items-center justify-start gap-2 rounded-[8px] bg-[#FCF7F7] px-3 py-3 shadow-[0px_3px_25px_rgba(0,0,0,0.09)]">

                <span className="text-[16px] md:text-[18px]">🇪🇬</span>

                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold leading-7 tracking-[0.15px] text-black">
                  مصر.. أرض الخير والعطاء، وشعبها قلب ينبض بالحياة لكل إنسان.
                </p>

              </div>

            </div>
          </div>

          {/* الأيقونات */}
          <div className="flex w-full max-w-[920px] flex-wrap items-center justify-center md:justify-between gap-6 md:gap-y-8 px-2 md:px-4">

            {features.map((item, index) => (
              <div
                key={index}
                className="flex min-w-[110px] flex-col items-center gap-2 text-center"
              >
                <div className="relative h-[22px] w-[22px] md:h-[24px] md:w-[24px] lg:h-[26px] lg:w-[26px]">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-medium leading-6 tracking-[0.15px] text-black">
                  {item.title}
                </p>

              </div>
            ))}

          </div>

        </div>
      </div>

    </section>
  )
}