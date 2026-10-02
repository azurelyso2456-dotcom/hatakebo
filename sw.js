/* The release builder updates VERSION when any cached file changes. */
const VERSION = '04e3e2df4809dd87';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["index.html","en.html","hatakebo.runtime.js","hatakebo.en.runtime.js","language.css","language.js","vegetables.js","landmarks.js","disclaimer.html","disclaimer-en.html","about.html","about-en.html","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"index.html":"06eaaaf7dd322c97149ca068d7db7a2da3fd14ad67efb4e74ecf39164c112d2d","en.html":"ab8991dbf46d907f13d0fe83ffe63653a135f751599523a2a6976132197de383","hatakebo.runtime.js":"650e52272fb2df45d65dcb7e73d6f3add6926ca92efedbcd7f469467b740d68d","hatakebo.en.runtime.js":"8c5e98ea8ef105def10b47a16353ec115874a65388703d58409103e665f0aad8","language.css":"edb2de657c6ccce612204f79b90b53c670eb2bfde69ff685bbfac449e83eec74","language.js":"d076c6d940be5b39f6a26a2606c19d50d8c238a40dfc3b3fa8c85eef4ea0bc95","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"926b3b308a77545d821b70c3c0695a364d29e1708f17eb90d434f578ad78f1f1","disclaimer-en.html":"c2da224a1dea537fa22ab234e743f5f0b6c81b8b24839c026fc57237fc1517fd","about.html":"277112b4769efb0dfc322a9e5317d905d8e689fc72ee8f224cc69a2d99358538","about-en.html":"9bf242f17a56dc867dd29bae44b340500091c1faf7b15e67edbc1498ab0718a7","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"8fd7ca504a31cb899b779c0a189f9a964169cc63cdf8ec8e4a47a9b83aae6cae","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {ja:['index.html','hatakebo.runtime.js','about.html','disclaimer.html'],en:['en.html','hatakebo.en.runtime.js','about-en.html','disclaimer-en.html']};
const COMMON = FILES.filter(f=>!Object.values(LANG_FILES).flat().includes(f));
const pending = new Map();
function language(url){return /\/(en|about-en|disclaimer-en)\.html$/.test(new URL(url).pathname)?'en':'ja';}
function readyKey(lang){return READY+'?lang='+lang;}
async function saveFile(file){
  if(pending.has(file))return (await pending.get(file)).clone();
  const task=(async()=>{
    const cache=await caches.open(CACHE),url=new URL(file,BASE).href,digest=DIGESTS[file];
    const names=(await caches.keys()).filter(n=>n.startsWith(PREFIX)&&n!==CACHE);
    for(const source of [cache,...await Promise.all(names.map(n=>caches.open(n)))]){
      const candidate=await source.match(url);
      if(await matches(candidate,digest)){await cache.put(url,candidate.clone());return candidate;}
    }
    let response=await fetch(new Request(url,{cache:'force-cache'}));
    if(!await matches(response,digest))response=await fetch(new Request(url,{cache:'reload'}));
    if(!await matches(response,digest))throw Error('Incomplete release: '+file);
    await cache.put(url,response.clone());return response;
  })();
  pending.set(file,task);
  try{return (await task).clone();}finally{pending.delete(file);}
}
async function prepare(lang){
  const cache=await caches.open(CACHE);
  for(const file of [...COMMON,...LANG_FILES[lang]])await saveFile(file);
  await cache.put(readyKey(lang),new Response(VERSION));
}
async function isReady(lang){
  const cache=await caches.open(CACHE);
  return !!await cache.match(readyKey(lang))&&(await Promise.all([...COMMON,...LANG_FILES[lang]].map(f=>cache.match(new URL(f,BASE).href)))).every(Boolean);
}
async function matches(response,digest){
  if(!response||!response.ok)return false;
  const bytes=await response.clone().arrayBuffer();
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')===digest;
}
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    // Prepare only languages of open pages, not every supported language.
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const langs=new Set(clients.filter(c=>c.url.startsWith(BASE.href)).map(c=>language(c.url)));
    if(!langs.size)langs.add('ja');
    for(const lang of langs)await prepare(lang);
    // Do not replace the worker under an open, possibly edited form.
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    await self.clients.claim();
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith(PREFIX)&&n!==CACHE).map(n=>caches.delete(n)));
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);
  if(u.origin!==BASE.origin)return;
  let key=u.origin+u.pathname;
  if(u.pathname===BASE.pathname)key=new URL('index.html',BASE).href;
  if(!URLS.includes(key))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE),cached=await cache.match(key);
    if(cached)return cached;
    return saveFile(FILES[URLS.indexOf(key)]);
  })());
});
self.addEventListener('message',event=>{
  if(!event.data||!['CHECK_OFFLINE','PREPARE_LANGUAGE'].includes(event.data.type)||!event.ports[0])return;
  event.waitUntil((async()=>{
    const lang=event.data.lang==='en'?'en':'ja';
    try{
      if(event.data.type==='PREPARE_LANGUAGE')await prepare(lang);
      event.ports[0].postMessage({ready:await isReady(lang),version:VERSION});
    }catch(e){event.ports[0].postMessage({ready:false,version:VERSION});}
  })());
});
