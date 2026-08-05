import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, X, Search, Filter, AlertCircle, Calendar, User } from 'lucide-react';
import { activityService } from '../services/activityService';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../hooks/useAuth';

const BoardPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const columns = ['Pendiente', 'En Proceso', 'En Revisión', 'Completado'];

  useEffect(() => {
    loadActivities();
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      if (user?.rol?.nombre === 'Docente') {
        const data = await usuarioService.getEstudiantes();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, column) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    if (column === 'Completado' && user?.rol?.nombre !== 'Docente' && user?.rol?.nombre !== 'Administrador') {
      showError('Solo un Docente puede aprobar y mover la actividad a Completado tras revisarla.');
      return;
    }

    try {
      setActivities(prev =>
        prev.map(act => act.id === parseInt(taskId) ? { ...act, estado: { nombre: column } } : act)
      );
      await activityService.updateStatus(taskId, column);
      loadActivities();
    } catch (error) {
      console.error('Error updating status:', error);
      showError(error.response?.data?.message || 'Error al cambiar el estatus de la actividad.');
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
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority ? act.prioridad === filterPriority : true;

    // Check Assignee
    let matchesAssignee = true;
    if (filterAssignee) {
      matchesAssignee = act.asignaciones?.some(a => a.usuario?.id.toString() === filterAssignee);
    }

    // Check Date
    let matchesDate = true;
    if (filterDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const actDate = new Date(act.fecha_limite);
      actDate.setHours(0, 0, 0, 0);

      if (filterDate === 'vencidas') {
        matchesDate = actDate < today && act.estado?.nombre !== 'Completado';
      } else if (filterDate === 'hoy') {
        matchesDate = actDate.getTime() === today.getTime();
      } else if (filterDate === 'semana') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        matchesDate = actDate >= today && actDate <= nextWeek;
      } else if (filterDate === 'mes') {
        matchesDate = actDate.getMonth() === today.getMonth() && actDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesPriority && matchesAssignee && matchesDate;
  });

  return (
    <div className="p-6 md:p-10 h-screen flex flex-col bg-[#F9FAFB] overflow-hidden relative">

      {/* Toast Error Message */}
      {errorMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-white border-l-4 border-red-500 shadow-xl rounded-xl px-5 py-4 flex items-start gap-3 min-w-[320px] max-w-md">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">Acción denegada</h4>
              <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Actividades</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el flujo de trabajo de las tareas</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors border ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter size={18} />
            <span>Filtros</span>
            {(filterPriority || filterAssignee || filterDate) && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute -top-1 -right-1"></span>
            )}
          </button>

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

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800">Filtros Avanzados</h3>
            <button
              onClick={() => { setFilterPriority(''); setFilterAssignee(''); setFilterDate(''); }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Prioridad</label>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            {/* Assignee Filter */}
            {user?.rol?.nombre === 'Docente' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Responsable</label>
                <select
                  value={filterAssignee}
                  onChange={e => setFilterAssignee(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Cualquier responsable</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Fecha Límite</label>
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Cualquier fecha</option>
                <option value="vencidas">Vencidas</option>
                <option value="hoy">Vence Hoy</option>
                <option value="semana">Próximos 7 días</option>
                <option value="mes">Este mes</option>
              </select>
            </div>

          </div>
        </div>
      )}

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

