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
      <img src="assets/logo.jpg" alt="OXIMED Medikal">
      <div><b>OXIMED</b><small>TIBBİ CİHAZLAR</small></div>
    </a>
    <button class="hamb" aria-label="Menü"><span></span></button>
    <ul class="menu">
      ${NAV.map(([href, id, label]) => `<li><a href="${href}" class="${id === page ? "active" : ""}">${label}</a></li>`).join("")}
    </ul>
    <a class="call" href="tel:+905319188658">0531 918 86 58</a>
  </div></header>`;

document.getElementById("site-footer").innerHTML = `
  <footer class="site"><div class="wrap foot">
    <div><h3>OXIMED TIBBİ CİHAZLAR</h3><p>Uyku terapisi, oksijen tedavisi ve solunum ürünlerinde danışmanlık, kurulum ve teknik servis.</p></div>
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

const menu = document.querySelector(".menu");
document.querySelector(".hamb").onclick = () => menu.classList.toggle("open");
document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));

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
