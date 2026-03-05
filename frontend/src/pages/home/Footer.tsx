import { useNavigate } from "react-router-dom"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  const navigate = useNavigate()

  return (
    <footer id="footer" className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">

          {/* Brand col */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="EasyRead" className="w-9 h-9 rounded object-contain" />
              <span className="text-white font-semibold text-[18px]">EasyRead</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-gray-500 max-w-50">
              AI-powered document reader. Upload, ask, and learn faster.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="mailto:hello@easyread.app" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Product</p>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><button onClick={() => navigate("/UploadDoc")} className="hover:text-white transition-colors">Upload Doc</button></li>
              <li><button onClick={() => navigate("/Chat")} className="hover:text-white transition-colors">Chat</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Support</p>
            <ul className="space-y-2.5 text-[13px]">
              <li><a href="mailto:hello@easyread.app" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Built with</p>
            <ul className="space-y-2.5 text-[13px]">
              <li className="text-gray-500">React + Vite</li>
              <li className="text-gray-500">Tailwind CSS</li>
              <li className="text-gray-500">FastAPI</li>
              <li className="text-gray-500">RAG / ChromaDB</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-600 mt-8">
          &copy; {new Date().getFullYear()} EasyRead. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
