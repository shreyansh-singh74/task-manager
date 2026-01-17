import { useAuthStore } from '../store/store';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const darkMode = useAuthStore((state) => state.darkMode);
  const toggleDarkMode = useAuthStore((state) => state.toggleDarkMode);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    localStorage.removeItem('token');
    navigate('/sign-in');
  }

  return (
    <nav className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='bg-blue-600 text-white p-2 rounded-lg'>
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z' />
              </svg>
            </div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>TaskManager</span>
          </Link>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              to='/'
              className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition'
            >
              Dashboard
            </Link>
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <Link
                to='/create-task'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition'
              >
                Create Task
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-4'>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition'
              title='Toggle dark mode'
            >
              {darkMode ? (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm.707 5.657a1 1 0 11-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zm-9.192 2.121a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM9 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.536-.464a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zm2.828-2.828a1 1 0 101.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM3 13a1 1 0 11-2 0 1 1 0 012 0zm9-10a1 1 0 01-1-1V3a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1z' />
                </svg>
              ) : (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                </svg>
              )}
            </button>

            {/* User menu */}
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {user?.name}
              </span>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                {user?.role}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
