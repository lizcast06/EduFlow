import { useState } from 'react';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, X } from 'lucide-react';

const BoardPage = () => {
  const [activities, setActivities] = useState([
    {
      id: '1',
      title: 'Configurar entorno',
      description: 'Instalar dependencias necesarias para el proyecto',
      assignee: 'Juan',
      dueDate: '2026-07-20',
      status: 'To Do'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = ['Backlog', 'To Do', 'In Progress', 'Done'];

  const handleCreateTask = (taskData) => {
    const newActivity = {
      ...taskData,
      id: Date.now().toString(),
      status: 'Backlog',
    };
    setActivities([...activities, newActivity]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 h-screen flex flex-col bg-gray-50/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tablero Kanban</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el flujo de trabajo de las actividades</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Crear actividad
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => (
          <KanbanColumn key={col} title={col}>
            {activities
              .filter(act => act.status === col)
              .map(act => (
                <TaskCard key={act.id} task={act} />
              ))}
            {activities.filter(act => act.status === col).length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400">
                Sin actividades
              </div>
            )}
          </KanbanColumn>
        ))}
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

