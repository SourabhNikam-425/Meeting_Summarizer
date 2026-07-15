import { Link } from 'react-router-dom';
import { Trash2, Mic, Calendar, FileText } from 'lucide-react';

import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../lib/utils';






export function MeetingCard({ meeting, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this meeting? This cannot be undone.')) {
      onDelete(meeting._id);
    }
  };

  return (
    <Link
      to={`/meetings/${meeting._id}`}
      className="glass-card group block p-5 hover:border-brand-500/40 hover:glow
                 transition-all duration-300 animate-fade-in">

      
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20
                        flex items-center justify-center flex-shrink-0
                        group-hover:bg-brand-500/20 transition-colors duration-200">

          
          <Mic className="w-5 h-5 text-brand-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={meeting.status} />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm leading-snug truncate
                         group-hover:text-white transition-colors duration-200">
            
            {meeting.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(meeting.createdAt)}
            </span>
            {meeting.status === 'done' && meeting.transcript &&
            <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {meeting.transcript.split(' ').length} words
              </span>
            }
          </div>
          {meeting.summary &&
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {meeting.summary}
            </p>
          }
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg
                     text-slate-500 hover:text-red-400 hover:bg-red-500/10
                     transition-all duration-200 flex-shrink-0"


          title="Delete meeting">
          
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Processing progress bar */}
      {(meeting.status === 'pending' || meeting.status === 'processing') &&
      <div className="mt-4 h-0.5 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 processing-bar rounded-full w-full" />
        </div>
      }
    </Link>);

}