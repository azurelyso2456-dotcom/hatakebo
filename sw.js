/* The release builder updates VERSION when any cached file changes. */
const VERSION = 'cb7d6879b6255e07';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp","guide-map-pl.webp","guide-size-pl.webp","guide-beds-pl.webp","guide-plant-pl.webp","guide-print-pl.webp","guide-save-pl.webp","guide-map-sw.webp","guide-size-sw.webp","guide-beds-sw.webp","guide-plant-sw.webp","guide-print-sw.webp","guide-save-sw.webp","developer-notes.html","developer-notes.css"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"sw.html":"19c64f2a5d3ab3554841f576a92a8e385518db95472d879d46dd5b97e7f2d1a9","hatakebo.sw.runtime.js":"3807e063979b81d95a48dc0c00da3e0fe593a6a22b5be871b8ce1acbb5ea6e1c","about-sw.html":"4ea82bc5a2eb6f2bed794449026734b2cf01cb2b423c98c69a03d78bc6f97d2a","disclaimer-sw.html":"c4d05893d1a64c3ee73595dcbe1c4a8eead20adcd6c9a7eb011de2eb8fb2746a","layout-guide-sw.html":"d789391141575d27ee7d113d630ff33d2c18a09f299071b209e6badca04d6b15","pl.html":"1c23f808b370917f97b58f0a7c415aeb6a62885de02c2afa38a53c9ba880c512","hatakebo.pl.runtime.js":"451ecd775c0b7700b16de5075b170ef1bf55c060d23c880af29037ed8cfa6a65","about-pl.html":"92d2450c98193a6740cc84f5b1aac043fa8c6b64b6b01579e4dc5f405a711ba4","disclaimer-pl.html":"aaf00c88dfc0e148e65928f472f6ffe38742f9748e13f70c013039e761b0d271","layout-guide-pl.html":"62c5a69013759a6a0d81b8d6c68f214cf29e619ed1eb67ca5094f7d2577cd28c","index.html":"4c6682f0240309d6e10a0d7ae12982f5bf3f491984bcfff5c4a90c85792893ad","en.html":"2dd842941e818da03b8a4893fe30e3f73dc1008c88ffd38b0cf204075d59320f","id.html":"4238f9273e2e5e5f6939200a604f00df97d298d99d49780c8cd6f6d558da1f4f","hatakebo.runtime.js":"310d6fc49d8c8d701fe9d6f235d5784b62a8bf28e42c82d28a11e512798b8ec0","hatakebo.en.runtime.js":"ee32471c54e259732c251f0b331c1743a633ec2bd88d2ffa7b8963b50a61f2c7","hatakebo.id.runtime.js":"e4c8c107f6adcb0d70aa64c5223ee09d74bbeac042bff030e8793eb09e626bd8","language.css":"8ca61b36e9460446a7bc6cd491f98252ec1c7dcbe65775176aba1d1d8269938c","language.js":"014fbd00a209c47d93b157d930986898bb31493fc991330c3fe8631f926f2d16","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"5dd8317727d1227c86f7570437618f91a890686efb932527c1882e3846024ffc","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"c3933fe8acbbc0fef774b59185fc656a851fd48541945994c855a46db0264eac","disclaimer-en.html":"68cfc67ddfac97f766540e845152d02164aec4e954e58f839ed57d31c6f00412","disclaimer-id.html":"64cef37704415a1249b1ce095bf5e65bd4f8fe2513e6a4643e6753e232dfdfeb","about.html":"23a5bdbc873412c51f9dddf77595bdc01c4997694306c1fa0afc9af80be7f602","about-en.html":"713e88f601baf43a5e2f91cbef406fb30162d15e3660ad9a014b46a33abd1095","about-id.html":"7bd3453acbb462b8d41b227ad54961c7625915f873c1eaffd7f7f7dc764196e9","layout-guide-en.html":"fba337e3a48f9386df46ff692f39eef4ea4e2d53b5d4d2f8de507427413a0ca6","layout-guide-id.html":"ae3d55a7f93723abaa6dc9206676221ac730172acbefd1b9d72d9d72315eee4b","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"e4c8eeb90768e9833702c32179741a2b7a7414d3dfa1cd9b7b385f6bb1d1e344","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"a105c051994e3cc1a07869ac653958c46754ae89e47553b311f3007a0624a631","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"b984c276527b16dc4ac936b7e20480b242774d34931d2168a557e87caf0d2fe3","guide-print-en.webp":"f283b5a221cd26ad709bdd877cd6205cff5b8ced5da301495027c46c59b97bd6","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"6fa53f1edacfa16d1bb6b438f9817549c8f0c4049c5d820a0156cf9bcc880eaf","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d","guide-map-pl.webp":"207c15bc0d539f32429a54ec51705710b6fb0a4dd58de0d103f06bdeae6b232b","guide-size-pl.webp":"151ea437681bac8ebfbfd568ff48bc8cdcf8c6390013b4596bf1da983bad639c","guide-beds-pl.webp":"57c49b4ee7fa96f3b81e8b9d16ac9b3a03b18ffbcfcd3984cfd4bf7677ca2435","guide-plant-pl.webp":"f4026334c3b68443369add9391ce965824bad9077a7ccc8cad75c124888ea3c7","guide-print-pl.webp":"36ba408f06657046451cc232fa8fb9b4bd658acf96cd19cb8361534fc7b870e2","guide-save-pl.webp":"2090d6fd4416b688703c91e2508c62c9d7754f40f5eeca9989c49381ba03d193","guide-map-sw.webp":"4b2e4b18fd24bb8c4a9d3331ddb42489e2a202cbcf7a531ead133cbc8e764216","guide-size-sw.webp":"d0e49481fcafabb30b52529fcb4c40976676ceffb6caa66be28b27f60b051f03","guide-beds-sw.webp":"7d825521b5f3a935159904796ddcc4cf606d3ef5d86eb9059186962bbbf90462","guide-plant-sw.webp":"fdb52e838dc524a0a851197d85faf988e04fd23be1addae2cdaf6b533eb0741d","guide-print-sw.webp":"7933ee439f05a4da8428b72f110454549a1018edbecbf95928da264539a840c3","guide-save-sw.webp":"39245e38ac5d6d6e4566d2732176aecca7fae0d987842779bd095d0f5969f266","developer-notes.html":"8372ab9e04c911ed45f494adc44582486e684ad4d96a28ea056750339b756ac1","developer-notes.css":"610136300d3d151046c1cb990f9ac432c67052642ff04dabb6b6da08990245eb"};
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
