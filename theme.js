(() => {
  const T = [["turnip", "Turnip", "#5b2f91"], ["midnight", "Midnight", "#b793ea"], ["aqua", "Aqua", "#0a8f9c"], ["solar", "Solar", "#d9730d"], ["forest", "Forest", "#4ade80"]];
  let s = null; try { s = localStorage.getItem("tarnip-theme"); } catch (e) {}
  const set = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem("tarnip-theme", t); } catch (e) {} document.querySelectorAll(".tp button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t)); };
  set(s || (matchMedia("(prefers-color-scheme:dark)").matches ? "midnight" : "turnip"));
  addEventListener("DOMContentLoaded", () => {
    const d = document.createElement("div"); d.className = "tp";
    d.innerHTML = `<button class="tg" aria-label="Choose theme" title="Theme">🎨</button><div class="tl" hidden>${T.map(t => `<button data-t="${t[0]}" aria-pressed="false"><i style="background:${t[2]}"></i>${t[1]}</button>`).join("")}</div>`;
    document.body.append(d);
    d.querySelector(".tg").onclick = () => { const l = d.querySelector(".tl"); l.hidden = !l.hidden; };
    d.querySelectorAll(".tl button").forEach(b => b.onclick = () => set(b.dataset.t));
    set(document.documentElement.dataset.theme);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }));
    const scan = () => document.querySelectorAll(".rv:not(.seen)").forEach(n => { n.classList.add("seen"); io.observe(n); });
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true }); scan();
  });
})();
