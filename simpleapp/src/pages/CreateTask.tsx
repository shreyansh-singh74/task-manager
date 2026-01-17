import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { useTaskStore, useAuthStore } from '../store/store';

export default function CreateTask() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  const user = useAuthStore((state) => state.user);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    try {
      const response = await taskAPI.createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assigned_to: formData.assigned_to || undefined,
        due_date: formData.due_date || undefined,
      });

      addTask(response.data.task);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        due_date: '',
      });

      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
            Create New Task
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Assign tasks to team members and manage your project
          </p>
        </div>

        {/* Form */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
          {error && (
            <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Task Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter task title'
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none'
                placeholder='Enter task description'
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor='priority' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Priority
              </label>
              <select
                id='priority'
                name='priority'
                value={formData.priority}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor='due_date' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Due Date
              </label>
              <input
                type='date'
                id='due_date'
                name='due_date'
                value={formData.due_date}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
              />
            </div>

            {/* Assign To */}
            <div>
              <label htmlFor='assigned_to' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Assign To (optional)
              </label>
              <input
                type='email'
                id='assigned_to'
                name='assigned_to'
                value={formData.assigned_to}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter user email (feature in progress)'
                disabled
              />
              <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                Note: User assignment feature coming soon. Tasks can be assigned by user ID via API.
              </p>
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-6'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/')}
                className='flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}