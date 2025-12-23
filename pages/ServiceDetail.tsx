import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { Contact } from './Home'; // Reuse the Contact component logic
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useContent();
  const navigate = useNavigate();

  const service = data.services.find((s) => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Service Not Found</h2>
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
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            {service.image && (
                <img src={service.image} className="w-full h-full object-cover blur-sm" alt="bg" />
            )}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{service.title}</h1>
            <p className="text-xl text-slate-300 leading-relaxed">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Service</h2>
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line mb-8">
              {service.longDescription || service.description}
            </p>
            
            {service.features && service.features.length > 0 && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 text-xl">Key Features & Benefits</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 w-6 h-6 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:pl-12">
            <div className="sticky top-28">
              {/* Pass the service title to pre-fill the form */}
              <Contact isEmbedded={true} initialService={service.title} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};