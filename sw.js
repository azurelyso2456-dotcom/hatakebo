/* The release builder updates VERSION when any cached file changes. */
const VERSION = '6c7593dd7e0d4b69';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp","guide-map-pl.webp","guide-size-pl.webp","guide-beds-pl.webp","guide-plant-pl.webp","guide-print-pl.webp","guide-save-pl.webp","guide-map-sw.webp","guide-size-sw.webp","guide-beds-sw.webp","guide-plant-sw.webp","guide-print-sw.webp","guide-save-sw.webp"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"sw.html":"8285902ee2fec4f980bd2e9ef5d43bd0d4e335b45eaa626628d76979c859ec82","hatakebo.sw.runtime.js":"42fadd0a837a015c62fa582eef1cf309573d4e5e464445d600d85066c11ddaf7","about-sw.html":"fbb4b71029b03c24b78ee41c45740ea15141b14a3f7156a455cad8294ca2f9f5","disclaimer-sw.html":"b85d4d1e760fb150a67c754eb39c27b58b0db6c96ec9e837d25fe44729495fa2","layout-guide-sw.html":"18de3c5504b4557702b34617899209f2148c368e37c27d8be0a9de3b52d1dac0","pl.html":"87646303c6dcd44e04498f0b276ba22066990174a7e3da08919189cb27d5120e","hatakebo.pl.runtime.js":"e8f26bfd346c4e4a483017f4dc7026b185ecce903fd0ccfd3319a8c12c336e3c","about-pl.html":"4fa57d01824d8d357f3e2f7ab5cf695708110887012bc7c69544f7d53e3030ec","disclaimer-pl.html":"cf90b007048f8ad9e1ac6dac008ec27331242b05fdc7896307bf2bb47f23f243","layout-guide-pl.html":"1a71a6661acba7caf18d537a01627d4690706c2df7bedbcb620c4fb408f10299","index.html":"d0d22265849b19bc03067f30beb268e69608935d27595c2ec73d104f7e02ebd9","en.html":"d7e6f43afd676e99fa4bd0c296a6c931b088eaadcbd3911377355ec5da03025c","id.html":"9ebd38e391fe37ff6e2852c6b466d58d8a4858113742a891ab6a65ee1a9f9d8c","hatakebo.runtime.js":"855b76c7790952dfc7ae77aa53db00e4285c9f342a02f79cf3114e09efe11c2e","hatakebo.en.runtime.js":"d28af111d15c2ccf396441ae7dc830231983f37c615eebc4527aed5e4c7f8409","hatakebo.id.runtime.js":"3b8740d720c16e779e736cdfb9c80ad8d02cb1ac3d036ecc78e1624a760887e0","language.css":"4bc832a3693047bf9c07e6dcf95bb60b8598fc67ee1515cb79067173817a9689","language.js":"014fbd00a209c47d93b157d930986898bb31493fc991330c3fe8631f926f2d16","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"5dd8317727d1227c86f7570437618f91a890686efb932527c1882e3846024ffc","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"dc908db9e73da7d37c08d1ea3374f707b40f0221a40c18e498a3ab02a538f841","disclaimer-en.html":"9ee57236cffe1bbeb6a7c084153adc16cb88dea2fab82b7a248a7a90db0f628c","disclaimer-id.html":"7e2f36653493c5f230ebb7bd0d7cf68d8da2893a856fca39a68f5ed329d087a7","about.html":"aeed39a37d22ddac5386b6b48b8238931a8fcc424fc71af7d0883dc411586f92","about-en.html":"f6169b0d60b98652bb3607ae46da991999d2c17c0683b26acdb1594a4b03e4b2","about-id.html":"c531e2dafa9e33a9d151be90ad46aca03e3b819074067a1e1fc8a1697a8cf4ab","layout-guide-en.html":"8588c5278edfad2afe2dfc0a8c3ad1470fc9b9783f140ee3a12f76efd30cf35f","layout-guide-id.html":"660bde3c9abb3ad5a31c09334593919d85adc4aa965ca2eabd365db8cafe4831","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"a105c051994e3cc1a07869ac653958c46754ae89e47553b311f3007a0624a631","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"b984c276527b16dc4ac936b7e20480b242774d34931d2168a557e87caf0d2fe3","guide-print-en.webp":"8171c34d3f5a0dfdf2df03f2f947c87b703b7651f6ea053dd99962dcafe64115","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"e4b913c953ac7e4a2b1ce22204e2a534c19d5810b83eb93bdc89a0daf1ed2907","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d","guide-map-pl.webp":"207c15bc0d539f32429a54ec51705710b6fb0a4dd58de0d103f06bdeae6b232b","guide-size-pl.webp":"151ea437681bac8ebfbfd568ff48bc8cdcf8c6390013b4596bf1da983bad639c","guide-beds-pl.webp":"57c49b4ee7fa96f3b81e8b9d16ac9b3a03b18ffbcfcd3984cfd4bf7677ca2435","guide-plant-pl.webp":"f4026334c3b68443369add9391ce965824bad9077a7ccc8cad75c124888ea3c7","guide-print-pl.webp":"bf04bbe891163885ba52fb416476a39ac7b11a20036c9d5c90f1e2eeccf53bd0","guide-save-pl.webp":"2090d6fd4416b688703c91e2508c62c9d7754f40f5eeca9989c49381ba03d193","guide-map-sw.webp":"4b2e4b18fd24bb8c4a9d3331ddb42489e2a202cbcf7a531ead133cbc8e764216","guide-size-sw.webp":"d0e49481fcafabb30b52529fcb4c40976676ceffb6caa66be28b27f60b051f03","guide-beds-sw.webp":"7d825521b5f3a935159904796ddcc4cf606d3ef5d86eb9059186962bbbf90462","guide-plant-sw.webp":"fdb52e838dc524a0a851197d85faf988e04fd23be1addae2cdaf6b533eb0741d","guide-print-sw.webp":"7774c281df8b0d7f671324947650512d2a18082b4f4a298a15be72e03bf62378","guide-save-sw.webp":"39245e38ac5d6d6e4566d2732176aecca7fae0d987842779bd095d0f5969f266"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {sw:["sw.html","hatakebo.sw.runtime.js","about-sw.html","disclaimer-sw.html","layout-guide-sw.html","guide-map-sw.webp"],pl:['pl.html','hatakebo.pl.runtime.js','about-pl.html','disclaimer-pl.html','layout-guide-pl.html','guide-map-pl.webp'],ja:['index.html','hatakebo.runtime.js','about.html','disclaimer.html','app-example.png'],en:['en.html','hatakebo.en.runtime.js','about-en.html','disclaimer-en.html','layout-guide-en.html','guide-map-en.webp'],id:['id.html','hatakebo.id.runtime.js','about-id.html','disclaimer-id.html','layout-guide-id.html','guide-map-id.webp']};
// Step screenshots are cached on request, not fetched during application setup.
const ON_DEMAND = ['en','id','pl','sw'].flatMap(lang=>['size','beds','plant','print','save'].map(step=>'guide-'+step+'-'+lang+'.webp'));
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
