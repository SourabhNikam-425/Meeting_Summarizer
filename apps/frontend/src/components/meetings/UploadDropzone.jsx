import { useCallback, useState } from 'react';
import { Upload, Mic, X, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';







const ACCEPTED = ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac', '.mp4'];

export function UploadDropzone({ onFileSelect, selectedFile, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext) && !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      setError('Unsupported file type. Please upload an audio or video file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File is too large. Maximum size is 50 MB.');
      return;
    }
    onFileSelect(file);
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (selectedFile) {
    return (
      <div className="relative border-2 border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-8
                      flex flex-col items-center gap-3 animate-fade-in">
        
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-emerald-300">{selectedFile.name}</p>
          <p className="text-sm text-slate-500 mt-1">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500
                     hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">

          
          <X className="w-4 h-4" />
        </button>
      </div>);

  }

  return (
    <div>
      <label
        htmlFor="audio-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4',
          'cursor-pointer transition-all duration-300 group',
          isDragging ?
          'border-brand-500 bg-brand-500/10 scale-[1.01]' :
          'border-surface-border hover:border-brand-500/60 hover:bg-surface-elevated/50'
        )}>
        
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
          isDragging ? 'bg-brand-500/20' : 'bg-surface-elevated group-hover:bg-brand-500/10'
        )}>
          {isDragging ?
          <Mic className="w-8 h-8 text-brand-400 animate-bounce" /> :

          <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-400 transition-colors" />
          }
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">
            {isDragging ? 'Drop it here!' : 'Drop your audio file here'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            or <span className="text-brand-400 hover:underline">click to browse</span>
          </p>
          <p className="text-xs text-slate-600 mt-3">
            Supports MP3, WAV, M4A, OGG, WebM, FLAC, MP4 · Max 50 MB
          </p>
        </div>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*,video/mp4,video/webm"
          className="sr-only"
          onChange={onInputChange} />
        
      </label>
      {error &&
      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      }
    </div>);

}