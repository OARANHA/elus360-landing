# ELUS — escritório que se materializa

Composição editável HyperFrames 1600×900, 16s: o desenho arquitetônico ganha linhas locais, textura, profundidade e nitidez até tornar-se um escritório realista ilustrativo. As três figuras humanas e dois mascotes ELUS aparecem em momentos escalonados. **Não há máscara de cortina horizontal.**

Arquivos: `index.html`, `compositions/office.html`, `assets/team-figures.svg`, `assets/mascot-elus.png` e imagens reais/traço originais. Cores: azul meia-noite, azul, ciano, violeta.

A landing usa versão de movimento implementada em HTML/CSS na própria `lib/landing.ts`, sem dependência de renderização MP4. O vídeo `public/brand/office-transition.mp4` permanece como histórico e já não é referenciado pela hero.

Para renderizar e verificar no ambiente com dependências: `npm run check` e `npm run render`. **Esta alteração de fonte ainda não tem validação HyperFrames CLI ou render MP4 comprovados.**
