import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  logout: () => void;
}

interface TaskStore {
  tasks: Task[];
  assignedTasks: Task[];
  createdTasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setAssignedTasks: (tasks: Task[]) => void;
  setCreatedTasks: (tasks: Task[]) => void;
  setSelectedTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    devtools((set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      darkMode: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),
    })),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
      }),
    }
  )
);

export const useTaskStore = create<TaskStore>()(
  devtools((set) => ({
    tasks: [],
    assignedTasks: [],
    createdTasks: [],
    selectedTask: null,
    isLoading: false,
    error: null,
    setTasks: (tasks) => set({ tasks }),
    setAssignedTasks: (tasks) => set({ assignedTasks: tasks }),
    setCreatedTasks: (tasks) => set({ createdTasks: tasks }),
    setSelectedTask: (task) => set({ selectedTask: task }),

    addTask: (task) =>
      set((state) => ({
        tasks: [task, ...state.tasks],
      })),

    updateTask: (task) =>
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        assignedTasks: state.assignedTasks.map((t) =>
          t.id === task.id ? task : t
        ),
        createdTasks: state.createdTasks.map((t) =>
          t.id === task.id ? task : t
        ),
      })),

    removeTask: (taskId) =>
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        assignedTasks: state.assignedTasks.filter((t) => t.id !== taskId),
        createdTasks: state.createdTasks.filter((t) => t.id !== taskId),
      })),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  }))
);
