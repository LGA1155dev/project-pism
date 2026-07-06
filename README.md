# Landing page — scroll-scrubbed hero

HTML5 + CSS3 + JavaScript (ES6) puro. Sem frameworks.

## Como rodar

Como o `script.js` usa ES6 modules (`import`/`export`) e faz `fetch` das imagens,
o navegador precisa servir os arquivos por HTTP (abrir o `index.html` direto
com `file://` não funciona por causa do CORS de módulos).

Rode um servidor local simples na pasta do projeto, por exemplo:

```bash
python3 -m http.server 8080
# depois abra http://localhost:8080
```

ou, com Node instalado:

```bash
npx serve .
```

## Estrutura

```
/
├── index.html
├── style.css              → tokens de design, layout, todas as seções
├── script.js               → ponto de entrada, orquestra os módulos
│
├── assets/
│   └── frames/              → sequência de frames (0001.webp, 0002.webp, ...)
│
├── css/
│   └── animations.css       → keyframes e classes de reveal (fade + slide)
│
└── js/
    ├── preload.js           → carrega todos os frames antes de iniciar
    ├── hero.js              → canvas, TOTAL_FRAMES, desenho do frame, zoom
    └── scroll.js            → scroll-scrubbing + reveal das seções
```

## Trocando os frames pela sua sequência real

1. Coloque seus arquivos em `assets/frames/` seguindo o padrão
   `0001.webp`, `0002.webp`, ... até o último frame.
2. Abra `js/hero.js` e ajuste a única variável de configuração:

   ```js
   export const TOTAL_FRAMES = 350; // troque para a sua quantidade real
   ```

3. Pronto — todo o resto (preload, desenho no canvas, sincronização com o
   scroll e o zoom) se ajusta automaticamente.

> O projeto já vem com 60 frames de exemplo gerados proceduralmente
> (gradiente + partículas) só para você ver o efeito de scroll-scrubbing
> funcionando antes de colocar a sua sequência real.

## Como o pin + scroll-scrub funciona

- A seção `#hero` tem `height: 400vh`. Isso cria "espaço de scroll" para
  a animação.
- Dentro dela, `.hero__sticky` usa `position: sticky; top: 0; height: 100vh`,
  o que faz a tela ficar "presa" enquanto o usuário rola por essa faixa de
  400vh.
- `js/scroll.js` calcula o progresso (0 a 1) com base em quanto da faixa
  de 400vh já foi rolada, escolhe o frame correspondente e aplica o
  `transform: scale(...)` do zoom (1 → 2.5).
- Quando o progresso chega a 1 (último frame), a seção `sticky` chega ao
  fim naturalmente e o scroll continua revelando o restante da página —
  sem nenhum JavaScript extra para "despinar".

## Performance

- Um único `<canvas>`, nunca centenas de `<img>`.
- Todos os frames são pré-carregados antes da animação começar
  (`js/preload.js`), evitando qualquer travamento durante o scroll.
- O desenho roda dentro de um listener de `scroll` throttled por
  `requestAnimationFrame`, garantindo no máximo 1 redraw por frame de tela.
- No mobile (`≤700px`), a sequência de frames é automaticamente reduzida
  pela metade (`js/hero.js → buildFrameList()`) para aliviar a
  decodificação de imagens em aparelhos mais fracos.

## Customização visual

Os tokens de cor, tipografia e espaçamento ficam todos no topo do
`style.css`, dentro de `:root`. Trocar a paleta ou as fontes é
alterar só essas variáveis.
