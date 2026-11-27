/* Sanilift Muhasebe — çevrimdışı çalışma + güncelleme. Sürümü artırınca eski önbellek silinir. */
const SURUM='sanilift-pwa-46';
const TEMEL=['./','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SURUM).then(c=>c.addAll(TEMEL).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==SURUM).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* önce ağ (yeni sürüm gelsin), ağ yoksa önbellek */
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const k=res.clone();caches.open(SURUM).then(c=>c.put(r,k))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./'):undefined))));
});
