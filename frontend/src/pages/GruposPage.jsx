import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { grupoService } from '../services/grupoService';
import { Users, Plus, Key, Copy, Check } from 'lucide-react';

const GruposPage = () => {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // For Docente
  const [nombreGrupo, setNombreGrupo] = useState('');
  
  // For Estudiante
  const [codigoAcceso, setCodigoAcceso] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadGrupos();
  }, []);

  const loadGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch (error) {
      console.error('Error cargando grupos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await grupoService.create({ nombre: nombreGrupo });
      setNombreGrupo('');
      setIsModalOpen(false);
      loadGrupos();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al crear grupo');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await grupoService.join(codigoAcceso);
      setCodigoAcceso('');
      setIsModalOpen(false);
      loadGrupos();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al unirse al grupo');
    }
  };

  const handleCopyCode = (codigo) => {
    navigator.clipboard.writeText(codigo);
    setCopiedCode(codigo);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando grupos...</div>;

  const isDocente = user?.rol?.nombre === 'Docente' || user?.rol?.nombre === 'Administrador';

  return (
    <div className="p-6 md:p-10 min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Grupos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isDocente ? 'Administra tus grupos y códigos de acceso' : 'Tus grupos inscritos'}
          </p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setErrorMessage(''); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2"
        >
          {isDocente ? <><Plus size={18} /><span>Crear Grupo</span></> : <><Key size={18} /><span>Unirse a Grupo</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            {isDocente ? 'No has creado ningún grupo aún.' : 'No te has unido a ningún grupo.'}
          </div>
        ) : (
          grupos.map((grupo) => (
            <div key={grupo.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{grupo.nombre}</h3>
                  <p className="text-xs text-gray-500">{grupo.estudiantes?.length || 0} estudiantes</p>
                </div>
              </div>
              
              {isDocente && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Código de acceso</p>
                    <p className="font-mono font-bold text-gray-900 tracking-widest">{grupo.codigo_acceso}</p>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(grupo.codigo_acceso)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-indigo-100 shadow-sm"
                    title="Copiar código"
                  >
                    {copiedCode === grupo.codigo_acceso ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              )}

              {!isDocente && grupo.docente && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Docente:</span> {grupo.docente.nombre}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isDocente ? 'Crear Nuevo Grupo' : 'Unirse a un Grupo'}
              </h2>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={isDocente ? handleCreateGroup : handleJoinGroup}>
                {isDocente ? (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Grupo</label>
                    <input
                      type="text"
                      required
                      value={nombreGrupo}
                      onChange={(e) => setNombreGrupo(e.target.value)}
                      placeholder="Ej. 9no Cuatrimestre A"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Código de Acceso</label>
                    <input
                      type="text"
                      required
                      value={codigoAcceso}
                      onChange={(e) => setCodigoAcceso(e.target.value.toUpperCase())}
                      placeholder="Ej. A1B2C3D4"
                      className="w-full font-mono text-center tracking-widest px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase"
                    />
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20"
                  >
                    {isDocente ? 'Crear' : 'Unirme'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GruposPage;
