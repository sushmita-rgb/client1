import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, toggleDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const u = await login(email, password);
      if (u?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    try {
      await login('admin@riza.com', 'admin123');
      navigate('/admin');
    } catch (e) {
      toggleDemoAdmin();
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FFFDF9] p-8 sm:p-10 rounded-2xl border border-[#EBE3D5] shadow-soft-lg">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h2 className="font-serif text-3xl tracking-widest text-[#2C3E50] font-semibold">
              RIZA
            </h2>
            <span className="text-[9px] tracking-super-wide text-[#5C728A] font-medium uppercase block -mt-1">
              HANDMADE WITH LOVE
            </span>
          </Link>
          <h3 className="font-serif text-xl text-[#2C3E50] pt-2">Welcome Back</h3>
          <p className="text-xs text-[#5C728A]">Sign in to access your account & custom orders</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#4A607A] uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EBE3D5] text-sm text-[#2C3E50] focus:outline-none focus:border-[#B8D4F0]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center text-xs tracking-widest uppercase font-semibold text-white bg-[#4A607A] hover:bg-[#2C3E50] py-3.5 rounded-full shadow-soft transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        {/* Admin Quick Test Bypass */}
        <div className="pt-4 border-t border-[#FAF7F2] space-y-3">
          <button
            onClick={handleQuickAdminLogin}
            className="w-full text-center text-xs font-medium text-[#4A607A] bg-[#EBF3FA] hover:bg-[#D4E4F7] py-2.5 rounded-xl border border-[#B8D4F0] flex items-center justify-center transition-colors"
          >
            <ShieldCheck className="w-4 h-4 mr-2 text-[#D4AF37]" />
            Sign In as Store Owner / Admin
          </button>
          
          <p className="text-center text-xs text-[#5C728A]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#2C3E50] underline">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
