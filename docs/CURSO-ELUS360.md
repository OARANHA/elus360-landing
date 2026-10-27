# Academia ELUS360 — implementação /curso

## Entrega
- Rota isolada **/curso**, implementada em app/curso/route.ts, preservando a landing comercial.
- Currículo público: **35 módulos e 173 aulas**, incluindo textos didáticos e capturas.
- Jornadas: **10 segmentos, 30 jornadas e 120 cenas** fictícias.
- **838 imagens** referenciadas com sufixo _elus.png no caminho /curso/capturas/.
- **20 módulos internos Admin** excluídos integralmente (63 aulas); **6 módulos avançados** fora da versão pública (23 aulas); **6 passos** de gestão de provedor/LLM retirados.
- Somente texto e imagens. Nenhum player de vídeo e nenhuma integração YouTube/Vimeo.

## Arquivos
- app/curso/route.ts — HTML renderizado no servidor, catálogo, módulos, aulas e jornadas.
- lib/curso-publico.json — currículo didático filtrado.
- public/curso/style.css — design ELUS360 com tokens validados no DESIGN.md.
- public/curso/app.js — busca progressiva de aulas, lightbox, progresso local sem backend.
- scripts/validate-curso.mjs — checagens de limites, contagens, caminhos e ausência de vídeo.

## Imagens — integração verificada

O inventário público aprovado tinha 845 capturas. Uma captura adicional foi retirada após detectar conteúdo interno de LGPD referente à exclusão de tenants. A integração contém agora 844 referências. O mapeamento original permanece disponível para auditoria, mas não deve ser publicado sem esse filtro adicional.
O proprietário enviou 961 capturas PNG à branch via GitHub Desktop. Em auditoria do tree GitHub, todas as 838 imagens utilizadas pelo currículo público foram encontradas e os nomes coincidem exatamente. As 117 capturas fora da seleção pública (integrações avançadas e passos revisados) foram removidas da árvore atual da branch em commit de limpeza de 27/10/2026, sem afetar as 838 imagens em uso. O arquivo .gitkeep foi preservado. Imagens retiradas continuam recuperáveis no histórico anterior do Git enquanto ele existir; não tratar limpeza da branch como apagamento irrecuperável. O lote efetivo do curso usa os nomes:
- Original: inbox--conhecendo-a-tela--p1.jpg
- Substituto: inbox--conhecendo-a-tela--p1_elus.png
- URL final: /curso/capturas/inbox--conhecendo-a-tela--p1_elus.png

Quando ausentes, um aviso legível substitui a captura e os textos da aula continuam disponíveis. A auditoria GitHub em 27/10/2026 verificou os nomes dos arquivos físicos existentes na branch e comparou os 838 caminhos usados no curso. Ainda resta conferir conteúdo visual, exposição indevida e testes de build em navegador. Armazenar em R2 é alternativa para lote volumoso, mas exigiria ajustar o caminho sob autorização posterior.

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


## Adequação das capturas de agentes (27/10/2026)
Seis capturas da lista e do menu de agentes exibiam nomes de provedor ou modelo de IA. Foram retiradas da pasta pública e não são referenciadas no curso. O passo sobre a empresa/modelo foi revisado para manter somente orientações de operação; os outros textos didáticos permanecem. Há indicação discreta de captura pendente nessas etapas. O currículo conserva 35 módulos e 173 aulas, mas passa a exibir **838 imagens verificadas**. Os arquivos antigos permanecem recuperáveis no histórico Git. A substituição futura requer capturas atuais que não exponham informações internas.


## Contornos e marcações das capturas (referência HTML de 27/10/2026)

O curso público recupera a geometria didática do `index(1).html` entregue pelo proprietário: **838 capturas** utilizáveis, **1.546 marcações** (`caixa`, `seta`, `numero`). O catálogo `lib/curso-publico.json` agora guarda `marks` por passo/cena com `x,y,w,h,type,label`. As seis capturas de agentes retidas não recebem marcações nem reaparecem no curso.

O leitor projeta contornos, setas, números e máscara semitransparente por SVG com `viewBox="0 0 1440 900"`, sobre a captura PNG de proporção idêntica 16:10. **A imagem é sempre o fundo**, e o sombreamento é leve para conservar o contexto visual. A legenda numerada fora da imagem fornece as descrições mesmo sem JavaScript.

O botão de ampliação e o clique na foto abrem `<dialog>` nativo com uma cópia completa da composição: **foto + mesma camada SVG + mesmos números + legenda**. A máscara clonada recebe outro ID para evitar conflitos entre o original e o diálogo. Em mobile, o diálogo permite rolar horizontalmente a captura ampliada. O diálogo usa foco e tecla Escape nativos; o conteúdo do curso permanece legível sem JS.

O novo contrato `node scripts/validate-curso.mjs` confere as 838 imagens, 1546 marcas e bounds estritos de cada retângulo. É necessária a conferência visual em navegador real (desktop, mobile, zoom e redução de movimento); CI GREEN por si só não comprova ausência de clipping em todas as marcações.
