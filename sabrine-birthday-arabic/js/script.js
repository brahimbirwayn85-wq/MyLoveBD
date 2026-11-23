/* منطق الفصول والتفاعلات */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const chapters = $$(".chapter");
const chapterNames = ["البداية", "يومكِ", "أحب فيكِ", "حكايتنا", "رسالتي", "لو كنت بقربكِ", "أمنيتكِ"];
let currentChapter = 0;

function toArabicNumber(value) {
  return String(value).replace(/\d/g, digit => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}
function showChapter(index) {
  if (index < 0 || index >= chapters.length) return;
  currentChapter = index;
  chapters.forEach((chapter, i) => {
    chapter.classList.toggle("active", i === index);
    chapter.setAttribute("aria-hidden", String(i !== index));
  });
  $("#previousChapter").disabled = index === 0;
  $("#nextChapter").textContent = index === chapters.length - 1 ? "العودة إلى البداية" : "الفصل التالي";
  $("#chapterCount").textContent = `${toArabicNumber(index + 1)} / ${toArabicNumber(chapters.length)}`;
  $("#chapterName").textContent = chapterNames[index] || "";
  $("#progressFill").style.width = `${((index + 1) / chapters.length) * 100}%`;
  chapters[index].scrollTop = 0;
}
$("#previousChapter").addEventListener("click", () => showChapter(currentChapter - 1));
$("#nextChapter").addEventListener("click", () => showChapter(currentChapter === chapters.length - 1 ? 0 : currentChapter + 1));
$("#openWorld").addEventListener("click", () => showChapter(1));
showChapter(0);

const toast = message => {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => node.classList.remove("show"), 2600);
};

const music = $("#backgroundMusic");
const musicToggle = $("#musicToggle");
const musicLabel = $("#musicLabel");
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "الموسيقى تعمل";
    } catch (error) {
      toast("أضيفي ملف الموسيقى إلى مجلد الملفات أولاً.");
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "الموسيقى متوقفة";
  }
});

$$(".candle").forEach(candle => candle.addEventListener("click", () => {
  candle.classList.toggle("lit");
  if ($$(".candle.lit").length === 0) {
    $("#candleMessage").innerHTML = `<span class="tiny-label">أمنية لكِ ♡</span><p>أتمنى أن تتحقق لكِ أمنية جميلة واحدة على الأقل هذا العام.</p>`;
    toast("أُطفئت الشموع! لا تنسي أمنيتكِ ✨");
  }
}));

$$(".reason-card").forEach(card => card.addEventListener("click", () => {
  const isOpen = card.classList.toggle("open");
  card.setAttribute("aria-expanded", String(isOpen));
  $("small", card).textContent = isOpen ? "أغلقي البطاقة" : "افتحي البطاقة";
}));

const letterToggle = $("#letterToggle");
const letterPaper = $("#letterPaper");
letterToggle.addEventListener("click", () => {
  letterToggle.hidden = true;
  letterToggle.setAttribute("aria-expanded", "true");
  letterPaper.hidden = false;
  letterPaper.scrollIntoView({ behavior: "smooth", block: "start" });
});

const dreams = {
  gift: { icon: "🎁", label: "أولاً وقبل كل شيء", title: "هدية صغيرة", text: "سأختار لكِ شيئاً بعناية، ثم أنتظر ابتسامتكِ وأنتِ تفتحينه." },
  walk: { icon: "🌷", label: "على مهل", title: "نزهة هادئة", text: "سنمشي في مكان هادئ، ونتحدث عن كل شيء ولا شيء، من دون أن نستعجل الوقت." },
  treat: { icon: "🍰", label: "احتفال صغير", title: "شيء تحبينه", text: "سنختار شيئاً تحبينه ونستمتع به، وربما نختلف طويلاً حول ماذا نطلب." },
  hug: { icon: "♡", label: "الأمنية الأقرب إلى قلبي", title: "عناق طويل", text: "وبعد كل الخطط، سأريد شيئاً واحداً فقط: أن أكون هناك أخيراً وأعانقكِ في عيد ميلادكِ." }
};
$$(".daydream-choice").forEach(button => button.addEventListener("click", () => {
  $$(".daydream-choice").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const dream = dreams[button.dataset.dream];
  $("#dreamIcon").textContent = dream.icon;
  $("#dreamLabel").textContent = dream.label;
  $("#dreamTitle").textContent = dream.title;
  $("#dreamText").textContent = dream.text;
}));

$("#finalSurprise").addEventListener("click", () => {
  const secret = $("#finalSecret");
  secret.hidden = !secret.hidden;
  $("#finalSurprise").textContent = secret.hidden ? "سر صغير أخير ✧" : "احتفظي بهذه الأمنية ♡";
});

let foundStars = 0;
$$(".hidden-star").forEach(star => star.addEventListener("click", () => {
  if (star.dataset.found === "true") return;
  star.dataset.found = "true";
  star.style.opacity = ".25";
  star.style.pointerEvents = "none";
  foundStars++;
  toast(star.dataset.secret);
  $("#starCounter").textContent = foundStars === 3
    ? "وجدتِ النجمات الثلاث كلها. اكتمل عالمكِ الصغير. ♡"
    : `بقيت ${toArabicNumber(3 - foundStars)} نجمات صغيرة لتجديها.`;
}));
