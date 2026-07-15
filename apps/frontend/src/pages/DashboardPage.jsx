import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '../components/layout/AppShell';
import { MeetingCard } from '../components/meetings/MeetingCard';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { useMeetings } from '../hooks/useMeetings';
import { deleteMeeting } from '../services/meetings.service';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { meetings, loading, error, refetch } = useMeetings();
  const [search, setSearch] = useState('');

  const filtered = meetings.filter((m) =>
  m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await deleteMeeting(id);
      toast.success('Meeting deleted');
      refetch();
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <Link to="/upload" className="btn-primary self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          New Meeting
        </Link>
      </div>

      {/* Search */}
      {meetings.length > 0 &&
      <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
          type="text"
          placeholder="Search meetings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10" />
        
        </div>
      }

      {/* Content */}
      {loading ?
      <LoadingSkeleton /> :
      error ?
      <ErrorState message={error} onRetry={refetch} /> :
      meetings.length === 0 ?
      <EmptyState /> :
      filtered.length === 0 ?
      <div className="text-center py-16 text-slate-500">
          <Mic className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>No meetings match "<span className="text-slate-300">{search}</span>"</p>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) =>
        <MeetingCard key={m._id} meeting={m} onDelete={handleDelete} />
        )}
        </div>
      }
    </AppShell>);

}