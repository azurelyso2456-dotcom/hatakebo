/* One address, two views. Never upload, parse, replace or delete garden records. */
(function () {
  'use strict';
  var lang = document.documentElement.lang;
  if (!['ja', 'en', 'id', 'pl', 'sw'].includes(lang)) lang = 'ja';
  var messages = {
    ja: ['読み込みが完了しませんでした。通信を確認して、もう一度開いてください。保存済みの記録は削除していません。', 'もう一度開く'],
    en: ['Loading could not finish. Check your connection and try again. Your saved records have not been deleted.', 'Try again'],
    id: ['Pemuatan belum selesai. Periksa koneksi dan coba lagi. Catatan tersimpan tidak dihapus.', 'Coba lagi'],
    pl: ['Nie udało się zakończyć wczytywania. Sprawdź połączenie i spróbuj ponownie. Zapisane dane nie zostały usunięte.', 'Spróbuj ponownie'],
    sw: ['Upakiaji haujakamilika. Angalia muunganisho na ujaribu tena. Rekodi zako zilizohifadhiwa hazijafutwa.', 'Jaribu tena']
  };
  var requested = new URLSearchParams(location.search).get('open') === '1';
  var returning = false;
  try {
    // Even damaged records must reach the existing recovery screen, not the introduction.
    returning = localStorage.getItem('hatakebo_data') !== null ||
      localStorage.getItem('hatakebo_before_import') !== null ||
      localStorage.getItem('hatakebo_app_opened') === '1' ||
      localStorage.getItem('hatakebo_guideSeen') === '1';
  } catch (e) {
    // Let the application's storage-error screen handle inaccessible storage.
    returning = true;
  }
  document.documentElement.dataset.entryMode = requested || returning ? 'app' : 'intro';
  if (requested || returning) document.getElementById('entry-intro-style').disabled = true;
  var started = false;
  function script(src) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src; el.async = false;
      el.onload = resolve; el.onerror = reject;
      document.head.appendChild(el);
    });
  }
  function showError() {
    var root = document.getElementById('root');
    if (!root) return;
    var panel = document.createElement('section'), message = document.createElement('p'), retry = document.createElement('button');
    panel.style.cssText = 'max-width:680px;margin:32px auto;padding:24px;line-height:1.8';
    message.textContent = messages[lang][0]; message.setAttribute('role', 'alert');
    retry.type = 'button'; retry.textContent = messages[lang][1];
    retry.style.cssText = 'padding:12px 20px;font:inherit;cursor:pointer';
    retry.addEventListener('click', function () { location.reload(); });
    panel.append(message, retry); root.replaceChildren(panel);
  }
  async function start() {
    if (started) return; started = true;
    document.documentElement.dataset.entryMode = 'app';
    document.getElementById('entry-intro-style').remove();
    document.getElementById('entry-intro').remove();
    document.head.appendChild(document.getElementById('entry-app-styles').content.cloneNode(true));
    document.body.appendChild(document.getElementById('entry-app-view').content.cloneNode(true));
    try { localStorage.setItem('hatakebo_app_opened', '1'); } catch (e) {}
    if (requested) {
      var clean = new URL(location.href); clean.searchParams.delete('open');
      try { history.replaceState(null, '', clean.pathname + clean.search + clean.hash); } catch (e) {}
    }
    window.scrollTo(0, 0);
    try {
      // Download dependencies together, execute them in insertion order.
      await Promise.all(['vendor/react-18.3.1.min.js', 'vendor/react-dom-18.3.1.min.js',
        'record-safety.js', 'vegetables.js', 'vegetables-extra.js', 'landmarks.js'].map(script));
      await script('hatakebo' + (lang === 'ja' ? '' : '.' + lang) + '.runtime.js');
      await script('offline.js').catch(function () {
        window.hatakeboOfflineStatus = 'unavailable';
        window.dispatchEvent(new Event('hatakebo-offline-status'));
      });
      if (lang === 'ja') script('analytics.js').catch(function () {});
    } catch (e) { showError(); }
  }
  document.addEventListener('DOMContentLoaded', function () {
    if (requested || returning) { start(); return; }
    document.getElementById('entry-intro').addEventListener('click', function (event) {
      var link = event.target.closest('[data-open-notebook]');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); start();
    });
  }, { once: true });
})();
