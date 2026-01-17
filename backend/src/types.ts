export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'manager' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by: string;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: string;
  task_id: string;
  user_id?: string;
  action: string;
  changes?: Record<string, any>;
  created_at: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}
