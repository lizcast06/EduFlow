const PriorityBadge = ({ priority }) => {
  const colors = {
    'Baja': 'bg-emerald-500 text-white shadow-sm',
    'Media': 'bg-amber-500 text-white shadow-sm',
    'Alta': 'bg-red-500 text-white shadow-sm',
    'Urgente': 'bg-red-600 text-white shadow-sm ring-2 ring-red-200 animate-pulse',
  };
  const colorClass = colors[priority] || 'bg-slate-400 text-white shadow-sm';

  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
