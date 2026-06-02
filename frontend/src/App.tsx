import { useState } from 'react'
import { PromptGenerator } from './components/PromptGenerator'
import { HistoryPanel } from './components/HistoryPanel'
import { Sparkles, User } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                PintarPrompt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
              Login
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 max-w-7xl mx-auto px-6 pb-12">
        {/* Hero */}
        <div className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Buat Prompt AI yang Lebih Pintar<br />dalam Sekejap
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generator prompt terbaik untuk Grok, ChatGPT, Claude, Midjourney &amp; lainnya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Kiri */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                <h3 className="font-semibold mb-4 text-sm">Kategori Populer</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">📸 Instagram</div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">▶️ YouTube</div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">🎓 Kuliah</div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">💼 Bisnis</div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">🎨 AI Art</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Generator */}
          <div className="lg:col-span-6">
            <PromptGenerator />
          </div>

          {/* History Panel */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <HistoryPanel />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        Made with ❤️ for Indonesia • 2026
      </footer>
    </div>
  )
}

export default App
