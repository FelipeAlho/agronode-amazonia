import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Tutorial = {
  id: string;
  titulo: string;
  cultura: string;
  conteudo_simples: string;
  ordem: number;
};

export const Route = createFileRoute("/tutoriais")({
  head: () => ({
    meta: [
      { title: "Tutoriais — AgroNode Amazônia" },
      { name: "description", content: "Passos simples de manejo para cada cultura." },
    ],
  }),
  component: Tutoriais,
});

function Tutoriais() {
  const [items, setItems] = useState<Tutorial[]>([]);
  const [open, setOpen] = useState<Tutorial | null>(null);

  useEffect(() => {
    supabase
      .from("tutoriais")
      .select("*")
      .order("ordem")
      .then(({ data }) => setItems((data as Tutorial[]) ?? []));
  }, []);

  if (open) {
    return (
      <article className="py-2">
        <button
          onClick={() => setOpen(null)}
          className="mb-4 text-sm font-semibold text-primary"
        >
          ← Voltar
        </button>
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-earth">
            {open.cultura}
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{open.titulo}</h1>
          <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground">
            {open.conteudo_simples}
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="py-2">
      <h1 className="text-2xl font-bold text-foreground">Tutoriais</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Passos simples para cuidar bem da sua plantação.
      </p>

      <ul className="mt-5 space-y-3">
        {items.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => setOpen(t)}
              className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-earth">
                  {t.cultura}
                </div>
                <div className="text-base font-semibold text-foreground">{t.titulo}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">Carregando tutoriais...</li>
        )}
      </ul>
    </section>
  );
}
