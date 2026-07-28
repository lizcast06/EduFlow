import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { indicatorService } from '../services/indicatorService';
import { activityService } from '../services/activityService';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle2, Clock, Flag, AlertCircle, ChevronRight, Bell } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        indicatorService.getDashboardStats(),
        activityService.getAll()
      ]);
      setStats(statsData);
      
      if (statsData?.tareasVencidas || statsData?.tareasProximas) {
        const backendUrgent = [
          ...(statsData.tareasVencidas || []), 
          ...(statsData.tareasProximas || [])
        ];
        setUrgentTasks(backendUrgent.slice(0, 5));
      } else if (tasksData) {
        // Fallback if backend doesn't provide them
        const pending = tasksData.filter(t => t.estado?.nombre !== 'Completado');
        pending.sort((a, b) => new Date(a.fecha_limite) - new Date(b.fecha_limite));
        setUrgentTasks(pending.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando progreso académico...</div>;
  }

  // Get specific stats by state name
  const getStatByState = (stateName) => {
    if (!stats?.actividadesPorEstado) return 0;
    const found = stats.actividadesPorEstado.find(st => st.estado?.nombre === stateName);
    return found ? found.total : 0;
  };

  const completed = getStatByState('Completado');
  const inProgress = getStatByState('En Progreso');
  const todo = getStatByState('Backlog') + getStatByState('Análisis') + getStatByState('Diseño') + getStatByState('Desarrollo') + getStatByState('Pruebas'); // Combine other states as 'Por Hacer'

  return (
    <div className="p-6 md:p-10 min-h-screen flex flex-col bg-[#F9FAFB]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Tu progreso académico</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-gray-600">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-[#2D2B52] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end z-10 relative">
          <div>
            <p className="text-indigo-200 text-sm mb-1">Bienvenido de vuelta, 👋</p>
            <h2 className="text-3xl font-bold mb-1">{user?.nombre || 'Estudiante'}</h2>
            <p className="text-indigo-300 text-sm">{user?.rol?.nombre === 'Docente' ? 'Panel de Administración' : '3°B — Turno Mañana'} · {todo + inProgress} tareas pendientes</p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-indigo-200 text-sm mb-1">Promedio general</p>
            <h2 className="text-4xl font-bold leading-none mb-1">31</h2>
            <p className="text-indigo-300 text-xs">183/600 pts</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 z-10 relative">
          <div className="flex justify-between text-xs font-semibold text-indigo-200 mb-2">
            <span>Progreso del periodo</span>
            <span>{stats?.porcentajeCompletado || 0}%</span>
          </div>
          <div className="w-full bg-[#413F70] rounded-full h-2">
            <div 
              className="bg-[#5EE192] h-2 rounded-full shadow-[0_0_10px_rgba(94,225,146,0.5)] transition-all duration-1000" 
              style={{ width: `${stats?.porcentajeCompletado || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Completadas */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100">
            <CheckCircle2 size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{completed}</h3>
          <p className="text-xs font-medium text-gray-500">Completadas</p>
        </div>

        {/* En Progreso */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 border border-indigo-100">
            <Clock size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{inProgress}</h3>
          <p className="text-xs font-medium text-gray-500">En Progreso</p>
        </div>

        {/* Por Hacer */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 border border-amber-100">
            <Flag size={24} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{todo}</h3>
          <p className="text-xs font-medium text-gray-500">Por Hacer</p>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            Alertas de Fecha Límite
          </h3>
          <button onClick={() => navigate('/board')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="flex flex-col">
          {urgentTasks.length === 0 ? (
             <div className="p-8 text-center text-gray-500 text-sm">No tienes tareas pendientes urgentes. ¡Buen trabajo!</div>
          ) : (
            urgentTasks.map((task, idx) => {
              // Calculate days left
              const dueDate = new Date(task.fecha_limite);
              const today = new Date();
              const diffTime = dueDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              const isUrgent = diffDays <= 2;
              const isWarning = diffDays > 2 && diffDays <= 7;
              
              let statusColor = "bg-gray-100 text-gray-600";
              let borderColor = "border-l-gray-300";
              let iconBg = "bg-gray-50 text-gray-500";
              let pillBg = "bg-gray-100 text-gray-600";
              
              if (isUrgent) {
                statusColor = "text-red-500";
                borderColor = "border-l-red-500";
                iconBg = "bg-red-50 text-red-500 border-red-100";
                pillBg = "bg-red-50 text-red-600";
              } else if (isWarning) {
                statusColor = "text-amber-500";
                borderColor = "border-l-amber-400";
                iconBg = "bg-amber-50 text-amber-500 border-amber-100";
                pillBg = "bg-amber-50 text-amber-600";
              } else {
                statusColor = "text-emerald-500";
                borderColor = "border-l-emerald-400";
                iconBg = "bg-emerald-50 text-emerald-500 border-emerald-100";
                pillBg = "bg-emerald-50 text-emerald-600";
              }

              return (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${borderColor}`}
                  onClick={() => navigate(`/activity/${task.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconBg}`}>
                      {isUrgent ? <AlertCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{task.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                          {task.estado?.nombre || 'General'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {task.creador?.nombre || 'Docente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${pillBg}`}>
                      {diffDays > 0 ? `${diffDays}d restantes` : diffDays === 0 ? 'Vence hoy' : 'Vencida'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;
