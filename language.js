/* Language navigation changes the page, never the shared garden records. */
document.addEventListener('click',async function(event){
  var link=event.target.closest('[data-language-switch]');
  if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  if(!navigator.onLine){
    var ready=false,worker=navigator.serviceWorker&&navigator.serviceWorker.controller;
    if(worker)ready=await new Promise(function(resolve){
      var channel=new MessageChannel(),timer=setTimeout(function(){channel.port1.close();resolve(false);},3000);
      channel.port1.onmessage=function(e){clearTimeout(timer);channel.port1.close();resolve(!!(e.data&&e.data.ready));};
      worker.postMessage({type:'CHECK_OFFLINE',lang:link.lang==='en'?'en':'ja'},[channel.port2]);
    });
    if(!ready){alert(document.documentElement.lang==='en'?'This language is not ready offline. Connect to the internet once to open it. Your records are unchanged.':'この言語はまだ通信なしでは使えません。一度インターネットにつないでから切り替えてください。記録はそのまま残っています。');return;}
  }
  var message=document.documentElement.lang==='en'
    ? 'Saved garden records are shared between languages. Unfinished entries will not be carried over. Switch language?'
    : '保存済みの畑と記録はそのまま使えます。入力途中の内容は引き継がれません。言語を切り替えますか？';
  if(window.confirm(message))window.location.assign(link.href);
});
