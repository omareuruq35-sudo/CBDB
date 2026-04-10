"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Droplets,
  MapPin,
  Search,
  User,
  CreditCard,
  BarChart3,
  Users,
  Clock3,
  Check,
  Circle,
  Phone,
  Trash2,
} from "lucide-react"

type Donor = {
  _id: string
  fullName: string
  email: string
  phone: string
  bloodType: string
  governorate: string
  nationalId: string
  donationCount?: number
  lastDonationDate?: string | null
  notes?: string
  createdAt?: string
}

export default function SiteDataPage() {
  const router = useRouter()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingSelected, setDeletingSelected] = useState(false)
  const [selectedDonors, setSelectedDonors] = useState<string[]>([])

  const [filters, setFilters] = useState({
    governorate: "جميع المحافظات",
    bloodType: "جميع الفصائل",
    fullName: "",
    nationalId: "",
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("employeeLoggedIn") === "true"

    if (!isLoggedIn) {
      router.replace("/login")
      return
    }

    setIsAuthorized(true)
    setAuthChecking(false)
  }, [router])

  useEffect(() => {
    if (!isAuthorized) return

const fetchDonors = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/donors")

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const text = await res.text()
    console.log("RAW DONORS RESPONSE:", text)
    setDonors([])
    return
  } catch (error) {
    console.error("Error fetching donors:", error)
    setDonors([])
  } finally {
    setLoading(false)
  }
}
    fetchDonors()
  }, [isAuthorized])

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchGovernorate =
        filters.governorate === "جميع المحافظات" ||
        donor.governorate === filters.governorate

      const matchBloodType =
        filters.bloodType === "جميع الفصائل" ||
        donor.bloodType === filters.bloodType

      const matchName = donor.fullName
        .toLowerCase()
        .includes(filters.fullName.toLowerCase())

      const matchNationalId = donor.nationalId.includes(filters.nationalId)

      return (
        matchGovernorate &&
        matchBloodType &&
        matchName &&
        matchNationalId
      )
    })
  }, [donors, filters])

  const totalDonors = donors.length

  const neverDonated = donors.filter(
    (donor) => !donor.donationCount || donor.donationCount === 0
  ).length

  const moreThanThree = donors.filter(
    (donor) => (donor.donationCount || 0) > 3
  ).length

  const donatedThisWeek = donors.filter((donor) => {
    if (!donor.lastDonationDate) return false

    const donationDate = new Date(donor.lastDonationDate)
    const now = new Date()
    const diff = now.getTime() - donationDate.getTime()
    const days = diff / (1000 * 60 * 60 * 24)

    return days <= 7
  }).length

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const handleDeleteDonor = async (id: string) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المتبرع؟")
    if (!confirmDelete) return

    try {
      setDeletingId(id)

const res = await fetch(`http://localhost:5000/api/donors/${id}`, {
  method: "DELETE",
})

let data = null

try {
  data = await res.json()
} catch {
  data = null
}

if (!res.ok) {
  alert(data?.message || "حدث خطأ أثناء الحذف")
  return
}
      setDonors((prev) => prev.filter((donor) => donor._id !== id))
      setSelectedDonors((prev) => prev.filter((donorId) => donorId !== id))
      window.dispatchEvent(new Event("donorsUpdated"))
      alert("تم حذف المتبرع بنجاح")
    } catch (error) {
      console.error("Delete error:", error)
      alert("حدث خطأ أثناء الحذف")
    } finally {
      setDeletingId(null)
    }
  }

  const handleSelectDonor = (id: string) => {
    setSelectedDonors((prev) =>
      prev.includes(id)
        ? prev.filter((donorId) => donorId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const filteredIds = filteredDonors.map((donor) => donor._id)

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) => selectedDonors.includes(id))

    if (allSelected) {
      setSelectedDonors((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      )
    } else {
      const merged = Array.from(new Set([...selectedDonors, ...filteredIds]))
      setSelectedDonors(merged)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedDonors.length === 0) {
      alert("حدد متبرع واحد على الأقل")
      return
    }

    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف المتبرعين المحددين؟"
    )
    if (!confirmDelete) return

    try {
      setDeletingSelected(true)

      await Promise.all(
        selectedDonors.map((id) =>
          fetch(`http://localhost:5000/api/donors/${id}`, {
            method: "DELETE",
          })
        )
      )

      setDonors((prev) =>
        prev.filter((donor) => !selectedDonors.includes(donor._id))
      )
      setSelectedDonors([])
      window.dispatchEvent(new Event("donorsUpdated"))
      alert("تم حذف المتبرعين المحددين بنجاح")
    } catch (error) {
      console.error("Bulk delete error:", error)
      alert("حدث خطأ أثناء حذف المتبرعين المحددين")
    } finally {
      setDeletingSelected(false)
    }
  }

  const formatLastDonation = (date?: string | null) => {
    if (!date) return "لم يتبرع بعد"
    return new Date(date).toLocaleDateString("ar-EG")
  }

  const allFilteredSelected =
    filteredDonors.length > 0 &&
    filteredDonors.every((donor) => selectedDonors.includes(donor._id))

  if (authChecking || !isAuthorized) {
    return (
      <main className="min-h-screen bg-[#66666]" dir="rtl">
        <div className="px-4 pb-10 pt-[120px] md:px-6">
          <div className="mx-auto max-w-[1300px]">
            <div className="rounded-[16px] bg-white p-8 text-center shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
              جاري التحقق من صلاحية الدخول...
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#66666]" dir="rtl">
      <div className="px-4 pb-10 pt-[120px] md:px-6">
        <div className="mx-auto max-w-[1300px] space-y-6">
          <section className="rounded-[16px] bg-white p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] transition hover:shadow-[0px_14px_36px_rgba(0,0,0,0.16)]">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-[rgba(233,168,168,0.62)]">
                <Search size={24} className="text-[#E02323]" />
              </div>

              <div>
                <h2 className="text-[22px] font-bold text-black md:text-[24px]">
                  بحث متقدم عن المتبرعين
                </h2>
                <p className="mt-1 text-[15px] font-medium text-[#818181] md:text-[16px]">
                  ابحث عن المتبرعين باستخدام الفلاتر المختلفة
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FilterSelect
                name="governorate"
                value={filters.governorate}
                onChange={handleFilterChange}
                label="المحافظة"
                icon={<MapPin size={18} className="text-[#E02323]" />}
                options={[
                  "جميع المحافظات",
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
              />

              <FilterSelect
                name="bloodType"
                value={filters.bloodType}
                onChange={handleFilterChange}
                label="فصيلة الدم"
                icon={<Droplets size={18} className="text-[#E02323]" />}
                options={[
                  "جميع الفصائل",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <FilterInput
                name="fullName"
                value={filters.fullName}
                onChange={handleFilterChange}
                label="الاسم"
                icon={<User size={18} className="text-[#E02323]" />}
                placeholder="بحث بالاسم"
              />

              <FilterInput
                name="nationalId"
                value={filters.nationalId}
                onChange={handleFilterChange}
                label="الرقم القومي"
                icon={<CreditCard size={18} className="text-[#E02323]" />}
                placeholder="14 رقم"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#E02323] px-6 text-[18px] font-bold text-white transition hover:scale-[1.02] hover:shadow-lg md:w-[146px]">
                <Search size={20} />
                بحث
              </button>

              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#818181]">
                <BarChart3 size={18} className="text-[#E02323]" />
                إجمالي النتائج : {filteredDonors.length}
              </div>
            </div>
          </section>

          <section className="rounded-[16px] bg-white p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] transition hover:shadow-[0px_14px_36px_rgba(0,0,0,0.16)]">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-[rgba(233,168,168,0.62)]">
                  <Users size={24} className="text-[#E02323]" />
                </div>

                <div>
                  <h2 className="text-[22px] font-bold text-black md:text-[24px]">
                    قائمة المتبرعين
                  </h2>
                  <p className="mt-1 text-[15px] font-medium text-[#818181] md:text-[16px]">
                    إدارة وتعديل بيانات المتبرعين المسجلين
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-3 text-[17px] text-black">
                  <span>تحديد الكل</span>
                  <input
                    type="checkbox"
                    className="h-[20px] w-[20px]"
                    checked={allFilteredSelected}
                    onChange={handleSelectAll}
                  />
                </label>

                <button
                  onClick={handleDeleteSelected}
                  disabled={deletingSelected || selectedDonors.length === 0}
                  className="flex items-center gap-2 rounded-[12px] border border-[#E02323] px-4 py-2 text-[15px] font-medium text-[#E02323] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deletingSelected ? "جارٍ الحذف..." : "حذف المحدد"}
                </button>
              </div>
            </div>

            <div className="mb-4 hidden rounded-[10px] border border-[rgba(208,207,206,0.2)] bg-[rgba(208,207,206,0.15)] px-4 py-4 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_190px] lg:items-center">
              <span className="font-semibold text-black">المتبرع</span>
              <span className="font-semibold text-black">فصيلة الدم</span>
              <span className="font-semibold text-black">الموقع</span>
              <span className="font-semibold text-black">آخر تبرع</span>
              <span className="font-semibold text-black">سجل التبرعات</span>
              <span className="font-semibold text-black">الاتصال</span>
              <span className="font-semibold text-black">الإجراءات</span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="py-6 text-center text-[16px] text-[#818181]">
                  جاري تحميل البيانات...
                </p>
              ) : filteredDonors.length === 0 ? (
                <p className="py-6 text-center text-[16px] text-[#818181]">
                  لا يوجد متبرعين مطابقين للبحث
                </p>
              ) : (
                filteredDonors.map((donor) => (
                  <DonorRow
                    key={donor._id}
                    donor={donor}
                    formatLastDonation={formatLastDonation}
                    onDelete={handleDeleteDonor}
                    deleting={deletingId === donor._id}
                    checked={selectedDonors.includes(donor._id)}
                    onSelect={handleSelectDonor}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-[16px] bg-white p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] transition hover:shadow-[0px_14px_36px_rgba(0,0,0,0.16)]">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-[rgba(233,168,168,0.62)]">
                <BarChart3 size={24} className="text-[#E02323]" />
              </div>

              <div>
                <h2 className="text-[22px] font-bold text-black md:text-[24px]">
                  إحصائيات البحث
                </h2>
                <p className="mt-1 text-[16px] font-medium text-[#818181]">
                  تحليل بيانات المتبرعين
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Users size={22} className="text-[#E02323]" />}
                iconBg="bg-[rgba(233,168,168,0.21)]"
                value={String(totalDonors)}
                label="إجمالي المتبرعين"
              />

              <StatCard
                icon={<Circle size={18} className="text-[#818181]" />}
                iconBg="bg-[rgba(217,217,217,0.24)]"
                value={String(neverDonated)}
                label="لم يتبرعوا بعد"
              />

              <StatCard
                icon={<Check size={22} className="text-[#9CD256]" />}
                iconBg="bg-[rgba(206,237,197,0.3)]"
                value={String(moreThanThree)}
                label="أكثر من 3 تبرعات"
              />

              <StatCard
                icon={<Clock3 size={22} className="text-[#2DB5EF]" />}
                iconBg="bg-[rgba(195,226,229,0.35)]"
                value={String(donatedThisWeek)}
                label="آخر تبرع خلال أسبوع"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function FilterInput({
  label,
  icon,
  placeholder,
  name,
  value,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  placeholder: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-[16px] font-semibold text-[#818181]">
        <span>{icon}</span>
        <span>{label}</span>
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[48px] rounded-[10px] border border-[#818181] bg-white px-4 text-right text-[15px] outline-none placeholder:text-[rgba(129,129,129,0.69)] transition focus:border-[#E02323] focus:ring-2 focus:ring-[#E02323]/20"
      />
    </div>
  )
}

function FilterSelect({
  label,
  icon,
  options,
  name,
  value,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  options: string[]
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-[16px] font-semibold text-[#818181]">
        <span>{icon}</span>
        <span>{label}</span>
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-[48px] rounded-[10px] border border-[#818181] bg-[rgba(208,207,206,0.29)] px-4 text-right text-[15px] outline-none transition focus:border-[#E02323] focus:ring-2 focus:ring-[#E02323]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function DonorRow({
  donor,
  formatLastDonation,
  onDelete,
  deleting,
  checked,
  onSelect,
}: {
  donor: Donor
  formatLastDonation: (date?: string | null) => string
  onDelete: (id: string) => void
  deleting: boolean
  checked: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div className="rounded-[12px] border border-[#ececec] p-4 transition hover:shadow-md">
      <div className="grid gap-4 lg:grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_190px] lg:items-center">
        <div className="flex justify-start lg:justify-center">
          <input
            type="checkbox"
            className="h-[20px] w-[20px]"
            checked={checked}
            onChange={() => onSelect(donor._id)}
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] bg-[rgba(208,207,206,0.50)]">
            <User size={20} className="text-[#818181]" />
          </div>

          <div>
            <h3 className="text-[17px] font-medium text-black">
              {donor.fullName}
            </h3>
            <p className="mt-1 text-[15px] text-[#818181]">{donor.nationalId}</p>
            <p className="mt-1 text-[15px] text-[#818181]">{donor.email}</p>
            <p className="mt-2 text-[11px] text-[rgba(129,129,129,0.55)]">
              تم التسجيل في{" "}
              {donor.createdAt
                ? new Date(donor.createdAt).toLocaleDateString("ar-EG")
                : "-"}
            </p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-[20px] bg-[rgba(233,168,168,0.62)] px-4 py-2 text-[17px] font-medium text-black">
            <Droplets size={18} className="text-[#E02323]" />
            {donor.bloodType}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[17px] text-[#818181]">
          <MapPin size={18} className="text-[#E02323]" />
          {donor.governorate}
        </div>

        <div className="flex items-center gap-2 text-[17px] text-[#818181]">
          <Clock3 size={18} className="text-[#818181]" />
          {formatLastDonation(donor.lastDonationDate)}
        </div>

        <div className="text-[17px] text-black">
          {donor.donationCount || 0} مرات
        </div>

        <div className="flex items-center gap-2 text-[15px] text-[#818181]">
          <Phone size={16} className="text-[#E02323]" />
          {donor.phone}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/site-data/edit/${donor._id}`}
            className="rounded-[10px] border border-[rgba(0,0,0,0.2)] px-3 py-2 text-[15px] text-[#818181] transition hover:bg-[#f8f8f8]"
          >
            تعديل
          </Link>

          <Link
            href={`/site-data/add-donation/${donor._id}`}
            className="rounded-[10px] bg-[#E02323] px-3 py-2 text-[15px] text-white transition hover:opacity-90"
          >
            تبرع
          </Link>

          <button
            onClick={() => onDelete(donor._id)}
            disabled={deleting}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#E02323] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <span className="text-[11px]">...</span>
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>

      {donor.notes && (
        <div className="mt-3 text-[15px] text-[#818181]">
          ! {donor.notes}
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode
  iconBg: string
  value: string
  label: string
}) {
  return (
    <div className="rounded-[12px] border border-[rgba(129,129,129,0.3)] bg-white p-4 shadow-[0px_8px_22px_rgba(0,0,0,0.08)] transition hover:shadow-[0px_12px_28px_rgba(0,0,0,0.14)]">
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-[8px] ${iconBg}`}
        >
          {icon}
        </div>

        <span className="text-[36px] font-bold text-black">{value}</span>
      </div>

      <p className="text-[20px] font-semibold text-[#818181]">{label}</p>
    </div>
  )
}