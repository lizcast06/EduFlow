import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, BookOpen, Shield, Zap, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('docente'); // 'docente' or 'estudiante'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor, completa todos los campos para registrarte.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (activeTab === 'login') {
        if (email === 'docente@escuela.edu' && password === '12345678') {
          login({ id: 1, name: 'Docente', role: 'docente' }, 'fake-jwt-token');
          navigate('/dashboard');
        } else if (email === 'estudiante@escuela.edu' && password === '12345678') {
          login({ id: 2, name: 'Estudiante', role: 'estudiante' }, 'fake-jwt-token');
          navigate('/dashboard');
        } else {
          setError('Credenciales incorrectas. Intenta de nuevo.');
        }
      } else {
        // Register flow
        login({ id: 3, name: name, role: role }, 'fake-jwt-token-new');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (tab) => {
    setActiveTab(tab);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2A5E] via-[#3E38A8] to-[#2B2874] flex items-center justify-center p-4 font-sans text-white">
      
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      {/* Main Card */}
      <div className="relative glass-panel rounded-xl w-full max-w-md p-6 sm:p-8 shadow-2xl flex flex-col z-10 border border-white/10 my-4 sm:my-8">
        
        {/* Header section */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="bg-indigo-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <GraduationCap size={28} className="text-white sm:hidden" />
            <GraduationCap size={32} className="text-white hidden sm:block" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">TaskBoard Académico</h1>
          <p className="text-xs sm:text-sm text-indigo-200 text-center">Plataforma educativa de gestión de tareas</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-1 mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'login' ? 'bg-indigo-600 shadow text-white' : 'text-indigo-200 hover:text-white'}`}
            onClick={() => resetForm('login')}
          >
            Iniciar sesión
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'register' ? 'bg-indigo-600 shadow text-white' : 'text-indigo-200 hover:text-white'}`}
            onClick={() => resetForm('register')}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form section */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-indigo-200 mb-3 uppercase tracking-wider">SOY UN(A)...</p>
            <div className="flex gap-3">
              {/* Role: Docente */}
              <button 
                type="button"
                className={`flex-1 flex items-center p-3 rounded-lg border transition-all ${role === 'docente' ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10 text-indigo-200'}`}
                onClick={() => setRole('docente')}
              >
                <div className={`p-2 rounded-full mr-3 ${role === 'docente' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-indigo-300'}`}>
                  <ShieldCheck size={16} />
                </div>
                <div className="text-left flex-1">
                  <p className={`text-sm font-medium ${role === 'docente' ? 'text-white' : 'text-indigo-100'}`}>Docente</p>
                  <p className="text-[10px] text-indigo-300">Crear actividades</p>
                </div>
                {role === 'docente' && <div className="w-4 h-4 rounded-full border-2 border-indigo-400 flex items-center justify-center"><div className="w-2 h-2 bg-indigo-400 rounded-full"></div></div>}
              </button>

              {/* Role: Estudiante */}
              <button 
                type="button"
                className={`flex-1 flex items-center p-3 rounded-lg border transition-all ${role === 'estudiante' ? 'border-indigo-400 bg-indigo-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10 text-indigo-200'}`}
                onClick={() => setRole('estudiante')}
              >
                <div className={`p-2 rounded-full mr-3 ${role === 'estudiante' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-indigo-300'}`}>
                  <BookOpen size={16} />
                </div>
                <div className="text-left flex-1">
                  <p className={`text-sm font-medium ${role === 'estudiante' ? 'text-white' : 'text-indigo-100'}`}>Estudiante</p>
                  <p className="text-[10px] text-indigo-300">Ver tareas</p>
                </div>
                {role === 'estudiante' && <div className="w-4 h-4 rounded-full border-2 border-indigo-400 flex items-center justify-center"><div className="w-2 h-2 bg-indigo-400 rounded-full"></div></div>}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="name">Nombre completo</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="email">Correo electrónico</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'docente' ? "docente@escuela.edu" : "estudiante@escuela.edu"}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="password">Contraseña</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
              />
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="confirmPassword">Confirmar contraseña</label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
              </div>
            )}

          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : (
              <>
                {activeTab === 'login' ? 'Entrar al sistema' : 'Crear cuenta'} <ArrowRight size={16} />
              </>
            )}
          </button>

          {activeTab === 'login' && (
            <div className="text-center">
              <Link to="/forgot-password" className="text-xs text-indigo-300 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

        </form>

        {/* Footer features */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-6 text-[10px] text-indigo-300 font-medium tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <Shield size={12} /> Seguro
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} /> Rápido
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={12} /> Confiable
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
