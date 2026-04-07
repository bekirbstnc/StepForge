"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Plus, 
  Search, 
  SquarePen, 
  Trash2, 
  Calendar, 
  CircleCheck, 
  Clock,
  Zap,
  Ticket,
  Gem,
  X
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  gemReward?: number;
  ticketReward?: number;
  total: number;
  type: 'daily' | 'weekly' | 'milestone';
  category: 'steps' | 'collect' | 'boost' | 'streak' | 'progress';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("type"));
    const unsub = onSnapshot(q, (snap) => {
      const taskList: Task[] = [];
      snap.forEach(doc => taskList.push({ id: doc.id, ...doc.data() } as Task));
      setTasks(taskList);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Task Management</h1>
          <p className="mt-2 text-slate-400">Create and manage daily, weekly, and milestone challenges.</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <Search className="h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Filter by title or type..."
          className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:ring-0 sm:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-800">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Task Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Rewards</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Goal</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-transparent">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">No tasks found matching your criteria.</td>
              </tr>
            ) : filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{task.title}</div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{task.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    task.type === 'daily' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' :
                    task.type === 'weekly' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20' :
                    'bg-amber-500/10 text-amber-400 ring-amber-500/20'
                  }`}>
                    {task.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 capitalize">{task.category}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 ring-1 ring-amber-500/20">
                      <Zap className="h-3 w-3" /> {task.reward} P
                    </div>
                    {task.gemReward && (
                      <div className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500 ring-1 ring-blue-500/20">
                        <Gem className="h-3 w-3" /> {task.gemReward} G
                      </div>
                    )}
                    {task.ticketReward && (
                      <div className="flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-500 ring-1 ring-rose-500/20">
                        <Ticket className="h-3 w-3" /> {task.ticketReward} T
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-white">{task.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="text-slate-400 hover:text-indigo-400 transition-colors">
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TaskFormModal 
          task={editingTask} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function TaskFormModal({ task, onClose }: { task: Task | null, onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: "",
      description: "",
      reward: 100,
      xpReward: 50,
      total: 1000,
      type: "daily",
      category: "steps"
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = task?.id || `task_${Date.now()}`;
    await setDoc(doc(db, "tasks", id), formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Task Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
              <select
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
              <select
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="steps">Steps</option>
                <option value="collect">Collect</option>
                <option value="boost">Boost</option>
                <option value="streak">Streak</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pulse Reward</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gem Reward</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.gemReward || 0}
                onChange={(e) => setFormData({ ...formData, gemReward: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">XP Reward</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Goal (Target Amount)</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) })}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
