;(function(){
  // --- Constants & Defaults ---
  var defaultState = {
    shape:'circle', shapeColor:'#00ff88', bgColor:'#000000', direction:'lr',
    speed:250, speedMultiplier:1, size:28,
    yPercent:50, yOscillateEnabled:false, yOscillateRate:0.5,
    glowEnabled:false, glowIntensity:1, glowRate:0.5,
    rampEnabled:false, rampSeconds:10, easingMode:'linear',
    edgePauseMs:0,
    wiggleEnabled:false, wiggleAmplitude:0,
    audioMode:'programmatic', programPreset:'pink',
    syncPan:true, panRate:0.5, cueRate:1.2, volume:0.6,
    audioName:null, audioEnabled:false,
    running:false, paused:false, pausedMs:0, pausedAt:null, durationSec:600, startedAt:null,
    patientWidth:'full',
    toneFreq:440, toneDurationMs:70, adsrAttackMs:8, adsrDecayMs:80, adsrSustainLevel:0.3, adsrReleaseMs:10
  };

  // --- Channel (Cross-Tab Communication) ---
  function Channel(name){ this.name = name; this.handlers = []; }
  Channel.prototype.on = function(handler){ this.handlers.push(handler) };
  Channel.prototype.send = function(payload){
    try{
      localStorage.setItem('bls_session', JSON.stringify({name:this.name, payload:payload, t:Date.now()}));
    } catch(e){}
  };

  window.addEventListener('storage', function(e){
    if(e.key !== 'bls_session') return;
    try {
      var data = JSON.parse(e.newValue || '{}');
      if(!data) return;
      if(Channel._handlers){
        var hs = Channel._handlers[data.name] || [];
        for(var i=0; i<hs.length; i++){ hs[i](data.payload); }
      }
    } catch(e){}
  });

  Channel._handlers = {};
  Channel.prototype.on = function(handler){
    if(!Channel._handlers[this.name]) Channel._handlers[this.name] = [];
    Channel._handlers[this.name].push(handler);
  };

  // --- State Persistence ---
  function loadState(){
    try{
      var s = JSON.parse(localStorage.getItem('bls_state') || 'null');
      if(!s) return Object.assign({}, defaultState);
      return Object.assign({}, defaultState, s);
    } catch(e){
      return Object.assign({}, defaultState);
    }
  }

  function saveState(s){
    try{ localStorage.setItem('bls_state', JSON.stringify(s)); } catch(e){}
  }

  function mergeState(prev, next, persist){
    var s = Object.assign({}, prev, next);
    if(persist !== false) saveState(s);
    return s;
  }

  // --- Presets ---
  function presetKeys(){
    return ['shape','shapeColor','bgColor','direction','speed','speedMultiplier','size','yPercent','glowEnabled','glowIntensity','glowRate','rampEnabled','rampSeconds','easingMode','edgePauseMs','wiggleEnabled','wiggleAmplitude','audioMode','programPreset','syncPan','panRate','cueRate','volume','audioName','audioEnabled','patientWidth','toneFreq','toneDurationMs','adsrAttackMs','adsrDecayMs','adsrSustainLevel','adsrReleaseMs'];
  }

  function sanitizePreset(s){
    var out={}; var keys=presetKeys();
    for(var i=0; i<keys.length; i++){
      var k=keys[i];
      if(Object.prototype.hasOwnProperty.call(s,k)) out[k]=s[k];
    }
    return out;
  }

  function loadPresets(){
    try{
      var m = JSON.parse(localStorage.getItem('bls_presets') || 'null');
      return m && typeof m==='object' ? m : {};
    } catch(e){ return {}; }
  }

  function savePresets(m){
    try{ localStorage.setItem('bls_presets', JSON.stringify(m)); } catch(e){}
  }

  // --- Renderer ---
  function Renderer(canvas){
    var ctx = canvas.getContext('2d');
    var state = loadState(); // Initial state loaded from storage
    var pos = null;
    var dir = {x:1, y:0};
    var running = false;
    var onUpdate = null;
    var pauseMs = 0;
    var wigglePhase = 0;

    // Optimized: Reusable objects/vars to avoid GC
    var _drawVars = {
      x: 0, y: 0, r: 0, wx: 0, wy: 0,
      doGlow: false, gi: 0, freq: 0, a: 0, hue: 0, t: 0, s: 0, h2: 0
    };

    function setDir(){
      if(state.direction === 'lr'){ dir.x=1; dir.y=0; }
      else if(state.direction === 'ud'){ dir.x=0; dir.y=1; }
      else if(state.direction === 'diag_down'){ dir.x=1; dir.y=1; }
      else { dir.x=1; dir.y=-1; }

      var len = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
      dir.x /= len;
      dir.y /= len;
    }

    function yFromPercent(h, r, p){
      return Math.max(r, Math.min(h-r, r + (h-2*r) * (p/100)));
    }

    function ensurePos(){
      var w=canvas.width, h=canvas.height, r=state.size;
      var defPct = (state.direction==='lr'?50 : state.direction==='ud'?5 : state.direction==='diag_down'?5 : 95);
      var pct = (state.yPercent===undefined || state.yPercent===null ? defPct : state.yPercent);

      if(!pos){
        if(state.direction === 'lr'){ pos = {x: r+2, y: yFromPercent(h,r,pct)}; }
        else if(state.direction === 'ud'){ pos = {x: w/2, y: yFromPercent(h,r,pct)}; }
        else { pos = {x: r+2, y: yFromPercent(h,r,pct)}; }
      } else {
        pos.y = yFromPercent(h, r, pct);
      }
      pos.x = Math.max(r, Math.min(w-r, pos.x));
      pos.y = Math.max(r, Math.min(h-r, pos.y));
    }

    function clear(){
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw(){
      var v = _drawVars;
      v.r = state.size;
      v.x = pos.x;
      v.y = pos.y;
      v.doGlow = !!state.glowEnabled;
      v.gi = state.glowIntensity || 1;
      v.t = Date.now()/1000;
      v.wx = 0; v.wy = 0;

      if(state.wiggleEnabled && state.wiggleAmplitude > 0){
        wigglePhase += 0.04 + state.speed/4000;
        v.s = Math.sin(wigglePhase);
        if(state.direction === 'lr'){ v.wy = v.s * state.wiggleAmplitude; }
        else if(state.direction === 'ud'){ v.wx = v.s * state.wiggleAmplitude; }
        else { v.wx = -dir.y * v.s * state.wiggleAmplitude; v.wy = dir.x * v.s * state.wiggleAmplitude; }
      }

      if(v.doGlow){
        v.freq = Math.max(0.05, state.glowRate || 0.5);
        v.a = 0.5 + 0.5 * Math.sin(v.t * 2 * Math.PI * v.freq);
        v.hue = (v.t * 60 * v.freq) % 360;

        ctx.save();
        ctx.shadowBlur = v.r * v.gi * (0.7 + v.a);
        ctx.shadowColor = 'hsla(' + v.hue + ',100%,60%,0.9)';
      }

      ctx.fillStyle = state.shapeColor;

      if(state.shape === 'circle'){
        ctx.beginPath();
        ctx.arc(v.x + v.wx, v.y + v.wy, v.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
      } else if(state.shape === 'square'){
        ctx.fillRect(v.x - v.r + v.wx, v.y - v.r + v.wy, v.r*2, v.r*2);
      } else {
        v.h2 = v.r * 1.6;
        ctx.beginPath();
        ctx.moveTo(v.x + v.wx, v.y - v.h2/2 + v.wy);
        ctx.lineTo(v.x - v.r + v.wx, v.y + v.h2/2 + v.wy);
        ctx.lineTo(v.x + v.r + v.wx, v.y + v.h2/2 + v.wy);
        ctx.closePath();
        ctx.fill();
      }

      if(v.doGlow){ ctx.restore(); }
    }

    function effectiveSpeed(w, h, r){
      var base = state.speed;
      var ramp = 1;

      if(state.rampEnabled && state.startedAt && state.rampSeconds > 0){
        var dt = Math.max(0, (Date.now() - state.startedAt)/1000);
        var k = Math.min(1, dt/state.rampSeconds);
        ramp = 0.2 + 0.8 * k;
      }

      var s = 1;
      if(state.easingMode === 'ease'){
        if(dir.x !== 0){
          var u = (pos.x - r) / (w - 2*r);
          s = 0.3 + 0.7 * (0.5 - 0.5 * Math.cos(2 * Math.PI * Math.max(0, Math.min(1, u))));
        } else {
          var v = (pos.y - r) / (h - 2*r);
          s = 0.3 + 0.7 * (0.5 - 0.5 * Math.cos(2 * Math.PI * Math.max(0, Math.min(1, v))));
        }
      }
      return base * ramp * s;
    }

    function step(dt){
      var w=canvas.width, h=canvas.height, r=state.size;
      if(pauseMs > 0){
        pauseMs = Math.max(0, pauseMs - dt*1000);
        return;
      }

      var sp = effectiveSpeed(w, h, r);
      pos.x += dir.x * sp * dt;
      pos.y += dir.y * sp * dt;

      var hit = false;
      if(pos.x <= r){ pos.x = r; dir.x = Math.abs(dir.x); hit=true; }
      if(pos.x >= w - r){ pos.x = w - r; dir.x = -Math.abs(dir.x); hit=true; }
      if(pos.y <= r){ pos.y = r; dir.y = Math.abs(dir.y); hit=true; }
      if(pos.y >= h - r){ pos.y = h - r; dir.y = -Math.abs(dir.y); hit=true; }

      if(hit && state.edgePauseMs > 0){ pauseMs = state.edgePauseMs; }

      if(onUpdate){ onUpdate({x:pos.x, y:pos.y, w:w, h:h}); }
    }

    var last = 0;
    function loop(t){
      if(!running) return;
      if(!last) last = t;
      var dt = (t - last)/1000;
      last = t;

      clear();
      draw();
      step(dt);
      requestAnimationFrame(loop);
    }

    function start(){
      if(!running){
        running = true;
        last = 0;
        requestAnimationFrame(loop);
      }
    }

    function stop(){ running = false; }

    function setState(next, persist){
      var n = next || {};
      var prevDir = state.direction;
      var prevSize = state.size;
      var hadDir = Object.prototype.hasOwnProperty.call(n,'direction');
      var hadSize = Object.prototype.hasOwnProperty.call(n,'size');
      var hadY = Object.prototype.hasOwnProperty.call(n,'yPercent');

      state = mergeState(state, n, persist); // Default persist=false for Renderer calls generally

      if(hadDir && state.direction !== prevDir){ setDir(); }
      if(hadSize && state.size !== prevSize){ ensurePos(); }

      if(hadY){
        var r = state.size;
        var defPct = (state.direction==='lr'?50 : state.direction==='ud'?5 : state.direction==='diag_down'?5 : 95);
        var pct = (state.yPercent===undefined || state.yPercent===null ? defPct : state.yPercent);
        pos.y = yFromPercent(canvas.height, r, pct);
      }

      clear();
      draw();
    }

    function resize(w, h){
      if(typeof w === 'number') canvas.width = w;
      if(typeof h === 'number') canvas.height = h;
      ensurePos();
      clear();
      draw();
    }

    function setOnUpdate(fn){ onUpdate = fn; }

    setDir();
    ensurePos();
    clear();
    draw();

    return {
      start:start, stop:stop, setState:setState, resize:resize,
      getState:function(){return state;}, setOnUpdate:setOnUpdate
    };
  }

  // --- Export ---
  window.bls = {
    createChannel: function(name){ return new Channel(name); },
    defaultState: defaultState,
    loadState: loadState,
    saveState: saveState,
    mergeState: mergeState,
    Renderer: Renderer,
    listPresets: function(){ var m=loadPresets(); return Object.keys(m).sort(); },
    savePreset: function(name, st){
      if(!name) return;
      var m = loadPresets();
      m[name] = sanitizePreset(st || loadState());
      savePresets(m);
    },
    loadPreset: function(name){ var m = loadPresets(); return m[name] || null; },
    deletePreset: function(name){ var m = loadPresets(); if(m[name]){ delete m[name]; savePresets(m); } },
    exportPresets: function(){ return JSON.stringify(loadPresets(), null, 2); },
    importPresets: function(json){
      try{
        var data = typeof json==='string' ? JSON.parse(json) : json;
        if(!data || typeof data!=='object') return;
        var m = loadPresets();
        for(var k in data){
          if(Object.prototype.hasOwnProperty.call(data,k)) m[k] = sanitizePreset(data[k]);
        }
        savePresets(m);
      } catch(e){}
    }
  };

  window.BLS = window.bls;
})();
