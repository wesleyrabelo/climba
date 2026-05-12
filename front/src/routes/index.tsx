import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("todo.auth.user");
      throw redirect({ to: raw ? "/tasks" : "/login" });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
