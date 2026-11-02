// Scoring logic (pure, no DOM). Displayed trait % = 20 + 80 x (points / max points available for that trait), so bars never read as zero. answers = array of chosen option indexes (0-3), one per question.
(function(){
  var ORDER = ["S","L","R","P"];
  window.scoreQuiz = function(answers){
    var Q = window.QUIZ, s = {S:0,L:0,R:0,P:0}, prim = {S:0,L:0,R:0,P:0}, max = {S:0,L:0,R:0,P:0}, side = 0;
    Q.questions.forEach(function(q, i){
      var best = {S:0,L:0,R:0,P:0};
      q.a.forEach(function(o){ best[o.t[0]] = Math.max(best[o.t[0]], 2); best[o.t[1]] = Math.max(best[o.t[1]], 1); });
      ORDER.forEach(function(k){ max[k] += best[k]; });
      var o = q.a[answers[i]]; if (!o) return;
      s[o.t[0]] += 2; s[o.t[1]] += 1; prim[o.t[0]] += 1;
      side += (o.t[2] === "r" ? 1 : -1);
    });
    var last = Q.questions[Q.questions.length-1].a[answers[Q.questions.length-1]];
    var sideKey = side > 0 ? "r" : side < 0 ? "m" : (last ? last.t[2] : "r");
    var ranked = ORDER.slice().sort(function(a,b){
      return (s[b]-s[a]) || (prim[b]-prim[a]) || (ORDER.indexOf(a)-ORDER.indexOf(b));
    });
    var top = ranked.slice(0,2).sort(function(a,b){ return ORDER.indexOf(a)-ORDER.indexOf(b); }).join("");
    var type = Q.types.filter(function(t){ return t.side === sideKey && t.pair === top; })[0];
    var pct = {}; ORDER.forEach(function(k){ pct[k] = Math.round(20 + 80 * Math.min(1, s[k] / max[k])); });
    return { scores: s, max: max, pct: pct, side: sideKey, sideMargin: side, pair: top, type: type };
  };
})();
