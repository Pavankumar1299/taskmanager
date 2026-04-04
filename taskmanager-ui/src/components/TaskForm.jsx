import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskForm({ onSave, onUpdate, onCancel, editingTask, prefilledTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate);
    } else if (prefilledTask) {
      setTitle(prefilledTask.title);
      setDescription(prefilledTask.description);
      setPriority(prefilledTask.priority);
      setStatus('TODO');
      setDueDate(prefilledTask.dueDate);
    }
  }, [editingTask, prefilledTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdate({
        ...editingTask,
        title,
        description,
        priority,
        status,
        dueDate,
      });
    } else {
      onSave({
        title,
        description,
        priority,
        status,
        dueDate,
      });
    }
    
    // Reset form if not editing
    if (!editingTask) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-lg max-w-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            rows={3}
            className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            {editingTask ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
