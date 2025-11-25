;(function(){
  function openDB(){
    return new Promise(function(resolve, reject){
      var req = indexedDB.open('bls_rec_db', 1);
      req.onupgradeneeded = function(e){ var db = req.result; if(!db.objectStoreNames.contains('recordings')){ db.createObjectStore('recordings', { keyPath: 'id' }) } };
      req.onsuccess = function(){ resolve(req.result) };
      req.onerror = function(){ reject(req.error) };
    })
  }
  async function putRec(rec){ var db = await openDB(); return new Promise(function(resolve, reject){ var tx = db.transaction('recordings','readwrite'); var store = tx.objectStore('recordings'); var req = store.put(rec); req.onsuccess=function(){ resolve(rec) }; req.onerror=function(){ reject(req.error) } }) }
  async function getAll(){ var db = await openDB(); return new Promise(function(resolve, reject){ var tx = db.transaction('recordings','readonly'); var store = tx.objectStore('recordings'); var req = store.getAll(); req.onsuccess=function(){ resolve(req.result||[]) }; req.onerror=function(){ reject(req.error) } }) }
  async function delById(id){ var db = await openDB(); return new Promise(function(resolve, reject){ var tx = db.transaction('recordings','readwrite'); var store = tx.objectStore('recordings'); var req = store.delete(id); req.onsuccess=function(){ resolve(true) }; req.onerror=function(){ reject(req.error) } }) }
  function genId(){ return 'rec_'+Date.now()+'_'+Math.random().toString(36).slice(2,8) }
  async function migrateLocal(){ try{ var raw = localStorage.getItem('bls_recordings'); if(!raw) return; var arr = JSON.parse(raw||'[]'); if(!Array.isArray(arr) || !arr.length) return; var existing = await getAll(); var names = new Set((existing||[]).map(function(r){ return r.name })); for(var i=0;i<arr.length;i++){ var r = arr[i]; if(r && r.name && !names.has(r.name)){ var id = genId(); var meta = (r.data && r.data.meta) || {createdAt: Date.now(), durationMs:0, version:1}; await putRec({ id:id, name: r.name||('Recording '+(i+1)), meta: meta, base: (r.data && r.data.base)||null, samples: (r.data && r.data.samples)||[], path: (r.data && r.data.path)||null }) } } localStorage.removeItem('bls_recordings') }catch(_){ }
  }
  var RecordingStore = {
    list: async function(){ await migrateLocal(); var all = await getAll(); return all.map(function(r){ return { id:r.id, name:r.name, data:{ meta:r.meta, base:r.base, samples:r.samples, path:r.path } } }) },
    add: async function(name, data){ var rec = { id: genId(), name: name||('Recording '+new Date().toLocaleString()), meta: data.meta||{ createdAt: Date.now(), durationMs: data.meta && data.meta.durationMs || 0, version: 1 }, base: data.base||null, samples: data.samples||[], path: data.path||null }; await putRec(rec); return rec },
    delete: async function(id){ return delById(id) }
  }
  window.RecordingStore = RecordingStore
})();

