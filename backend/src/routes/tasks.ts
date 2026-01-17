import express from 'express';
import { sql } from '../config/database';
import { authenticateToken, adminOnly } from '../middleware/auth';
import { Task, TaskRequest, ActivityLog } from '../types';

const router = express.Router();

async function logActivity(
  taskId: string,
  userId: string,
  action: string,
  changes?: Record<string, any>
) {
  try {
    await sql<ActivityLog[]>`
      INSERT INTO activity_logs (task_id, user_id, action, changes)
      VALUES (${taskId}, ${userId}, ${action}, ${JSON.stringify(changes || {})})
    `;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let query = 'SELECT * FROM tasks';
    let countQuery = 'SELECT COUNT(*) = await sql<[{ count: number }]>`SELECT COUNT(*) as count FROM tasks${
      status ? sql`WHERE status = ${status}` : sql``
    }`;

    const total = countResult[0]?.count || 0;

    const tasks = await sql<Task[]>`
      SELECT * FROM tasks
      ${status ? sql`WHERE status = ${status}` : sql``}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's assigned tasks
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const countResult = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM tasks WHERE assigned_to = ${req.user!.id}
    `;

    const total = countResult[0]?.count || 0;

    const tasks = await sql<Task[]>`
      SELECT * FROM tasks
      WHERE assigned_to = ${req.user!.id}
      ORDER BY due_date ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's created tasks (for managers)
router.get('/tasks/created/me', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const countResult = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM tasks WHERE created_by = ${req.user!.id}
    `;

    const total = countResult[0]?.count || 0;

    const tasks = await sql<Task[]>`
      SELECT * FROM tasks
      WHERE created_by = ${req.user!.id}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get created tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single task
router.get('/tasks/:id', authenticateToken, async (req, res) => {
    const tasks = await sql<Task[]>`
      SELECT * FROM tasks WHERE id = ${req.params.id}
    `;

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[0];

    // Check authorization
    if (
      task.assigned_to !== req.user!.id &&
      task.created_by !== req.user!.id &&
      req.user!.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task (manager/admin only)
  try {
    const { title, description, priority = 'medium', assigned_to, due_date }: TaskRequest =
      req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const tasks = await sql<Task[]>`
      INSERT INTO tasks (title, description, priority, assigned_to, created_by, due_date)
      VALUES (${title}, ${description || null}, ${priority}, ${assigned_to || null}, ${req.user!.id}, ${due_date || null})
      RETURNING *
    `;

    const task = tasks[0];
    await logActivity(task.id, req.user!.id, 'created', { title, description, priority });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status, assigned_to, due_date }: TaskRequest =
      req.body;

    // Get current task
    const tasks = await sql<Task[]>`SELECT * FROM tasks WHERE id = ${req.params.id}`;
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[0];

    // Check authorization
    if (
      task.created_by !== req.user!.id &&
      (req.user!.role !== 'admin' && req.user!.role !== 'manager')
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (due_date !== undefined) updates.due_date = due_date;

    const updatedTasks = await sql<Task[]>`
      UPDATE tasks
      SET ${Object.keys(updates)
        .map((key) => sql`${sql.ident(key)} = ${updates[key]}`)
        .reduce((a, b) => sql`${a}, ${b}`)}
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    await logActivity(req.params.id, req.user!.id, 'updated', updates);

    res.json({
      message: 'Task updated successfully',
      task: updatedTasks[0],
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/tasks/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const tasks = await sql<Task[]>`SELECT * FROM tasks WHERE id = ${req.params.id}`;
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[0];

    // Check authorization
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await sql`DELETE FROM tasks WHERE id = ${req.params.id}`;
    await logActivity(req.params.id, req.user!.id, 'deleted', { title: task.title });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity logs for a task
  try {
    const logs = await sql<ActivityLog[]>`
      SELECT * FROM activity_logs
      WHERE task_id = ${req.params.id}
      ORDER BY created_at DESC
    `;

    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
