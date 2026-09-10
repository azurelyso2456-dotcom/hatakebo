/* No accounts or uploads: only the public application files are cached. */
(function(){
  function status(value){window.hatakeboOfflineStatus=value;window.dispatchEvent(new Event('hatakebo-offline-status'));}
  status('preparing');
  if(!('serviceWorker' in navigator)||!window.isSecureContext){status('unavailable');return;}
  var checking=false;
  async function check(){
    if(checking)return;checking=true;
    try {
      var registration=await navigator.serviceWorker.getRegistration();
      var worker=registration&&registration.active;
      if(!worker){status(navigator.onLine?'preparing':'unavailable');return;}
      var ready=await new Promise(function(resolve){
        var channel=new MessageChannel(),timer=setTimeout(function(){channel.port1.close();resolve(false);},5000);
        channel.port1.onmessage=function(e){clearTimeout(timer);channel.port1.close();resolve(e.data&&e.data.ready===true);};
        worker.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);
      });
      status(ready?(navigator.onLine?'ready':'offline'):'unavailable');
    }catch(e){status('unavailable');}finally{checking=false;}
  }
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(function(reg){
    check();
    function watch(worker){if(!worker)return;worker.addEventListener('statechange',function(){if(worker.state==='activated'||worker.state==='redundant')check();});}
    watch(reg.installing);reg.addEventListener('updatefound',function(){watch(reg.installing);});
    navigator.serviceWorker.ready.then(check);
  }).catch(function(){status('unavailable');});
  navigator.serviceWorker.addEventListener('controllerchange',check);
  window.addEventListener('online',function(){check();navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update().catch(function(){});});});
  window.addEventListener('offline',check);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)check();});
})();
