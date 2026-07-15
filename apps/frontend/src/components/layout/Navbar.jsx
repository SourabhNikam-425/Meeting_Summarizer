import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mic, LayoutDashboard, Upload, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload }];


  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center
                            group-hover:bg-brand-400 transition-colors duration-200">
              
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Meet<span className="gradient-text">Scribe</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active ?
                  'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                  'text-slate-400 hover:text-slate-100 hover:bg-surface-elevated'}`
                  }>
                  
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>);

            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center
                              text-xs font-bold text-white">
                
                {user ? getInitials(user.name) : 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10
                         transition-all duration-200">

              
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>);

}