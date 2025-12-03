'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '@/lib/api';

interface Task {
    id?: number;
    title: string;
    description: string;
    due_date: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    starred: boolean;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    task?: Task;
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const [formData, setFormData] = useState<Task>({
        title: '',
        description: '',
        due_date: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        starred: false,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
            setFormData({
                title: '',
                description: '',
                due_date: '',
                priority: 'MEDIUM',
                status: 'PENDING',
                starred: false,
            });
        }
        setError('');
    }, [task, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            due_date: formData.due_date === '' ? null : formData.due_date,
        };

        try {
            if (task?.id) {
                await api.put(`/tasks/${task.id}/`, dataToSend);
            } else {
                await api.post('/tasks/', dataToSend);
            }
            onSave();
            onClose();
        } catch (err: any) {
            console.error('Failed to save task', err);
            if (err.response && err.response.data) {
                const messages = Object.values(err.response.data).flat().join(', ');
                setError(messages || 'Failed to save task.');
            } else {
                setError('Failed to save task.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{task?.id ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="date"
                        value={formData.due_date || ''}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.starred}
                            onChange={(e) => setFormData({ ...formData, starred: e.target.checked })}
                            className="mr-2"
                        />
                        <label>Starred</label>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
