/* The release builder updates VERSION when any cached file changes. */
const VERSION = 'd9ebdb011585c5dd';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-id.html","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"index.html":"e1e34a338e9e212b33d01f52ecc2e97070721aeeb99d28cdac49a392175ed6d2","en.html":"2690df78bf6e456d83e1013aa5e431b19beabf45fbe51bac6605d82879a5f8a4","id.html":"7daf275f05af7809e0d4386a7303b24f6a6d337d17eccd39af3be8a4f0a88dea","hatakebo.runtime.js":"4fa8a472159bbaf530159e2ccaa1d6ed2f3f0724cd9250f801dda40663c0a908","hatakebo.en.runtime.js":"468d79d988efa14ff531762ec926f35557d645d9b30d65d975ae5a28c8b1fb18","hatakebo.id.runtime.js":"758995733c318ea9e56f79d11b9b190095ff69c49e7574a0090940c85a237d47","language.css":"29c36dd4aa175892fe2676d6d7d43b7b0548eb95078e3bad2512f0c91cf38357","language.js":"16a887f4b2243ee3543b346020872aa0674c6f1528ca4173c51de12cacae3b56","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"21842e6621bcf1a7557c8760ab0e8973c74ce43f2eff1fbc74410b1c1a528e45","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"2ab6678e9bdb5a46f2486048f527335287af868187ccc689bc6a6266f515e130","disclaimer-en.html":"82e9740cfa5b372b95a1328e9f0991f8eb0f1b3e6e15670e689194f6f59e1f50","disclaimer-id.html":"d73620b41dfb2dd2e8a1c91df92fef6af253fe22aba0625adcea0def1375c5e6","about.html":"104bb2df39212294a2b70ea744afdce5d638f535bf891f115ae2f881339af91e","about-en.html":"552fedf6a6da1f6493263a021e78df808669b6a5eb4eb291c59e05a3108aa086","about-id.html":"fb07245a03f3debe928b58bb68b9890779461c26779d6aeeae6a3b5be3dc096c","layout-guide-id.html":"0b27acb8cda48a036e05d4b1d46640837ba2c0aafcc8286fa347127c4a4e369d","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"8fd7ca504a31cb899b779c0a189f9a964169cc63cdf8ec8e4a47a9b83aae6cae","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {ja:['index.html','hatakebo.runtime.js','about.html','disclaimer.html'],en:['en.html','hatakebo.en.runtime.js','about-en.html','disclaimer-en.html'],id:['id.html','hatakebo.id.runtime.js','about-id.html','disclaimer-id.html','layout-guide-id.html']};
const COMMON = FILES.filter(f=>!Object.values(LANG_FILES).flat().includes(f));
const pending = new Map();
function language(url){const name=new URL(url).pathname.split('/').pop();return Object.keys(LANG_FILES).find(lang=>LANG_FILES[lang].includes(name))||'ja';}
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
    const lang=Object.hasOwn(LANG_FILES,event.data.lang)?event.data.lang:'ja';
    try{
      if(event.data.type==='PREPARE_LANGUAGE')await prepare(lang);
      event.ports[0].postMessage({ready:await isReady(lang),version:VERSION});
    }catch(e){event.ports[0].postMessage({ready:false,version:VERSION});}
  })());
});
