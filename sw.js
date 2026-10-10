/* The release builder updates VERSION when any cached file changes. */
const VERSION = '31c4132776c2cfc5';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["pl.html","hatakebo.pl.runtime.js","about-pl.html","disclaimer-pl.html","layout-guide-pl.html","index.html","en.html","id.html","hatakebo.runtime.js","hatakebo.en.runtime.js","hatakebo.id.runtime.js","language.css","language.js","vegetables.js","vegetables-extra.js","landmarks.js","disclaimer.html","disclaimer-en.html","disclaimer-id.html","about.html","about-en.html","about-id.html","layout-guide-en.html","layout-guide-id.html","layout-guide.css","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js","favicon.ico","favicon.png","guide-map-en.webp","guide-size-en.webp","guide-beds-en.webp","guide-plant-en.webp","guide-print-en.webp","guide-save-en.webp","guide-map-id.webp","guide-size-id.webp","guide-beds-id.webp","guide-plant-id.webp","guide-print-id.webp","guide-save-id.webp","guide-map-pl.webp","guide-size-pl.webp","guide-beds-pl.webp","guide-plant-pl.webp","guide-print-pl.webp","guide-save-pl.webp"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"pl.html":"0e19c357306b99318a040c2d78794035ae9ae21aced58cdea00826c6d4d25f54","hatakebo.pl.runtime.js":"18486269c929ffcc505aaf8ecf610dbe7f4f904c52efd04b2866b1c09d11a7fb","about-pl.html":"2a8c9616d7b526147341abf55be1063f2417d066aaac86f344c763bac88218e5","disclaimer-pl.html":"c7e4f0bf8d585505b4f8d12252607c6c69cb3907bb942c7215f06cf6b3c49ccd","layout-guide-pl.html":"aeae1b51dd709221433b1c2ea156923c749ff786b953da4506e74aa93407e6ce","index.html":"051bd4f644bf4bdb0554876386b9720ebda5712fc30a335ed0c248cfcbaaf842","en.html":"758595304253568d9736b9077eb0b8ace204ed4cf8b846ac48e264783e038376","id.html":"7e9f3d882b5932a1a7f73a9b409e2f91c92667cae3dba97dd192f98aaacc186f","hatakebo.runtime.js":"937bb75b640b411d36b6fa66dd4440cd4752546498b003ba9f2c230b1b4e63d4","hatakebo.en.runtime.js":"0809cccc52885ad082a632222240224f15319ab1c81135ef1dd448f1c5d6b21b","hatakebo.id.runtime.js":"7b7a60bc1210e5d9ec743fa4867fda318691c9026d1e466f46fb3b47ac91d97d","language.css":"7ef939797b30589b6c687a2dae5f87baff7363332296fd2539defc2c167f152b","language.js":"16726e2e937dfc6912d88c36e6adfa79d5be395c4bac8db31246dfd04d1898a3","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","vegetables-extra.js":"e0aa5366cc5e018dd60b8100a1a84db4cc22b848b359c2a73ee461987519263d","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"7a3871dedee8299c039790e4ebb01bcf971f893b2fd7411a5b5a3243b8a643d1","disclaimer-en.html":"f3f5cd0f3799bad6cc1213a1c45fc329c70dd695cd3aa3dc22bbebf0417e8ea4","disclaimer-id.html":"77cdb0110361d9abf1e32760eb77768f2ce67b6fc15e8f4f9dd66c08c7181a25","about.html":"708bee9bacd06dd2be273ae33a7c45d06c51876697a3735c39480496b65bbb51","about-en.html":"125d016195ca28e7a5fabca3344d1a6406d41de1c300b4434e4c5149bbb05323","about-id.html":"982f93b0636b56f15d31e3184dbfe0e79b86745713f31e488131835858588e48","layout-guide-en.html":"71f82c4ee1b054f2d0370e336c232a558ce2a2db83cdff6303ce6c57c574ad02","layout-guide-id.html":"a27bc9a37682ce5585e78f27f7828d77448f5726196cc9e5f415e958f01bd8d4","layout-guide.css":"fabca4885c34f494f708b8eeca80c0f86dd7b1e6a27d16e566c414b84dfd2f77","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"a105c051994e3cc1a07869ac653958c46754ae89e47553b311f3007a0624a631","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d","favicon.ico":"06982575e69f9f1eaaed6fc50a7e23bf043684d576d45d32ff7b897e5baeffb6","favicon.png":"9b19bfe46bd91dffcec2b32966a7cce4d2c659d210dfbd8477cee0d34e7aeaf4","guide-map-en.webp":"c5e3c2777ade58c57d8745752e4087dd5d9010d572a7020d6c532664012f5158","guide-size-en.webp":"9f9ea00885a4371931e96634fbc2a90e37c0ffb6eceac3e8bc38da0f7cc1d937","guide-beds-en.webp":"2c965d80e9043ef45ee0523d74baf2ddb9fd4397a090418c1de182aac1236046","guide-plant-en.webp":"593f0db981c262a44ea9abc390cc8542411eceeb71d361fcbf95a7146924e0f5","guide-print-en.webp":"8171c34d3f5a0dfdf2df03f2f947c87b703b7651f6ea053dd99962dcafe64115","guide-save-en.webp":"e441463304338368cc3545c1670aa6ddd7500f4a43eb9e5d4ebd3c6cc7883226","guide-map-id.webp":"c856f1833b22d21bb53d9ecd70c75b810babe337c75385bc76c5a364656947a6","guide-size-id.webp":"a98bd645cbba1faca63056c7fd27ad9bff5303ba4c129e2421408bac482342d7","guide-beds-id.webp":"d97d6026c552d944908e53545fe00b1fb18491bbdb8ecc1506c06e9fb826339c","guide-plant-id.webp":"b9b0890a3dc091494e57780d61aed69bc7760f0c6c8104cf6be955ba096ac9f5","guide-print-id.webp":"e4b913c953ac7e4a2b1ce22204e2a534c19d5810b83eb93bdc89a0daf1ed2907","guide-save-id.webp":"c2aa724d33da1a5fb34f097cc347fd015aaaab98612eab76e8013c01273fd25d","guide-map-pl.webp":"207c15bc0d539f32429a54ec51705710b6fb0a4dd58de0d103f06bdeae6b232b","guide-size-pl.webp":"151ea437681bac8ebfbfd568ff48bc8cdcf8c6390013b4596bf1da983bad639c","guide-beds-pl.webp":"57c49b4ee7fa96f3b81e8b9d16ac9b3a03b18ffbcfcd3984cfd4bf7677ca2435","guide-plant-pl.webp":"d0cfec8ade78ca0f151855e359c056640a40c2f13309c6ebb1e4a380deb06ab7","guide-print-pl.webp":"bf04bbe891163885ba52fb416476a39ac7b11a20036c9d5c90f1e2eeccf53bd0","guide-save-pl.webp":"2090d6fd4416b688703c91e2508c62c9d7754f40f5eeca9989c49381ba03d193"};
const READY = new URL('__offline_ready__',BASE).href;
const LANG_FILES = {pl:['pl.html','hatakebo.pl.runtime.js','about-pl.html','disclaimer-pl.html','layout-guide-pl.html','guide-map-pl.webp'],ja:['index.html','hatakebo.runtime.js','about.html','disclaimer.html','app-example.png'],en:['en.html','hatakebo.en.runtime.js','about-en.html','disclaimer-en.html','layout-guide-en.html','guide-map-en.webp'],id:['id.html','hatakebo.id.runtime.js','about-id.html','disclaimer-id.html','layout-guide-id.html','guide-map-id.webp']};
// Step screenshots are cached on request, not fetched during application setup.
const ON_DEMAND = ['en','id','pl'].flatMap(lang=>['size','beds','plant','print','save'].map(step=>'guide-'+step+'-'+lang+'.webp'));
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
