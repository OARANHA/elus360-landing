# Extração inicial — ELUS 360

Fonte: TAR Z.Chat compartilhado na conversa, especificamente `public/index.html` (HTML estático de 1.742 linhas, com CSS embutido). No protótipo, `src/app/page.tsx` só exibe esse HTML via iframe.

## Extraído
- `src/styles/tokens.css`: cores, raios, sombras, fonte e easing recorrentes do `:root`.
- `src/styles/ui.css`: variantes de botão `.btn-primary`, `.btn-ghost`, `.btn-white`; painel branco e campo de formulário.
- `src/components/ui/elus-button.tsx`: botão e CTA-link sem comportamento de navegação inventado.
- `src/components/ui/elus-card.tsx`: painel simples.
- `src/components/ui/elus-field.tsx`: entrada de dados.

## Limites e migração
O HTML estático original **não foi modificado nem importado** por este PR. Portanto as páginas existentes **não consomem ainda os novos componentes**. Na futura importação/reconstrução Next.js, substituir sistematicamente somente padrões comprovadamente repetidos e testar equivalência visual desktop/mobile e `prefers-reduced-motion`.

Não migrar CSS específico do hero, mockup, FAQ ou infográficos para um componente genérico sem evidência de reutilização. Não integrar formulário ou chat sem contrato de API validado. Os componentes acima são uma primeira biblioteca para a futura migração, não prova de aplicação funcional publicada.

Exemplo:
```tsx
import {ElusButton,ElusCard,ElusField} from "@/components/ui/elus-index";
<ElusCard><ElusField aria-label="Seu e-mail" type="email"/><ElusButton>Solicitar demonstração</ElusButton></ElusCard>
```
