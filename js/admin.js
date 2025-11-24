function initAdmin(){
  var previewCanvas = document.getElementById('previewCanvas');
  var renderer = BLS.Renderer(previewCanvas);
  var chan = BLS.createChannel('bls-session');
  var state = BLS.loadState();
  renderer.setState(state);
var shapeControls = document.getElementById('shapeControls');
  var directionControls = document.getElementById('directionControls');
  var easingControls = document.getElementById('easingControls');
  var shapeColor = document.getElementById('shapeColor');
  var bgColor = document.getElementById('bgColor');
  var shapePreset = document.getElementById('shapePreset');
  var bgPreset = document.getElementById('bgPreset');
var speed = document.getElementById('speed');
  var speedLabel = document.getElementById('speedLabel');
  var size = document.getElementById('size');
  var sizeLabel = document.getElementById('sizeLabel');
  var yPercent = document.getElementById('yPercent');
  var yPercentLabel = document.getElementById('yPercentLabel');
  var yReset = document.getElementById('yReset');
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
  var audioSelect = document.getElementById('audioSelect');
  var pickAudioFolder = document.getElementById('pickAudioFolder');
  var audioEnable = document.getElementById('audioEnable');
  var audioMode = document.getElementById('audioMode');
  var programControls = document.getElementById('programmaticControls');
  var fileControls = document.getElementById('fileControls');
  var programPreset = document.getElementById('programPreset');
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
  function updateSizeLabel(){ sizeLabel.textContent = size.value+' px'; }
  function updateGlowIntensityLabel(){ glowIntensityLabel.textContent = glowIntensity.value+'%'; }
  function updateGlowRateLabel(){ glowRateLabel.textContent = parseFloat(glowRate.value).toFixed(1)+' Hz'; }
  function updateYPercentLabel(){ yPercentLabel.textContent = yPercent.value+'%'; }
  function updateRampLabel(){ rampLabel.textContent = rampSeconds.value+' s'; }
  function updateEdgePauseLabel(){ edgePauseLabel.textContent = edgePause.value+' ms'; }
  function updateWiggleLabel(){ wiggleLabel.textContent = wiggleAmplitude.value+' px'; }
  function updatePanRateLabel(){ panRateLabel.textContent = parseFloat(panRate.value).toFixed(1)+' Hz' }
  function updateCueRateLabel(){ cueRateLabel.textContent = parseFloat(cueRate.value).toFixed(1)+' Hz' }
  function updateVolumeLabel(){ volumeLabel.textContent = volume.value+'%' }
  function refreshAudioMode(){ var m = audioMode.value; programControls.style.display = (m==='programmatic' ? 'flex' : 'none'); fileControls.style.display = (m==='file' ? 'flex' : 'none') }
  function updateKnobSensLabel(){ knobSensLabel.textContent = 'x'+knobSens.value }
  function refreshPatientList(){ var m = loadPatients(); var names = Object.keys(m).sort(); var html = names.map(function(n){ return '<option value="'+n+'">'+n+'</option>' }).join(''); var sel = document.getElementById('patientList'); if(sel){ sel.innerHTML = html }
  }
  function loadPatients(){ try{ var m = JSON.parse(localStorage.getItem('bls_patients')||'null'); return m&&typeof m==='object'? m : {} }catch(e){ return {} } }
  function savePatients(m){ try{ localStorage.setItem('bls_patients', JSON.stringify(m)) }catch(e){} }
  function getPatient(name){ var n = (name||'').trim()||'Unnamed'; var m = loadPatients(); if(!m[n]) m[n] = { name:n, sessions:[], count:0, last:null }; return m[n] }
  function setPatient(p){ var m = loadPatients(); m[p.name] = p; savePatients(m) }
  function deletePatient(name){ var n = (name||'').trim()||'Unnamed'; var m = loadPatients(); if(m[n]){ delete m[n]; savePatients(m) } }
  function refreshPatientUI(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); sessionCountEl.textContent = String(p.count||0); if(p.last){ var d = new Date(p.last.end); var dur = Math.round((p.last.durationSec||0)); lastSessionInfoEl.textContent = d.toLocaleString()+' • '+dur+'s' } else { lastSessionInfoEl.textContent = '—' } var host = document.getElementById('sessionHistory'); if(host){ if(!p.sessions || !p.sessions.length){ host.innerHTML = '<em>No sessions yet</em>' } else { var rows = p.sessions.slice().sort(function(a,b){ return a.start - b.start }).map(function(s, idx){ var start = new Date(s.start).toLocaleString(); var end = new Date(s.end).toLocaleString(); var dur = Math.round(s.durationSec||0); return '<div>'+String(idx+1)+'. '+start+' → '+end+' • '+dur+'s</div>' }); host.innerHTML = rows.join('') } } }
  function recordSession(){ var n = (patientName.value||'').trim()||'Unnamed'; var st = BLS.loadState(); if(!st.startedAt) return; var end = Date.now(); var durationSec = Math.floor((end - st.startedAt)/1000); var p = getPatient(n); p.sessions.push({ start: st.startedAt, end: end, durationSec: durationSec }); p.count = (p.count||0)+1; p.last = { start: st.startedAt, end: end, durationSec: durationSec }; setPatient(p); refreshPatientUI() }
  function refreshPresetList(){ var names = BLS.listPresets(); var html=''; for(var i=0;i<names.length;i++){ var n=names[i]; html += '<option value="'+n+'">'+n+'</option>' } presetList.innerHTML = html }
  function applyState(next, broadcast){ state = BLS.mergeState(state, next||{}); renderer.setState(state); if(state.running){ renderer.start() } else { renderer.stop() } if(broadcast){ chan.send(state) } }
  function publishState(){ try{ if(wsConnected && ws){ ws.send(JSON.stringify({type:'state', sessionId: wsSid||'default', payload: BLS.loadState()})) } }catch(e){} }
shapeControls.addEventListener('click', function(e){ var d = e.target.dataset.shape; if(!d) return; applyState({shape:d}, true); setActive(shapeControls,'shape','shape'); });
  directionControls.addEventListener('click', function(e){ var d = e.target.dataset.direction; if(!d) return; applyState({direction:d}, true); setActive(directionControls,'direction','direction'); });
  easingControls.addEventListener('click', function(e){ var d = e.target.dataset.easing; if(!d) return; applyState({easingMode:d}, true); setActive(easingControls,'easing','easingMode'); });
  shapeColor.addEventListener('input', function(){ applyState({shapeColor:shapeColor.value}, true); });
  bgColor.addEventListener('input', function(){ applyState({bgColor:bgColor.value}, true); });
  shapePreset.addEventListener('click', function(e){ var c = e.target.dataset.color; if(!c) return; shapeColor.value = c; applyState({shapeColor:c}, true); });
  bgPreset.addEventListener('click', function(e){ var c = e.target.dataset.color; if(!c) return; bgColor.value = c; applyState({bgColor:c}, true); });
  speed.addEventListener('input', function(){ updateSpeedLabel(); var m = (BLS.loadState().speedMultiplier||1); applyState({speed:parseInt(speed.value,10)*m}, true); publishState() });
  size.addEventListener('input', function(){ updateSizeLabel(); applyState({size:parseInt(size.value,10)}, true); });
  yPercent.addEventListener('input', function(){ updateYPercentLabel(); applyState({yPercent:parseInt(yPercent.value,10)}, true); });
  yReset.addEventListener('click', function(){ yPercent.value=50; updateYPercentLabel(); applyState({yPercent:50}, true); });
  glowEnable.addEventListener('change', function(){ applyState({glowEnabled: glowEnable.checked}, true); publishState() });
  glowIntensity.addEventListener('input', function(){ updateGlowIntensityLabel(); var f = parseInt(glowIntensity.value,10)/100; applyState({glowIntensity:f}, true); publishState() });
  glowRate.addEventListener('input', function(){ updateGlowRateLabel(); applyState({glowRate: parseFloat(glowRate.value)}, true); publishState() });
  rampEnable.addEventListener('change', function(){ var st = BLS.loadState(); var next = {rampEnabled: rampEnable.checked}; if(!rampEnable.checked){ next.easingMode = 'linear' } if(st.running && rampEnable.checked){ next.startedAt = Date.now() } applyState(next, true); publishState() });
  rampSeconds.addEventListener('input', function(){ updateRampLabel(); var st = BLS.loadState(); var next = {rampSeconds: parseInt(rampSeconds.value,10)}; if(st.running && st.rampEnabled){ next.startedAt = Date.now() } applyState(next, true); publishState() });
  edgePause.addEventListener('input', function(){ updateEdgePauseLabel(); applyState({edgePauseMs: parseInt(edgePause.value,10)}, true); publishState() });
  wiggleEnable.addEventListener('change', function(){ applyState({wiggleEnabled: wiggleEnable.checked}, true); publishState() });
  wiggleAmplitude.addEventListener('input', function(){ updateWiggleLabel(); applyState({wiggleAmplitude: parseInt(wiggleAmplitude.value,10)}, true); publishState() });
  timerMinutes.addEventListener('input', function(){ updateTimerLabel(); });
  savePresetBtn.addEventListener('click', function(){ var n = (presetName.value||'').trim(); if(!n) return; BLS.savePreset(n, BLS.loadState()); refreshPresetList() })
  applyPresetBtn.addEventListener('click', function(){ var n = presetList.value; if(!n) return; var preset = BLS.loadPreset(n); if(!preset) return; applyState(preset, true); setActive(shapeControls,'shape','shape'); setActive(directionControls,'direction','direction'); setActive(easingControls,'easing','easingMode') })
  deletePresetBtn.addEventListener('click', function(){ var n = presetList.value; if(!n) return; BLS.deletePreset(n); refreshPresetList() })
  exportPresetsBtn.addEventListener('click', async function(){ var data = BLS.exportPresets(); if(window.showSaveFilePicker){ try{ var handle = await window.showSaveFilePicker({ suggestedName: 'bls-presets.json', types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); var w = await handle.createWritable(); await w.write(data); await w.close() }catch(e){} } else { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], {type:'application/json'})); a.download = 'bls-presets.json'; a.click(); URL.revokeObjectURL(a.href) } })
  importPresetsBtn.addEventListener('click', async function(){ if(window.showOpenFilePicker){ try{ var files = await window.showOpenFilePicker({ multiple:false, types:[{ description:'JSON', accept:{ 'application/json':['.json'] } }] }); if(files && files.length){ var file = await files[0].getFile(); var text = await file.text(); BLS.importPresets(text); refreshPresetList() } }catch(e){} } else { var input = document.createElement('input'); input.type='file'; input.accept='.json,application/json'; input.addEventListener('change', function(){ var f = input.files && input.files[0]; if(!f) return; var reader = new FileReader(); reader.onload = function(){ BLS.importPresets(reader.result); refreshPresetList() }; reader.readAsText(f) }); input.click() } })
  async function listAudioFromHandle(handle){ audioFiles=[]; if(!handle) return; try{ for await (const [name, h] of handle.entries()){ if(h.kind==='file' && /\.(mp3|wav)$/i.test(name)){ audioFiles.push({name:name, handle:h}) } } }catch(e){} audioSelect.innerHTML = '<option value="">No audio</option>' + audioFiles.map(function(f){ return '<option value="'+f.name+'">'+f.name+'</option>' }).join('') }
  async function pickFolder(){ if(window.showDirectoryPicker){ try{ var dir = await window.showDirectoryPicker(); await listAudioFromHandle(dir); }catch(e){} } else { var input = document.createElement('input'); input.type='file'; input.webkitdirectory=true; input.multiple=true; input.addEventListener('change', function(){ audioFiles = Array.from(input.files).filter(function(f){ return /\.(mp3|wav)$/i.test(f.name) }).map(function(f){ return {name:f.name, file:f} }); audioSelect.innerHTML = '<option value="">No audio</option>' + audioFiles.map(function(f){ return '<option value="'+f.name+'">'+f.name+'</option>' }).join(''); }); input.click(); } }
  pickAudioFolder.addEventListener('click', pickFolder);
  audioSelect.addEventListener('change', function(){ var name = audioSelect.value || null; applyState({audioName:name}, true) });
  audioEnable.addEventListener('change', function(){ applyState({audioEnabled: audioEnable.checked}, true) });
  audioMode.addEventListener('change', function(){ refreshAudioMode(); applyState({audioMode: audioMode.value}, true) });
  programPreset.addEventListener('change', function(){ applyState({programPreset: programPreset.value}, true); publishState() });
  syncPan.addEventListener('change', function(){ applyState({syncPan: syncPan.checked}, true); publishState() });
  panRate.addEventListener('input', function(){ updatePanRateLabel(); applyState({panRate: parseFloat(panRate.value)}, true); publishState() });
  cueRate.addEventListener('input', function(){ updateCueRateLabel(); applyState({cueRate: parseFloat(cueRate.value)}, true); publishState() });
  volume.addEventListener('input', function(){ updateVolumeLabel(); applyState({volume: parseInt(volume.value,10)/100}, true); publishState() });
  testSound.addEventListener('click', function(){ try{ var st = BLS.loadState(); if(st.audioMode==='programmatic'){ AudioEngine.setVolume(st.volume||0.6); var pan = 0; if(st.programPreset==='click'){ AudioEngine.playClick(pan) } else if(st.programPreset==='ping'){ AudioEngine.playPing(pan) } else if(st.programPreset==='woodblock'){ AudioEngine.playWoodblock(pan) } else if(st.programPreset==='bell'){ AudioEngine.playBell(pan) } else if(st.programPreset==='bass'){ AudioEngine.playBass(pan) } else if(st.programPreset==='kick'){ AudioEngine.playKick(pan) } else if(st.programPreset==='snare'){ AudioEngine.playSnare(pan) } else if(st.programPreset==='hihat'){ AudioEngine.playHiHat(pan) } else if(st.programPreset==='sweep'){ AudioEngine.playSweep(pan) } else if(st.programPreset==='zap'){ AudioEngine.playZap(pan) } else if(st.programPreset==='bubble'){ AudioEngine.playBubble(pan) } else if(st.programPreset==='pink'){ AudioEngine.startPinkNoisePan(st.panRate||0.5); setTimeout(function(){ AudioEngine.stopNoise() }, 800) } else if(st.programPreset==='hybrid'){ AudioEngine.startHybrid(st.cueRate||1.2); setTimeout(function(){ AudioEngine.stopNoise() }, 1000) } } }catch(e){} });
  knobSens.addEventListener('input', function(){ updateKnobSensLabel() });
  if(clearSessionsBtn){ clearSessionsBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); p.sessions = []; p.count = 0; p.last = null; setPatient(p); refreshPatientUI() }) }
  if(deletePatientBtn){ deletePatientBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; deletePatient(n); patientName.value=''; refreshPatientList(); refreshPatientUI() }) }
  var loadPatientBtn = document.getElementById('loadPatient');
  if(loadPatientBtn){ loadPatientBtn.addEventListener('click', function(){ var sel = document.getElementById('patientList'); if(!sel) return; var n = sel.value; if(!n) return; patientName.value = n; refreshPatientUI() }) }
  var speedBoost = document.getElementById('speedBoost');
  if(speedBoost){ speedBoost.addEventListener('click', function(e){ var m = e.target.dataset.mult; if(!m) return; var mult = parseInt(m,10)||1; var btns = speedBoost.querySelectorAll('button'); for(var i=0;i<btns.length;i++){ btns[i].classList.toggle('active', btns[i].dataset.mult==String(mult)) } var base = parseInt(speed.value,10)||250; updateSpeedLabel(); applyState({ speed: base*mult, speedMultiplier: mult }, true) }) }
  savePatientBtn.addEventListener('click', function(){ var n = (patientName.value||'').trim()||'Unnamed'; var p = getPatient(n); setPatient(p); refreshPatientUI() })
  async function connectHIDDevice(){ if(!navigator.hid){ deviceStatus.textContent = 'HID not supported'; return } try{ var devices = await navigator.hid.requestDevice({filters: []}); if(!devices || !devices.length){ deviceStatus.textContent = 'No device selected'; return } hidDevice = devices[0]; await hidDevice.open(); deviceStatus.textContent = 'Connected: '+(hidDevice.productName||'HID'); hidDevice.addEventListener('inputreport', function(e){ var data = e.data; if(!data) return; var b0 = 0; try{ b0 = data.getInt8(0) }catch(_){ try{ b0 = data.getUint8(0); if(b0>127) b0 = b0-256 }catch(_){ b0 = 0 } } var sens = parseInt(knobSens.value,10)||1; var delta = b0 * sens; if(delta!==0){ var current = parseInt(speed.value,10)||250; var next = Math.max(parseInt(speed.min,10), Math.min(parseInt(speed.max,10), current + delta)); speed.value = String(next); updateSpeedLabel(); applyState({speed: next}, true) } }) }catch(e){ deviceStatus.textContent = 'Error connecting' } }
  connectHID.addEventListener('click', connectHIDDevice);
var tickId = null;
function startTimer(){ if(tickId) clearInterval(tickId); var durationSec = Math.max(0, (parseInt(timerMinutes.value||'0',10)||0)*60); var startedAt = Date.now(); applyState({running:true, durationSec:durationSec, startedAt:startedAt}, true); statusText.textContent = 'Running'; tickId = setInterval(function(){ var st = BLS.loadState(); if(!st.running){ clearInterval(tickId); tickId=null; return } var elapsed = Math.floor((Date.now()-st.startedAt)/1000); var rem = Math.max(0, st.durationSec - elapsed); var em = Math.floor(elapsed/60), es = elapsed%60; elapsedText.textContent = String(em).padStart(2,'0')+':'+String(es).padStart(2,'0'); var rm = Math.floor(rem/60); timerDisplay.textContent = String(rm).padStart(2,'0')+':'+String(rem%60).padStart(2,'0'); if(rem<=0){ stopTimer() } }, 250); }
function stopTimer(){ if(tickId){ clearInterval(tickId); tickId=null } recordSession(); applyState({running:false}, true); statusText.textContent = 'Idle'; refreshPatientUI() }
  startBtn.addEventListener('click', function(){ startTimer(); publishState() });
  endBtn.addEventListener('click', function(){ stopTimer(); publishState() });
  wsConnectBtn.addEventListener('click', function(){ wsConnect(); updateJoinLink() });
  wsDisconnectBtn.addEventListener('click', wsDisconnect);
  wsUrl.addEventListener('input', updateJoinLink);
  wsSession.addEventListener('input', updateJoinLink);
  copyJoinLink.addEventListener('click', function(){ if(joinLink.value){ navigator.clipboard && navigator.clipboard.writeText(joinLink.value) } });
  openPatient.addEventListener('click', function(){ window.open('patient.html','bls-patient'); });
  renderer.resize(360,220);
  updateSpeedLabel(); updateSizeLabel(); updateYPercentLabel(); updateTimerLabel(); updateGlowIntensityLabel(); updateGlowRateLabel(); updateRampLabel(); updateEdgePauseLabel(); updateWiggleLabel(); updatePanRateLabel(); updateCueRateLabel(); updateVolumeLabel(); statusText.textContent = state.running? 'Running':'Idle'; setActive(shapeControls,'shape','shape'); setActive(directionControls,'direction','direction'); setActive(easingControls,'easing','easingMode');
  audioEnable.checked = !!state.audioEnabled; if(state.audioName){ var opt = document.createElement('option'); opt.value = state.audioName; opt.textContent = state.audioName; audioSelect.appendChild(opt); audioSelect.value = state.audioName }
  glowEnable.checked = !!state.glowEnabled;
  glowIntensity.value = Math.round((state.glowIntensity||1)*100);
  rampEnable.checked = !!state.rampEnabled;
  rampSeconds.value = parseInt(state.rampSeconds||10,10);
  edgePause.value = parseInt(state.edgePauseMs||0,10);
  wiggleEnable.checked = !!state.wiggleEnabled;
  wiggleAmplitude.value = parseInt(state.wiggleAmplitude||0,10);
  audioMode.value = state.audioMode || 'programmatic';
  programPreset.value = state.programPreset || 'pink';
  syncPan.checked = !!state.syncPan;
  panRate.value = String(state.panRate||0.5);
  cueRate.value = String(state.cueRate||1.2);
  volume.value = String(Math.round((state.volume||0.6)*100));
  glowRate.value = String(state.glowRate||0.5);
  refreshAudioMode();
  updateKnobSensLabel();
  yPercent.value = parseInt(state.yPercent||50,10);
  updateYPercentLabel();
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
  var joinLink = document.getElementById('joinLink');
  var copyJoinLink = document.getElementById('copyJoinLink');
  var ws = null; var wsConnected = false; var wsSid = null;
  function updateJoinLink(){ var url = (wsUrl.value||'').trim(); var sid = (wsSession.value||'').trim(); var base = location.origin + '/patient.html'; if(url && sid){ joinLink.value = base + '?url=' + encodeURIComponent(url) + '&sid=' + encodeURIComponent(sid) } else { joinLink.value = '' } }
  function wsConnect(){ var url = (wsUrl.value||'').trim(); var sid = (wsSession.value||'').trim()||'default'; if(ws){ try{ ws.close() }catch(e){} ws=null } if(!url){ wsStatus.textContent = 'Missing URL'; return } ws = new WebSocket(url); wsSid = sid; wsStatus.textContent = 'Connecting...'; ws.onopen = function(){ wsConnected = true; wsStatus.textContent = 'Connected'; try{ ws.send(JSON.stringify({type:'join', sessionId:sid, role:'admin'})) }catch(e){} }; ws.onclose = function(){ wsConnected = false; wsStatus.textContent = 'Disconnected' }; ws.onerror = function(){ wsStatus.textContent = 'Error' }; ws.onmessage = function(ev){ try{ var msg = JSON.parse(ev.data); if(msg && msg.type==='joined'){ wsStatus.textContent = 'Connected' } }catch(e){} } }
  function wsDisconnect(){ if(ws){ try{ ws.close() }catch(e){} } ws=null; wsConnected=false; wsStatus.textContent = 'Disconnected' }
