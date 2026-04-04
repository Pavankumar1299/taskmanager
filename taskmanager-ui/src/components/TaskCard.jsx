import { Calendar, Clock, AlertCircle, CheckCircle, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons = {
  todo: <Clock className="w-4 h-4" />,
  'in-progress': <AlertCircle className="w-4 h-4" />,
  done: <CheckCircle className="w-4 h-4 text-green-600" />,
};

export default function TaskCard({ task, onDelete, onUpdateStatus, onEdit }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={cn(
        "font-medium text-zinc-900 mb-1",
        task.status === 'done' && "line-through text-zinc-400"
      )}>
        {task.title}
      </h3>
      
      <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(task.dueDate), 'MMM d')}</span>
        </div>

        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value)}
          className={cn(
            "text-xs font-medium bg-transparent border-none focus:ring-0 cursor-pointer rounded px-2 py-1 hover:bg-zinc-50",
            task.status === 'done' ? "text-green-600" : "text-zinc-600"
          )}
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}
