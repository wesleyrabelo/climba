import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pencil, Plus, Search, Trash2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import { createTask, deleteTask, listTasks, signOut, updateTask } from "@/lib/api";
import type { Task, TaskInput, TaskStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
});

const STATUS_VARIANT: Record<TaskStatus, "default" | "secondary" | "outline"> = {
  pending: "outline",
  in_progress: "secondary",
  completed: "default",
};

function TasksPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [deleting, setDeleting] = React.useState<Task | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const tasksQuery = useQuery({
    queryKey: ["tasks", { search: debouncedSearch, status: statusFilter }],
    queryFn: () =>
      listTasks({
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: () => {
      toast.success("Tarefa criada");
      setFormOpen(false);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao criar"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskInput }) => updateTask(id, input),
    onSuccess: () => {
      toast.success("Tarefa atualizada");
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      toast.success("Tarefa excluída");
      setDeleting(null);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao excluir"),
  });

  async function handleSubmit(input: TaskInput) {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input });
    } else {
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      await createMutation.mutateAsync({
        ...input,
        users_id: Number(user.id),
      });
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      // ignora erros do backend ao deslogar
    }
    setUser(null);
    navigate({ to: "/login" });
  }

  const tasks = tasksQuery.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Minhas tarefas</h1>
            {user && <p className="text-sm text-muted-foreground">Olá, {user.name}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova tarefa
          </Button>
        </div>

        {tasksQuery.isLoading && (
          <p className="py-8 text-center text-muted-foreground">Carregando...</p>
        )}

        {tasksQuery.isError && (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              Não foi possível carregar tarefas.
              <br />
              <span className="text-destructive">
                {tasksQuery.error instanceof Error ? tasksQuery.error.message : "Erro"}
              </span>
            </CardContent>
          </Card>
        )}

        {tasksQuery.isSuccess && tasks.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhuma tarefa encontrada.
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge variant={STATUS_VARIANT[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {task.due_date && (
                      <span>Prevista: {format(new Date(task.due_date), "dd/MM/yyyy")}</span>
                    )}
                    {task.completed_at && (
                      <span>
                        Concluída em: {format(new Date(task.completed_at), "dd/MM/yyyy HH:mm")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditing(task);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleting(task)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        task={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa "{deleting?.title}" será removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && deleteMutation.mutate(deleting.id)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
