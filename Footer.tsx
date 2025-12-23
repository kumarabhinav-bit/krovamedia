import React from 'react';
import { Instagram, Linkedin, Twitter, Youtube, Link as LinkIcon } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { data } = useContent();

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'youtube': return <Youtube size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  // Logic: Use specific footer logo if available. If not, use main logo but invert it for dark background.
  const logoToUse = data.footer.logoImage || data.general.logoImage;
  const logoClass = data.footer.logoImage 
    ? "h-10 w-auto object-contain" // Use as is (assume user uploaded white logo)
    : "h-10 w-auto object-contain brightness-0 invert"; // Invert main logo (black -> white)

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-md">
            <div className="mb-6">
              {logoToUse ? (
                <img 
                  src={logoToUse} 
                  alt={data.general.agencyName} 
                  className={logoClass} 
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">{data.general.logoText}</h3>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {data.footer.description}
            </p>
          </div>
          
          <div className="flex gap-6">
            {data.footer.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
                aria-label={social.platform}
              >
                {getIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>{data.footer.copyrightText}</p>
          <div className="mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-slate-300 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};