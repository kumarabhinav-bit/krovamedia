import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Layout/Navbar';
import { Lock, Mail, User, ArrowRight, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const AuthPage: React.FC = () => {
  const { login, signup } = useAuth();
  const { data } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignupRoute = location.pathname === '/signup';
  
  const [isLogin, setIsLogin] = useState(!isSignupRoute);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Toggle between modes
  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError('');
      setSuccess('');
      setFormData({ name: '', email: '', password: '' });
      navigate(isLogin ? '/signup' : '/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/courses');
      } else {
        await signup(formData.name, formData.email, formData.password);
        // Successful signup logic: Switch to login
        setIsLogin(true);
        setSuccess('Account created successfully! Please login.');
        setFormData(prev => ({ ...prev, password: '' })); // Clear password
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 w-full max-w-md">
           <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                 {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500">
                {isLogin 
                   ? 'Enter your credentials to access your courses' 
                   : 'Start your learning journey with Krova'}
              </p>
           </div>

           {error && (
             <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center justify-center">
               {error}
             </div>
           )}

           {success && (
             <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center justify-center gap-2">
               <CheckCircle size={16} /> {success}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
             {!isLogin && (
               <div className="relative">
                 <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Full Name"
                   className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   required={!isLogin}
                 />
               </div>
             )}
             
             <div className="relative">
               <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
               <input 
                 type="email" 
                 placeholder="Email Address"
                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 required
               />
             </div>

             <div className="relative">
               <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
               <input 
                 type={showPassword ? "text" : "password"} 
                 placeholder="Password"
                 className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-600 transition-colors"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
             >
               {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Sign Up')}
             </button>
           </form>

           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-slate-600 text-sm">
               {isLogin ? "Don't have an account?" : "Already have an account?"}
               <button 
                 onClick={toggleMode}
                 className="ml-2 text-indigo-600 font-bold hover:underline"
               >
                 {isLogin ? 'Sign Up' : 'Login'}
               </button>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};