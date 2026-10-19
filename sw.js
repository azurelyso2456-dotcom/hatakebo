/* The release builder updates VERSION when any cached file changes. */
const VERSION = '8704d86c7e0e648e';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp","guide-map-pl.webp","guide-size-pl.webp","guide-beds-pl.webp","guide-plant-pl.webp","guide-print-pl.webp","guide-save-pl.webp","guide-map-sw.webp","guide-size-sw.webp","guide-beds-sw.webp","guide-plant-sw.webp","guide-print-sw.webp","guide-save-sw.webp","developer-notes.html","developer-notes.css","record-safety.js"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"sw.html":"ff9af4356622caa25e6f95effe273aeeeb19f4967a51c85a8f5b0982b80d1f5d","hatakebo.sw.runtime.js":"320ce81200fc6641a85bcebd983f456ad9888401ce62a903d2760008a064a347","about-sw.html":"847827b75d1cab39708b9c28fe966b45cd85c783d37009b2065633c04854a5e4","disclaimer-sw.html":"001fe5ba8a927f31acab10aa723b57dbe297f8b2162b70132c92a2a32339e2b4","layout-guide-sw.html":"52bf3782900c9dad122655d53f44ce965776c60c7c1a53b208bd43118b3549de","pl.html":"4cf647d7531ca3f7cff5c968db075fdd653c3f7a3e8e6ed1b0d8a9ce322b1393","hatakebo.pl.runtime.js":"3297278a4a6d4805b23c0390c7e64cdf498f13da7722ca8746e32f90e9fdb7dc","about-pl.html":"b7fe72fe06a6cf2bbe3107227f5d34964894abffbdd7976eacb71dbef5005411","disclaimer-pl.html":"a088eb48c942e6c363c65fb2992d45331d93f43df20eeb31d257c37892262d5d","layout-guide-pl.html":"17107b5088c754d52b131e51fd610c8458855b60a2782a8489c00a6dbbddffbf","index.html":"48e6a7760212ac3cad91cfdcc4ef675a27051471a495f6568caa5cd135c244cc","en.html":"36e61943582b788a80ddc1e117fcd4b6f21f92260ed6b0de4e7c22aa216c690a","id.html":"c7181c20acdb0e468d8ef24db4ef5e8ce80f3cc3018b637151adee053b0680b8","hatakebo.runtime.js":"f73d0bc3a58f8008ba2d56ac85da977af70387f76d86c144b9ad2363cd3dd4e1","hatakebo.en.runtime.js":"08bb17499553a362ddec5d8094f95973334b195baa2ab50772d077793e00c689","hatakebo.id.runtime.js":"ac07780769f0c6951bbfeda7f8ec80484103c3f4074e886bb4d2ed3251e8a6ea","language.css":"8ca61b36e9460446a7bc6cd491f98252ec1c7dcbe65775176aba1d1d8269938c","language.js":"014fbd00a209c47d93b157d930986898bb31493fc991330c3fe8631f926f2d16","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"5dd8317727d1227c86f7570437618f91a890686efb932527c1882e3846024ffc","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"6eed16aab0b00b1ae9d5f033a5f63c3697d5fde8769a377077a870378611eeed","disclaimer-en.html":"308c559e84a099cd145c127e42dcc71b34ff2ea7ba062e66d44b88a6f54a7f1b","disclaimer-id.html":"3b3d9c5c3c020e5552184f01352be18b2fd83e103539cb3a5c6c7d50f88573a7","about.html":"88ba392381c8f66cd84f7b9d5786d6647bb6ae073916c1c86b10da1339e315fa","about-en.html":"62f932993807cdc5ff9392736723d34d321a49b6d34086ddf19dbb9502e11702","about-id.html":"14aef331972646bf40ddddd48df695e9e3f9852692375bb2409b3a2b6b077eb6","layout-guide-en.html":"0c1de068b961d5c891e89b214bbd74f71faf4e461a51e2976836db0a0138dd22","layout-guide-id.html":"e5ccce85ebbae0f5a220a0cdc14ae560146775fcf63477cfcc0ffd615566edea","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"e4c8eeb90768e9833702c32179741a2b7a7414d3dfa1cd9b7b385f6bb1d1e344","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"a105c051994e3cc1a07869ac653958c46754ae89e47553b311f3007a0624a631","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"b984c276527b16dc4ac936b7e20480b242774d34931d2168a557e87caf0d2fe3","guide-print-en.webp":"f283b5a221cd26ad709bdd877cd6205cff5b8ced5da301495027c46c59b97bd6","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"6fa53f1edacfa16d1bb6b438f9817549c8f0c4049c5d820a0156cf9bcc880eaf","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d","guide-map-pl.webp":"207c15bc0d539f32429a54ec51705710b6fb0a4dd58de0d103f06bdeae6b232b","guide-size-pl.webp":"151ea437681bac8ebfbfd568ff48bc8cdcf8c6390013b4596bf1da983bad639c","guide-beds-pl.webp":"57c49b4ee7fa96f3b81e8b9d16ac9b3a03b18ffbcfcd3984cfd4bf7677ca2435","guide-plant-pl.webp":"f4026334c3b68443369add9391ce965824bad9077a7ccc8cad75c124888ea3c7","guide-print-pl.webp":"36ba408f06657046451cc232fa8fb9b4bd658acf96cd19cb8361534fc7b870e2","guide-save-pl.webp":"2090d6fd4416b688703c91e2508c62c9d7754f40f5eeca9989c49381ba03d193","guide-map-sw.webp":"4b2e4b18fd24bb8c4a9d3331ddb42489e2a202cbcf7a531ead133cbc8e764216","guide-size-sw.webp":"d0e49481fcafabb30b52529fcb4c40976676ceffb6caa66be28b27f60b051f03","guide-beds-sw.webp":"7d825521b5f3a935159904796ddcc4cf606d3ef5d86eb9059186962bbbf90462","guide-plant-sw.webp":"fdb52e838dc524a0a851197d85faf988e04fd23be1addae2cdaf6b533eb0741d","guide-print-sw.webp":"7933ee439f05a4da8428b72f110454549a1018edbecbf95928da264539a840c3","guide-save-sw.webp":"39245e38ac5d6d6e4566d2732176aecca7fae0d987842779bd095d0f5969f266","developer-notes.html":"4e7f2e3dc59d335bd568de7cca8723fbf5980013bbb0548e99df6addef14d799","developer-notes.css":"610136300d3d151046c1cb990f9ac432c67052642ff04dabb6b6da08990245eb","record-safety.js":"80cd1ef6ac67a7fe8e66f8b736c4fb1c6890de2ee452fe90c72b84a431a61717"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {"sw":["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","guide-map-sw.webp"],"pl":["pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","guide-map-pl.webp"],"ja":["index.html","hatakebo.runtime.js","about.html","disclaimer.html","app-example.png","developer-notes.html","developer-notes.css"],"en":["en.html","hatakebo.en.runtime.js","about-en.html","disclaimer-en.html","layout-guide-en.html","guide-map-en.webp"],"id":["id.html","hatakebo.id.runtime.js","about-id.html","disclaimer-id.html","layout-guide-id.html","guide-map-id.webp"]};
// Step screenshots are cached on request, not fetched during application setup.
const ON_DEMAND = [...['en','id','pl','sw'].flatMap(lang=>['size','beds','plant','print','save'].map(step=>'guide-'+step+'-'+lang+'.webp'))];
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
