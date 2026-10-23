# Movimento da seção de problema

Registro da extensão local entregue em 23/10/2026. Esta é a referência atual para o movimento da seção `#problema`; os trechos históricos do `DESIGN.md` raiz sobre CSS equivalente e verificações pendentes não descrevem esta implementação. O sistema visual global e seu sidecar foram preservados.

## Direção e escopo

A seção mantém a identidade azul e branca, Plus Jakarta Sans e os quatro WebP originais: `followup-scene`, `followup-mascot`, `followup-lead` e `followup-actions`. Seus bytes foram preservados. O mascote é a origem visual da informação: os painéis emergem dele aos 0,7s e 1,45s, abrem espaço para leitura e permanecem no estado final. A cena ilustra acompanhamento comercial; seus exemplos não são métricas verificadas do produto.

No desktop, os painéis flanqueiam o mascote. Abaixo de 680px, a composição empilha o mascote e os painéis e oculta as conexões. A introdução, os detalhes do problema e o convite comercial acompanham o fluxo responsivo. Os três links de login apontam para `https://elus.wandora.com.br/login`.

## Fontes e reprodução

- `lib/landing.ts`: seção e estilos responsivos da landing.
- `public/brand/followup-motion.js`: timeline GSAP compartilhada, com posições calculadas a partir do mascote e dos painéis.
- `public/brand/followup-player.js`: reprodução no DOM, pausa/retomada, replay e adaptação à largura.
- `public/brand/followup-gsap.js`: dependência local.
- `motion-followup/`: composição HyperFrames de 1440 × 600 e 10s, incluindo o estado final; imagens e scripts compartilhados por links simbólicos, fontes locais com licença OFL.

A animação começa quando a seção se aproxima da viewport; pausa fora da área observada ou quando a aba fica oculta. A conclusão mantém a cena e oferece “Rever animação”, sem loop automático. `prefers-reduced-motion` mostra o estado final e oculta o controle. O HTML fornece conteúdo estático se o player não estiver disponível. A landing reproduz o DOM; nenhum vídeo foi solicitado ou renderizado.

## Verificação e limites

Os seis testes da aplicação passaram, incluindo os arquivos da seção e o MIME JavaScript do servidor. O CLI HyperFrames fixado em 0.8.186 passou com zero erros de lint, runtime e layout; o relatório geral retornou `ok: true`. Permanecem dois avisos não bloqueantes de acabamento: texto pequeno para vídeo e a permanência final intencional.

A revisão independente recomendou entregar este escopo de fonte e seção. A evidência inclui captura móvel real em 390px, cena desktop e texto inferior, além de snapshots determinísticos da timeline. Não houve aprovação visual de uma captura desktop da página inteira. Capturas posteriores instáveis no navegador em nuvem foram excluídas da evidência.

Publicação e merge ainda não realizados. Este registro não altera a identidade global nem amplia a aprovação para outras seções.
