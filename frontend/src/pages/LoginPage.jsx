import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, GraduationCap, Briefcase, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('estudiante'); // 'docente' or 'estudiante'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (activeTab === 'login') {
      if (!email || !password) {
        setError('Por favor, completa todos los campos.');
        return;
      }
    } else {
      if (!name || !email || !password) {
        setError('Por favor, completa todos los campos para registrarte.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        const res = await authService.login({ email, password });
        if (res.success) {
          login(res.data.usuario, res.data.token);
          navigate('/dashboard');
        }
      } else {
        const res = await authService.register({ 
          nombre: name, 
          email, 
          password, 
          rol: role === 'docente' ? 'Docente' : 'Estudiante' 
        });
        if (res.success) {
          login(res.data.usuario, res.data.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setActiveTab(activeTab === 'login' ? 'register' : 'login');
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C388E] via-[#4A45A9] to-[#3C388E] flex items-center justify-center p-4 font-sans text-white">
      
      {/* Main Card */}
      <div className="relative glass-panel rounded-3xl w-full max-w-[420px] p-8 shadow-2xl flex flex-col z-10 border border-white/10 my-4 sm:my-8 bg-white/5 backdrop-blur-2xl">
        
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#8A9CFF] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
            <ClipboardList size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">TaskBoard Académico</h1>
          <p className="text-sm text-indigo-200">Gestión académica inteligente</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form section */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-indigo-200/80 mb-3 uppercase tracking-wider">SELECCIONA TU ROL</p>
            <div className="flex gap-4">
              {/* Role: Estudiante */}
              <button 
                type="button"
                className={`relative flex-1 flex flex-col items-center justify-center py-6 rounded-2xl border transition-all ${role === 'estudiante' ? 'border-indigo-500 bg-indigo-600 shadow-md shadow-indigo-600/30' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                onClick={() => setRole('estudiante')}
              >
                {role === 'estudiante' && (
                  <div className="absolute top-2 right-2 bg-white/30 rounded-full p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <GraduationCap size={28} className="mb-3 text-white" />
                <span className="text-sm font-semibold text-white">Estudiante</span>
              </button>

              {/* Role: Docente */}
              <button 
                type="button"
                className={`relative flex-1 flex flex-col items-center justify-center py-6 rounded-2xl border transition-all ${role === 'docente' ? 'border-indigo-500 bg-indigo-600 shadow-md shadow-indigo-600/30' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                onClick={() => setRole('docente')}
              >
                {role === 'docente' && (
                  <div className="absolute top-2 right-2 bg-white/30 rounded-full p-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <Briefcase size={28} className="mb-3 text-indigo-200/80" />
                <span className="text-sm font-semibold text-indigo-200/80">Docente</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {activeTab === 'register' && (
              <div>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-indigo-200/60 focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all"
                />
              </div>
            )}

            <div>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-indigo-200/60 focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all"
              />
            </div>
            
            <div>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-indigo-200/60 focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#7885FF] hover:bg-[#6875EE] text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : (activeTab === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </button>

          <div className="text-center">
            <button type="button" onClick={toggleMode} className="text-sm text-indigo-200/80 hover:text-white transition-colors">
              {activeTab === 'login' ? (
                <>¿No tienes cuenta? <span className="font-bold text-white">Regístrate</span></>
              ) : (
                <>¿Ya tienes cuenta? <span className="font-bold text-white">Inicia sesión</span></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
