/* The release builder updates VERSION when any cached file changes. */
const VERSION = '7a6e998eaefc61af';
const BASE = new URL('./',self.location.href);
const PREFIX = 'hatakebo-offline:'+BASE.pathname+':';
const CACHE = PREFIX+VERSION;
const FILES = ['index.html','hatakebo.runtime.js','vegetables.js','landmarks.js','disclaimer.html','offline.js','vendor/react-18.3.1.min.js','vendor/react-dom-18.3.1.min.js'];
const URLS = FILES.map(file=>new URL(file,BASE).href);
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    // Atomic addAll: a failed download cannot mark this version ready.
    await cache.addAll(URLS.map(url=>new Request(url,{cache:'reload'})));
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
    event.ports[0].postMessage({ready:present.every(Boolean),version:VERSION});
  })());
});
