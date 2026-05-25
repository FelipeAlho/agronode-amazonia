import { supabase } from "@/integrations/supabase/client";
import { classifyRain, getWeather, type RainLevel } from "./weather";

export type SoilTexture = "arenosa" | "areno_argilosa" | "argilosa" | "nao_sei";
export type SoilDrainage = "seca_rapido" | "umida_sem_poca" | "encharca" | "nao_sei";
export type CropInterest = "Mandioca" | "Milho" | "Banana" | "Açaí" | "ainda_nao_sei";
export type AreaSize = "pequena" | "media" | "grande";

export type Recommendation = {
  cultura: string;
  nivel: "alta" | "media" | "baixa";
  recomendacao: string;
  justificativa: string;
  manejo: string;
  chuva: RainLevel;
  precipitacaoMm: number;
};

type Regra = {
  textura_solo: string | null;
  drenagem_solo: string | null;
  chuva_prevista: string;
  nivel_indicacao: string;
  recomendacao: string;
  justificativa_simples: string;
  manejo_basico: string;
  culturas: { nome: string } | null;
};

const nivelOrdem = { alta: 3, media: 2, baixa: 1 } as const;

function cautelosa(
  cultura: string,
  chuva: RainLevel,
  precipitacaoMm: number,
  motivo: "textura" | "drenagem",
): Recommendation {
  const base =
    motivo === "textura"
      ? {
          justificativa:
            "Sem saber bem como é a sua terra, vamos com cuidado. Observar a terra ajuda a escolher melhor.",
          manejo:
            "Pegue um punhado de terra molhada e aperte. Se desmancha fácil, é mais arenosa; se vira uma bolinha firme, é mais pesada (barro). Faça uma nova análise quando souber.",
        }
      : {
          justificativa:
            "Sem saber o que acontece depois da chuva, é melhor esperar para observar a terra antes de plantar.",
          manejo:
            "Depois da próxima chuva forte, veja: a água some rápido, a terra fica só úmida, ou forma poça? Volte e faça a análise com essa resposta.",
        };
  return {
    cultura,
    nivel: "media",
    recomendacao: "Vamos com cuidado nessa análise.",
    justificativa: base.justificativa,
    manejo: base.manejo,
    chuva,
    precipitacaoMm,
  };
}

export async function getRecommendation(params: {
  textura: SoilTexture;
  drenagem: SoilDrainage;
  cropInterest: CropInterest;
  areaSize: AreaSize;
  lat: number;
  lon: number;
}): Promise<Recommendation> {
  const weather = await getWeather(params.lat, params.lon);
  const chuva = classifyRain(weather.precipitationMm);
  const precipitacaoMm = Math.round(weather.precipitationMm);

  const culturaAlvo =
    params.cropInterest === "ainda_nao_sei" ? "Mandioca" : params.cropInterest;

  // "Não sei" → resposta cautelosa
  if (params.textura === "nao_sei") {
    return cautelosa(culturaAlvo, chuva, precipitacaoMm, "textura");
  }
  if (params.drenagem === "nao_sei") {
    return cautelosa(culturaAlvo, chuva, precipitacaoMm, "drenagem");
  }

  // Drenagem encharca tem prioridade sobre textura
  let query = supabase
    .from("regras_recomendacao")
    .select(
      "textura_solo, drenagem_solo, chuva_prevista, nivel_indicacao, recomendacao, justificativa_simples, manejo_basico, culturas(nome)",
    )
    .eq("chuva_prevista", chuva);

  if (params.drenagem === "encharca") {
    query = query.eq("drenagem_solo", "encharca");
  } else {
    query = query
      .eq("textura_solo", params.textura)
      .eq("drenagem_solo", params.drenagem);
  }

  const { data, error } = await query;
  if (error) throw error;

  const regras = (data ?? []) as unknown as Regra[];
  if (regras.length === 0) {
    throw new Error("Não encontramos uma recomendação para essa combinação.");
  }

  // Prioriza a cultura escolhida; senão pega o maior nível
  let escolhida =
    regras.find((r) => r.culturas?.nome === culturaAlvo) ??
    regras.reduce((best, cur) =>
      nivelOrdem[cur.nivel_indicacao as keyof typeof nivelOrdem] >
      nivelOrdem[best.nivel_indicacao as keyof typeof nivelOrdem]
        ? cur
        : best,
    );

  return {
    cultura: escolhida.culturas?.nome ?? culturaAlvo,
    nivel: escolhida.nivel_indicacao as Recommendation["nivel"],
    recomendacao: escolhida.recomendacao,
    justificativa: escolhida.justificativa_simples,
    manejo: escolhida.manejo_basico,
    chuva,
    precipitacaoMm,
  };
}

export async function saveContact(data: {
  nome: string;
  telefone: string;
  mensagem: string;
}) {
  const { error } = await supabase.from("contatos").insert(data);
  if (error) throw error;
}
