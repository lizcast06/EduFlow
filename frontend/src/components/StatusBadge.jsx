const StatusBadge = ({ status }) => {
  const colors = {
    'Pendiente': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'En Proceso': 'bg-amber-50 text-amber-600 border-amber-200',
    'En Revisión': 'bg-slate-100 text-slate-600 border-slate-200',
    'Completado': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
  const colorClass = colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
