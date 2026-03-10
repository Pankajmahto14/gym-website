import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  VideoCameraIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  UserGroupIcon,
  MapPinIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const navItems = [
  { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/admin/about', icon: DocumentTextIcon, label: 'About' },
  { to: '/admin/trainers', icon: UserGroupIcon, label: 'Trainers' },
  { to: '/admin/find-us', icon: MapPinIcon, label: 'Find Us' },
  { to: '/admin/images', icon: PhotoIcon, label: 'Images' },
  { to: '/admin/videos', icon: VideoCameraIcon, label: 'Videos' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full bg-dark-100 border-r border-white/5 ${
        mobile ? 'w-64' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <div>
            <div className="font-display font-bold text-sm">FIT N FEAT</div>
            <div className="text-gray-500 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="text-sm text-white truncate mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-dark-100">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="font-display font-bold text-sm text-gradient">
            FIT N FEAT Admin
          </span>
          <div className="w-6" />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
