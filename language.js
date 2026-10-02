/* Language navigation changes the page, never the shared garden records. */
document.addEventListener('click',function(event){
  var link=event.target.closest('[data-language-switch]');
  if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  var message=document.documentElement.lang==='en'
    ? 'Saved garden records are shared between languages. Unfinished entries will not be carried over. Switch language?'
    : '保存済みの畑と記録はそのまま使えます。入力途中の内容は引き継がれません。言語を切り替えますか？';
  if(!window.confirm(message))event.preventDefault();
});
