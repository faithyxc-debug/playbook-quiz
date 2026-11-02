(function(){
"use strict";
// Set this to the public URL once the quiz is hosted (e.g. "https://<name>.github.io/emperor-quiz/").
var SITE_URL = "";
var Q = window.QUIZ, IMG = window.CAT_IMG;
var UI = {
  en: { brand:"The Emperor's Playbook", kicker:"A 2-minute personality quiz", h1:"Which ancient strategist are you?",
    lede:"12 everyday choices. 12 types from 2,500-year-old Chinese statecraft, each a real figure from our cat comic. Are you a Manman (the one in charge) or a Wuyue (the one who makes it happen)?",
    start:"Start the quiz", privacy:"No sign-up. No data collected. Everything stays in your browser.", back:"‹ Back",
    qnum:"Question {n} of {t}", youare:"You are…", hooklabel:"Real history", save:"Save my card", share:"Share / copy link", retry:"Retake",
    readday:"Read the story: Day {d} of the series, “{title}”, on", eggSummary:"🎲 Bonus: find your fate-palace twin",
    eggNote:"Just for fun, not fortune-telling.",
    eggExplain:"Enter a birth date and hour. We read only the main star of the Life Palace (命宫) in a Zi Wei Dou Shu chart and match it to a figure from the series. Computed in your browser; nothing is sent or saved.",
    eggDate:"Birth date", eggHour:"Birth hour", eggGo:"Find my twin", eggNeed:"Pick a date and an hour first.", eggLoading:"Reading the stars…",
    eggFail:"Couldn't compute that date. Try another between 1900 and 2100.",
    eggResult:"Life Palace main star: <b>{star}</b>. Your fate-palace twin: <b>{fig}</b> ({title}).",
    eggBorrow:"Your Life Palace has no main star, so by custom we borrow the opposite palace's: <b>{star}</b>. Your fate-palace twin: <b>{fig}</b> ({title}).",
    eggTail:"Just for fun, not fortune-telling.", allTypes:"All 12 types", follow:"Follow the comic:",
    disclaimer:"A free quiz for fun. Manman and Wuyue are the creator's two real cats; the panels are AI illustration. Types are playful, not psychology. History hooks are sourced; lines in 「」 are quoted from the classical texts named. The Zi Wei bonus is entertainment, not fortune-telling. No sign-in, no payment, no personal data collected.",
    credits:"Zi Wei chart computed with", saved:"Card saved. Post it and tag us!", savedPreview:"Long-press the card below to save it.",
    copied:"Link copied!", copiedText:"Copied! Paste it anywhere.", shareText:"I got {name} ({title}) in The Emperor's Playbook quiz 🐾 Which ancient strategist are you?",
    sharedHead:"A friend got:", sharedCta:"Take the quiz to find yours.", cardIam:"I'm", cardTake:"Take the quiz", cardTwin:"Fate-palace twin: {fig} (just for fun)",
    sideShort:{ r:"Manman type", m:"Wuyue type" } },
  zh: { brand:"帝王权术 · The Emperor's Playbook", kicker:"两分钟性格测试", h1:"你是哪一种古代谋略家？",
    lede:"12 道日常选择题，12 种来自两千五百年前中国政治智慧的类型，每一种都是我们猫咪漫画里的真实人物。你是满满（掌权的那个），还是五月（把事办成的那个）？",
    start:"开始测试", privacy:"无需注册，不收集任何数据，一切都只在你的浏览器里。", back:"‹ 上一题",
    qnum:"第 {n} / {t} 题", youare:"你是……", hooklabel:"真实历史", save:"保存我的卡片", share:"分享 / 复制链接", retry:"再测一次",
    readday:"读原故事：系列第 {d} 天《{title}》，在", eggSummary:"🎲 彩蛋：找找你的命宫双胞胎",
    eggNote:"图个乐，不是算命。",
    eggExplain:"输入出生日期和时辰。我们只看紫微斗数命盘里命宫的主星，把它对应到系列中的一位人物。计算全在你的浏览器里完成，不上传、不保存。",
    eggDate:"出生日期（公历）", eggHour:"出生时辰", eggGo:"找我的双胞胎", eggNeed:"请先选日期和时辰。", eggLoading:"正在看星……",
    eggFail:"这个日期算不出来，换一个 1900–2100 年之间的试试。",
    eggResult:"命宫主星：<b>{star}</b>。你的命宫双胞胎：<b>{fig}</b>（{title}）。",
    eggBorrow:"你的命宫没有主星，按惯例借对宫（迁移宫）的主星：<b>{star}</b>。你的命宫双胞胎：<b>{fig}</b>（{title}）。",
    eggTail:"图个乐，不是算命。", allTypes:"全部 12 种类型", follow:"关注漫画：",
    disclaimer:"免费测试，图个乐。满满和五月是作者家的两只真猫，画面为AI插画。类型是娱乐，不是心理学。历史钩子都有出处，「」内为所注典籍原文。紫微彩蛋只是娱乐，不是算命。无需登录、无需付费、不收集个人数据。",
    credits:"紫微命盘计算使用", saved:"卡片已保存，发出来记得@我们！", savedPreview:"长按下面的卡片即可保存。",
    copied:"链接已复制！", copiedText:"已复制，随处粘贴吧。", shareText:"我测出来是{name}（{title}）🐾 来测测你是哪一种古代谋略家？",
    sharedHead:"你的朋友测出：", sharedCta:"来测测你是哪一型。", cardIam:"我是", cardTake:"来测测你是哪一型", cardTwin:"命宫双胞胎：{fig}（图个乐）",
    sideShort:{ r:"满满型", m:"五月型" } }
};
var DAYS = {
  1:{ en:"Duke Zhuang defeats his brother at Yan", zh:"郑庄公克段于鄢" },
  2:{ en:"Duke Huan and Guan Zhong", zh:"齐桓公与管仲" },
  3:{ en:"Chong'er: 19 years in exile", zh:"晋文公重耳" },
  4:{ en:"Duke Mu and Baili Xi", zh:"秦穆公与百里奚" },
  5:{ en:"King Zhuang asks about the cauldrons", zh:"楚庄王问鼎" },
  7:{ en:"Yan Ying and the killing of Duke Zhuang of Qi", zh:"晏婴与崔杼弑君" },
  8:{ en:"Zichan casts the law in bronze", zh:"子产铸刑书" }
};
var lang = "en", idx = 0, answers = [], result = null, twin = null;
try { var sv = localStorage.getItem("ep_lang"); if (sv) lang = sv; } catch(e){}
var qp = /[?&]lang=(zh|en)/.exec(location.search); if (qp) lang = qp[1];

function $(id){ return document.getElementById(id); }
function t(k, vars){ var s = UI[lang][k]; if (vars) for (var v in vars) s = s.split("{"+v+"}").join(vars[v]); return s; }
function L(o){ return o[lang]; }
function other(o){ return o[lang === "en" ? "zh" : "en"]; }
function typeById(id){ return Q.types.filter(function(x){ return x.id === id; })[0]; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function show(id){ ["intro","quiz","result"].forEach(function(s){ $(s).classList.toggle("active", s === id); }); window.scrollTo(0,0); }

function applyLang(){
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  $("langBtn").textContent = lang === "en" ? "中文" : "EN";
  document.querySelectorAll("[data-i18n]").forEach(function(el){ var k = el.getAttribute("data-i18n"); if (UI[lang][k]) el.textContent = UI[lang][k]; });
  document.title = lang === "en" ? "Which Ancient Strategist Are You? · The Emperor's Playbook" : "你是哪一种古代谋略家？· 帝王权术";
  var hs = $("zwHour"), keep = hs.value; hs.innerHTML = '<option value="">—</option>' + Q.hours.map(function(h,i){ return '<option value="'+i+'">'+esc(L(h))+'</option>'; }).join(""); hs.value = keep;
  if ($("quiz").classList.contains("active")) renderQ();
  if (result) renderResult();
  $("cardPreview").classList.add("hidden");
  renderShared();
}
$("langBtn").onclick = function(){ lang = lang === "en" ? "zh" : "en"; try { localStorage.setItem("ep_lang", lang); } catch(e){} applyLang(); };

// ---------- quiz ----------
function renderQ(){
  var q = Q.questions[idx], n = Q.questions.length;
  $("bar").style.width = (idx / n * 100) + "%";
  $("qnum").textContent = t("qnum", { n: idx+1, t: n });
  $("backBtn").style.visibility = idx ? "visible" : "hidden";
  $("qtext").textContent = L(q);
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
  $("allTypes").innerHTML = Q.types.map(function(x){
    return '<div class="tchip' + (x.id === ty.id ? ' me' : '') + '"><b>' + esc(L(x.name)) + '</b><small>' + esc(L(x.title)) + ' · ' + esc(UI[lang].sideShort[x.side]) + '</small></div>';
  }).join("");
  if (twin) renderTwin();
}

// ---------- share card ----------
function wrapTokens(s){ return s.match(/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F「」]|[^\s\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F「」]+|\s+/g) || []; }
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
var FONT = '"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",-apple-system,"Segoe UI",Roboto,sans-serif';
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
    var pill = UI[lang].sideShort[ty.side] + " · " + UI[lang === "en" ? "zh" : "en"].sideShort[ty.side];
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
    var d = L(ty.desc), sents = (lang === "en" ? d.match(/[^.!?]+[.!?]+(\s|$)/g) : d.match(/[^。！？]+[。！？]/g)) || [d], first = "", lim = lang === "en" ? 110 : 44;
    var stop = false; sents.forEach(function(x){ if (stop) return; if (!first || (first + x).length <= lim) first = first ? first + x : x; else stop = true; });
    first = first.trim();
    ctx.font = "500 31px " + FONT; ctx.fillStyle = "#4a3f38"; ctx.textAlign = "center";
    var lines = wrap(ctx, first, W-200).slice(0, twin ? 2 : 3);
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
  var starTxt = twin.stars.length > 1 ? twin.stars.join(lang === "en" ? " + " : "、") + (lang === "en" ? " (leading: " : "（以") + L(st) + (lang === "en" ? ")" : "为主）") : L(st);
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
window.__quiz = { answer: function(arr){ answers = arr.slice(); finish(); }, get result(){ return result; }, drawCard: drawCard, get twin(){ return twin; } };
})();
