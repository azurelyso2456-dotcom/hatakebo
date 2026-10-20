/* Existing Japanese-only analytics; loaded only after the notebook is opened. */
(function () {
  function begin() {
    var connection = navigator.connection;
    if (!navigator.onLine || (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType) || connection.downlink <= 1))) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-EJKX7Y947N');
    var tag = document.createElement('script'); tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-EJKX7Y947N';
    document.head.appendChild(tag);
  }
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, { once: true });
})();
