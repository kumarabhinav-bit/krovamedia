import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, MessageCircle, Send, Star, TrendingUp, DollarSign, Headphones, Megaphone, BarChart, Code, PenTool, Layout, Plus } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { useContent } from '../context/ContentContext';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Helper for Dynamic Icons ---
const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.Star;
  return <IconComponent className={className} />;
};

// --- Sections ---

const Hero = () => {
  const { data } = useContent();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={data.hero.backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 md:to-transparent md:bg-gradient-to-r md:from-white md:via-white/90 md:to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold mb-6 border border-indigo-100">
             🚀 {data.general.agencyName}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            {data.hero.headline}
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {data.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {data.general.ctaText} <ArrowRight size={20} />
            </button>
            <button 
               onClick={() => scrollTo('portfolio')}
               className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              View Our Work
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 hidden md:block">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

const Services = () => {
  const { data } = useContent();
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-indigo-600 font-semibold uppercase tracking-wider mb-3">Our Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to grow online</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col h-full"
            >
              <div className="p-8 flex-grow">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 overflow-hidden relative">
                    {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                    <IconRenderer name={service.icon} className="w-7 h-7" />
                    )}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm">{service.description}</p>
              </div>
              <div className="p-6 pt-0 mt-auto border-t border-slate-50">
                  <Link 
                    to={`/service/${service.id}`}
                    className="flex items-center text-indigo-600 font-semibold text-sm hover:gap-2 transition-all"
                  >
                      Learn More <ArrowRight size={16} className="ml-1" />
                  </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const { data } = useContent();
  return (
    <section id="why-us" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.whyUs.points.map((point, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <IconRenderer name={point.icon} className="w-8 h-8 text-indigo-600 mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">{point.title}</h4>
                  <p className="text-sm text-slate-600">{point.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="order-1 lg:order-2"
          >
            <h2 className="text-indigo-600 font-semibold uppercase tracking-wider mb-3">{data.general.agencyName} Difference</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">{data.whyUs.title}</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {data.whyUs.subtitle}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Dedicated project manager for every client</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Weekly performance reports & strategy calls</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span>Full-stack in-house team (No outsourcing)</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const { data } = useContent();
  const scrollToContact = () => {
      const el = document.getElementById('contact');
      if(el) el.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <section id="portfolio" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-indigo-400 font-semibold uppercase tracking-wider mb-3">Our Work</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Recent Success Stories</h3>
          </div>
          <button 
            onClick={scrollToContact}
            className="text-white border-b border-indigo-500 pb-1 hover:text-indigo-400 transition-colors"
          >
            Start your project &rarr;
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.portfolio.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-xl bg-slate-800"
            >
              <Link to={`/portfolio/${item.id}`} className="block h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 block">{item.category}</span>
                  <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                  <p className="text-slate-300 text-sm line-clamp-2">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const { data } = useContent();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {data.faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <Plus 
                  className={`text-indigo-600 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`} 
                />
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}
              >
                <p className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact = ({ isEmbedded = false, initialService = '' }: { isEmbedded?: boolean, initialService?: string }) => {
  const { data, updateData } = useContent();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: initialService || '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    if (initialService) {
      setFormState(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMessage = {
      id: Date.now().toString(),
      name: formState.name,
      email: formState.email,
      serviceOfInterest: formState.service,
      message: formState.message,
      date: new Date().toISOString()
    };

    // Save to context
    const updatedMessages = [newMessage, ...(data.messages || [])];
    const newData = { ...data, messages: updatedMessages };
    updateData(newData);

    setStatus('success');
    setFormState({ name: '', email: '', service: '', message: '' });
    
    // Reset status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  const content = (
    <div className={`container mx-auto px-6 ${isEmbedded ? 'px-0' : ''}`}>
      <div className={`grid ${isEmbedded ? '' : 'lg:grid-cols-2 gap-16'}`}>
        {!isEmbedded && (
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Let's Build Something Great Together.</h2>
            <p className="text-lg text-slate-600 mb-8">
              Ready to take your business to the next level? Fill out the form or reach out directly.
            </p>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                   <Send size={20} />
                 </div>
                 <div>
                   <h5 className="font-bold text-slate-900">Email Us</h5>
                   <p className="text-slate-600">{data.general.contactEmail}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                   <MessageCircle size={20} />
                 </div>
                 <div>
                   <h5 className="font-bold text-slate-900">WhatsApp</h5>
                   <a 
                     href={`https://wa.me/${data.general.whatsappNumber}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-slate-600 hover:text-green-600 transition-colors"
                   >
                     Chat with us now
                   </a>
                 </div>
               </div>
            </div>
          </div>
        )}

        <div className={`bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 ${isEmbedded ? 'w-full' : ''}`}>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-slate-600 mt-2">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                    placeholder="john@company.com" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Service Interested In</label>
                <select 
                  value={formState.service}
                  onChange={e => setFormState({...formState, service: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                >
                  <option value="" disabled>Select a service</option>
                  {data.services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" 
                  placeholder="Tell us about your project..." 
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (isEmbedded) return content;

  return (
    <section id="contact" className="py-24 bg-white">
      {content}
    </section>
  );
};

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Portfolio />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};