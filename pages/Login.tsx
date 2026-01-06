import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const success = isLogin 
        ? await login(formData.email, formData.password)
        : await signup(formData.name, formData.email, formData.password);

      if (success) {
        navigate('/');
      } else {
        setError(isLogin ? 'Invalid email or password.' : 'Email already exists.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ezyflow</h1>
          <p className="text-slate-500 mt-2">Intelligent Order Management System</p>
        </div>

        {/* Dark Card Container */}
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8">
          <div className="mb-6 flex items-center justify-center border-b border-slate-800 pb-6">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`pb-1 px-4 text-sm font-medium transition-colors relative ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
              {isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>}
            </button>
            <div className="w-px h-4 bg-slate-700 mx-2"></div>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`pb-1 px-4 text-sm font-medium transition-colors relative ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Create Account
              {!isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-black focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-black focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-black focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-xs py-2 px-3 rounded-lg border border-red-500/20 flex items-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; 2024 Ezyflow. Secure Local Storage Version.
        </p>
      </div>
    </div>
  );
};