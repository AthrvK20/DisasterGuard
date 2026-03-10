import { Github, Heart, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">DisasterGuard</h3>
              <p className="text-sm text-slate-400">AI-Powered Early Warning System</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Built with <Heart className="w-4 h-4 inline text-red-500 mx-1" /> for community safety
            </p>
            <p className="text-slate-500 text-xs mt-1">© 2024 DisasterGuard. All rights reserved.</p>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-4">
            <a
              href="#"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}