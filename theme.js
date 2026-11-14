(() => {
  const T = [["neon", "Neon Grid", "#00e5ff"], ["void", "Void", "#a66bff"], ["matrix", "Matrix", "#22ff88"], ["flare", "Solar Flare", "#ff6a1a"], ["arctic", "Arctic (light)", "#0069ff"]];
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const root = document.documentElement;
  const set = t => { root.dataset.theme = t; put("tarnip-theme2", t); document.querySelectorAll(".tl [data-t]").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t)); };
  const motion = m => { root.dataset.motion = m; put("tarnip-motion", m); const b = document.querySelector(".tm"); if (b) b.textContent = "Animations: " + (m === "on" ? "ON" : "OFF"); };
  const saved = get("tarnip-theme2");
  root.dataset.theme = T.some(t => t[0] === saved) ? saved : "neon";
  root.dataset.motion = get("tarnip-motion") === "off" ? "off" : "on";
  addEventListener("DOMContentLoaded", () => {
    const d = document.createElement("div"); d.className = "tp";
    d.innerHTML = `<button class="tg" aria-label="Choose theme" title="Theme">◐</button><div class="tl" hidden>${T.map(t => `<button data-t="${t[0]}" aria-pressed="false"><i style="background:${t[2]}"></i>${t[1]}</button>`).join("")}<button class="tm"></button></div>`;
    document.body.append(d);
    d.querySelector(".tg").onclick = () => { const l = d.querySelector(".tl"); l.hidden = !l.hidden; };
    d.querySelectorAll(".tl [data-t]").forEach(b => b.onclick = () => set(b.dataset.t));
    d.querySelector(".tm").onclick = () => motion(root.dataset.motion === "on" ? "off" : "on");
    set(root.dataset.theme); motion(root.dataset.motion);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }));
    const scan = () => document.querySelectorAll(".rv:not(.seen)").forEach(n => { n.classList.add("seen"); io.observe(n); });
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true }); scan();
    setTimeout(() => document.querySelectorAll(".rv").forEach(n => n.classList.add("in")), 3500); // failsafe: never leave content hidden
  });
})();
