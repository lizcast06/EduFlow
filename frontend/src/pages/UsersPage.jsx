import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { 
  Plus, 
  Search, 
  Edit2, 
  Power,
  PowerOff,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import UserFormModal from '../components/UserFormModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${user.activo ? 'desactivar' : 'activar'} a ${user.nombre}?`)) return;
    try {
      await usuarioService.toggleStatus(user.id);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cambiar estado del usuario');
    }
  };

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        await usuarioService.update(selectedUser.id, userData);
      } else {
        await usuarioService.create(userData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      throw error; // Will be caught by the modal to show error message
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'Administrador': 
      case 'Admin': return <Shield size={16} className="text-red-500" />;
      case 'Docente': return <Briefcase size={16} className="text-indigo-500" />;
      default: return <GraduationCap size={16} className="text-emerald-500" />;
    }
  };

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'Administrador': 
      case 'Admin': 
        return "bg-red-50 text-red-600 border-red-100";
      case 'Docente': 
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: 
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
  };

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el acceso de estudiantes y docentes</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar usuario..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0 justify-center"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Cargando usuarios...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Usuario</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Rol</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Estado</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{user.nombre}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.rol?.nombre)}`}>
                          {getRoleIcon(user.rol?.nombre)}
                          {user.rol?.nombre}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.activo ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <UserCheck size={14} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                            <UserX size={14} /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar usuario"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${user.activo ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                            title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                          >
                            {user.activo ? <PowerOff size={16} /> : <Power size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserFormModal 
          onClose={handleCloseModal} 
          onSave={handleSave} 
          initialData={selectedUser} 
        />
      )}
    </div>
  );
};

export default UsersPage;
