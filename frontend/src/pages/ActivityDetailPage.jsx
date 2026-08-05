import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { evidenceService } from '../services/evidenceService';
import { commentService } from '../services/commentService';
import { AuthContext } from '../context/AuthContext';
import CommentList from '../components/CommentList';
import EvidenceLinkInput from '../components/EvidenceLinkInput';
import TaskForm from '../components/TaskForm';
import { ArrowLeft, ExternalLink, Clock, AlertCircle, UploadCloud, Calendar, User, CheckCircle2, History, MessageSquare, Check, X, Edit3, Trash2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'history' or 'grades'
  const [calificaciones, setCalificaciones] = useState({});
  const [retroalimentaciones, setRetroalimentaciones] = useState({});
  const [editingGrades, setEditingGrades] = useState({});
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 5000);
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

  const handleCalificar = async (estudianteId, asig) => {
    try {
      setSubmittingGrade(true);
      const data = {
        calificacion: calificaciones[estudianteId] !== undefined ? calificaciones[estudianteId] : asig.calificacion,
        retroalimentacion: retroalimentaciones[estudianteId] !== undefined ? retroalimentaciones[estudianteId] : asig.retroalimentacion
      };
      
      if (data.calificacion !== null && data.calificacion !== '') {
        data.calificacion = Number(data.calificacion);
      }

      await activityService.calificar(id, estudianteId, data);
      showError('Calificación guardada correctamente'); // we use showError to show temporary success message too
      setEditingGrades({ ...editingGrades, [estudianteId]: false });
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Error al calificar');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleAprobarTarea = async () => {
    try {
      if (evidences.length === 0) {
        showError('No se puede aprobar sin evidencias.');
        return;
      }
      await activityService.updateStatus(id, 'Completado');
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Error al aprobar la tarea');
    }
  };

  const handleRechazarTarea = async () => {
    const feedback = window.prompt("Ingresa el motivo del rechazo (Feedback):");
    if (feedback) {
      try {
        await commentService.create(id, { contenido: `[RECHAZO] ${feedback}` });
        await activityService.updateStatus(id, 'En Proceso');
        loadData();
      } catch (error) {
        console.error('Error al rechazar:', error);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await activityService.updateStatus(id, newStatus);
      loadData();
    } catch (error) {
      console.error('Error al cambiar estatus:', error);
      showError(error.response?.data?.message || 'Hubo un error al cambiar el estatus.');
      loadData(); // Revert visual select box state on error
    }
  };

  const handleUpdateActivity = async (updatedData) => {
    try {
      await activityService.update(id, updatedData);
      setIsEditingActivity(false);
      loadData();
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
      alert("Hubo un error al actualizar la actividad.");
    }
  };

  const confirmDeleteActivity = async () => {
    try {
      await activityService.delete(id);
      navigate('/board');
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      alert("Hubo un error al eliminar la actividad.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Cargando detalles de la actividad...</div>;
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

  // RN-08 Check: Solo creador o Administrador pueden editar
  const canEdit = user && (user.id === activity.creador?.id || user.rol?.nombre === 'Administrador');

  // RN-09 Check: Un responsable asignado puede cambiar el estatus de su propia actividad
  const isAssignee = activity.asignaciones?.some(a => a.usuario?.id === user?.id);
  const canChangeStatus = canEdit || isAssignee;

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
          
          {isEditingActivity ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Editar Actividad</h2>
              <TaskForm 
                isEditing={true}
                initialData={{
                   titulo: activity.titulo,
                   descripcion: activity.descripcion,
                   prioridad: activity.prioridad,
                   fecha_limite: new Date(activity.fecha_limite).toISOString().split('T')[0],
                   asignados: activity.asignaciones?.map(a => a.usuario?.id) || []
                }}
                onSubmit={handleUpdateActivity}
                onCancel={() => setIsEditingActivity(false)}
              />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  {canChangeStatus ? (
                    <select
                      value={activity.estado?.nombre || 'Pendiente'}
                      onChange={handleStatusChange}
                      className="text-xs font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow cursor-pointer appearance-none"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="En Revisión">En Revisión</option>
                      {canEdit && <option value="Completado">Completado</option>}
                    </select>
                  ) : (
                    <span className="text-xs font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-200">
                      {activity.estado?.nombre || 'General'}
                    </span>
                  )}
                  <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-lg shadow-sm text-white ${activity.prioridad === 'Alta' ? 'bg-red-500 shadow-red-500/30' : activity.prioridad === 'Media' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                    {activity.prioridad || 'Prioridad'}
                  </span>
                </div>
                {canEdit && (
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsEditingActivity(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} /> Editar
                    </button>
                    <button 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-6">{activity.titulo}</h1>
              
              <div className="bg-[#F8F9FC] p-6 rounded-2xl border border-slate-100 mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Descripción de la actividad</h3>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {activity.descripcion || 'Sin descripción detallada.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Asignado por</p>
                    <p className="font-bold text-slate-800">{activity.creador?.nombre || 'Docente'}</p>
                  </div>
                </div>

                {activity.asignaciones && activity.asignaciones.length > 0 && (
                  <div className="flex items-start gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Asignado a</p>
                      <div className="flex flex-col gap-1 mt-1">
                        {activity.asignaciones.map((asig, idx) => (
                          <p key={idx} className="font-bold text-slate-800 text-sm">
                            {asig.usuario?.nombre}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Fecha de inicio</p>
                    <p className="font-bold text-slate-800">{activity.fecha_creacion ? new Date(activity.fecha_creacion).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
             <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 border-b border-slate-100 pb-4">
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-2 text-base md:text-lg font-bold pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'comments' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <MessageSquare size={18} className="md:w-5 md:h-5" /> Discusión y Comentarios
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 text-base md:text-lg font-bold pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <History size={18} className="md:w-5 md:h-5" /> Historial
                </button>
                <button 
                  onClick={() => setActiveTab('grades')}
                  className={`flex items-center gap-2 text-base md:text-lg font-bold pb-4 -mb-[17px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'grades' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <CheckCircle2 size={18} className="md:w-5 md:h-5" /> Calificaciones
                </button>
             </div>

             {activeTab === 'comments' ? (
                <CommentList comments={comments} onAddComment={handleAddComment} />
             ) : activeTab === 'history' ? (
                <div className="flex flex-col gap-4">
                  {history.length === 0 ? (
                    <p className="text-slate-500 italic text-center py-8">No hay historial registrado.</p>
                  ) : (
                    history.map((evento) => (
                      <div key={evento.id} className="flex gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center shrink-0">
                          <History size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-800">{evento.accion}</span>
                            <span className="text-xs text-slate-400">• {new Date(evento.fecha).toLocaleString('es-ES')}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{evento.detalles}</p>
                          <p className="text-xs text-indigo-500 font-medium">Por: {evento.usuario ? evento.usuario.nombre : 'Sistema'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             ) : (
                <div className="flex flex-col gap-6">
                  {!activity.asignaciones || activity.asignaciones.length === 0 ? (
                    <p className="text-slate-500 italic text-center py-8">No hay alumnos asignados a esta actividad.</p>
                  ) : (
                    activity.asignaciones
                      .filter(asig => canEdit || asig.usuario_id === user.id)
                      .map((asig) => (
                      <div key={asig.usuario_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[200px]">
                          <p className="font-bold text-slate-800 truncate" title={asig.usuario?.nombre}>{asig.usuario?.nombre}</p>
                          {asig.calificacion !== null && (
                            <p className="text-sm font-semibold text-emerald-600 mt-0.5">
                              Calificación: {asig.calificacion}/10
                            </p>
                          )}
                          {asig.retroalimentacion && !canEdit && (
                            <p className="text-sm mt-2 text-slate-700 italic border-l-2 border-indigo-300 pl-3 line-clamp-3">" {asig.retroalimentacion} "</p>
                          )}
                        </div>
                        {canEdit && (
                          <div className="flex-none max-w-full w-full md:w-auto">
                            {(asig.calificacion === null || editingGrades[asig.usuario_id]) ? (
                              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  placeholder="Nota (0-10)"
                                  className="w-full sm:w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none shrink-0"
                                  value={calificaciones[asig.usuario_id] !== undefined ? calificaciones[asig.usuario_id] : (asig.calificacion || '')}
                                  onChange={(e) => setCalificaciones({...calificaciones, [asig.usuario_id]: e.target.value})}
                                />
                                <input
                                  type="text"
                                  placeholder="Feedback opcional"
                                  className="w-full sm:w-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                  value={retroalimentaciones[asig.usuario_id] !== undefined ? retroalimentaciones[asig.usuario_id] : (asig.retroalimentacion || '')}
                                  onChange={(e) => setRetroalimentaciones({...retroalimentaciones, [asig.usuario_id]: e.target.value})}
                                />
                                <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                                  {asig.calificacion !== null && (
                                    <button
                                      onClick={() => setEditingGrades({ ...editingGrades, [asig.usuario_id]: false })}
                                      className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                      title="Cancelar"
                                    >
                                      <X size={18} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleCalificar(asig.usuario_id, asig)}
                                    disabled={submittingGrade}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2 justify-center flex-1 sm:flex-none"
                                  >
                                    <Check size={18} /> Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white px-4 py-3 rounded-lg border border-slate-100 shadow-sm w-full">
                                <div className="flex-1 min-w-[150px]">
                                  {asig.retroalimentacion ? (
                                    <p className="text-sm text-slate-600 italic truncate" title={asig.retroalimentacion}>" {asig.retroalimentacion} "</p>
                                  ) : (
                                    <p className="text-sm text-slate-400 italic">Sin retroalimentación</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => setEditingGrades({ ...editingGrades, [asig.usuario_id]: true })}
                                  className="flex items-center justify-center w-full sm:w-auto gap-1.5 px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors shrink-0"
                                >
                                  <Edit3 size={14} /> Editar
                                </button>
                              </div>
                            )}
                          </div>
                        )}
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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Evidencias</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {evidences.length === 0 ? (
                <div className="bg-slate-50 text-slate-400 p-4 rounded-xl text-center text-sm font-medium border border-dashed border-slate-200">
                  Aún no se han subido evidencias.
                </div>
              ) : null}
              {evidences.map(ev => (
                <a 
                  key={ev.id}
                  href={ev.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group bg-white border border-slate-100 hover:border-indigo-300 p-3 rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="truncate text-sm font-medium text-slate-700">{ev.archivo_url}</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Controles de Docente */}
            {user?.rol?.nombre === 'Docente' && evidences.length > 0 && activity?.estado?.nombre !== 'Completado' && (
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-500 uppercase text-center mb-1">Validación del Docente</p>
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
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all mt-6 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-[#F8F9FC] hover:bg-slate-50'}`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-500 border border-slate-100">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-1">Subir enlace de evidencia</p>
                <p className="text-xs text-slate-500 mb-4">Ingresa el link de Drive, Docs o GitHub</p>
                
                <div onClick={e => e.stopPropagation()}>
                  <EvidenceLinkInput onAdd={handleAddEvidence} />
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Eliminar Actividad</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              ¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer y borrará permanentemente todos los datos asociados.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteActivity}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-red-500/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailPage;
