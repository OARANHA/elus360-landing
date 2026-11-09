# Academia ELUS360 — comparação contínua com o CRM

## Origem e ambiente comprovados em 09/11/2026

- Curso público: https://elus360.com.br/curso (PT-BR, sem autenticação para leitura).
- Repositório do **site real**: `OARANHA/elus360-landing`; Portainer Vigia stack `elus360_site` **ID 6**, com `GitConfig.URL=.../elus360-landing`, `refs/heads/main`, `ConfigFilePath=deploy/portainer-stack.yml` e ConfigHash `c0f063b3d9b93df3f93e8d66dae6f8f1a35e33df` na inspeção. Conferir HEAD, imagem e rota na ocasião da implantação; o hash da stack não é prova isolada do conteúdo servido.
- Fonte oficial do **CRM**: `OARANHA/elus360`, releases próprias homologadas. Não usar diretamente `melgarafael/DeskcommCRM`, `melgarafael/deskcomm-site` nem `OARANHA/wandora_site`.
- Aulas públicas atualmente curadas em `lib/curso-publico.json`: 35 módulos, 173 aulas e jornadas por segmento, com seleção editorial própria. A fonte versionada ainda declara `sourceVersion = "1.89.0 / 1.88.0"`. É um indicador de **defasagem editorial histórica**, não deve ser alterado artificialmente para 1.102 sem recaptura e conferência.
- Página em `app/curso/route.ts`, JS em `public/curso/app.js` e `simulator.js`, screenshots reais já filtrados em `public/curso/capturas/*_elus.png`. Não substituir por JPG do capturador upstream. Progresso local `elus360:curso:concluidas:v1` não pode ser apagado.
- `docs/CURSO-ELUS360.md` registra seleção de 35 módulos e bloqueio de material de administrador, configurações de provedor/LLM, 838 imagens e sua geometria; deve ser preservado.

## Comparação segura e periódica

O workflow `.github/workflows/academia-source-audit.yml` roda **semanalmente** (segunda-feira 06:23 UTC) e por `workflow_dispatch`. Faz checkout read-only do site e do CRM oficial, resolve os dois SHAs e executa:

```bash
node --test tests/curso-source-sync.test.mjs
node scripts/auditar-curso-fonte.mjs /caminho/do/checkout-crm <SHA_CRM_40_HEX> <SHA_SITE_40_HEX> curso-auditoria.json
```

O arquivo `curso-auditoria.json` é um **relatório de candidatos de revisão**, não recibo de publicação. Para os 35 módulos já publicados, compara títulos, objetivos e textos de passos por IDs (incluindo passos ausentes e diferenças de quantidade). Não compara segredos nem copia imagens, não inclui texto integral no relatório e **não inclui módulos internos novos**. Mudanças no código/shared components, segurança, UX, permissões e screenshots exigem **revisão global independente**, mesmo que o texto do JSON não tenha mudado.

GitHub Action usa somente `contents:read`; sem `packages:write`, token extra, webhook Portainer, cron no servidor, download de arquivos de cliente, commit automático, publicação automática ou chamadas ao banco. Guarda summary e artifact com retenção limitada. A CI do site executa os testes isolados do comparador.

## Processo editorial completo

1. Conferir release ELUS360 própria aprovada, SHA exato da imagem realmente em execução e alterações desde a última versão ensinada. No CRM, usar `pnpm exec tsx curso/planejar-atualizacao.ts --edicao elus360` (PR de adaptação específica) para triagem por commit.
2. Ler o relatório, comparar cada candidata com a UI real no idioma ensinado e a documentação de contratos. Nem toda diferença é erro: alguns passos de API, IA de provedor e administração **foram excluídos por segurança editorial**.
3. Preparar worktree e Supabase **descartáveis**, com dados fictícios e worker parado, seguindo `docs/runbooks/atualizar-curso-elus360.md` do CRM. Conferir visualmente a versão real por página.
4. Adaptar e revisar somente as aulas e jornadas afetadas em `lib/curso-publico.json`, preservando módulos não públicos. Recapturar screenshots com o logo ELUS360 quando necessário, sem expor credenciais, nomes reais nem interface interna. Manter indicadores de versão e provenance por foto, com conferência desktop/mobile e geometria.
5. Validar `node --test tests/curso-source-sync.test.mjs`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, os testes do curso existentes e QA visual representativo de cada recorte. A existência dos assets não equivale à inspeção visual.
6. Abrir PR no `OARANHA/elus360-landing`, vinculando PR/commit do CRM, relatórios, decisões editoriais, diferenças descartadas justificadamente, fotos recapturadas e provas do preview. **Somente após aprovação explícita**, merge no site. O workflow `container.yml` publica imagem GHCR e pode acionar webhook Portainer ao fazer push em `main`, portanto merge no site pode ser um ato de implantação e exige gate de produção próprio.
7. Após observar domínio, curso, lição e imagens realmente publicados, registrar `curso/publicacao-elus360.json` no repositório CRM com SHAs e data reais (o recibo NÃO deve ser criado por suposição).

## Limites

- **Verificação semanal não atualiza o curso automaticamente.** Automatiza apenas descoberta, delimitação e entrega da revisão. A publicação de conteúdo precisa de validação humana e aprovação.
- `sourceVersion` na fonte do site continua histórico até revisão/conferência do material inteiro; não alegar que aulas ilustram a versão nova sem novas capturas.
- Nunca escrever `curso/publicacao.json` herdado do Deskcomm como recibo do ELUS360.
- Notas de memória no Hindsight usam **`bank_id="Elus360"`**, mas GitHub e runtime são a fonte de prova dos fatos mutáveis.

## Status desta entrega

**IMPLEMENTADO EM PR**: comparador, testes e workflow de leitura. **PENDENTES**: CI desse HEAD, execução real semanal/manual, provas visuais de screenshots, edição final do currículo, homologação e autorização de publicação. Nenhum merge ou deploy durante esta etapa.
