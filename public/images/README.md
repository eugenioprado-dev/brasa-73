# Imagens locais

Os cinco SVGs são ilustrações provisórias originais, não fotografias dos produtos.
Não precisam de internet e não representam a composição exata de cada item.

| Arquivo atual | Utilização |
| --- | --- |
| `burger.svg` | Hero, destaques e sete burgers |
| `combo.svg` | Três combos |
| `fries.svg` | Três porções |
| `drink.svg` | Três bebidas |
| `dessert.svg` | Duas sobremesas |

Para a versão com fotografia, adicionar arquivos AVIF, WebP, JPG, JPEG ou PNG próprios ou licenciados em
`src/assets/menu/`. O Vite detecta os arquivos existentes automaticamente, sem
edição dos componentes. O hero mantém `burger.svg` como parte da identidade gráfica.
A direção fotográfica e as dimensões estão em `src/assets/menu/README.md`.

Lista exata de fotos necessárias, uma por produto:

- `brasa-73.webp`
- `smoke-house.webp`
- `bacon-melt.webp`
- `duplo-fogo.webp`
- `bbq-crunch.webp`
- `cheddar-onion.webp`
- `green-fire.webp`
- `combo-brasa.webp`
- `combo-duplo.webp`
- `combo-smoke.webp`
- `fritas-casa.webp`
- `fritas-cheddar.webp`
- `onion-rings.webp`
- `refrigerante.webp`
- `cha-gelado.webp`
- `limonada.webp`
- `brownie.webp`
- `milkshake.webp`

As fotografias podem ser adicionadas gradualmente: cada produto sem foto continua
usando a ilustração da categoria. Se uma fotografia falhar, `ProductImage` recua
para o SVG; se o SVG também falhar, uma composição com a marca mantém o layout.
Os assets `src/assets/hero.png`, `react.svg`, `vite.svg` e `public/icons.svg`
são remanescentes do template inicial e não são usados pela aplicação.
