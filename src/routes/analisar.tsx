import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CloudRain, Leaf, MapPin, AlertTriangle } from "lucide-react";
import {
  getRecommendation,
  type AreaSize,
  type CropInterest,
  type Recommendation,
  type SoilDrainage,
  type SoilTexture,
} from "@/lib/recommendation";
import { getBrowserLocation } from "@/lib/weather";

export const Route = createFileRoute("/analisar")({
  head: () => ({
    meta: [
      { title: "Analisar — AgroNode Amazônia" },
      { name: "description", content: "Responda perguntas simples e receba uma recomendação." },
    ],
  }),
  component: Analisar,
});

const texturas: { value: SoilTexture; label: string }[] = [
  { value: "arenosa", label: "Mais areia, terra solta" },
  { value: "areno_argilosa", label: "Misturada: areia com barro" },
  { value: "argilosa", label: "Muito barro, terra pesada" },
  { value: "nao_sei", label: "Não sei" },
];

const drenagens: { value: SoilDrainage; label: string }[] = [
  { value: "seca_rapido", label: "A água some rápido" },
  { value: "umida_sem_poca", label: "A terra fica úmida, mas sem poça" },
  { value: "encharca", label: "Fica água parada / encharca" },
  { value: "nao_sei", label: "Não sei" },
];

const culturas: { value: CropInterest; label: string }[] = [
  { value: "Mandioca", label: "Mandioca" },
  { value: "Milho", label: "Milho" },
  { value: "Banana", label: "Banana" },
  { value: "Açaí", label: "Açaí" },
  { value: "ainda_nao_sei", label: "Ainda não sei" },
];

const areas: { value: AreaSize; label: string }[] = [
  { value: "pequena", label: "Pequena" },
  { value: "media", label: "Média" },
  { value: "grande", label: "Grande" },
];

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border-2 px-4 py-4 text-left text-base font-medium transition-all active:scale-[0.98] ${
        active
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Analisar() {
  const [textura, setTextura] = useState<SoilTexture | null>(null);
  const [drenagem, setDrenagem] = useState<SoilDrainage | null>(null);
  const [crop, setCrop] = useState<CropInterest | null>(null);
  const [area, setArea] = useState<AreaSize | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  async function handleSubmit() {
    if (!textura || !drenagem || !crop || !area) {
      toast.error("Responda todas as perguntas.");
      return;
    }
    setLoading(true);
    try {
      const { lat, lon } = await getBrowserLocation();
      const rec = await getRecommendation({
        textura,
        drenagem,
        cropInterest: crop,
        areaSize: area,
        lat,
        lon,
      });
      setResult(rec);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não conseguimos calcular.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const nivelColors = {
      alta: "bg-success text-primary-foreground",
      media: "bg-sun text-sun-foreground",
      baixa: "bg-danger text-primary-foreground",
    } as const;
    const nivelLabel = {
      alta: "Indicação alta",
      media: "Indicação média",
      baixa: "Indicação baixa",
    };

    return (
      <section className="py-4">
        <div className="rounded-3xl bg-card p-5 shadow-sm border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" />
            Recomendação
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{result.cultura}</h1>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${nivelColors[result.nivel]}`}
          >
            {nivelLabel[result.nivel]}
          </span>

          <p className="mt-4 text-lg font-semibold text-foreground">{result.recomendacao}</p>
          <p className="mt-2 text-base text-muted-foreground">{result.justificativa}</p>

          <div className="mt-5 rounded-2xl bg-secondary p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-earth">
              <CloudRain className="h-4 w-4" /> Previsão dos próximos 7 dias
            </div>
            <p className="text-sm text-secondary-foreground">
              Quantidade de chuva: <strong>{result.chuva}</strong> ({result.precipitacaoMm} mm)
            </p>
          </div>

          <div className="mt-5">
            <h2 className="text-base font-semibold text-foreground">Como cuidar do plantio</h2>
            <p className="mt-1 text-base text-muted-foreground">{result.manejo}</p>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-sm text-accent-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Essa recomendação não substitui a orientação de um técnico agrícola.
          </div>
        </div>

        <button
          onClick={() => {
            setResult(null);
            setTextura(null);
            setDrenagem(null);
            setCrop(null);
            setArea(null);
          }}
          className="mt-5 w-full rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground"
        >
          Fazer nova análise
        </button>
      </section>
    );
  }

  return (
    <section className="py-2">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        Vamos usar sua localização para olhar o tempo.
      </div>

      <h1 className="text-2xl font-bold text-foreground">Analisar plantio</h1>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-foreground">Como é a sua terra?</h2>
        <div className="space-y-2">
          {texturas.map((o) => (
            <OptionButton
              key={o.value}
              active={textura === o.value}
              onClick={() => setTextura(o.value)}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Depois da chuva, o que acontece?
        </h2>
        <div className="space-y-2">
          {drenagens.map((o) => (
            <OptionButton
              key={o.value}
              active={drenagem === o.value}
              onClick={() => setDrenagem(o.value)}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Qual cultura você pensa em plantar?
        </h2>
        <div className="space-y-2">
          {culturas.map((o) => (
            <OptionButton key={o.value} active={crop === o.value} onClick={() => setCrop(o.value)}>
              {o.label}
            </OptionButton>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Qual o tamanho aproximado da área?
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {areas.map((o) => (
            <OptionButton key={o.value} active={area === o.value} onClick={() => setArea(o.value)}>
              <span className="block text-center">{o.label}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-primary-foreground shadow-md disabled:opacity-60"
      >
        {loading ? "Analisando..." : "Ver recomendação"}
      </button>
    </section>
  );
}
