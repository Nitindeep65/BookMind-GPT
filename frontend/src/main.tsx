import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import UploadDoc from "./pages/UploadDoc.tsx"
import Chat from "./components/chat/index.tsx"
import { ThemeProvider } from "./hooks/useTheme.tsx"
import Home from "./pages/Home"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <StrictMode>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<UploadDoc />} />
          <Route path="/chat" element={<Chat />} />

          {/* Backward-compatible routes for existing links/bookmarks */}
          <Route path="/Home" element={<Home />} />
          <Route path="/UploadDoc" element={<UploadDoc />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </StrictMode>
    </BrowserRouter>
  </ThemeProvider>
)
