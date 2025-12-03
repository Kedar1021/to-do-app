'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Star, Trash2, Edit, LogOut } from 'lucide-react';
import api from '@/lib/api';
import TaskModal from '@/components/TaskModal';

interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    starred: boolean;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [showStarred, setShowStarred] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/tasks/');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/tasks/${id}/`);
            fetchTasks();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
    };

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
        const matchesStarred = !showStarred || task.starred;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesStarred && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Todo App</h1>
                <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600">
                    <LogOut size={20} className="mr-2" /> Logout
                </button>
            </nav>

            <main className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center bg-white p-2 rounded shadow-sm w-full md:w-auto">
                        <Search size={20} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none w-full"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-2 border rounded bg-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="p-2 border rounded bg-white"
                        >
                            <option value="ALL">All Priority</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        <button
                            onClick={() => setShowStarred(!showStarred)}
                            className={`p-2 border rounded ${showStarred ? 'bg-yellow-100 border-yellow-400 text-yellow-600' : 'bg-white'}`}
                        >
                            <Star size={20} fill={showStarred ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
                        >
                            <Plus size={20} className="mr-2" /> New Task
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredTasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="text-gray-500 hover:text-blue-600">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-red-600">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className={`px-2 py-1 rounded ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <span className={`px-2 py-1 rounded ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        {task.due_date && <span>{task.due_date}</span>}
                                        {task.starred && <Star size={16} className="text-yellow-400" fill="currentColor" />}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchTasks}
                task={editingTask}
            />
        </div>
    );
}
