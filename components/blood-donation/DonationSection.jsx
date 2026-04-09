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
    <section className="w-full px-4 py-20  md:px-6" dir="rtl">
      <div className="relative mx-auto w-full max-w-[1248px] bg-white px-6 py-[30px]  rounded-[10px] shadow-[0px_3px_25px_rgba(0,0,0,0.09)] overflow-hidden">

        {/* Ellipse الخلفية */}
        <div className="absolute right-[60px] bottom-[40px] h-[126px] w-[235px] bg-[#E02323] blur-[200px] opacity-60 z-0" />

        <div className="relative z-10 flex flex-col items-center gap-10">

          {/* الجزء العلوي */}
          <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-[67px]">

            {/* الصورة */}
            <div className="flex shrink-0 items-center justify-center">
              <div className="relative h-[320px] w-[320px] rounded-full overflow-hidden shadow-[0px_3px_25px_rgba(0,0,0,0.09)]">
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
            <div className="flex w-full max-w-[775px] flex-col items-end gap-4 text-right">

              <div className="flex w-full flex-col items-end gap-3">

                <p className="text-[16px] font-medium leading-6 tracking-[0.15px] text-black">
                  - يعبر شعار الموقع عن تعاون وتكاتف كل المصريين متمثلاً في علم
                  جمهورية مصر العربية في إنقاذ الأرواح بدمائهم في كل وقت وأي مكان
                  بالجمهورية.
                </p>

                <p className="text-[16px] font-medium leading-6 tracking-[0.15px] text-black">
                  - تحت مظلة وزارة الصحة المصرية وإشرافها الكامل، نعمل سوياً
                  لبناء شبكة أمان وطنية تضمن توفير الدم الآمن والسليم لكل محتاج.
                </p>

              </div>

              {/* البوكس الوردي */}
              <div className="flex w-full max-w-[757px] items-center justify-start gap-2 rounded-[8px] bg-[#FCF7F7] px-2 py-3 shadow-[0px_3px_25px_rgba(0,0,0,0.09)]">

                <span className="text-[18px]">🇪🇬</span>

                <p className="text-[16px] font-semibold leading-6 tracking-[0.15px] text-black">
                  مصر.. أرض الخير والعطاء، وشعبها قلب ينبض بالحياة لكل إنسان.
                </p>

              </div>

            </div>
          </div>

          {/* الأيقونات */}
          <div className="flex w-full max-w-[990px] flex-wrap items-center justify-between gap-y-8 px-6">

            {features.map((item, index) => (
              <div
                key={index}
                className="flex min-w-[120px] flex-col items-center gap-2 text-center"
              >
                <div className="relative h-[26px] w-[26px]">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-[16px] font-medium leading-6 tracking-[0.15px] text-black">
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