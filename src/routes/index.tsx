import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Sprout, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgroNode Amazônia — Início" },
      {
        name: "description",
        content: "Assistente simples para escolher o que plantar na sua terra.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <section className="py-6">
      {/* Saudação amigável */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Olá, agricultor(a)
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            AgroNode Amazônia
          </h1>
        </div>
      </div>

      <p className="mt-5 text-base leading-relaxed text-foreground/90">
        Bem-vindo à floresta que nos alimenta. 🌿<br />
        Este é um espaço feito para você, Agricultor familiar,
        que cuida da terra com as próprias mãos. Aqui a gente te ajuda a
        escolher melhor <strong>o que plantar</strong> e <strong>quando plantar</strong>,
        usando o clima e o tipo da sua terra.
      </p>

      {/* Botão pequeno antes da história */}
      <Link
        to="/analisar"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
      >
        <Sprout className="h-4 w-4" />
        Começar análise
        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* História / descrição do projeto */}
      <article className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
          Sobre o projeto
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          O AgroNode nasceu para aproximar o conhecimento técnico de quem
          vive da terra. Reunimos dados de clima, solo e culturas da Amazônia
          e transformamos em recomendações simples, no seu idioma e no seu
          tempo. Sem complicação, sem termos difíceis.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tudo funciona no celular, mesmo com internet fraca, porque
          acreditamos que a tecnologia tem que servir à roça — e não o
          contrário.
        </p>
      </article>

    </section>
  );
}
