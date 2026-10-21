/* The release builder updates VERSION when any cached file changes. */
const VERSION = '13870dfe7ab0e407';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp","guide-map-pl.webp","guide-size-pl.webp","guide-beds-pl.webp","guide-plant-pl.webp","guide-print-pl.webp","guide-save-pl.webp","guide-map-sw.webp","guide-size-sw.webp","guide-beds-sw.webp","guide-plant-sw.webp","guide-print-sw.webp","guide-save-sw.webp","developer-notes.html","developer-notes.css","record-safety.js","entry.js","analytics.js","brand.css","brand-b1-ja.webp","brand-b1-latin.webp","garden-progress.webp","welcome-vegetables.webp"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"sw.html":"5b327f24c4452d064dd3006d477a8e66d57be95a31c01ffb6f6c7565a28bbc0b","hatakebo.sw.runtime.js":"070989caedb742e2d334fc19d41b1635e304caca0f1bb0bd8c095629833215d4","about-sw.html":"a5f483124ac0828545d5473c141c8eb039474cd3be123921df319cd4e3b6a9c6","disclaimer-sw.html":"4b3aaf57b5b4e808a5948cfee4dfc1ee40307879667660bc4566aa81a2d834b7","layout-guide-sw.html":"7cdc02413664689a5303b0caf51b72e76d6c853872281cfb76aa905f4b242a78","pl.html":"97feabc81789c2f78676cdaec4c1527c93ddab8211081e5aded2cc1ee7988685","hatakebo.pl.runtime.js":"1afd9b59ea520178bded77ca979c3765ee9baf0f2846f07617a4a5e9e2f1b694","about-pl.html":"cbd75991be588888846fe1173806cab0f073c2855a7b109df5df7ab202fc3fde","disclaimer-pl.html":"21a8b990114914c8d1ce60975c0fcc3dac2d199621f3807a2014034a880583d2","layout-guide-pl.html":"2a164d44d31c590ca1c20ea0514f380eddb41c6e6396faa403fdbd2c2c32f7d6","index.html":"984c46335485afc049cafa1724fc2217ce55153dd819a0c6c44899fda206eb04","en.html":"eb935012f24755ad248d8762704625cc0b35fb068a60fa1c4839d17f62e56862","id.html":"a93b6b31a4bbda2f558cedcb6ef5e86e113f964a83330c49c1a085a671362336","hatakebo.runtime.js":"9c0bb4ecc9dbe18bb1d9c8b7fbfffc93f8c6a73f1b4db61a955f1e5743c2c2ff","hatakebo.en.runtime.js":"f88ae26bb938500f6bc9c03da1cc5a87705c287bbd3f4f0fc99cadbe525577f6","hatakebo.id.runtime.js":"4dd09064c171ec82c72ab631a7ddf34012132bb5b463f963e6d85743de240946","language.css":"2252a57f0567798d0a08804d5d9fa11388ce58a8f759a4d162cc75a455827f50","language.js":"014fbd00a209c47d93b157d930986898bb31493fc991330c3fe8631f926f2d16","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"5dd8317727d1227c86f7570437618f91a890686efb932527c1882e3846024ffc","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"1ec6d5c9574fc0e45c74f79c6f3cde3cf0b946ee4d2d8cfc34264ea49de12fb1","disclaimer-en.html":"930ae0310c04f1899ffc113e3fd902d9d8e07cca155c5f92009f450e388c844b","disclaimer-id.html":"1762c1d55a6ea4cb1b94392f5da6ce5779a0c42b280900ac38f4c6c7ed5afe73","about.html":"c56b3a5c3708dd9a9e9fa3fef78cc6a1fd38680e048fd43ee402a3a9100c3b9a","about-en.html":"1510dc60101a5436ff227bebe0646c700bf658f01a5190bc396288f0e2fa7e32","about-id.html":"67a1de01d14db4b1876fb1e3e61c50a237780514dc5feb42d317be3e97d63083","layout-guide-en.html":"d25889a4999394215c53cc75723c840487bc90bf24d6d9b217935770503d6e95","layout-guide-id.html":"221165b1648fe594073ebc9b1bacfd1957e96f1e4f8cd934f68e4cc130b50dfd","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"e4c8eeb90768e9833702c32179741a2b7a7414d3dfa1cd9b7b385f6bb1d1e344","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"a105c051994e3cc1a07869ac653958c46754ae89e47553b311f3007a0624a631","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"b984c276527b16dc4ac936b7e20480b242774d34931d2168a557e87caf0d2fe3","guide-print-en.webp":"f283b5a221cd26ad709bdd877cd6205cff5b8ced5da301495027c46c59b97bd6","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"6fa53f1edacfa16d1bb6b438f9817549c8f0c4049c5d820a0156cf9bcc880eaf","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d","guide-map-pl.webp":"207c15bc0d539f32429a54ec51705710b6fb0a4dd58de0d103f06bdeae6b232b","guide-size-pl.webp":"151ea437681bac8ebfbfd568ff48bc8cdcf8c6390013b4596bf1da983bad639c","guide-beds-pl.webp":"57c49b4ee7fa96f3b81e8b9d16ac9b3a03b18ffbcfcd3984cfd4bf7677ca2435","guide-plant-pl.webp":"f4026334c3b68443369add9391ce965824bad9077a7ccc8cad75c124888ea3c7","guide-print-pl.webp":"36ba408f06657046451cc232fa8fb9b4bd658acf96cd19cb8361534fc7b870e2","guide-save-pl.webp":"2090d6fd4416b688703c91e2508c62c9d7754f40f5eeca9989c49381ba03d193","guide-map-sw.webp":"4b2e4b18fd24bb8c4a9d3331ddb42489e2a202cbcf7a531ead133cbc8e764216","guide-size-sw.webp":"d0e49481fcafabb30b52529fcb4c40976676ceffb6caa66be28b27f60b051f03","guide-beds-sw.webp":"7d825521b5f3a935159904796ddcc4cf606d3ef5d86eb9059186962bbbf90462","guide-plant-sw.webp":"fdb52e838dc524a0a851197d85faf988e04fd23be1addae2cdaf6b533eb0741d","guide-print-sw.webp":"7933ee439f05a4da8428b72f110454549a1018edbecbf95928da264539a840c3","guide-save-sw.webp":"39245e38ac5d6d6e4566d2732176aecca7fae0d987842779bd095d0f5969f266","developer-notes.html":"0a660d06d7d6fa85ef3e3116b6c5ddcce9b83fdb99eb97081a871437216a4036","developer-notes.css":"610136300d3d151046c1cb990f9ac432c67052642ff04dabb6b6da08990245eb","record-safety.js":"80cd1ef6ac67a7fe8e66f8b736c4fb1c6890de2ee452fe90c72b84a431a61717","entry.js":"eadf72435308dfc16d1ed8e890f669c31536a1df99781cca30137fc963eec84d","analytics.js":"8e61dd39db79ea39e8997db33c441a4f8d0dbfba42f59385cd3be9b335a2e7e6","brand.css":"d37626ffbf7d81ac21384617dd35e2eeaf965aa1f1a41ff6ac72b3c1d0948912","brand-b1-ja.webp":"e32297aadfb1870ded10639dc14a496c6496ecb7d730ad737cc8bd42eea0dc04","brand-b1-latin.webp":"daec7239d6f4d719087989002fe20edd4b1a46d1305aed3e40d51b43fc0636f1","garden-progress.webp":"be0d8007ab08a7f7c57a70f4ccdd39183dac27d7fb9d170c59b149ebc0ebd675","welcome-vegetables.webp":"85729c51c13b4a77f5cac28f2839f91f18d7526889552b10499220d0b9cac6c3"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {"sw":["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","guide-map-sw.webp","brand-b1-latin.webp"],"pl":["pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","guide-map-pl.webp","brand-b1-latin.webp"],"ja":["index.html","hatakebo.runtime.js","about.html","disclaimer.html","app-example.png","developer-notes.html","developer-notes.css","analytics.js","brand-b1-ja.webp"],"en":["en.html","hatakebo.en.runtime.js","about-en.html","disclaimer-en.html","layout-guide-en.html","guide-map-en.webp","brand-b1-latin.webp"],"id":["id.html","hatakebo.id.runtime.js","about-id.html","disclaimer-id.html","layout-guide-id.html","guide-map-id.webp","brand-b1-latin.webp"]};
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
