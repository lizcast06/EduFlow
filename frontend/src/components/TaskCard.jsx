import { Calendar, User, Clock } from 'lucide-react';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all flex flex-col gap-2 group">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
          {task?.title || 'Sin título'}
        </h3>
      </div>
      
      {task?.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
      
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-[11px] font-medium text-gray-500">
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
          <User size={12} className="text-indigo-400" />
          <span className="truncate max-w-[80px]">{task?.assignee || 'Sin asignar'}</span>
        </div>
        
        {task?.dueDate && (
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-2 py-1 rounded-md">
            <Calendar size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

