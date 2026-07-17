import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban,
  LogOut, 
  Menu, 
  X, 
  User,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/board', label: 'Actividades', icon: Kanban },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Top Navbar */}
      <header className="md:hidden bg-indigo-950 border-b border-indigo-900 px-4 py-3 flex items-center justify-between shadow-sm z-30 text-white">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded-lg text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">TaskBoard</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-lg text-indigo-200 hover:bg-indigo-800 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar (Desktop and Mobile drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-[#232145] text-white z-40 flex flex-col justify-between
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:flex md:w-64
      `}>
        {/* Top Content */}
        <div>
          {/* Sidebar Header - Logo */}
          <div className="h-24 px-6 flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-tight">TaskBoard</span>
              <span className="text-xs text-indigo-300 font-medium">Académico</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="px-4 mb-6">
            <div className="bg-[#312F5E] p-3 rounded-xl flex items-center gap-3 shadow-inner border border-white/5">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
                {user?.nombre?.[0]?.toUpperCase() || <User size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-indigo-300 truncate capitalize">{user?.rol?.nombre || user?.rol || 'Rol'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="px-4">
            <p className="text-xs font-semibold text-indigo-400 mb-3 px-2 tracking-wider uppercase">Menú</p>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/board' && location.pathname.includes('/activity'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                        : 'text-indigo-200 hover:bg-[#312F5E] hover:text-white'}
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-indigo-300'} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Logout Section Bottom */}
        <div className="p-4 mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-300 hover:bg-[#312F5E] hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/50">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
