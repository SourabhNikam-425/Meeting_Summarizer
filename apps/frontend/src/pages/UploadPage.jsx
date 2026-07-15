import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '../components/layout/AppShell';
import { UploadDropzone } from '../components/meetings/UploadDropzone';
import { uploadMeeting } from '../services/meetings.service';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {toast.error('Please select an audio file');return;}
    if (!title.trim()) {toast.error('Please enter a meeting title');return;}

    setUploading(true);
    try {
      const meeting = await uploadMeeting(title.trim(), file);
      toast.success('Meeting uploaded! Processing started...');
      navigate(`/meetings/${meeting._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" />
            Upload Meeting
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload an audio recording and our AI will transcribe it and generate a smart summary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Title */}
          <div className="glass-card p-6">
            <label
              htmlFor="meeting-title"
              className="block text-sm font-semibold text-slate-200 mb-3">
              
              Meeting Title *
            </label>
            <input
              id="meeting-title"
              className="input"
              type="text"
              placeholder="e.g. Q3 Planning Session, Design Review..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              disabled={uploading} />
            
          </div>

          {/* File Upload */}
          <div className="glass-card p-6">
            <p className="text-sm font-semibold text-slate-200 mb-3">Audio File *</p>
            <UploadDropzone
              onFileSelect={setFile}
              selectedFile={file}
              onClear={() => setFile(null)} />
            
          </div>

          {/* Info box */}
          <div className="flex gap-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-sm text-slate-400">
            <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-brand-400 font-medium">Powered by Gemini AI · </span>
              Processing typically takes 30–120 seconds depending on audio length. You'll see
              real-time status on the next page.
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || !file || !title.trim()}
            className="btn-primary w-full justify-center py-3">
            
            {uploading ?
            <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading & processing...
              </> :

            <>
                <Sparkles className="w-5 h-5" />
                Transcribe & Summarize
              </>
            }
          </button>
        </form>
      </div>
    </AppShell>);

}