import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Lock, BookOpen, LogOut, Camera, Loader2, PlayCircle, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserDashboard: React.FC = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { data } = useContent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'profile' | 'security'>('courses');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Password Form State
  const [passForm, setPassForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  // --- Calculations ---
  const myCourses = data.courses.filter(c => user.purchasedCourseIds.includes(c.id));
  
  const getProgress = (courseId: string) => {
    const course = data.courses.find(c => c.id === courseId);
    if(!course) return 0;
    
    let totalLessons = 0;
    course.modules.forEach(m => totalLessons += m.lessons.length);
    
    if(totalLessons === 0) return 0;
    
    // Count how many lesson IDs from this course are in user.completedLessonIds
    const completedCount = course.modules.reduce((acc, mod) => {
        return acc + mod.lessons.filter(l => user.completedLessonIds?.includes(l.id)).length;
    }, 0);

    return Math.round((completedCount / totalLessons) * 100);
  };

  // --- Handlers ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
        await updateProfile(profileForm);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if(passForm.new !== passForm.confirm) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          return;
      }
      setIsLoading(true);
      setMessage(null);
      try {
          await changePassword(passForm.current, passForm.new);
          setMessage({ type: 'success', text: 'Password changed successfully!' });
          setPassForm({ current: '', new: '', confirm: '' });
      } catch (error: any) {
          setMessage({ type: 'error', text: error.message || 'Failed to change password' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
          if (file.size > 2000000) {
              setMessage({ type: 'error', text: 'Image too large (Max 2MB)' });
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                    <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                             <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                                 {profileForm.avatar ? (
                                     <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                                 ) : (
                                     <User className="w-full h-full p-4 text-slate-300" />
                                 )}
                             </div>
                        </div>
                        <h2 className="font-bold text-slate-900 text-lg">{user.name}</h2>
                        <p className="text-slate-500 text-sm">{user.email}</p>
                    </div>
                    <nav className="p-2">
                        <button 
                            onClick={() => setActiveTab('courses')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'courses' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <LayoutDashboard size={18} /> My Learning
                        </button>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <User size={18} /> Profile Settings
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Lock size={18} /> Security
                        </button>
                        <div className="border-t border-slate-100 my-2 pt-2">
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <CheckCircle size={18}/> : <Lock size={18}/>} 
                            {message.text}
                        </div>
                    )}

                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <BookOpen className="text-indigo-600" /> My Learning
                            </h2>
                            
                            {myCourses.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-xl">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No courses yet</h3>
                                    <p className="text-slate-500 mb-6">Start your journey by exploring our premium courses.</p>
                                    <Link to="/courses" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        Browse Courses
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {myCourses.map(course => {
                                        const progress = getProgress(course.id);
                                        return (
                                            <div key={course.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                                                <div className="h-40 overflow-hidden relative">
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Link to={`/learn/${course.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                            <PlayCircle className="text-indigo-600 ml-1" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                                                    <div className="mt-auto">
                                                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                                            <span>Progress</span>
                                                            <span>{progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                                                            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            {progress === 100 ? (
                                                                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">
                                                                    <Award size={14} /> Certified
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-slate-400">{progress === 0 ? 'Not Started' : 'In Progress'}</span>
                                                            )}
                                                            <Link to={`/learn/${course.id}`} className="text-sm font-bold text-indigo-600 hover:underline">
                                                                {progress === 0 ? 'Start Learning' : 'Resume'}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="text-indigo-600" /> Edit Profile
                            </h2>
                            <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 relative group">
                                            {profileForm.avatar ? (
                                                <img src={profileForm.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-4 text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            <label className="px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
                                                <Camera size={16} /> Change Photo
                                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                            </label>
                                            <p className="text-xs text-slate-400 mt-2">Max file size 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={profileForm.email}
                                            readOnly // Email usually hard to change without verification
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                    <textarea 
                                        rows={4}
                                        value={profileForm.bio}
                                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Lock className="text-indigo-600" /> Change Password
                            </h2>
                            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={passForm.current}
                                        onChange={(e) => setPassForm({...passForm, current: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                                        <input 
                                            type="password" 
                                            value={passForm.new}
                                            onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            value={passForm.confirm}
                                            onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};