import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { data } = useContent();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', isAnchor: true },
    { name: 'Services', href: '/#services', isAnchor: true },
    { name: 'Why Krova', href: '/#why-us', isAnchor: true },
    { name: 'Courses', href: '/courses', isAnchor: false },
    { name: 'Portfolio', href: '/#portfolio', isAnchor: true },
  ];

  const handleNavClick = (href: string, isAnchor: boolean) => {
    setIsOpen(false);
    
    if (!isAnchor) {
      navigate(href);
      return;
    }

    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
         const element = document.querySelector(href.replace('/', ''));
         if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    const element = document.querySelector(href.replace('/', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo with Enhanced Animation */}
        <RouterLink to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15,
              mass: 1
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: -2,
              filter: "drop-shadow(0px 0px 8px rgba(79, 70, 229, 0.3))" 
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer origin-center"
          >
            {data.general.logoImage ? (
              <img 
                src={data.general.logoImage} 
                alt={data.general.agencyName} 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-bold tracking-tighter text-slate-900">
                {data.general.logoText}
              </span>
            )}
          </motion.div>
        </RouterLink>

        {/* Desktop Menu - Wrapped in White Container */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center space-x-6 px-8 py-3 bg-white/95 backdrop-blur shadow-sm border border-slate-200/60 rounded-full">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.isAnchor);
                }}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {user ? (
             <div className="flex items-center gap-4 pl-4 border-l border-slate-300/50">
                <RouterLink to="/dashboard" className="flex items-center gap-2 group">
                   {user.avatar ? (
                     <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-indigo-200 group-hover:border-indigo-500 transition-colors" />
                   ) : (
                     <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                        <UserIcon size={16} />
                     </div>
                   )}
                   <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 hidden lg:block">Dashboard</span>
                </RouterLink>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
             </div>
          ) : (
            <div className="flex items-center gap-2">
               <RouterLink 
                 to="/login"
                 className="px-5 py-2.5 text-slate-700 font-semibold text-sm hover:text-indigo-600 transition-colors"
               >
                 Login
               </RouterLink>
               <RouterLink
                  to="/signup"
                  className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                >
                  Sign Up
                </RouterLink>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-800 focus:outline-none p-2 bg-white/80 backdrop-blur rounded-lg border border-slate-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100">
          <div className="flex flex-col p-6 space-y-4">
             {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.isAnchor);
                  }}
                  className="text-lg font-medium text-slate-700 text-left"
                >
                  {link.name}
                </button>
             ))}
            <div className="border-t pt-4 mt-2">
                {user ? (
                    <div className="space-y-4">
                        <RouterLink to="/dashboard" className="flex items-center gap-3 text-slate-800 font-bold" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard size={20} className="text-indigo-600" /> Dashboard
                        </RouterLink>
                        <div className="flex justify-between items-center pt-2">
                             <div className="flex items-center gap-2">
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <UserIcon size={20} className="text-slate-400" />
                                )}
                                <span className="font-semibold text-slate-900">{user.name}</span>
                             </div>
                            <button onClick={logout} className="text-red-500 text-sm font-semibold">Logout</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                         <RouterLink 
                            to="/login"
                            className="text-center w-full py-3 border border-slate-200 text-slate-700 font-semibold rounded-lg"
                            onClick={() => setIsOpen(false)}
                         >
                            Login
                         </RouterLink>
                         <RouterLink
                            to="/signup"
                            className="text-center w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg"
                            onClick={() => setIsOpen(false)}
                         >
                            Sign Up Free
                         </RouterLink>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};