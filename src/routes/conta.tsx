import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, UserCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Conta — AgroNode Amazônia" },
      { name: "description", content: "Entre ou crie sua conta." },
    ],
  }),
  component: Conta,
});

function Conta() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: `${window.location.origin}/conta` },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        toast.success("Bem-vindo!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao acessar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
  }

  if (loading) {
    return <p className="py-8 text-center text-muted-foreground">Carregando...</p>;
  }

  if (user) {
    return (
      <section className="py-4">
        <div className="rounded-3xl border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <UserCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-foreground">
            {user.user_metadata?.full_name || user.email}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Você está conectado.</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-4 text-base font-bold text-destructive-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sair da conta
        </button>
      </section>
    );
  }

  return (
    <section className="py-2">
      <h1 className="text-2xl font-bold text-foreground">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use seu e-mail e uma senha que você lembre fácil.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border-2 border-input bg-card px-4 py-4 text-base text-foreground"
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-2xl border-2 border-input bg-card px-4 py-4 text-base text-foreground"
            placeholder="Mínimo 6 letras ou números"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-md disabled:opacity-60"
        >
          {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-5 w-full text-center text-sm font-semibold text-primary"
      >
        {mode === "login"
          ? "Ainda não tem conta? Criar agora"
          : "Já tem conta? Entrar"}
      </button>
    </section>
  );
}
