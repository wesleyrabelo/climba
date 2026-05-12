/**
 * Camada de API — placeholders.
 *
 * Estes métodos definem o contrato entre o frontend e o backend.
 * Substitua o corpo de cada função pela chamada real à sua API
 * (fetch, axios, etc). As assinaturas e tipos não devem mudar.
 */
import type {
  ListTasksParams,
  SignInInput,
  SignUpInput,
  Task,
  TaskInput,
  User,
} from "./types";

const NOT_IMPLEMENTED = "Not implemented — connect your backend";

// ----- Auth -----

export async function signUp(_input: SignUpInput): Promise<User> {
  // TODO: POST /users — criar usuário e retornar { id, name, email }
  throw new Error(NOT_IMPLEMENTED);
}

export async function signIn(_input: SignInInput): Promise<User> {
  // TODO: POST /auth/login — autenticar e retornar { id, name, email }
  throw new Error(NOT_IMPLEMENTED);
}

export async function signOut(): Promise<void> {
  // TODO: POST /auth/logout (se aplicável)
  return;
}

export async function getCurrentUser(): Promise<User | null> {
  // TODO: GET /auth/me — retornar usuário atual ou null
  return null;
}

// ----- Tasks -----

export async function listTasks(_params?: ListTasksParams): Promise<Task[]> {
  // TODO: GET /tasks?search=...&status=... (filtrar por users_id no backend)
  throw new Error(NOT_IMPLEMENTED);
}

export async function createTask(_input: TaskInput): Promise<Task> {
  // TODO: POST /tasks
  throw new Error(NOT_IMPLEMENTED);
}

export async function updateTask(
  _id: string,
  _input: Partial<TaskInput>,
): Promise<Task> {
  // TODO: PUT /tasks/:id
  throw new Error(NOT_IMPLEMENTED);
}

export async function deleteTask(_id: string): Promise<void> {
  // TODO: DELETE /tasks/:id
  throw new Error(NOT_IMPLEMENTED);
}
