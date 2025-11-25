;(function(){
  function hasStereoPanner(ctx){ return !!(ctx && ctx.createStereoPanner) }
  function makePanner(ctx){ 
    if(hasStereoPanner(ctx)) return ctx.createStereoPanner();
    var gainL = ctx.createGain(); var gainR = ctx.createGain(); var merger = ctx.createChannelMerger(2);
    gainL.connect(merger, 0, 0); gainR.connect(merger, 0, 1);
    var node = {
      _ctx: ctx, _l: gainL, _r: gainR, _merger: merger,
      connect: function(dest){ merger.connect(dest) },
      pan: { value: 0 },
      setPan: function(p){ var pan = Math.max(-1, Math.min(1, p||0)); var l = Math.cos((pan+1)*Math.PI/4); var r = Math.sin((pan+1)*Math.PI/4); this._l.gain.setValueAtTime(l, ctx.currentTime); this._r.gain.setValueAtTime(r, ctx.currentTime); this.pan.value = pan }
    }
    return node
  }
  
  var AudioEngine = {
    ctx: null,
    master: null,
    noiseNodes: [],
    panInterval: null,
    
    ensureCtx: function(){ 
      if(!this.ctx){ 
        this.ctx = new (window.AudioContext||window.webkitAudioContext)(); 
        this.master = this.ctx.createGain(); 
        this.master.gain.value = 0.6; 
        this.master.connect(this.ctx.destination) 
      } 
      if(this.ctx.state==='suspended'){ this.ctx.resume() } 
      return this.ctx 
    },
    
    setVolume: function(v){ 
      var ctx = this.ensureCtx(); 
      var val = Math.max(0, Math.min(1, v||0.6)); 
      this.master.gain.setValueAtTime(val, ctx.currentTime) 
    },
    
    // Enhanced original sounds
    playClick: function(pan){ 
      var ctx = this.ensureCtx(); 
      var osc = ctx.createOscillator(); 
      var gain = ctx.createGain(); 
      var filter = ctx.createBiquadFilter();
      var p = makePanner(ctx); 
      if(p.setPan) p.setPan(pan||0); else if(p.pan) p.pan.value = pan||0;
      
      osc.type='square'; 
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime+0.02);
      
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 2;
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime+0.003); 
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.025); 
      
      osc.connect(filter);
      filter.connect(gain); 
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) } 
      p.connect(this.master); 
      osc.start(); 
      osc.stop(ctx.currentTime+0.05) 
    },
    
    playPing: function(pan){ 
      var ctx = this.ensureCtx(); 
      var osc = ctx.createOscillator(); 
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain(); 
      var filter = ctx.createBiquadFilter();
      var p = makePanner(ctx); 
      if(p.setPan) p.setPan(pan||0);
      
      osc.type='sine'; 
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime+0.15);
      
      osc2.type='sine';
      osc2.frequency.setValueAtTime(2400, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime+0.15);
      
      filter.type = 'lowpass';
      filter.frequency.value = 4000;
      filter.Q.value = 1;
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime+0.01); 
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2); 
      
      osc.connect(filter); 
      osc2.connect(filter);
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) } 
      p.connect(this.master); 
      osc.start(); 
      osc2.start();
      osc.stop(ctx.currentTime+0.25);
      osc2.stop(ctx.currentTime+0.25);
    },
    
    playWoodblock: function(pan){ 
      var ctx = this.ensureCtx(); 
      var buffer = ctx.createBuffer(1, 44100, 44100); 
      var data = buffer.getChannelData(0); 
      for(var i=0;i<data.length;i++){ data[i] = (Math.random()*2-1) * Math.exp(-i/800) }
      
      var noise = ctx.createBufferSource(); 
      noise.buffer = buffer; 
      var filter = ctx.createBiquadFilter(); 
      filter.type='bandpass'; 
      filter.frequency.value=1800; 
      filter.Q.value = 8;
      var gain = ctx.createGain(); 
      gain.gain.value=0.6; 
      var p = makePanner(ctx); 
      if(p.setPan) p.setPan(pan||0);
      
      noise.connect(filter).connect(gain); 
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) } 
      p.connect(this.master); 
      noise.start(); 
      noise.stop(ctx.currentTime+0.05) 
    },
    
    // NEW SOUNDS
    playBell: function(pan){
      var ctx = this.ensureCtx();
      var oscs = [1, 2.4, 3.2, 4.8].map(function(ratio){
        var osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 440 * ratio;
        return osc;
      });
      
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 4000;
      
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.8);
      
      oscs.forEach(function(osc){
        osc.connect(filter);
        osc.start();
        osc.stop(ctx.currentTime+1);
      });
      
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
    },
    
    playBass: function(pan){
      var ctx = this.ensureCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime+0.15);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime+0.15);
      filter.Q.value = 3;
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2);
      
      osc.connect(filter);
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime+0.25);
    },
    
    playKick: function(pan){
      var ctx = this.ensureCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime+0.15);
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime+0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2);
      
      osc.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime+0.25);
    },
    
    playSnare: function(pan){
      var ctx = this.ensureCtx();
      var buffer = ctx.createBuffer(1, 44100*0.2, 44100);
      var data = buffer.getChannelData(0);
      for(var i=0;i<data.length;i++){ 
        data[i] = (Math.random()*2-1) * Math.exp(-i/2000);
      }
      
      var noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      var osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      
      var noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 2000;
      
      var gain = ctx.createGain();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime+0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.12);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(gain);
      osc.connect(gain);
      
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      
      noise.start();
      osc.start();
      noise.stop(ctx.currentTime+0.15);
      osc.stop(ctx.currentTime+0.15);
    },
    
    playHiHat: function(pan){
      var ctx = this.ensureCtx();
      var buffer = ctx.createBuffer(1, 44100*0.05, 44100);
      var data = buffer.getChannelData(0);
      for(var i=0;i<data.length;i++){ 
        data[i] = (Math.random()*2-1) * Math.exp(-i/500);
      }
      
      var noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      var filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      filter.Q.value = 1;
      
      var gain = ctx.createGain();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.05);
      
      noise.connect(filter);
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      
      noise.start();
      noise.stop(ctx.currentTime+0.06);
    },
    
    playSweep: function(pan){
      var ctx = this.ensureCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime+0.4);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime+0.4);
      filter.Q.value = 5;
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.5);
      
      osc.connect(filter);
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime+0.55);
    },
    
    playZap: function(pan){
      var ctx = this.ensureCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime+0.08);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime+0.08);
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime+0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.1);
      
      osc.connect(filter);
      filter.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime+0.12);
    },
    
    playBubble: function(pan){
      var ctx = this.ensureCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(pan||0);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime+0.05);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime+0.1);
      
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.15);
      
      osc.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime+0.2);
    },
    
    // Noise functions
    createWhiteNoise: function(){ 
      var ctx = this.ensureCtx(); 
      var bufferSize = 2*ctx.sampleRate; 
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate); 
      var data = buffer.getChannelData(0); 
      for(var i=0;i<bufferSize;i++){ data[i] = Math.random()*2-1 } 
      var noise = ctx.createBufferSource(); 
      noise.buffer = buffer; 
      noise.loop = true; 
      return noise 
    },
    
    createPinkNoise: function(){ 
      var ctx = this.ensureCtx(); 
      var node = ctx.createScriptProcessor(4096,1,1); 
      var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; 
      node.onaudioprocess=function(e){ 
        var out=e.outputBuffer.getChannelData(0); 
        for(var i=0;i<out.length;i++){ 
          var white=Math.random()*2-1; 
          b0=0.99886*b0+white*0.0555179; 
          b1=0.99332*b1+white*0.0750759; 
          b2=0.969*b2+white*0.153852; 
          b3=0.8665*b3+white*0.3104856; 
          b4=0.55*b4+white*0.5329522; 
          b5=-0.7616*b5-white*0.016898; 
          out[i]=(b0+b1+b2+b3+b4+b5+b6+white*0.5362)*0.1; 
          b6=white*0.115926 
        } 
      }; 
      return node 
    },
    
    startPinkNoisePan: function(speedHz){ 
      this.stopNoise(); 
      var ctx=this.ensureCtx(); 
      var noise=this.createPinkNoise(); 
      var p=makePanner(ctx); 
      noise.connect(p._l? p._l : p); 
      if(p._r) noise.connect(p._r); 
      p.connect(this.master); 
      if(noise.start) noise.start(); 
      this.noiseNodes.push(noise); 
      var rate=speedHz||0.5; 
      var start=ctx.currentTime; 
      var self=this; 
      this.panInterval=setInterval(function(){ 
        var t=ctx.currentTime-start; 
        var pan=Math.sin(2*Math.PI*rate*t); 
        if(p.setPan) p.setPan(pan); 
        else if(p.pan) p.pan.value = pan 
      },20) 
    },
    
    startHybrid: function(speedHz){ 
      this.stopNoise(); 
      var ctx=this.ensureCtx(); 
      var noise=this.createPinkNoise(); 
      var p=makePanner(ctx); 
      noise.connect(p._l? p._l : p); 
      if(p._r) noise.connect(p._r); 
      p.connect(this.master); 
      if(noise.start) noise.start(); 
      this.noiseNodes.push(noise); 
      var rate=speedHz||1.2; 
      var left=true; 
      var self=this; 
      this.panInterval=setInterval(function(){ 
        var pan=left? -1:1; 
        if(p.setPan) p.setPan(pan); 
        else if(p.pan) p.pan.value=pan; 
        self.playWoodblock(pan); 
        left=!left 
      }, (1000/Math.max(0.1,rate))) 
    },
    
    stopNoise: function(){ 
      try{ clearInterval(this.panInterval) }catch(e){} 
      this.panInterval=null; 
      this.noiseNodes.forEach(function(n){ try{ n.disconnect() }catch(e){} }); 
      this.noiseNodes=[] 
    },
    playTone: function(opts){
      var ctx = this.ensureCtx();
      if(!this.master){ try{ this.master = ctx.createGain(); this.master.connect(ctx.destination) }catch(e){} }
      var freq = (opts && opts.freq) || 440;
      var durationMs = (opts && opts.durationMs) || 70;
      var panVal = (opts && typeof opts.pan==='number') ? opts.pan : 0;
      var adsr = (opts && opts.adsr) || { attackMs:8, decayMs:80, sustain:0.3, releaseMs:10 };
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      var p = makePanner(ctx);
      if(p.setPan) p.setPan(panVal); else if(p.pan) p.pan.value = panVal;
      osc.connect(gain);
      if(p._l){ gain.connect(p._l); gain.connect(p._r) } else { gain.connect(p) }
      p.connect(this.master);
      var now = ctx.currentTime;
      var a = Math.max(0.001, (adsr.attackMs||8)/1000);
      var d = Math.max(0.001, (adsr.decayMs||80)/1000);
      var s = Math.max(0, Math.min(1, (adsr.sustain!=null? adsr.sustain:0.3)));
      var r = Math.max(0.001, (adsr.releaseMs||10)/1000);
      var dur = Math.max(0.005, (durationMs||70)/1000);
      gain.gain.linearRampToValueAtTime(1.0, now + a);
      gain.gain.linearRampToValueAtTime(s, now + a + d);
      gain.gain.setValueAtTime(s, now + dur);
      gain.gain.linearRampToValueAtTime(0.0001, now + dur + r);
      osc.start(now);
      osc.stop(now + dur + r + 0.01);
    }
  }
  
  window.AudioEngine = AudioEngine
})();
