"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  Droplets,
  MapPin,
  CreditCard,
} from "lucide-react"
import { requestNotificationPermission } from "../../lib/notifications"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodType: "",
    governorate: "",
    nationalId: "",
  })

  const [nationalIdError, setNationalIdError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "nationalId") {
      const onlyNumbers = value.replace(/\D/g, "")

      setFormData({
        ...formData,
        [name]: onlyNumbers,
      })

      if (onlyNumbers.length > 0 && onlyNumbers.length !== 14) {
        setNationalIdError("الرقم القومي يجب أن يكون 14 رقم")
      } else {
        setNationalIdError("")
      }

      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.nationalId.length !== 14) {
      setNationalIdError("الرقم القومي يجب أن يكون 14 رقم")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("http://localhost:5000/api/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        alert(data.message || "حصل خطأ ❌")
        return
      }

      let notificationMessage = ""

      try {
        const notificationResult = await requestNotificationPermission()

        if (
          notificationResult.success &&
          notificationResult.token &&
          data?.donor?._id
        ) {
          const tokenRes = await fetch(
            `http://localhost:5000/api/donors/${data.donor._id}/notification-token`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fcmToken: notificationResult.token,
              }),
            }
          )

          if (tokenRes.ok) {
            notificationMessage = "\nتم تفعيل إشعارات الطوارئ بنجاح 🔔"
          } else {
            notificationMessage =
              "\nتم التسجيل، لكن لم يتم حفظ كود الإشعارات"
          }
        } else {
          notificationMessage = `\n${notificationResult.message}`
        }
      } catch (notificationError) {
        console.error("Notification error:", notificationError)
        notificationMessage =
          "\nتم التسجيل، لكن حدث خطأ أثناء تفعيل الإشعارات"
      }

      alert(`تم التسجيل بنجاح 🎉${notificationMessage}`)

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        bloodType: "",
        governorate: "",
        nationalId: "",
      })

      setNationalIdError("")
    } catch (error) {
      console.error(error)
      alert("حصل خطأ ❌")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-[#66666] px-4 py-5 md:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-[1000px] flex-col items-center">
        <div className="mb-10 mt-6 max-w-[507px] text-center">
          <h1 className="mb-4 text-[20px] font-extrabold text-black">
            أنقذ حياة.. تبرع بالدم
          </h1>

          <p className="text-[18px] font-medium text-[#444444] md:text-[20px] text-center">
            <span className="block">
              كل قطرة دم تتبرع بها يمكن أن تنقذ حياة إنسان
            </span>

            <span className="block mt-2">
              انضم إلى قاعدة المتبرعين وكن سببًا في إنقاذ الأرواح
            </span>
          </p>
        </div>

        <section
          className="
          w-full rounded-[30px] border border-[#E2E2E2] bg-[#FEFEFE]
          px-5 py-10 shadow-[0px_3px_30px_rgba(0,0,0,0.09)]
          md:px-10 md:py-12 lg:px-[38px]
          transition-all duration-300 ease-in-out
          hover:-translate-y-2 hover:scale-[1.01]
          hover:shadow-[0px_10px_40px_rgba(0,0,0,0.15)]
        "
        >
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-[26px] font-medium text-[#0E0E0E] md:text-[30px]">
              تسجيل بيانات متبرع جديد
            </h2>

            <p className="text-[15px] text-[#818181] md:text-[16px]">
              يرجى تعبئة النموذج أدناه للمساهمة في إنقاذ حياة المرضى
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[945px] space-y-5"
          >
            <FormField
              label="الاسم الرباعي"
              placeholder="ادخل الاسم الرباعي"
              icon={<User size={20} className="text-[#E02323]" />}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectField
                label="فصيلة الدم"
                icon={<Droplets size={20} className="text-[#E02323]" />}
                defaultOption="اختر فصيلة الدم"
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              />

              <FormField
                label="البريد الإلكتروني"
                placeholder="example@email.com"
                icon={<Mail size={20} className="text-[#E02323]" />}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectField
                label="المحافظة"
                icon={<MapPin size={20} className="text-[#E02323]" />}
                defaultOption="اختر المحافظة"
                options={[
                  "القاهرة",
                  "الجيزة",
                  "الإسكندرية",
                  "الدقهلية",
                  "البحر الأحمر",
                  "البحيرة",
                  "الفيوم",
                  "الغربية",
                  "الإسماعيلية",
                  "المنوفية",
                  "المنيا",
                  "القليوبية",
                  "الوادي الجديد",
                  "السويس",
                  "أسوان",
                  "أسيوط",
                  "بني سويف",
                  "بورسعيد",
                  "دمياط",
                  "الشرقية",
                  "جنوب سيناء",
                  "كفر الشيخ",
                  "مطروح",
                  "الأقصر",
                  "قنا",
                  "شمال سيناء",
                  "سوهاج",
                ]}
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
              />

              <FormField
                label="رقم الموبايل"
                placeholder="01*********"
                icon={<Phone size={20} className="text-[#E02323]" />}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-2 justify-start text-[16px] text-black">
                <span>
                  <CreditCard size={20} className="text-[#E02323]" />
                </span>
                <span>الرقم القومي</span>
              </label>

              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="14 رقم"
                maxLength={14}
                className="
                  h-12 w-full rounded-[10px] border border-[#818181]
                  px-4 text-right text-[16px] outline-none
                  placeholder:text-[#818181]
                  transition-all
                  focus:border-[#E02323]
                  focus:ring-2 focus:ring-[#E02323]/30
                "
              />

              {nationalIdError && (
                <p className="mt-1 text-right text-[14px] font-medium text-[#E02323]">
                  {nationalIdError}
                </p>
              )}
            </div>

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  h-[61px] w-full max-w-[260px] rounded-[10px]
                  bg-[#E02323] text-[18px] font-medium text-white
                  transition-all duration-300
                  hover:scale-[1.03] hover:shadow-lg
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {isSubmitting ? "جاري التسجيل..." : "تسجيل البيانات"}
              </button>

              <p className="mx-auto mt-4 max-w-[230px] text-[14px] text-black md:text-[16px]">
                * جميع الحقول إلزامية سيتم التواصل معك عند الحاجة لفصيلة دمك
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

function FormField({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
}: any) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="flex items-center gap-2 justify-start text-[16px] text-black">
        <span>{icon}</span>
        <span>{label}</span>
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-12 w-full rounded-[10px] border border-[#818181]
          px-4 text-right text-[16px] outline-none
          placeholder:text-[#818181]
          transition-all
          focus:border-[#E02323]
          focus:ring-2 focus:ring-[#E02323]/30
        "
      />
    </div>
  )
}

function SelectField({
  label,
  icon,
  defaultOption,
  options,
  name,
  value,
  onChange,
}: any) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="flex items-center gap-2 justify-start text-[16px] text-black">
        <span>{icon}</span>
        <span>{label}</span>
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          h-12 w-full rounded-[10px] border border-[#818181]
          px-4 text-right text-[16px] outline-none
          transition-all
          focus:border-[#E02323]
          focus:ring-2 focus:ring-[#E02323]/30
        "
      >
        <option value="" disabled>
          {defaultOption}
        </option>

        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
