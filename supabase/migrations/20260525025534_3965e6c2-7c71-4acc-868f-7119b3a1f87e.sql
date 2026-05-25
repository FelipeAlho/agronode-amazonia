
ALTER TABLE public.regras_recomendacao
  ADD COLUMN IF NOT EXISTS textura_solo TEXT,
  ADD COLUMN IF NOT EXISTS drenagem_solo TEXT;

ALTER TABLE public.regras_recomendacao
  ALTER COLUMN tipo_solo DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_regras_textura_drenagem_chuva
  ON public.regras_recomendacao (textura_solo, drenagem_solo, chuva_prevista);
