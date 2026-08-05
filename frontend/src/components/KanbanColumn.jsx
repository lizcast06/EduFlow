const KanbanColumn = ({ title, count, children, onDrop, onDragOver }) => {
  // Determine dot color based on title
  let dotColor = "bg-slate-400";
  if (title.toLowerCase().includes('pendiente') || title.toLowerCase().includes('backlog')) dotColor = "bg-red-500 shadow-red-500/40";
  else if (title.toLowerCase().includes('proceso') || title.toLowerCase().includes('desarrollo')) dotColor = "bg-amber-500 shadow-amber-500/40";
  else if (title.toLowerCase().includes('completad')) dotColor = "bg-emerald-500 shadow-emerald-500/40";

  return (
    <div 
      className="bg-slate-50 border border-slate-200 rounded-3xl w-[320px] shrink-0 flex flex-col max-h-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="p-5 flex items-center justify-between border-b border-slate-200 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${dotColor}`}></div>
          <h2 className="font-bold text-slate-900 tracking-wide uppercase text-sm">{title}</h2>
        </div>
        <div className="bg-white border border-slate-200 text-slate-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
          {count || 0}
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;
