import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../api/api';
import { Eye, EyeOff, Loader2, Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Orbs specific to Login */}
      <div className="absolute top-1/4 left-1/4 w-[30vh] h-[30vh] bg-blue-500/30 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vh] h-[30vh] bg-fuchsia-500/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-4s' }} />

      <div className="w-full max-w-lg card p-8 sm:p-12 relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/10 border border-white/20 mb-6 shadow-xl backdrop-blur-md">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Access Lumina</h1>
          <p className="text-slate-400">Welcome back! Please enter your details.</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" /> Demo Credentials
          </div>
          <p className="text-xs text-slate-300">Student: <span className="text-white font-mono">student@lms.com / test1234</span></p>
          <p className="text-xs text-slate-300">Instructor: <span className="text-white font-mono">instructor@lms.com / test1234</span></p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              className="input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field pr-12"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Entering...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-bold hover:text-fuchsia-400 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
