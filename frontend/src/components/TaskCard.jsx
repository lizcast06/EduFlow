import { Calendar, User, Clock, AlertCircle, Star } from 'lucide-react';

const TaskCard = ({ task, onDragStart, onClick }) => {
  // Calculate time remaining
  const dueDate = new Date(task?.fecha_limite);
  const today = new Date();
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  const isUrgent = diffDays <= 2;
  const isWarning = diffDays > 2 && diffDays <= 5;
  const isOverdue = diffDays < 0;

  let timeBadgeBg = "bg-emerald-50 text-emerald-600 border-emerald-100";
  let timeIcon = <Clock size={12} className="mr-1" />;
  let timeText = `${diffDays} días restantes`;

  if (isOverdue) {
    timeBadgeBg = "bg-slate-100 text-slate-500 border-slate-200";
    timeIcon = <AlertCircle size={12} className="mr-1" />;
    timeText = "Vencida";
  } else if (diffDays === 0) {
    timeBadgeBg = "bg-red-50 text-red-600 border-red-100";
    timeIcon = <AlertCircle size={12} className="mr-1" />;
    timeText = diffHours > 0 ? `${diffHours}h restantes` : "Vence hoy";
  } else if (isUrgent) {
    timeBadgeBg = "bg-red-50 text-red-600 border-red-100";
    timeIcon = <AlertCircle size={12} className="mr-1" />;
  } else if (isWarning) {
    timeBadgeBg = "bg-amber-50 text-amber-600 border-amber-100";
  }

  // Priority Badge colors
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Alta': return { bg: 'bg-red-50 text-red-600', dot: 'bg-red-500' };
      case 'Media': return { bg: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' };
      case 'Baja': return { bg: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' };
      default: return { bg: 'bg-slate-50 text-slate-600', dot: 'bg-slate-500' };
    }
  };
  
  const pStyle = getPriorityStyle(task?.prioridad);
  
  // Tag Style
  const getTagStyle = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-indigo-100 text-indigo-700 font-bold tracking-wide uppercase text-[10px]';
      case 'En Proceso': return 'bg-amber-50 text-amber-600 font-bold tracking-wide uppercase text-[10px]';
      case 'En Revisión': return 'bg-slate-100 text-slate-600 font-bold tracking-wide uppercase text-[10px]';
      case 'Completado': return 'bg-emerald-50 text-emerald-600 font-bold tracking-wide uppercase text-[10px]';
      default: return 'bg-slate-50 text-slate-600 font-bold tracking-wide uppercase text-[10px]';
    }
  };

  // Extract highest grade if multiple assignees, or just the first one
  const calificacion = task?.asignaciones?.find(a => a.calificacion !== null)?.calificacion;

  return (
    <div 
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 flex flex-col gap-4 group"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${getTagStyle(task?.estado?.nombre)}`}>
          {task?.estado?.nombre || 'General'}
        </span>
        {task?.prioridad && (
          <span className={`text-[11px] font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full ${pStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`}></span>
            {task.prioridad}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors mb-2">
          {task?.titulo || 'Sin título'}
        </h3>
        {task?.descripcion && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {task.descripcion}
          </p>
        )}
      </div>
      
      {calificacion !== undefined && calificacion !== null && (
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-semibold border border-emerald-100 w-fit">
          <Star size={16} className="text-emerald-500" />
          <span>Calificación: {calificacion}/10</span>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mt-auto pt-2">
        {task?.fecha_limite && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Calendar size={14} />
            <span>{new Date(task.fecha_limite).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
        
        {task?.asignaciones?.length > 0 && (
           <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
             <User size={12} />
             <span className="truncate max-w-[80px]">
               {task.asignaciones[0].usuario?.nombre?.split(' ')[0]}
             </span>
           </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

