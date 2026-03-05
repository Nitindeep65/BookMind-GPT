import { Navbar } from "./home/Navbar"
import { Hero } from "./home/Hero"
import { Features } from "./home/Features"
import { HowItWorks } from "./home/HowItWorks"
import { Footer } from "./home/Footer"

export function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="max-w-6xl mx-auto px-6"><div className="border-t border-gray-100" /></div>
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}

export default Home
