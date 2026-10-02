/* The release builder updates VERSION when any cached file changes. */
const VERSION = '0c0a0550b4fe8b3e';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ["index.html","en.html","hatakebo.runtime.js","hatakebo.en.runtime.js","language.css","language.js","vegetables.js","landmarks.js","disclaimer.html","disclaimer-en.html","about.html","about-en.html","about.css","garden-notebook-simple.webp","app-example.png","offline.js","vendor/react-18.3.1.min.js","vendor/react-dom-18.3.1.min.js"];
const URLS = FILES.map(file=>new URL(file,BASE).href);
// Generated SHA-256 of the decoded file bytes. Reuse only an exact match.
const DIGESTS = {"index.html":"5f6d9d53d708bcecfd8f125c939b9dd3349c9ddbb5020a027bc46e0d2718531e","en.html":"d82eeb80cc7714a648ab855d31b99239a1828f98439c853c23ce3f32ed2deced","hatakebo.runtime.js":"f59043cdbf6bd71159971245d3614fc867e236bfd83e4153af0fe086ce7c8838","hatakebo.en.runtime.js":"906ae972be5b6eee1c60e28ea1ee2fc6d343d267461a28b7b57878d3c9443ee1","language.css":"fa30afdb99eed8f6132a56c3e7dd70e387a746c5a09048e3888598a6aacdc6fc","language.js":"e45b40747d887421c0e242055ffa17614c0f5830bfbd8c6b44f933cf5c072ddf","vegetables.js":"5868fcb8411f10bfe54a17fdd6bab39de8b79111a6b0e993110b4aa60ff88bd5","landmarks.js":"041b26191e189567081fadec5b96097f7dce7fa187ac31bdfe58228d34a7d443","disclaimer.html":"926b3b308a77545d821b70c3c0695a364d29e1708f17eb90d434f578ad78f1f1","disclaimer-en.html":"c2da224a1dea537fa22ab234e743f5f0b6c81b8b24839c026fc57237fc1517fd","about.html":"277112b4769efb0dfc322a9e5317d905d8e689fc72ee8f224cc69a2d99358538","about-en.html":"9bf242f17a56dc867dd29bae44b340500091c1faf7b15e67edbc1498ab0718a7","about.css":"2b5105b14aac4a5401d177988eba2d9d65de8fb9ea3137975bce4c429f60fc43","garden-notebook-simple.webp":"dacd5d2301c50c0213054088a69489a15aaac1158cd5f00f467ddf919f21a333","app-example.png":"e5652216144be5165d4d8113b86089d26d7035ad4870e4d71393ecec6abb8db2","offline.js":"8ddce9424e45b51d5f5a1e7bed0000ae4248ba5fbafbc51d9b39bc85898086c7","vendor/react-18.3.1.min.js":"d949f1c3687aedadcedac85261865f29b17cd273997e7f6b2bfc53b2f9d4c4dd","vendor/react-dom-18.3.1.min.js":"35f4f974f4b2bcd44da73963347f8952e341f83909e4498227d4e26b98f66f0d"};
const READY = new URL('__offline_ready__',BASE).href;
async function matches(response,digest){
  if(!response||!response.ok)return false;
  const bytes=await response.clone().arrayBuffer();
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')===digest;
}
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.delete(READY);
    const previous=(await caches.keys()).filter(n=>n.startsWith(PREFIX)&&n!==CACHE);
    const sources=[cache,...await Promise.all(previous.map(n=>caches.open(n)))];
    // Sequential installation avoids competing with the initial app load.
    for(let i=0;i<FILES.length;i++){
      const url=URLS[i],digest=DIGESTS[FILES[i]];
      let response;
      for(const source of sources){
        const candidate=await source.match(url);
        if(await matches(candidate,digest)){response=candidate;break;}
      }
      if(!response){
        // First reuse the HTTP cache populated by the page, even if stale.
        response=await fetch(new Request(url,{cache:'force-cache'}));
        if(!await matches(response,digest)){
          response=await fetch(new Request(url,{cache:'reload'}));
          if(!await matches(response,digest))throw Error('Incomplete release: '+FILES[i]);
        }
      }
      await cache.put(url,response);
    }
    await cache.put(READY,new Response(VERSION));
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
    return fetch(event.request);
  })());
});
self.addEventListener('message',event=>{
  if(!event.data||event.data.type!=='CHECK_OFFLINE'||!event.ports[0])return;
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const present=await Promise.all(URLS.map(url=>cache.match(url)));
    const ready=await cache.match(READY);
    event.ports[0].postMessage({ready:!!ready&&present.every(Boolean),version:VERSION});
  })());
});
