# AgroNode Amazônia

AgroNode Amazônia é um PWA mobile-first voltado para agricultores familiares da Vila Jutaí, em Moju-PA. O objetivo do sistema é transformar informações agrícolas técnicas em orientações simples para apoiar a decisão sobre o que plantar e como iniciar o manejo da terra.

## Objetivo do sistema

O sistema busca apoiar agricultores familiares na tomada de decisão agrícola por meio de uma interface simples, acessível e adaptada a celulares. A proposta é reduzir a distância entre bancos de dados agrícolas, informações climáticas e o uso prático no campo.

## Principais funcionalidades

- Tela inicial direta, sem landing page intermediária.
- Navegação inferior com acesso rápido a Início, Analisar, Tutoriais, Conta e Contato.
- Módulo de análise agrícola com perguntas simples sobre a terra, cultura desejada e tamanho da área.
- Consulta automática de clima por geolocalização.
- Classificação da chuva em linguagem simples.
- Recomendação de cultura com justificativa e manejo básico.
- Área de tutoriais com orientações pré-organizadas de manejo.
- Tela de conta com login, cadastro e saída.
- Formulário de contato.
- Estrutura de PWA com manifest e service worker.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Supabase
- Open-Meteo API
- Service Worker
- Web App Manifest

## Estrutura principal do projeto

```text
public/
  manifest.webmanifest
  sw.js

src/
  components/
    BottomNav.tsx
    ui/

  hooks/
    use-auth.ts
    use-mobile.tsx

  integrations/
    supabase/
      client.ts
      types.ts

  lib/
    recommendation.ts
    weather.ts
    utils.ts

  routes/
    index.tsx
    analisar.tsx
    tutoriais.tsx
    conta.tsx
    contato.tsx
    __root.tsx

supabase/
  migrations/
```

## Fluxo de funcionamento

1. O agricultor acessa o PWA pelo celular.
2. Na aba Analisar, informa características simples da terra.
3. O sistema tenta obter a localização do usuário pelo navegador.
4. A aplicação consulta dados climáticos da região.
5. A chuva prevista é classificada em baixa, média ou alta.
6. O sistema cruza as informações com regras de recomendação.
7. O agricultor recebe uma recomendação em linguagem simples.


## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Abra no navegador o endereço indicado pelo terminal.

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## PWA

O projeto inclui:

- `public/manifest.webmanifest`
- `public/sw.js`

Esses arquivos permitem que o sistema tenha comportamento de aplicativo instalado, com cache básico para acesso parcial offline.

## Observações importantes

Este projeto é um MVP. A proposta inicial é validar a usabilidade, o fluxo de recomendação e a adequação da linguagem para agricultores familiares. Novas etapas podem incluir painel administrativo, integração mais robusta com bases agrícolas externas e agente de IA via WhatsApp.

## Próximos passos sugeridos

- Melhorar a camada de API/backend.
- Validar as recomendações com técnicos e agricultores locais.
- Criar painel administrativo para edição de culturas e regras.
- Ampliar o uso de fontes de dados agrícolas.
- Adicionar fallback offline para tutoriais.
- Planejar futura integração com WhatsApp.
