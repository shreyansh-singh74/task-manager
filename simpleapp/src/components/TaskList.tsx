import { useState } from 'react';
import { Task } from '../store/store';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  title: string;
  onTaskUpdate: () => void;
  emptyMessage?: string;
}

export default function TaskList({
  tasks,
  title,
  onTaskUpdate,
  emptyMessage = 'No tasks found',
}: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const filteredTasks =
    filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.due_date || a.created_at).getTime();
      const dateB = new Date(b.due_date || b.created_at).getTime();
      return dateA - dateB;
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
  });

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{title}</h2>

        <div className='flex gap-3 flex-wrap'>
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Tasks</option>
            <option value='pending'>Pending</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='date'>Sort by Date</option>
            <option value='priority'>Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length === 0 ? (
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700'>
          <p className='text-gray-600 dark:text-gray-400'>{emptyMessage}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
          ))}
        </div>
      )}

      {/* Results count */}
      {sortedTasks.length > 0 && (
        <div className='text-sm text-gray-600 dark:text-gray-400 text-center'>
          Showing {sortedTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
}
