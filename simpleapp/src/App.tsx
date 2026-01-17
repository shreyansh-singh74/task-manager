import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' replace />;
  }

  return <>{children}</>;
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const darkMode = useAuthStore((state) => state.darkMode);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='min-h-screen bg-white dark:bg-gray-900'>
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route
            path='/sign-in'
            element={isAuthenticated ? <Navigate to='/' replace /> : <SignIn />}
          />
          <Route
            path='/sign-up'
            element={isAuthenticated ? <Navigate to='/' replace /> : <SignUp />}
          />

          <Route
            path='/create-task'
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
lement={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
