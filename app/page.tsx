import { Hero } from "@/components/blood-donation/hero"
import { About } from "@/components/blood-donation/about"
import { Compatibility } from "@/components/blood-donation/compatibility"
import { Donation } from "@/components/blood-donation/donation"
import {DonationSection} from "@/components/blood-donation/DonationSection"



export default function BloodDonationPage() {
  return (
    <main className="min-h-screen bg-[#ffffff] overflow-x-hidden">
     
      <Hero />
      <About />
      <DonationSection />
      <Compatibility />
      <Donation />
     
    </main>
  )
}