import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Loader2, FileText, ListChecks, Target,
  CheckSquare, Square, Trash2, AlertCircle, ChevronDown, ChevronUp } from
'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '../components/layout/AppShell';
import { StatusBadge } from '../components/meetings/StatusBadge';
import { useMeetingPolling } from '../hooks/useMeetingPolling';
import { toggleActionItem, deleteMeeting } from '../services/meetings.service';
import { formatDate } from '../lib/utils';

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingPolling(id);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [actionItems, setActionItems] = useState({});

  const handleToggle = async (itemId) => {
    try {
      const updated = await toggleActionItem(id, itemId);
      const item = updated.actionItems.find((a) => a._id === itemId);
      if (item) setActionItems((prev) => ({ ...prev, [itemId]: item.isDone }));
      toast.success(item?.isDone ? 'Marked complete!' : 'Marked incomplete');
    } catch {
      toast.error('Failed to update action item');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this meeting?')) return;
    try {
      await deleteMeeting(id);
      toast.success('Meeting deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-slate-400">Loading meeting...</p>
        </div>
      </AppShell>);

  }

  if (error || !meeting) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-slate-400">{error ?? 'Meeting not found'}</p>
          <Link to="/" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
        </div>
      </AppShell>);

  }

  const isProcessing = meeting.status === 'pending' || meeting.status === 'processing';

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back + Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400
                                   hover:text-slate-200 mb-4 transition-colors">
            
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <StatusBadge status={meeting.status} />
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">{meeting.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{formatDate(meeting.createdAt)}</p>
            </div>
            <button onClick={handleDelete} className="btn-danger flex-shrink-0">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Processing state */}
        {isProcessing &&
        <div className="glass-card p-6 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-slate-200">
                {meeting.status === 'pending' ? 'Queued for processing...' : 'AI is working...'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Transcribing and summarizing your meeting. This updates automatically.
              </p>
            </div>
            <div className="w-full h-1 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 processing-bar rounded-full w-3/4" />
            </div>
          </div>
        }

        {/* Failed state */}
        {meeting.status === 'failed' &&
        <div className="glass-card p-6 border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Processing Failed</p>
                <p className="text-sm text-slate-400 mt-1">
                  {meeting.errorMessage ?? 'An error occurred during processing.'}
                </p>
              </div>
            </div>
          </div>
        }

        {/* Summary card */}
        {meeting.summary &&
        <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="font-semibold text-slate-100">Summary</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{meeting.summary}</p>
          </div>
        }

        {/* Key Decisions */}
        {meeting.keyDecisions.length > 0 &&
        <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <ListChecks className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="font-semibold text-slate-100">Key Decisions</h2>
              <span className="ml-auto badge bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {meeting.keyDecisions.length}
              </span>
            </div>
            <ul className="space-y-2">
              {meeting.keyDecisions.map((d, i) =>
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400
                                   flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                
                    {i + 1}
                  </span>
                  {d}
                </li>
            )}
            </ul>
          </div>
        }

        {/* Action Items */}
        {meeting.actionItems.length > 0 &&
        <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="font-semibold text-slate-100">Action Items</h2>
              <span className="ml-auto badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {meeting.actionItems.filter((a) => !(actionItems[a._id] ?? a.isDone)).length} remaining
              </span>
            </div>
            <ul className="space-y-2">
              {meeting.actionItems.map((item) => {
              const done = actionItems[item._id] ?? item.isDone;
              return (
                <li
                  key={item._id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-elevated
                               transition-colors duration-200 cursor-pointer group"

                  onClick={() => handleToggle(item._id)}>
                  
                    {done ?
                  <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> :

                  <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300
                                        flex-shrink-0 mt-0.5 transition-colors" />

                  }
                    <div className="flex-1">
                      <p className={`text-sm ${done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {item.text}
                      </p>
                      {item.assignee &&
                    <p className="text-xs text-slate-500 mt-0.5">→ {item.assignee}</p>
                    }
                    </div>
                  </li>);

            })}
            </ul>
          </div>
        }

        {/* Transcript accordion */}
        {meeting.transcript &&
        <div className="glass-card animate-fade-in">
            <button
            onClick={() => setTranscriptOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-6 hover:bg-surface-elevated/30
                         rounded-2xl transition-colors duration-200">

            
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <span className="font-semibold text-slate-200 flex-1 text-left">Full Transcript</span>
              <span className="text-xs text-slate-500 mr-2">
                {meeting.transcript.split(' ').length} words
              </span>
              {transcriptOpen ?
            <ChevronUp className="w-4 h-4 text-slate-400" /> :
            <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {transcriptOpen &&
          <div className="px-6 pb-6 animate-fade-in">
                <div className="bg-surface rounded-xl p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                    {meeting.transcript}
                  </pre>
                </div>
              </div>
          }
          </div>
        }
      </div>
    </AppShell>);

}