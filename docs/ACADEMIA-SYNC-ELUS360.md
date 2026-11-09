# Academia ELUS360 — auditoria de atualização do currículo

**Status:** implementação em PR. A auditoria **não** atualiza automaticamente as aulas, imagens ou o site publicado.

## Fonte comprovada e separação de responsabilidades

- Site público: https://elus360.com.br/curso
- Fonte deste site: `OARANHA/elus360-landing`, `app/curso/route.ts`, `lib/curso-publico.json` e `public/curso/`.
- A stack Portainer `elus360_site` no ambiente `vigia-elus` está configurada com `OARANHA/elus360-landing`, branch `main`, `deploy/portainer-stack.yml` (inspeção de 09/11/2026). **Isso comprova a configuração Git da stack, não o digest da imagem em execução.**
- Fonte de lições do CRM: `OARANHA/elus360`, `curso/licoes/*.json` e `curso/demonstracoes/*.json`. O CRM também possui o procedimento `docs/runbooks/atualizar-curso-elus360.md`.
- O currículo publicado deste site tem **curadoria de conteúdo**: as aulas públicas não devem espelhar todo o catálogo interno, especialmente `admin-*`, opções de provedor, modelos de IA e credenciais. Preserve a seleção editorial, permissões, direitos de acesso e imagens próprias.

## Divergência detectada

Em 09/11/2026, o currículo deste repositório declarava `sourceVersion: "1.89.0 / 1.88.0"`. A linha de desenvolvimento do CRM ELUS360 já trabalha com atualizações posteriores; **a existência de código novo no CRM não comprova sua implantação**.

A revisão não deve igualar versões por edição textual. O procedimento seguro começa por comparar **SHAs completos dos commits** do site e do CRM, depois identificar quais funcionalidades foram publicadas e quais aulas têm diferenças textuais ou visuais.

## Diagnóstico inicial de revisão — 09/11/2026

Comparação direta em **35/35 módulos públicos** entre site `OARANHA/elus360-landing` @ `c0f063b3d9b93df3f93e8d66dae6f8f1a35e33df` e `OARANHA/elus360` @ `d7ffb33d6e0d13b0d74dd4bbb4598a1df3065c67`:

- Os 35 módulos apresentaram **ao menos uma diferença textual** (título, texto ou dica de passo). Isto não equivale a 35 bugs: há adaptação editorial deliberada no site.
- **Agentes, Casos e LGPD** apresentaram diferença adicional no número de passos de aula, que exige comparação de permissões/escopo.
- Os IDs de módulos e aulas públicas comparados possuem correspondentes na fonte consultada. O inventário não aprova automaticamente aulas ou módulos extras da fonte.
- A comparação foi feita **entre árvores Git identificadas**, não por renderização no navegador, nem com recibo de release. Portanto, **não confirma** a versão servida do CRM em produção, fidelidade de screenshots, navegação ou necessidade de recaptura de cada tela.
- Até criar um recibo de publicação ELUS360 verificável, a auditoria semanal pode voltar a apontar diferenças editoriais existentes. Seu resultado é uma fila de **revisão**, não uma lista de correções automáticas.

## Auditoria somente leitura

Em uma bancada descartável (fora do servidor de produção), com clones próprios e alterações locais preservadas:

```sh
cd /caminho/elus360-landing
node --test tests/curso-source-sync.test.mjs

CRM_SHA="$(git -C /caminho/elus360 rev-parse HEAD)"
SITE_SHA="$(git rev-parse HEAD)"
node scripts/auditar-curso-fonte.mjs /caminho/elus360 "$CRM_SHA" "$SITE_SHA" /caminho/saida-curso.json
```

A execução é determinística, sem IA, banco, browser, login, credenciais ou mutação da fonte. O destino JSON deve ser um caminho novo: o script usa criação exclusiva e **recusa sobrescrever** um relatório anterior.

O relatório inclui somente os identificadores dos módulos públicos e as **categorias** de diferenças (título, resumo, aulas, passos, textos). Não exporta conteúdo completo de aula, links de capturas, contatos, senhas, dados de cliente ou imagens. A semelhança textual **não demonstra** que a imagem, o clique ou a permissão são válidos na release.

`.github/workflows/academia-source-audit.yml` executa essa leitura sob `contents: read`, por acionamento manual ou no agendamento semanal previsto. Retém um artefato JSON para revisão; **não altera `lib/curso-publico.json` e não abre PR, publica GHCR, chama webhook Portainer nem faz deploy**. Não use o agendamento como promessa de atualização publicada.

## Atualização editorial: sequência de gates

1. **Comprovar versões reais:** conferir commit da release ELUS360 aprovada e digest do CRM implantado; conferir SHA da árvore deste site e digest do container do site. O SHA de checkout do workflow não substitui digest do container.
2. **Comparar conteúdo:** obter relatório e examinar as diferenças por módulo e aula, com a interface real do CRM na versão que será ensinada. Nem toda diferença textual deve ser copiada: certas simplificações são deliberadas.
3. **Revisar permissões e branding:** excluir recursos restritos ao administrador da plataforma, modelos/provedores, chaves e dados reais. Textos voltados ao aluno devem usar **ELUS360**; nomes internos de endpoints, integrações legadas e atribuições legais podem permanecer técnicos.
4. **Recapturar material relevante:** em bancada isolada, dados fictícios, worker/scheduler inativos, com a captura e os controles descritos no runbook do CRM. Conferir que o arquivo de imagem substituto e suas marcações correspondem à mesma tela. Nunca renomear imagem antiga para fazê-la parecer atual.
5. **Preservar o site:** alterar apenas lições/capturas selecionadas, manter o JSON curado, jornadas, simulador e chaves de progresso `elus360:curso:concluidas:v1`. Não publicar os 85 JSONs indiscriminadamente.
6. **Validar:** `node --test tests/curso-source-sync.test.mjs`, testes reais existentes do site, TypeScript, build, preview visual desktop/mobile, acessibilidade, navegação, simulador e imagens. Não tratar CI GREEN como aceite funcional.
7. **Publicar somente com aprovação:** PR e CI verdes, revisão visual, merge autorizado, imagem GHCR identificada por digest, deploy Portainer protegido e inspeção de `/curso` e aulas afetadas. Preservar rollback; só atualizar o recibo do CRM `curso/publicacao-elus360.json` depois de confirmar a publicação no navegador e SHAs relevantes.

## Limitações

- O comparador não cria traduções, screenshots, novas jornadas ou arquivos de manifesto.
- O comparador não cobre automaticamente mudanças de UX sem diferenças textuais; componentes, políticas de segurança e fluxos de IA também exigem auditoria.
- A interface atualmente observada no curso é PT-BR. Não declarar espanhol publicado sem página e capturas verificadas.
- O procedimento não altera a `main` do site nem publica aulas; seu uso real depende de merge e execução dos gates.
