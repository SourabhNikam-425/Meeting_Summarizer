import { AlertCircle, RefreshCw } from 'lucide-react';






export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20
                      flex items-center justify-center mb-4">
        
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Oops!</h3>
      <p className="text-slate-500 text-sm text-center max-w-sm mb-6">{message}</p>
      {onRetry &&
      <button onClick={onRetry} className="btn-secondary">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      }
    </div>);

}