const KEY = "siteNotebook.entries";
const TYPES = { material: "Material", expense: "Labour / other", income: "Payment received" };
const $ = id => document.getElementById(id);
const money = n => "\u20B9" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const today = () => new Date().toLocaleDateString("en-CA");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(d) ? d : []; } catch { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); }
  catch { alert("Could not save. Please check your browser storage settings."); }
}
function download(name, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

let entries = load();
$("date").value = today();

function render() {
  const sites = [...new Set(entries.map(e => e.site))].sort();
  const sf = $("siteFilter").value, tf = $("typeFilter").value, q = $("search").value.toLowerCase();
  $("siteFilter").innerHTML = '<option value="">All sites</option>' + sites.map(s => `<option${s === sf ? " selected" : ""}>${esc(s)}</option>`).join("");
  $("sites").innerHTML = sites.map(s => `<option value="${esc(s)}">`).join("");

  const shown = entries
    .filter(e => (!sf || e.site === sf) && (!tf || e.type === tf) && [e.site, e.party, e.desc].join(" ").toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const sum = f => shown.filter(f).reduce((t, e) => t + e.amount, 0);
  const received = sum(e => e.type === "income");
  const spent = sum(e => e.type !== "income");
  const due = sum(e => e.type !== "income" && !e.paid);
  const balance = received - spent;
  $("summary").innerHTML = [
    ["Received", money(received), "pos"], ["Spent", money(spent), ""],
    ["Balance", money(balance), balance < 0 ? "neg" : "pos"], ["Still to pay", money(due), due ? "neg" : ""]
  ].map(([k, v, c]) => `<div class="card"><span>${k}</span><b class="${c}">${v}</b></div>`).join("");

  $("list").innerHTML = shown.map(e => `<article class="entry ${e.type}">
    <div><span class="badge">${TYPES[e.type]}</span><strong>${esc(e.desc)}</strong>
      <small>${esc(e.date)} | ${esc(e.site)}${e.party ? " | " + esc(e.party) : ""}</small></div>
    <div class="side"><b class="amt">${e.type === "income" ? "+" : "-"}${money(e.amount)}</b>
      ${e.type !== "income" && !e.paid ? `<span class="due">Not paid</span><button class="ghost" data-paid="${e.id}">Mark paid</button>` : ""}
      <button class="ghost del" data-del="${e.id}">Delete</button></div>
  </article>`).join("");
  $("empty").hidden = shown.length > 0;
}

$("type").addEventListener("change", () => { $("paidWrap").hidden = $("type").value === "income"; });

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const type = $("type").value;
  entries.push({
    id: Date.now(), type, date: $("date").value,
    site: $("site").value.trim(), party: $("party").value.trim(), desc: $("desc").value.trim(),
    amount: parseFloat($("amount").value) || 0,
    paid: type === "income" ? true : $("paid").checked
  });
  save();
  ["party", "desc", "amount"].forEach(id => { $(id).value = ""; });
  render();
});

$("list").addEventListener("click", e => {
  const paidId = e.target.dataset.paid, delId = e.target.dataset.del;
  if (paidId) {
    const entry = entries.find(x => x.id === Number(paidId));
    if (entry) { entry.paid = true; save(); render(); }
  } else if (delId && confirm("Delete this entry?")) {
    entries = entries.filter(x => x.id !== Number(delId));
    save(); render();
  }
});

["search", "siteFilter", "typeFilter"].forEach(id => $(id).addEventListener("input", render));

$("backup").addEventListener("click", () =>
  download(`site-notebook-backup-${today()}.json`, JSON.stringify(entries, null, 2), "application/json"));

$("restore").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const ok = Array.isArray(data) && data.every(x => x && TYPES[x.type] && x.date && x.site && typeof x.amount === "number");
      if (!ok) throw new Error("bad file");
      if (confirm(`Replace current entries with ${data.length} entries from this backup?`)) {
        entries = data; save(); render();
      }
    } catch { alert("This file is not a valid Site Notebook backup."); }
    e.target.value = "";
  };
  reader.readAsText(file);
});

$("csv").addEventListener("click", () => {
  const cols = ["date", "type", "site", "party", "desc", "amount", "paid"];
  const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = entries.map(e => cols.map(c => cell(e[c])).join(","));
  download("site-notebook.csv", [cols.join(","), ...rows].join("\n"), "text/csv");
});

render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}