function initAdmin(){
  var previewCanvas = document.getElementById('previewCanvas');
  var renderer = BLS.Renderer(previewCanvas);
  var chan = BLS.createChannel('bls-session');
  var state = BLS.loadState();
  renderer.setState(state);
  window.AdminRenderer = renderer;
  var shapeControls = document.getElementById('shapeControls');
  var directionControls = document.getElementById('directionControls');
  var easingControls = document.getElementById('easingControls');
  var widthControls = document.getElementById('widthControls');
  var shapeSwatches = document.getElementById('shapeSwatches');
  var bgSwatches = document.getElementById('bgSwatches');
  var shapeCustom = document.getElementById('shapeCustom');
  var bgCustom = document.getElementById('bgCustom');
  var hiddenShapePicker = document.createElement('input'); hiddenShapePicker.type='color'; hiddenShapePicker.style.display='none'; document.body.appendChild(hiddenShapePicker);
  var hiddenBgPicker = document.createElement('input'); hiddenBgPicker.type='color'; hiddenBgPicker.style.display='none'; document.body.appendChild(hiddenBgPicker);
  var speed = document.getElementById('speed');
  var speedDown = document.getElementById('speedDown');
  var speedUp = document.getElementById('speedUp');
  var speedLabel = document.getElementById('speedLabel');
  var size = document.getElementById('size');
  var sizeLabel = document.getElementById('sizeLabel');
  var yPercent = document.getElementById('yPercent');
  var yPercentLabel = document.getElementById('yPercentLabel');
  var yReset = document.getElementById('yReset');
  var yOscillateEnable = document.getElementById('yOscillateEnable');
  var yOscTick = null;
  var glowEnable = document.getElementById('glowEnable');
  var glowIntensity = document.getElementById('glowIntensity');
  var glowIntensityLabel = document.getElementById('glowIntensityLabel');
  var glowRate = document.getElementById('glowRate');
  var glowRateLabel = document.getElementById('glowRateLabel');
  var rampEnable = document.getElementById('rampEnable');
  var rampSeconds = document.getElementById('rampSeconds');
  var rampLabel = document.getElementById('rampLabel');
  var edgePause = document.getElementById('edgePause');
  var edgePauseLabel = document.getElementById('edgePauseLabel');
  var wiggleEnable = document.getElementById('wiggleEnable');
  var wiggleAmplitude = document.getElementById('wiggleAmplitude');
  var wiggleLabel = document.getElementById('wiggleLabel');
  var presetName = document.getElementById('presetName');
  var presetList = document.getElementById('presetList');
  var savePresetBtn = document.getElementById('savePreset');
  var applyPresetBtn = document.getElementById('applyPreset');
  var deletePresetBtn = document.getElementById('deletePreset');
  var exportPresetsBtn = document.getElementById('exportPresets');
  var importPresetsBtn = document.getElementById('importPresets');
var timerMinutes = document.getElementById('timerMinutes');
var timerDisplay = document.getElementById('timerDisplay');
var statusText = document.getElementById('statusText');
var elapsedText = document.getElementById('elapsedText');
var startBtn = document.getElementById('startSession');
var endBtn = document.getElementById('endSession');
  var openPatient = document.getElementById('openPatient');
  var loadAudioBtn = document.getElementById('loadAudioBtn');
  var audioModeButtons = document.getElementById('audioModeButtons');
  var audioEnable = document.getElementById('audioEnable');
  var programControls = document.getElementById('programmaticControls');
  var soundToneToggle = document.getElementById('soundToneToggle');
  var soundPresetControls = document.getElementById('soundPresetControls');
  var soundPreset = document.getElementById('soundPreset');
  var tonePresetControls = document.getElementById('tonePresetControls');
  var tonePreset = document.getElementById('tonePreset');
  var toneFreq = document.getElementById('toneFreq');
  var toneDuration = document.getElementById('toneDuration');
  var toneDurationLabel = document.getElementById('toneDurationLabel');
  var adsrAttack = document.getElementById('adsrAttack');
  var adsrDecay = document.getElementById('adsrDecay');
  var adsrSustain = document.getElementById('adsrSustain');
  var adsrRelease = document.getElementById('adsrRelease');
  var toneFreqRow = document.getElementById('toneFreqRow');
  var toneDurRow = document.getElementById('toneDurRow');
  var adsrField = document.getElementById('adsrField');
  var syncPan = document.getElementById('syncPan');
  var panRate = document.getElementById('panRate');
  var panRateLabel = document.getElementById('panRateLabel');
  var cueRate = document.getElementById('cueRate');
  var cueRateLabel = document.getElementById('cueRateLabel');
  var volume = document.getElementById('volume');
  var volumeLabel = document.getElementById('volumeLabel');
  var testSound = document.getElementById('testSound');
  var connectHID = document.getElementById('connectHID');
  var deviceStatus = document.getElementById('deviceStatus');
  var knobSens = document.getElementById('knobSens');
  var knobSensLabel = document.getElementById('knobSensLabel');
  var hidDevice = null;
  var audioFiles = [];
  var patientName = document.getElementById('patientName');
  var savePatientBtn = document.getElementById('savePatient');
  var sessionCountEl = document.getElementById('sessionCount');
  var lastSessionInfoEl = document.getElementById('lastSessionInfo');
  var clearSessionsBtn = document.getElementById('clearSessions');
  var deletePatientBtn = document.getElementById('deletePatient');
  var sessionSelect = document.getElementById('sessionSelect');
  var loadSessionBtn = document.getElementById('loadSession');
  var sessionNotesEl = document.getElementById('sessionNotes');
  var saveSessionNotesBtn = document.getElementById('saveSessionNotes');
  var deleteSessionSingleBtn = document.getElementById('deleteSession');
function setActive(group, dataKey, stateKey){
  var btns = group.querySelectorAll('button');
  for(var i=0;i<btns.length;i++){
    var b = btns[i];
    var isActive = (b.dataset[dataKey] === state[stateKey]);
    if(isActive){ b.classList.add('active') } else { b.classList.remove('active') }
  }
}
function updateTimerLabel(){ var m = Math.max(0, parseInt(timerMinutes.value||'0',10)); timerDisplay.textContent = String(m).padStart(2,'0')+':00'; }
  function updateSpeedLabel(){ speedLabel.textContent = speed.value+' px/s'; }
  function updateSizeLabel(){ var v = parseFloat(size.value||'0'); sizeLabel.textContent = v.toFixed(1)+' px'; }
  function updateGlowIntensityLabel(){ glowIntensityLabel.textContent = glowIntensity.value+'%'; }
  function updateGlowRateLabel(){ glowRateLabel.textContent = parseFloat(glowRate.value).toFixed(1)+' Hz'; }
  function updateYPercentLabel(){ yPercentLabel.textContent = yPercent.value+'%'; }
  function updateRampLabel(){ rampLabel.textContent = rampSeconds.value+' s'; }
  function updateEdgePauseLabel(){ edgePauseLabel.textContent = edgePause.value+' ms'; }
  function updateWiggleLabel(){ wiggleLabel.textContent = wiggleAmplitude.value+' px'; }
  function updatePanRateLabel(){ panRateLabel.textContent = parseFloat(panRate.value).toFixed(1)+' Hz' }
  function updateCueRateLabel(){ cueRateLabel.textContent = parseFloat(cueRate.value).toFixed(1)+' Hz' }
  function updateVolumeLabel(){ volumeLabel.textContent = volume.value+'%' }
  function setProgramMode(){ if(programControls) programControls.style.display = 'flex'; applyState({audioMode: 'programmatic'}, true) }
  function updateKnobSensLabel(){ knobSensLabel.textContent = 'x'+knobSens.value }
  function refreshPatientList(){ var m = loadPatients(); var names = Object.keys(m).sort(); var html = names.map(function(n){ return '<option value="'+n+'">'+n+'</option>' }).join(''); var sel = document.getElementById('patientList'); if(sel){ sel.innerHTML = html }
  }
  function loadPatients(){ try{ var m = JSON.parse(localStorage.getItem('bls_patients')||'null'); return m&&typeof m==='object'? m : {} }catch(e){ return {} } }
  function savePatients(m){ try{ localStorage.setItem('bls_patients', JSON.stringify(m)) }catch(e){} }
  function getPatient(name){ var n = (name||'').trim()||'Unnamed'; var m = loadPatients(); if(!m[n]) m[n] = { name:n, sessions:[], count:0, last:null }; return m[n] }
  function setPatient(p){ var m = loadPatients(); m[p.name] = p; savePatients(m) }
  function deletePatient(name){ var n = (name||'').trim()||'Unnamed'; var m = loadPatients(); if(m[n]){ delete m[n]; savePatients(m) } }
function refreshPatientUI(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); sessionCountEl.textContent = String(p.count||0); if(p.last){ var d = new Date(p.last.end); var dur = Math.round((p.last.durationSec||0)); lastSessionInfoEl.textContent = d.toLocaleString()+' • '+dur+'s' } else { lastSessionInfoEl.textContent = '—' } var host = document.getElementById('sessionHistory'); if(host){ if(!p.sessions || !p.sessions.length){ host.innerHTML = '<em>No sessions yet</em>' } else { var rows = p.sessions.slice().sort(function(a,b){ return a.start - b.start }).map(function(s, idx){ var start = new Date(s.start).toLocaleString(); var end = new Date(s.end).toLocaleString(); var dur = Math.round(s.durationSec||0); return '<div>'+String(idx+1)+'. '+start+' → '+end+' • '+dur+'s</div>' }); host.innerHTML = rows.join('') } } if(sessionSelect){ var opts = (!p.sessions || !p.sessions.length)? [] : p.sessions.slice().sort(function(a,b){ return a.start - b.start }).map(function(s, idx){ var start = new Date(s.start).toLocaleString(); return { i: idx, label: String(idx+1)+'. '+start } }); var html = opts.map(function(o){ return '<option value="'+o.i+'">'+o.label+'</option>' }).join(''); sessionSelect.innerHTML = html; if(opts.length){ sessionSelect.value = String(opts[opts.length-1].i); var s = p.sessions[opts[opts.length-1].i]; if(sessionNotesEl){ sessionNotesEl.value = s.notes||'' } } else { if(sessionNotesEl){ sessionNotesEl.value = '' } } } }
function recordSession(){ var n = (patientName.value||'').trim()||'Unnamed'; var st = BLS.loadState(); if(!st.startedAt) return; var end = Date.now(); var durationSec = Math.floor((end - st.startedAt)/1000); var p = getPatient(n); p.sessions.push({ start: st.startedAt, end: end, durationSec: durationSec, notes: '' }); p.count = (p.count||0)+1; p.last = { start: st.startedAt, end: end, durationSec: durationSec, notes: '' }; setPatient(p); refreshPatientUI() }
  function refreshPresetList(){ var names = BLS.listPresets(); var html=''; for(var i=0;i<names.length;i++){ var n=names[i]; html += '<option value="'+n+'">'+n+'</option>' } presetList.innerHTML = html }
  function applyState(next, broadcast){
    var prevRunning = state && !!state.running;
    state = BLS.mergeState(state, next||{});
    renderer.setState(state);
    if(prevRunning !== !!state.running){ if(state.running){ renderer.start() } else { renderer.stop() } }
    if(broadcast){ chan.send(state) }
    try{ if(window.Recorder && Recorder.running){ Recorder.recordState(BLS.loadState()) } }catch(_){ }
    publishState()
  }
  function cycle(arr, cur){ var i = arr.indexOf(cur); return arr[(i+1) % arr.length] }
  var shapeOrder = ['circle','square','triangle'];
  var dirOrder = ['lr','ud','diag_down','diag_up'];
  var easeOrder = ['linear','ease'];
  var progOrder = ['pink','hybrid','tone','click','ping','woodblock','bell','bass','kick','snare','hihat','sweep','zap','bubble'];
  function labelForDirection(d){ return d==='lr'? 'Left ↔ Right' : d==='ud'? 'Up ↕ Down' : d==='diag_down'? 'Diagonal ↘︎' : 'Diagonal ↗︎' }
  function labelForEasing(e){ return e==='ease'? 'Ease In-Out' : 'Linear' }
  function labelForProgram(p){ var map={pink:'Pink Noise', hybrid:'Hybrid', tone:'Tone', click:'Click', ping:'Ping', woodblock:'Woodblock', bell:'Bell', bass:'Bass', kick:'Kick', snare:'Snare', hihat:'Hi-Hat', sweep:'Sweep', zap:'Zap', bubble:'Bubble'}; return map[p]||p }
  function applyStateLocal(next){
    state = BLS.mergeState(state, next||{});
    renderer.setState(state);
    if(speed){ speed.value = String(parseInt(state.speed||parseInt(speed.value,10)||250, 10)) }
    if(size){ size.value = String(state.size||parseFloat(size.value)||80) }
    if(glowEnable){ glowEnable.checked = !!state.glowEnabled }
    if(glowIntensity){ glowIntensity.value = String(Math.round((state.glowIntensity||1)*100)) }
    if(glowRate){ glowRate.value = String(state.glowRate||parseFloat(glowRate.value)||0.5) }
    if(yPercent){ yPercent.value = String(state.yPercent||parseInt(yPercent.value,10)||50) }
    if(audioEnable){ audioEnable.checked = !!state.audioEnabled }
    (function(){ var progEl = document.getElementById('programPreset'); if(progEl){ progEl.value = state.programPreset || progEl.value || 'pink' } })()
    if(toneFreq){ toneFreq.value = String(state.toneFreq||parseInt(toneFreq.value,10)||440) }
    if(toneDuration){ toneDuration.value = String(state.toneDurationMs||parseInt(toneDuration.value,10)||70) }
    if(adsrAttack){ adsrAttack.value = String(state.adsrAttackMs||parseInt(adsrAttack.value,10)||8) }
    if(adsrDecay){ adsrDecay.value = String(state.adsrDecayMs||parseInt(adsrDecay.value,10)||80) }
    if(adsrSustain){ adsrSustain.value = String(state.adsrSustainLevel||parseFloat(adsrSustain.value)||0.3) }
    if(adsrRelease){ adsrRelease.value = String(state.adsrReleaseMs||parseInt(adsrRelease.value,10)||10) }
    updateSpeedLabel(); updateSizeLabel(); updateGlowIntensityLabel(); updateGlowRateLabel(); updateYPercentLabel(); updateRampLabel(); updateEdgePauseLabel(); updateWiggleLabel(); updatePanRateLabel(); updateCueRateLabel(); updateVolumeLabel();
    try{ if(typeof refreshToneVisibility==='function'){ refreshToneVisibility() } else { var on = (state.programPreset==='tone'); var tp = document.getElementById('tonePresetControls'); if(tp) tp.style.display = on? 'flex':'none'; var fr = document.getElementById('toneFreqRow'); if(fr) fr.style.display = on? 'flex':'none'; var dr = document.getElementById('toneDurRow'); if(dr) dr.style.display = on? 'flex':'none'; var af = document.getElementById('adsrField'); if(af) af.style.display = on? 'flex':'none' } }catch(_){ }
    if(state.running){
      var pausedExtra = (state.paused && state.pausedAt)? (Date.now() - state.pausedAt) : 0;
      var elapsed = Math.max(0, Math.floor((Date.now() - (state.startedAt||Date.now()) - (state.pausedMs||0) - pausedExtra)/1000));
      var remaining = Math.max(0, Math.floor((state.durationSec||0) - elapsed));
      if(state.paused){ renderer.stop() } else { renderer.start() }
      if(statusText){ statusText.textContent = state.paused? 'Paused' : 'Replaying' }
      var em = Math.floor(elapsed/60), es = elapsed%60;
      var rm = Math.floor(remaining/60), rs = remaining%60;
      elapsedText.textContent = String(em).padStart(2,'0')+':'+String(es).padStart(2,'0');
      timerDisplay.textContent = String(rm).padStart(2,'0')+':'+String(rs).padStart(2,'0');
    } else {
      renderer.stop();
      if(statusText){ statusText.textContent = 'Idle' }
    }
  }
  window.applyStateLocal = applyStateLocal
  function publishState(){ try{ if(!patientSyncOn) return; if(wsConnected && ws){ ws.send(JSON.stringify({type:'state', sessionId: wsSid||'default', payload: BLS.loadState()})) } }catch(e){} }
  chan.on(function(payload){ if(!payload || typeof payload!=='object') return; if(payload.type==='patientViewport'){ var pv = payload.payload||{}; try{ window.PatientViewport = pv }catch(_){ } var r = window.AdminRenderer; if(r){ r.resize(parseInt(pv.canvasW||640,10), parseInt(pv.canvasH||360,10)) } var pvLabel = document.getElementById('patientViewportLabel'); if(pvLabel){ pvLabel.textContent = (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } var info = document.getElementById('patientViewportInfo'); if(info){ info.textContent = 'Patient viewport: ' + (pv.winW||'?')+'×'+(pv.winH||'?') + ' • canvas ' + (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } } })
  if(shapeControls){ shapeControls.addEventListener('click', function(e){ var d = e.target && e.target.dataset && e.target.dataset.shape; if(!d) return; applyState({shape: d}, true); setActive(shapeControls,'shape','shape') }) }
  if(directionControls){ directionControls.addEventListener('click', function(e){ var d = e.target && e.target.dataset && e.target.dataset.direction; if(!d) return; applyState({direction: d}, true); setActive(directionControls,'direction','direction') }) }
  if(easingControls){ easingControls.addEventListener('click', function(e){ var d = e.target && e.target.dataset && e.target.dataset.easing; if(!d) return; applyState({easingMode: d}, true); setActive(easingControls,'easing','easingMode') }) }
  if(widthControls){ widthControls.addEventListener('click', function(e){ var w = e.target && e.target.dataset && e.target.dataset.width; if(!w) return; applyState({patientWidth: w}, true); var btns = widthControls.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b=btns[i]; b.classList.toggle('active', b.dataset.width===w) } }) }
  
  function setCustomColor(key, val){ try{ localStorage.setItem(key, val) }catch(_){ } }
  function getCustomColor(key, def){ try{ var v = localStorage.getItem(key); return v||def }catch(_){ return def } }
  if(shapeSwatches){ shapeSwatches.addEventListener('click', function(e){ var b = e.target; var c = b.dataset && b.dataset.color; if(!c && b.id==='shapeCustom'){ hiddenShapePicker.value = getCustomColor('bls_shape_custom', '#ffffff'); hiddenShapePicker.click(); hiddenShapePicker.oninput = function(){ var v = hiddenShapePicker.value; setCustomColor('bls_shape_custom', v); applyState({shapeColor: v}, true) }; return } if(!c) return; applyState({shapeColor: c}, true) }) }
  if(bgSwatches){ bgSwatches.addEventListener('click', function(e){ var b = e.target; var c = b.dataset && b.dataset.color; if(!c && b.id==='bgCustom'){ hiddenBgPicker.value = getCustomColor('bls_bg_custom', '#000000'); hiddenBgPicker.click(); hiddenBgPicker.oninput = function(){ var v = hiddenBgPicker.value; setCustomColor('bls_bg_custom', v); applyState({bgColor: v}, true) }; return } if(!c) return; applyState({bgColor: c}, true) }) }
  speed.addEventListener('input', function(){ updateSpeedLabel(); applyState({speed:parseFloat(speed.value)}, true); });
  size.addEventListener('input', function(){ updateSizeLabel(); applyState({size:parseFloat(size.value)}, true); });
  yPercent.addEventListener('input', function(){ updateYPercentLabel(); applyState({yPercent:parseInt(yPercent.value,10)}, true); });
  yReset.addEventListener('click', function(){ yPercent.value=50; updateYPercentLabel(); applyState({yPercent:50}, true); });
  function startYOsc(){ if(yOscTick) clearInterval(yOscTick); var startT = Date.now(); yOscTick = setInterval(function(){ var st = BLS.loadState(); if(!st.running || !st.yOscillateEnabled){ return } var t = (Date.now() - startT)/1000; var fy = st.yOscillateRate || 0.5; var p = 50 + 50*Math.sin(2*Math.PI*fy*t); applyState({ yPercent: Math.round(Math.max(0, Math.min(100, p))) }, true) }, 50) }
  if(yOscillateEnable){ yOscillateEnable.addEventListener('change', function(){ var on = !!yOscillateEnable.checked; applyState({ yOscillateEnabled: on }, true); if(on){ startYOsc() } else { if(yOscTick){ clearInterval(yOscTick); yOscTick=null } } }) }
  glowEnable.addEventListener('change', function(){ applyState({glowEnabled: glowEnable.checked}, true); });
  glowIntensity.addEventListener('input', function(){ updateGlowIntensityLabel(); var f = parseInt(glowIntensity.value,10)/100; applyState({glowIntensity:f}, true); });
  glowRate.addEventListener('input', function(){ updateGlowRateLabel(); applyState({glowRate: parseFloat(glowRate.value)}, true); });
  rampEnable.addEventListener('change', function(){ var st = BLS.loadState(); var next = {rampEnabled: rampEnable.checked}; if(!rampEnable.checked){ next.easingMode = 'linear' } if(st.running && rampEnable.checked){ next.startedAt = Date.now() } applyState(next, true); });
  rampSeconds.addEventListener('input', function(){ updateRampLabel(); var st = BLS.loadState(); var next = {rampSeconds: parseInt(rampSeconds.value,10)}; if(st.running && st.rampEnabled){ next.startedAt = Date.now() } applyState(next, true); });
  edgePause.addEventListener('input', function(){ updateEdgePauseLabel(); applyState({edgePauseMs: parseInt(edgePause.value,10)}, true); });
  wiggleEnable.addEventListener('change', function(){ applyState({wiggleEnabled: wiggleEnable.checked}, true); });
  wiggleAmplitude.addEventListener('input', function(){ updateWiggleLabel(); applyState({wiggleAmplitude: parseInt(wiggleAmplitude.value,10)}, true); });
  timerMinutes.addEventListener('input', function(){ updateTimerLabel(); });
  savePresetBtn.addEventListener('click', function(){ var n = (presetName.value||'').trim(); if(!n) return; BLS.savePreset(n, BLS.loadState()); refreshPresetList() })
  applyPresetBtn.addEventListener('click', function(){ var n = presetList.value; if(!n) return; var preset = BLS.loadPreset(n); if(!preset) return; var base = (BLS && BLS.defaultState) ? BLS.defaultState : {}; var full = Object.assign({}, base, preset); applyState(full, true) })
  deletePresetBtn.addEventListener('click', function(){ var n = presetList.value; if(!n) return; if(!confirm('Delete preset "'+n+'"?')) return; BLS.deletePreset(n); refreshPresetList() })
  exportPresetsBtn.addEventListener('click', async function(){ var data = BLS.exportPresets(); if(window.showSaveFilePicker){ try{ var handle = await window.showSaveFilePicker({ suggestedName: 'bls-presets.json', types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); var w = await handle.createWritable(); await w.write(data); await w.close() }catch(e){} } else { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type:'application/json'})); a.download = 'bls-presets.json'; a.click(); URL.revokeObjectURL(a.href) } })
  importPresetsBtn.addEventListener('click', async function(){ if(window.showOpenFilePicker){ try{ var files = await window.showOpenFilePicker({ multiple:false, types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); if(files && files.length){ var file = await files[0].getFile(); var text = await file.text(); BLS.importPresets(text); refreshPresetList() } }catch(e){} } else { var input = document.createElement('input'); input.type='file'; input.accept='.json,application/json'; input.addEventListener('change', function(){ var f = input.files && input.files[0]; if(!f) return; var reader = new FileReader(); reader.onload = function(){ BLS.importPresets(reader.result); refreshPresetList() }; reader.readAsText(f) }); input.click() } })
  async function pickAudioFile(){ if(window.showOpenFilePicker){ try{ var files = await window.showOpenFilePicker({ multiple:false, types:[{ description:'Audio', accept:{ 'audio/*':['.mp3','.wav'] } }] }); if(files && files.length){ var file = await files[0].getFile(); audioFiles = [{name:file.name, file:file}]; applyState({ audioName: file.name, audioMode: 'file' }, true); if(audioModeButtons){ var btns = audioModeButtons.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b=btns[i]; b.classList.toggle('active', b.id==='loadAudioBtn') } } } }catch(_){ } } else { var input = document.createElement('input'); input.type='file'; input.accept='.mp3,.wav,audio/*'; input.addEventListener('change', function(){ var f = input.files && input.files[0]; if(!f) return; audioFiles = [{name:f.name, file:f}]; applyState({ audioName: f.name, audioMode: 'file' }, true); if(audioModeButtons){ var btns = audioModeButtons.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b=btns[i]; b.classList.toggle('active', b.id==='loadAudioBtn') } } }); input.click(); }
  }
  if(loadAudioBtn){ loadAudioBtn.addEventListener('click', function(){ pickAudioFile(); }) }
  if(audioModeButtons){ audioModeButtons.addEventListener('click', function(e){ var m = e.target && e.target.dataset && e.target.dataset.mode; if(!m) return; if(m==='programmatic'){ setProgramMode(); var btns = audioModeButtons.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b=btns[i]; var mode=b.dataset.mode; b.classList.toggle('active', mode==='programmatic') } } }) }
  audioEnable.addEventListener('change', function(){ applyState({audioEnabled: audioEnable.checked}, true) });
  function refreshProgramMode(){ var st = BLS.loadState(); var toneOn = (st.programPreset==='tone'); if(tonePresetControls) tonePresetControls.style.display = toneOn? 'flex':'none'; if(toneFreqRow) toneFreqRow.style.display = toneOn? 'flex':'none'; if(toneDurRow) toneDurRow.style.display = toneOn? 'flex':'none'; if(adsrField) adsrField.style.display = toneOn? 'block':'none'; if(soundPresetControls) soundPresetControls.style.display = toneOn? 'none':'flex'; if(soundToneToggle){ var btns = soundToneToggle.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b=btns[i]; var m=b.dataset.mode; b.classList.toggle('active', (toneOn? m==='tone' : m==='sound')) } } }
  if(soundToneToggle){ soundToneToggle.addEventListener('click', function(e){ var m = e.target && e.target.dataset && e.target.dataset.mode; if(!m) return; if(m==='tone'){ applyState({programPreset:'tone'}, true) } else { var val = (soundPreset && soundPreset.value) || 'pink'; applyState({programPreset: val}, true) } refreshProgramMode(); }) }
  if(soundPreset){ soundPreset.addEventListener('change', function(){ var val = soundPreset.value||'pink'; applyState({programPreset: val}, true); refreshProgramMode(); }) }
  var tonePresetMap = {
    warm_low: { freq:180, dur:100 },
    soft_pulse: { freq:220, dur:90 },
    neutral_pulse: { freq:280, dur:90 },
    bright_pulse: { freq:330, dur:80 },
    soft_tick: { freq:440, dur:70 },
    medium_tick: { freq:520, dur:60 },
    clear_click: { freq:660, dur:40 },
    bright_ping: { freq:880, dur:50 },
    light_ping: { freq:1000, dur:50 },
    sharp_cue: { freq:1200, dur:30 },
    accent: { freq:1500, dur:30 },
    spark: { freq:1800, dur:30 },
    crisp: { freq:2000, dur:30 }
  };
  if(tonePreset){ tonePreset.addEventListener('change', function(){ var key = tonePreset.value; var p = tonePresetMap[key] || tonePresetMap.soft_pulse; toneFreq.value = String(p.freq); toneDuration.value = String(p.dur); toneDurationLabel.textContent = p.dur+' ms'; applyState({ toneFreq: p.freq, toneDurationMs: p.dur, programPreset: 'tone' }, true); refreshProgramMode(); }) }
  function updateToneDuration(){ toneDurationLabel.textContent = toneDuration.value+' ms' }
  function toneSelected(){ return (BLS.loadState().programPreset==='tone') }
  if(toneFreq){ toneFreq.addEventListener('input', function(){ if(!toneSelected()) return; applyState({ toneFreq: parseInt(toneFreq.value,10)||440 }, true); }) }
  if(toneDuration){ toneDuration.addEventListener('input', function(){ if(!toneSelected()) return; updateToneDuration(); applyState({ toneDurationMs: parseInt(toneDuration.value,10)||70 }, true); }) }
  if(adsrAttack){ adsrAttack.addEventListener('input', function(){ if(!toneSelected()) return; applyState({ adsrAttackMs: parseInt(adsrAttack.value,10)||8 }, true); }) }
  if(adsrDecay){ adsrDecay.addEventListener('input', function(){ if(!toneSelected()) return; applyState({ adsrDecayMs: parseInt(adsrDecay.value,10)||80 }, true); }) }
  if(adsrSustain){ adsrSustain.addEventListener('input', function(){ if(!toneSelected()) return; applyState({ adsrSustainLevel: parseFloat(adsrSustain.value)||0.3 }, true); }) }
  if(adsrRelease){ adsrRelease.addEventListener('input', function(){ if(!toneSelected()) return; applyState({ adsrReleaseMs: parseInt(adsrRelease.value,10)||10 }, true); }) }
  syncPan.addEventListener('change', function(){ applyState({syncPan: syncPan.checked}, true); });
  panRate.addEventListener('input', function(){ updatePanRateLabel(); applyState({panRate: parseFloat(panRate.value)}, true); });
  cueRate.addEventListener('input', function(){ updateCueRateLabel(); applyState({cueRate: parseFloat(cueRate.value)}, true); });
  volume.addEventListener('input', function(){ updateVolumeLabel(); applyState({volume: parseInt(volume.value,10)/100}, true); });
  testSound.addEventListener('click', function(){ try{ var st = BLS.loadState(); if(st.audioMode==='programmatic'){ AudioEngine.setVolume(st.volume||0.6); var pan = 0; if(st.programPreset==='tone'){ AudioEngine.playTone({ freq: st.toneFreq||440, durationMs: st.toneDurationMs||70, pan: pan, adsr:{ attackMs: st.adsrAttackMs||8, decayMs: st.adsrDecayMs||80, sustain: st.adsrSustainLevel||0.3, releaseMs: st.adsrReleaseMs||10 } }) } else if(st.programPreset==='click'){ AudioEngine.playClick(pan) } else if(st.programPreset==='ping'){ AudioEngine.playPing(pan) } else if(st.programPreset==='woodblock'){ AudioEngine.playWoodblock(pan) } else if(st.programPreset==='bell'){ AudioEngine.playBell(pan) } else if(st.programPreset==='bass'){ AudioEngine.playBass(pan) } else if(st.programPreset==='kick'){ AudioEngine.playKick(pan) } else if(st.programPreset==='snare'){ AudioEngine.playSnare(pan) } else if(st.programPreset==='hihat'){ AudioEngine.playHiHat(pan) } else if(st.programPreset==='sweep'){ AudioEngine.playSweep(pan) } else if(st.programPreset==='zap'){ AudioEngine.playZap(pan) } else if(st.programPreset==='bubble'){ AudioEngine.playBubble(pan) } else if(st.programPreset==='pink'){ AudioEngine.startPinkNoisePan(st.panRate||0.5); setTimeout(function(){ AudioEngine.stopNoise() }, 800) } else if(st.programPreset==='hybrid'){ AudioEngine.startHybrid(st.cueRate||1.2); setTimeout(function(){ AudioEngine.stopNoise() }, 1000) } } }catch(e){} });
  knobSens.addEventListener('input', function(){ updateKnobSensLabel() });
  if(clearSessionsBtn){ clearSessionsBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); p.sessions = []; p.count = 0; p.last = null; setPatient(p); refreshPatientUI() }) }
  if(deletePatientBtn){ deletePatientBtn.addEventListener('click', function(){ var sel = document.getElementById('patientList'); var n = (sel && sel.value) ? sel.value : (patientName.value||'').trim(); if(!n){ try{ alert('Please select or enter a patient name') }catch(_){ } return } if(!confirm('Delete patient "'+n+'" and all their data?')) return; deletePatient(n); patientName.value=''; refreshPatientList(); refreshPatientUI() }) }
  var loadPatientBtn = document.getElementById('loadPatient');
  if(loadPatientBtn){ loadPatientBtn.addEventListener('click', function(){ var sel = document.getElementById('patientList'); if(!sel) return; var n = sel.value; if(!n) return; patientName.value = n; refreshPatientUI() }) }
  var speedBoost = document.getElementById('speedBoost');
  if(speedBoost){ speedBoost.addEventListener('click', function(e){ var m = e.target.dataset.mult; if(!m) return; var mult = parseInt(m,10)||1; var btns = speedBoost.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ btns[i].classList.toggle('active', btns[i].dataset.mult==String(mult)) } var base = parseInt(speed.value,10)||250; updateSpeedLabel(); applyState({ speed: base*mult, speedMultiplier: mult }, true) }) }
  savePatientBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); setPatient(p); refreshPatientList(); patientName.value=''; refreshPatientUI() })
  if(saveSessionNotesBtn){ saveSessionNotesBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); var idx = parseInt((sessionSelect && sessionSelect.value)||'-1',10); if(!p.sessions || !(p.sessions[idx])) return; p.sessions[idx].notes = (sessionNotesEl && sessionNotesEl.value)||''; setPatient(p); refreshPatientUI() }) }
  if(loadSessionBtn){ loadSessionBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); var idx = parseInt((sessionSelect && sessionSelect.value)||'-1',10); if(!p.sessions || !(p.sessions[idx])) return; if(sessionNotesEl){ sessionNotesEl.value = p.sessions[idx].notes||'' } }) }
  if(deleteSessionSingleBtn){ deleteSessionSingleBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); var idx = parseInt((sessionSelect && sessionSelect.value)||'-1',10); if(!p.sessions || !(p.sessions[idx])) return; p.sessions.splice(idx,1); p.count = (p.sessions||[]).length; if(p.count){ var sorted = p.sessions.slice().sort(function(a,b){ return a.start - b.start }); p.last = sorted[p.count-1] } else { p.last = null } setPatient(p); refreshPatientUI() }) }
  async function connectHIDDevice(){ if(!navigator.hid){ deviceStatus.textContent = 'HID not supported'; return } try{ var devices = await navigator.hid.requestDevice({filters: []}); if(!devices || !devices.length){ deviceStatus.textContent = 'No device selected'; return } hidDevice = devices[0]; await hidDevice.open(); deviceStatus.textContent = 'Connected: '+(hidDevice.productName||'HID'); hidDevice.addEventListener('inputreport', function(e){ var data = e.data; if(!data) return; var b0 = 0; try{ b0 = data.getInt8(0) }catch(_){ try{ b0 = data.getUint8(0); if(b0>127) b0 = b0-256 }catch(_){ b0 = 0 } } var sens = parseInt(knobSens.value,10)||1; var delta = b0 * sens; if(delta!==0){ var current = parseInt(speed.value,10)||250; var next = Math.max(parseInt(speed.min,10), Math.min(parseInt(speed.max,10), current + delta)); speed.value = String(next); updateSpeedLabel(); applyState({speed: next}, true) } }) }catch(e){ deviceStatus.textContent = 'Error connecting' } }
  connectHID.addEventListener('click', connectHIDDevice);
var tickId = null;
function updateStartBtn(){ if(!startBtn) return; var st=BLS.loadState(); if(!st.running){ startBtn.textContent='Start Session' } else if(st.paused){ startBtn.textContent='Resume' } else { startBtn.textContent='Pause' } }
function startTick(){ if(tickId) clearInterval(tickId); tickId = setInterval(function(){ var st = BLS.loadState(); if(!st.running){ clearInterval(tickId); tickId=null; return } var pausedExtra = (st.paused && st.pausedAt)? (Date.now() - st.pausedAt) : 0; var elapsed = Math.floor((Date.now()-st.startedAt - (st.pausedMs||0) - pausedExtra)/1000); if(elapsed<0) elapsed=0; var rem = Math.max(0, st.durationSec - elapsed); var em = Math.floor(elapsed/60), es = elapsed%60; elapsedText.textContent = String(em).padStart(2,'0')+':'+String(es).padStart(2,'0'); var rm = Math.floor(rem/60); timerDisplay.textContent = String(rm).padStart(2,'0')+':'+String(rem%60).padStart(2,'0'); if(rem<=0){ stopTimer() } }, 250) }
function startTimer(){ if(tickId) clearInterval(tickId); var durationSec = Math.max(0, (parseInt(timerMinutes.value||'0',10)||0)*60); var startedAt = Date.now(); applyState({running:true, paused:false, pausedMs:0, pausedAt:null, durationSec:durationSec, startedAt:startedAt}, true); statusText.textContent = 'Running'; updateStartBtn(); tickId = setInterval(function(){ var st = BLS.loadState(); if(!st.running){ clearInterval(tickId); tickId=null; return } var pausedExtra = (st.paused && st.pausedAt)? (Date.now() - st.pausedAt) : 0; var elapsed = Math.floor((Date.now()-st.startedAt - (st.pausedMs||0) - pausedExtra)/1000); if(elapsed<0) elapsed=0; var rem = Math.max(0, st.durationSec - elapsed); var em = Math.floor(elapsed/60), es = elapsed%60; elapsedText.textContent = String(em).padStart(2,'0')+':'+String(es).padStart(2,'0'); var rm = Math.floor(rem/60); timerDisplay.textContent = String(rm).padStart(2,'0')+':'+String(rem%60).padStart(2,'0'); if(rem<=0){ stopTimer() } }, 250); }
function pauseTimer(){ var st=BLS.loadState(); if(!st.running || st.paused) return; applyState({paused:true, pausedAt:Date.now()}, true); statusText.textContent='Paused'; updateStartBtn(); var r = window.AdminRenderer; if(r){ r.stop() } }
function resumeTimer(){ var st=BLS.loadState(); if(!st.running || !st.paused) return; var add = (st.pausedAt? (Date.now()-st.pausedAt) : 0); applyState({paused:false, pausedMs:(st.pausedMs||0)+add, pausedAt:null}, true); statusText.textContent='Running'; updateStartBtn(); var r = window.AdminRenderer; if(r){ r.start() } }
function stopTimer(){
  if(tickId){ clearInterval(tickId); tickId=null }
  var st0 = BLS.loadState();
  if(st0 && st0.running){ recordSession() }
  applyState({ running:false, paused:false, pausedMs:0, pausedAt:null, startedAt:null, durationSec:0 }, true);
  statusText.textContent = 'Idle';
  updateStartBtn();
  updateTimerLabel();
  if(elapsedText){ elapsedText.textContent = '00:00' }
  refreshPatientUI()
}
  startBtn.addEventListener('click', function(){ var st=BLS.loadState(); if(!st.running){ startTimer() } else if(st.paused){ resumeTimer() } else { pauseTimer() } });
  endBtn.addEventListener('click', function(){ if(window.Recorder && Recorder.running){ try{ var rec = Recorder.stop(); if(Recorder.path && Recorder.path.length){ rec.path = Recorder.path.slice(); Recorder.path = null } var name = (prompt('Recording name')||'').trim()||null; (async function(){ try{ await Recorder.add(name, rec) }catch(_){ } refreshRecList() })() }catch(_){ } } stopTimer(); });
  window.AdminStartTimer = startTimer;
  window.AdminStopTimer = stopTimer;
  wsConnectBtn.addEventListener('click', function(){ wsConnect(); updateJoinLink() });
  wsDisconnectBtn.addEventListener('click', wsDisconnect);
  wsUrl.addEventListener('input', updateJoinLink);
  wsSession.addEventListener('input', updateJoinLink);
  function copyText(t, fallbackElem){
    var ok=false;
    if(navigator.clipboard && navigator.clipboard.writeText){
      try{ navigator.clipboard.writeText(t); ok=true }catch(e){}
    }
    if(!ok && fallbackElem){
      try{ fallbackElem.focus(); fallbackElem.select(); ok=document.execCommand('copy') }catch(e){}
    }
    if(!ok){
      var ta=document.createElement('textarea');
      ta.value=t; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.bottom='0'; ta.style.left='0'; ta.style.opacity='0.01';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try{ ok=document.execCommand('copy') }catch(e){}
      document.body.removeChild(ta)
    }
    if(!ok){ try{ alert(t) }catch(_){ } }
    return ok
  }
  copyJoinLink.addEventListener('click', function(){ var v = joinLink.value||''; if(!v) return; var b=this; var ok=copyText(v, joinLink); var old=b.textContent; b.textContent = ok ? 'Copied!' : 'Shown'; setTimeout(function(){ b.textContent=old }, 1000) });
  var detectIPBtn = document.getElementById('detectIP');
  if(detectIPBtn){ detectIPBtn.addEventListener('click', function(){
    function setUrl(ip){ if(!ip) return; wsUrl.value = 'ws://' + ip + ':8787'; if(!(wsSession.value||'').trim()){ wsSession.value = 'room-1' } updateJoinLink(); var v = joinLink.value||''; if(v){ var ok = copyText(v, joinLink); var b = document.getElementById('copyJoinLink'); if(b){ var old=b.textContent; b.textContent = ok? 'Copied!' : 'Copy'; setTimeout(function(){ b.textContent=old }, 1000) } } }
    var host = location.hostname; if(host && host !== 'localhost' && host !== '127.0.0.1'){ setUrl(host); return }
    // Attempt server-assisted detection
    (function(){
      var probeUrl = 'ws://' + (host || 'localhost') + ':8787'
      try{
        var temp = new WebSocket(probeUrl)
        temp.onopen = function(){ try{ temp.send(JSON.stringify({type:'detect_ip'})) }catch(e){} }
        temp.onmessage = function(ev){ try{ var msg = JSON.parse(ev.data); if(msg && msg.type==='detect_ip' && msg.ip){ setUrl(msg.ip); wsStatus.textContent = 'IP detected'; try{ temp.close() }catch(e){} return } }catch(e){} try{ temp.close() }catch(e){}
          // Fallback to WebRTC if server didn't respond with IP
          tryWebRTC()
        }
        temp.onerror = function(){ tryWebRTC() }
      }catch(_){ tryWebRTC() }
    })()
    function tryWebRTC(){
      var RTC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
      if(!RTC){ wsStatus.textContent = 'Detect unavailable'; return }
      try{
        var pc = new RTC({iceServers: []}); pc.createDataChannel('x');
        pc.onicecandidate = function(e){
          if(!e || !e.candidate){ pc.close(); return }
          var cand = e.candidate;
          var ip = (cand && cand.address) || null;
          if(!ip){
            var s = cand.candidate || '';
            var m = s.match(/(?:\s|\b)(\d{1,3}(?:\.\d{1,3}){3})(?:\b)/);
            if(m) ip = m[1]
          }
          if(ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip) && !/^169\./.test(ip)){ setUrl(ip); wsStatus.textContent = 'IP detected'; pc.close() }
        };
        pc.createOffer().then(function(o){ return pc.setLocalDescription(o) }).catch(function(){ wsStatus.textContent = 'Detect failed' })
      }catch(_){ wsStatus.textContent = 'Detect failed' }
    }
  }) }
  openPatient.addEventListener('click', function(){ window.open('patient.html','bls-patient'); });
  renderer.resize(360,220);
  updateSpeedLabel(); updateSizeLabel(); updateYPercentLabel(); updateTimerLabel(); updateGlowIntensityLabel(); updateGlowRateLabel(); updateRampLabel(); updateEdgePauseLabel(); updateWiggleLabel(); updatePanRateLabel(); updateCueRateLabel(); updateVolumeLabel(); statusText.textContent = state.running? (state.paused? 'Paused':'Running'):'Idle'; if(shapeControls) setActive(shapeControls,'shape','shape'); if(directionControls) setActive(directionControls,'direction','direction'); if(easingControls) setActive(easingControls,'easing','easingMode'); updateStartBtn(); if(state.running){ startTick() }
  audioEnable.checked = !!state.audioEnabled;
  glowEnable.checked = !!state.glowEnabled;
  if(yOscillateEnable){ yOscillateEnable.checked = !!state.yOscillateEnabled }
  if(state.yOscillateEnabled){ startYOsc() }
  glowIntensity.value = Math.round((state.glowIntensity||1)*100);
  rampEnable.checked = !!state.rampEnabled;
  rampSeconds.value = parseInt(state.rampSeconds||10,10);
  edgePause.value = parseInt(state.edgePauseMs||0,10);
  wiggleEnable.checked = !!state.wiggleEnabled;
  wiggleAmplitude.value = parseInt(state.wiggleAmplitude||0,10);
  setProgramMode();
  // initialize toggle selection
  if(soundPreset && state.programPreset && state.programPreset!=='tone'){ soundPreset.value = state.programPreset }
  if(toneFreq){ toneFreq.value = String(state.toneFreq||440) }
  if(toneDuration){ toneDuration.value = String(state.toneDurationMs||70); if(toneDurationLabel){ toneDurationLabel.textContent = (state.toneDurationMs||70)+' ms' } }
  if(adsrAttack){ adsrAttack.value = String(state.adsrAttackMs||8) }
  if(adsrDecay){ adsrDecay.value = String(state.adsrDecayMs||80) }
  if(adsrSustain){ adsrSustain.value = String(state.adsrSustainLevel||0.3) }
  if(adsrRelease){ adsrRelease.value = String(state.adsrReleaseMs||10) }
  syncPan.checked = !!state.syncPan;
  panRate.value = String(state.panRate||0.5);
  cueRate.value = String(state.cueRate||1.2);
  volume.value = String(Math.round((state.volume||0.6)*100));
  glowRate.value = String(state.glowRate||0.5);
  
  updateKnobSensLabel();
  yPercent.value = parseInt(state.yPercent||50,10);
  updateYPercentLabel();
  applyState({ yPercent: parseInt(yPercent.value,10) }, false);
  refreshPresetList(); refreshPatientList(); updateJoinLink();
  refreshPatientUI();
}
function waitForBLS(){ if(window.BLS){ initAdmin() } else { setTimeout(waitForBLS, 50) } }
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', waitForBLS) } else { waitForBLS() }
  var wsUrl = document.getElementById('wsUrl');
  var wsSession = document.getElementById('wsSession');
  var wsConnectBtn = document.getElementById('wsConnect');
  var wsDisconnectBtn = document.getElementById('wsDisconnect');
  var wsStatus = document.getElementById('wsStatus');
  var netModeSel = document.getElementById('netMode');
  var rtcControls = document.getElementById('webrtcControls');
  var rtcStatus = document.getElementById('rtcStatus');
  var rtcOffer = document.getElementById('rtcOffer');
  var rtcAnswer = document.getElementById('rtcAnswer');
  var rtcCreateOffer = document.getElementById('rtcCreateOffer');
  var rtcAcceptAnswer = document.getElementById('rtcAcceptAnswer');
  var joinLink = document.getElementById('joinLink');
  var copyJoinLink = document.getElementById('copyJoinLink');
  var simpleViewEnable = document.getElementById('simpleViewEnable');
  var themeToggle = document.getElementById('themeToggle');
  var networkPanelSection = document.getElementById('networkPanelSection');
  var networkHeading = document.getElementById('networkHeading');
  var patientSyncOn = true;
  (function(){ var el = document.getElementById('patientSyncEnable'); if(!el) return; el.checked = !!patientSyncOn; el.addEventListener('change', function(){ patientSyncOn = !!el.checked }) })()
  var startRelayBtn = document.getElementById('startRelayBtn');
  var stopRelayBtn = document.getElementById('stopRelayBtn');
  var relayStatusDot = document.getElementById('relayStatusDot');
  var relayStatusText = document.getElementById('relayStatusText');
  var recStartBtn = document.getElementById('recStart');
  var recStopBtn = document.getElementById('recStop');
  var recList = document.getElementById('recList');
  var recPlayBtn = document.getElementById('recPlay');
  var recExportBtn = document.getElementById('recExport');
  var recImportBtn = document.getElementById('recImport');
  var recDeleteBtn = document.getElementById('recDelete');
  var recClearBtn = document.getElementById('recClear');
  var locked = false; var unlockTimer=null; var lockBanner = document.getElementById('lockBanner');
  var themeSelect = document.getElementById('themeSelect');
  var controllersPanel = document.getElementById('controllersPanel');
  var lockHotkeyEnable = document.getElementById('lockHotkeyEnable');
  var ws = null; var wsConnected = false; var wsSid = null;
  function cycleGlobal(arr, cur){ var i = arr.indexOf(cur); return arr[(i+1) % arr.length] }
  var shapeOrderGlobal = ['circle','square','triangle'];
  var dirOrderGlobal = ['lr','ud','diag_down','diag_up'];
  var easeOrderGlobal = ['linear','ease'];
  function setActiveGroup(selector, dataKey, stateKey){ var host = document.querySelector(selector); if(!host) return; var st = (window.BLS? BLS.loadState():{}); var btns = host.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ var b = btns[i]; var isActive = (b.dataset && b.dataset[dataKey] === st[stateKey]); b.classList.toggle('active', !!isActive) } }
  function publishState(){
    try{
      var payload = {type:'state', sessionId: wsSid||'default', payload: BLS.loadState()}
      if(window.DEBUG_REC){ try{ console.log('Publishing state:', payload) }catch(_){} }
      if(!patientSyncOn){ return }
      if(netModeSel && netModeSel.value==='webrtc'){ if(window.NetRTC){ NetRTC.send(payload) } }
      else if(wsConnected && ws){ ws.send(JSON.stringify(payload)) }
    }catch(e){}
  }
  function updateJoinLink(){ var sid = (wsSession.value||'').trim(); var base = location.origin + '/patient.html'; if(sid){ joinLink.value = base + '#' + encodeURIComponent(sid) } else { joinLink.value = '' } }
  function renderOsHelp(){ var ua = navigator.userAgent||''; var isWin = /Windows/i.test(ua); var isMac = /Macintosh|Mac OS/i.test(ua); var isLinux = /Linux/i.test(ua) && !isWin && !isMac; var setup = (isWin? 'setup.bat' : 'chmod +x ./setup.sh && ./setup.sh'); var start = (isWin? 'start-relay.bat' : 'chmod +x ./start-relay.sh && ./start-relay.sh'); var open = (isWin? 'Open PowerShell' : isMac? 'Cmd+Space → Terminal' : 'Open Terminal'); return { setup: setup, start: start, open: open } }
  (function(){ var el = document.getElementById('osHelp'); if(!el) return; var h = renderOsHelp(); var text = 'First time: ' + h.open + ', cd to the folder, run: ' + h.setup + ' • Every session: ' + h.start; el.innerText = text })();
  function copyText(t){ var ok=false; if(navigator.clipboard && navigator.clipboard.writeText){ try{ navigator.clipboard.writeText(t); ok=true }catch(e){} } if(!ok){ var ta=document.createElement('textarea'); ta.value=t; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.bottom='0'; ta.style.left='0'; ta.style.opacity='0.01'; document.body.appendChild(ta); ta.focus(); ta.select(); try{ ok=document.execCommand('copy') }catch(e){} document.body.removeChild(ta) } if(!ok){ try{ alert(t) }catch(_){ } } return ok }
  function setRelayStatus(on){ if(relayStatusDot){ relayStatusDot.classList.toggle('on', !!on) } if(relayStatusText){ relayStatusText.textContent = on? 'Running' : 'Not running' } }
  (function(){ var btn = document.getElementById('wsConnect'); if(btn){ btn.disabled = true } })();
  (function(){
    var pollMs = 3000;
    function schedule(){ setTimeout(run, pollMs) }
    function run(){ checkRelayOnce().then(function(ok){ setRelayStatus(!!ok); var btn = document.getElementById('wsConnect'); if(btn){ btn.disabled = !ok } pollMs = ok ? 3000 : Math.min(Math.round(pollMs*1.5), 30000); schedule() }).catch(function(){ setRelayStatus(false); var btn = document.getElementById('wsConnect'); if(btn){ btn.disabled = true } pollMs = Math.min(Math.round(pollMs*1.5), 30000); schedule() }) }
    async function checkRelayOnce(){ var host = location.hostname || 'localhost'; var url = 'ws://' + host + ':8787'; try{ return await new Promise(function(resolve){ var temp = new WebSocket(url); var done=false; var timer = setTimeout(function(){ if(!done){ resolve(false); if(temp && temp.readyState===1){ try{ temp.close() }catch(e){} } } }, 1500);
        temp.onopen = function(){ try{ temp.send(JSON.stringify({type:'ping'})) }catch(e){} };
        temp.onmessage = function(ev){ try{ var msg = JSON.parse(ev.data); if(msg && msg.type==='pong'){ done=true; clearTimeout(timer); if(temp && temp.readyState===1){ try{ temp.close() }catch(e){} } resolve(true); return } }catch(e){} resolve(false) };
        temp.onerror = function(){ resolve(false) };
        temp.onclose = function(){ if(!done){ resolve(false) } };
      }) }catch(_){ return false } }
    run()
  })();
  if(startRelayBtn){ startRelayBtn.addEventListener('click', function(){ var h = renderOsHelp(); var ok = copyText(h.start); var old = startRelayBtn.textContent; startRelayBtn.textContent = ok? 'Copied!' : 'Copy Start Command'; setTimeout(function(){ startRelayBtn.textContent = old }, 1200) }) }
  if(stopRelayBtn){ stopRelayBtn.addEventListener('click', function(){ var host = location.hostname || 'localhost'; var url = 'ws://' + host + ':8787'; try{ var temp = new WebSocket(url); temp.onopen = function(){ try{ temp.send(JSON.stringify({type:'shutdown'})) }catch(e){} }; setTimeout(function(){ setRelayStatus(false) }, 1500) }catch(e){} }) }
  function wsConnect(){ var url = (wsUrl.value||'').trim(); var sid = (wsSession.value||'').trim()||'default'; var btn = document.getElementById('wsConnect'); if(btn && btn.disabled){ wsStatus.textContent = 'Relay not running'; return } if(ws){ try{ ws.close() }catch(e){} ws=null } if(!url){ wsStatus.textContent = 'Missing URL'; return } try{ ws = new WebSocket(url) }catch(e){ wsStatus.textContent = 'Error'; return } wsSid = sid; wsStatus.textContent = 'Connecting...'; ws.onopen = function(){ wsConnected = true; wsStatus.textContent = 'Connected'; try{ ws.send(JSON.stringify({type:'join', sessionId:sid, role:'admin'})) }catch(e){} publishState() }; ws.onclose = function(){ wsConnected = false; wsStatus.textContent = 'Disconnected' }; ws.onerror = function(){ wsStatus.textContent = 'Error' }; ws.onmessage = function(ev){ try{ var msg = JSON.parse(ev.data); if(msg && msg.type==='joined'){ wsStatus.textContent = 'Connected' } else if(msg && msg.type==='patientViewport'){ var pv = msg.payload||{}; try{ window.PatientViewport = pv }catch(_){ } var r = window.AdminRenderer; if(r){ r.resize(parseInt(pv.canvasW||640,10), parseInt(pv.canvasH||360,10)) } var pvShort = document.getElementById('patientViewportShort'); if(pvShort){ pvShort.textContent = (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } } }catch(e){} } }
  function wsDisconnect(){ if(ws){ try{ ws.close() }catch(e){} } ws=null; wsConnected=false; wsStatus.textContent = 'Disconnected' }
  function refreshNetMode(){ var m = (netModeSel && netModeSel.value) || 'relay'; if(rtcControls) rtcControls.style.display = (m==='webrtc'? 'flex':'none'); var relayRows = document.querySelectorAll('#osHelp, #wsUrl, #wsSession, #detectIP, #wsConnect, #wsDisconnect'); for(var i=0;i<relayRows.length;i++){ var el=relayRows[i]; if(!el) continue }
    var btn = document.getElementById('wsConnect'); if(btn) btn.disabled = (m==='webrtc'); var s = document.getElementById('wsStatus'); if(s && m==='webrtc'){ s.textContent = 'P2P mode' }
  }
  if(netModeSel){ netModeSel.addEventListener('change', refreshNetMode); refreshNetMode() }
  if(rtcCreateOffer){ rtcCreateOffer.addEventListener('click', async function(){ try{ rtcStatus.textContent='Creating...'; var str = await NetRTC.startOfferer(); rtcOffer.value = str; rtcStatus.textContent='Offer ready'; var img = document.getElementById('rtcOfferQR'); if(img){ var enc = encodeURIComponent(str); img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + enc } }catch(e){ rtcStatus.textContent='Error' } }) }
  if(rtcAcceptAnswer){ rtcAcceptAnswer.addEventListener('click', async function(){ var ans = (rtcAnswer.value||'').trim(); if(!ans){ rtcStatus.textContent='Missing answer'; return } try{ rtcStatus.textContent='Connecting...'; await NetRTC.acceptAnswer(ans); rtcStatus.textContent='Connected'; }catch(e){ rtcStatus.textContent='Error' } }) }
  if(window.NetRTC && NetRTC.onMessage){ NetRTC.onMessage(function(msg){ if(!msg || typeof msg!=='object') return; if(msg.type==='patientViewport'){ var pv = msg.payload||{}; try{ window.PatientViewport = pv }catch(_){ } var r = window.AdminRenderer; if(r){ r.resize(parseInt(pv.canvasW||640,10), parseInt(pv.canvasH||360,10)) } var pvShort = document.getElementById('patientViewportShort'); if(pvShort){ pvShort.textContent = (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } } }) }
  window.addEventListener('message', function(ev){ var d = ev && ev.data; if(!d || d.type!=='patientViewport') return; var pv = d.payload||{}; try{ window.PatientViewport = pv }catch(_){ } var r = window.AdminRenderer; if(r){ r.resize(parseInt(pv.canvasW||640,10), parseInt(pv.canvasH||360,10)) } var pvShort = document.getElementById('patientViewportShort'); if(pvShort){ pvShort.textContent = (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } });
  
  async function refreshRecList(){ if(!recList) return; var all = (window.Recorder? await Recorder.list(): []); var html = all.map(function(r, i){ return '<option value="'+i+'">'+(r.name||('Recording '+(i+1)))+'</option>' }).join(''); recList.innerHTML = html }
  if(recStartBtn){ recStartBtn.addEventListener('click', function(){ var st = BLS.loadState(); if(!st.running && window.AdminStartTimer){ window.AdminStartTimer() } if(window.Recorder){ Recorder.start(); statusText.textContent='Recording'; var r = window.AdminRenderer; var lastT = 0; if(r){ r.setOnUpdate(function(info){ if(!Recorder.running) return; var t = Date.now() - (Recorder.startTime||Date.now()); if(t - lastT >= 100){ try{ if(!Recorder.path) Recorder.path=[]; Recorder.path.push({ t:t, x:info.x, y:info.y }); lastT = t }catch(_){ } } }) } } }) }
  if(recStopBtn){ recStopBtn.addEventListener('click', async function(){ if(window.Recorder){ var rec = Recorder.stop(); if(Recorder.path && Recorder.path.length){ rec.path = Recorder.path.slice(); Recorder.path = null } var name = (prompt('Recording name')||'').trim()||null; if(!rec.samples || !rec.samples.length){ try{ alert('No parameter changes captured in this recording') }catch(_){ } } await Recorder.add(name, rec); if(window.AdminStopTimer){ window.AdminStopTimer() } statusText.textContent='Idle'; var r = window.AdminRenderer; if(r){ r.setOnUpdate(null) } refreshRecList() } }) }
  if(recPlayBtn){ recPlayBtn.addEventListener('click', async function(){ var idxRaw = (recList && recList.value)||''; var idx = idxRaw? parseInt(idxRaw,10) : -1; var all = await Recorder.list(); if(idx<0) idx = (all.length? all.length-1 : -1); if(!(all && all[idx])){ statusText.textContent='No recordings'; return } var rec = all[idx].data; var mode = (netModeSel && netModeSel.value)||'relay'; var usingRelay = (mode==='relay'); var effectiveWs = (usingRelay && patientSyncOn && ws && ws.readyState===1) ? ws : null; var opts = { mode: usingRelay? 'relay':'webrtc', sid: wsSid||'default', ws: effectiveWs, speed:1, applyLocal: function(s){ if(window.applyStateLocal){ window.applyStateLocal(s) } else { try{ var st = BLS.mergeState(BLS.loadState(), s||{}); var r = window.AdminRenderer; if(r){ r.setState(st); if(st.running){ r.start() } else { r.stop() } } }catch(_){ } } }, sendLocalChannel: function(s){ try{ if(patientSyncOn){ chan.send(s) } }catch(_){ } }, patientSyncOn: patientSyncOn }; Recorder.play(rec, opts); statusText.textContent='Replaying' }) }
  if(recExportBtn){ recExportBtn.addEventListener('click', async function(){ var idxRaw = (recList && recList.value)||''; var idx = idxRaw? parseInt(idxRaw,10) : -1; var all = await Recorder.list(); if(idx<0) idx = (all.length? all.length-1 : -1); if(!(all && all[idx])){ statusText.textContent='No recordings'; return } var payload = JSON.stringify(all[idx].data, null, 2); if(window.showSaveFilePicker){ try{ var handle = await window.showSaveFilePicker({ suggestedName: (all[idx].name||'recording')+'.json', types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); var w = await handle.createWritable(); await w.write(payload); await w.close(); statusText.textContent='Exported' }catch(_){ } } else { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([payload], {type:'application/json'})); a.download = (all[idx].name||'recording')+'.json'; a.click(); URL.revokeObjectURL(a.href); statusText.textContent='Exported' } }) }
  if(recImportBtn){ recImportBtn.addEventListener('click', async function(){ try{ if(window.showOpenFilePicker){ var files = await window.showOpenFilePicker({ multiple:false, types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); if(files && files.length){ var file = await files[0].getFile(); var text = await file.text(); var data = JSON.parse(text); var name = prompt('Recording name')||'Imported'; await Recorder.add(name, data); await refreshRecList(); statusText.textContent='Imported' } } else { var input = document.createElement('input'); input.type='file'; input.accept='.json,application/json'; input.addEventListener('change', async function(){ var f = input.files && input.files[0]; if(!f) return; var reader = new FileReader(); reader.onload = async function(){ try{ var data = JSON.parse(reader.result); var name = prompt('Recording name')||'Imported'; await Recorder.add(name, data); await refreshRecList(); statusText.textContent='Imported' }catch(_){ } }; reader.readAsText(f) }); input.click() } }catch(_){ } }) }
  if(recDeleteBtn){ recDeleteBtn.addEventListener('click', async function(){ var idxRaw = (recList && recList.value)||''; var idx = idxRaw? parseInt(idxRaw,10) : -1; var all = await Recorder.list(); if(!(all && all[idx])){ statusText.textContent='No selection'; return } var name = all[idx].name || ('Recording '+(idx+1)); if(!confirm('Delete recording "'+name+'"?')) return; var id = all[idx].id; try{ if(window.RecordingStore && id){ await RecordingStore.delete(id) } else { try{ var arr = JSON.parse(localStorage.getItem('bls_recordings')||'[]'); if(Array.isArray(arr)){ arr.splice(idx,1); localStorage.setItem('bls_recordings', JSON.stringify(arr)) } }catch(_){ } } await refreshRecList(); statusText.textContent='Deleted' }catch(_){ } }) }
  if(recClearBtn){ recClearBtn.addEventListener('click', async function(){ try{ await Recorder.clear(); await refreshRecList(); statusText.textContent='Cleared' }catch(_){ } }) }
  refreshRecList()
  function lockOn(){ locked=true; document.body.classList.add('locked'); if(lockBanner) lockBanner.textContent='LOCKED • Hold U to unlock' }
  function lockOff(){ locked=false; document.body.classList.remove('locked'); if(lockBanner) lockBanner.textContent='UNLOCKED' }
  window.addEventListener('keydown', function(e){ if(lockHotkeyEnable && !lockHotkeyEnable.checked) return; if(e.key==='l' || e.key==='L'){ if(!locked){ lockOn() } } if(e.key==='u' || e.key==='U'){ if(locked && !unlockTimer){ if(lockBanner) lockBanner.textContent='Unlocking...'; unlockTimer=setTimeout(function(){ unlockTimer=null; lockOff() }, 2000) } } });
  window.addEventListener('keyup', function(e){ if(lockHotkeyEnable && !lockHotkeyEnable.checked) return; if(e.key==='u' || e.key==='U'){ if(unlockTimer){ clearTimeout(unlockTimer); unlockTimer=null; if(lockBanner && locked){ lockBanner.textContent='LOCKED • Hold U to unlock' } } } });
  function applyTheme(val){ var pref = val||'auto'; if(pref==='dark'){ document.body.classList.add('theme-dark') } else if(pref==='light'){ document.body.classList.remove('theme-dark') } else { var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; if(mq){ document.body.classList.add('theme-dark') } else { document.body.classList.remove('theme-dark') } } try{ localStorage.setItem('bls_theme', pref) }catch(_){ } }
  if(themeSelect){ var saved = null; try{ saved = localStorage.getItem('bls_theme') }catch(_){ } if(saved){ themeSelect.value = saved } applyTheme(themeSelect.value); themeSelect.addEventListener('change', function(){ applyTheme(themeSelect.value) }) }
  (function(){
    var saved = null; try{ saved = localStorage.getItem('bls_theme') }catch(_){ }
    var prefersDark = false; try{ prefersDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) }catch(_){ }
    var isDark = (saved==='dark') || (!saved && prefersDark);
    if(themeToggle){
      themeToggle.checked = isDark;
      themeToggle.addEventListener('change', function(){ applyTheme(themeToggle.checked? 'dark' : 'light') })
    }
    applyTheme(saved ? saved : (isDark ? 'dark' : 'light'))
  })();
  (function(){
    if(networkPanelSection && networkHeading){
      
    }
  })();
  function updatePreviewFromViewport(){ try{ var pv = window.PatientViewport; if(!pv) return; var pvShort = document.getElementById('patientViewportShort'); if(pvShort){ pvShort.textContent = (pv.canvasW||'?')+'×'+(pv.canvasH||'?') } var cv = document.getElementById('previewCanvas'); if(cv){ var cont = cv.parentElement; var maxW = Math.min((cont && cont.clientWidth) || 520, 520); var ratio = (parseInt(pv.canvasW||640,10)) / (parseInt(pv.canvasH||360,10)); cv.style.width = maxW + 'px'; cv.style.height = Math.round(maxW / (ratio || (640/360))) + 'px'; } }catch(e){} }
  setInterval(updatePreviewFromViewport, 500)
  function applySimpleView(on){ if(on){ document.body.classList.add('simple-view') } else { document.body.classList.remove('simple-view') } try{ localStorage.setItem('bls_simple_view', String(!!on)) }catch(_){ } }
  if(simpleViewEnable){ var sv = null; try{ sv = localStorage.getItem('bls_simple_view') }catch(_){ } if(sv!==null){ simpleViewEnable.checked = (sv==='true') } applySimpleView(!!simpleViewEnable.checked); simpleViewEnable.addEventListener('change', function(){ applySimpleView(!!simpleViewEnable.checked) }) }
  if(lockHotkeyEnable){ var savedLock = null; try{ savedLock = localStorage.getItem('bls_lock_hotkey') }catch(_){ } if(savedLock!==null){ lockHotkeyEnable.checked = savedLock==='true' } lockHotkeyEnable.addEventListener('change', function(){ try{ localStorage.setItem('bls_lock_hotkey', String(!!lockHotkeyEnable.checked)) }catch(_){ } }) }
  
  if(window.Controllers){
    Controllers.registerAction('start', function(){ var b = document.getElementById('startSession'); if(b) b.click() })
    Controllers.registerAction('stop', function(){ var b = document.getElementById('endSession'); if(b) b.click() })
    Controllers.registerAction('speed_up', function(){ var el = document.getElementById('speed'); if(!el) return; var current = parseInt(el.value,10)||250; var step = parseInt(el.step,10)||10; var next = Math.min(parseInt(el.max,10), current + step); el.value=String(next); el.dispatchEvent(new Event('input', {bubbles:true})) })
    Controllers.registerAction('speed_down', function(){ var el = document.getElementById('speed'); if(!el) return; var current = parseInt(el.value,10)||250; var step = parseInt(el.step,10)||10; var next = Math.max(parseInt(el.min,10), current - step); el.value=String(next); el.dispatchEvent(new Event('input', {bubbles:true})) })
    Controllers.registerAction('volume_up', function(){ var el = document.getElementById('volume'); if(!el) return; var current = parseInt(el.value,10)||60; var next = Math.min(100, current + 5); el.value=String(next); el.dispatchEvent(new Event('input', {bubbles:true})) })
    Controllers.registerAction('volume_down', function(){ var el = document.getElementById('volume'); if(!el) return; var current = parseInt(el.value,10)||60; var next = Math.max(0, current - 5); el.value=String(next); el.dispatchEvent(new Event('input', {bubbles:true})) })
    Controllers.registerAction('audio_toggle', function(){ var el = document.getElementById('audioEnable'); if(!el) return; el.checked = !el.checked; el.dispatchEvent(new Event('change', {bubbles:true})) })
    Controllers.registerAction('glow_toggle', function(){ var el = document.getElementById('glowEnable'); if(!el) return; el.checked = !el.checked; el.dispatchEvent(new Event('change', {bubbles:true})) })
    Controllers.registerAction('wiggle_toggle', function(){ var el = document.getElementById('wiggleEnable'); if(!el) return; el.checked = !el.checked; el.dispatchEvent(new Event('change', {bubbles:true})) })
    Controllers.registerAction('record_start', function(){ var b = document.getElementById('recStart'); if(b) b.click() })
    Controllers.registerAction('record_stop', function(){ var b = document.getElementById('recStop'); if(b) b.click() })
    Controllers.registerAction('replay', function(){ var b = document.getElementById('recPlay'); if(b) b.click() })
    Controllers.registerAction('lock_on', function(){ if(typeof lockOn==='function') lockOn() })
    Controllers.registerAction('lock_off', function(){ if(typeof lockOff==='function') lockOff() })
    Controllers.registerAction('lock_toggle', function(){ if(typeof lockOn==='function' && typeof lockOff==='function'){ if(document.body.classList.contains('locked')) lockOff(); else lockOn() } })
    Controllers.registerAction('shape_next', function(){ var cur = (window.BLS? BLS.loadState().shape : 'circle') || 'circle'; var next = cycleGlobal(shapeOrderGlobal, cur); var btn = document.querySelector('#shapeControls button[data-shape="'+next+'"]'); if(btn) btn.click() })
    Controllers.registerAction('direction_next', function(){ var cur = (window.BLS? BLS.loadState().direction : 'lr') || 'lr'; var next = cycleGlobal(dirOrderGlobal, cur); var btn = document.querySelector('#directionControls button[data-direction="'+next+'"]'); if(btn) btn.click() })
    Controllers.registerAction('easing_next', function(){ var cur = (window.BLS? BLS.loadState().easingMode : 'linear') || 'linear'; var next = cycleGlobal(easeOrderGlobal, cur); var btn = document.querySelector('#easingControls button[data-easing="'+next+'"]'); if(btn) btn.click() })
    Controllers.registerAction('program_next', function(){ var st = (window.BLS? BLS.loadState():{programPreset:'pink'}); if(st.programPreset==='tone'){ var sel = document.getElementById('tonePreset'); if(sel){ var i = sel.selectedIndex; sel.selectedIndex = (i+1) % sel.options.length; sel.dispatchEvent(new Event('change', {bubbles:true})) } } else { var list = ['pink','hybrid','click','ping','woodblock','bell','bass','kick','snare','hihat','sweep','zap','bubble']; var i = list.indexOf(st.programPreset||'pink'); var next = list[(i+1) % list.length]; applyState({programPreset: next}, true); var toggle = document.getElementById('soundToneToggle'); if(toggle){ var btns = toggle.querySelectorAll('button'); for(var j=0;j<btns.length;j++){ var b=btns[j]; var m=b.dataset.mode; b.classList.toggle('active', m==='sound') } } } })
  }
  if(window.Controllers && Controllers.initPanel){ Controllers.initPanel() }
  if(speedDown){ speedDown.addEventListener('click', function(){ var el = document.getElementById('speed'); if(!el) return; var current = parseInt(el.value,10)||250; var next = Math.max(parseInt(el.min,10), current - parseInt(el.step,10)); el.value=String(next); var lab = document.getElementById('speedLabel'); if(lab){ lab.textContent = el.value+' px/s' } el.dispatchEvent(new Event('input', {bubbles:true})) }) }
  if(speedUp){ speedUp.addEventListener('click', function(){ var el = document.getElementById('speed'); if(!el) return; var current = parseInt(el.value,10)||250; var next = Math.min(parseInt(el.max,10), current + parseInt(el.step,10)); el.value=String(next); var lab = document.getElementById('speedLabel'); if(lab){ lab.textContent = el.value+' px/s' } el.dispatchEvent(new Event('input', {bubbles:true})) }) }
  if(recStartBtn){ try{ recStartBtn.innerHTML = '<span style="color:#e22; font-weight:700">●</span> Record' }catch(_){ } }
  (function(){
    var sections = document.querySelectorAll('.panel.collapsible');
    sections.forEach(function(section){
      var heading = section.querySelector('h2');
      if(!heading) return;
      var key = 'bls_collapse_' + (section.id || Math.random().toString(36).slice(2));
      try{ var saved = localStorage.getItem(key); if(saved==='true'){ section.classList.add('collapsed') } }catch(_){ }
      heading.setAttribute('aria-expanded', String(!section.classList.contains('collapsed')));
      function toggle(){ var isCollapsed = section.classList.toggle('collapsed'); heading.setAttribute('aria-expanded', String(!isCollapsed)); try{ localStorage.setItem(key, String(!!isCollapsed)) }catch(_){ } }
      heading.addEventListener('click', toggle);
      heading.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle() } })
    })
  })();
