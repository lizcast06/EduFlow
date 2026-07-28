const KanbanColumn = ({ title, count, children, onDrop, onDragOver }) => {
  // Determine dot color based on title
  let dotColor = "bg-gray-400";
  if (title.toLowerCase().includes('hacer') || title.toLowerCase().includes('backlog')) dotColor = "bg-red-500 shadow-red-500/40";
  else if (title.toLowerCase().includes('progreso') || title.toLowerCase().includes('desarrollo')) dotColor = "bg-amber-400 shadow-amber-400/40";
  else if (title.toLowerCase().includes('completad') || title.toLowerCase().includes('prueba')) dotColor = "bg-emerald-500 shadow-emerald-500/40";

  return (
    <div 
      className="bg-[#F8F9FC] border border-gray-100 rounded-3xl w-[320px] shrink-0 flex flex-col max-h-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="p-5 flex items-center justify-between border-b border-gray-200/60 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${dotColor}`}></div>
          <h2 className="font-bold text-gray-800 tracking-wide uppercase text-sm">{title}</h2>
        </div>
        <div className="bg-white border border-gray-200 text-gray-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
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
