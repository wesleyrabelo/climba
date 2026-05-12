/**
 * Camada de API — integração com backend Node/Express.
 */

import type { ListTasksParams, SignInInput, SignUpInput, Task, TaskInput, User } from "./types";

const API_URL = "http://localhost:3000";

// ----- Auth -----

export async function signUp(input: SignUpInput): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
}

export async function signIn(input: SignInInput): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Email ou senha inválidos");
  }

  const data = await response.json();

  return data.user;
}

export async function signOut(): Promise<void> {
  return;
}

export async function getCurrentUser(): Promise<User | null> {
  return null;
}

// ----- Tasks -----

export async function listTasks(userId: string, params?: ListTasksParams): Promise<Task[]> {
  const queryParams = new URLSearchParams();

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  const response = await fetch(`${API_URL}/tasks/user/${userId}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar tarefas");
  }

  return response.json();
}

export async function createTask(input: TaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar tarefa");
  }

  return response.json();
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar tarefa");
  }
}
