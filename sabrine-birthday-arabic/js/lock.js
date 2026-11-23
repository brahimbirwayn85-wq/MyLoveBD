/* مؤقت فتح الموقع
   يفتح الموقع يوم 23 نوفمبر 2026 عند الساعة 23:00 بتوقيت GMT (UTC) */
(function () {
  // شهر نوفمبر = 10 في JavaScript لكن نستخدم صيغة ISO لتفادي الالتباس
  var UNLOCK_AT = Date.parse("2026-11-23T23:00:00Z");
  var root = document.documentElement;

  // فرق التوقيت بين ساعة الجهاز وساعة الخادم (لتقليل التلاعب بساعة الجهاز)
  var offset = 0;

  function now() { return Date.now() + offset; }
  function isOpen() { return now() >= UNLOCK_AT; }

  // الموقع مقفل افتراضياً عبر CSS، ولا يُفتح إلا بإضافة الكلاس "unlocked"
  if (isOpen()) root.classList.add("unlocked");

  function toArabic(value, pad) {
    var s = String(value);
    while (pad && s.length < pad) s = "0" + s;
    return s.replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[Number(d)]; });
  }

  function unlock() {
    root.classList.add("unlocked");
    var screen = document.getElementById("lockScreen");
    if (screen) screen.remove();
  }

  function start() {
    var screen = document.getElementById("lockScreen");
    if (!screen) return;
    var parts = {
      days: document.getElementById("lockDays"),
      hours: document.getElementById("lockHours"),
      minutes: document.getElementById("lockMinutes"),
      seconds: document.getElementById("lockSeconds")
    };

    function tick() {
      var diff = UNLOCK_AT - now();
      if (diff <= 0) { unlock(); return; }
      var total = Math.floor(diff / 1000);
      parts.days.textContent = toArabic(Math.floor(total / 86400));
      parts.hours.textContent = toArabic(Math.floor((total % 86400) / 3600), 2);
      parts.minutes.textContent = toArabic(Math.floor((total % 3600) / 60), 2);
      parts.seconds.textContent = toArabic(total % 60, 2);
      setTimeout(tick, 1000 - (now() % 1000));
    }

    if (isOpen()) { unlock(); return; }
    tick();
  }

  function syncWithServer() {
    if (!window.fetch || location.protocol === "file:") return;
    fetch(location.href, { method: "HEAD", cache: "no-store" })
      .then(function (res) {
        var header = res.headers.get("Date");
        var serverTime = header ? Date.parse(header) : NaN;
        if (!isNaN(serverTime)) {
          offset = serverTime - Date.now();
          if (isOpen()) unlock();
          else root.classList.remove("unlocked");
        }
      })
      .catch(function () { /* نكتفي بساعة الجهاز */ });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  syncWithServer();
})();
