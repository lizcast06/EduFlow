import { Calendar, User, Clock, AlertCircle } from 'lucide-react';

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
    timeBadgeBg = "bg-gray-100 text-gray-500 border-gray-200";
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
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500 text-white shadow-red-500/30';
      case 'Media': return 'bg-amber-500 text-white shadow-amber-500/30';
      case 'Baja': return 'bg-emerald-500 text-white shadow-emerald-500/30';
      default: return 'bg-gray-500 text-white shadow-gray-500/30';
    }
  };

  return (
    <div 
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 flex flex-col gap-3 group"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100">
          {task?.estado?.nombre || 'General'}
        </span>
        {task?.prioridad && (
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md shadow-sm ${getPriorityColor(task.prioridad)}`}>
            {task.prioridad}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors mb-1">
          {task?.titulo || 'Sin título'}
        </h3>
        {task?.descripcion && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {task.descripcion}
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mt-1 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 text-[11px] font-medium text-gray-600">
          <User size={12} className="text-indigo-400" />
          <span className="truncate max-w-[80px]">
            {task?.asignaciones?.length > 0 
              ? `${task.asignaciones[0].usuario?.nombre?.split(' ')[0]} ${task.asignaciones.length > 1 ? `+${task.asignaciones.length - 1}` : ''}`
              : task?.creador?.nombre?.split(' ')[0] || 'Docente'
            }
          </span>
        </div>
        
        {task?.fecha_limite && (
          <div className={`flex items-center px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${timeBadgeBg}`}>
            {timeIcon}
            <span>{timeText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

