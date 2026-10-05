/**
 * Sip & Spill — original inline SVG silhouette art, one per genre.
 * Pure vector, uses currentColor so CSS can tint it per genre. ~tiny, no image downloads.
 */
(function () {
  "use strict";

  // —— Silhouette building blocks (local coords: feet at y=196, head ~y=52) ——
  function head(hair) {
    let s = '<circle cx="0" cy="52" r="14"/>';
    if (hair === "long") s += '<path d="M-15,50 Q-17,30 0,34 Q17,30 15,50 L18,84 Q0,78 -18,84 Z"/>';
    if (hair === "bun") s += '<circle cx="4" cy="34" r="8"/>';
    return s;
  }
  function torso(dress) {
    return dress
      ? '<path d="M-15,72 Q0,66 15,72 L28,150 Q0,158 -28,150 Z"/><path d="M-12,148 L-11,196 L-5,196 L-3,150 Z M12,148 L11,196 L5,196 L3,150 Z"/>'
      : '<path d="M-18,72 Q0,66 18,72 L15,132 L-15,132 Z"/><path d="M-15,128 L-17,196 L-5,196 L0,142 L5,196 L17,196 L15,128 Z"/>';
  }
  const ARMS = {
    down: '<path d="M-18,74 L-27,128 L-20,130 L-11,90 Z M18,74 L27,128 L20,130 L11,90 Z"/>',
    up: '<path d="M-15,76 L-34,22 L-26,19 L-8,74 Z M15,76 L34,22 L26,19 L8,74 Z"/>',
    leftUp: '<path d="M-15,76 L-34,22 L-26,19 L-8,74 Z M18,74 L27,128 L20,130 L11,90 Z"/>',
    // right arm raised forward holding a glass (cheers)
    cheers: '<path d="M-18,74 L-27,128 L-20,130 L-11,90 Z M14,76 L46,46 L51,52 L18,88 Z"/><path d="M42,26 L62,26 L54,40 L54,48 L59,50 L45,50 L50,48 L50,40 Z"/>',
    point: '<path d="M-18,74 L-27,128 L-20,130 L-11,90 Z M14,76 L60,70 L60,78 L16,90 Z"/>',
  };
  function person(x, s, opts) {
    opts = opts || {};
    const flip = opts.flip ? -1 : 1;
    return (
      `<g transform="translate(${x},${200 - 200 * s}) scale(${s * flip},${s})">` +
      head(opts.hair) + torso(opts.dress) + (ARMS[opts.arms || "down"]) +
      "</g>"
    );
  }
  function heart(x, y, s) {
    return `<path transform="translate(${x},${y}) scale(${s})" d="M0,6 C-6,-4 -20,0 -16,12 C-13,20 0,28 0,28 C0,28 13,20 16,12 C20,0 6,-4 0,6 Z"/>`;
  }
  function star(x, y, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      d += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1);
    }
    return `<path d="${d}Z"/>`;
  }
  function dots(list) {
    return list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");
  }
  function confetti(list) {
    return list
      .map(([x, y, a]) => `<rect x="${x}" y="${y}" width="9" height="4" rx="1.5" transform="rotate(${a} ${x} ${y})"/>`)
      .join("");
  }
  function discoBall(cx, cy, r) {
    return (
      `<line x1="${cx}" y1="0" x2="${cx}" y2="${cy - r}" stroke="currentColor" stroke-width="2"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}"/>` +
      `<g stroke="var(--art-cut, #0c0a12)" stroke-width="1.6" fill="none" opacity=".55">` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r}"/><line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}"/>` +
      `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>` +
      `<line x1="${cx - r * 0.87}" y1="${cy - r / 2}" x2="${cx + r * 0.87}" y2="${cy - r / 2}"/>` +
      `<line x1="${cx - r * 0.87}" y1="${cy + r / 2}" x2="${cx + r * 0.87}" y2="${cy + r / 2}"/></g>`
    );
  }
  const svg = (inner, label) =>
    `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor" role="img" aria-label="${label}" focusable="false">${inner}</svg>`;

  // —— Genre scenes ——
  const ART = {
    all: svg(
      discoBall(100, 34, 18) +
        person(28, 0.62, { arms: "up", hair: "long", dress: true }) +
        person(66, 0.74, { arms: "cheers" }) +
        person(104, 0.8, { arms: "up", hair: "bun", dress: true }) +
        person(142, 0.72, { arms: "leftUp" }) +
        person(176, 0.6, { arms: "cheers", hair: "long", dress: true, flip: true }) +
        confetti([[20, 40, 20], [52, 22, -30], [150, 18, 45], [178, 44, -15], [130, 60, 60], [70, 64, -50]]) +
        dots([[40, 70, 2.5], [160, 76, 2.5], [120, 12, 2], [84, 14, 2]]),
      "Party crowd under a disco ball"
    ),
    mild: svg(
      person(62, 0.82, { arms: "cheers" }) +
        person(140, 0.82, { arms: "cheers", hair: "long", dress: true, flip: true }) +
        dots([[100, 30, 4], [92, 18, 2.5], [109, 12, 3], [101, 2, 2]]) +
        star(100, 52, 7),
      "Two friends clinking glasses"
    ),
    spicy: svg(
      // chili pepper + flames
      '<path d="M120,46 C150,52 168,84 154,118 C140,152 98,176 54,182 C44,183 42,174 50,170 C84,154 104,132 108,100 C111,78 108,58 120,46 Z"/>' +
        '<path d="M120,48 C118,34 124,24 136,18 L140,24 C132,28 128,36 130,46 Z"/>' +
        '<path d="M112,50 C120,40 136,40 146,48 C136,46 124,48 116,56 Z"/>' +
        '<path d="M40,120 C30,100 44,86 40,66 C54,78 60,94 54,108 C62,102 64,92 62,84 C74,98 72,124 56,134 C48,138 42,130 40,120 Z" opacity=".75"/>' +
        '<path d="M164,170 C156,156 166,146 162,132 C172,140 176,152 172,162 C176,158 178,152 177,148 C186,158 184,176 172,182 C166,184 164,176 164,170 Z" opacity=".6"/>',
      "Chili pepper and flames"
    ),
    chaos: svg(
      person(100, 0.84, { arms: "up", hair: "bun", dress: true }) +
        '<path d="M34,20 L58,20 L46,48 L62,48 L30,96 L40,58 L24,58 Z"/>' +
        '<path d="M160,30 L180,30 L170,52 L184,52 L156,92 L164,62 L150,62 Z" opacity=".8"/>' +
        confetti([[20, 120, 30], [178, 110, -40], [60, 70, 70], [140, 80, -20], [30, 160, -60], [172, 156, 15]]) +
        star(136, 24, 6) + star(70, 26, 5),
      "Dancer with lightning bolts and confetti"
    ),
    sexy_truth: svg(
      // lips + whisper bubble + hearts
      '<path d="M30,120 Q55,92 80,104 Q92,96 100,104 Q108,96 120,104 Q145,92 170,120 Q138,164 100,164 Q62,164 30,120 Z"/>' +
        '<path d="M42,121 Q100,132 158,121 Q100,140 42,121 Z" fill="var(--art-cut, #0c0a12)" opacity=".55"/>' +
        '<path d="M108,20 h70 a12,12 0 0 1 12,12 v30 a12,12 0 0 1 -12,12 h-44 l-16,14 l2,-14 h-12 a12,12 0 0 1 -12,-12 v-30 a12,12 0 0 1 12,-12 Z" opacity=".85"/>' +
        '<text x="143" y="61" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="34" fill="var(--art-cut, #0c0a12)" opacity=".6">?</text>' +
        heart(46, 40, 0.9) + heart(72, 66, 0.55),
      "Lips with a whispered question"
    ),
    sexy_dare: svg(
      // couple dancing close, joined hands raised
      '<g transform="translate(76,30) scale(.85)">' + head("bun") + torso(true) +
        '<path d="M-15,76 L-26,128 L-19,130 L-9,90 Z M14,76 L40,30 L47,34 L18,88 Z"/></g>' +
        '<g transform="translate(124,26) scale(-.87,.87)">' + head() + torso(false) +
        '<path d="M-18,74 L-27,128 L-20,130 L-11,90 Z M14,76 L40,30 L47,34 L18,88 Z"/></g>' +
        '<circle cx="100" cy="48" r="6"/>' +
        heart(100, 12, 0.7) + heart(30, 50, 0.5) + heart(172, 64, 0.45) +
        dots([[50, 24, 2.5], [152, 26, 2], [160, 104, 2.5]]),
      "A couple dancing close"
    ),
    never_have_i_ever: svg(
      // raised open hand + glass
      '<path d="M78,196 L78,150 C60,138 50,118 50,104 L50,92 C50,84 62,82 64,92 L66,110 L66,48 C66,38 80,38 80,48 L80,98 L82,30 C82,20 96,20 96,30 L96,96 L98,36 C98,26 112,26 112,36 L112,100 L114,54 C114,44 128,44 128,54 L128,128 C128,146 120,152 118,158 L118,196 Z"/>' +
        '<path d="M150,120 L184,120 L178,186 C177,192 157,192 156,186 Z" opacity=".75"/>' +
        dots([[162, 108, 3], [172, 98, 2.5], [158, 92, 2]]) +
        star(40, 40, 8),
      "A raised hand and a drink"
    ),
    most_likely: svg(
      person(100, 0.82, { arms: "up", hair: "long", dress: true }) +
        '<path d="M80,28 L88,40 L100,22 L112,40 L120,28 L118,52 L82,52 Z" transform="translate(0,6)"/>' +
        person(30, 0.62, { arms: "point" }) +
        person(170, 0.62, { arms: "point", hair: "long", dress: true, flip: true }) +
        star(58, 30, 5) + star(144, 26, 6),
      "Crowned person with friends pointing"
    ),
    couples: svg(
      person(70, 0.84, {}) +
        person(130, 0.82, { hair: "long", dress: true }) +
        '<path d="M88,112 Q100,120 112,112 L112,118 Q100,126 88,118 Z"/>' +
        heart(100, 14, 1.25) + heart(48, 40, 0.5) + heart(156, 34, 0.55),
      "A couple holding hands under a heart"
    ),
    friends: svg(
      person(48, 0.74, { arms: "up", hair: "long", dress: true }) +
        person(100, 0.82, { arms: "up" }) +
        person(152, 0.74, { arms: "up", hair: "bun", dress: true }) +
        confetti([[24, 30, 25], [176, 26, -35], [126, 14, 50], [74, 16, -20]]) +
        star(100, 14, 6),
      "Three friends celebrating"
    ),
    wild_card: svg(
      '<g transform="rotate(-16 70 110)" opacity=".55"><rect x="36" y="52" width="70" height="104" rx="10"/></g>' +
        '<g transform="rotate(14 130 110)" opacity=".7"><rect x="94" y="52" width="70" height="104" rx="10"/></g>' +
        '<rect x="62" y="40" width="76" height="114" rx="11"/>' +
        '<g fill="var(--art-cut, #0c0a12)" opacity=".6">' + star(100, 90, 22) +
        '<text x="74" y="62" font-family="system-ui,sans-serif" font-weight="900" font-size="16">?</text>' +
        '<text x="118" y="146" font-family="system-ui,sans-serif" font-weight="900" font-size="16">?</text></g>' +
        confetti([[24, 30, 30], [170, 24, -40], [30, 176, -15], [172, 178, 60]]),
      "Wild playing cards"
    ),
    trivia: svg(
      // quiz podium + big ?
      '<rect x="70" y="118" width="60" height="78" rx="6"/>' +
        '<rect x="30" y="138" width="36" height="58" rx="5" opacity=".7"/>' +
        '<rect x="134" y="138" width="36" height="58" rx="5" opacity=".7"/>' +
        person(48, 0.55, { arms: "up" }) +
        person(100, 0.62, { arms: "cheers", hair: "bun", dress: true }) +
        person(152, 0.55, { arms: "leftUp", hair: "long", dress: true }) +
        '<circle cx="100" cy="48" r="28"/>' +
        '<text x="100" y="60" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="36" fill="var(--art-cut, #0c0a12)">?</text>' +
        star(42, 28, 6) + star(160, 22, 5) +
        dots([[58, 70, 2.5], [148, 66, 2]]),
      "Trivia podium with a big question mark"
    ),
    would_you_rather: svg(
      // forked path / two doors
      '<path d="M100,196 L100,110" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M100,110 Q60,90 40,40" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M100,110 Q140,90 160,40" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="18" y="18" width="44" height="58" rx="6"/>' +
        '<rect x="138" y="18" width="44" height="58" rx="6"/>' +
        '<text x="40" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="22" fill="var(--art-cut, #0c0a12)">A</text>' +
        '<text x="160" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="22" fill="var(--art-cut, #0c0a12)">B</text>' +
        person(100, 0.7, { arms: "point", hair: "long", dress: true }) +
        dots([[88, 88, 2.5], [112, 84, 2]]),
      "A forked path with choices A and B"
    ),
    icebreaker: svg(
      // melting ice + friendly wave / handshake vibes
      '<ellipse cx="100" cy="168" rx="54" ry="14" opacity=".35"/>' +
        '<path d="M70,150 Q78,110 100,100 Q122,110 130,150 Q100,162 70,150 Z" opacity=".85"/>' +
        '<path d="M88,100 Q92,78 100,70 Q108,78 112,100" opacity=".5"/>' +
        person(48, 0.7, { arms: "leftUp" }) +
        person(152, 0.7, { arms: "up", hair: "bun", dress: true, flip: true }) +
        heart(100, 36, 0.7) +
        confetti([[28, 40, 20], [170, 36, -30], [60, 24, 45]]) +
        dots([[100, 148, 3], [92, 156, 2], [110, 156, 2]]),
      "Friends waving over a melting ice cube"
    ),
  };
  // Spicy (genre) and Spicy pepper share; others fallback to "all"
  window.SIP_ART = function (genre) {
    return ART[genre] || ART.all;
  };
})();
