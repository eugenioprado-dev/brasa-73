// Browser regression checks using the installed Edge and Node's built-in CDP transport.
// Run: node scripts/qa.mjs (Vite must be running at 127.0.0.1:5173).
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'

const base = 'http://127.0.0.1:5173'
const output = path.resolve('.qa')
const port = 9400 + Math.floor(Math.random() * 500)
await mkdir(output, { recursive: true })
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.join(output, `browser-${port}`)}`,
  '--no-first-run', '--no-default-browser-check', 'about:blank',
], { windowsHide: true, stdio: 'ignore' })
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
const results = []
const errors = []
try {
  let target
  for (let i = 0; i < 40; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); if (target) break } catch {}
    await pause(200)
  }
  assert.ok(target, 'Edge debugging endpoint unavailable')
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  let sequence = 0
  const pending = new Map()
  socket.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const operation = pending.get(message.id)
      if (!operation) return
      pending.delete(message.id)
      if (message.error) operation.reject(message.error)
      else operation.resolve(message.result)
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
    else if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text)
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value).join(' '))
  }
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++sequence
      pending.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }
  async function evaluate(expression) {
    const data = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true })
    if (data.exceptionDetails) throw new Error(JSON.stringify(data.exceptionDetails))
    return data.result.value
  }
  async function check(name, expression) {
    const valid = await evaluate(expression)
    if (!valid) console.log(JSON.stringify({ name, errors, body: await evaluate('document.body.innerText.slice(0,4000)') }))
    assert.equal(valid, true, name)
    results.push(name)
    console.log(`PASS ${name}`)
  }
  async function click(selector) {
    await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error('Missing control'); el.focus(); el.click(); })()`)
    await pause(80)
  }
  async function fill(selector, text) {
    await evaluate(`(() => {const el=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(text)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
    await pause(80)
  }
  async function key(key, code = key) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: key === 'Escape' ? 27 : key === 'Tab' ? 9 : 13, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code })
    await pause(80)
  }
  async function viewport(width, height = 900) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    await pause(150)
  }
  async function ready() {
    for (let i = 0; i < 100; i++) {
      try { if (await evaluate('!!document.querySelector("#cardapio .product-card")')) return } catch {}
      await pause(100)
    }
    throw new Error(JSON.stringify({ errors, page: await evaluate('({url:location.href,html:document.documentElement.outerHTML.slice(0,2000)})') }))
  }
  async function screenshot(name) {
    await pause(300)
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    await writeFile(path.join(output, `${name}.png`), Buffer.from(capture.data, 'base64'))
  }
  async function contrast(name, foreground, background, minimum = 4.5) {
    const ratio = await evaluate(`(() => {
      const rgb = (selector, property) => getComputedStyle(document.querySelector(selector))[property].match(/[\\d.]+/g).slice(0,3).map(Number);
      const luminance = values => values.map(v => {v/=255; return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      const a=luminance(rgb(${JSON.stringify(foreground)},'color'));
      const b=luminance(rgb(${JSON.stringify(background)},'backgroundColor'));
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    })()`)
    assert.ok(ratio >= minimum, `${name}: ${ratio.toFixed(2)} < ${minimum}`)
    results.push(`${name}: ${ratio.toFixed(2)}:1`)
    console.log(`PASS ${name}: ${ratio.toFixed(2)}:1`)
  }
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable')
  await send('Page.navigate', { url: base })
  await ready()
  await evaluate('localStorage.clear()')
  await send('Page.reload'); await pause(200); await ready()
  await check('18 menu products', 'document.querySelectorAll("#cardapio .product-card").length === 18')
  await contrast('Hero body contrast', '.hero-copy>p', '.hero')
  await contrast('Hero accent contrast', '.hero h1 em', '.hero', 3)
  await contrast('Hero eyebrow contrast', '.hero .eyebrow', '.hero')
  await contrast('Primary CTA contrast', '.hero .primary', '.hero .primary')
  await contrast('Header order contrast', '.order-button', '.order-button')
  await contrast('Featured description contrast', '.featured .card-body p', '.featured .product-card')
  await contrast('Featured price contrast', '.featured .card-bottom strong', '.featured .product-card')
  await contrast('Featured action contrast', '.featured .card-bottom button', '.featured .product-card')
  await contrast('Illustration caption contrast', '.featured .image-caption', '.featured .is-illustration')
  await contrast('Catalog description contrast', '.catalog .card-body p', '.catalog .product-card')
  await contrast('Active filter contrast', '.filters button[aria-pressed=true]', '.filters button[aria-pressed=true]')
  await check('All local images load', 'Array.from(document.images).every(i=>!i.complete || i.naturalWidth>0)')
  await fill('.search input', 'bacon')
  await check('Description and name search', 'document.querySelectorAll("#cardapio .product-card").length===3')
  await click('.filters button:nth-child(4)')
  await check('Search and category combine', 'document.querySelectorAll("#cardapio .product-card").length===1 && document.querySelector("#cardapio h3").textContent.includes("Fritas")')
  await fill('.search input', 'inexistente')
  await check('Empty search feedback', '!!document.querySelector(".no-results")')
  await click('.no-results button')
  await click('#cardapio .product-card button')
  await check('Native modal and initial focus', 'document.querySelector("dialog").matches(":modal") && document.activeElement.getAttribute("aria-label")==="Fechar"')
  await contrast('Product description contrast', '.details-content>p', '.overlay')
  await contrast('Product optional label contrast', '.note-label span', '.overlay')
  await contrast('Extra price contrast', '.extra strong', '.overlay')
  await contrast('Quantity contrast', '.quantity output', '.quantity')
  await key('Escape')
  await check('Escape closes and restores focus', '!document.querySelector("dialog") && document.activeElement.getAttribute("aria-label")==="Ver detalhes de Brasa 73"')
  await key('Enter')
  await check('Keyboard opens product', '!!document.querySelector("dialog")')
  for (let i=0; i<17; i++) await key('Tab')
  await check('Focus stays inside dialog', 'document.querySelector("dialog").contains(document.activeElement)')
  await click('.extra:nth-of-type(1) input'); await click('.extra:nth-of-type(2) input')
  await fill('#product-note', 'sem cebola')
  await click('.quantity button:last-child')
  await check('Extras and quantity total', 'document.querySelector(".add-row>strong").textContent.replace(/\\s/g,"")==="R$80,80"')
  await click('.details-content>.primary')
  await click('#cardapio .product-card button'); await click('.details-content>.primary')
  await click('.order-button')
  await check('Different configurations remain separate', 'document.querySelectorAll(".cart-item").length===2')
  await check('Correct cart total', 'document.querySelector(".total strong").textContent.replace(/\\s/g,"")==="R$113,70"')
  await contrast('Cart note contrast', '.cart-note', '.cart-note')
  await contrast('Cart total contrast', '.total strong', '.overlay')
  await click('.cart-item .quantity button:last-child')
  await check('Change cart quantity', 'document.querySelector(".total strong").textContent.replace(/\\s/g,"")==="R$154,10"')
  await click('.cart-summary>.primary')
  await check('Structured demonstration message', 'document.querySelector("#order-message").value.replace(/\u00a0/g," ").includes("3x Brasa 73\\n- Bacon extra\\n- Cheddar extra\\nObs: sem cebola\\nR$ 121,20") && document.querySelector("#order-message").value.replace(/\u00a0/g," ").includes("Total: R$ 154,10") && !document.querySelector("a[href*=wa]")')
  await contrast('Order message contrast', '#order-message', '#order-message')
  await click('.order-review button')
  await check('Copy feedback', 'document.querySelector(".order-review [role=status]").textContent.length>0')
  await key('Escape'); await send('Page.reload'); await pause(500); await click('.order-button')
  await check('Persistence after reload', 'document.querySelectorAll(".cart-item").length===2 && document.querySelector(".total strong").textContent.replace(/\\s/g,"")==="R$154,10"')
  for (const width of [320,375,425,768,1024,1440]) {
    await viewport(width)
    await check(`Cart fits ${width}px`, 'document.querySelector("dialog").scrollWidth<=document.querySelector("dialog").clientWidth && document.documentElement.scrollWidth<=innerWidth')
  }
  await screenshot('cart-premium')
  await click('.cart-item .icon-button'); await click('.cart-item .icon-button')
  await check('Removal and empty cart', '!!document.querySelector(".empty-cart")')
  await key('Escape')
  for (const width of [320,375,425,768,1024,1440]) {
    await viewport(width)
    await evaluate('window.scrollTo(0,0)')
    await check(`Page fits ${width}px`, 'document.documentElement.scrollWidth<=innerWidth')
    if ([375,1440].includes(width)) await screenshot(`home-${width}`)
    await click('#cardapio .product-card button')
    await check(`Details fit ${width}px`, 'document.querySelector("dialog").scrollWidth<=document.querySelector("dialog").clientWidth')
    if (width===375) await screenshot('details-375')
    await key('Escape')
  }
  await viewport(375); await click('#menu-toggle')
  await check('Mobile menu expands', 'document.querySelector("#menu-toggle").getAttribute("aria-expanded")==="true"')
  await click('.navigation a[href="#cardapio"]')
  await check('Mobile navigation closes', 'document.querySelector("#menu-toggle").getAttribute("aria-expanded")==="false"')
  for (const width of [375,1440]) {
    await viewport(width)
    for (const id of ['destaques','cardapio','sobre','localizacao']) {
      await evaluate(`document.getElementById('${id}').scrollIntoView({behavior:'instant'})`)
      await screenshot(`${id}-${width}`)
    }
  }
  await fill('.search input', 'limao'); await click('.filters button:nth-child(5)')
  await click('#cardapio .product-card button')
  await check('Beverages have no burger extras', '!document.querySelector("dialog fieldset")')
  await key('Escape')
  await evaluate('localStorage.setItem("brasa73:cart:v1", "invalid json")')
  await send('Page.reload'); await pause(450); await click('.order-button')
  await check('Corrupt persistence recovers safely', '!!document.querySelector(".empty-cart")')
  await key('Escape')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await check('Reduced motion disables transitions', 'getComputedStyle(document.querySelector(".button")).transitionDuration==="0s"')
  await check('Pure order helpers validate untrusted storage', `(async()=>{const m=await import('/src/utils/order.ts');const item={key:'test',productId:'brasa-73',quantity:2,note:'teste',extraIds:['bacon','cheddar']};return m.lineTotal(item)===8080 && m.restoreCart('null').length===0 && m.restoreCart(JSON.stringify([{...item,quantity:-1}])).length===0 && m.restoreCart(JSON.stringify([{...item,extraIds:['fake']}]))[0].extraIds.length===0})()`)
  await check('WhatsApp encodes the message only with configuration', `(async()=>{const m=await import('/src/utils/order.ts');const items=[{key:'test',productId:'brasa-73',quantity:1,note:'sem cebola & molho',extraIds:[]}];const url=m.whatsappUrl('0'.repeat(12),items);return m.whatsappUrl('',items)===null && new URL(url).searchParams.get('text')===m.orderMessage(items)})()`)
  await check('All five image formats and deterministic priority', `(async()=>{
    const {photoFor}=await import('/src/data/menu.ts');
    const formats=['avif','webp','jpg','jpeg','png'];
    const files=Object.fromEntries(formats.map(f=>['../assets/menu/test-product.'+f, f]));
    for(const f of formats){if(photoFor('test-product',files)!==f)return false;delete files['../assets/menu/test-product.'+f]}
    return photoFor('test-product',files)===undefined;
  })()`)
  await check('Cards keep cover for photographs', 'Array.from(document.querySelectorAll(".product-card .is-photo img")).every(img=>getComputedStyle(img).objectFit==="cover")')
  // Test-only in-memory canvases reuse the actual photograph. No source asset is changed.
  await evaluate(`(async()=>{
    const {menu}=await import('/src/data/menu.ts');
    window.mediaTestProduct=menu[1];window.originalMedia=menu[1].image;
    const image=new Image();image.src=menu.find(p=>!p.image.endsWith('.svg')).image;await image.decode();
    window.mediaFixtures={};
    for(const [name,w,h] of [['square',800,800],['horizontal',1200,600],['vertical',600,1200],['small',80,60]]){
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#11120f';ctx.fillRect(0,0,w,h);
      const scale=Math.min(w/image.naturalWidth,h/image.naturalHeight);
      const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
      ctx.drawImage(image,(w-dw)/2,(h-dh)/2,dw,dh);window.mediaFixtures[name]=canvas.toDataURL('image/png');
    }
    window.mediaFixtures.svg=window.originalMedia;
  })()`)
  for (const width of [320,375,425,768,1024,1440]) {
    await viewport(width)
    for (const fixture of ['square','horizontal','vertical','small','svg']) {
      await evaluate(`window.mediaTestProduct.image=window.mediaFixtures['${fixture}']`)
      await click('#cardapio .product-card:nth-child(2) button')
      await evaluate('document.querySelector(".details-grid img").decode()')
      await check(`Media ${fixture} fits without distortion or upscale at ${width}px`, `(() => {
        const img=document.querySelector('.details-grid img'),media=img.parentElement;
        const r=img.getBoundingClientRect(),m=media.getBoundingClientRect(),d=document.querySelector('dialog').getBoundingClientRect();
        return getComputedStyle(img).objectFit==='contain' && Math.abs(r.width/r.height-img.naturalWidth/img.naturalHeight)<.02
          && r.width<=img.naturalWidth+1 && r.height<=img.naturalHeight+1
          && r.left>=m.left && r.right<=m.right && r.top>=m.top && r.bottom<=m.bottom
          && m.height<=361 && d.top>=0 && d.bottom<=innerHeight+1 && document.documentElement.scrollWidth<=innerWidth
          && (innerWidth>=768 || document.querySelector('.details-content h2').getBoundingClientRect().top>=m.bottom);
      })()`)
      await evaluate('document.querySelector(".details-content>.primary").scrollIntoView({block:"end",behavior:"instant"})')
      await check(`CTA and close remain reachable: ${fixture} at ${width}px`, `(() => {
        const c=document.querySelector('.details-content>.primary').getBoundingClientRect();
        const h=document.querySelector('.overlay-header').getBoundingClientRect();
        const d=document.querySelector('dialog').getBoundingClientRect();
        return c.bottom<=d.bottom+1 && c.top>=h.bottom && h.top>=0 && h.bottom<=innerHeight;
      })()`)
      if ([375,1440].includes(width) && ['square','vertical','svg'].includes(fixture)) {
        await evaluate('document.querySelector(".details-grid").scrollTop=0;document.querySelector(".details-content").scrollTop=0')
        await screenshot(`media-${fixture}-${width}`)
      }
      await key('Escape')
    }
  }
  await evaluate('window.mediaTestProduct.image=window.originalMedia')
  await viewport(1024,500)
  await click('#cardapio .product-card button')
  await evaluate('document.querySelector(".details-content>.primary").scrollIntoView({block:"end",behavior:"instant"})')
  await check('Short desktop viewport keeps media and close independent of form scroll', `(() => {
    const d=document.querySelector('dialog').getBoundingClientRect(),h=document.querySelector('.overlay-header').getBoundingClientRect();
    const m=document.querySelector('.details-grid>.product-image').getBoundingClientRect();
    return d.top>=0 && d.bottom<=innerHeight && h.top>=d.top && m.top>=h.bottom && document.querySelector('.details-content').scrollTop>0;
  })()`)
  await evaluate('document.querySelector(".details-grid img").dispatchEvent(new Event("error"))')
  await pause(100)
  await check('Photo failure falls back to category SVG', 'document.querySelector(".details-grid img").getAttribute("src").endsWith("burger.svg")')
  await evaluate('document.querySelector(".details-grid img").dispatchEvent(new Event("error"))')
  await pause(100)
  await check('SVG failure keeps branded media area', '!!document.querySelector(".details-grid .image-unavailable")')
  await key('Escape')
  assert.deepEqual(errors, [], 'No browser errors')
  results.push('No console or resource errors')
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2))
  console.log(`${results.length} checks passed`)
} finally {
  if (socket?.readyState === 1) { socket.send(JSON.stringify({ id: 999999, method: 'Browser.close' })); await pause(200); socket.close() }
  browser.kill()
}

