import { Mic, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20
                      flex items-center justify-center mb-6">
        
        <Mic className="w-10 h-10 text-brand-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">No meetings yet</h3>
      <p className="text-slate-500 text-sm text-center max-w-sm mb-6">
        Upload your first meeting recording and get an AI-powered summary with action items
        in seconds.
      </p>
      <Link to="/upload" className="btn-primary">
        <Upload className="w-4 h-4" />
        Upload your first meeting
      </Link>
    </div>);

}