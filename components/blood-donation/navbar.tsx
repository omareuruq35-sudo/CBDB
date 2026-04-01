"use client"

import { useEffect, useMemo, useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  const pathname = usePathname()

  useEffect(() => {
    const checkLoginStatus = () => {
      const status = localStorage.getItem("employeeLoggedIn")
      setIsEmployeeLoggedIn(status === "true")
    }

    checkLoginStatus()

    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
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

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full py-6 flex flex-col items-center bg-white transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <h1 className="text-[#d32f2f] text-2xl md:text-3xl font-extrabold text-center mb-6">
        البنك المركزي المصري للتبرع بالدم
      </h1>

      <nav className="flex items-center bg-white border border-gray-100 rounded-full px-4 py-2 shadow-md max-w-[95%]">
        <div className="flex items-center flex-row gap-4 md:gap-8">
          <Link href="/" className="flex-shrink-0">
            <div className="w-11 h-11 overflow-hidden rounded-full border-2 border-red-50 shadow-sm">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />
            </div>
          </Link>

          <div className="hidden lg:flex items-center flex-row gap-1">
            {visibleNavLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 text-[14px] font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-[#d32f2f] text-white shadow-md"
                      : "text-gray-600 hover:text-[#d32f2f] hover:bg-red-50"
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
                    className={`px-4 py-2 text-[14px] font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-[#d32f2f] text-white shadow-md"
                        : "text-gray-600 hover:text-[#d32f2f] hover:bg-red-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-red-50 rounded-full"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden w-[90%] mt-4 bg-white rounded-3xl p-4 shadow-2xl border border-gray-50">
          <div className="flex flex-col gap-2">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block px-6 py-4 text-center text-base font-bold rounded-2xl ${
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
                  className={`block px-6 py-4 text-center text-base font-bold rounded-2xl ${
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