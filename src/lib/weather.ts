// Open-Meteo: previsão de chuva e temperatura (sem chave de API)
export type WeatherSummary = {
  precipitationMm: number; // soma da chuva próximos 7 dias
  tempMaxAvg: number;
  tempMinAvg: number;
};

export async function getWeather(lat: number, lon: number): Promise<WeatherSummary> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Não conseguimos consultar a previsão do tempo agora.");
  const data = (await res.json()) as {
    daily: {
      precipitation_sum: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  };
  const d = data.daily;
  const sum = (a: number[]) => a.reduce((x, y) => x + (y ?? 0), 0);
  const avg = (a: number[]) => (a.length ? sum(a) / a.length : 0);
  return {
    precipitationMm: sum(d.precipitation_sum),
    tempMaxAvg: avg(d.temperature_2m_max),
    tempMinAvg: avg(d.temperature_2m_min),
  };
}

export type RainLevel = "baixa" | "media" | "alta";

// Classifica chuva acumulada (mm em 7 dias) em linguagem simples
export function classifyRain(precipitationMm: number): RainLevel {
  if (precipitationMm < 20) return "baixa";
  if (precipitationMm < 70) return "media";
  return "alta";
}

export function getBrowserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Seu celular não permitiu pegar a localização."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () =>
        // fallback: Moju-PA
        resolve({ lat: -1.888, lon: -48.766 }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  });
}
