
import { cn } from '../../lib/utils';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

const config =
{
  pending: {
    label: 'Pending',
    classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    icon: <Clock className="w-3 h-3" />
  },
  processing: {
    label: 'Processing',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    icon: <Loader2 className="w-3 h-3 animate-spin" />
  },
  done: {
    label: 'Done',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    icon: <CheckCircle2 className="w-3 h-3" />
  },
  failed: {
    label: 'Failed',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/30',
    icon: <XCircle className="w-3 h-3" />
  }
};

export function StatusBadge({ status }) {
  const { label, classes, icon } = config[status];
  return (
    <span className={cn('badge', classes)}>
      {icon}
      {label}
    </span>);

}