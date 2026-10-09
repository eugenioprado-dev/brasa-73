# BRASA 73 — Burger & Grill

Case comercial fictício de **catálogo digital** para uma hamburgueria artesanal.
O visitante explora produtos, personaliza o pedido e prepara uma mensagem para o
WhatsApp. A aplicação funciona inteiramente no navegador.

## Stack preservada

React 19, TypeScript, Vite 8, Tailwind CSS 4 com `@tailwindcss/vite`, React Icons e
Oxlint. Nenhuma dependência foi adicionada. `package.json`, lockfile e plugins
do Vite foram preservados. O watcher do Vite ignora `.qa/`, que contém artefatos
de teste e perfis temporários com arquivos bloqueados pelo navegador.

## Executar

Com as dependências já presentes neste projeto:

```sh
npm run dev
npm run lint
npm run build
npm run preview
```

O build de produção é gerado em `dist/`. Não houve commit, push ou deploy.

## Funcionalidades

- Direção Brasa Premium: carvão, creme e vermelho queimado, com tipografia de sistema.
- Hero e destaques escuros, cardápio e localização claros, overlays e CTA em carvão.
- Hero, três destaques, catálogo, manifesto, localização, horários e rodapé.
- 18 produtos em cinco categorias, centralizados e tipados.
- Busca por nome e descrição, sem distinção de acentos ou maiúsculas, combinada com filtros.
- Detalhes em `dialog` nativo: imagem, adicionais coerentes, quantidade de 1 a 99,
  observação de até 300 caracteres e total calculado.
- Carrinho lateral, remoção, atualização de quantidades, adicionais e observações.
- Persistência local, tratamento de JSON inválido e feedback se não for possível salvar.
- Mensagem estruturada com revisão e cópia; integração opcional com WhatsApp.
- Menu mobile, estados vazios, feedback de adição, foco visível e reduced motion.
- Metadados em pt-BR, Open Graph, Twitter Card e favicon local. Sem URL de produção inventada.

## Arquitetura

```text
src/
  components/
    layout/       Header, marca e Footer
    menu/         ProductCard, ProductImage e ProductDetails
    cart/         CartDrawer e revisão do pedido
    ui/           Overlay nativo e controle de quantidade
  sections/       Hero, destaques, Catalog, manifesto, localização e CTA
  context/        CartProvider: estado e gravação do carrinho
  hooks/          useCart e contrato compartilhado do contexto
  data/menu.ts    Produtos, categorias e adicionais
  types/menu.ts   Category, Extra, MenuItem e CartItem
  config/site.ts  Número de WhatsApp, portfólio e chave de armazenamento
  utils/order.ts  Moeda, totais, restauração, mensagem e URL do WhatsApp
  App.tsx         Composição da página e controle de overlays
  index.css       Tailwind e estilos básicos
  styles.css      Identidade Brasa Premium, componentes e breakpoints
  assets/menu/    Fotos AVIF, WebP, JPG, JPEG e PNG detectadas pelo Vite
public/images/    Ilustrações locais e instruções para fotografias
scripts/qa.mjs    Regressão no Edge instalado, sem biblioteca adicional
```

Os preços e cálculos usam **centavos inteiros**. `Intl.NumberFormat` apresenta os
valores em reais. O carrinho armazena IDs dos produtos e adicionais; nomes e preços
são resolvidos a partir do catálogo atual, sem confiar em preços vindos do storage.
Cada adição cria uma linha independente: o mesmo burger com configurações distintas
não é mesclado. A quantidade de uma linha pode ser alterada no carrinho.

O `localStorage` usa `brasa73:cart:v1`. A restauração valida produtos, extras,
quantidades e observações, descarta registros inválidos e limita a leitura a 100
linhas. Não há sincronização entre abas. Se o navegador bloquear o armazenamento,
o pedido continua funcionando em memória, com aviso no carrinho ao tentar salvar.

Os overlays usam `showModal()` para tornar o fundo inerte, navegação nativa de foco,
fechamento por Escape/botão, bloqueio de rolagem e restauração do foco ao acionador.

## WhatsApp demonstrativo

Em `src/config/site.ts`, `whatsappNumber` permanece vazio. O botão **Finalizar pelo
WhatsApp** abre uma revisão dentro do carrinho, exibe a mensagem e permite copiá-la.
Não há redirecionamento para telefone fictício nem envio automático. Caso o acesso
à área de transferência seja bloqueado, o texto permanece selecionável.

Para conectar um negócio real, preencher `whatsappNumber` com o número autorizado
no formato internacional: DDI + DDD + número, somente dígitos (sem `+`, espaços ou
pontuação). A validação aceita 10 a 15 dígitos; não verifica se a conta existe.
A revisão passa a oferecer **Abrir WhatsApp**, em nova aba, apenas após clique.
A URL `wa.me` é montada com `encodeURIComponent`; o usuário envia a mensagem no
próprio WhatsApp. Entrega e disponibilidade são combinadas fora do catálogo.

`portfolioUrl` também está vazio. Preencher com uma URL válida para transformar o
crédito de Eugênio Prado em link.

## Assets e caráter demonstrativo

O negócio, os produtos, preços, endereço e horários são fictícios. Não há avaliações,
depoimentos, prêmios ou métricas apresentados como reais.

**Ainda faltam fotos para os demais produtos.** `brasa-73.png` já está disponível.
Para produtos sem fotografia, a V1 utiliza cinco
ilustrações SVG locais, identificadas como demonstrativas e compartilhadas por
categoria. Elas não retratam a composição exata de cada produto. Nenhum hotlink é
usado. O fallback preserva o layout se uma imagem falhar, e as imagens abaixo da
dobra usam lazy loading.

A lista exata das 18 fotos e a direção fotográfica estão em
[`src/assets/menu/README.md`](src/assets/menu/README.md). Adicione ali as imagens com
os IDs dos produtos e extensões minúsculas. A prioridade é AVIF, WebP, JPG, JPEG e
PNG. O Vite detecta as fotos existentes; produtos sem foto continuam
com a ilustração da categoria, sem requisições a arquivos inexistentes. Reinicie o
servidor se necessário e gere novamente o build. O hero preserva a ilustração de
burger mesmo quando fotografias são adicionadas ao catálogo.

Cards mantêm recorte `cover`; os detalhes usam `contain` numa área 4:3 limitada,
sem ampliar fotos pequenas. O formulário rola independentemente no desktop;
no mobile, a mídia e o conteúdo rolam sob o cabeçalho sempre acessível.

As ilustrações estão documentadas em [`public/images/README.md`](public/images/README.md).
Os ícones e imagens originais do template Vite permanecem no repositório, mas não
são importados pela aplicação.

## Validação

Lint e build devem passar antes de entregar alterações. Para repetir os testes de
navegador em Windows com Microsoft Edge instalado no caminho padrão:

```sh
# Terminal 1
npm run dev -- --host 127.0.0.1
# Terminal 2
node scripts/qa.mjs
```

O script usa Node 24 e o protocolo de depuração do Edge em modo headless, com perfil
isolado em `.qa/`. Não instala pacotes nem acessa contas do navegador pessoal.
Resultados e capturas ficam em `.qa/`, ignorado pelo Git. O script não abre WhatsApp.

A regressão cobre contraste em elementos claros e escuros, busca, filtros, estado vazio, modal, teclado, Escape, foco, extras,
quantidades, observações, totais, variantes separadas, cópia, persistência, remoção,
storage corrompido, reduced motion e ausência de erros de console. Verifica largura
da página, detalhes e carrinho em 320, 375, 425, 768, 1024 e 1440 px.

A validação automatizada usa Chromium/Edge; não substitui testes com leitor de tela,
Safari/iOS e dispositivos físicos. Tipografia pode variar conforme o sistema.

## Escopo proposital

Sem backend, banco de dados, login, painel administrativo, pagamento online,
checkout financeiro, API de delivery, cupons ou rastreamento. O total representa
somente os itens selecionados. Não há pedido real enviado ou recebido nesta demo.
