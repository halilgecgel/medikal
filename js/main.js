const NAV = [
  ["index.html", "home", "Ana Sayfa"],
  ["urunler.html", "urunler", "Ürünler"],
  ["hizmetler.html", "hizmetler", "Hizmetler"],
  ["markalar.html", "markalar", "Markalar"],
  ["servis.html", "servis", "Teknik Servis"],
  ["iletisim.html", "iletisim", "İletişim"]
];

const page = document.body.dataset.page || "home";

document.getElementById("site-header").innerHTML = `
  <div class="topbar"><div class="wrap"><span>Şehitkamil / Gaziantep</span><span>Uyku · Oksijen · Solunum · Teknik Servis</span></div></div>
  <header class="site"><div class="wrap nav">
    <a class="logo" href="index.html">
      <span class="logo-mark" aria-hidden="true"></span>
      <div><b>OXIMED</b><small>TIBBİ CİHAZLAR</small></div>
    </a>
    <button class="hamb" aria-label="Menü"><span></span></button>
    <ul class="menu">
      ${NAV.map(([href, id, label]) => `<li><a href="${href}" class="${id === page ? "active" : ""}">${label}</a></li>`).join("")}
    </ul>
    <button class="theme" type="button" aria-label="Temayı değiştir">
      <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5z"/></svg>
      <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>
    </button>
    <a class="call" href="tel:+905319188658">0531 918 86 58</a>
  </div></header>`;

document.getElementById("site-footer").innerHTML = `
  <footer class="site"><div class="wrap foot">
    <div>
      <div class="foot-brand"><span class="logo-mark" aria-hidden="true"></span><h3>OXIMED</h3></div>
      <p>Uyku terapisi, oksijen tedavisi ve solunum ürünlerinde danışmanlık, kurulum ve teknik servis.</p>
    </div>
    <div><h3>SAYFALAR</h3>${NAV.map(([href, , label]) => `<a href="${href}">${label}</a>`).join("")}</div>
    <div><h3>İLETİŞİM</h3>
      <a href="tel:+905319188658">0531 918 86 58</a>
      <a href="tel:+905373053545">0537 305 35 45</a>
      <a href="https://wa.me/905319188658">WhatsApp</a>
      <span>Mücahitler Mah. Şehit Adil Büyükcengiz Sok.<br>Şehitkamil / Gaziantep</span>
    </div>
  </div><div class="wrap copy">© 2026 OXIMED Tıbbi Cihazlar</div></footer>
  <a class="wa" href="https://wa.me/905319188658" aria-label="WhatsApp">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 11.5A8.5 8.5 0 0 1 6.7 18.8L4 20l1.3-2.6A8.5 8.5 0 1 1 20 11.5zm-8.5 7a7 7 0 0 0 3.6-1l.3-.2 2.1.6-.6-2 .2-.3a7 7 0 1 0-5.6 2.9zm3.8-5.2c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1-.5.7-.7.8-.2.2-.4.1a5.7 5.7 0 0 1-1.7-1 6.3 6.3 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.4.1-.2a.5.5 0 0 0 0-.4c0-.1-.5-1.2-.7-1.6s-.3-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.4 2.4 0 0 0-.8 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.6 3.2 4 4 0 0 0 2.5.7 2.1 2.1 0 0 0 1.4-.7 1.7 1.7 0 0 0 .4-1.1c0-.1 0-.2-.2-.3z"/></svg>
  </a>`;

if (!document.getElementById("stage")) {
  const host = document.querySelector(".page-hero");
  if (host) {
    const c = document.createElement("canvas");
    c.id = "stage";
    c.dataset.mode = "ornament";
    host.prepend(c);
  }
}

const bar = document.createElement("div");
bar.className = "scroll-progress";
document.body.appendChild(bar);
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
}, { passive: true });

document.querySelector(".theme").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("oximed-theme", next);
  const live = document.querySelector('meta[data-theme-live]');
  if (live) live.content = next === "dark" ? "#070d18" : "#f4f7fb";
  document.dispatchEvent(new Event("themechange"));
};

const menu = document.querySelector(".menu");
document.querySelector(".hamb").onclick = () => menu.classList.toggle("open");
document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));

const revealEls = document.querySelectorAll(".reveal");
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.14 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

const loader = document.getElementById("loader");
let closed = false;
function finish() {
  if (closed) return;
  closed = true;
  document.documentElement.classList.add("ready");
  if (loader) {
    loader.classList.add("done");
    setTimeout(() => loader.remove(), 800);
  }
}
if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
else {
  const kill = setTimeout(finish, 2600);
  window.addEventListener("load", () => setTimeout(() => { clearTimeout(kill); finish(); }, 700));
}

const form = document.getElementById("serviceForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const g = (id) => document.getElementById(id).value.trim();
    if (!g("name") || !g("phone") || !g("note")) {
      document.getElementById("formNote").textContent = "Ad, telefon ve servis notu gerekli.";
      return;
    }
    const text = `OXIMED Teknik Servis Talebi\nAd/Firma: ${g("name")}\nTelefon: ${g("phone")}\nCihaz: ${g("type")}\nMarka: ${g("brand")}\nModel: ${g("model")}\nSeri No: ${g("serial")}\nGaranti: ${g("warranty")}\nRandevu: ${g("date")}\nTeknik Servis Notu: ${g("note")}`;
    document.getElementById("formNote").textContent = "WhatsApp açılıyor…";
    window.open("https://wa.me/905319188658?text=" + encodeURIComponent(text), "_blank");
  });
}
