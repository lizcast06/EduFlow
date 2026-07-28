import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { evidenceService } from '../services/evidenceService';
import { commentService } from '../services/commentService';
import { AuthContext } from '../context/AuthContext';
import CommentList from '../components/CommentList';
import EvidenceLinkInput from '../components/EvidenceLinkInput';
import { ArrowLeft, ExternalLink, Clock, AlertCircle, UploadCloud, Calendar, User, CheckCircle2, History, MessageSquare, Check, X } from 'lucide-react';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [activity, setActivity] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'history'

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const actData = await activityService.getById(id);
      setActivity(actData);
      
      const [evData, comData, histData] = await Promise.all([
        evidenceService.getByActivity(id),
        commentService.getByActivity(id),
        activityService.getHistorial(id)
      ]);
      setEvidences(evData);
      setComments(comData);
      setHistory(histData);
    } catch (error) {
      console.error('Error loading activity details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvidence = async (evidenceData) => {
    try {
      await evidenceService.add(id, evidenceData);
      const evData = await evidenceService.getByActivity(id);
      setEvidences(evData);
    } catch (error) {
      console.error('Error adding evidence:', error);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      await commentService.create(id, commentData);
      const comData = await commentService.getByActivity(id);
      setComments(comData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAprobarTarea = async () => {
    try {
      if (evidences.length === 0) {
        alert('No se puede aprobar sin evidencias.');
        return;
      }
      await activityService.updateStatus(id, 'Completado');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al aprobar la tarea');
    }
  };

  const handleRechazarTarea = async () => {
    const feedback = window.prompt("Ingresa el motivo del rechazo (Feedback):");
    if (feedback) {
      try {
        await commentService.create(id, { contenido: `[RECHAZO] ${feedback}` });
        await activityService.updateStatus(id, 'En desarrollo');
        loadData();
      } catch (error) {
        console.error('Error al rechazar:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Cargando detalles de la actividad...</div>;
  }

  if (!activity) {
    return <div className="p-8 text-center text-red-500 font-medium">Actividad no encontrada</div>;
  }

  // Calculate time remaining
  const dueDate = new Date(activity.fecha_limite);
  const today = new Date();
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  const isUrgent = diffDays <= 2;
  const isOverdue = diffDays < 0;

  // Drag and drop handlers for visual effect
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-[#F9FAFB]">
      <button 
        onClick={() => navigate('/board')}
        className="flex items-center gap-2 text-indigo-500 font-semibold hover:text-indigo-700 mb-8 transition-colors bg-indigo-50 px-4 py-2 rounded-xl w-fit"
      >
        <ArrowLeft size={18} /> Volver al tablero
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100">
                {activity.estado?.nombre || 'General'}
              </span>
              <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-lg shadow-sm text-white ${activity.prioridad === 'Alta' ? 'bg-red-500 shadow-red-500/30' : activity.prioridad === 'Media' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                {activity.prioridad || 'Prioridad'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{activity.titulo}</h1>
            
            <div className="bg-[#F8F9FC] p-6 rounded-2xl border border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Descripción de la actividad</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {activity.descripcion || 'Sin descripción detallada.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Asignado por</p>
                  <p className="font-bold text-gray-800">{activity.creador?.nombre || 'Docente'}</p>
                </div>
              </div>

              {activity.asignaciones && activity.asignaciones.length > 0 && (
                <div className="flex items-start gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Asignado a</p>
                    <div className="flex flex-col gap-1 mt-1">
                      {activity.asignaciones.map((asig, idx) => (
                        <p key={idx} className="font-bold text-gray-800 text-sm">
                          {asig.usuario?.nombre}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">Fecha de inicio</p>
                  <p className="font-bold text-gray-800">{new Date(activity.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
             <div className="flex items-center gap-6 mb-6 border-b border-gray-100 pb-4">
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-2 text-lg font-bold pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'comments' ? 'border-indigo-600 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  <MessageSquare size={20} /> Discusión y Comentarios
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 text-lg font-bold pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-600 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  <History size={20} /> Historial
                </button>
             </div>

             {activeTab === 'comments' ? (
                <CommentList comments={comments} onAddComment={handleAddComment} />
             ) : (
                <div className="flex flex-col gap-4">
                  {history.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">No hay historial registrado.</p>
                  ) : (
                    history.map((evento) => (
                      <div key={evento.id} className="flex gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center shrink-0">
                          <History size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">{evento.accion}</span>
                            <span className="text-xs text-gray-400">• {new Date(evento.fecha).toLocaleString('es-ES')}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{evento.detalles}</p>
                          <p className="text-xs text-indigo-500 font-medium">Por: {evento.usuario ? evento.usuario.nombre : 'Sistema'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             )}
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-8">
          
          {/* Timer Card */}
          <div className={`p-8 rounded-3xl shadow-lg border relative overflow-hidden ${isOverdue ? 'bg-red-500 border-red-600' : isUrgent ? 'bg-amber-500 border-amber-600' : 'bg-indigo-600 border-indigo-700'}`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-white">
              <div className="flex items-center gap-2 font-semibold mb-4 text-white/80 text-sm uppercase tracking-wider">
                {isOverdue ? <AlertCircle size={18} /> : <Clock size={18} />}
                Tiempo Restante
              </div>
              
              <div className="text-4xl font-bold mb-2">
                {isOverdue ? 'Vencida' : diffDays === 0 ? (diffHours > 0 ? `${diffHours} horas` : 'Vence hoy') : `${diffDays} días`}
              </div>
              
              <p className="text-sm text-white/80 font-medium">
                Fecha límite: {dueDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              </p>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Evidencias</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {evidences.length === 0 ? (
                <div className="bg-gray-50 text-gray-400 p-4 rounded-xl text-center text-sm font-medium border border-dashed border-gray-200">
                  Aún no se han subido evidencias.
                </div>
              ) : null}
              {evidences.map(ev => (
                <a 
                  key={ev.id}
                  href={ev.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group bg-white border border-gray-100 hover:border-indigo-300 p-3 rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="truncate text-sm font-medium text-gray-700">{ev.archivo_url}</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Controles de Docente */}
            {user?.rol?.nombre === 'Docente' && evidences.length > 0 && activity?.estado?.nombre !== 'Completado' && (
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-500 uppercase text-center mb-1">Validación del Docente</p>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRechazarTarea}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                  >
                    <X size={16} /> Rechazar
                  </button>
                  <button 
                    onClick={handleAprobarTarea}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-emerald-500/20"
                  >
                    <Check size={16} /> Aprobar
                  </button>
                </div>
              </div>
            )}

            {/* Drag & Drop Visual Zone */}
            {activity?.estado?.nombre !== 'Completado' && (
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all mt-6 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-[#F8F9FC] hover:bg-gray-50'}`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-500 border border-gray-100">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">Subir enlace de evidencia</p>
                <p className="text-xs text-gray-500 mb-4">Ingresa el link de Drive, Docs o GitHub</p>
                
                <div onClick={e => e.stopPropagation()}>
                  <EvidenceLinkInput onAdd={handleAddEvidence} />
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
