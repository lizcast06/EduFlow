import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  Users as UsersIcon, 
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
    { path: '/board', label: 'Tablero Kanban', icon: Kanban },
    { path: '/users', label: 'Usuarios', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Top Navbar */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">TaskBoard</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar (Desktop and Mobile drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-gray-200 z-40 flex flex-col justify-between shadow-sm
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:flex md:w-64
      `}>
        {/* Sidebar Header */}
        <div>
          <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/20">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">TaskBoard</span>
            </div>
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-500'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info / Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {user?.name?.[0] || <User size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Invitado'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Rol no definido'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
