import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { saveContact } from "@/lib/recommendation";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — AgroNode Amazônia" },
      { name: "description", content: "Fale com a equipe do AgroNode." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveContact({ nome, telefone, mensagem });
      setSent(true);
      setNome("");
      setTelefone("");
      setMensagem("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não conseguimos enviar.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <section className="py-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Mensagem enviada</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Em breve entraremos em contato.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground"
        >
          Enviar outra mensagem
        </button>
      </section>
    );
  }

  return (
    <section className="py-2">
      <div className="flex items-center gap-2 text-primary">
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold">Fale com a gente</span>
      </div>
      <h1 className="mt-1 text-2xl font-bold text-foreground">Contato</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Conte sua dúvida ou pedido. Vamos responder.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Seu nome</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-2xl border-2 border-input bg-card px-4 py-4 text-base text-foreground"
            placeholder="Como você se chama"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Telefone</label>
          <input
            type="tel"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-2xl border-2 border-input bg-card px-4 py-4 text-base text-foreground"
            placeholder="(91) 0 0000-0000"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-foreground">Mensagem</label>
          <textarea
            required
            rows={5}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full rounded-2xl border-2 border-input bg-card px-4 py-4 text-base text-foreground"
            placeholder="Escreva sua dúvida ou pedido"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-primary-foreground shadow-md disabled:opacity-60"
        >
          {busy ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
