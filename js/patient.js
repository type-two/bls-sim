;(function(){
  // --- Constants & Globals ---
  var canvas, renderer, chan, ws;
  var widthMode = 'full';
  var running = false;
  var audioFolder = null;
  var audioBuffer = null;
  var audioUnlocked = false;
  var pendingProgramState = null;

  // Audio Context & Nodes
  var audioCtx = null, panner = null, gain = null, source = null;

  // --- Initialization ---
  function initPatient(){
    canvas = document.getElementById('canvas');

    // Load initial width preference
    var initialState = BLS.loadState();
    widthMode = initialState.patientWidth || 'full';

    // Setup Resize Handler
    window.addEventListener('resize', onResize);
    size();
    sendViewport(); // Initial send

    // Initialize Renderer
    // Note: We will modify BLS.Renderer to NOT save state by default,
    // or we will just use it as is and fix the saving issue in bls.js later.
    renderer = BLS.Renderer(canvas);

    // Setup Local Channel (for same-browser tab communication)
    chan = BLS.createChannel('bls-session');
    chan.on(handleStateUpdate);

    // Setup Network
    setupNetwork();

    // Initial State Load
    renderer.setState(initialState);
    var st = renderer.getState();
    if(st.running){
      renderer.start();
    }

    // Audio Unlock Binding
    bindUnlock();

    // Sync Panner with Renderer
    renderer.setOnUpdate(onRenderUpdate);
  }

  // --- Viewport Management ---
  function size(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    var fac = (widthMode === 'reduced' ? 0.7 : 1);
    canvas.width = Math.floor(w * fac);
    canvas.height = h;
  }

  var sendViewportTimeout = null;
  function sendViewport(){
    if(sendViewportTimeout) clearTimeout(sendViewportTimeout);
    sendViewportTimeout = setTimeout(doSendViewport, 200);
  }

  function doSendViewport(){
    try {
      var pv = {
        winW: window.innerWidth,
        winH: window.innerHeight,
        canvasW: canvas.width,
        canvasH: canvas.height
      };

      if(ws && ws.readyState === 1){
        ws.send(JSON.stringify({type:'patientViewport', payload: pv}));
      }

      if(window.NetRTC && NetRTC.send){
        NetRTC.send({type:'patientViewport', payload: pv});
      }

      try {
        if(window.opener){
          window.opener.postMessage({type:'patientViewport', payload: pv}, '*');
        }
      } catch(_){}

      try {
        if(window.BLS){
          BLS.createChannel('bls-session').send({type:'patientViewport', payload: pv});
        }
      } catch(_){}
    } catch(e){}
  }

  function onResize(){
    size();
    sendViewport();
  }

  // --- State Management ---
  function handleStateUpdate(msg){
    if(!msg || typeof msg !== 'object') return;

    // Deep copy to avoid reference issues
    var apply = Object.assign({}, msg);

    // Fixups for specific flags
    if(apply.rampEnabled === false) apply.easingMode = 'linear';
    if(apply.glowEnabled === false) apply.glowIntensity = 0;

    // Update Renderer State
    // Important: The patient view should not persist this state to localStorage
    // to avoid performance hits. We disable persistence here.
    renderer.setState(apply, false);

    // Check for Width Mode change
    var nextMode = apply.patientWidth || widthMode;
    if(nextMode !== widthMode){
      widthMode = nextMode;
      size();
    }

    var st = renderer.getState();

    // Handle Running State
    if(!st.running || st.paused){
      stopAudio();
      stopProgrammatic();
      renderer.stop();
      running = false;
      return;
    }

    // Handle Audio
    if(st.audioEnabled){
      if(st.audioMode === 'file'){
        handleFileAudio(st);
      } else {
        stopAudio();
        if(!audioUnlocked) bindUnlock();
        startProgrammatic(st);
      }
    } else {
      stopAudio();
      stopProgrammatic();
    }

    if(!running){
      renderer.start();
      running = true;
    }
  }

  // --- Network ---
  function setupNetwork(){
    var qs = new URLSearchParams(location.search);
    var hashSid = (location.hash || '').replace('#', '');
    var wsSid = qs.get('sid') || hashSid || 'default';
    var wsUrl = qs.get('url') || ('ws://' + (location.hostname || 'localhost') + ':8787');
    var rtcMode = !!qs.get('p2p');

    if(!rtcMode && wsUrl){
      connectWebSocket(wsUrl, wsSid);
    } else if(rtcMode){
      setupWebRTC();
    }
  }

  function connectWebSocket(url, sid){
    try {
      ws = new WebSocket(url);
    } catch(e){ return; }

    ws.onopen = function(){
      try {
        ws.send(JSON.stringify({type:'join', sessionId: sid, role:'patient'}));
        doSendViewport();
      } catch(e){}
    };

    ws.onmessage = function(ev){
      try {
        var msg = JSON.parse(ev.data);
        if(msg && msg.type === 'state'){
          handleStateUpdate(msg.payload || {});
        }
      } catch(e){}
    };

    ws.onclose = function(){ ws = null; };
  }

  function setupWebRTC(){
    var offerStr = prompt('Paste Offer from Admin');
    if(offerStr){
      NetRTC.startAnswerer(offerStr).then(function(answer){
        alert('Show this Answer to Admin to complete connect');
        console.log(answer);
        try {
          if(navigator.clipboard) navigator.clipboard.writeText(answer);
        } catch(_){}
      });

      NetRTC.onMessage(function(msg){
        if(msg && msg.type === 'state'){
          handleStateUpdate(msg.payload || {});
        }
      });

      try { doSendViewport(); } catch(e){}
    }
  }

  // --- Audio Logic ---
  async function handleFileAudio(st){
    if(!audioFolder){
      await ensureFolder();
    }
    if(st.audioName){
      await loadAudioByName(st.audioName);
      playBuffer();
    }
  }

  function bindUnlock(){
    var ov = document.getElementById('overlay');
    if(ov) ov.style.display = 'flex';

    var events = ['pointerdown','keydown','touchstart','mousemove'];

    function unlockOnce(){
      try {
        AudioEngine.ensureCtx();
        audioUnlocked = true;
        AudioEngine.playPing(0);
      } catch(e){}

      if(ov) ov.style.display = 'none';

      if(pendingProgramState){
        var st = pendingProgramState;
        pendingProgramState = null;
        startProgrammatic(st);
      }

      events.forEach(function(ev){
         try{ window.removeEventListener(ev, unlockOnce); } catch(_){}
      });
    }

    events.forEach(function(ev){
      window.addEventListener(ev, unlockOnce, { once:true });
    });
  }

  var progRunning = false;

  function stopProgrammatic(){
    AudioEngine.stopNoise();
    progRunning = false;
  }

  function startProgrammatic(st){
    if(!audioUnlocked){
      pendingProgramState = st;
      bindUnlock();
      return;
    }

    AudioEngine.setVolume(st.volume || 0.6);

    // Clear previous update handlers related to audio
    renderer.setOnUpdate(onRenderUpdate);

    if(st.programPreset === 'pink'){
      if(st.syncPan){
        // We handle panning in onRenderUpdate
        AudioEngine.startPinkNoisePan(Math.max(0.1, st.panRate || 0.5));
      } else {
        AudioEngine.startPinkNoisePan(Math.max(0.1, st.panRate || 0.5));
      }
      progRunning = true;
    } else if(st.programPreset === 'hybrid'){
      AudioEngine.startHybrid(Math.max(0.1, st.cueRate || 1.2));
      progRunning = true;
    } else {
      // Discrete sounds on edges
      renderer.setOnUpdate(function(info){
        onRenderUpdate(info); // Call the base update for visual/panner sync

        var r = renderer.getState().size;
        var hitL = info.x <= r + 0.1;
        var hitR = info.x >= info.w - r - 0.1;
        var hitT = info.y <= r + 0.1;
        var hitB = info.y >= info.h - r - 0.1;

        if(hitL || hitR || hitT || hitB){
          var pan = hitL ? -1 : (hitR ? 1 : 0);
          var pre = st.programPreset;

          if(pre === 'tone'){
            AudioEngine.playTone({
              freq: st.toneFreq || 440,
              durationMs: st.toneDurationMs || 70,
              pan: pan,
              adsr: {
                attackMs: st.adsrAttackMs || 8,
                decayMs: st.adsrDecayMs || 80,
                sustain: st.adsrSustainLevel || 0.3,
                releaseMs: st.adsrReleaseMs || 10
              }
            });
          } else if(pre === 'click'){ AudioEngine.playClick(pan); }
          else if(pre === 'ping'){ AudioEngine.playPing(pan); }
          else if(pre === 'woodblock'){ AudioEngine.playWoodblock(pan); }
          else if(pre === 'bell'){ AudioEngine.playBell(pan); }
          else if(pre === 'bass'){ AudioEngine.playBass(pan); }
          else if(pre === 'kick'){ AudioEngine.playKick(pan); }
          else if(pre === 'snare'){ AudioEngine.playSnare(pan); }
          else if(pre === 'hihat'){ AudioEngine.playHiHat(pan); }
          else if(pre === 'sweep'){ AudioEngine.playSweep(pan); }
          else if(pre === 'zap'){ AudioEngine.playZap(pan); }
          else if(pre === 'bubble'){ AudioEngine.playBubble(pan); }
          else { AudioEngine.playWoodblock(pan); }
        }
      });
      progRunning = true;
    }
  }

  function ensureAudio(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
      gain = audioCtx.createGain();
      if(panner){ panner.connect(gain); }
      gain.connect(audioCtx.destination);
    }
    if(audioCtx.state === 'suspended'){ audioCtx.resume(); }
  }

  async function chooseAudioFolder(){
    ensureAudio();
    if(window.showDirectoryPicker){
      try {
        audioFolder = await window.showDirectoryPicker();
        var st0 = BLS.loadState();
        if(st0.audioEnabled && st0.audioName){
          await loadAudioByName(st0.audioName);
          if(st0.running) playBuffer();
        }
      } catch(e){ return; }
    } else {
      // Fallback for non-Chrome browsers
      var input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.multiple = true;
      input.addEventListener('change', function(){
        var st0 = BLS.loadState();
        var files = Array.from(input.files);
        var match = files.find(function(f){ return f.name === st0.audioName });
        if(match){
          var fr = new FileReader();
          fr.onload = function(){
            audioCtx.decodeAudioData(fr.result).then(function(buf){
              audioBuffer = buf;
              if(st0.running && st0.audioEnabled) playBuffer();
            });
          };
          fr.readAsArrayBuffer(match);
        }
      });
      input.click();
    }
  }

  async function loadAudioByName(name){
    if(!name) return;
    ensureAudio();
    if(!audioFolder) return;
    try {
      let handle = null;
      for await (const [n,h] of audioFolder.entries()){
        if(h.kind === 'file' && n === name){ handle = h; break; }
      }
      if(!handle) return;
      var file = await handle.getFile();
      var buf = await file.arrayBuffer();
      audioBuffer = await audioCtx.decodeAudioData(buf);
    } catch(e){}
  }

  function playBuffer(){
    if(!audioBuffer || !audioCtx) return;
    if(source){
      try{ source.stop(); } catch(e){}
      source.disconnect();
    }
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    var nodeChainStart = source;
    if(panner){ nodeChainStart.connect(panner); } else { nodeChainStart.connect(gain); }
    source.start();
  }

  function stopAudio(){
    if(source){
      try{ source.stop(); } catch(e){}
      source.disconnect();
      source = null;
    }
  }

  async function ensureFolder(){
    if(!audioFolder){
      try{ await chooseAudioFolder(); } catch(e){}
    }
  }

  function onRenderUpdate(info){
    if(panner){
      var pan = (info.x / info.w) * 2 - 1;
      if(pan < -1) pan = -1;
      if(pan > 1) pan = 1;
      try{ panner.pan.value = pan; } catch(e){}
    }
  }

  // --- Bootstrap ---
  function wait(){
    if(window.BLS){
      initPatient();
    } else {
      setTimeout(wait, 50);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wait);
  } else {
    wait();
  }

})();
