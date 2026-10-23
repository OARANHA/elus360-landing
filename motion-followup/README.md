# HyperFrames — acompanhamento comercial

Fonte editável da cena da seção de problema: contato recebido → ELUS 360 → retorno agendado. Herda a identidade azul e branca e a fonte Plus Jakarta Sans da landing. Os painéis surgem do mascote aos 0,7s e 1,45s; o canvas HyperFrames mede 1440 × 600 e dura 10s, incluindo a permanência da composição final.

A landing usa a mesma timeline GSAP determinística de `../public/brand/followup-motion.js` no DOM responsivo. O player local pausa fora da área observada e com a aba oculta, oferece pausa/retomada e “Rever animação” ao concluir. Movimento reduzido mostra o estado final; o conteúdo estático permanece disponível sem o player. Não há vídeo solicitado nem renderizado nesta entrega.

Os quatro WebP originais em `../public/brand/` permanecem byte a byte e são usados por links simbólicos em `assets/`. A timeline e o GSAP também são referenciados localmente. Os pesos 400–800 de Plus Jakarta Sans estão em `assets/fonts/`, com a licença OFL em `OFL.txt`. Preserve os destinos relativos ao mover o projeto.

Execute neste diretório; os scripts fixam o CLI HyperFrames em **0.8.186**:

```sh
npm run dev     # preview editável
npm run check   # validação
npm run render  # render opcional, não executado nesta entrega
```

O check executado passou sem erros de lint, runtime ou layout. O relatório geral retornou `ok: true`, com dois avisos não bloqueantes: texto pequeno para vídeo e permanência final intencional. Os seis testes da aplicação passaram, incluindo o MIME JavaScript dos arquivos locais.

Escopo, evidências visuais e limites da revisão estão em [`../docs/PROBLEMA-MOTION.md`](../docs/PROBLEMA-MOTION.md). Publicação e merge ainda não realizados.
