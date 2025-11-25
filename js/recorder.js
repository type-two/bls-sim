;(function(){
  var DBKEY = 'bls_recordings'
  var Recorder = {
    running: false,
    startTime: 0,
    samples: [],
    start: function(){ this.running=true; this.startTime=Date.now(); this.samples=[]; this.base = (window.BLS? JSON.parse(JSON.stringify(BLS.loadState())): {} ); this._last = JSON.parse(JSON.stringify(this.base)); if(window.DEBUG_REC){ try{ console.log('Recording started. Base:', this.base) }catch(_){} } },
    recordState: function(s){ if(!this.running) return; var t = Date.now() - this.startTime; var delta = {}; var hasChanges=false; try{ for(var k in s){ if(!Object.prototype.hasOwnProperty.call(s,k)) continue; var v = s[k]; var b = this._last && this._last[k]; if(JSON.stringify(v)!==JSON.stringify(b)){ delta[k]=v; hasChanges=true } } }catch(_){ delta = s; hasChanges=true } this._last = JSON.parse(JSON.stringify(s)); if(hasChanges){ this.samples.push({ t: t, delta: delta }); if(window.DEBUG_REC){ try{ console.log('Recorded delta at', t, 'ms:', delta) }catch(_){} } } },
    stop: function(){ var dur = Date.now()-this.startTime; var out = { meta:{ createdAt: Date.now(), durationMs: dur, version:1 }, base: this.base||{}, samples: this.samples.slice() }; if(window.DEBUG_REC){ try{ console.log('Recording stopped. Duration:', dur, 'ms. Samples:', this.samples.length) }catch(_){} } this.running=false; this.startTime=0; this.samples=[]; this.base=null; this._last=null; return out },
    list: async function(){ if(window.RecordingStore){ return await RecordingStore.list() } try{ var m = JSON.parse(localStorage.getItem(DBKEY)||'null'); return Array.isArray(m)? m: [] }catch(_){ return [] } },
    add: async function(name, rec){ if(window.RecordingStore){ await RecordingStore.add(name, rec); return } var all = []; try{ all = JSON.parse(localStorage.getItem(DBKEY)||'[]') }catch(_){ all=[] } all.push({ name: name||('Recording '+(all.length+1)), data: rec }); try{ localStorage.setItem(DBKEY, JSON.stringify(all)) }catch(_){} },
    clear: async function(){ if(window.RecordingStore){ var list = await RecordingStore.list(); for(var i=0;i<list.length;i++){ try{ await RecordingStore.delete(list[i].id) }catch(_){ } } } else { try{ localStorage.removeItem(DBKEY) }catch(_){ } } },
    play: function(rec, opts){
      var speed = (opts&&opts.speed)||1;
      var samples = (rec&&rec.samples)||[];
      var start = Date.now();
      var idx=0;
      var runStartRel = null;
      if(rec && rec.base && rec.base.running){ runStartRel = 0 }
      for(var i=0;i<samples.length;i++){ var d=samples[i].delta||samples[i].state||{}; if((d && d.running===true) || (d && typeof d.startedAt==='number')){ runStartRel = (runStartRel==null? samples[i].t : runStartRel); break } }
      function adjustForReplay(s, elapsed){
        if(!s) return s;
        try{
          var out = JSON.parse(JSON.stringify(s));
          if(out && out.running){
            var base = (runStartRel!=null)? runStartRel : 0;
            var rel = Math.max(0, (elapsed - base));
            out.startedAt = Date.now() - rel;
          }
          return out;
        }catch(_){ return s }
      }
      var cur = JSON.parse(JSON.stringify((rec && rec.base) || {}));
      // Apply base state immediately so Patient starts the session without waiting for first delta
      var stopTimer = null;
      var hasStopDelta = false;
      try{ for(var j=0;j<samples.length;j++){ var dj = samples[j] && (samples[j].delta||samples[j].state)||{}; if(dj && dj.running===false){ hasStopDelta = true; break } } }catch(_){ }
      (function applyBase(){
        var s0 = adjustForReplay(cur, 0);
        try{
          if(window.DEBUG_REC){ try{ console.log('Playing recording. Base:', (rec&&rec.base)||{}) }catch(_){} }
          if(opts && typeof opts.applyLocal==='function'){ opts.applyLocal(s0) }
          if(opts && opts.patientSyncOn){
            if(opts && typeof opts.sendLocalChannel==='function'){ opts.sendLocalChannel(s0) }
            if(window.NetRTC && opts && opts.mode==='webrtc'){
              NetRTC.send({type:'state', sessionId: opts.sid||'default', payload: s0})
            } else if(opts && opts.ws){ if(opts.ws.readyState===1){ opts.ws.send(JSON.stringify({type:'state', sessionId: opts.sid||'default', payload: s0}) ) } }
          }
        }catch(_){ }
        try{
          var endMs = null;
          if(rec && rec.meta && typeof rec.meta.durationMs==='number'){ endMs = rec.meta.durationMs }
          if(endMs==null || !(endMs>0)){ endMs = (samples && samples.length? samples[samples.length-1].t : 0) }
          if(endMs && endMs>0 && !hasStopDelta){
            stopTimer = setTimeout(function(){
              var sStop = JSON.parse(JSON.stringify(cur));
              sStop.running = false;
              if(opts && typeof opts.applyLocal==='function'){ opts.applyLocal(sStop) }
              if(opts && opts.patientSyncOn){
                if(window.NetRTC && opts && opts.mode==='webrtc'){
                  NetRTC.send({type:'state', sessionId: opts.sid||'default', payload: sStop})
                } else if(opts && opts.ws){ if(opts.ws.readyState===1){ opts.ws.send(JSON.stringify({type:'state', sessionId: opts.sid||'default', payload: sStop}) ) } }
                if(opts && typeof opts.sendLocalChannel==='function'){ opts.sendLocalChannel(sStop) }
              }
            }, endMs);
          }
        }catch(_){ }
      })();
      var lastEmit = -1;
      function tick(){
        var now = Date.now();
        var elapsed = (now-start)*speed;
        while(idx < samples.length && samples[idx].t <= elapsed){
          var delta = samples[idx].delta || samples[idx].state || {};
          for(var key in delta){ if(Object.prototype.hasOwnProperty.call(delta,key)){ cur[key] = delta[key] } }
          var s = adjustForReplay(cur, elapsed);
          try{
            if(opts && typeof opts.applyLocal==='function'){ opts.applyLocal(s) }
            if(opts && opts.patientSyncOn){
              if(opts && typeof opts.sendLocalChannel==='function'){ opts.sendLocalChannel(s) }
              if(window.NetRTC && opts && opts.mode==='webrtc'){
                NetRTC.send({type:'state', sessionId: opts.sid||'default', payload: s})
              } else if(opts && opts.ws){ if(opts.ws.readyState===1){ opts.ws.send(JSON.stringify({type:'state', sessionId: opts.sid||'default', payload: s}) ) } }
            }
            if(window.DEBUG_REC){ try{ console.log('Applying sample', idx, 'at', Math.round(elapsed), 'ms:', delta) }catch(_){} }
          }catch(_){ }
          idx++
        }
        // Heartbeat: emit current state periodically to update timers/UI throughout replay
        if(elapsed - lastEmit >= 250){
          var sHB = adjustForReplay(cur, elapsed);
          try{
            if(opts && typeof opts.applyLocal==='function'){ opts.applyLocal(sHB) }
            if(opts && opts.patientSyncOn){
              if(opts && typeof opts.sendLocalChannel==='function'){ opts.sendLocalChannel(sHB) }
              if(window.NetRTC && opts && opts.mode==='webrtc'){
                NetRTC.send({type:'state', sessionId: opts.sid||'default', payload: sHB})
              } else if(opts && opts.ws){ if(opts.ws.readyState===1){ opts.ws.send(JSON.stringify({type:'state', sessionId: opts.sid||'default', payload: sHB}) ) } }
            }
          }catch(_){ }
          lastEmit = elapsed;
        }
        setTimeout(tick, 20)
      }
      tick()
    }
  }
  window.Recorder = Recorder
})();
