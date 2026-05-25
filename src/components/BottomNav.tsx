import { Link, useLocation } from "@tanstack/react-router";
import { Home, Leaf, BookOpen, User, MessageCircle } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/analisar", label: "Analisar", icon: Leaf },
  { to: "/tutoriais", label: "Tutoriais", icon: BookOpen },
  { to: "/conta", label: "Conta", icon: User },
  { to: "/contato", label: "Contato", icon: MessageCircle },
] as const;

/**
 * Barra de navegação superior (alinhada à esquerda/centro).
 * Mantive o nome do arquivo por compatibilidade com imports existentes.
 */
export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navegação principal"
      className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-center gap-1 px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
