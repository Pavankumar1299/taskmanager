import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { Task, TaskFilter, Status, Priority } from './types';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import AIGenerateModal from './components/AIGenerateModal';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, CheckCircle2, Circle, Clock, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [prefilledTask, setPrefilledTask] = useState(null);
  const [filter, setFilter] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);


const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token"); 
          
      const response = await axios.get('http://localhost:8080/api/tasks', {
          headers: {
              'Authorization': `Bearer ${token}` 
          }
      });

      console.log("API response:", response.data); 

      // Remove the ".tasks" at the end!
      setTasks(response.data); 
      
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");

      // 2. Add a safety check (helps debugging)
        if (!token) {
            console.error("No token found in localStorage! You need to log in first.");
            return;
        }

      const response = await axios.post('http://localhost:8080/api/tasks', taskData,{
        headers: {
                'Authorization': `Bearer ${token}`, // <-- Attach the token here
                'Content-Type': 'application/json'
            }
      });
      setTasks([response.data, ...tasks]);
      setIsFormOpen(false);
      setPrefilledTask(null);

      // Handle success (e.g., updating state)
      console.log("Task added successfully:", response.data);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${updatedTask.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? response.data : t));
      setEditingTask(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const updateTaskStatus = async (id, status) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${id}`, { ...task, status });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const filteredTasks = useMemo(() => {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter(task => {
    const matchesStatus = !filter.status || task.status === filter.status;
    const matchesPriority = !filter.priority || task.priority === filter.priority;

    const search = filter.search?.toLowerCase() || "";

    const matchesSearch =
      !search ||
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search);

    return matchesStatus && matchesPriority && matchesSearch;
  });
}, [tasks, filter]);

  const stats = useMemo(() => {
  if (!Array.isArray(tasks)) return { total: 0, todo: 0, inProgress: 0, done: 0 };

  return {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length,
  };
}, [tasks]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Productivity Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                value={filter.search || ''}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="pl-10 pr-4 py-2 bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-200 border rounded-xl text-sm outline-none transition-all w-full md:w-64"
              />
            </div>
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-medium hover:bg-purple-100 transition-colors border border-purple-100"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Generate</span>
            </button>
            <button 
              onClick={() => {
                setEditingTask(null);
                setPrefilledTask(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
            
            <div className="h-8 w-px bg-zinc-200 mx-1" />
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold">{user?.username}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Member</span>
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={stats.total} icon={<LayoutGrid className="w-4 h-4" />} color="zinc" />
          <StatCard label="To Do" value={stats.todo} icon={<Circle className="w-4 h-4" />} color="blue" />
          <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="w-4 h-4" />} color="yellow" />
          <StatCard label="Completed" value={stats.done} icon={<CheckCircle2 className="w-4 h-4" />} color="green" />
        </div>

        {/* Filters & View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <FilterButton 
              active={!filter.status} 
              onClick={() => setFilter({ ...filter, status: undefined })}
              label="All" 
            />
            <FilterButton 
              active={filter.status === 'TODO'} 
              onClick={() => setFilter({ ...filter, status: 'TODO' })}
              label="Todo" 
            />
            <FilterButton 
              active={filter.status === 'IN_PROGRESS'} 
              onClick={() => setFilter({ ...filter, status: 'IN_PROGRESS' })}
              label="In Progress" 
            />
            <FilterButton 
              active={filter.status === 'DONE'} 
              onClick={() => setFilter({ ...filter, status: 'DONE' })}
              label="Done" 
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Grid/List */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <motion.div 
              layout
              className={cn(
                "grid gap-4",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}
            >
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard 
                    task={task} 
                    onDelete={deleteTask}
                    onUpdateStatus={updateTaskStatus}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsFormOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">No tasks found</h3>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Try adjusting your filters or create a new task to get started.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg"
            >
              <TaskForm 
                onSave={addTask}
                onUpdate={updateTask}
                onCancel={() => {
                  setIsFormOpen(false);
                  setPrefilledTask(null);
                }}
                editingTask={editingTask}
                prefilledTask={prefilledTask}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md"
            >
              <AIGenerateModal 
                onGenerated={(task) => {
                  setPrefilledTask(task);
                  setEditingTask(null);
                  setIsAIModalOpen(false);
                  setIsFormOpen(true);
                }}
                onClose={() => setIsAIModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <TaskManager />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    zinc: "bg-zinc-100 text-zinc-900",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("p-2 rounded-lg", colors[color])}>
          {icon}
        </div>
        <span className="text-2xl font-bold tracking-tight">{value}</span>
      </div>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function FilterButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
        active 
          ? "bg-zinc-900 text-white shadow-md" 
          : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      )}
    >
      {label}
    </button>
  );
}
