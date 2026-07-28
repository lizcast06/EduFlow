import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, X, Search, Filter } from 'lucide-react';
import { activityService } from '../services/activityService';
import { useAuth } from '../hooks/useAuth';

const BoardPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const columns = ['Backlog', 'Análisis', 'Diseño', 'Desarrollo', 'Pruebas', 'Completado'];

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, column) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    try {
      setActivities(prev => 
        prev.map(act => act.id === parseInt(taskId) ? { ...act, estado: { nombre: column } } : act)
      );
      await activityService.updateStatus(taskId, column);
      loadActivities();
    } catch (error) {
      console.error('Error updating status:', error);
      loadActivities();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCreateTask = async (taskData) => {
    try {
      await activityService.create(taskData);
      loadActivities();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority ? act.prioridad === filterPriority : true;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-6 md:p-10 h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Actividades</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el flujo de trabajo de las tareas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* Priority Filters */}
          <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl text-xs font-semibold">
            {['Todas', 'Alta', 'Media', 'Baja'].map(prio => {
              const val = prio === 'Todas' ? '' : prio;
              const isActive = filterPriority === val;
              return (
                <button 
                  key={prio}
                  onClick={() => setFilterPriority(val)}
                  className={`px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {prio}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar tarea..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm"
            />
          </div>

          {user?.rol?.nombre === 'Docente' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus size={18} />
              <span>Crear actividad</span>
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => {
          const colActivities = filteredActivities.filter(act => act.estado?.nombre === col);
          return (
            <KanbanColumn 
              key={col} 
              title={col}
              count={colActivities.length}
              onDrop={(e) => handleDrop(e, col)}
              onDragOver={handleDragOver}
            >
              {colActivities.map(act => (
                  <TaskCard 
                    key={act.id} 
                    task={act} 
                    onDragStart={(e) => handleDragStart(e, act.id)}
                    onClick={() => navigate(`/activity/${act.id}`)}
                  />
                ))}
              {colActivities.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 mt-2">
                  Sin actividades
                </div>
              )}
            </KanbanColumn>
          );
        })}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Nueva Actividad</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 md:p-6">
              <TaskForm 
                onSubmit={handleCreateTask} 
                onCancel={() => setIsModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;

