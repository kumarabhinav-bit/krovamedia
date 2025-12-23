import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, CheckCircle, Lock, Unlock, ShoppingCart, Loader2, Video, Users } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useContent();
  const { user, hasAccess } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const course = data.courses.find(c => c.id === id);
  const userHasAccess = id ? hasAccess(id) : false;

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <h2 className="text-xl font-bold">Course not found</h2>
         <button onClick={() => navigate('/courses')} className="text-indigo-600 underline mt-2">Back to courses</button>
       </div>
    </div>
  );

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (userHasAccess) {
        navigate(`/learn/${course.id}`);
        return;
    }

    // Navigate to checkout
    navigate(`/checkout/${course.id}`);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <div className="bg-slate-900 pt-32 pb-20 text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-500/30">
              Bestseller
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
            <p className="text-xl text-slate-300 mb-8">{course.shortDescription}</p>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
              <span>By {course.instructor}</span>
              <span>•</span>
              <span>{course.modules.length} Modules</span>
              <span>•</span>
              <span>Lifetime Access</span>
            </div>

            <button 
              onClick={handleBuy}
              disabled={isProcessing}
              className={`px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-all ${
                userHasAccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" /> Processing...</>
              ) : userHasAccess ? (
                <><PlayCircle /> Go to Course</>
              ) : (
                <><ShoppingCart /> Buy Now for ₹{course.price.toLocaleString()}</>
              )}
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-video">
             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                   <PlayCircle size={40} fill="white" className="opacity-80" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
              <div className="space-y-4">
                 {course.modules.map((mod, idx) => (
                   <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-800 flex justify-between">
                         <span>Module {idx + 1}: {mod.title}</span>
                         <span className="text-slate-500 text-sm font-normal">{mod.lessons.length} Lessons</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                         {mod.lessons.map(lesson => (
                           <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                              <div className="flex items-center gap-3">
                                 {lesson.type === 'live' ? <Users size={18} className="text-red-500" /> : <Video size={18} className="text-slate-400" />}
                                 <span className="text-slate-700">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                 {lesson.isFreePreview ? (
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Preview</span>
                                 ) : (userHasAccess ? <Unlock size={14} className="text-green-500"/> : <Lock size={14} className="text-slate-300" />)}
                                 <span className="text-slate-400 text-sm">{lesson.duration}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-12">
                 <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
                 <p className="text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>
           </div>

           <div>
              <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                 <h3 className="font-bold text-xl mb-4">What you'll learn</h3>
                 <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-600 text-sm">
                       <CheckCircle size={18} className="text-green-500 shrink-0" />
                       <span>Build real-world projects</span>
                    </li>
                    <li className="flex gap-3 text-slate-600 text-sm">
                       <CheckCircle size={18} className="text-green-500 shrink-0" />
                       <span>Certificate of completion</span>
                    </li>
                    <li className="flex gap-3 text-slate-600 text-sm">
                       <CheckCircle size={18} className="text-green-500 shrink-0" />
                       <span>Access on mobile and TV</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};