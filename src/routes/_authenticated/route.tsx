import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async ({ location }) => {
    // Only guard on the client; SSR can't read localStorage session.
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});

function AuthenticatedLayout() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthed(!!data.session);
      setChecking(false);
      if (!data.session) {
        window.location.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      if (!session) window.location.replace("/login");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking || !authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-muted-foreground">
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 animate-pulse text-primary" />
          Memeriksa sesi…
        </div>
      </div>
    );
  }

  return <Outlet />;
}
