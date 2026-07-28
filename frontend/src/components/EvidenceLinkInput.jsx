import { useState } from 'react';

const EvidenceLinkInput = ({ onAdd }) => {
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (url.trim()) {
      onAdd({ archivo_url: url });
      setUrl('');
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3 w-full">
      <input 
        type="url" 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://docs.google.com/..." 
        className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
      />
      <button 
        onClick={handleAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
      >
        Agregar
      </button>
    </div>
  );
};

export default EvidenceLinkInput;
