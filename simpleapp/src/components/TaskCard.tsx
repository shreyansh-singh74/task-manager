import { useState } from 'react';
import { Task } from '../store/store';
import { taskAPI } from '../services/api';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
}

export default function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setLoading(true);
    try {
      await taskAPI.updateTask(task.id, { status: newStatus });
      setStatus(newStatus);
      onTaskUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setLoading(false);
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
      case 'pending':
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 transition ${getStatusColor(status)}`}>
      <div className='space-y-3'>
        {/* Title */}
        <div>
          <h3 className={`text-lg font-semibold ${status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
            {task.description}
          </p>
        )}

        {/* Priority badge */}
        <div className='flex items-center space-x-2'>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Due date */}
        {task.due_date && (
          <div className='text-xs text-gray-600 dark:text-gray-400'>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}

        {/* Status selector */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={loading}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='pending'>Pending</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
        </div>

        {/* Timestamps */}
        <div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
          <div>Created: {new Date(task.created_at).toLocaleDateString()}</div>
          {task.updated_at && <div>Updated: {new Date(task.updated_at).toLocaleDateString()}</div>}
        </div>
      </div>
    </div>
  );
}