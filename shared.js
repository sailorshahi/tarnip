const sb = supabase.createClient(TARNIP.url, TARNIP.key);
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
async function me() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
  return { ...user, is_admin: !!data?.is_admin };
}
async function settings() {
  const { data } = await sb.from("site_settings").select("*");
  return Object.fromEntries((data || []).map(r => [r.key, r.value]));
}
function authBox(el, onDone) {
  el.innerHTML = `<form id="af"><h2>Sign in or create account</h2><label>Email<input name="e" type="email" required></label><label>Password<input name="p" type="password" minlength="6" required></label><div class="row"><button name="in">Sign in</button><button name="up" class="alt" type="button">Create account</button></div><p id="am" role="alert"></p></form>`;
  const go = async up => {
    const f = $("#af"), c = { email: f.e.value, password: f.p.value };
    const { error } = up ? await sb.auth.signUp(c) : await sb.auth.signInWithPassword(c);
    if (error) $("#am").textContent = error.message; else onDone(up);
  };
  $("#af").onsubmit = e => { e.preventDefault(); go(false); };
  $("#af [name=up]").onclick = () => go(true);
}
// Generated SVG pictures, themed through CSS variables. Picks art from product text; image_url overrides it.
function art(txt = "", kind = "") {
  const t = (txt + " " + kind).toLowerCase();
  if (/drone|uav|quad/.test(t)) return `<svg class="art" viewBox="0 0 220 150" role="img" aria-label="Drone"><g class="float"><path class="st" d="M72 72L42 42M148 72L178 42M72 82L42 112M148 82L178 112"/><rect class="f1" x="82" y="56" width="56" height="38" rx="14"/><circle class="f2" cx="110" cy="75" r="9"/><path class="st" d="M96 96v10M124 96v10"/>${[[42, 42], [178, 42], [42, 112], [178, 112]].map(([x, y], i) => `<ellipse class="f3 rot" style="animation-delay:-${i * .07}s" cx="${x}" cy="${y}" rx="24" ry="4"/>`).join("")}</g></svg>`;
  if (/aqua|water|tank|pump|leak/.test(t)) return `<svg class="art" viewBox="0 0 220 150" role="img" aria-label="Water tank"><defs><clipPath id="tk"><rect x="65" y="22" width="90" height="108" rx="12"/></clipPath></defs><rect class="f3" x="65" y="22" width="90" height="108" rx="12"/><g clip-path="url(#tk)"><path class="f1 wave" d="M-100 70q25-14 50 0t50 0t50 0t50 0t50 0t50 0V140H-100z"/></g><rect class="no st" x="65" y="22" width="90" height="108" rx="12"/><path class="st" d="M155 40h30v-14M65 118H35"/><circle class="f2 drop" cx="185" cy="40" r="4"/></svg>`;
  if (/gate|attend|auth|rfid|bio|access/.test(t)) return `<svg class="art" viewBox="0 0 220 150" role="img" aria-label="Attendance terminal"><g class="float"><rect class="f3" x="72" y="12" width="76" height="126" rx="14"/><rect class="f1" x="83" y="24" width="54" height="36" rx="6"/><path class="st2 tick" d="M97 42l8 8 16-16"/><g class="no st pulse"><circle cx="110" cy="96" r="8"/><circle cx="110" cy="96" r="15"/><circle cx="110" cy="96" r="22"/></g></g></svg>`;
  return `<svg class="art" viewBox="0 0 220 150" role="img" aria-label="Software dashboard"><rect class="f3" x="22" y="18" width="176" height="114" rx="10"/><rect class="f1" x="22" y="18" width="176" height="18" rx="10"/>${[0, 1, 2, 3, 4].map(i => `<rect class="f1 bar" style="animation-delay:${i * .15}s" x="${40 + i * 28}" y="${110 - [30, 52, 38, 66, 48][i]}" width="18" height="${[30, 52, 38, 66, 48][i]}" rx="3"/>`).join("")}<path class="st2 no" d="M40 70l28-14 28 8 28-24 28 14"/></svg>`;
}
const pic = p => `<div class="pic">${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">` : art(p.name + " " + (p.slug || ""), p.kind)}</div>`;
