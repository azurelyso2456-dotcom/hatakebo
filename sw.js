/* The release builder updates VERSION when any cached file changes. */
const VERSION = 'c1fae1c9d1632cb1';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"index.html":"6b25100498fe8512bfc2da12f199cc51300762d8b2f28c69de397a20307209a7","en.html":"e9556a1126378d6baf8654dffbecbbad051cf05b306cd5002c7d9402f04b2e22","id.html":"7daf275f05af7809e0d4386a7303b24f6a6d337d17eccd39af3be8a4f0a88dea","hatakebo.runtime.js":"ef81c373ac76e3ff47e157a1e08e3d1b12d4715c7a570cfa351e6944964fa326","hatakebo.en.runtime.js":"5e8b96faf9c0e4f773e6248049f6d6e5291d4c67617180e92ebbbd6f38c55682","hatakebo.id.runtime.js":"cf9c9c3ca95976c76830df080c86443781154ec5dbb21cad7b8fb795ea675301","language.css":"ee6a86e2f90fcc2f67b90da95ff965a7118ef054e507ad8f3275fc7d3e3238a6","language.js":"a89186dd89964b6ee8da11cdc63a872ee790ae7f52fe2165b6a344385a2bf8e9","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"21842e6621bcf1a7557c8760ab0e8973c74ce43f2eff1fbc74410b1c1a528e45","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"aa2915debf9992ba658d69b8fc5e366d97a0e760b958f5a5ac9812866a8f97ab","disclaimer-en.html":"def0ffe8d3a5270791e6e9df7cb7727ca62c5332e9635654a893650e9fb110ba","disclaimer-id.html":"d45685df37961884d228c3056516eebeeac4fbecd9ce4c421d30ad6b9c889f36","about.html":"7fdb26cbfb91d6e169f53ad4b4b9e6dc93fe685187c3557eeb65a32de85a252a","about-en.html":"13c224feec0b91d32262c02f6a68200152d799987333509a4c40aa25a31aaa58","about-id.html":"afcf4ae451e299f99e36fb449456e8e96e5d0714d7f92fbbc371452f7f84905c","layout-guide-en.html":"472dd935fb35a430e4901853ea9d302bc14cca86272643544eae6828453bdb71","layout-guide-id.html":"2b1faaac1586d9b8de14ddabc8bf7f38df084dfb00d88ef4d47cdd16d3fb75d4","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"8fd7ca504a31cb899b779c0a189f9a964169cc63cdf8ec8e4a47a9b83aae6cae","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"593f0db981c262a44ea9abc390cc8542411eceeb71d361fcbf95a7146924e0f5","guide-print-en.webp":"8171c34d3f5a0dfdf2df03f2f947c87b703b7651f6ea053dd99962dcafe64115","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"e4b913c953ac7e4a2b1ce22204e2a534c19d5810b83eb93bdc89a0daf1ed2907","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {ja:['index.html','hatakebo.runtime.js','about.html','disclaimer.html','app-example.png'],en:['en.html','hatakebo.en.runtime.js','about-en.html','disclaimer-en.html','layout-guide-en.html','guide-map-en.webp'],id:['id.html','hatakebo.id.runtime.js','about-id.html','disclaimer-id.html','layout-guide-id.html','guide-map-id.webp']};
// Step screenshots are cached on request, not fetched during application setup.
const ON_DEMAND = ['en','id'].flatMap(lang=>['size','beds','plant','print','save'].map(step=>'guide-'+step+'-'+lang+'.webp'));
const COMMON = FILES.filter(f=>!Object.values(LANG_FILES).flat().includes(f)&&!ON_DEMAND.includes(f));
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
