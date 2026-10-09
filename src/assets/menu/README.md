# Fotografias de produtos

Adicionar aqui fotos próprias ou licenciadas, nomeadas com o ID do produto.
Formatos aceitos: `.avif`, `.webp`, `.jpg`, `.jpeg` e `.png`, em minúsculas.
Se houver mais de um arquivo para o mesmo ID, a prioridade é exatamente:
**AVIF → WebP → JPG → JPEG → PNG**. Somente arquivos existentes entram na resolução;
não há tentativas de URL que produzam 404 para descobrir uma imagem.

Exemplos de nomes (a extensão pode ser qualquer uma das cinco aceitas):

```text
brasa-73.webp          smoke-house.webp       bacon-melt.webp
duplo-fogo.webp        bbq-crunch.webp        cheddar-onion.webp
green-fire.webp        combo-brasa.webp       combo-duplo.webp
combo-smoke.webp       fritas-casa.webp       fritas-cheddar.webp
onion-rings.webp       refrigerante.webp      cha-gelado.webp
limonada.webp          brownie.webp           milkshake.webp
```

O catálogo detecta os arquivos via `import.meta.glob` em `src/data/menu.ts`.
Depois de adicionar uma foto, reinicie o Vite se necessário. Gere novamente o build
para distribuí-la. Não é preciso editar os componentes nem os dados dos produtos.
As fotos alimentam os cards, destaques e detalhes. O hero preserva a ilustração.

Direção: produto real, fundo carvão, luz lateral quente, detalhes de queijo,
crosta da carne e pão. Evitar fundos de fast-food, embalagens de marcas externas,
texto embutido, selos e composição que não corresponda à descrição do produto.

Sugestão: 1200 × 1000 px, produto centralizado com margem de segurança de 12–15%.
Cards usam recorte `cover`, com destaque próximo de 6:5. O modal usa `contain`
em uma área 4:3 de altura limitada, preservando fotos quadradas, horizontais e
verticais sem cortar ou distorcer o produto. Fotos pequenas não são ampliadas.
No desktop, apenas o formulário rola quando necessário; no mobile, mídia e
formulário rolam juntos abaixo do cabeçalho fixo com o botão fechar.
Conferir cards e detalhes ao adicionar cada foto. Preferir até 250 KB.

Já existe `brasa-73.png` neste diretório. Na ausência de foto para um produto, são usados
os SVGs de `public/images/`. A detecção de arquivos evita requisições a caminhos
inexistentes. Uma foto que falhar em runtime recua para a ilustração da categoria;
se a ilustração também falhar, a marca mantém a área visual preenchida.
