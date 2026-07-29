import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield } from 'lucide-react';

const UserFormModal = ({ onClose, onSave, initialData }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: 2 // Default Estudiante
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        email: initialData.email || '',
        password: '', // Leave empty for edit unless they want to change it (though API doesn't support changing password in update yet)
        rol_id: initialData.rol_id || 2
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rol_id' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // If editing, don't send empty password
      const submitData = { ...formData };
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }
      
      await onSave(submitData);
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al guardar el usuario.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <User size={16} className="text-indigo-500" />
                Nombre completo
              </label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                Correo Electrónico
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Password */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <Lock size={16} className="text-indigo-500" />
                  Contraseña
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required={!isEditing}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            )}

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Shield size={16} className="text-indigo-500" />
                Rol del sistema
              </label>
              <select 
                name="rol_id"
                value={formData.rol_id}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                <option value={3}>Administrador</option>
                <option value={1}>Docente</option>
                <option value={2}>Estudiante</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
