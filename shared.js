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
