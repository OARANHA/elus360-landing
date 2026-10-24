# HyperFrames — acompanhamento comercial

Fonte editável da cena da seção de problema: contato recebido → ELUS 360 → retorno agendado. Herda a identidade azul e branca e a fonte Plus Jakarta Sans da landing. A cena é coreografada em quatro etapas: lead, conversa interrompida, atuação ELUS e retorno agendado. O canvas HyperFrames mede 1440 × 600 e dura 10s, incluindo a permanência da composição final.

A landing usa a mesma timeline GSAP determinística de `../public/brand/followup-motion.js` no DOM responsivo. O player local pausa fora da área observada e com a aba oculta, oferece pausa/retomada e “Rever animação” ao concluir. Movimento reduzido mostra o estado final; o conteúdo estático permanece disponível sem o player. Não há vídeo solicitado nem renderizado nesta entrega.

Os quatro WebP originais em `../public/brand/` permanecem byte a byte e são espelhados como arquivos regulares em `assets/` (sem symlinks, por compatibilidade com o clone Git do Portainer). A timeline de `assets/followup-motion.js` deve permanecer idêntica a `../public/brand/followup-motion.js`; o teste standalone impede divergências. O GSAP é local. Os pesos 400–800 de Plus Jakarta Sans estão em `assets/fonts/`, com a licença OFL em `OFL.txt`. Preserve os destinos relativos ao mover o projeto.

Execute neste diretório; os scripts fixam o CLI HyperFrames em **0.8.186**:

```sh
npm run dev     # preview editável
npm run check   # validação
npm run render  # render opcional, não executado nesta entrega
```

O check histórico da composição anterior passou; uma execução atual do CLI HyperFrames deve ser verificada separadamente. Os testes automatizados de CI abrangem a timeline, o player e o servidor standalone, mas não substituem QA visual.

Escopo, evidências visuais e limites da revisão estão em [`../docs/PROBLEMA-MOTION.md`](../docs/PROBLEMA-MOTION.md). Alterações desta fase em PR #9; mesclar somente após CI GREEN.
