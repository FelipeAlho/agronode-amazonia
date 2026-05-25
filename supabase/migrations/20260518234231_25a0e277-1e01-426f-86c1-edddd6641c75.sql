
-- CULTURAS
CREATE TABLE public.culturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao_simples TEXT NOT NULL,
  ciclo TEXT NOT NULL,
  solo_ideal TEXT NOT NULL,
  necessidade_agua TEXT NOT NULL,
  periodo_plantio TEXT NOT NULL,
  manejo_basico TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.culturas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "culturas leitura publica" ON public.culturas FOR SELECT USING (true);

-- REGRAS
CREATE TABLE public.regras_recomendacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultura_id UUID NOT NULL REFERENCES public.culturas(id) ON DELETE CASCADE,
  tipo_solo TEXT NOT NULL,
  chuva_prevista TEXT NOT NULL,
  nivel_indicacao TEXT NOT NULL,
  recomendacao TEXT NOT NULL,
  justificativa_simples TEXT NOT NULL,
  manejo_basico TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.regras_recomendacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regras leitura publica" ON public.regras_recomendacao FOR SELECT USING (true);

-- TUTORIAIS
CREATE TABLE public.tutoriais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  cultura TEXT NOT NULL,
  conteudo_simples TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tutoriais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tutoriais leitura publica" ON public.tutoriais FOR SELECT USING (true);

-- CONTATOS
CREATE TABLE public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qualquer um pode enviar contato" ON public.contatos FOR INSERT WITH CHECK (true);

-- SEED CULTURAS
INSERT INTO public.culturas (nome, descricao_simples, ciclo, solo_ideal, necessidade_agua, periodo_plantio, manejo_basico) VALUES
('Mandioca', 'Planta resistente que vai bem na terra do Pará. Boa para vender ou comer em casa.', '8 a 12 meses', 'Terra arenosa ou solta, que não segura muita água', 'Pouca a média', 'Início do período de chuvas', 'Plantar a maniva inclinada, capinar a roça, colher quando a folha amarelar'),
('Milho', 'Planta de ciclo curto, boa para alimentar a família e criar animais.', '3 a 4 meses', 'Terra solta com boa mistura, nem encharcada nem muito seca', 'Média', 'Início das chuvas regulares', 'Plantar em fileiras, capinar nas primeiras semanas, adubar quando possível'),
('Banana', 'Planta que produz o ano todo se a terra tiver boa umidade.', 'A partir de 9 meses, depois colhe sempre', 'Terra úmida mas que não encharca', 'Alta', 'Pode plantar durante quase o ano todo', 'Tirar folhas velhas, controlar mato, escorar cachos pesados'),
('Açaí', 'Palmeira da região, boa para áreas úmidas perto de igarapé.', 'A partir de 3 a 4 anos', 'Terra úmida, até áreas que encharcam às vezes', 'Alta', 'Período de chuvas', 'Manter o touceiro com 4 a 5 estipes, limpar o redor, colher com cuidado');

-- SEED REGRAS (cruzamento solo x chuva)
INSERT INTO public.regras_recomendacao (cultura_id, tipo_solo, chuva_prevista, nivel_indicacao, recomendacao, justificativa_simples, manejo_basico)
SELECT id, 'arenosa', 'baixa', 'alta', 'Boa hora para plantar mandioca', 'A mandioca gosta de terra solta e suporta bem pouca chuva.', 'Plantar a maniva inclinada e capinar nas primeiras semanas.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'arenosa', 'media', 'alta', 'Boa hora para plantar mandioca', 'Terra arenosa com chuva média é o ideal para a mandioca.', 'Acompanhe o crescimento e mantenha a roça limpa.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'arenosa', 'alta', 'media', 'Pode plantar mandioca com cuidado', 'Chuva forte demais pode apodrecer a maniva no começo.', 'Plante em local com leve declive para a água escorrer.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'argilosa', 'baixa', 'media', 'Mandioca dá, mas precisa preparar a terra', 'A terra argilosa segura mais água, então o ar entra menos.', 'Afofar bem a terra antes de plantar.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'argilosa', 'media', 'media', 'Mandioca dá com preparo', 'Argila com chuva média pede atenção com drenagem.', 'Fazer leiras (montinhos) para a água não parar nas raízes.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'argilosa', 'alta', 'baixa', 'Evite plantar mandioca agora', 'Muita chuva em terra argilosa apodrece a raiz.', 'Espere o tempo mais firme ou escolha terra mais alta.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'umida', 'baixa', 'media', 'Mandioca pode dar', 'Terra úmida ajuda no começo, mas precisa de drenagem.', 'Faça leiras altas.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'umida', 'media', 'baixa', 'Mandioca não é a melhor escolha', 'Mandioca não gosta de terra que segura muita água.', 'Considere plantar banana ou açaí nessa terra.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'umida', 'alta', 'baixa', 'Não é boa hora para mandioca', 'A raiz vai apodrecer com tanta água.', 'Aguarde estação mais seca.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'encharca', 'baixa', 'baixa', 'Mandioca não combina', 'Mandioca não suporta encharcamento.', 'Escolha banana ou açaí para essa terra.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'encharca', 'media', 'baixa', 'Mandioca não combina', 'Mandioca não suporta encharcamento.', 'Escolha banana ou açaí para essa terra.' FROM public.culturas WHERE nome='Mandioca'
UNION ALL SELECT id, 'encharca', 'alta', 'baixa', 'Mandioca não combina', 'Mandioca não suporta encharcamento.', 'Escolha banana ou açaí para essa terra.' FROM public.culturas WHERE nome='Mandioca'

UNION ALL SELECT id, 'arenosa', 'baixa', 'baixa', 'Milho precisa de mais água', 'Terra arenosa seca rápido e o milho sofre.', 'Espere chuva mais firme.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'arenosa', 'media', 'media', 'Milho pode dar', 'Terra arenosa com chuva média funciona.', 'Adube a cova com matéria orgânica.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'arenosa', 'alta', 'alta', 'Boa hora para plantar milho', 'Chuva regular e terra solta favorecem o milho.', 'Plante em fileiras e capine nas primeiras semanas.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'argilosa', 'baixa', 'media', 'Milho pode dar com preparo', 'Argila segura água, ajuda quando chove pouco.', 'Solte bem a terra antes do plantio.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'argilosa', 'media', 'alta', 'Boa hora para plantar milho', 'Argila com chuva média é boa combinação.', 'Cuide do mato e adube se possível.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'argilosa', 'alta', 'media', 'Milho pode dar com atenção', 'Chuva forte em argila pode encharcar.', 'Plante em terreno com leve declive.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'umida', 'baixa', 'media', 'Milho pode dar', 'Umidade ajuda na germinação.', 'Cuide para a água escorrer.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'umida', 'media', 'media', 'Milho pode dar', 'Combinação razoável para o milho.', 'Faça canaletas se a água parar.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'umida', 'alta', 'baixa', 'Evite plantar milho agora', 'Milho não gosta de terra encharcada.', 'Espere o tempo firmar.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'encharca', 'baixa', 'baixa', 'Milho não combina', 'O milho perde a raiz em terra que encharca.', 'Escolha banana ou açaí.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'encharca', 'media', 'baixa', 'Milho não combina', 'O milho perde a raiz em terra que encharca.', 'Escolha banana ou açaí.' FROM public.culturas WHERE nome='Milho'
UNION ALL SELECT id, 'encharca', 'alta', 'baixa', 'Milho não combina', 'O milho perde a raiz em terra que encharca.', 'Escolha banana ou açaí.' FROM public.culturas WHERE nome='Milho'

UNION ALL SELECT id, 'arenosa', 'baixa', 'baixa', 'Banana precisa de mais água', 'Terra arenosa seca rápido e a banana sofre.', 'Considere mandioca para essa terra.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'arenosa', 'media', 'media', 'Banana pode dar com cuidado', 'Funciona se você regar nas estiagens.', 'Cobrir o pé com palha para guardar umidade.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'arenosa', 'alta', 'alta', 'Boa hora para plantar banana', 'Chuva forte compensa a terra arenosa.', 'Tirar folhas velhas e escorar cachos.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'argilosa', 'baixa', 'media', 'Banana pode dar', 'A argila segura a umidade que a banana gosta.', 'Cuidado com a água parada.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'argilosa', 'media', 'alta', 'Boa hora para plantar banana', 'Combinação muito boa.', 'Manejo normal: limpar mato e tirar folhas velhas.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'argilosa', 'alta', 'alta', 'Boa hora para plantar banana', 'A banana adora umidade.', 'Apenas cuide para a água não ficar parada em poça.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'umida', 'baixa', 'alta', 'Boa hora para plantar banana', 'Terra úmida é ideal para banana.', 'Manejo simples de limpeza.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'umida', 'media', 'alta', 'Boa hora para plantar banana', 'Combinação ideal.', 'Acompanhe o crescimento.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'umida', 'alta', 'alta', 'Boa hora para plantar banana', 'Banana vai muito bem.', 'Cuide só de poças paradas.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'encharca', 'baixa', 'media', 'Banana pode dar com cuidado', 'A banana aguenta umidade mas não água parada o tempo todo.', 'Plantar em parte mais alta da terra.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'encharca', 'media', 'media', 'Banana pode dar com cuidado', 'Mesma orientação.', 'Plantar em parte mais alta.' FROM public.culturas WHERE nome='Banana'
UNION ALL SELECT id, 'encharca', 'alta', 'baixa', 'Cuidado, pode encharcar demais', 'Água parada apodrece a raiz da banana.', 'Considere açaí nessa terra.' FROM public.culturas WHERE nome='Banana'

UNION ALL SELECT id, 'arenosa', 'baixa', 'baixa', 'Açaí precisa de muita água', 'Açaí não vai bem em terra seca.', 'Escolha mandioca para essa terra.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'arenosa', 'media', 'baixa', 'Açaí precisa de muita água', 'Mesmo com chuva média a areia drena rápido.', 'Escolha mandioca ou milho.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'arenosa', 'alta', 'media', 'Açaí pode dar com atenção', 'Só funciona se a chuva continuar forte.', 'Plantar perto de igarapé se possível.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'argilosa', 'baixa', 'media', 'Açaí pode dar', 'Argila ajuda a guardar a água.', 'Plantar perto de área úmida.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'argilosa', 'media', 'alta', 'Boa hora para plantar açaí', 'Combinação boa para o açaí.', 'Manter touceira limpa.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'argilosa', 'alta', 'alta', 'Boa hora para plantar açaí', 'Açaí ama esse ambiente.', 'Manter touceira com 4 a 5 estipes.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'umida', 'baixa', 'alta', 'Boa hora para plantar açaí', 'Terra úmida é ideal.', 'Limpar o redor da touceira.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'umida', 'media', 'alta', 'Boa hora para plantar açaí', 'Combinação ideal.', 'Manejo simples.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'umida', 'alta', 'alta', 'Boa hora para plantar açaí', 'Tudo a favor.', 'Manejo simples.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'encharca', 'baixa', 'alta', 'Boa hora para plantar açaí', 'Açaí gosta dessa terra molhada.', 'Manejo simples.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'encharca', 'media', 'alta', 'Boa hora para plantar açaí', 'Açaí gosta dessa terra molhada.', 'Manejo simples.' FROM public.culturas WHERE nome='Açaí'
UNION ALL SELECT id, 'encharca', 'alta', 'alta', 'Boa hora para plantar açaí', 'Açaí gosta dessa terra molhada.', 'Manejo simples.' FROM public.culturas WHERE nome='Açaí';

-- SEED TUTORIAIS
INSERT INTO public.tutoriais (titulo, cultura, conteudo_simples, ordem) VALUES
('Como preparar a terra para mandioca', 'Mandioca', E'A mandioca gosta de terra solta. Antes de plantar:\n1. Limpe o mato da área.\n2. Solte a terra com enxada até ficar fofa.\n3. Faça leiras (montinhos) com cerca de 30 cm de altura.\n4. Plante a maniva inclinada, deixando duas gemas para fora.\n5. Capine sempre nas primeiras 8 semanas.', 1),
('Cuidados básicos com o milho', 'Milho', E'O milho cresce rápido e precisa de atenção no começo:\n1. Plante em fileiras com espaço de um passo entre elas.\n2. Coloque duas sementes por cova.\n3. Capine quando o mato começar a crescer junto.\n4. Se puder, adube com esterco curtido.\n5. Colha quando o cabelo do milho ficar marrom seco.', 2),
('Como evitar solo encharcado', 'Geral', E'Quando a terra segura muita água, as raízes apodrecem. Para evitar:\n1. Observe onde a água empoça depois da chuva.\n2. Abra pequenos canais para a água escorrer.\n3. Faça leiras (montinhos) para plantar em cima.\n4. Escolha plantas que gostem de umidade, como banana ou açaí.', 3),
('Quando plantar banana', 'Banana', E'A banana pode ser plantada quase o ano todo, mas o melhor é:\n1. Plantar no início das chuvas, para a muda pegar bem.\n2. Escolher terra úmida, mas não alagada.\n3. Abrir cova grande e colocar matéria orgânica.\n4. Deixar espaço entre as touceiras para o ar passar.\n5. Tirar folhas secas regularmente.', 4),
('Cuidados iniciais com o açaí', 'Açaí', E'O açaí precisa de paciência. Nos primeiros anos:\n1. Mantenha a touceira com 4 a 5 estipes (caules).\n2. Limpe sempre o redor da planta.\n3. Não deixe gado pisar nas mudas.\n4. Proteja do sol forte com sombra leve no começo.\n5. A primeira colheita acontece a partir de 3 a 4 anos.', 5);
