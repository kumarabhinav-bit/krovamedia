import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { ArrowLeft, Calendar, User, CheckCircle } from 'lucide-react';

export const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useContent();
  const navigate = useNavigate();

  const project = data.portfolio.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section - Main Image */}
      <div className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={18} /> Back to Portfolio
          </button>
          
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {project.description}
            </p>
          </div>

          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-16">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Project Info</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <User size={18} />
                      <span className="font-semibold text-sm uppercase">Client</span>
                    </div>
                    <p className="text-slate-700 font-medium pl-6.5">{project.client || "Confidential"}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <Calendar size={18} />
                      <span className="font-semibold text-sm uppercase">Timeline</span>
                    </div>
                    <p className="text-slate-700 font-medium pl-6.5">{project.timeline || "2024"}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <CheckCircle size={18} />
                      <span className="font-semibold text-sm uppercase">Services</span>
                    </div>
                    <p className="text-slate-700 font-medium pl-6.5">{project.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-12">
              {project.challenge && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">The Challenge</h3>
                  <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Solution</h3>
                  <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {(project.gallery && project.gallery.length > 0) && (
        <div className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Project Gallery</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="group overflow-hidden rounded-xl shadow-lg border border-slate-100">
                  <img 
                    src={img} 
                    alt={`${project.title} gallery ${idx + 1}`} 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Step CTA */}
      <div className="bg-slate-900 py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Like what you see?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Let's apply the same level of creativity and strategy to your brand.
          </p>
          <a 
            href="#contact"
            onClick={(e) => {
               e.preventDefault();
               navigate('/');
               setTimeout(() => {
                 document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
               }, 100);
            }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all inline-block"
          >
            Start Your Project
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};