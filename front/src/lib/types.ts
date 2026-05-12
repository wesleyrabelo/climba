export type TaskStatus = "pending" | "in_progress" | "completed";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
  users_id: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type TaskInput = {
  title: string;
  description?: string | null;
  due_date?: string | null;
  status: TaskStatus;
  completed_at?: string | null;
  users_id?: number;
};

export type ListTasksParams = {
  search?: string;
  status?: TaskStatus;
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em progresso",
  completed: "Concluída",
};
