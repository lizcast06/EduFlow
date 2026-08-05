import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { indicatorService } from '../services/indicatorService';
import { activityService } from '../services/activityService';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle2, Clock, Flag, AlertCircle, ChevronRight, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
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
      setAllActivities(tasksData || []);
      
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
    return <div className="p-8 text-center text-slate-500">Cargando progreso académico...</div>;
  }

  // Get specific stats by state name
  const getStatByState = (stateName) => {
    if (!stats?.actividadesPorEstado) return 0;
    const found = stats.actividadesPorEstado.find(st => st.estado?.nombre === stateName);
    return found ? found.total : 0;
  };

  const completed = getStatByState('Completado');
  const inProgress = getStatByState('En Proceso') + getStatByState('En Revisión');
  const todo = getStatByState('Pendiente');

  // Calcular avance por responsable (HU-17)
  const userStatsMap = {};
  allActivities.forEach(act => {
    if (act.asignaciones && act.asignaciones.length > 0) {
      act.asignaciones.forEach(asignacion => {
        const userId = asignacion.usuario?.id;
        if (!userId) return;
        if (!userStatsMap[userId]) {
          userStatsMap[userId] = {
            user: asignacion.usuario,
            total: 0,
            completadas: 0,
            pendientes: 0,
            enProceso: 0,
            enRevision: 0,
          };
        }
        
        userStatsMap[userId].total += 1;
        
        const status = act.estado?.nombre;
        if (status === 'Completado') userStatsMap[userId].completadas += 1;
        else if (status === 'Pendiente') userStatsMap[userId].pendientes += 1;
        else if (status === 'En Proceso') userStatsMap[userId].enProceso += 1;
        else if (status === 'En Revisión') userStatsMap[userId].enRevision += 1;
      });
    }
  });
  const teamProgress = Object.values(userStatsMap);

  // Data for the chart
  const chartData = [
    { name: 'Completadas', value: completed, color: '#10B981' }, // emerald-500
    { name: 'En Progreso', value: inProgress, color: '#4F46E5' }, // indigo-600
    { name: 'Por Hacer', value: todo, color: '#F59E0B' } // amber-500
  ].filter(item => item.value > 0); // Hide empty slices

  return (
    <div className="p-6 md:p-10 min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de Indicadores</h1>
          <p className="text-sm text-slate-500 mt-1">Vista general del estado de proyectos</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm hover:scale-105 transition-transform hover:shadow-md ring-2 ring-transparent hover:ring-indigo-200" title="Ir a mi Perfil">
            {user?.nombre?.[0]?.toUpperCase() || 'U'}
          </Link>
        </div>
      </div>

      {/* Welcome Banner & Total Progress */}
      <div className="bg-indigo-950 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end z-10 relative">
          <div>
            <p className="text-indigo-200 text-sm mb-1">Bienvenido de vuelta, 👋</p>
            <h2 className="text-3xl font-bold mb-1">{user?.nombre || 'Docente'}</h2>
            <p className="text-indigo-300 text-sm">{user?.rol?.nombre === 'Docente' ? 'Panel de Administración de Proyectos' : 'Panel de Estudiante'} · {todo + inProgress} tareas activas</p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-indigo-200 text-sm mb-1">Avance Total</p>
            <h2 className="text-4xl font-bold leading-none mb-1">{stats?.porcentajeCompletado || 0}%</h2>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 z-10 relative">
          <div className="flex justify-between text-xs font-semibold text-indigo-200 mb-2">
            <span>Progreso global del proyecto</span>
            <span>{stats?.porcentajeCompletado || 0}% Completado</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
              style={{ width: `${stats?.porcentajeCompletado || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* State Cards (2/3 width on desktop) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Completadas */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100">
              <CheckCircle2 size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{completed}</h3>
            <p className="text-xs font-medium text-slate-500">Completadas</p>
          </div>

          {/* En Progreso */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-200">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{inProgress}</h3>
            <p className="text-xs font-medium text-slate-500">En Progreso</p>
          </div>

          {/* Por Hacer */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 border border-amber-100">
              <Flag size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{todo}</h3>
            <p className="text-xs font-medium text-slate-500">Por Hacer</p>
          </div>
        </div>

        {/* Chart Section (1/3 width on desktop) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
          <h3 className="font-bold text-slate-900 mb-4 absolute top-6 left-6">Distribución</h3>
          {chartData.length > 0 ? (
            <div className="w-full h-48 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} tareas`, 'Cantidad']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full h-48 mt-8 flex items-center justify-center text-slate-400 text-sm">
              Sin datos para mostrar
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            Alertas y Próximas Entregas
          </h3>
          <button onClick={() => navigate('/board')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="flex flex-col">
          {urgentTasks.length === 0 ? (
             <div className="p-8 text-center text-slate-500 text-sm">No tienes tareas pendientes urgentes. ¡Buen trabajo!</div>
          ) : (
            urgentTasks.map((task) => {
              // RN-14 Calculation
              const todayStart = new Date();
              todayStart.setHours(0, 0, 0, 0);
              
              const dueStart = new Date(task.fecha_limite);
              dueStart.setHours(0, 0, 0, 0);

              const diffTime = dueStart - todayStart;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              const isCompleted = task.estado?.nombre === 'Completado';
              // Regla de Negocio RN-14:
              const isOverdue = !isCompleted && diffDays < 0; 
              
              const isDueToday = !isCompleted && diffDays === 0;
              const isWarning = !isCompleted && diffDays > 0 && diffDays <= 7;
              
              let statusColor = "bg-slate-100 text-slate-600";
              let borderColor = "border-l-slate-300";
              let iconBg = "bg-slate-50 text-slate-500";
              let pillBg = "bg-slate-100 text-slate-600";
              
              if (isOverdue || isDueToday) {
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
                  className={`flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 ${borderColor}`}
                  onClick={() => navigate(`/activity/${task.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${iconBg}`}>
                      {(isOverdue || isDueToday) ? <AlertCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{task.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                          {task.estado?.nombre || 'General'}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                            <AlertCircle size={10} /> Vencida
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${pillBg}`}>
                      {isOverdue ? 'Atrasada' : isDueToday ? 'Vence hoy' : `${diffDays}d restantes`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {dueStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Team Progress Section (HU-17) */}
      {(user?.rol?.nombre === 'Docente' || user?.rol?.nombre === 'Administrador' || user?.rol?.nombre === 'Project Manager') && teamProgress.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-6 mb-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <User size={20} className="text-indigo-500" />
              Avance por Responsable
            </h3>
            <p className="text-xs text-slate-500 mt-1">Monitoreo de carga de trabajo y progreso individual del equipo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamProgress.map((member, idx) => (
              <div key={idx} className="bg-[#F8F9FC] rounded-2xl p-5 border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {member.user?.nombre?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 truncate max-w-[150px]" title={member.user?.nombre}>{member.user?.nombre}</h4>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{member.user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-600">Avance</span>
                  <span className="font-bold text-emerald-600">
                    {Math.round((member.completadas / member.total) * 100) || 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.round((member.completadas / member.total) * 100) || 0}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Pendientes</span>
                    <span className="font-bold text-slate-700">{member.pendientes}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">En Proceso</span>
                    <span className="font-bold text-indigo-600">{member.enProceso}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">En Revisión</span>
                    <span className="font-bold text-amber-600">{member.enRevision}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500">Completadas</span>
                    <span className="font-bold text-emerald-600">{member.completadas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DashboardPage;
