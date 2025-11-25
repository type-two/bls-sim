;(function(){
  var STORE = 'bls_mappings'
  function load(){ try{ var m = JSON.parse(localStorage.getItem(STORE)||'null'); return Array.isArray(m)? m: [] }catch(_){ return [] } }
  function save(m){ try{ localStorage.setItem(STORE, JSON.stringify(m||[])) }catch(_){ } }
  var actions = {}
  var waiting = null
  var midiAccess = null
  var midiInput = null
  function setStatus(on){ var dot = document.getElementById('ctlStatusDot'); var text = document.getElementById('ctlStatusText'); if(dot) dot.classList.toggle('on', !!on); if(text) text.textContent = on? 'Device connected' : 'No device' }
  function handleMIDIMessage(ev){ var data = ev.data||[]; var status = data[0]||0; var code = data[1]||0; var val = data[2]||0; var type = (status & 0xF0); var isNoteOn = (type===0x90 && val>0); var isCC = (type===0xB0);
    if(waiting){ var map = { source:'midi', deviceId:(midiInput && midiInput.id)||'default', type:isNoteOn? 'note':'cc', code:code, actionId:waiting }; var all=load(); all.push(map); save(all); waiting=null; updateMappingsUI(); return }
    var all = load(); for(var i=0;i<all.length;i++){ var m=all[i]; if(m.source==='midi' && (!midiInput || m.deviceId===(midiInput.id||'default'))){ if((m.type==='note' && isNoteOn && m.code===code) || (m.type==='cc' && isCC && m.code===code)){ var fn = actions[m.actionId]; if(typeof fn==='function') fn(val) } } }
  }
  function setupMIDI(){ if(!navigator.requestMIDIAccess) return; navigator.requestMIDIAccess().then(function(acc){ midiAccess=acc; var inputs = Array.from(acc.inputs.values()); midiInput = inputs[0]||null; if(midiInput){ midiInput.onmidimessage = handleMIDIMessage; setStatus(true) } else { setStatus(false) } var sel = document.getElementById('midiSelect'); if(sel){ var html = inputs.map(function(i){ return '<option value="'+i.id+'">'+(i.name||i.id)+'</option>' }).join(''); sel.innerHTML = html; sel.addEventListener('change', function(){ var id = sel.value; var input = acc.inputs.get(id); midiInput = input||null; if(midiInput){ midiInput.onmidimessage = handleMIDIMessage; setStatus(true) } else { setStatus(false) } }) }
  }).catch(function(){ setStatus(false) }) }
  function handleKeyDown(ev){ var all = load(); if(waiting){ var key = ev.code || ev.key || ''; if(!key) return; var map = { source:'keyboard', key:key, actionId:waiting }; all.push(map); save(all); waiting=null; updateMappingsUI(); return } for(var i=0;i<all.length;i++){ var m=all[i]; if(m.source==='keyboard'){ var hit = (m.key===ev.code || m.key===ev.key); if(hit){ var fn = actions[m.actionId]; if(typeof fn==='function') fn(ev) } } } }
  window.addEventListener('keydown', handleKeyDown)
  function updateMappingsUI(){ var host = document.getElementById('ctlMappings'); if(!host) return; var all = load(); var html = all.map(function(m, idx){ var label = m.source==='keyboard'? (m.key||'') : (m.type+' '+m.code); return '<div>'+m.source+' • '+label+' → '+m.actionId+' <button data-idx="'+idx+'">Delete</button></div>' }).join(''); host.innerHTML = html; host.querySelectorAll('button').forEach(function(b){ b.addEventListener('click', function(){ var idx = parseInt(b.dataset.idx,10); var arr = load(); arr.splice(idx,1); save(arr); updateMappingsUI() }) }) }
  var Controllers = {
    registerAction: function(id, fn){ actions[id]=fn },
    mapAction: function(id){ waiting = id },
    initPanel: function(){ setupMIDI(); updateMappingsUI(); var mapBtns = document.querySelectorAll('[data-map-action]'); mapBtns.forEach(function(btn){ btn.addEventListener('click', function(){ var id = btn.dataset.mapAction; waiting = id }) }) }
  }
  window.Controllers = Controllers
})();
