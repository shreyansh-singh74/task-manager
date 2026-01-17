import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/store';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conf_password, setConf_Password] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !conf_password) {
      setError('All fields are required');
      return;
    }

    if (password !== conf_password) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.signUp(name, email, password);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
          <h1 className='text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white'>
            Sign Up
          </h1>
          <p className='text-center text-gray-600 dark:text-gray-400 mb-8'>
            Create a new account
          </p>

          {error && (
            <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter your name'
              />
            </div>

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

            <div>
              <label htmlFor='conf-pass' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Confirm Password
              </label>
              <input
                type='password'
                id='conf-pass'
                value={conf_password}
                onChange={(e) => setConf_Password(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Confirm password'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600 dark:text-gray-400'>
              Already have an account?{' '}
              <a href='/sign-in' className='text-blue-600 hover:text-blue-700 font-semibold'>
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}