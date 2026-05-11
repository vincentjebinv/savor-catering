import { useState, useEffect } from 'react';
import { Info, X, Instagram, Mail } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('disclaimer_session_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('disclaimer_session_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="relative bg-green-600 p-8 text-center text-white">
          <div className="absolute top-4 right-4">
            <button 
              onClick={handleClose}
              className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Portfolio Demo</h2>
          <p className="mt-1 text-sm font-medium opacity-90 text-green-50 uppercase tracking-widest">Savor Catering App</p>
        </div>

        <div className="p-8">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-sm">
              This application was originally designed and developed as a custom web-app for a private client's business operations.
            </p>
            <p className="text-sm">
              To showcase my development expertise, I have <strong>removed all sensitive client data</strong> and repurposed this project as a live demo for my professional portfolio.
            </p>
            <p className="text-sm font-bold text-gray-800">
              Please note: This is a technical showcase, not a public service.
            </p>
            
            <div className="mt-8 rounded-2xl bg-gray-50 p-5 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">
                If you need services like this, contact me with:
              </p>
              
              <a 
                href="https://instagram.com/vincent.dev.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-100 shadow-sm transition-all hover:border-green-300 hover:shadow-md group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Instagram size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800">vincent.dev.in</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Follow on Instagram</span>
                </div>
              </a>

              <a 
                href="mailto:vincenvenkadesan@gmail.com" 
                className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-100 shadow-sm transition-all hover:border-green-300 hover:shadow-md group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800">vincenvenkadesan@gmail.com</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Send an Email</span>
                </div>
              </a>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="mt-8 w-full rounded-2xl bg-gray-900 py-4 text-sm font-bold text-white shadow-xl transition-all active:scale-95 hover:bg-black"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
