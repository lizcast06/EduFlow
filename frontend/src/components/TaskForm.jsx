import { useState } from 'react';
import { Type, AlignLeft, Calendar, User, PlusCircle } from 'lucide-react';

const TaskForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [assignee, setAssignee] = useState(initialData.assignee || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, assignee });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
          <Type size={16} className="text-indigo-500" />
          Nombre de la actividad <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ej. Tarea de matemáticas..."
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
          <AlignLeft size={16} className="text-indigo-500" />
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Instrucciones detalladas..."
          required
          rows="3"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <Calendar size={16} className="text-indigo-500" />
            Fecha límite <span className="text-red-500">*</span>
          </label>
          <input 
            type="date" 
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <User size={16} className="text-indigo-500" />
            Responsable <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            placeholder="Ej. Grupo A / Juan"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Crear Actividad
        </button>
      </div>

    </form>
  );
};

export default TaskForm;

