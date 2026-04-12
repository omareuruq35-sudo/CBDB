"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Menu,
  X,
  Droplets,
  MapPin,
  BarChart3,
  UserPlus,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "شروط التبرع", href: "/services" },
  { label: "إرشادات وفوائد", href: "/guidelines" },
  { label: "أماكن بنوك الدم", href: "/locations" },
  { label: "سجل كمتبرع", href: "/register" },
  { label: "إعلانات الطوارئ", href: "/emergency" },
  { label: "دخول البنك", href: "/login" },
]

const employeeLinks = [
  { label: "بيانات الموقع", href: "/site-data" },
  { label: "إدارة الإعلانات", href: "/manage-announcements" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false)
  const [totalDonors, setTotalDonors] = useState(0)

  const pathname = usePathname()
  const router = useRouter()

  const isSiteDataPage = pathname === "/site-data"

  useEffect(() => {
    const checkLoginStatus = () => {
     const status = sessionStorage.getItem("employeeLoggedIn")
      setIsEmployeeLoggedIn(status === "true")
    }

    checkLoginStatus()
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [pathname])

  useEffect(() => {
    const fetchDonorsCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donors")
        const data = await res.json()

        if (Array.isArray(data)) {
          setTotalDonors(data.length)
        } else if (Array.isArray(data?.donors)) {
          setTotalDonors(data.donors.length)
        } else {
          setTotalDonors(0)
        }
      } catch (error) {
        console.error("Error fetching donors count:", error)
        setTotalDonors(0)
      }
    }

    fetchDonorsCount()

    const handleDonorsUpdated = () => {
      fetchDonorsCount()
    }

    window.addEventListener("donorsUpdated", handleDonorsUpdated)

    return () => {
      window.removeEventListener("donorsUpdated", handleDonorsUpdated)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setShowNavbar(true)
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false)
        setIsOpen(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const visibleNavLinks = useMemo(() => {
    if (isEmployeeLoggedIn) {
      return navLinks.filter((link) => link.href !== "/login")
    }
    return navLinks
  }, [isEmployeeLoggedIn])

  const handleOpenAddDonorModal = () => {
    window.dispatchEvent(new Event("openAddDonorModal"))
  }

  const handleLogout = () => {
    sessionStorage.removeItem("employeeLoggedIn")
    setIsEmployeeLoggedIn(false)
    window.dispatchEvent(new Event("storage"))
    router.push("/")
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 flex w-full flex-col items-center bg-white py-6 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <h1 className="mb-6 text-center text-2xl font-extrabold text-[#d32f2f] md:text-3xl">
        البنك المركزي المصري للتبرع بالدم
      </h1>

      <nav className="flex max-w-[95%] items-center rounded-full border border-gray-100 bg-white px-4 py-2 shadow-md">
        <div className="flex flex-row items-center gap-4 md:gap-8">
          <Link href="/" className="flex-shrink-0">
            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-red-50 shadow-sm">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />
            </div>
          </Link>

          <div className="hidden flex-row items-center gap-1 lg:flex">
            {visibleNavLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#d32f2f] text-white shadow-md"
                      : "text-gray-600 hover:bg-red-50 hover:text-[#d32f2f]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {isEmployeeLoggedIn &&
              employeeLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#d32f2f] text-white shadow-md"
                        : "text-gray-600 hover:bg-red-50 hover:text-[#d32f2f]"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 text-gray-600 hover:bg-red-50 lg:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isEmployeeLoggedIn && isSiteDataPage && (
        <div className="mt-4 w-[90%] max-w-[1300px] rounded-[22px] border border-[#e8e8e8] bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[16px] bg-[#E02323] text-white shadow-md">
                <Droplets size={28} />
              </div>

              <div>
                <h2 className="mb-1 text-[24px] font-bold text-black md:text-[28px]">
                  بيانات الموقع
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-[#87878C]">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    الموقع المركزي
                  </span>

                  <span className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    إجمالي المتبرعين : {totalDonors}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenAddDonorModal}
                className="flex h-[52px] items-center justify-center gap-2 rounded-[16px] bg-[#E02323] px-5 text-[16px] font-bold text-white transition hover:scale-[1.02] hover:shadow-md"
              >
                <UserPlus size={18} />
                تسجيل متبرع جديد
              </button>

              <button
                onClick={handleLogout}
                className="flex h-[52px] items-center justify-center gap-2 rounded-[16px] border border-[#87878C] bg-white px-5 text-[16px] font-bold text-black transition hover:bg-[#f8f8f8]"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 w-[90%] rounded-3xl border border-gray-50 bg-white p-4 shadow-2xl lg:hidden">
          <div className="flex flex-col gap-2">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block rounded-2xl px-6 py-4 text-center text-base font-bold ${
                  pathname === link.href
                    ? "bg-[#d32f2f] text-white"
                    : "text-gray-700 hover:bg-red-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isEmployeeLoggedIn &&
              employeeLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block rounded-2xl px-6 py-4 text-center text-base font-bold ${
                    pathname === link.href
                      ? "bg-[#d32f2f] text-white"
                      : "text-gray-700 hover:bg-red-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  )
}