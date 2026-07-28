import { useState, useEffect } from 'react';
import { Type, AlignLeft, Calendar, User, PlusCircle } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';

const TaskForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [titulo, setTitulo] = useState(initialData.titulo || '');
  const [descripcion, setDescripcion] = useState(initialData.descripcion || '');
  const [fecha_limite, setFechaLimite] = useState(initialData.fecha_limite || '');
  const [prioridad, setPrioridad] = useState(initialData.prioridad || 'Media');
  
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignados, setAsignados] = useState(initialData.asignados || []);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await usuarioService.getEstudiantes();
        setEstudiantes(data);
      } catch (error) {
        console.error('Error al cargar estudiantes', error);
      }
    };
    fetchEstudiantes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ titulo, descripcion, fecha_limite, prioridad, asignados });
  };

  const handleToggleEstudiante = (id) => {
    setAsignados(prev => 
      prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]
    );
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
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
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
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
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
            value={fecha_limite}
            onChange={e => setFechaLimite(e.target.value)}
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <Type size={16} className="text-indigo-500" />
            Prioridad <span className="text-red-500">*</span>
          </label>
          <select 
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
      </div>

      {/* Assignees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <User size={16} className="text-indigo-500" />
          Asignar a Estudiantes <span className="text-gray-400 font-normal text-xs">(Opcional)</span>
        </label>
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-2">
          {estudiantes.length === 0 ? (
            <span className="text-sm text-gray-400">Cargando estudiantes...</span>
          ) : (
            estudiantes.map(est => (
              <label key={est.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={asignados.includes(est.id)}
                  onChange={() => handleToggleEstudiante(est.id)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">{est.nombre}</span>
                  <span className="text-xs text-gray-500">{est.email}</span>
                </div>
              </label>
            ))
          )}
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

