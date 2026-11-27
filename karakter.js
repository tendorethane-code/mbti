// Karakter per tipe (Roh Peta) dan telur yang terbentuk selama mengisi soal.
// Versi produksi dari docs/desain/karakter-draf.js + karakter-roh.js (hanya yang dipilih pemilik):
// badan unik per tipe dengan tekstur + pin family, INFP Kosmos Gerhana, dan Telur Nebula (E1).
// Semua berupa string SVG; animasi lewat CSS (kelas di index.html). Butuh core.js (TYPE_PAL, mixHex).
(function (G) {
  const INK = '#2b2236';
  const fam = t => t[1] === 'N' ? (t[2] === 'T' ? 'NT' : 'NF') : (t[3] === 'J' ? 'SJ' : 'SP');
  const pal = t => { const p = TYPE_PAL[t] || TYPE_PAL.INFP; return {a: p[0], b: p[1]}; };
  function roundPoly(P, r) {
    let d = '';
    const n = P.length;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n];
      const l1 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [p1[0] + (p0[0] - p1[0]) / l1 * rr, p1[1] + (p0[1] - p1[1]) / l1 * rr];
      const b = [p1[0] + (p2[0] - p1[0]) / l2 * rr, p1[1] + (p2[1] - p1[1]) / l2 * rr];
      d += (i ? 'L' : 'M') + f1(a[0]) + ' ' + f1(a[1]) + 'Q' + p1[0] + ' ' + p1[1] + ' ' + f1(b[0]) + ' ' + f1(b[1]);
    }
    return d + 'Z';
  }
  const sparkle = (x, y, s, c, cls = 'tw', d = 0) => `<path class="${cls}" style="animation-delay:${d}s" d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}"/>`;
  const heart = (x, y, s, c) => `<path d="M${x} ${y + s * .9}C${x - s * 1.4} ${y - s * .1} ${x - s * .7} ${y - s * 1.2} ${x} ${y - s * .4}C${x + s * .7} ${y - s * 1.2} ${x + s * 1.4} ${y - s * .1} ${x} ${y + s * .9}Z" fill="${c}"/>`;
  function defs(id, a, b) {
    const top = mixHex(a, '#ffffff', .38), bot = mixHex(a, b, .18);
    return `<defs><linearGradient id="g${id}" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${bot}"/></linearGradient>` +
      `<linearGradient id="h${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(b, '#ffffff', .35)}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
      `<radialGradient id="glow${id}"><stop offset="0" stop-color="#fff6c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c4" stop-opacity="0"/></radialGradient></defs>`;
  }
  const GOLD = '#ffd66b', GOLD_D = '#b98a2a';
  let uid = 1000;
  const f1 = n => Math.round(n * 10) / 10;

  // ---------- Wajah ----------
  function eye(x, y, r, kind, lid) {
    if (kind === 'happy') return `<path d="M${x - r} ${y + 2}Q${x} ${y - r * 1.3} ${x + r} ${y + 2}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
    const dy = kind === 'up' ? -2.5 : 0;
    let s = `<g class="eye"><ellipse cx="${x}" cy="${y + dy}" rx="${f1(r * .86)}" ry="${r}" fill="${INK}"/>`;
    if (kind === 'star') {
      const c = y - r * .3, k = r * .55;
      s += `<path d="M${x} ${f1(c - k)}Q${x} ${c} ${f1(x + k)} ${c}Q${x} ${c} ${x} ${f1(c + k)}Q${x} ${c} ${f1(x - k)} ${c}Q${x} ${c} ${x} ${f1(c - k)}Z" fill="#fff"/><circle cx="${f1(x - r * .35)}" cy="${f1(y + r * .5)}" r="${f1(r * .16)}" fill="#fff"/>`;
    } else {
      const hy = kind === 'up' ? y - r * .62 : y - r * .38;
      s += `<circle cx="${f1(x + r * .3)}" cy="${f1(hy)}" r="${f1(r * .36)}" fill="#fff"/><circle cx="${f1(x - r * .32)}" cy="${f1(y + r * .4 + dy)}" r="${f1(r * .16)}" fill="#fff" opacity=".85"/>`;
    }
    s += '</g>';
    if (kind === 'calm') { const ly = f1(y - r * .3), lx = f1(x - r * 1.05), rx = f1(x + r * 1.05);
      s += `<path d="M${lx} ${ly}Q${x} ${f1(y - r * .62)} ${rx} ${ly}Q${x} ${f1(y - r * 2)} ${lx} ${ly}Z" fill="${lid}"/><path d="M${lx} ${ly}Q${x} ${f1(y - r * .62)} ${rx} ${ly}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${rx} ${ly}l3 -3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`; }
    return s;
  }
  function face(o) {
    const {x = 100, y, gap = 20, r = 9.5, l = 'open', rgt = l, mouth = 'smile', brow, lid = '#fff', blush = .42} = o;
    let s = `<ellipse cx="${x - gap - 9}" cy="${y + 15}" rx="9" ry="5.5" fill="#ff7f9a" opacity="${blush}"/><ellipse cx="${x + gap + 9}" cy="${y + 15}" rx="9" ry="5.5" fill="#ff7f9a" opacity="${blush}"/>`;
    s += eye(x - gap, y, r, l, lid) + eye(x + gap, y, r, rgt, lid);
    const bl = (x1, y1, x2, y2, qx, qy) => `<path d="M${x1} ${y1}Q${qx} ${qy} ${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    if (brow === 'raise') s += bl(x + gap - 9, y - 17, x + gap + 9, y - 18, x + gap, y - 23);
    if (brow === 'bold') s += bl(x - gap - 10, y - 19, x - gap + 8, y - 15, x - gap, y - 19) + bl(x + gap - 8, y - 15, x + gap + 10, y - 19, x + gap, y - 19);
    if (brow === 'soft') s += bl(x - gap - 8, y - 17, x - gap + 8, y - 18, x - gap, y - 21) + bl(x + gap - 8, y - 18, x + gap + 8, y - 17, x + gap, y - 21);
    const my = y + 16;
    const M = {
      smile: `<path d="M${x - 7} ${my}Q${x} ${my + 7} ${x + 7} ${my}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      tiny: `<path d="M${x - 4} ${my}Q${x} ${my + 4} ${x + 4} ${my}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
      cat: `<path d="M${x - 9} ${my}Q${x - 4.5} ${my + 6} ${x} ${my}Q${x + 4.5} ${my + 6} ${x + 9} ${my}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
      smirk: `<path d="M${x - 8} ${my + 1}Q${x + 1} ${my + 7} ${x + 10} ${my - 3}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      flat: `<path d="M${x - 6} ${my + 2}Q${x + 1} ${my + 4} ${x + 7} ${my + 1}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      open: `<path d="M${x - 10} ${my - 1}Q${x} ${my + 16} ${x + 10} ${my - 1}Z" fill="#5b2238" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${x - 5} ${my + 7.5}Q${x} ${my + 4} ${x + 5} ${my + 7.5}Q${x} ${my + 12} ${x - 5} ${my + 7.5}Z" fill="#ff8a9e"/>`,
      grin: `<path d="M${x - 12} ${my - 2}Q${x} ${my + 15} ${x + 12} ${my - 2}Z" fill="#fff" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M${x - 10} ${my + 2}H${x + 10}" stroke="${INK}" stroke-width="1.6" opacity=".35"/>`,
      o: `<ellipse cx="${x}" cy="${my + 3}" rx="4.5" ry="5.5" fill="#5b2238" stroke="${INK}" stroke-width="2.4"/>`
    };
    return s + (M[mouth] || M.smile);
  }

  // ---------- Benda kecil ----------
  const star5 = (x, y, R, c, st, cls = '') => {
    const P = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? R * .45 : R, an = -Math.PI / 2 + i * Math.PI / 5; P.push([f1(x + r * Math.cos(an)), f1(y + r * Math.sin(an))]); }
    return `<path class="${cls}" d="${roundPoly(P, R * .12)}" fill="${c}"${st ? ` stroke="${st}" stroke-width="2" stroke-linejoin="round"` : ''}/>`;
  };
  const gear = (x, y, R, c, st) => {
    const P = []; for (let i = 0; i < 24; i++) { const r = (i % 3 === 0 || i % 3 === 1) ? R : R * .74, an = i * Math.PI / 12; P.push([f1(x + r * Math.cos(an)), f1(y + r * Math.sin(an))]); }
    return `<g class="spin"><path d="M${P.map(p => p.join(' ')).join('L')}Z" fill="${c}" stroke="${st}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="${f1(R * .32)}" fill="${st}"/></g>`;
  };
  const glow = (id, x, y, r, cls = '') => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="url(#glow${id})"/>`;
  const note = (x, y, c, d) => `<g class="rise" style="animation-delay:${d}s"><path d="M${x} ${y}v-16l10-3v16" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${x - 3}" cy="${y}" rx="4.5" ry="3.5" fill="${c}"/><ellipse cx="${x + 7}" cy="${y - 3}" rx="4.5" ry="3.5" fill="${c}"/></g>`;
  const butterfly = (x, y, c, c2, d = 0) => `<g class="drift" style="animation-delay:${d}s"><g transform="translate(${x} ${y})"><g class="flap"><path d="M0 0C-12 -14 -18 -2 -10 4C-16 8 -8 14 0 4Z" fill="${c}" stroke="${c2}" stroke-width="1.6"/><path d="M0 0C12 -14 18 -2 10 4C16 8 8 14 0 4Z" fill="${c}" stroke="${c2}" stroke-width="1.6"/></g><path d="M0 -4v10" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g></g>`;
  const flower = (x, y, r, c, st, n = 5) => Array.from({length: n}, (_, i) => `<ellipse cx="${x}" cy="${f1(y - r)}" rx="${f1(r * .62)}" ry="${f1(r)}" fill="${c}" stroke="${st}" stroke-width="1.8" transform="rotate(${i * 360 / n} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="${f1(r * .55)}" fill="${GOLD}" stroke="${st}" stroke-width="1.8"/>`;
  const leaf = (x, y, s, rot, c, st) => `<path d="M0 0C${s * .5} ${-s * .5} ${s * 1.2} ${-s * .4} ${s * 1.5} 0C${s * 1.2} ${s * .4} ${s * .5} ${s * .5} 0 0Z" fill="${c}" stroke="${st}" stroke-width="1.8" transform="translate(${x} ${y}) rotate(${rot})"/>`;
  const qmark = (x, y, c) => `<path d="M${x - 6} ${y - 8}Q${x - 6} ${y - 16} ${x} ${y - 16}Q${x + 7} ${y - 16} ${x + 7} ${y - 9}Q${x + 7} ${y - 4} ${x + 1} ${y - 1}L${x + 1} ${y + 3}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x + 1}" cy="${y + 10}" r="2.6" fill="${c}"/>`;

  // ---------- Badan per family ----------
  const BASE = {
    NF: {shape: () => `M100 40C118 64 160 94 160 142C160 182 133 202 100 202C67 202 40 182 40 142C40 94 82 64 100 40Z`, fy: 136, tip: [100, 40],
      arms: {l: [42, 158, 25], r: [158, 158, -25], wave: [162, 130, -40], hl: [74, 178, -62], hr: [126, 178, 62], chin: [124, 166, -40]}, shine: [70, 112, 11, 20], feet: 200},
    NT: {shape: () => roundPoly([[100, 44], [152, 74], [162, 146], [130, 200], [70, 200], [38, 146], [48, 74]], 16), fy: 136, tip: [100, 44],
      arms: {l: [38, 160, 20], r: [162, 160, -20], wave: [164, 132, -35], hl: [74, 180, -62], hr: [126, 180, 62], chin: [124, 168, -40]}, shine: [66, 112, 9, 18], feet: 201,
      extra: `<path d="M100 50L100 92M58 80L84 98M142 80L116 98" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>`},
    SJ: {shape: () => roundPoly([[50, 76], [150, 76], [158, 202], [42, 202]], 34), fy: 116, tip: [100, 76],
      arms: {l: [44, 166, 20], r: [156, 166, -20], wave: [162, 136, -35], hl: [74, 182, -62], hr: [126, 182, 62], chin: [124, 150, -40]}, shine: [68, 102, 10, 16], feet: 203},
    SP: {shape: () => `M112 36C124 70 162 96 160 144C158 184 132 202 100 202C66 202 40 182 40 144C40 104 70 82 84 60C92 70 98 76 102 66C106 58 108 48 112 36Z`, fy: 138, tip: [112, 36], rot: -10,
      arms: {l: [42, 156, 30], r: [158, 160, -30], wave: [166, 126, -40], hl: [76, 180, -62], hr: [126, 180, 62], chin: [126, 170, -40]}, shine: [68, 116, 10, 19], feet: 200}
  };
  // Hand position for an item held in the raised (wave) arm, and centre for items held with both hands.
  const HAND = {NF: [170, 116], NT: [172, 118], SJ: [170, 122], SP: [174, 112]};
  const HOLD = {NF: [100, 180], NT: [100, 182], SJ: [100, 184], SP: [101, 182]};

  // ---------- Spesifikasi per tipe ----------
  // Tiap fungsi menerima K = {id,a,b,line,lb,F,hand,hold} dan mengembalikan bagian-bagian SVG.
  const SPEC = {
    INTJ: K => ({fc: {l: 'calm', mouth: 'smirk'},
      scene: `<g opacity=".8"><path d="M26 64L44 48L62 58" fill="none" stroke="${K.b}" stroke-width="1.6" opacity=".6"/>${sparkle(26, 64, 4, K.b, 'tw', 0)}${sparkle(44, 48, 5, '#fff', 'tw', .5)}${sparkle(62, 58, 3.5, K.b, 'tw', 1)}</g>` +
        `<g class="float"><circle cx="160" cy="62" r="22" fill="url(#glow${K.id})" opacity=".6"/><g transform="translate(160 64)"><path d="M-12 18h24l-2-7c4-7 5-18-4-24l-3-5-3 6c-7 2-12 7-13 14l7 2 6-4c-2 7-7 9-10 14z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="-1" cy="-6" r="1.8" fill="${INK}"/></g></g>`}),
    INTP: K => ({fc: {l: 'up', mouth: 'o', brow: 'soft'}, arms: 'chin',
      top: `<path d="M100 46V26" stroke="${K.line}" stroke-width="3"/>${gear(100, 20, 11, K.b, K.lb)}`,
      scene: `<g class="float"><g transform="translate(158 66)"><path d="M0 -16L14 -8L0 0L-14 -8Z" fill="${mixHex(K.b, '#fff', .4)}" stroke="${K.lb}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-14 -8L0 0V16L-14 8Z" fill="${K.b}" stroke="${K.lb}" stroke-width="2.2" stroke-linejoin="round"/><path d="M14 -8L0 0V16L14 8Z" fill="${mixHex(K.b, INK, .25)}" stroke="${K.lb}" stroke-width="2.2" stroke-linejoin="round"/></g></g>` +
        `<g class="float" style="animation-delay:.8s">${qmark(40, 66, K.a)}</g>${sparkle(56, 40, 4, K.b, 'tw', .4)}`}),
    ENTJ: K => ({fc: {brow: 'bold', mouth: 'grin'}, arms: 'wave',
      behind: `<path d="M56 92L144 92L178 198Q100 214 22 198Z" fill="${mixHex(K.a, INK, .5)}" stroke="${K.line}" stroke-width="3" stroke-linejoin="round"/><path d="M26 192Q100 208 174 192" fill="none" stroke="${GOLD}" stroke-width="4"/>`,
      top: `<g transform="translate(0 4)"><path d="M82 48L84 24L93 36L100 18L107 36L116 24L118 48Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="100" cy="40" r="3.6" fill="${K.a}"/><circle cx="89" cy="42" r="2.4" fill="#fff"/><circle cx="111" cy="42" r="2.4" fill="#fff"/></g>`,
      hand: `<path d="M${K.hand[0]} ${K.hand[1] + 6}L${K.hand[0] + 6} ${K.hand[1] - 52}" stroke="${GOLD_D}" stroke-width="4" stroke-linecap="round"/><g class="flagw" style="transform-origin:${K.hand[0] + 6}px ${K.hand[1] - 50}px"><path d="M${K.hand[0] + 6} ${K.hand[1] - 52}Q${K.hand[0] + 22} ${K.hand[1] - 58} ${K.hand[0] + 34} ${K.hand[1] - 48}Q${K.hand[0] + 22} ${K.hand[1] - 40} ${K.hand[0] + 6} ${K.hand[1] - 34}Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="2.4" stroke-linejoin="round"/></g>`}),
    ENTP: K => ({fc: {brow: 'raise', mouth: 'smirk', r: 9}, arms: 'wave',
      scene: `<g class="float" style="animation-duration:2.4s"><circle cx="156" cy="50" r="24" fill="url(#glow${K.id})"/><path d="M146 50a10 10 0 1 1 20 0c0 5-4 7-4 11h-12c0-4-4-6-4-11z" fill="#fff4bf" stroke="${K.line}" stroke-width="2.6" stroke-linejoin="round"/><rect x="150.5" y="61" width="11" height="6" rx="2" fill="${K.b}" stroke="${K.line}" stroke-width="2.2"/><g class="tw" stroke="${K.b}" stroke-width="3" stroke-linecap="round"><path d="M156 30v-6M139 37l-4-4M173 37l4-4M134 52h-6M178 52h6"/></g></g>` +
        sparkle(40, 64, 5, K.b, 'tw', .6) + `<path class="tw" style="animation-delay:.3s" d="M30 96l6-10 2 6 6-8" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}),
    INFJ: K => ({fc: {l: 'calm', mouth: 'smile'}, arms: 'hold',
      top: `${glow(K.id, 100, 36, 18, 'flick')}<circle cx="100" cy="37" r="6" fill="#fffbe6" stroke="${K.lb}" stroke-width="2"/>`,
      faceAcc: `<path d="M95 104a8 8 0 1 0 10 0a6 6 0 1 1 -10 0Z" fill="${mixHex(K.b, '#fff', .3)}" opacity=".9"/>`,
      hold: `${glow(K.id, K.hold[0], K.hold[1] - 2, 28, 'flick')}<path d="M${K.hold[0] - 8} ${K.hold[1] - 16}Q${K.hold[0]} ${K.hold[1] - 26} ${K.hold[0] + 8} ${K.hold[1] - 16}" fill="none" stroke="${K.lb}" stroke-width="2.6"/><rect x="${K.hold[0] - 11}" y="${K.hold[1] - 16}" width="22" height="26" rx="7" fill="#fff4c2" stroke="${K.lb}" stroke-width="2.6"/><path d="M${K.hold[0]} ${K.hold[1] - 8}c3 4 3 8 0 10c-3-2-3-6 0-10z" fill="${GOLD}"/><path d="M${K.hold[0] - 11} ${K.hold[1] - 10}h22M${K.hold[0] - 11} ${K.hold[1] + 4}h22" stroke="${K.lb}" stroke-width="2"/>`,
      scene: sparkle(34, 70, 5, K.b, 'tw', .2) + sparkle(166, 62, 6, '#fff', 'tw', .9) + sparkle(152, 34, 3.5, K.b, 'tw', 1.4)}),
    INFP: K => ({fc: {mouth: 'smile'},
      top: `<g class="wig" style="transform-origin:100px 44px">${flower(100, 36, 9, `url(#h${K.id})`, K.lb)}</g>`,
      scene: `<g class="float"><circle cx="160" cy="58" r="20" fill="url(#glow${K.id})"/><circle cx="160" cy="58" r="11" fill="${INK}" stroke="#ffe7a8" stroke-width="2.5"/>${sparkle(170, 49, 3.5, '#fff')}</g>` + sparkle(36, 70, 6, K.b, 'tw', .3) + sparkle(54, 46, 4, '#ffe08a', 'tw', 1.1)}),
    ENFJ: K => ({fc: {l: 'happy', mouth: 'open'}, arms: 'hold',
      behind: `<g class="spin" style="animation-duration:24s">${Array.from({length: 12}, (_, i) => { const an = i * Math.PI / 6, x1 = 100 + 66 * Math.cos(an), y1 = 122 + 66 * Math.sin(an), x2 = 100 + 82 * Math.cos(an), y2 = 122 + 82 * Math.sin(an); return `<path d="M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}" stroke="${K.b}" stroke-width="6" stroke-linecap="round" opacity=".75"/>`; }).join('')}</g>`,
      hold: `<g class="beat" style="transform-origin:${K.hold[0]}px ${K.hold[1]}px">${heart(K.hold[0], K.hold[1] - 2, 16, mixHex(K.a, '#ff4f7b', .35))}<path d="M${K.hold[0] - 9} ${K.hold[1] - 10}q3-4 7-2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`,
      scene: `<g class="rise">${heart(34, 92, 6, K.a)}</g><g class="rise" style="animation-delay:1.2s">${heart(170, 84, 5, K.b)}</g>`}),
    ENFP: K => ({fc: {l: 'star', mouth: 'open'}, arms: 'wave',
      behind: [['#ff8a7a', 70], ['#ffd36b', 62], [K.b, 54], ['#b9a2ff', 46]].map(([c, r]) => `<path d="M${100 - r} 118A${r} ${r} 0 0 1 ${100 + r} 118" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity=".85"/>`).join(''),
      top: `<path d="M100 42Q96 26 108 20Q118 16 116 26" fill="none" stroke="${K.line}" stroke-width="3" stroke-linecap="round"/>${star5(116, 24, 8, GOLD, GOLD_D, 'tw')}`,
      scene: ['#ff8a7a', GOLD, K.b, '#b9a2ff', '#fff'].map((c, i) => `<circle class="tw" style="animation-delay:${i * .35}s" cx="${[26, 178, 34, 170, 150][i]}" cy="${[110, 104, 160, 170, 40][i]}" r="${[4, 3.5, 3, 4, 3][i]}" fill="${c}"/>`).join('') + butterfly(36, 50, '#b9a2ff', '#7a68c4')}),
    ISTJ: K => ({fc: {mouth: 'smile'}, arms: 'hold', tuft: 'neat',
      faceAcc: `<g fill="#fff" fill-opacity=".18" stroke="${INK}" stroke-width="3"><rect x="66" y="105" width="28" height="22" rx="5"/><rect x="106" y="105" width="28" height="22" rx="5"/></g><path d="M94 114h12" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M100 150L86 142V158ZM100 150L114 142V158Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/><rect x="96" y="146" width="8" height="8" rx="2" fill="${K.b}" stroke="${K.lb}" stroke-width="2.2"/>`,
      hold: `<g transform="rotate(-6 ${K.hold[0]} ${K.hold[1]})"><rect x="${K.hold[0] - 22}" y="${K.hold[1] - 14}" width="44" height="32" rx="4" fill="#fffaf0" stroke="${K.lb}" stroke-width="2.6"/><rect x="${K.hold[0] - 8}" y="${K.hold[1] - 18}" width="16" height="7" rx="2" fill="${K.b}" stroke="${K.lb}" stroke-width="2"/>${[0, 1, 2].map(i => `<path d="M${K.hold[0] - 16} ${K.hold[1] - 4 + i * 9}l3 3 5-6" fill="none" stroke="${K.a}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M${K.hold[0] - 4} ${K.hold[1] - 3 + i * 9}h18" stroke="${K.lb}" stroke-width="2" opacity=".5" stroke-linecap="round"/>`).join('')}</g>`}),
    ISFJ: K => ({fc: {mouth: 'cat'},
      faceAcc: `<path d="M46 150Q100 166 154 150L156 166Q100 182 44 166Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/><path d="M64 156l0 12M80 160l0 12M96 162l0 12M112 162l0 12M128 160l0 12M144 156l0 12" stroke="#fff" stroke-width="2" opacity=".35"/>` +
        `<g class="wig" style="transform-origin:66px 166px"><path d="M58 164L52 196L70 194L74 166Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/></g>`,
      front: `<ellipse cx="148" cy="186" rx="9" ry="13" fill="${K.a}" stroke="${K.line}" stroke-width="3" transform="rotate(-30 148 186)"/><path d="M134 168h30l-3 22a8 8 0 0 1-8 7h-8a8 8 0 0 1-8-7z" fill="#fffaf2" stroke="${K.line}" stroke-width="3" stroke-linejoin="round"/><path d="M164 174a7 7 0 0 1 0 12" fill="none" stroke="${K.line}" stroke-width="3"/>${heart(149, 181, 4.5, K.b)}` +
        `<g class="steam" fill="none" stroke="${mixHex(K.b, INK, .1)}" stroke-width="3" stroke-linecap="round"><path d="M144 160q-5-6 0-12t0-12"/><path d="M154 160q-5-6 0-12t0-12" style="animation-delay:.7s"/></g>`, arms: 'lonly'}),
    ESTJ: K => ({fc: {brow: 'bold', mouth: 'grin'}, arms: 'wave', tuft: 'none',
      top: `<path d="M56 82Q56 54 100 54Q144 54 144 82Z" fill="${mixHex(K.a, INK, .45)}" stroke="${K.line}" stroke-width="3" stroke-linejoin="round"/><path d="M50 82H150Q152 92 140 92H60Q48 92 50 82Z" fill="${INK}"/><rect x="56" y="72" width="88" height="8" fill="${K.b}"/>${star5(100, 64, 7, GOLD, GOLD_D)}`,
      faceAcc: `<path d="M72 138L100 158L128 138" fill="none" stroke="${K.b}" stroke-width="3"/><path d="M94 156h14a5 5 0 0 1 0 10h-14z" fill="#e6e9ef" stroke="${K.line}" stroke-width="2.4"/>`,
      hand: `<g transform="translate(${K.hand[0]} ${K.hand[1] - 4}) rotate(-25)"><path d="M-4 -6L18 -16V16L-4 6Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="18" cy="0" rx="4.5" ry="16" fill="${mixHex(K.b, '#fff', .5)}" stroke="${K.lb}" stroke-width="2.4"/><rect x="-10" y="-6" width="8" height="12" rx="2" fill="${K.lb}"/></g><g class="tw" stroke="${K.b}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M${K.hand[0] + 26} ${K.hand[1] - 30}q6 6 0 12M${K.hand[0] + 34} ${K.hand[1] - 36}q10 12 0 22"/></g>`}),
    ESFJ: K => ({fc: {l: 'happy', mouth: 'cat'}, arms: 'hold', tuft: 'none',
      top: `<g class="wig" style="transform-origin:100px 76px"><path d="M100 76L76 62Q70 76 76 90Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.6" stroke-linejoin="round"/><path d="M100 76L124 62Q130 76 124 90Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="100" cy="76" r="6" fill="${K.b}" stroke="${K.lb}" stroke-width="2.4"/></g>`,
      front: `<path d="M64 146H136V190Q100 204 64 190Z" fill="#fffaf4" stroke="${K.line}" stroke-width="2.6" stroke-linejoin="round" opacity=".95"/><path d="M64 146L54 128M136 146L146 128" stroke="#fffaf4" stroke-width="4"/>`,
      hold: `<path d="M${K.hold[0] - 14} ${K.hold[1] - 4}h28l-4 20h-20z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/><path d="M${K.hold[0] - 8} ${K.hold[1] - 4}v20M${K.hold[0]} ${K.hold[1] - 4}v20M${K.hold[0] + 8} ${K.hold[1] - 4}v20" stroke="${K.lb}" stroke-width="1.6" opacity=".5"/><path d="M${K.hold[0] - 17} ${K.hold[1] - 3}Q${K.hold[0] - 20} ${K.hold[1] - 16} ${K.hold[0] - 8} ${K.hold[1] - 16}Q${K.hold[0] - 6} ${K.hold[1] - 26} ${K.hold[0] + 4} ${K.hold[1] - 22}Q${K.hold[0] + 18} ${K.hold[1] - 20} ${K.hold[0] + 17} ${K.hold[1] - 3}Z" fill="#fff0f4" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${K.hold[0] + 2}" cy="${K.hold[1] - 28}" r="5" fill="#ff4f6d" stroke="${INK}" stroke-width="2"/>`,
      scene: `<g class="rise">${heart(32, 96, 6, K.b)}</g><g class="rise" style="animation-delay:1s">${heart(168, 90, 5, K.a)}</g>${sparkle(160, 50, 5, '#fff', 'tw', .4)}`}),
    ISTP: K => ({fc: {l: 'calm', mouth: 'flat'}, arms: 'wave',
      faceAcc: `<path d="M46 104Q100 86 158 96L160 110Q100 102 46 120Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.6" stroke-linejoin="round"/><g class="wig" style="transform-origin:156px 104px"><path d="M156 102L176 92L172 106ZM156 106L178 112L166 118Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/></g>`,
      hand: `<g transform="translate(${K.hand[0]} ${K.hand[1]}) rotate(25)"><path d="M-3 0V-30" stroke="#c9d1dc" stroke-width="7" stroke-linecap="round"/><path d="M-3 -30m-9 0a9 9 0 1 0 18 0l-5 -2v-6h-8v6z" fill="#c9d1dc" stroke="${K.line}" stroke-width="2.4" stroke-linejoin="round"/></g>`,
      scene: `<g transform="translate(34 70)">${gear(0, 0, 10, K.b, K.lb)}</g><g transform="translate(52 44)">${gear(0, 0, 6, '#c9d1dc', K.line)}</g>`}),
    ISFP: K => ({fc: {l: 'calm', mouth: 'smile', blush: .6}, arms: 'wave', tuft: 'none',
      top: `<g transform="rotate(-14 110 46)"><ellipse cx="110" cy="50" rx="30" ry="12" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.6"/><path d="M110 38l2-8" stroke="${K.lb}" stroke-width="3.4" stroke-linecap="round"/></g>`,
      front: `<g transform="translate(32 168) rotate(-20)"><path d="M0 -12C16 -16 26 -6 22 4C18 12 8 6 2 12C-8 18 -16 4 -12 -4C-10 -8 -6 -10 0 -12Z" fill="#fff6ea" stroke="${K.line}" stroke-width="2.4"/><circle cx="2" cy="-4" r="3.4" fill="${K.a}"/><circle cx="12" cy="-6" r="3" fill="${K.b}"/><circle cx="14" cy="3" r="3" fill="#7fb7ff"/><circle cx="-5" cy="4" r="3" fill="${GOLD}"/></g>`,
      hand: `<g transform="translate(${K.hand[0]} ${K.hand[1]}) rotate(30)"><path d="M0 4V-26" stroke="#8a5a3c" stroke-width="4" stroke-linecap="round"/><path d="M-4 -26h8l-1 -6h-6z" fill="#c9d1dc"/><path d="M-3 -32Q0 -46 3 -32Z" fill="${K.a}" stroke="${K.line}" stroke-width="1.6"/></g>`,
      scene: butterfly(36, 60, mixHex(K.b, '#fff', .2), K.lb) + `<circle class="tw" cx="170" cy="60" r="4" fill="${K.a}"/><circle class="tw" style="animation-delay:.6s" cx="160" cy="40" r="3" fill="#7fb7ff"/><circle class="tw" style="animation-delay:1.2s" cx="26" cy="110" r="3.5" fill="${GOLD}"/>`}),
    ESTP: K => ({fc: {l: 'open', rgt: 'happy', mouth: 'open'}, arms: 'wave',
      faceAcc: `<g><rect x="64" y="96" width="30" height="16" rx="8" fill="${INK}"/><rect x="106" y="96" width="30" height="16" rx="8" fill="${INK}"/><path d="M94 102h12" stroke="${INK}" stroke-width="4"/><path d="M70 100l8 0" stroke="#fff" stroke-width="2.5" opacity=".6" stroke-linecap="round"/></g>`,
      hand: `<path d="M${K.hand[0]} ${K.hand[1] - 14}l3-9 3 9 9 3-9 3-3 9-3-9-9-3z" fill="${GOLD}"/>`,
      scene: `<g class="speed" stroke="${K.b}" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M14 120h20M8 142h26M18 164h14"/></g>`}),
    ESFP: K => ({fc: {l: 'star', mouth: 'open'}, arms: 'wave',
      behind: `<circle cx="100" cy="130" r="84" fill="url(#glow${K.id})" opacity=".55" class="flick"/>`,
      top: star5(122, 34, 8, GOLD, GOLD_D, 'tw'),
      hand: `<g transform="translate(${K.hand[0]} ${K.hand[1]}) rotate(20)"><path d="M0 6V-14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="-20" r="9" fill="#d9dde6" stroke="${INK}" stroke-width="2.4"/><path d="M-6 -24h12M-7 -18h14" stroke="${INK}" stroke-width="1.4" opacity=".5"/></g>`,
      scene: note(30, 92, K.a, 0) + note(160, 60, K.b, 1.1) + note(40, 160, GOLD, 2) + sparkle(150, 30, 5, '#fff', 'tw', .5)})
  };

  // ---------- Penanda family: tekstur halus di dalam badan + pin kecil ----------
  // Bahasanya sama dengan motif sampul PDF: NT kisi, NF riak, SJ garis rapi, SP diagonal.
  function famTex(F) {
    let d = '';
    if (F === 'NT') { for (let k = -220; k <= 420; k += 18) d += `M${k} 0L${k - 220} 220M${k} 0L${k + 220} 220`; return `<path d="${d}" stroke="#fff" stroke-width="1.4" opacity=".13"/>`; }
    if (F === 'NF') { for (let r = 26; r <= 260; r += 15) d += `<circle cx="36" cy="214" r="${r}"/>`; return `<g fill="none" stroke="#fff" stroke-width="1.5" opacity=".15">${d}</g>`; }
    if (F === 'SJ') { for (let y = 16; y <= 214; y += 12) d += `M0 ${y}H200`; return `<path d="${d}" stroke="#fff" stroke-width="1.4" opacity=".12"/>`; }
    for (let x = -120; x <= 220; x += 22) d += `M${x} 220L${x + 70} 0`; return `<path d="${d}" stroke="#fff" stroke-width="2.4" stroke-dasharray="12 9" opacity=".16"/>`;
  }
  function famPin(F, x, y, line) {
    const g = {NT: 'M-4.5 -4.5h9v9h-9zM0 -4.5v9M-4.5 0h9', NF: 'M-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0', SJ: 'M-5 -3.5h10M-5 0h10M-5 3.5h10', SP: 'M-5 4L-1 -4M1 4L5 -4'}[F];
    return `<g transform="translate(${x} ${y})"><circle r="9" fill="#fff" stroke="${line}" stroke-width="2.4"/><path d="${g}" fill="none" stroke="${line}" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }

  // ---------- Perakit ----------
  function build(t, spec, o = {}) {
    const id = ++uid, F = fam(t), {a, b} = o.pal || pal(t), FB = BASE[F], B = o.base || FB;
    const line = mixHex(a, INK, .5), lb = mixHex(b, INK, .45);
    const K = {id, a, b, line, lb, F, hand: B.hand || HAND[F], hold: B.hold || HOLD[F]};
    const FM = o.famMark || {};
    const dT = [B.tip[0] - FB.tip[0], B.tip[1] - FB.tip[1]], dF = B.fy - FB.fy;
    const mv = (s, dx, dy) => s && (dx || dy) ? `<g transform="translate(${dx} ${dy})">${s}</g>` : (s || '');
    const S = spec(K);
    const g = `url(#${S.bodyFill ? 'bf' + id : 'g' + id})`;
    const feetC = mixHex(a, INK, .25);
    const arm = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(${r} ${x} ${y})"/>`;
    const A = B.arms, pose = B.noArms ? 'none' : (S.arms || 'down');
    const sideArms = pose === 'down' ? arm(...A.l) + arm(...A.r)
      : pose === 'wave' ? arm(...A.l) + `<g class="wave" style="transform-origin:${A.wave[0] - 8}px ${A.wave[1] + 18}px">${arm(...A.wave)}${S.hand || ''}</g>`
      : pose === 'chin' ? arm(...A.l) : pose === 'lonly' ? arm(...A.l) : '';
    const holdArms = pose === 'hold' ? arm(...A.hl) + arm(...A.hr) : pose === 'chin' ? arm(...A.chin) : '';
    let tuft = '';
    if (F === 'SJ' && !S.tuft) tuft = `<path d="M96 76Q92 62 102 56Q100 66 108 72" fill="${a}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>`;
    if (F === 'SJ' && S.tuft === 'neat') tuft = `<path d="M70 80Q84 66 112 70Q128 72 132 80" fill="${mixHex(a, INK, .2)}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>`;
    if (F === 'SP' && S.tuft !== 'none') tuft = `<g class="flame"><path d="M100 58C88 40 104 26 100 4C118 18 124 34 118 48C124 42 127 34 126 24C140 38 138 58 122 66Z" fill="url(#h${id})" stroke="${lb}" stroke-width="2.6" stroke-linejoin="round"/><path d="M106 56C102 46 110 38 108 26C116 36 118 46 114 56Z" fill="#fff6c4" opacity=".85"/></g>`;
    const [sx, sy, srx, sry] = B.shine;
    const body = (S.behind || '') +
      (B.feet ? `<ellipse cx="${B.feetX ? B.feetX[0] : 80}" cy="${B.feet}" rx="14" ry="7.5" fill="${feetC}" stroke="${line}" stroke-width="3"/><ellipse cx="${B.feetX ? B.feetX[1] : 120}" cy="${B.feet}" rx="14" ry="7.5" fill="${feetC}" stroke="${line}" stroke-width="3"/>` : '') + (B.under ? B.under(K) : '') +
      (F === 'SP' ? mv(tuft, ...dT) : '') +
      `<path d="${B.shape()}" fill="${g}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>` + ((S.inside || FM.tex) ? `<g clip-path="url(#cl${id})">${S.inside || ''}${FM.tex ? famTex(F) : ''}</g>` : '') +
      (B.extra ? (typeof B.extra === 'function' ? B.extra(K) : B.extra) : '') + `<ellipse cx="${sx}" cy="${sy}" rx="${srx}" ry="${sry}" fill="#fff" opacity=".38" transform="rotate(-25 ${sx} ${sy})"/>` +
      (F === 'SJ' ? mv(tuft, ...dT) : '') + mv(S.top, ...dT) + sideArms +
      face({y: B.fy, lid: a, ...(B.face || {}), ...(S.fc || {})}) + mv(S.faceAcc, 0, dF) + (S.front || '') + (S.hold || '') + holdArms +
      (FM.pin ? famPin(F, ...(B.pin || [68, 184]), line) : '');
    const extraDefs = (S.bodyFill ? `<defs>${S.bodyFill(`bf${id}`)}</defs>` : '') + ((S.inside || FM.tex) ? `<defs><clipPath id="cl${id}"><path d="${B.shape()}"/></clipPath></defs>` : '');
    const shadowY = B.shadowY || 207;
    const inner = B.rot ? `<g transform="rotate(${B.rot} 100 200)">${body}</g>` : body;
    return `<svg class="chr f-${F} s-roh" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Karakter ${t}${o.label ? ' ' + o.label : ''}">` +
      defs(id, a, b) + extraDefs + `<ellipse class="shadow" cx="100" cy="${shadowY}" rx="46" ry="7" fill="#000" opacity=".2"/>${S.scene || ''}<g class="body">${inner}</g>${S.over || ''}</svg>`;
  }
  // INFP: badan Kosmos + gerhana sebagai lingkaran cahaya (pilihan pemilik).
  const INFP_OPSI = {
    gerhana: {nama: '2. Penjaga Gerhana', isi: 'gerhana H+ jadi lingkaran cahaya di belakang kepala; korona tumbuh jadi daun dan kuncup', spec: K => ({fc: {l: 'calm', mouth: 'smile'},
      behind: `<g class="spin" style="animation-duration:40s">${Array.from({length: 16}, (_, i) => { const an = i * Math.PI / 8, r1 = 62, r2 = i % 2 ? 74 : 84; return `<path d="M${f1(100 + r1 * Math.cos(an))} ${f1(84 + r1 * Math.sin(an))}L${f1(100 + r2 * Math.cos(an))} ${f1(84 + r2 * Math.sin(an))}" stroke="#ffe7a8" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`; }).join('')}` +
        [0, 2, 4, 6].map(i => { const an = i * Math.PI / 4 + .2, x = 100 + 76 * Math.cos(an), y = 84 + 76 * Math.sin(an); return leaf(f1(x), f1(y), 9, f1(an * 180 / Math.PI), mixHex(K.b, '#fff', .2), K.lb) + `<circle cx="${f1(100 + 86 * Math.cos(an + .25))}" cy="${f1(84 + 86 * Math.sin(an + .25))}" r="4" fill="${K.b}" stroke="${K.lb}" stroke-width="1.6"/>`; }).join('') + `</g>` +
        `${glow(K.id, 100, 84, 84, 'flick')}<circle cx="100" cy="84" r="58" fill="${INK}" stroke="#ffe7a8" stroke-width="3.4"/><circle cx="100" cy="84" r="53" fill="none" stroke="${K.b}" stroke-width="1.4" opacity=".55"/>${flower(66, 64, 5, mixHex(K.b, '#2b2236', .35), mixHex(K.b, INK, .6))}${flower(136, 104, 4, mixHex(K.b, '#2b2236', .35), mixHex(K.b, INK, .6))}${sparkle(146, 44, 9, '#fff', 'tw')}`,
      top: `<g class="wig" style="transform-origin:100px 44px">${flower(100, 38, 7, `url(#h${K.id})`, K.lb)}</g>`})},
    kosmos: {nama: '3. Roh Kosmos', isi: 'badan seperti jeli bening berisi nebula dan bintang (dari draf D), bintang kecil di ujung kepala', spec: K => ({fc: {l: 'star', mouth: 'smile'},
      bodyFill: id => `<linearGradient id="${id}" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${mixHex(K.b, '#2a2050', .35)}"/><stop offset=".55" stop-color="${mixHex(K.a, K.b, .35)}"/><stop offset="1" stop-color="${K.a}"/></linearGradient>`,
      inside: `<ellipse cx="80" cy="170" rx="40" ry="18" fill="${K.b}" opacity=".35" transform="rotate(-20 80 170)"/><ellipse cx="128" cy="110" rx="30" ry="12" fill="#fff" opacity=".14" transform="rotate(30 128 110)"/>` +
        [[70, 96, 2], [126, 88, 1.6], [62, 178, 1.8], [138, 176, 2.2], [112, 190, 1.4], [84, 112, 1.2], [146, 140, 1.5]].map(([x, y, r], i) => `<circle class="tw" style="animation-delay:${i * .3}s" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') +
        `<path d="M110 172q14-10 26 0q-12 4-26 0" fill="none" stroke="#fff" stroke-width="1.4" opacity=".5"/>`,
      top: star5(100, 34, 9, GOLD, GOLD_D, 'tw'),
      scene: sparkle(34, 66, 5, K.b, 'tw', .2) + sparkle(166, 56, 6, '#fff', 'tw', .9) + `<circle class="tw" cx="150" cy="30" r="2.4" fill="#fff"/><circle class="tw" style="animation-delay:.6s" cx="46" cy="40" r="2" fill="#fff"/>`})}
  };
  const kos = INFP_OPSI.kosmos.spec, ger = INFP_OPSI.gerhana.spec;
  INFP_OPSI.kosmosGerhana = {nama: '3+2. Kosmos Gerhana', isi: 'badan jeli kosmos dengan gerhana sebagai lingkaran cahaya di belakang kepala', spec: K => { const k = kos(K), g = ger(K); return {...k, behind: g.behind, top: g.top, scene: sparkle(30, 150, 5, K.b, 'tw', .2) + sparkle(172, 150, 4, '#fff', 'tw', .9)}; }};
  // ---------- Versi badan unik per tipe (tidak mengikuti family) ----------
  const circ = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`;
  const scallop = (cx, cy, R, n, amp) => { let d = ''; for (let i = 0; i <= n; i++) { const an = -Math.PI / 2 + i * 2 * Math.PI / n, p = [f1(cx + R * Math.cos(an)), f1(cy + R * Math.sin(an))]; if (!i) d = `M${p[0]} ${p[1]}`; else { const m = an - Math.PI / n; d += `Q${f1(cx + (R + amp * 2) * Math.cos(m))} ${f1(cy + (R + amp * 2) * Math.sin(m))} ${p[0]} ${p[1]}`; } } return d + 'Z'; };
  const starPts = (cx, cy, R, r) => Array.from({length: 10}, (_, i) => { const rr = i % 2 ? r : R, an = -Math.PI / 2 + i * Math.PI / 5; return [f1(cx + rr * Math.cos(an)), f1(cy + rr * Math.sin(an))]; });
  const arms = (l, r, wave, hl, hr, chin) => ({l, r, wave, hl, hr, chin});
  const UNIK = {
    INTJ: {nama: 'menara kristal', shape: () => roundPoly([[100, 26], [138, 64], [140, 202], [60, 202], [62, 64]], 14), fy: 120, face: {gap: 17, r: 9}, tip: [100, 26],
      arms: arms([58, 156, 15], [142, 156, -15], [148, 126, -35], [78, 176, -62], [122, 176, 62], [120, 160, -40]), hand: [154, 112], hold: [100, 178], pin: [118, 184], shine: [80, 92, 7, 16], feet: 202,
      extra: `<path d="M100 32V70M70 66L86 80M130 66L114 80" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>`},
    INTP: {nama: 'awan pikiran', shape: () => 'M58 202C40 202 32 186 40 172C26 162 30 138 50 136C46 112 72 98 90 110C98 90 132 92 138 114C158 108 174 130 164 148C178 160 172 188 152 194C146 202 138 202 128 202Z', fy: 150, face: {gap: 19}, tip: [114, 94],
      arms: arms([40, 178, 25], [164, 178, -25], [166, 150, -35], [78, 188, -62], [122, 188, 62], [132, 182, -40]), hold: [100, 190], pin: [146, 186], shine: [72, 140, 9, 14], feet: 202},
    ENTJ: {nama: 'roket', shape: () => 'M100 30C134 50 148 92 148 140V184Q100 198 52 184V140C52 92 66 50 100 30Z', fy: 118, face: {gap: 20}, tip: [100, 34],
      arms: arms([46, 148, 20], [154, 148, -20], [158, 118, -35], [78, 178, -62], [122, 178, 62], [122, 150, -40]), hand: [164, 104], shine: [72, 88, 9, 18], feet: 0, pin: [126, 172],
      under: K => `<g class="flame" style="transform-origin:100px 190px"><path d="M84 188Q100 228 116 188Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="2.4" stroke-linejoin="round"/><path d="M92 190Q100 212 108 190Z" fill="#fff6c4"/></g>` +
        `<path d="M54 140L28 184V202L56 186Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/><path d="M146 140L172 184V202L144 186Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/>`},
    ENTP: {nama: 'bohlam', shape: () => 'M72 172C72 158 38 146 38 106C38 70 66 44 100 44C134 44 162 70 162 106C162 146 128 158 128 172Z', fy: 106, face: {gap: 21}, tip: [100, 44],
      arms: arms([42, 132, 25], [158, 132, -25], [162, 104, -35], [78, 160, -62], [122, 160, 62], [124, 132, -40]), hand: [168, 90], pin: [146, 142], shine: [66, 82, 11, 18], feet: 0,
      extra: K => `<rect x="70" y="168" width="60" height="30" rx="9" fill="#cfd4de" stroke="${K.line}" stroke-width="3"/><path d="M72 178H128M72 188H128" stroke="${K.line}" stroke-width="2.2" opacity=".55"/><path d="M90 198H110L106 204H94Z" fill="${K.line}"/>`},
    INFJ: {nama: 'bola kristal', shape: () => circ(100, 116, 64), fy: 116, face: {gap: 21}, tip: [100, 52],
      arms: arms([38, 136, 25], [162, 136, -25], [164, 108, -35], [80, 164, -62], [120, 164, 62], [124, 140, -40]), pin: [140, 152], shine: [66, 86, 12, 20], feet: 0,
      under: K => `<path d="M62 168L138 168L152 202L48 202Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/><path d="M56 190H144" stroke="${K.lb}" stroke-width="2" opacity=".5"/>`},
    INFP: {nama: 'tetesan kosmos + gerhana (gabungan 3+2)', ...BASE.NF, pin: [134, 180]},
    ENFJ: {nama: 'matahari', shape: () => scallop(100, 128, 64, 14, 6), fy: 124, face: {gap: 21}, tip: [100, 58],
      arms: arms([36, 150, 25], [164, 150, -25], [166, 120, -35], [78, 178, -62], [122, 178, 62], [124, 156, -40]), hold: [100, 180], pin: [150, 108], shine: [66, 96, 10, 16], feet: 200},
    ENFP: {nama: 'bintang', shape: () => roundPoly(starPts(100, 130, 82, 48), 16), fy: 128, face: {gap: 18}, tip: [100, 52], noArms: true,
      arms: arms([0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]), pin: [124, 160], shine: [80, 104, 8, 14], feet: 199, feetX: [54, 146]},
    ISTJ: {nama: 'jam weker', shape: () => circ(100, 128, 62), fy: 124, face: {gap: 19}, tip: [100, 62],
      arms: arms([40, 150, 20], [160, 150, -20], [164, 120, -35], [78, 182, -62], [122, 182, 62], [124, 150, -40]), hold: [100, 186], shine: [66, 98, 10, 16], feet: 199, feetX: [70, 130], pin: [146, 176],
      under: K => `<path d="M100 66V56" stroke="${K.line}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="53" r="5" fill="${K.b}" stroke="${K.line}" stroke-width="2.4"/>` +
        `<g class="ring"><path d="M48 84A20 20 0 0 1 78 60Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/><path d="M152 84A20 20 0 0 0 122 60Z" fill="url(#h${K.id})" stroke="${K.lb}" stroke-width="3" stroke-linejoin="round"/></g>`,
      extra: K => Array.from({length: 12}, (_, i) => { const an = i * Math.PI / 6, r1 = i % 3 ? 54 : 50; return `<path d="M${f1(100 + r1 * Math.cos(an))} ${f1(128 + r1 * Math.sin(an))}L${f1(100 + 58 * Math.cos(an))} ${f1(128 + 58 * Math.sin(an))}" stroke="${K.line}" stroke-width="${i % 3 ? 2 : 3.4}" stroke-linecap="round" opacity=".55"/>`; }).join('')},
    ISFJ: {nama: 'bakpao', shape: () => 'M38 168C38 120 66 90 100 90C134 90 162 120 162 168C162 192 136 203 100 203C64 203 38 192 38 168Z', fy: 140, face: {gap: 21}, tip: [100, 90],
      arms: arms([40, 172, 20], [160, 172, -20], [164, 146, -35], [78, 186, -62], [122, 186, 62], [124, 168, -40]), pin: [136, 108], shine: [66, 122, 10, 15], feet: 203,
      extra: K => `<path d="M86 98Q100 84 114 98M93 94Q100 88 107 94" fill="none" stroke="${K.line}" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`},
    ESTJ: {nama: 'lencana perisai', shape: () => 'M40 72Q100 54 160 72L156 140Q150 182 100 202Q50 182 44 140Z', fy: 112, face: {gap: 21}, tip: [100, 64],
      arms: arms([44, 148, 20], [156, 148, -20], [162, 120, -35], [78, 178, -62], [122, 178, 62], [124, 146, -40]), hand: [168, 106], shine: [64, 98, 10, 16], feet: 199, feetX: [84, 116], pin: [100, 184],
      extra: K => `<path d="M52 80Q100 66 148 80L145 140Q140 174 100 190Q60 174 55 140Z" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/>`},
    ESFJ: {nama: 'hati', shape: () => 'M100 200C58 174 28 146 28 110C28 82 50 64 74 64C88 64 96 72 100 82C104 72 112 64 126 64C150 64 172 82 172 110C172 146 142 174 100 200Z', fy: 118, face: {gap: 22}, tip: [100, 82],
      arms: arms([34, 124, 25], [166, 124, -25], [168, 96, -35], [80, 172, -62], [120, 172, 62], [124, 140, -40]), hold: [100, 178], pin: [150, 98], shine: [56, 90, 10, 14], feet: 199, feetX: [84, 116]},
    ISTP: {nama: 'mur heksagon', shape: () => roundPoly([[70, 72], [130, 72], [164, 137], [130, 202], [70, 202], [36, 137]], 10), fy: 132, face: {gap: 20}, tip: [100, 72],
      arms: arms([40, 162, 20], [160, 162, -20], [166, 124, -35], [78, 182, -62], [122, 182, 62], [124, 156, -40]), hand: [172, 110], pin: [134, 182], shine: [64, 104, 9, 15], feet: 203,
      extra: `<circle cx="100" cy="190" r="4" fill="#fff" opacity=".35"/>`},
    ISFP: {nama: 'kuncup daun', shape: () => 'M124 30C122 52 162 92 160 146C160 184 132 202 100 202C66 202 40 184 40 146C40 98 84 58 124 30Z', fy: 142, face: {gap: 20}, tip: [122, 34],
      arms: arms([42, 162, 30], [158, 164, -30], [164, 128, -40], [78, 182, -62], [122, 182, 62], [126, 170, -40]), hand: [170, 114], pin: [136, 180], shine: [70, 118, 10, 18], feet: 200,
      extra: `<path d="M122 36Q100 70 98 104" fill="none" stroke="#fff" stroke-width="2.6" opacity=".35" stroke-linecap="round"/>`},
    ESTP: {nama: 'api (tetap)', ...BASE.SP, pin: [132, 184]},
    ESFP: {nama: 'balon', shape: () => circ(100, 112, 66), fy: 112, face: {gap: 21}, tip: [100, 46],
      arms: arms([38, 128, 25], [162, 128, -25], [166, 96, -35], [80, 160, -62], [120, 160, 62], [124, 130, -40]), hand: [172, 82], pin: [138, 150], shine: [66, 80, 12, 20], feet: 0, shadowY: 214,
      extra: K => `<path d="M100 178C92 190 110 198 100 214" fill="none" stroke="${K.line}" stroke-width="2.2"/><path d="M93 186L107 186L100 176Z" fill="${K.a}" stroke="${K.line}" stroke-width="2.4" stroke-linejoin="round"/>`}
  };
  // Penyesuaian aksesori untuk badan unik
  const UNIK_SPEC = {
    ENTP: K => ({...SPEC.ENTP(K), scene: sparkle(40, 64, 5, K.b, 'tw', .6) + sparkle(164, 48, 6, GOLD, 'tw', .2) + `<path class="tw" style="animation-delay:.3s" d="M30 96l6-10 2 6 6-8" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
      inside: `<circle class="flick" cx="100" cy="118" r="54" fill="url(#glow${K.id})" opacity=".8"/><path d="M84 168V146Q84 136 92 140Q100 128 108 140Q116 136 116 146V168" fill="none" stroke="#fff6c4" stroke-width="3" stroke-linecap="round" opacity=".9"/>`}),
    INFJ: K => ({...SPEC.INFJ(K), arms: 'down', hold: '',
      inside: `<circle class="flick" cx="100" cy="128" r="44" fill="url(#glow${K.id})" opacity=".5"/><path d="M52 150Q80 130 104 150T150 146" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/>` + [[70, 82], [134, 96], [124, 162], [72, 164]].map(([x, y], i) => `<circle class="tw" style="animation-delay:${i * .4}s" cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}),
    INFP: INFP_OPSI.kosmosGerhana.spec,
    ENFJ: K => ({...SPEC.ENFJ(K), behind: `<circle class="flick" cx="100" cy="128" r="90" fill="url(#glow${K.id})" opacity=".6"/>`}),
    ISFJ: K => { const s = SPEC.ISFJ(K); return {...s, faceAcc: `<g transform="translate(0 -14)">${s.faceAcc}</g>`}; },
    ESFJ: K => ({...SPEC.ESFJ(K), front: ''}),
    ENTJ: K => ({...SPEC.ENTJ(K), behind: ''}),
    ISTJ: K => ({...SPEC.ISTJ(K), tuft: 'none'})
  };
  const rohUnik = (t, famMark) => build(t, UNIK_SPEC[t] || SPEC[t], {base: UNIK[t] && UNIK[t].shape ? UNIK[t] : undefined, famMark});


  // ---------- Telur Nebula (E1): progres netral selama mengisi soal ----------
  // Sama untuk semua orang: hanya bergantung pada jumlah soal terjawab dan modul selesai, bukan isi jawaban.
  const EGG = 'M100 30C140 30 166 96 166 142C166 184 136 206 100 206C64 206 34 184 34 142C34 96 60 30 100 30Z';
  const CRACK = ['M70 70L80 86L72 98', 'M132 82L122 96L130 110L120 120', 'M54 140L70 150L62 166L76 178', 'M146 150L132 160L140 176'];
  const EGG_STARS = (() => { let sd = 7; const rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647, out = [];
    const inEgg = (x, y) => { const t = (y - 125) / 86, rx = t < 0 ? 54 + 12 * (1 + t) : 64; return ((x - 100) / rx) ** 2 + t * t < .85; };
    while (out.length < 64) { const x = 40 + rnd() * 120, y = 40 + rnd() * 165; if (inEgg(x, y)) out.push([f1(x), f1(y), f1(.8 + rnd() * 1.8), f1(rnd() * 2)]); }
    return out; })();
  const blob = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  // p: 0..1 (soal utama terjawab), k: jumlah modul utama selesai (0..4).
  function eggSVG(p, k) {
    p = Math.max(0, Math.min(1, +p || 0)); k = Math.max(0, Math.min(4, k | 0));
    const id = 'eg' + (++uid), st = EGG_STARS.slice(0, Math.round(p * EGG_STARS.length));
    const wob = p >= 1 ? '' : p >= .9 ? ' l3' : p >= .6 ? ' l2' : p >= .25 ? ' l1' : '';
    return `<svg class="egg" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Telur misterius, ${Math.round(p * 100)}% terisi">` +
      `<defs><clipPath id="${id}c"><path d="${EGG}"/></clipPath>${blob(id + 'b1', '#b9a6ff')}${blob(id + 'b2', '#7fd6c6')}${blob(id + 'b3', '#ffb8a0')}${blob(id + 'h', '#fff3c0')}` +
      `<linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3070"/><stop offset="1" stop-color="#191433"/></linearGradient></defs>` +
      `<ellipse class="eg-sh" cx="100" cy="212" rx="50" ry="8" fill="#000" opacity=".2"/><circle cx="100" cy="125" r="100" fill="url(#${id}h)" opacity="${f1(Math.max(0, p - .4) * 1.3)}"/>` +
      `<g class="eg-wob${wob}"><g class="eg-shell"><path d="${EGG}" fill="url(#${id}bg)"/>` +
      `<g clip-path="url(#${id}c)"><g class="eg-spin"><circle cx="70" cy="96" r="62" fill="url(#${id}b1)" opacity=".75"/><circle cx="138" cy="150" r="56" fill="url(#${id}b2)" opacity=".55"/><circle cx="88" cy="186" r="52" fill="url(#${id}b3)" opacity=".6"/></g>` +
      st.map(([x, y, r, t]) => `<circle class="tw" style="animation-delay:${t}s" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') + `</g>` +
      `<path d="${EGG}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0.1 ${f1(7 - 4.6 * p)}" opacity="${f1(.25 + .75 * p)}"/><path d="${EGG}" fill="none" stroke="#8f80e0" stroke-width="2" opacity=".6"/>` +
      CRACK.slice(0, k).map(d => `<path d="${d}" fill="none" stroke="#ffe9a8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path d="${d}" fill="none" stroke="#fff6d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`).join('') +
      (p >= .75 && p < 1 ? `<g class="eg-peek"><path d="M74 128L86 118L96 128L106 116L116 126L128 118" fill="none" stroke="#fff6d6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="100" cy="134" rx="24" ry="11" fill="#0b0918"/><ellipse class="eye" cx="91" cy="134" rx="3.6" ry="5.2" fill="#fff"/><ellipse class="eye" cx="109" cy="134" rx="3.6" ry="5.2" fill="#fff"/></g>` : '') +
      `<ellipse cx="74" cy="80" rx="9" ry="17" fill="#fff" opacity=".25" transform="rotate(-25 74 80)"/></g></g></svg>`;
  }

  // Karakter tipe: badan unik, family terbaca lewat tekstur + pin dan gaya gerak (kelas f-NT/NF/SJ/SP).
  // wave: pose melambai untuk halaman penutup (benda yang dipegang dua tangan disimpan dulu).
  const charSVG = (t, o = {}) => {
    if (!o.wave) return rohUnik(t, {tex: true, pin: true});
    const base = UNIK_SPEC[t] || SPEC[t];
    const spec = K => { const S = base(K); return {...S, arms: 'wave', hold: '', hand: S.arms === 'wave' ? S.hand : '', front: t === 'ISFJ' ? '' : S.front}; };
    return build(t, spec, {base: UNIK[t] && UNIK[t].shape ? UNIK[t] : undefined, famMark: {tex: true, pin: true}});
  };
  G.KARAKTER = {svg: charSVG, egg: eggSVG, fam};
})(typeof window !== 'undefined' ? window : globalThis);
