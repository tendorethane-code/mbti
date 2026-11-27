// Draf karakter per tipe. Tiga arah gaya:
//   A. Roh Peta    : makhluk roh kecil; bentuk badan mengikuti family (NT kristal, NF tetes, SJ roti, SP api miring)
//   B. Chibi Mini  : kepala besar bertudung, warna kulit fantasi (bukan warna kulit manusia), tanpa gender
//   C. Sahabat Hewan: hewan kecil per tipe
// Plus "Pemandu": maskot netral yang menemani selama mengisi soal (tidak membocorkan tipe).
// Semua berupa SVG: ringan, tajam di semua ukuran, bisa dianimasikan CSS, dan bisa digambar ke canvas (kartu/PDF).
// Butuh TYPE_PAL dan mixHex dari core.js.
(function (G) {
  const INK = '#2b2236';
  let uid = 0;
  const fam = t => t[1] === 'N' ? (t[2] === 'T' ? 'NT' : 'NF') : (t[3] === 'J' ? 'SJ' : 'SP');
  const pal = t => { const p = TYPE_PAL[t] || TYPE_PAL.INFP; return {a: p[0], b: p[1]}; };
  const f1 = n => Math.round(n * 10) / 10;

  // Poligon dengan sudut membulat (untuk badan kristal/roti/bintang).
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

  // ---------- Wajah ----------
  function eye(x, y, r, kind) {
    if (kind === 'happy') return `<path d="M${x - r} ${y + 2}Q${x} ${y - r * 1.3} ${x + r} ${y + 2}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
    return `<g class="eye"><ellipse cx="${x}" cy="${y}" rx="${f1(r * .86)}" ry="${r}" fill="${INK}"/>` +
      `<circle cx="${f1(x + r * .3)}" cy="${f1(y - r * .38)}" r="${f1(r * .36)}" fill="#fff"/>` +
      `<circle cx="${f1(x - r * .32)}" cy="${f1(y + r * .4)}" r="${f1(r * .16)}" fill="#fff" opacity=".85"/></g>`;
  }
  function face(o) {
    const {x = 100, y, gap = 20, r = 9.5, l = 'open', rgt = 'open', mouth = 'smile', blush = true, brow} = o;
    let s = '';
    if (blush) s += `<ellipse cx="${x - gap - 9}" cy="${y + 15}" rx="9" ry="5.5" fill="#ff7f9a" opacity=".42"/><ellipse cx="${x + gap + 9}" cy="${y + 15}" rx="9" ry="5.5" fill="#ff7f9a" opacity=".42"/>`;
    s += eye(x - gap, y, r, l) + eye(x + gap, y, r, rgt);
    if (brow === 'raise') s += `<path d="M${x + gap - 9} ${y - 17}Q${x + gap} ${y - 23} ${x + gap + 9} ${y - 18}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    const my = y + 16;
    if (mouth === 'smile') s += `<path d="M${x - 7} ${my}Q${x} ${my + 7} ${x + 7} ${my}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
    if (mouth === 'cat') s += `<path d="M${x - 9} ${my}Q${x - 4.5} ${my + 6} ${x} ${my}Q${x + 4.5} ${my + 6} ${x + 9} ${my}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (mouth === 'smirk') s += `<path d="M${x - 8} ${my + 1}Q${x + 1} ${my + 7} ${x + 10} ${my - 3}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
    if (mouth === 'open') s += `<path d="M${x - 10} ${my - 1}Q${x} ${my + 16} ${x + 10} ${my - 1}Z" fill="#5b2238" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${x - 5} ${my + 7.5}Q${x} ${my + 4} ${x + 5} ${my + 7.5}Q${x} ${my + 12} ${x - 5} ${my + 7.5}Z" fill="#ff8a9e"/>`;
    if (mouth === 'o') s += `<ellipse cx="${x}" cy="${my + 3}" rx="4.5" ry="5.5" fill="#5b2238" stroke="${INK}" stroke-width="2.4"/>`;
    return s;
  }

  const sparkle = (x, y, s, c, cls = 'tw', d = 0) => `<path class="${cls}" style="animation-delay:${d}s" d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}"/>`;
  const heart = (x, y, s, c) => `<path d="M${x} ${y + s * .9}C${x - s * 1.4} ${y - s * .1} ${x - s * .7} ${y - s * 1.2} ${x} ${y - s * .4}C${x + s * .7} ${y - s * 1.2} ${x + s * 1.4} ${y - s * .1} ${x} ${y + s * .9}Z" fill="${c}"/>`;

  function defs(id, a, b) {
    const top = mixHex(a, '#ffffff', .38), bot = mixHex(a, b, .18);
    return `<defs><linearGradient id="g${id}" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${bot}"/></linearGradient>` +
      `<linearGradient id="h${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixHex(b, '#ffffff', .35)}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
      `<radialGradient id="glow${id}"><stop offset="0" stop-color="#fff6c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c4" stop-opacity="0"/></radialGradient></defs>`;
  }
  const wrap = (t, style, inner, extra = '') =>
    `<svg class="chr f-${fam(t)} s-${style}" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Karakter ${t}">` +
    `<ellipse class="shadow" cx="100" cy="207" rx="46" ry="7" fill="#000" opacity=".2"/>${extra}<g class="body">${inner}</g></svg>`;

  // ============ A. ROH PETA ============
  function roh(t) {
    const id = ++uid, {a, b} = pal(t), F = fam(t), line = mixHex(a, INK, .5), g = `url(#g${id})`;
    let body = '', acc = '', back = '', fc;
    const feet = (y = 200) => `<ellipse cx="80" cy="${y}" rx="14" ry="7.5" fill="${mixHex(a, INK, .25)}" stroke="${line}" stroke-width="3"/><ellipse cx="120" cy="${y}" rx="14" ry="7.5" fill="${mixHex(a, INK, .25)}" stroke="${line}" stroke-width="3"/>`;
    const shine = (x, y, rx, ry, rot = -25) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".38" transform="rotate(${rot} ${x} ${y})"/>`;
    if (F === 'NF') {
      body = feet() + `<path d="M100 40C118 64 160 94 160 142C160 182 133 202 100 202C67 202 40 182 40 142C40 94 82 64 100 40Z" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
        shine(70, 112, 11, 20) +
        `<ellipse class="arm-l" cx="42" cy="158" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(25 42 158)"/><ellipse class="arm-r" cx="158" cy="158" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(-25 158 158)"/>`;
      fc = {y: 136, mouth: 'smile'};
      // bunga di ujung kepala + bulan gerhana kecil yang mengorbit
      acc = `<g class="wig" style="transform-origin:100px 44px">` +
        [0, 72, 144, 216, 288].map(r => `<ellipse cx="100" cy="27" rx="6" ry="10" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="2" transform="rotate(${r} 100 36)"/>`).join('') +
        `<circle cx="100" cy="36" r="5.5" fill="#ffe08a" stroke="${mixHex(b, INK, .45)}" stroke-width="2"/></g>`;
      back = `<g class="float"><circle cx="160" cy="58" r="20" fill="url(#glow${id})"/><circle cx="160" cy="58" r="11" fill="${INK}" stroke="#ffe7a8" stroke-width="2.5"/>${sparkle(170, 49, 3.5, '#fff')}</g>` +
        sparkle(36, 70, 6, b, 'tw', .3) + sparkle(54, 46, 4, '#ffe08a', 'tw', 1.1);
    }
    if (F === 'NT') {
      const P = [[100, 44], [152, 74], [162, 146], [130, 200], [70, 200], [38, 146], [48, 74]];
      body = feet(201) + `<path d="${roundPoly(P, 16)}" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
        `<path d="M100 50L100 92M58 80L84 98M142 80L116 98" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>` +
        shine(66, 112, 9, 18) +
        `<ellipse cx="38" cy="160" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(20 38 160)"/><g class="wave" style="transform-origin:156px 150px"><ellipse cx="164" cy="132" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(-35 164 132)"/></g>`;
      fc = {y: 136, mouth: 'smirk', brow: 'raise', r: 9};
      back = `<g class="float" style="animation-duration:2.4s"><circle cx="156" cy="50" r="24" fill="url(#glow${id})"/>` +
        `<path d="M146 50a10 10 0 1 1 20 0c0 5-4 7-4 11h-12c0-4-4-6-4-11z" fill="#fff4bf" stroke="${line}" stroke-width="2.6" stroke-linejoin="round"/>` +
        `<rect x="150.5" y="61" width="11" height="6" rx="2" fill="${b}" stroke="${line}" stroke-width="2.2"/>` +
        `<g class="tw" stroke="${b}" stroke-width="3" stroke-linecap="round"><path d="M156 30v-6M139 37l-4-4M173 37l4-4M134 52h-6M178 52h6"/></g></g>` +
        sparkle(40, 64, 5, b, 'tw', .6);
    }
    if (F === 'SJ') {
      const P = [[50, 76], [150, 76], [158, 202], [42, 202]];
      body = feet(203) + `<path d="${roundPoly(P, 34)}" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
        `<path d="M96 76Q92 62 102 56Q100 66 108 72" fill="${a}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>` + shine(68, 102, 10, 16) +
        // syal rajut
        `<path d="M46 150Q100 166 154 150L156 166Q100 182 44 166Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M64 156l0 12M80 160l0 12M96 162l0 12M112 162l0 12M128 160l0 12M144 156l0 12" stroke="#fff" stroke-width="2" opacity=".35"/>` +
        `<g class="wig" style="transform-origin:66px 166px"><path d="M58 164L52 196L70 194L74 166Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/><path d="M52 196l-2 6M58 196l-1 6M64 195l0 6M70 194l1 6" stroke="${mixHex(b, INK, .45)}" stroke-width="2.4" stroke-linecap="round"/></g>`;
      fc = {y: 116, mouth: 'cat', l: 'open', rgt: 'open'};
      // cangkir teh dengan uap
      acc = `<g><ellipse cx="148" cy="186" rx="9" ry="13" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(-30 148 186)"/>` +
        `<path d="M134 168h30l-3 22a8 8 0 0 1-8 7h-8a8 8 0 0 1-8-7z" fill="#fffaf2" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M164 174a7 7 0 0 1 0 12" fill="none" stroke="${line}" stroke-width="3"/>${heart(149, 181, 4.5, b)}` +
        `<g class="steam" fill="none" stroke="${mixHex(b, '#ffffff', .2)}" stroke-width="3" stroke-linecap="round"><path d="M144 160q-5-6 0-12t0-12"/><path d="M154 160q-5-6 0-12t0-12" style="animation-delay:.7s"/></g></g>`;
    }
    if (F === 'SP') {
      body = `<g transform="rotate(-10 100 200)">` + feet() +
        `<path d="M112 36C124 70 162 96 160 144C158 184 132 202 100 202C66 202 40 182 40 144C40 104 70 82 84 60C92 70 98 76 102 66C106 58 108 48 112 36Z" fill="${g}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>` +
        `<g class="flame"><path d="M100 58C88 40 104 26 100 4C118 18 124 34 118 48C124 42 127 34 126 24C140 38 138 58 122 66Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="2.6" stroke-linejoin="round"/><path d="M106 56C102 46 110 38 108 26C116 36 118 46 114 56Z" fill="#fff6c4" opacity=".85"/></g>` +
        shine(68, 116, 10, 19) +
        `<ellipse cx="42" cy="156" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(30 42 156)"/>` +
        `<g class="wave" style="transform-origin:154px 150px"><ellipse cx="166" cy="126" rx="9" ry="14" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(-40 166 126)"/><path d="M172 104l3-9 3 9 9 3-9 3-3 9-3-9-9-3z" fill="#ffe08a"/></g>` +
        // kacamata hitam di atas kepala
        `<g><rect x="64" y="96" width="30" height="16" rx="8" fill="${INK}"/><rect x="106" y="96" width="30" height="16" rx="8" fill="${INK}"/><path d="M94 102h12" stroke="${INK}" stroke-width="4"/><path d="M70 100l8 0" stroke="#fff" stroke-width="2.5" opacity=".6" stroke-linecap="round"/></g>`;
      fc = {y: 138, mouth: 'open', l: 'open', rgt: 'happy'};
      acc = '</g>';
      back = `<g class="speed" stroke="${b}" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M14 120h20M8 142h26M18 164h14"/></g>`;
    }
    return wrap(t, 'roh', body + `<g>${face(fc)}</g>` + acc, defs(id, a, b) + back);
  }

  // ============ B. CHIBI MINI ============
  function chibi(t) {
    const id = ++uid, {a, b} = pal(t), F = fam(t), line = mixHex(a, INK, .5), g = `url(#g${id})`;
    const skin = mixHex('#fff1e6', a, .1), hair = mixHex(a, INK, .62);
    let top = '', hold = '', fc = {y: 112, gap: 19, r: 9};
    // badan + kaki
    let body = `<ellipse cx="82" cy="201" rx="12" ry="7" fill="${hair}"/><ellipse cx="118" cy="201" rx="12" ry="7" fill="${hair}"/>` +
      `<path d="${roundPoly([[70, 150], [130, 150], [142, 200], [58, 200]], 18)}" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
      `<path d="M100 160v36" stroke="${line}" stroke-width="2.4" opacity=".4"/>`;
    if (F === 'NF') {
      top = `<g class="wig" style="transform-origin:62px 62px"><path d="M60 64C40 54 30 30 44 18C56 30 66 44 68 58Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/></g>` +
        `<g class="wig" style="transform-origin:138px 62px;animation-delay:.5s"><path d="M140 64C160 54 170 30 156 18C144 30 134 44 132 58Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/></g>`;
      hold = `<g class="float" style="animation-duration:3.4s"><path d="M76 168l24 6 24-6v26l-24 6-24-6z" fill="#fffaf2" stroke="${line}" stroke-width="3" stroke-linejoin="round"/><path d="M100 174v26" stroke="${line}" stroke-width="2.4"/><path d="M84 178l10 3M84 185l10 3M106 181l10-3M106 188l10-3" stroke="${b}" stroke-width="2.2" stroke-linecap="round"/></g>`;
      fc.mouth = 'smile';
    }
    if (F === 'NT') {
      top = `<g><path d="M40 78Q100 30 160 78" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="72" cy="56" r="13" fill="${b}" stroke="${INK}" stroke-width="4"/><circle cx="128" cy="56" r="13" fill="${b}" stroke="${INK}" stroke-width="4"/><circle cx="68" cy="52" r="4" fill="#fff" opacity=".8"/><circle cx="124" cy="52" r="4" fill="#fff" opacity=".8"/></g>`;
      hold = `<g class="wave" style="transform-origin:140px 170px"><path d="M140 178L168 130" stroke="${line}" stroke-width="5" stroke-linecap="round"/>${sparkle(170, 124, 12, '#ffe08a', 'tw')}</g>`;
      fc.mouth = 'smirk'; fc.brow = 'raise';
    }
    if (F === 'SJ') {
      top = `<g class="wig" style="transform-origin:100px 40px"><circle cx="100" cy="30" r="13" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3"/></g>`;
      hold = `<g><path d="M132 168h28l-3 22a7 7 0 0 1-7 6h-8a7 7 0 0 1-7-6z" fill="#fffaf2" stroke="${line}" stroke-width="3" stroke-linejoin="round"/><path d="M160 174a6 6 0 0 1 0 11" fill="none" stroke="${line}" stroke-width="3"/>${heart(146, 181, 4.5, b)}` +
        `<g class="steam" fill="none" stroke="${mixHex(b, INK, .1)}" stroke-width="3" stroke-linecap="round"><path d="M141 160q-5-6 0-12t0-12"/><path d="M152 160q-5-6 0-12t0-12" style="animation-delay:.7s"/></g></g>`;
      fc.mouth = 'cat';
    }
    if (F === 'SP') {
      top = `<g><path d="M44 74Q48 30 100 30Q150 30 156 74Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/><path d="M150 72Q178 72 184 82Q160 86 140 80Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/>${sparkle(100, 52, 9, '#fff')}</g>`;
      hold = `<g class="bounce"><circle cx="146" cy="176" r="17" fill="#ff9f43" stroke="${INK}" stroke-width="3"/><path d="M129 176h34M146 159v34M134 164q12 12 0 24M158 164q-12 12 0 24" fill="none" stroke="${INK}" stroke-width="2.2"/></g>`;
      fc.mouth = 'open'; fc.rgt = 'happy';
    }
    const head = `<circle cx="100" cy="98" r="62" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
      `<ellipse cx="100" cy="112" rx="45" ry="40" fill="${skin}" stroke="${line}" stroke-width="3"/>` +
      `<path d="M58 100Q64 70 100 70Q136 70 142 100Q128 84 112 88Q102 78 90 88Q72 84 58 100Z" fill="${hair}"/>` +
      `<ellipse cx="72" cy="66" rx="10" ry="16" fill="#fff" opacity=".3" transform="rotate(-35 72 66)"/>`;
    const over = F === 'NT' || F === 'SP';
    return wrap(t, 'chibi', defs(id, a, b) + body + (over ? '' : top) + head + face(fc) + (over ? top : '') + hold, F === 'NF' ? sparkle(30, 90, 6, b, 'tw', .4) + sparkle(172, 104, 5, '#ffe08a', 'tw', 1) : '');
  }

  // ============ C. SAHABAT HEWAN ============
  function hewan(t) {
    const id = ++uid, {a, b} = pal(t), F = fam(t), line = mixHex(a, INK, .5), g = `url(#g${id})`, light = mixHex(a, '#ffffff', .72);
    let ears = '', tail = '', extra = '', acc = '', fc = {y: 116, gap: 20, r: 9.5}, name = '';
    if (F === 'NF') { // rusa kecil
      name = 'rusa';
      ears = `<g class="wig" style="transform-origin:62px 82px"><ellipse cx="44" cy="80" rx="22" ry="10" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(-20 44 80)"/><ellipse cx="46" cy="80" rx="12" ry="5" fill="#ffb3c1" transform="rotate(-20 46 80)"/></g>` +
        `<g class="wig" style="transform-origin:138px 82px;animation-delay:.6s"><ellipse cx="156" cy="80" rx="22" ry="10" fill="${a}" stroke="${line}" stroke-width="3" transform="rotate(20 156 80)"/><ellipse cx="154" cy="80" rx="12" ry="5" fill="#ffb3c1" transform="rotate(20 154 80)"/></g>` +
        `<path d="M78 56Q72 40 62 34M72 46l-10 0M122 56Q128 40 138 34M128 46l10 0" fill="none" stroke="${mixHex(b, INK, .3)}" stroke-width="5" stroke-linecap="round"/>` +
        [[62, 32], [140, 32]].map(([x, y]) => [0, 72, 144, 216, 288].map(r => `<ellipse cx="${x}" cy="${y - 6}" rx="3.6" ry="6" fill="url(#h${id})" transform="rotate(${r} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="3.4" fill="#ffe08a"/>`).join('');
      extra = `<circle cx="70" cy="170" r="5" fill="${light}" opacity=".9"/><circle cx="84" cy="184" r="4" fill="${light}" opacity=".9"/><circle cx="128" cy="176" r="4.5" fill="${light}" opacity=".9"/>`;
      fc.mouth = 'smile';
      acc = sparkle(170, 140, 6, b, 'tw', .2) + sparkle(28, 132, 4, '#ffe08a', 'tw', 1);
    }
    if (F === 'NT') { // rubah
      name = 'rubah';
      ears = `<path d="M56 78L50 28L92 58Z" fill="${a}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/><path d="M60 66L57 40L80 58Z" fill="${INK}" opacity=".7"/>` +
        `<g class="wig" style="transform-origin:130px 70px"><path d="M144 78L150 28L108 58Z" fill="${a}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/><path d="M140 66L143 40L120 58Z" fill="${INK}" opacity=".7"/></g>`;
      tail = `<g class="tail" style="transform-origin:140px 186px"><path d="M138 188C170 196 196 170 186 136C180 150 168 156 160 150C168 170 156 182 138 176Z" fill="${a}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/><path d="M186 136C180 150 168 156 160 150C164 144 176 138 186 136Z" fill="#fff"/></g>`;
      extra = `<path d="M54 130C70 126 86 132 100 142C114 132 130 126 146 130C148 166 128 184 100 184C72 184 52 166 54 130Z" fill="${mixHex(a, '#ffffff', .85)}"/>`;
      fc.mouth = 'smirk'; fc.brow = 'raise';
      acc = `<g class="float" style="animation-duration:2.4s"><circle cx="40" cy="48" r="20" fill="url(#glow${id})"/><path d="M31 47a9 9 0 1 1 18 0c0 4-3.5 6-3.5 10h-11c0-4-3.5-6-3.5-10z" fill="#fff4bf" stroke="${line}" stroke-width="2.4" stroke-linejoin="round"/><rect x="35" y="57" width="10" height="5" rx="2" fill="${b}" stroke="${line}" stroke-width="2"/></g>`;
    }
    if (F === 'SJ') { // kelinci
      name = 'kelinci';
      ears = `<g class="wig" style="transform-origin:78px 66px"><ellipse cx="74" cy="34" rx="13" ry="34" fill="${a}" stroke="${line}" stroke-width="3.5" transform="rotate(-8 74 34)"/><ellipse cx="74" cy="36" rx="6" ry="24" fill="#ffb3c1" transform="rotate(-8 74 36)"/></g>` +
        `<g class="flop" style="transform-origin:124px 66px"><ellipse cx="130" cy="34" rx="13" ry="34" fill="${a}" stroke="${line}" stroke-width="3.5" transform="rotate(14 130 34)"/><ellipse cx="130" cy="36" rx="6" ry="24" fill="#ffb3c1" transform="rotate(14 130 36)"/></g>`;
      tail = `<circle cx="150" cy="186" r="11" fill="#fff" stroke="${line}" stroke-width="3"/>`;
      extra = `<path d="M50 148Q100 164 150 148L152 162Q100 178 48 162Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/>` +
        `<g class="wig" style="transform-origin:66px 160px"><path d="M60 158L54 188L70 186L74 160Z" fill="url(#h${id})" stroke="${mixHex(b, INK, .45)}" stroke-width="3" stroke-linejoin="round"/></g>`;
      fc.mouth = 'cat';
      acc = `<g class="steam" fill="none" stroke="${mixHex(b, '#ffffff', .2)}" stroke-width="3" stroke-linecap="round"><path d="M164 150q-5-6 0-12t0-12"/></g>` +
        `<path d="M152 158h26l-3 18a7 7 0 0 1-7 6h-6a7 7 0 0 1-7-6z" fill="#fffaf2" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>${heart(165, 170, 4, b)}<ellipse cx="152" cy="172" rx="9" ry="7" fill="${a}" stroke="${line}" stroke-width="3"/>`;
    }
    if (F === 'SP') { // anak harimau
      name = 'harimau';
      ears = `<circle cx="60" cy="66" r="16" fill="${a}" stroke="${line}" stroke-width="3.5"/><circle cx="60" cy="66" r="8" fill="${INK}" opacity=".55"/><circle cx="140" cy="66" r="16" fill="${a}" stroke="${line}" stroke-width="3.5"/><circle cx="140" cy="66" r="8" fill="${INK}" opacity=".55"/>`;
      tail = `<g class="tail" style="transform-origin:146px 190px"><path d="M146 190C176 196 186 170 176 150" fill="none" stroke="${line}" stroke-width="13" stroke-linecap="round"/><path d="M146 190C176 196 186 170 176 150" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/><path d="M166 192l4-8M176 178l7-3" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity=".7"/></g>`;
      extra = `<path d="M100 66v14M88 68l4 12M112 68l-4 12M44 112h12M42 124h12M156 112h-12M158 124h-12" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" opacity=".7"/>` +
        `<ellipse cx="100" cy="138" rx="26" ry="18" fill="#fff" opacity=".9"/><path d="M60 170l8 4M60 182l8 0M140 170l-8 4M140 182l-8 0" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
      fc.mouth = 'open'; fc.rgt = 'happy';
      acc = `<g class="speed" stroke="${b}" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M10 120h20M6 142h24M14 164h14"/></g>` + sparkle(172, 60, 7, '#ffe08a', 'tw');
    }
    const body = `<ellipse cx="80" cy="200" rx="15" ry="8" fill="${mixHex(a, INK, .2)}" stroke="${line}" stroke-width="3"/><ellipse cx="120" cy="200" rx="15" ry="8" fill="${mixHex(a, INK, .2)}" stroke="${line}" stroke-width="3"/>` +
      `<path d="M100 62C146 62 162 96 162 138C162 182 136 202 100 202C64 202 38 182 38 138C38 96 54 62 100 62Z" fill="${g}" stroke="${line}" stroke-width="3.5"/>` +
      `<ellipse cx="70" cy="92" rx="10" ry="16" fill="#fff" opacity=".32" transform="rotate(-35 70 92)"/>`;
    const nose = F === 'SJ' || F === 'NF' ? `<ellipse cx="100" cy="128" rx="4" ry="3" fill="#ff8aa0"/>` : `<ellipse cx="100" cy="127" rx="5" ry="3.6" fill="${INK}"/>`;
    return wrap(t, 'hewan', tail + ears + body + extra + face({...fc, y: fc.y - 4}) + nose + acc, defs(id, a, b));
  }

  // ============ Pemandu netral (selama mengisi soal) ============
  function pemandu() {
    const id = ++uid, a = '#c9c2ff', b = '#ffe08a', line = '#6d63b8';
    const P = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 40 : 76, an = -Math.PI / 2 + i * Math.PI / 5; P.push([f1(100 + r * Math.cos(an)), f1(132 + r * Math.sin(an))]); }
    const body = `<path d="${roundPoly(P, 14)}" fill="url(#g${id})" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>` +
      `<ellipse cx="78" cy="104" rx="8" ry="14" fill="#fff" opacity=".4" transform="rotate(-30 78 104)"/>` +
      `<g class="wave" style="transform-origin:160px 120px"><path d="M168 118v30" stroke="${line}" stroke-width="3"/><circle cx="168" cy="160" r="20" fill="url(#glow${id})"/><path d="M158 150h20l-2 18h-16z" fill="#fff6c4" stroke="${line}" stroke-width="2.6" stroke-linejoin="round"/><rect x="160" y="146" width="16" height="5" rx="2" fill="${line}"/></g>`;
    return `<svg class="chr f-guide s-roh" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pemandu">${defs(id, a, b)}` +
      `<ellipse class="shadow" cx="100" cy="207" rx="40" ry="6" fill="#000" opacity=".18"/>${sparkle(34, 60, 6, b, 'tw')}${sparkle(170, 46, 4, '#fff', 'tw', .8)}<g class="body">${body}${face({y: 130, gap: 17, r: 8.5, mouth: 'smile'})}</g></svg>`;
  }

  G.KARAKTER_DRAF = {roh, chibi, hewan, pemandu, fam, _h: {roundPoly, sparkle, heart, defs, pal, INK}};
})(typeof window !== 'undefined' ? window : globalThis);
