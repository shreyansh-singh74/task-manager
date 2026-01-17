import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/store';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.signIn(email, password);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
          <h1 className='text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white'>
            Sign In
          </h1>
          <p className='text-center text-gray-600 dark:text-gray-400 mb-8'>
            Welcome back
          </p>

          {error && (
            <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter your email'
              />
            </div>

            <div>
              <label htmlFor='pass' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Password
              </label>
              <input
                type='password'
                id='pass'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter password'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600 dark:text-gray-400'>
              Don't have an account?{' '}
              <a href='/sign-up' className='text-blue-600 hover:text-blue-700 font-semibold'>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}