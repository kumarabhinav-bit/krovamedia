import React from 'react';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoursesPage: React.FC = () => {
  const { data } = useContent();
  const courses = data.courses || [];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 text-center">
           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Master New Skills</h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
             Premium courses designed by industry experts to help you scale your career and business.
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex-1">
        {courses.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No courses available at the moment. Check back soon!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                    ₹{course.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
                    <BookOpen size={14} /> 
                    <span>{course.modules?.length || 0} Modules</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{course.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-1">
                    {course.shortDescription}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-slate-700 font-bold text-sm">4.9</span>
                    </div>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Course <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};