;(function(){
  function createPC(){
    var RTC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var pc = new RTC({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    return pc
  }
  var NetRTC = {
    pc: null,
    dc: null,
    role: null,
    onmsg: null,
    startOfferer: async function(){
      this.role = 'offerer';
      this.pc = createPC();
      this.dc = this.pc.createDataChannel('bls');
      var self=this;
      this.dc.onmessage = function(ev){ try{ var m=JSON.parse(ev.data); if(self.onmsg) self.onmsg(m) }catch(_){ } };
      await this.pc.setLocalDescription(await this.pc.createOffer());
      var done = new Promise(function(resolve){
        if(self.pc.iceGatheringState==='complete'){ resolve() } else {
          var check = function(){ if(self.pc.iceGatheringState==='complete'){ self.pc.removeEventListener('icegatheringstatechange', check); resolve() } };
          self.pc.addEventListener('icegatheringstatechange', check)
        }
      });
      await done;
      return btoa(JSON.stringify(self.pc.localDescription))
    },
    acceptAnswer: async function(answerStr){
      var desc = JSON.parse(atob(answerStr));
      await this.pc.setRemoteDescription(desc)
    },
    startAnswerer: async function(offerStr){
      this.role = 'answerer';
      this.pc = createPC();
      var self=this;
      this.pc.ondatachannel = function(e){ self.dc = e.channel; self.dc.onmessage = function(ev){ try{ var m=JSON.parse(ev.data); if(self.onmsg) self.onmsg(m) }catch(_){ } } };
      await this.pc.setRemoteDescription(JSON.parse(atob(offerStr)));
      await this.pc.setLocalDescription(await this.pc.createAnswer());
      var done = new Promise(function(resolve){
        if(self.pc.iceGatheringState==='complete'){ resolve() } else {
          var check = function(){ if(self.pc.iceGatheringState==='complete'){ self.pc.removeEventListener('icegatheringstatechange', check); resolve() } };
          self.pc.addEventListener('icegatheringstatechange', check)
        }
      });
      await done;
      return btoa(JSON.stringify(self.pc.localDescription))
    },
    send: function(obj){ if(this.dc && this.dc.readyState==='open'){ try{ this.dc.send(JSON.stringify(obj)) }catch(_){ } } },
    onMessage: function(cb){ this.onmsg = cb },
    disconnect: function(){ try{ if(this.dc) this.dc.close() }catch(_){} try{ if(this.pc) this.pc.close() }catch(_){} this.dc=null; this.pc=null; this.onmsg=null; this.role=null }
  };
  window.NetRTC = NetRTC
})();

