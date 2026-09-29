/*
  TEMPORARY palette switcher - for comparing colour palettes.
  Remove this file and its <script> tag from each page once a palette is chosen,
  then copy the chosen palette's values into :root in css/styles.css.
  Tip: add ?palette=teal-coral (or teal-gold / chocolate-gold / sandstone / original) to a URL to share a view.
*/
(function () {
  var PALETTES = [
    { id: "original", label: "Original", swatch: ["#0b3743", "#f6be00", "#93dae1"] },
    { id: "teal-gold", label: "Teal + Amber Gold", swatch: ["#0b3743", "#e0a63a", "#cfe6e8"] },
    { id: "teal-coral", label: "Teal + Coral", swatch: ["#0b3743", "#ee7f62", "#e0a63a"] },
    { id: "chocolate-gold", label: "Chocolate & Gold", swatch: ["#3b2320", "#e3a43a", "#f08a6c"] },
    { id: "sandstone", label: "Sandstone", swatch: ["#f2e8da", "#5a2e2a", "#d99a2b"] }
  ];
  var KEY = "site-palette";
  var root = document.documentElement;

  function read() {
    var q = new URLSearchParams(location.search).get("palette");
    if (q) return q;
    try { return localStorage.getItem(KEY) || "original"; } catch (e) { return "original"; }
  }
  function apply(id) {
    if (id === "original") root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
    var btns = document.querySelectorAll("#palette-switcher button[data-id]");
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.id === id)); });
  }

  // apply immediately (script is in <head>) to avoid a flash of the old palette
  var current = read();
  apply(current);

  document.addEventListener("DOMContentLoaded", function () {
    var css = document.createElement("style");
    css.textContent =
      "#palette-switcher{position:fixed;right:16px;bottom:16px;z-index:9999;background:#fff;color:#1c1c1c;" +
      "border:1px solid rgba(0,0,0,.15);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.2);" +
      "font:13px/1.3 Montserrat,system-ui,sans-serif;padding:10px;width:200px}" +
      "#palette-switcher .ps-head{display:flex;justify-content:space-between;align-items:center;font-weight:700;margin:0 2px 8px}" +
      "#palette-switcher .ps-min{border:0;background:none;cursor:pointer;font-size:16px;line-height:1;padding:2px 6px;color:#555}" +
      "#palette-switcher button[data-id]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;cursor:pointer;" +
      "border:2px solid transparent;background:#f5f5f5;border-radius:10px;padding:7px 8px;margin-top:6px;font:inherit;color:inherit}" +
      "#palette-switcher button[aria-pressed=true]{border-color:#1c1c1c;background:#fff}" +
      "#palette-switcher .ps-sw{display:flex}" +
      "#palette-switcher .ps-sw i{width:14px;height:14px;border-radius:50%;margin-right:-4px;border:1px solid rgba(0,0,0,.2)}" +
      "#palette-switcher.ps-collapsed .ps-body{display:none}" +
      "#palette-switcher.ps-collapsed{width:auto}" +
      "#palette-switcher .ps-hint{margin:8px 2px 0;color:#666;font-size:11px}";
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.id = "palette-switcher";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Colour palette preview");
    var html = '<div class="ps-head"><span>Palette</span><button class="ps-min" type="button" aria-label="Collapse">–</button></div><div class="ps-body">';
    PALETTES.forEach(function (p) {
      html += '<button type="button" data-id="' + p.id + '"><span class="ps-sw">' +
        p.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
        '</span><span style="margin-left:6px">' + p.label + "</span></button>";
    });
    html += '<p class="ps-hint">Keys 1–5 switch palettes. Choice is kept across pages.</p></div>';
    box.innerHTML = html;
    document.body.appendChild(box);

    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-id]");
      if (b) apply(b.dataset.id);
      if (e.target.closest(".ps-min")) {
        box.classList.toggle("ps-collapsed");
        e.target.textContent = box.classList.contains("ps-collapsed") ? "+" : "–";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (/input|textarea/i.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      var i = parseInt(e.key, 10);
      if (i >= 1 && i <= PALETTES.length) apply(PALETTES[i - 1].id);
    });
    apply(current);
  });
})();
