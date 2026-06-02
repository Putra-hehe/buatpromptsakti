# PintarPrompt - Full Version (Frontend + Backend + Grok AI)

Versi lengkap PintarPrompt dengan:
- Frontend React + Tailwind (siap jalan)
- Backend Node.js + Express (terintegrasi Grok AI)
- History otomatis tersimpan di localStorage
- Fitur "Lainnya" untuk kategori & tone custom

## Cara Menjalankan

### 1. Jalankan Backend (Grok AI)

```bash
cd backend
npm install
cp .env.example .env
```

Edit file `.env` dan masukkan Grok API Key kamu:

```env
GROK_API_KEY=sk-...   # ← Ganti dengan API Key Grok kamu
PORT=5000
```

Jalankan backend:

```bash
npm run dev
```

Backend akan jalan di → `http://localhost:5000`

### 2. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan jalan di → `http://localhost:5173`

---

## Fitur

- Generate prompt pakai Grok AI (atau fallback jika backend mati)
- History otomatis tersimpan di localStorage
- Panel History lengkap (lihat, copy, hapus)
- Kategori & Tone termasuk opsi "Lainnya" + input custom
- Tampilan modern dark mode

## Struktur Folder

```
pintarprompt-full/
├── frontend/          ← Project React (Vite + Tailwind)
├── backend/           ← Backend Node.js + Grok AI
└── README.md
```

---

**Selamat mencoba!**  
Kalau ada pertanyaan atau mau ditambah fitur lain, bilang saja.
