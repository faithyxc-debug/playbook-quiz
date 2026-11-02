// The Emperor's Playbook quiz: interface strings and language registry.
// TO ADD A LANGUAGE (e.g. ja / ko / th / es):
//   1. Add an entry to LANGS below (code, menu label, <html lang>, card settings).
//   2. Add UI.<code> with the same keys as UI.en (any missing key falls back to English).
//   3. Add DAYS[n].<code> here, and in data.js add a <code> field next to every en/zh pair
//      (questions, options, traits, sides, types.fig/name/title/desc/hook, stars, hours).
//      Anything not yet translated falls back to English, so a partial language never breaks the page.
//   The menu only lists languages whose UI block exists, so a half-added language stays hidden until UI.<code> is there.
window.I18N = (function(){
var LANGS = [
  // alt = second language printed on the share card / result subtitle (the comic is bilingual EN+中文).
  // sentence = how to cut the first sentence of a description for the card; cardChars = max chars for that line.
  // segment = word-wrap method on the canvas card: "space" (words), "cjk" (per character), "intl" (Intl.Segmenter, for Thai etc.).
  { code:"en", label:"English", html:"en",    alt:"zh", sentence:"latin", cardChars:110, segment:"space" },
  { code:"zh", label:"中文",     html:"zh-CN", alt:"en", sentence:"cjk",   cardChars:44,  segment:"cjk" },
  // Ready to switch on once strings exist (UI.ja etc.); listed here so the card/sentence settings are decided up front.
  { code:"ja", label:"日本語",   html:"ja",    alt:"zh", sentence:"cjk",   cardChars:48,  segment:"intl" },
  { code:"ko", label:"한국어",   html:"ko",    alt:"zh", sentence:"latin", cardChars:60,  segment:"space" },
  { code:"th", label:"ไทย",      html:"th",    alt:"zh", sentence:"space", cardChars:90,  segment:"intl" },
  { code:"es", label:"Español",  html:"es",    alt:"zh", sentence:"latin", cardChars:120, segment:"space" }
];
var UI = {
  en: { brand:"The Emperor's Playbook", kicker:"Takes 2 minutes. Counts as paid slacking.", h1:"Which ancient strategist are you?",
    lede:"They fought for empires. You fight for the desk by the window. They eyed the throne. Your boss eyes your “seen” status. They feared death by a thousand cuts. You die by a thousand “Read” receipts. They retired to their hometowns with honor. You got “optimized.” Same statecraft; the stakes went from city walls to a year-end bonus. 12 survival questions for work horses: are you a Manman (the one in charge) or a Wuyue (the one who makes it happen)?",
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
    sideShort:{ r:"Manman type", m:"Wuyue type" },
    docTitle:"Which Ancient Strategist Are You? · The Emperor's Playbook", langLabel:"Language",
    starJoin:" + ", starLead:" (leading: {star})" },
  zh: { brand:"帝王权术 · The Emperor's Playbook", kicker:"两分钟测完，算你带薪摸鱼", h1:"你是哪一种古代谋略家？",
    lede:"古人争天下，你争工位。古人问鼎，老板问“在吗”。古人退避三舍，你精神离职。古人怕凌迟，你天天被“已读不回”凌迟。古人告老还乡，你被毕业。同样是权谋，只是筹码从城池变成了年终奖。12 道牛马生存题，测测你是满满（掌权的那个），还是五月（把事办成的那个）。",
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
    sideShort:{ r:"满满型", m:"五月型" },
    docTitle:"你是哪一种古代谋略家？· 帝王权术", langLabel:"语言",
    starJoin:"、", starLead:"（以{star}为主）" }

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
return { LANGS: LANGS, UI: UI, DAYS: DAYS, fallback: "en" };
})();
