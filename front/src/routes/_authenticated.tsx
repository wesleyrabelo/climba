import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("todo.auth.user");
    if (!raw) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
