import { useState, useEffect } from 'react';
import { Clock, Trash2, Copy } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  originalInput: string;
  category: string;
  tone: string;
  timestamp: string;
}

export function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  const loadHistory = () => {
    const saved = localStorage.getItem('pintarprompt_history');
    if (saved) setHistory(JSON.parse(saved));
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
  }, []);

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.id !== id);
    localStorage.setItem('pintarprompt_history', JSON.stringify(newHistory));
    setHistory(newHistory);
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = () => {
    if (confirm('Hapus semua history?')) {
      localStorage.removeItem('pintarprompt_history');
      setHistory([]);
      setSelected(null);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert('Prompt disalin ke clipboard!');
  };

  const formatTime = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} menit lalu`;
    return new Date(ts).toLocaleDateString('id-ID');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-400" />
          <h3 className="font-semibold text-sm">History Terbaru</h3>
        </div>
        {history.length > 0 && <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-500">Clear All</button>}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">Belum ada history.<br />Generate prompt pertama kamu!</div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-auto">
          {history.map(item => (
            <div key={item.id} onClick={() => setSelected(item)} className="cursor-pointer rounded-xl border border-white/5 bg-white/5 p-4 hover:border-purple-500/40 transition-all">
              <div className="flex justify-between">
                <p className="text-sm text-gray-300 line-clamp-2 pr-2">{item.originalInput}</p>
                <button onClick={(e) => deleteItem(item.id, e)} className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-purple-400">{item.category}</span>
                <span className="text-gray-500">{formatTime(item.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111111] rounded-2xl border border-white/10 max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-purple-400 text-sm">{selected.category} • {selected.tone}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400">✕</button>
            </div>
            <pre className="bg-black/40 p-4 rounded-xl text-sm whitespace-pre-wrap max-h-[300px] overflow-auto">{selected.prompt}</pre>
            <div className="flex gap-3 mt-4">
              <button onClick={() => copyPrompt(selected.prompt)} className="flex-1 bg-purple-600 py-3 rounded-xl flex items-center justify-center gap-2"><Copy className="h-4 w-4" /> Copy Prompt</button>
              <button onClick={() => setSelected(null)} className="flex-1 border border-white/20 py-3 rounded-xl">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
