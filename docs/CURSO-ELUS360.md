# Academia ELUS360 — implementação /curso

## Entrega
- Rota isolada **/curso**, implementada em app/curso/route.ts, preservando a landing comercial.
- Currículo público: **35 módulos e 173 aulas**, incluindo textos didáticos e capturas.
- Jornadas: **10 segmentos, 30 jornadas e 120 cenas** fictícias.
- **845 imagens** referenciadas com sufixo _elus.jpg no caminho /curso/capturas/.
- **20 módulos internos Admin** excluídos integralmente (63 aulas); **6 módulos avançados** fora da versão pública (23 aulas); **6 passos** de gestão de provedor/LLM retirados.
- Somente texto e imagens. Nenhum player de vídeo e nenhuma integração YouTube/Vimeo.

## Arquivos
- app/curso/route.ts — HTML renderizado no servidor, catálogo, módulos, aulas e jornadas.
- lib/curso-publico.json — currículo didático filtrado.
- public/curso/style.css — design ELUS360 com tokens validados no DESIGN.md.
- public/curso/app.js — busca progressiva de aulas, lightbox, progresso local sem backend.
- scripts/validate-curso.mjs — checagens de limites, contagens, caminhos e ausência de vídeo.

## Imagens — entrega pendente
As imagens _elus **não foram recebidas nem incluídas nesta PR**. Colocar as capturas autorizadas em public/curso/capturas/ preservando os nomes:
- Original: inbox--conhecendo-a-tela--p1.jpg
- Substituto: inbox--conhecendo-a-tela--p1_elus.jpg
- URL final: /curso/capturas/inbox--conhecendo-a-tela--p1_elus.jpg

Quando ausentes, um aviso legível substitui a captura e os textos da aula continuam disponíveis. A validação atesta mapeamento de caminhos, não arquivos físicos presentes no site. Armazenar em R2 é alternativa para lote volumoso, mas exigiria ajustar o caminho sob autorização posterior.

## Navegação
- /curso — hero do curso gratuito, catálogo de módulos, 30 jornadas de exemplo, FAQ, CTA.
- /curso?m=inbox — introdução do módulo e suas aulas.
- /curso?m=inbox&a=conhecendo-a-tela — aula detalhada; anterior/próxima.
- /curso?segment=advocacia&journey=... — jornada fictícia.
- /#contato — CTA do formulário comercial já existente.

O HTML é escapado antes da interpolação. Parâmetros GET só selecionam IDs presentes no currículo. As imagens passam por verificação de prefixo e sufixo, sem aceitar caminhos arbitrários.

## Validação
Executar no checkout da branch:
1. node scripts/validate-curso.mjs
2. pnpm exec tsc --noEmit
3. pnpm lint
4. pnpm build

QA visual em navegador com desktop, tablet, mobile, teclado, imagens presentes/ausentes, ampliação, modo sem JS e reduced motion **ainda não executado**. Não declarar deploy ou build GREEN sem executar os testes. Progresso de leitura é armazenado apenas no localStorage; sem matrícula real, sincronização com CRM ou emissão de certificados.

## Referências visuais
MCP Inspo consultado: coursera-org (https://coursera.org), mintlify-com (https://mintlify.com), novu-co (https://novu.co). Referências inspiram hierarquia educacional, leitura navegável e representação de produto, sem copiar layouts, CSS, imagens ou marca. Paleta e tipografia são extraídas do DESIGN.md da ELUS360.

## Preservação
Nenhuma modificação na landing /, na operação do CRM, no banco de leads, na gestão, na infraestrutura ou no deploy de produção.
