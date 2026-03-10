import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

// Only this email is allowed to access admin (static check before Firebase)
const ALLOWED_ADMIN_EMAIL = 'info.fitnfeat@gmail.com';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter email and password.');
      return;
    }

    // Static validation: only allowed admin email can proceed to Firebase login
    const emailNormalized = form.email.trim().toLowerCase();
    if (emailNormalized !== ALLOWED_ADMIN_EMAIL) {
      toast.error('Invalid user. Access is restricted to authorized admin only.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.3) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="card-dark p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="font-display text-3xl font-bold">
              FIT N FEAT <span className="text-gradient">Admin</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to manage your gym content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  className="input-dark pl-10"
                  placeholder="Enter email here"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-dark pl-10 pr-10"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  {showPass ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 mt-2 disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-primary text-sm transition-colors">
              ← Back to Website
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
