import { useEffect, useState } from 'react';
import { useAuthStore, useTaskStore } from '../store/store';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const assignedTasks = useTaskStore((state) => state.assignedTasks);
  const createdTasks = useTaskStore((state) => state.createdTasks);
  const setAssignedTasks = useTaskStore((state) => state.setAssignedTasks);
  const setCreatedTasks = useTaskStore((state) => state.setCreatedTasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const setLoading = useTaskStore((state) => state.setLoading);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError('');
    try {
      const assignedResponse = await taskAPI.getAssignedTasks();
      setAssignedTasks(assignedResponse.data.tasks);

      if (user?.role === 'manager' || user?.role === 'admin') {
        const createdResponse = await taskAPI.getCreatedTasks();
        setCreatedTasks(createdResponse.data.tasks);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome, {user?.name}!
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Manage your tasks and stay productive
          </p>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg'>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className='text-center py-12'>
            <div className='inline-flex items-center space-x-2'>
              <div className='w-4 h-4 bg-blue-600 rounded-full animate-bounce'></div>
              <div className='w-4 h-4 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
              <div className='w-4 h-4 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading tasks...</p>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Assigned Tasks */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                My Assigned Tasks
              </h2>
              {assignedTasks.length === 0 ? (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg'>
                  <p className='text-gray-600 dark:text-gray-400'>No tasks assigned to you yet</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {assignedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onTaskUpdate={fetchTasks} />
                  ))}
                </div>
              )}
            </section>

            {/* Created Tasks (for managers) */}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <section>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  My Created Tasks
                </h2>
                {createdTasks.length === 0 ? (
                  <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg'>
                    <p className='text-gray-600 dark:text-gray-400'>You haven't created any tasks yet</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {createdTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onTaskUpdate={fetchTasks} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}