import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Heart, Share2, Star, AlertCircle } from 'lucide-react';

const categories = [
  'Instagram Caption', 'YouTube Script', 'Kuliah & Tugas', 'Bisnis & Marketing',
  'Image Prompt (AI Art)', 'Coding & Development', 'Email Profesional',
  'Content Ideas', 'TikTok / Reels', 'LinkedIn Post', 'Lainnya'
];

const tones = [
  'Viral Kekinian', 'Profesional', 'Lucu & Santai', 'Formal', 'Motivasi',
  'Edukatif', 'Storytelling', 'Persuasif', 'Inspiratif', 'Netral', 'Lainnya'
];

export function PromptGenerator() {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Instagram Caption');
  const [tone, setTone] = useState('Viral Kekinian');
  const [customCategory, setCustomCategory] = useState('');
  const [customTone, setCustomTone] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  const saveToHistory = (prompt: string, originalInput: string, cat: string, t: string) => {
    const historyItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      prompt,
      originalInput,
      category: cat,
      tone: t,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('pintarprompt_history') || '[]');
    const newHistory = [historyItem, ...existing].slice(0, 50);
    localStorage.setItem('pintarprompt_history', JSON.stringify(newHistory));
    window.dispatchEvent(new Event('historyUpdated'));
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Silakan isi request kamu terlebih dahulu!');
      return;
    }
    setError('');
    setIsGenerating(true);
    setResult('');

    const finalCat = category === 'Lainnya' ? (customCategory || 'Umum') : category;
    const finalTone = tone === 'Lainnya' ? (customTone || 'Netral') : tone;

    try {
      const response = await fetch('http://localhost:5000/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: input.trim(),
          category: finalCat,
          tone: finalTone,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setResult(data.prompt);
        setRating(0);
        saveToHistory(data.prompt, input.trim(), finalCat, finalTone);
      } else {
        setError(data.error || 'Gagal generate prompt');
      }
    } catch (err) {
      const fallback = `Buatkan konten yang ${finalTone.toLowerCase()} untuk ${finalCat.toLowerCase()}:\n\n"${input}"\n\nGunakan bahasa Indonesia yang natural dan engaging.`;
      setResult(fallback);
      saveToHistory(fallback, input.trim(), finalCat, finalTone);
      setError('Backend offline — menggunakan mode fallback');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    alert('✅ Prompt berhasil disalin ke clipboard!');
  };

  const resetForm = () => {
    setInput('');
    setResult('');
    setRating(0);
    setError('');
    setCustomCategory('');
    setCustomTone('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] to-[#0A0A0A] p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Mau bikin apa hari ini?</label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
              placeholder="Contoh: caption jualan hoodie oversize aesthetic untuk cowok..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder-gray-500 min-h-[120px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              rows={4}
            />
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Kategori</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); if (e.target.value !== 'Lainnya') setCustomCategory(''); }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {category === 'Lainnya' && (
                <input type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="Masukkan kategori custom..." className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm" />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Tone / Style</label>
              <select value={tone} onChange={(e) => { setTone(e.target.value); if (e.target.value !== 'Lainnya') setCustomTone(''); }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500">
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {tone === 'Lainnya' && (
                <input type="text" value={customTone} onChange={e => setCustomTone(e.target.value)} placeholder="Masukkan tone custom..." className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm" />
              )}
            </div>
          </div>

          {error && <div className="mb-4 flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="h-4 w-4" />{error}</div>}

          <button onClick={handleGenerate} disabled={!input.trim() || isGenerating}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 text-lg">
            {isGenerating ? <> <RefreshCw className="h-5 w-5 animate-spin" /> Generating dengan Grok AI... </> : <> <Sparkles className="h-5 w-5" /> Generate Prompt </>}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Hasil Prompt</h3>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="px-4 py-2 bg-white/5 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10"><Copy className="h-4 w-4" /> Copy</button>
              <button onClick={resetForm} className="px-4 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/5">Buat Baru</button>
            </div>
          </div>
          <pre className="bg-black/40 p-6 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}
