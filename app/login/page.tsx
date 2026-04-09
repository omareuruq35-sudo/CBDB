"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const handleLogin = () => {
    if (!email || !password) {
      setError("من فضلك أدخل البريد الإلكتروني وكلمة المرور")
      return
    }

    setError("")
    localStorage.setItem("employeeLoggedIn", "true")
    router.push("/site-data")
  }

  return (
    <section className="min-h-[50vh] bg-[#66666] flex justify-center items-start px-4 pt-6 pb-10">
      <div
        className="w-full max-w-[1000px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-6 md:p-10
                      transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <div className="flex justify-center">
            <div className="w-full max-w-[340px] text-right">
              <h1 className="text-black font-bold text-2xl md:text-3xl mb-2 whitespace-nowrap mr-8">
                تسجيل دخول البنك
              </h1>

              <p className="text-gray-400 text-sm md:text-base font-medium mb-6 mr-16">
                للموظفين والمسؤولين فقط
              </p>

              <div className="space-y-4">
                <div className="w-full h-[56px] bg-[rgba(30,30,30,0.03)] shadow-[0_0_6px_rgba(0,0,0,0.15)] rounded-[12px] px-5 flex items-center">
                  <input
                    type="email"
                    placeholder="أسم المستخدم"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-right text-base text-black placeholder:text-gray-400"
                  />
                </div>

                <div className="w-full h-[56px] bg-[rgba(30,30,30,0.03)] shadow-[0_0_6px_rgba(0,0,0,0.15)] rounded-[12px] px-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 shrink-0"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-right text-base text-black placeholder:text-gray-400"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-right">{error}</p>
                )}

                <div className="pt-6 flex justify-center">
                  <div className="w-[70%]">
                    <button
                      onClick={handleLogin}
                      className="w-full h-[58px] bg-[#E02323] rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-white text-lg md:text-xl font-bold transition duration-300 hover:scale-[1.03] hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
                    >
                      تسجيل الدخول
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] h-[420px] rounded-[24px] overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.22)]">
              <img
                src="/login-blood-bank.jpg"
                alt="login"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}