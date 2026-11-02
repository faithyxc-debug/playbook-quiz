(function(){
"use strict";
// Set this to the public URL once the quiz is hosted (e.g. "https://<name>.github.io/emperor-quiz/").
var SITE_URL = "";
var Q = window.QUIZ, IMG = window.CAT_IMG;
var I = window.I18N, UI = I.UI, DAYS = I.DAYS, FB = I.fallback;
// Only languages that have a UI block are offered.
var LANGS = I.LANGS.filter(function(x){ return UI[x.code]; });
function langCfg(c){ return LANGS.filter(function(x){ return x.code === (c || lang); })[0] || LANGS[0]; }
function isLang(c){ return LANGS.some(function(x){ return x.code === c; }); }
var lang = FB, idx = 0, answers = [], result = null, twin = null;
try { var sv = localStorage.getItem("ep_lang"); if (sv && isLang(sv)) lang = sv; } catch(e){}
var qp = /[?&]lang=([a-z]{2})/.exec(location.search); if (qp && isLang(qp[1])) lang = qp[1];

function $(id){ return document.getElementById(id); }
function t(k, vars, lg){ var u = UI[lg || lang], s = (u && u[k] != null) ? u[k] : UI[FB][k]; if (vars) for (var v in vars) s = s.split("{"+v+"}").join(vars[v]); return s; }
function pick(o, c){ return o[c] != null ? o[c] : o[FB]; }
function L(o){ return pick(o, lang); }
function altCode(){ return langCfg().alt; }
function other(o){ return pick(o, altCode()); }
function typeById(id){ return Q.types.filter(function(x){ return x.id === id; })[0]; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function show(id){ ["intro","quiz","result"].forEach(function(s){ $(s).classList.toggle("active", s === id); }); window.scrollTo(0,0); }

function applyLang(){
  document.documentElement.lang = langCfg().html;
  $("langSel").value = lang; $("langSel").setAttribute("aria-label", t("langLabel"));
  document.querySelectorAll("[data-i18n]").forEach(function(el){ el.textContent = t(el.getAttribute("data-i18n")); });
  document.title = t("docTitle");
  var hs = $("zwHour"), keep = hs.value; hs.innerHTML = '<option value="">—</option>' + Q.hours.map(function(h,i){ return '<option value="'+i+'">'+esc(L(h))+'</option>'; }).join(""); hs.value = keep;
  if ($("quiz").classList.contains("active")) renderQ();
  if (result) renderResult();
  $("cardPreview").classList.add("hidden");
  renderShared();
}
function setLang(c){ if (!isLang(c)) return; lang = c; try { localStorage.setItem("ep_lang", lang); } catch(e){} applyLang(); }
$("langSel").innerHTML = LANGS.map(function(x){ return '<option value="' + x.code + '">' + esc(x.label) + '</option>'; }).join("");
$("langSel").onchange = function(){ setLang(this.value); };

// ---------- quiz ----------
function renderQ(){
  var q = Q.questions[idx], n = Q.questions.length;
  $("bar").style.width = (idx / n * 100) + "%";
  $("qnum").textContent = t("qnum", { n: idx+1, t: n });
  $("backBtn").style.visibility = idx ? "visible" : "hidden";
  $("qtext").textContent = L(q);
  $("qlead").textContent = q.lead ? L(q.lead) : ""; $("qlead").style.display = q.lead ? "" : "none";
  $("opts").innerHTML = "";
  q.a.forEach(function(o, i){
    var b = document.createElement("button"); b.type = "button"; b.className = "opt" + (answers[idx] === i ? " picked" : "");
    b.innerHTML = "<b>" + "ABCD"[i] + "</b><span>" + esc(L(o)) + "</span>";
    b.onclick = function(){ answers[idx] = i; b.classList.add("picked"); setTimeout(next, 160); };
    $("opts").appendChild(b);
  });
}
function next(){ if (idx < Q.questions.length - 1) { idx++; renderQ(); } else finish(); }
$("backBtn").onclick = function(){ if (idx > 0) { idx--; renderQ(); } };
$("startBtn").onclick = function(){ idx = 0; answers = []; result = null; twin = null; show("quiz"); renderQ(); };
$("retryBtn").onclick = function(){ history.replaceState(null, "", location.pathname + location.search); $("startBtn").onclick(); };
function finish(){
  result = window.scoreQuiz(answers);
  twin = null; $("zwOut").innerHTML = ""; $("cardPreview").classList.add("hidden");
  try { history.replaceState(null, "", location.pathname + location.search + "#" + shareHash()); } catch(e){}
  show("result"); renderResult();
}
function shareHash(){ var p = result.pct; return "r=" + result.type.id + "&s=" + [p.S,p.L,p.R,p.P].join(","); }

// ---------- result ----------
function renderResult(){
  var ty = result.type;
  $("rSide").textContent = L(Q.sides[ty.side]);
  $("rName").textContent = L(ty.name);
  $("rTitle").textContent = L(ty.title) + " · " + other(ty.title);
  $("rImg").src = IMG[ty.img]; $("rImg").alt = L(Q.sides[ty.side]);
  $("rDesc").textContent = L(ty.desc);
  $("rBars").innerHTML = ["S","L","R","P"].map(function(k){
    var tr = Q.traits[k];
    return '<div class="barrow"><span>' + esc(L(tr)) + '</span><div class="track"><div class="fill" style="width:' + result.pct[k] + '%;background:' + tr.color + '"></div></div><span class="v">' + result.pct[k] + '%</span></div>';
  }).join("");
  $("rHook").textContent = L(ty.hook);
  $("rDay").innerHTML = esc(t("readday", { d: ty.day, title: L(DAYS[ty.day]) })) + ' <a href="https://x.com/faithzhukgr7" target="_blank" rel="noopener">X @faithzhukgr7</a> / <a href="https://www.instagram.com/faiitttthhh/" target="_blank" rel="noopener">IG @faiitttthhh</a>';
  if (twin) renderTwin();
}

// ---------- share card ----------
var SENT = { latin: /[^.!?]+[.!?]+(\s|$)/g, cjk: /[^。！？.!?]+[。！？.!?]+/g, space: /[^\s]+(\s+|$)/g };
function wrapTokens(s){
  var seg = langCfg().segment;
  if (seg === "intl" && window.Intl && Intl.Segmenter) {
    try { return Array.from(new Intl.Segmenter(langCfg().html, { granularity: "word" }).segment(s), function(x){ return x.segment; }); } catch(e){}
  }
  return wrapTokensBasic(s);
}
function wrapTokensBasic(s){ return s.match(/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F「」]|[^\s\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F「」]+|\s+/g) || []; }
function wrap(ctx, text, maxW){
  var toks = wrapTokens(text), lines = [], cur = "";
  toks.forEach(function(tk){
    var test = cur + tk;
    if (ctx.measureText(test).width > maxW && cur.trim()) { lines.push(cur.trim()); cur = /^\s+$/.test(tk) ? "" : tk; }
    else cur = test;
  });
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}
var FONT = '"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei","Hiragino Kaku Gothic ProN","Apple SD Gothic Neo","Noto Sans CJK KR","Noto Sans Thai","Thonburi",-apple-system,"Segoe UI",Roboto,sans-serif';
function fitFont(ctx, text, weight, start, min, maxW){ var s = start; do { ctx.font = weight + " " + s + "px " + FONT; if (ctx.measureText(text).width <= maxW) break; s -= 2; } while (s > min); return s; }
function rr(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function loadImg(src){ return new Promise(function(res, rej){ var im = new Image(); im.onload = function(){ res(im); }; im.onerror = rej; im.src = src; }); }

function drawCard(){
  var ty = result.type, c = $("card"), ctx = c.getContext("2d"), W = 1080, H = 1350;
  return loadImg(IMG[ty.img]).then(function(im){
    ctx.fillStyle = "#f6eddf"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = "#a8382a"; ctx.lineWidth = 6; rr(ctx, 30, 30, W-60, H-60, 28); ctx.stroke();
    ctx.lineWidth = 2; rr(ctx, 44, 44, W-88, H-88, 20); ctx.stroke();
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#a8382a"; ctx.font = "700 30px " + FONT; ctx.fillText("THE EMPEROR'S PLAYBOOK · 帝王权术", W/2, 104);
    ctx.fillStyle = "#7a6a5f"; ctx.font = "500 34px " + FONT; ctx.fillText(t("cardIam"), W/2, 160);
    var name = L(ty.name); var fs = fitFont(ctx, name, "800", 92, 50, W-160);
    ctx.fillStyle = "#2b2320"; ctx.fillText(name, W/2, 160 + fs + 8);
    var sub = L(ty.title) + " · " + other(ty.name);
    var fs2 = fitFont(ctx, sub, "700", 40, 26, W-160); ctx.fillStyle = "#a8382a"; ctx.fillText(sub, W/2, 160 + fs + 8 + fs2 + 18);
    // image (cover crop)
    var ix = 90, iy = 326, iw = 900, ih = 480, ar = iw/ih, sw = im.width, sh = sw/ar, sx = 0, sy = Math.max(0, (im.height - sh) * 0.3);
    if (sh > im.height) { sh = im.height; sw = sh*ar; sx = (im.width - sw)/2; sy = 0; }
    ctx.save(); rr(ctx, ix, iy, iw, ih, 26); ctx.clip(); ctx.drawImage(im, sx, sy, sw, sh, ix, iy, iw, ih); ctx.restore();
    // side pill
    var pill = t("sideShort")[ty.side] + " · " + t("sideShort", null, altCode())[ty.side];
    ctx.font = "700 28px " + FONT; var pw = ctx.measureText(pill).width + 40;
    ctx.fillStyle = "rgba(168,56,42,.92)"; rr(ctx, ix+20, iy+ih-66, pw, 48, 24); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.fillText(pill, ix+40, iy+ih-32);
    ctx.font = "500 20px " + FONT; ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.textAlign = "right";
    ctx.fillText("AI illustration · AI插画", ix+iw-18, iy+ih-18);
    // bars
    var by = 856; ctx.textAlign = "left";
    ["S","L","R","P"].forEach(function(k, i){
      var tr = Q.traits[k], y = by + i*58, v = result.pct[k];
      ctx.fillStyle = "#2b2320"; ctx.font = "700 30px " + FONT; ctx.fillText(L(tr), 100, y+10);
      ctx.fillStyle = "#e9dcc9"; rr(ctx, 370, y-12, 520, 26, 13); ctx.fill();
      ctx.fillStyle = tr.color; rr(ctx, 370, y-12, Math.max(26, 520*v/100), 26, 13); ctx.fill();
      ctx.fillStyle = "#2b2320"; ctx.textAlign = "right"; ctx.fillText(v + "%", 985, y+10); ctx.textAlign = "left";
    });
    // one-line description (first sentence)
    var d = L(ty.desc), cfg = langCfg(), sents = d.match(SENT[cfg.sentence] || SENT.latin) || [d], first = "", lim = cfg.cardChars;
    // Add whole sentences while they still fit the card's line budget (3 lines, 2 when the Zi Wei twin line is shown).
    ctx.font = "500 31px " + FONT; var budget = twin ? 2 : 3;
    var stop = false; sents.forEach(function(x){ if (stop) return; if (!first || ((first + x).length <= lim * 1.6 && wrap(ctx, (first + x).trim(), W-200).length <= budget)) first = first ? first + x : x; else stop = true; });
    first = first.trim();
    ctx.font = "500 31px " + FONT; ctx.fillStyle = "#4a3f38"; ctx.textAlign = "center";
    var allLines = wrap(ctx, first, W-200), lines = allLines.slice(0, twin ? 2 : 3);
    window.__cardStats = { descLines: allLines.length, maxLines: twin ? 2 : 3, nameFs: fs, subFs: fs2, subW: (ctx.font = "700 " + fs2 + "px " + FONT, ctx.measureText(sub).width), nameW: (ctx.font = "800 " + fs + "px " + FONT, ctx.measureText(name).width), maxW: W-160 };
    ctx.font = "500 31px " + FONT;
    lines.forEach(function(l, i){ ctx.fillText(l, W/2, 1118 + i*40); });
    var fy = 1118 + lines.length*40;
    if (twin) { ctx.font = "500 24px " + FONT; ctx.fillStyle = "#7a6a5f"; ctx.fillText(t("cardTwin", { fig: L(typeById(twin.type).fig) }), W/2, fy + 6); }
    // footer
    ctx.fillStyle = "#a8382a"; ctx.fillRect(44, 1218, W-88, 2);
    ctx.font = "800 32px " + FONT; ctx.fillStyle = "#2b2320"; ctx.fillText(t("cardTake") + " 🐾", W/2, 1262);
    ctx.font = "600 26px " + FONT; ctx.fillStyle = "#a8382a"; ctx.fillText("X @faithzhukgr7  ·  IG / Threads @faiitttthhh", W/2, 1300);
    return c;
  });
}
function toBlob(c){ return new Promise(function(res){ c.toBlob(res, "image/png"); }); }
function toast(msg){ $("toast").textContent = msg; clearTimeout(toast.t); toast.t = setTimeout(function(){ $("toast").textContent = ""; }, 4000); }
$("saveBtn").onclick = function(){
  drawCard().then(function(c){
    var url = c.toDataURL("image/png");
    $("cardPreview").src = url; $("cardPreview").classList.remove("hidden");
    var a = document.createElement("a"); a.href = url; a.download = "emperors-playbook-" + result.type.id + ".png";
    document.body.appendChild(a); a.click(); a.remove();
    var ios = /iP(hone|ad|od)/.test(navigator.userAgent);
    toast(ios ? t("savedPreview") : t("saved"));
    window.__lastCard = url;
  });
};
function shareUrl(){
  var base = SITE_URL || (/^https?:/.test(location.protocol) ? location.origin + location.pathname : "");
  return base ? base + "#" + shareHash() : "";
}
$("shareBtn").onclick = function(){
  var url = shareUrl(), text = t("shareText", { name: L(result.type.name), title: L(result.type.title) }) + " @faithzhukgr7";
  var full = url ? text + " " + url : text;
  var fallback = function(){
    var done = function(){ toast(url ? t("copied") : t("copiedText")); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(full).then(done, function(){ legacyCopy(full); done(); });
    else { legacyCopy(full); done(); }
  };
  if (navigator.share) {
    drawCard().then(toBlob).then(function(blob){
      var file = new File([blob], "emperors-playbook-" + result.type.id + ".png", { type: "image/png" });
      var data = { title: "The Emperor's Playbook", text: text };
      if (url) data.url = url;
      if (navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
      return navigator.share(data);
    }).catch(function(err){ if (!err || err.name !== "AbortError") fallback(); });
  } else fallback();
};
function legacyCopy(s){ var ta = document.createElement("textarea"); ta.value = s; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch(e){} ta.remove(); window.__lastCopy = s; }

// ---------- Zi Wei bonus (lazy-loads the local iztro bundle) ----------
var zwLoad = null;
function loadZW(){
  if (window.ZW) return Promise.resolve();
  if (!zwLoad) zwLoad = new Promise(function(res, rej){ var s = document.createElement("script"); s.src = "vendor/ziwei.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  return zwLoad;
}
$("egg").addEventListener("toggle", function(){ if ($("egg").open) loadZW(); });
$("zwBtn").onclick = function(){
  var d = $("zwDate").value, h = $("zwHour").value;
  if (!d || h === "") { $("zwOut").textContent = t("eggNeed"); return; }
  $("zwOut").textContent = t("eggLoading");
  loadZW().then(function(){
    var p = d.split("-"), r = window.ZW(+p[0] + "-" + (+p[1]) + "-" + (+p[2]), +h);
    var borrowed = !r.life.length, stars = borrowed ? r.opposite : r.life;
    var main = stars.filter(function(s){ return Q.stars[s]; })[0];
    if (!main) throw new Error("no star");
    twin = { type: Q.stars[main].type, star: main, stars: stars, borrowed: borrowed };
    renderTwin();
  }).catch(function(){ $("zwOut").textContent = t("eggFail"); });
};
function renderTwin(){
  var ty = typeById(twin.type), st = Q.stars[twin.star];
  var starTxt = twin.stars.length > 1 ? twin.stars.join(t("starJoin")) + t("starLead", { star: L(st) }) : L(st);
  $("zwOut").innerHTML = t(twin.borrowed ? "eggBorrow" : "eggResult", { star: esc(starTxt), fig: esc(L(ty.fig)), title: esc(L(ty.title)) }) + ' <span class="fine strong">' + esc(t("eggTail")) + '</span>';
}

// ---------- shared link landing ----------
function parseHash(){ var m = /r=([a-z]+)(?:&s=([\d,]+))?/.exec(location.hash); return m && typeById(m[1]) ? { type: typeById(m[1]), s: m[2] } : null; }
function renderShared(){
  var sh = parseHash(), box = $("sharedBox");
  if (!sh || result) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  box.innerHTML = '<p class="fine">' + esc(t("sharedHead")) + '</p><b>' + esc(L(sh.type.name)) + '</b> · ' + esc(L(sh.type.title)) + '<p class="fine">' + esc(t("sharedCta")) + '</p>';
}

$("heroImg").src = IMG.duo; $("heroImg").alt = "Manman and Wuyue";
applyLang();
// test hook for automated checks
window.__quiz = { setLang: setLang, langs: function(){ return LANGS.map(function(x){ return x.code; }); }, answer: function(arr){ answers = arr.slice(); finish(); }, get result(){ return result; }, drawCard: drawCard, get twin(){ return twin; } };
})();
