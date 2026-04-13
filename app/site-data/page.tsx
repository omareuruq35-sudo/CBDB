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
  X,
  CalendarDays,
  Plus,
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
  source?: "user" | "employee"
}

type AddDonorForm = {
  fullName: string
  nationalId: string
  phone: string
  email: string
  governorate: string
  bloodType: string
  notes: string
}

const initialAddDonorForm: AddDonorForm = {
  fullName: "",
  nationalId: "",
  phone: "",
  email: "",
  governorate: "",
  bloodType: "",
  notes: "",
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

  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [currentDonor, setCurrentDonor] = useState<Donor | null>(null)
  const [creatingDonor, setCreatingDonor] = useState(false)
  const [addDonorForm, setAddDonorForm] =
    useState<AddDonorForm>(initialAddDonorForm)
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [donationNotes, setDonationNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"donate" | "edit">("donate");
  const [employeeName, setEmployeeName] = useState("");
  const [filters, setFilters] = useState({
    governorate: "جميع المحافظات",
    bloodType: "جميع الفصائل",
    fullName: "",
    nationalId: "",
  })

  useEffect(() => {
const isLoggedIn = sessionStorage.getItem("employeeLoggedIn") === "true"
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

        const data = await res.json()
        setDonors(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching donors:", error)
        setDonors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [isAuthorized])

  useEffect(() => {
    const handleOpenModal = () => {
      setAddDonorForm(initialAddDonorForm)
      setShowAddDonorModal(true)
    }

    window.addEventListener("openAddDonorModal", handleOpenModal)

    return () => {
      window.removeEventListener("openAddDonorModal", handleOpenModal)
    }
  }, [])

  useEffect(() => {
    if (!showAddDonorModal) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showAddDonorModal])

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchGovernorate =
        filters.governorate === "جميع المحافظات" ||
        donor.governorate === filters.governorate

      const matchBloodType =
        filters.bloodType === "جميع الفصائل" ||
        donor.bloodType === filters.bloodType

      const matchName = (donor.fullName || "")
        .toLowerCase()
        .includes(filters.fullName.toLowerCase())

      const matchNationalId = (donor.nationalId || "").includes(
        filters.nationalId
      )

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

  const handleAddDonorInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setAddDonorForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const closeAddDonorModal = () => {
    if (creatingDonor) return
    setShowAddDonorModal(false)
    setAddDonorForm(initialAddDonorForm)
  }

  const handleCreateDonor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!addDonorForm.fullName.trim()) {
      alert("من فضلك أدخل الاسم رباعي")
      return
    }

    if (!/^\d{14}$/.test(addDonorForm.nationalId.trim())) {
      alert("الرقم القومي يجب أن يكون 14 رقم")
      return
    }

    if (!/^01[0125]\d{8}$/.test(addDonorForm.phone.trim())) {
      alert("رقم الهاتف غير صحيح")
      return
    }

    if (!addDonorForm.email.trim()) {
      alert("من فضلك أدخل البريد الإلكتروني")
      return
    }

    if (!addDonorForm.governorate.trim()) {
      alert("من فضلك اختر المحافظة")
      return
    }

    if (!addDonorForm.bloodType.trim()) {
      alert("من فضلك اختر فصيلة الدم")
      return
    }

    try {
      setCreatingDonor(true)

      const payload = {
        fullName: addDonorForm.fullName.trim(),
        nationalId: addDonorForm.nationalId.trim(),
        phone: addDonorForm.phone.trim(),
        email: addDonorForm.email.trim(),
        governorate: addDonorForm.governorate.trim(),
        bloodType: addDonorForm.bloodType.trim(),
        notes: addDonorForm.notes.trim(),
        source: "employee",
      }

      const res = await fetch("http://localhost:5000/api/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      let data: { donor?: Donor; message?: string } | null = null

      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (!res.ok) {
        alert(data?.message || "حدث خطأ أثناء تسجيل المتبرع")
        return
      }

      const newDonor = data?.donor

      if (!newDonor) {
        alert("تم الحفظ لكن بيانات المتبرع لم ترجع بشكل صحيح")
        return
      }

      setDonors((prev) => [newDonor, ...prev])
      setShowAddDonorModal(false)
      setAddDonorForm(initialAddDonorForm)
      window.dispatchEvent(new Event("donorsUpdated"))
      alert("تم تسجيل المتبرع بنجاح")
    } catch (error) {
      console.error("Create donor error:", error)
      alert("حدث خطأ أثناء تسجيل المتبرع")
    } finally {
      setCreatingDonor(false)
    }
    
  };
  const handleDonateSubmit = async () => {
    if (!currentDonor) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/donors/${currentDonor._id}/donate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationDate: donationDate,
          notes: donationNotes,
        }),
      });

      if (res.ok) {
        alert("تم تسجيل التبرع بنجاح ✅");
        setShowDonationModal(false);
        setDonationNotes(""); 
        window.location.reload(); 
      } else {
        const errorData = await res.json();
        alert(errorData.message || "حدث خطأ أثناء تسجيل التبرع");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
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
    <>
      <main className="min-h-screen bg-[#66666]" dir="rtl">
          <div
            className={`px-4 pb-10 pt-[120px] md:px-6 ${
             (showAddDonorModal || showEditModal || showDonationModal) ? "pointer-events-none select-none" : ""
           }`}
        >
          <div
             className={`mx-auto max-w-[1300px] space-y-6 transition duration-300 ${
              (showAddDonorModal || showEditModal || showDonationModal) ? "blur-[6px]" : ""
           }`}
       >
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
                      setShowEditModal={setShowEditModal}
                      setShowDonationModal={setShowDonationModal}
                      setCurrentDonor={setCurrentDonor}
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

      {showAddDonorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-3 py-6 backdrop-blur-[6px] animate-in fade-in duration-300">
          <div className="relative max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-[15px] border border-[#E2E2E2] bg-[#FEFEFE] shadow-[0px_3px_30px_rgba(0,0,0,0.09)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="relative flex min-h-[115px] items-center justify-center rounded-t-[15px] border-b border-[rgba(129,129,129,0.16)] bg-[rgba(240,240,240,0.12)] px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.06)]">
              <h2 className="text-center text-[28px] font-semibold text-black md:text-[36px]">
                تسجيل متبرع جديد
              </h2>

              <button
                type="button"
                onClick={closeAddDonorModal}
                disabled={creatingDonor}
                className="absolute right-4 top-1/2 flex h-[47px] w-[47px] -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(217,217,217,0.46)] transition hover:scale-105 disabled:cursor-not-allowed"
              >
                <X size={29} className="text-[#626262]" strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleCreateDonor}>
              <div className="px-4 pb-5 pt-5 md:px-6">
                <div className="rounded-[20px] border border-[rgba(129,129,129,0.31)] px-4 py-5 md:px-6 md:py-6">
                  <h3 className="mb-6 text-right text-[22px] font-semibold text-black md:text-[26px]">
                    بيانات المتبرع الجديد
                  </h3>

                  <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                    <ModalField
                      label="الاسم رباعي *"
                      name="fullName"
                      value={addDonorForm.fullName}
                      onChange={handleAddDonorInputChange}
                      placeholder=""
                    />

                    <ModalField
                      label="الرقم القومي (14 رقم) *"
                      name="nationalId"
                      value={addDonorForm.nationalId}
                      onChange={handleAddDonorInputChange}
                      placeholder="14 رقم بدون مسافات"
                      hint="يجب أن يكون 14 رقم"
                    />

                    <ModalField
                      label="رقم الهاتف (11رقم) *"
                      name="phone"
                      value={addDonorForm.phone}
                      onChange={handleAddDonorInputChange}
                      placeholder="مثال : 01012345678"
                      hint="يجب أن يبدأ ب011 أو010 أو012 أو015"
                    />

                    <ModalField
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      value={addDonorForm.email}
                      onChange={handleAddDonorInputChange}
                      placeholder="example@gmail.com"
                      hint="لإرسال إشعارات التبرع"
                    />

                    <ModalSelectField
                      label="المحافظة *"
                      name="governorate"
                      value={addDonorForm.governorate}
                      onChange={handleAddDonorInputChange}
                      placeholder="اختر المحافظة"
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
                    />

                    <ModalSelectField
                      label="فصيلة الدم *"
                      name="bloodType"
                      value={addDonorForm.bloodType}
                      onChange={handleAddDonorInputChange}
                      placeholder="اختر فصيلة الدم"
                      options={[
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
                  </div>

                  <div className="mt-8">
                    <label className="mb-3 block text-right text-[18px] font-semibold text-[#625F5F]">
                      ملاحظات
                    </label>
                    <textarea
                      name="notes"
                      value={addDonorForm.notes}
                      onChange={handleAddDonorInputChange}
                      placeholder="أي ملاحظات إضافية عن المتبرع...."
                      className="min-h-[146px] w-full rounded-[10px] border border-[rgba(129,129,129,0.39)] bg-white px-4 py-4 text-right text-[16px] font-medium text-black outline-none placeholder:text-[rgba(129,129,129,0.72)] focus:border-[#E02323] focus:ring-2 focus:ring-[#E02323]/20"
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-[rgba(129,129,129,0.28)] pt-8">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <button
                      type="submit"
                      disabled={creatingDonor}
                      className="flex h-[62px] flex-1 items-center justify-center gap-3 rounded-[15px] border border-[rgba(129,129,129,0.39)] bg-[rgba(208,207,206,0.29)] text-[19px] font-normal text-black transition hover:bg-[rgba(208,207,206,0.4)] disabled:cursor-not-allowed disabled:opacity-70 md:text-[21px]"
                    >
                      <Plus size={22} />
                      {creatingDonor ? "جارٍ التسجيل..." : "تسجيل المتبرع"}
                    </button>

                    <button
                      type="button"
                      onClick={closeAddDonorModal}
                      disabled={creatingDonor}
                      className="flex h-[62px] flex-1 items-center justify-center gap-3 rounded-[15px] border border-[rgba(129,129,129,0.39)] bg-[rgba(208,207,206,0.29)] text-[19px] font-normal text-black transition hover:bg-[rgba(208,207,206,0.4)] disabled:cursor-not-allowed disabled:opacity-70 md:text-[21px]"
                    >
                      <X size={22} />
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[78px] items-center justify-center gap-3 rounded-b-[15px] border-t border-[rgba(129,129,129,0.16)] bg-[rgba(240,240,240,0.12)] px-6 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.06)]">
                <CalendarDays size={28} className="text-[#818181]" />
                <span className="text-[18px] font-normal text-[#818181] md:text-[24px]">
                  {new Date().toLocaleString("ar-EG")}
                </span>
              </div>
            </form>
          </div>
        </div>

     ) }

     {/* مودال شامل (تبرع + تعديل) - تصميم فيجما */}
      {(showDonationModal || showEditModal) && currentDonor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 py-6 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-[1000px] max-h-[95vh] overflow-y-auto rounded-[15px] bg-[#FEFEFE] border border-[#E2E2E2] shadow-[0px_3px_30px_rgba(0,0,0,0.09)]" dir="rtl">
            
            {/* Header (Frame 78) */}
            <div className="relative flex min-h-[100px] flex-col items-center justify-center border-b border-[rgba(129,129,129,0.16)] bg-[rgba(240,240,240,0.12)] px-10 py-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
              <h2 className="text-[30px] font-semibold text-[#E02323]">إضافة متبرع جديد</h2>
              <p className="text-[20px] font-medium text-[rgba(129,129,129,0.8)] mt-1">
                المتبرع : {currentDonor.fullName} | فصيلة الدم : {currentDonor.bloodType}
              </p>
              <button 
                onClick={() => {setShowDonationModal(false); setShowEditModal(false);}} 
                className="absolute left-6 top-6 flex h-[47px] w-[47px] items-center justify-center rounded-full bg-[rgba(217,217,217,0.46)] hover:bg-gray-300 transition-all"
              >
                <X size={29} className="text-[#626262]" />
              </button>
            </div>

            {/* أزرار التنقل (Frame 81 & 28) */}
            <div className="mx-auto mt-6 w-[95%] h-[70px] bg-[rgba(129,129,129,0.07)] border border-[rgba(240,240,240,0.06)] rounded-[10px] flex items-center p-1.5 gap-2">
                <button 
                  onClick={() => setActiveTab("edit")}
                  className={`flex-1 h-full rounded-[10px] text-[24px] font-bold transition-all ${activeTab === "edit" ? "bg-white text-[#E02323] shadow-[0px_4px_4px_rgba(0,0,0,0.06)]" : "text-[rgba(129,129,129,0.81)]"}`}
                >
                  تعديل البيانات
                </button>
                <button 
                  onClick={() => setActiveTab("donate")}
                  className={`flex-1 h-full rounded-[10px] text-[24px] font-bold transition-all ${activeTab === "donate" ? "bg-white text-[#E02323] shadow-[0px_4px_4px_rgba(0,0,0,0.06)]" : "text-[rgba(129,129,129,0.81)]"}`}
                >
                  إضافة تبرع
                </button>
            </div>

            {/* كروت الإحصائيات (Frame 48096065) */}
            <div className="mx-auto mt-6 w-[95%] h-[112px] bg-[rgba(226,226,226,0.13)] rounded-[10px] grid grid-cols-4 items-center text-center px-4">
                <div>
                   <p className="text-[20px] font-semibold text-[rgba(129,129,129,0.72)]">المحافظة</p>
                   <p className="text-[24px] font-semibold text-black mt-1">{currentDonor.governorate}</p>
                </div>
                <div>
                   <p className="text-[20px] font-semibold text-[rgba(129,129,129,0.72)]">فصيلة الدم</p>
                   <p className="text-[32px] font-semibold text-[#E02323] mt-1">{currentDonor.bloodType}</p>
                </div>
                <div>
                   <p className="text-[18px] font-bold text-[rgba(129,129,129,0.72)]">آخر تبرع</p>
                   <p className="text-[24px] font-semibold text-black mt-1">{currentDonor.lastDonationDate ? new Date(currentDonor.lastDonationDate).toLocaleDateString('ar-EG') : "لا يوجد"}</p>
                </div>
                <div>
                   <p className="text-[20px] font-semibold text-[rgba(129,129,129,0.72)]">عدد التبرعات</p>
                   <p className="text-[36px] font-semibold text-[#E02323] mt-1">{currentDonor.donationCount || 0}</p>
                </div>
            </div>
                 <div className="p-8 space-y-10">
              {activeTab === "donate" ? (
                /* محتوى "إضافة تبرع" */
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="border border-[rgba(129,129,129,0.18)] rounded-[10px] p-6">
                    <h3 className="text-right text-[24px] font-bold mb-4">اختر تاريخ التبرع</h3>
                    <input type="date" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} className="w-full border border-gray-300 p-4 rounded-xl bg-gray-50 outline-none focus:border-[#E02323] text-xl" />
                  </div>
                  <div className="border border-[rgba(129,129,129,0.18)] rounded-[10px] p-6 space-y-4">
                    <h3 className="text-right text-[24px] font-bold">بيانات التبرع الجديد</h3>
                    <textarea value={donationNotes} onChange={(e) => setDonationNotes(e.target.value)} placeholder="حساسية من البنسلين.. إلخ" className="w-full border border-[rgba(129,129,129,0.3)] p-4 rounded-[10px] h-[115px] outline-none text-lg resize-none" />
                  </div>
                </div>
              ) : (
                /* محتوى "تعديل البيانات" - نسخة فيجما التفصيلية */
                <div className="border border-[rgba(129,129,129,0.31)] rounded-[20px] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                   <h3 className="text-right text-[29px] font-semibold text-black mb-6">تعديل بيانات المتبرع</h3>
                   <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-2 text-right">
                         <label className="text-[18px] font-semibold text-[rgba(0,0,0,0.53)] pr-1">الاسم الكامل *</label>
                         <input type="text" defaultValue={currentDonor.fullName} className="w-full h-[48px] border border-[rgba(129,129,129,0.39)] rounded-[10px] px-4 outline-none focus:border-[#E02323] text-[16px] font-medium" />
                      </div>
                      <div className="space-y-2 text-right">
                         <label className="text-[18px] font-semibold text-[rgba(0,0,0,0.53)] pr-1">رقم الهاتف *</label>
                         <input type="text" defaultValue={currentDonor.phone} className="w-full h-[48px] border border-[rgba(129,129,129,0.39)] rounded-[10px] px-4 outline-none focus:border-[#E02323] text-[16px] font-medium" />
                      </div>
                      <div className="space-y-2 text-right">
                         <label className="text-[18px] font-semibold text-[rgba(0,0,0,0.53)] pr-1">البريد الإلكتروني</label>
                         <input type="email" defaultValue={currentDonor.email} className="w-full h-[48px] border border-[rgba(129,129,129,0.39)] rounded-[10px] px-4 outline-none focus:border-[#E02323] text-[16px] font-medium" />
                      </div>
                      <div className="space-y-2 text-right">
                         <label className="text-[18px] font-semibold text-[rgba(0,0,0,0.53)] pr-1">المحافظة *</label>
                         <select className="w-full h-[48px] border border-[rgba(129,129,129,0.39)] rounded-[10px] px-4 outline-none bg-white text-[16px] font-medium appearance-none">
                            <option>{currentDonor.governorate}</option>
                            <option>الشرقية</option>
                            <option>القاهرة</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2 text-right pt-4">
                      <label className="text-[18px] font-semibold text-[rgba(0,0,0,0.53)] pr-1">ملاحظات إضافية</label>
                      <textarea defaultValue={currentDonor.notes} className="w-full h-[146px] border border-[rgba(129,129,129,0.39)] rounded-[10px] p-4 outline-none focus:border-[#E02323] text-[16px] font-medium resize-none" />
                   </div>
                </div>
              )}
              {/* أزرار التحكم */}
              <div className="flex gap-6 pt-6 border-t border-[rgba(129,129,129,0.31)]">
                <button onClick={handleDonateSubmit} disabled={isSubmitting} className="flex-1 h-[60px] bg-[#E02323] text-white rounded-[11px] text-[24px] font-medium hover:bg-red-700 transition-all disabled:opacity-50">
                  {isSubmitting ? "جارٍ التسجيل..." : "تسجيل التبرع"}
                </button>
                <button onClick={() => {setShowDonationModal(false); setShowEditModal(false);}} className="flex-1 h-[60px] bg-[rgba(91,88,88,0.15)] text-[rgba(0,0,0,0.75)] border border-[rgba(129,129,129,0.07)] rounded-[11px] text-[24px] font-medium hover:bg-gray-300 transition-all">
                  إلغاء
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex h-[77px] items-center justify-center border-t border-[rgba(129,129,129,0.16)] bg-[rgba(240,240,240,0.12)] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.06)]">
              <p className="text-[20px] text-[#818181] font-normal">
                جميع العمليات مسجلة للمسائلة • {new Date().toLocaleDateString('ar-EG')} • الموظف : لم يتم تحديده
              </p>
            </div>
          </div>
        </div>
      )}
    </>
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

function ModalField({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  placeholder: string
  hint?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-3 block text-right text-[18px] font-semibold text-[#625F5F]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[48px] w-full rounded-[10px] border border-[rgba(129,129,129,0.39)] bg-white px-4 text-right text-[16px] font-medium text-black outline-none placeholder:text-[rgba(129,129,129,0.72)] focus:border-[#E02323] focus:ring-2 focus:ring-[#E02323]/20"
      />

      {hint && (
        <p className="mt-2 text-right text-[15px] font-normal text-[rgba(30,30,30,0.77)]">
          {hint}
        </p>
      )}
    </div>
  )
}

function ModalSelectField({
  label,
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  placeholder: string
  options: string[]
}) {
  return (
    <div>
      <label className="mb-3 block text-right text-[18px] font-semibold text-[#625F5F]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-[48px] w-full rounded-[10px] border border-[rgba(129,129,129,0.39)] bg-white px-4 text-right text-[16px] font-bold text-black outline-none focus:border-[#E02323] focus:ring-2 focus:ring-[#E02323]/20"
      >
        <option value="">{placeholder}</option>
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
  setShowEditModal,
  setShowDonationModal,
  setCurrentDonor,
}: {
  donor: Donor
  formatLastDonation: (date?: string | null) => string
  onDelete: (id: string) => void
  deleting: boolean
  checked: boolean
  onSelect: (id: string) => void
  setShowEditModal: (val: boolean) => void
  setShowDonationModal: (val: boolean) => void
  setCurrentDonor: (donor: Donor) => void
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

            <span className={`inline-block mt-1 rounded-full px-3 py-[2px] text-[12px] font-medium ${
  donor.source === "employee"
    ? "bg-blue-100 text-blue-700"
    : "bg-green-100 text-green-700"
}`}>
  {donor.source === "employee" ? "أضيف بواسطة موظف" : "مسجل ذاتيًا"}
</span>




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
          <button
        onClick={() => {
           setCurrentDonor(donor); // بنسجل بيانات المتبرع اللي ضغطنا عليه
           setShowEditModal(true); // بنفتح مودال التعديل
           }}
            className="rounded-[10px] border border-[rgba(0,0,0,0.2)] px-3 py-2 text-[15px] text-[#818181] transition hover:bg-[#f8f8f8]"
              >
            تعديل
          </button>

         <button
             onClick={() => {
             setCurrentDonor(donor);
             setShowDonationModal(true); // بنفتح مودال التبرع
            }}
            className="rounded-[10px] bg-[#E02323] px-3 py-2 text-[15px] text-white transition hover:opacity-90"
              >
            تبرع
          </button>

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