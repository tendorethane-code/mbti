import test from 'node:test';
import assert from 'node:assert/strict';
import {loadCore, answersFor} from './helpers.mjs';

const C = loadCore();
const DEEPN = C.DEEP.length;
const finite = x => typeof x === 'number' && Number.isFinite(x);

test('jumlah soal per modul sesuai rancangan', () => {
  assert.deepEqual(Array.from(C.MODS, m => m.items.length), [44, 45, 60, 40]);
  assert.equal(C.TOTAL, 189);
  assert.deepEqual(Array.from(C.MAIN, m => m.id), ['inti', 'facet', 'big5', 'fungsi']);
  const per = ax => C.CORE.filter(c => c[0] === ax).length;
  assert.deepEqual(['EI', 'SN', 'TF', 'JP', 'AT'].map(per), [8, 10, 10, 8, 8]);
});

test('setiap facet Step II punya minimal 2 soal, id soal unik', () => {
  for (const ax of Object.keys(C.FACETS)) for (let f = 0; f < 5; f++)
    assert.ok(C.FITEMS.filter(x => x[0] === ax && x[1] === f).length >= 2, `${ax} facet ${f}`);
  const ids = C.MODS.flatMap(m => m.items.map(it => it.id));
  assert.equal(new Set(ids).size, ids.length, 'id soal dobel');
  assert.ok(ids.every(id => typeof id === 'string' && id.length > 0));
});

test('soal J/P facet tidak menyebut keluar rumah atau bertemu orang', () => {
  for (const x of C.FITEMS.filter(x => x[0] === 'JP'))
    assert.ok(!/berangkat|keluar|teman|orang|kelompok|kumpul/i.test(x.slice(2, 5).join(' ')), x[2]);
});

test('bahasa: tidak ada kata gaul lu/gw/nggak di soal dan tampilan', async () => {
  const fs = await import('node:fs');
  const texts = C.MODS.flatMap(m => m.items.flatMap(it => [it.q, it.a, it.b].filter(Boolean)));
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ');
  for (const t of texts.concat([html])) assert.ok(!/\b(lu|gw|gue|nggak|ngga|udah|bikin|banget)\b/i.test(t), t.slice(0, 80));
});

test('peta migrasi file lama: id yang dirujuk memang ada, panjang sesuai urutan lama', () => {
  const ids = new Set(C.FITEMS.map(x => x[5]));
  for (const ax of Object.keys(C.FACETS)) {
    assert.equal(C.LEGACY_FACET_V1[ax].length, 10, ax);
    for (const id of C.LEGACY_FACET_V1[ax]) if (id) assert.ok(ids.has(id) && id.startsWith(ax.toLowerCase()), id);
  }
});

test('Big Five: 5 domain x 6 facet, tiap facet punya pernyataan positif dan terbalik', () => {
  assert.equal(C.B5.length, 5);
  for (const d of C.B5) { assert.equal(d[2].length, 6, d[1]); for (const f of d[2]) { assert.equal(f.length, 5); assert.ok(f[3] !== f[4]); } }
});

test('cognitive functions: 3 pernyataan per fungsi, pasangan adu langsung valid', () => {
  for (const f of C.FUNCS) assert.equal(C.FN1.filter(x => x[0] === f).length, 3, f);
  for (const x of C.FN2) { assert.ok(C.FUNCS.includes(x[0]) && C.FUNCS.includes(x[1]) && x[0] !== x[1]); }
});

test('kunci sumbu soal Inti valid', () => {
  for (const c of C.CORE) assert.ok(C.AX[c[0]].slice(0, 2).includes(c[1]), c[2]);
});

test('teks soal unik, nggak kosong, dan aman dimasukkan ke HTML', () => {
  const texts = C.MODS.flatMap(m => m.items.map(it => it.q));
  assert.equal(new Set(texts).size, texts.length, 'ada soal duplikat');
  for (const m of C.MODS) for (const it of m.items) for (const t of [it.q, it.a, it.b].filter(v => v !== undefined)) {
    assert.ok(t.trim().length > 0);
    assert.ok(!/[<>"`]/.test(t), `karakter berbahaya: ${t}`);
  }
});

test('tukar posisi A/B: teks opsi tetap sama, cuma ditukar', () => {
  const src = new Map(C.CORE.map(c => [c[2], [c[3], c[4]]]));
  for (const it of C.MODS[0].items) {
    const [a, b] = src.get(it.q);
    assert.deepEqual(it.fl ? [it.b, it.a] : [it.a, it.b], Array.from([a, b]));
  }
  assert.ok(C.MODS[0].items.some(it => it.fl) && C.MODS[0].items.some(it => !it.fl));
});

test('ke-16 tipe x 2 identitas bisa terdeteksi dengan benar', () => {
  for (const t of C.TABLE) for (const id of ['A', 'T']) {
    const R = C.compute(answersFor(C, t, id));
    assert.equal(R.type, t, `target ${t}-${id}, dapet ${R.type}`);
    assert.equal(R.letters, t);
    assert.equal(R.id, id);
    assert.equal(C.STACK[t][0], R.fn[0].f, `fungsi dominan ${t}`);
  }
});

test('jawaban "agak" (2/4) tetap ngasih tipe yang sama', () => {
  for (const t of ['INFP', 'ESTJ', 'ENTP', 'ISFJ']) assert.equal(C.compute(answersFor(C, t, 'A', 1)).type, t);
});

test('semua netral: 50% di semua sumbu, nggak ada NaN', () => {
  const ans = Object.fromEntries(C.MODS.map(m => [m.id, m.items.map(() => 3)]));
  const R = C.compute(ans);
  for (const ax of Object.keys(C.AX)) assert.equal(R.ax[ax], 50);
  assert.ok(R.fits.every(f => finite(f.v)));
  assert.equal(R.ext, 0);
});

test('jawaban acak: semua angka hasil valid (500 percobaan)', () => {
  let s = 42; const rnd = () => (s = s * 16807 % 2147483647) % 5 + 1;
  for (let k = 0; k < 500; k++) {
    const ans = Object.fromEntries(C.MODS.map(m => [m.id, m.items.map(rnd)]));
    const R = C.compute(ans);
    for (const v of Object.values(R.ax)) assert.ok(finite(v) && v >= 0 && v <= 100);
    for (const f of R.fits) assert.ok(finite(f.v) && f.v >= 0 && f.v <= 100);
    assert.ok(Math.abs(R.fam.reduce((a, f) => a + f[1], 0) - 100) < 1e-6);
    for (const x of R.fn) assert.ok(x.g >= 1 && x.g <= 5);
    for (const d of Object.values(R.b5)) assert.ok(d.dom >= 1 && d.dom <= 5);
    assert.ok(C.TABLE.includes(R.type));
  }
});

test('hasil sebagian: cuma Big Five selesai, tipe belum muncul', () => {
  const full = answersFor(C, 'INTJ');
  const R = C.compute({...C.emptyAns(), big5: full.big5});
  assert.equal(R.hasType, false);
  assert.ok(R.b5 && !R.fn && !R.core);
  assert.equal(R.ax.AT, (R.b5.N.dom - 1) / 4 * 100);
});

test('hasil sebagian: tanpa modul fungsi, tipe dari huruf', () => {
  const full = answersFor(C, 'ENFJ');
  const R = C.compute({...C.emptyAns(), inti: full.inti});
  assert.equal(R.type, 'ENFJ');
  assert.equal(R.fits[0].st, null);
});

test('modul belum lengkap nggak dihitung', () => {
  const full = answersFor(C, 'ISTP');
  const part = full.inti.slice(); part[5] = 0;
  assert.equal(C.compute({...C.emptyAns(), inti: part}).hasType, false);
});

test('gaya jawab ekstrem terdeteksi', () => {
  assert.ok(C.compute(answersFor(C, 'INFP')).ext > 0.6);
  assert.ok(C.compute(answersFor(C, 'INFP', 'T', 1)).ext < 0.3);
});

test('impor file: valid, rusak, dan nilai aneh', () => {
  const ans = answersFor(C, 'INFP');
  const ok = C.sanitizeImport(JSON.parse(JSON.stringify(C.exportData('Contoh <b>', C.canon(ans)))));
  assert.equal(ok.name, 'Contoh b'); assert.equal(ok.v, 3); assert.equal(ok.migrated, false);
  assert.equal(C.resultOf(ok.c).type, 'INFP');
  assert.equal(C.sanitizeImport(null), null);
  assert.equal(C.sanitizeImport({app: 'lain', c: {}}), null);
  assert.equal(C.sanitizeImport({app: 'tes-kepribadian'}), null);
  assert.equal(C.sanitizeImport({app: 'tes-kepribadian', v: 3}), null);
  const weird = C.sanitizeImport({app: 'tes-kepribadian', v: 3, c: {c0: 9, c1: '3', c2: -1, c3: 2.5, c4: null, c5: 4, 'bukan-id': 5, '__proto__': 5}});
  assert.deepEqual(JSON.parse(JSON.stringify(weird.c)), {c5: 4});
  const oldWeird = C.sanitizeImport({app: 'tes-kepribadian', ans: {inti: [9, '3', -1, 2.5, null, 4], facet: 'x'}});
  assert.equal(Object.keys(oldWeird.c).length, 1);
});

test('nama file aman', () => {
  assert.equal(C.fileSlug('Contoh Putra'), 'contoh-putra');
  assert.equal(C.fileSlug('../../etc/passwd'), 'etc-passwd');
  assert.equal(C.fileSlug('   '), '');
  assert.equal(C.safeName('x'.repeat(50)).length, 30);
});

test('ringkasan teks lengkap', () => {
  const t = C.summaryText(C.compute(answersFor(C, 'INFP')), 'Contoh');
  assert.match(t, /Peta Kepribadian · Contoh/);
  assert.match(t, /Tipe: INFP-T \(Diplomat\)/);
  assert.match(t, /Introvert 100%/);
  assert.match(t, /Fungsi: Fi > Ne/);
  assert.match(t, /Big Five:/);
});

test('kompatibel browser HP lama: tanpa light-dark(), color-mix cuma di CSS dengan cadangan', async () => {
  const fs = await import('node:fs');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(!html.includes('light-dark('), 'light-dark() nggak jalan di iOS < 17.5');
  const script = html.slice(html.lastIndexOf('<script>'));
  assert.ok(!script.includes('color-mix'), 'warna dari JS harus hex/rgb biasa');
  const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
  for (const rule of css.match(/\{[^{}]*color-mix[^{}]*\}/g) || []) {
    const decls = rule.slice(1, -1).split(';').map(d => d.trim()).filter(Boolean).map(d => [d.slice(0, d.indexOf(':')), d]);
    for (const [prop, d] of decls.filter(([, d]) => d.includes('color-mix')))
      assert.ok(decls.some(([p2, d2]) => p2 === prop && !d2.includes('color-mix')), `nggak ada cadangan buat ${prop} di ${rule.slice(0, 70)}`);
  }
});

// File versi 2: jawaban per posisi menurut LAYOUT_V2 (id lama yang sama dipakai untuk soal yang tidak berubah).
function v2Ans(c) {
  return Object.fromEntries(Object.entries(C.LAYOUT_V2).map(([m, ids]) => [m, ids.map(raw => { const fl = raw[0] === '~', id = fl ? raw.slice(1) : raw, v = c[id]; return C.valid(v) ? (fl ? 6 - v : v) : 0; })]));
}

// File versi 1: facet 40 soal dengan urutan lama (round-robin per sumbu, posisi ganjil ditukar A/B).
function v1Facet(byId) {
  const axes = Object.keys(C.FACETS), out = new Array(40).fill(0);
  axes.forEach((ax, ai) => C.LEGACY_FACET_V1[ax].forEach((id, k) => {
    const p = k * 4 + ai, c = id && byId[id] ? byId[id] : 3;
    out[p] = p % 2 ? 6 - c : c;
  }));
  return out;
}

test('impor file versi 1: soal facet yang sama dipindah, yang diganti dikosongkan', () => {
  const full = answersFor(C, 'INFP');
  const d = C.sanitizeImport({app: 'tes-kepribadian', v: 1, name: 'Lama', ans: {...v2Ans(C.canon(full)), facet: v1Facet({'sn-c1': 5, 'sn-t2': 2, 'ei-x5': 1, 'ei-g1': 4})}});
  assert.equal(d.v, C.DATA_V);
  assert.equal(d.migrated, true);
  const c = d.c;
  assert.equal(c['sn-c1'], 5); assert.equal(c['sn-t2'], 2); assert.equal(c['ei-x5'], 1); assert.equal(c['ei-g1'], 4);
  assert.equal(c['tf-l1'], undefined); assert.equal(c['jp-s1'], undefined); assert.equal(c['ei-x1'], undefined);
  const fc = C.canon(full);
  for (const id of ['c0', 'c43', 'bN0p', 'n0', 'm15']) assert.equal(c[id], fc[id], id);
  assert.equal(C.answered(C.fromCanon(c), C.MODS[1]), 5 + 10);
});

test('impor file versi 2: soal yang isinya berubah dikosongkan, sisanya utuh', () => {
  const full = C.canon(answersFor(C, 'ENFJ', 'A'));
  const d = C.sanitizeImport({app: 'tes-kepribadian', v: 2, name: 'Dua', ans: v2Ans(full)});
  const changed = ['c-sn-gambar', 'c-sn-alat', 'c-tf-dana', 'tf-r3', 'ei-x6', 'bO2p2', 'bN2r2', 'n-ni-pola', 'n-ne-variasi'];
  assert.equal(d.migrated, true); assert.equal(d.missing, changed.length);
  for (const id of changed) assert.equal(d.c[id], undefined, id);
  for (const [id, v] of Object.entries(full)) if (!changed.includes(id)) assert.equal(d.c[id], v, id);
});

test('canon dan fromCanon saling balik', () => {
  const full = answersFor(C, 'ESTJ', 'A', 1);
  assert.deepEqual(JSON.parse(JSON.stringify(C.fromCanon(C.canon(full)))), JSON.parse(JSON.stringify(full)));
});

const textsOf = I => [I.summary, ...I.sections.flatMap(s => [s.title, ...s.items.flatMap(x => [x.t, x.b, ...(x.q ? [x.q] : [])])]), ...[...I.strengths, ...I.watch, ...I.tips].flatMap(x => [x.t, x.b])];

test('ringkasan kepribadian: 16 tipe x 2 identitas, kalimat lengkap tanpa undefined/NaN', () => {
  for (const t of C.TABLE) for (const id of ['A', 'T']) for (const st of [1, 2]) {
    const ans = answersFor(C, t, id, st), I = C.insights(C.compute(ans), C.canon(ans));
    assert.ok(I.summary.startsWith('Kamu '), t);
    for (const x of textsOf(I)) assert.ok(typeof x === 'string' && x.length > 0 && !/undefined|NaN|null/.test(x), `${t}-${id}: ${x}`);
    assert.ok(I.sections.every(s => s.items.length <= 6) && I.strengths.length <= 6 && I.watch.length <= 5 && I.tips.length <= 6);
  }
});

test('ringkasan kepribadian: arah kalimat ikut skor', () => {
  const intro = answersFor(C, 'INFP'), extro = answersFor(C, 'ESTJ', 'A');
  const a = C.insights(C.compute(intro), C.canon(intro)), b = C.insights(C.compute(extro), C.canon(extro));
  assert.match(a.summary, /waktu sendiri/); assert.match(b.summary, /interaksi dengan orang/);
  assert.match(a.summary, /fleksibel/); assert.match(b.summary, /rencana dan kepastian/);
  assert.match(b.summary, /tenang/);
});

test('ringkasan kepribadian: jawaban acak dan hasil sebagian tidak error', () => {
  let s = 7; const rnd = () => (s = s * 16807 % 2147483647) % 5 + 1;
  for (let k = 0; k < 200; k++) {
    const ans = Object.fromEntries(C.MODS.map(m => [m.id, m.items.map(rnd)]));
    for (const x of textsOf(C.insights(C.compute(ans), C.canon(ans)))) assert.ok(!/undefined|NaN/.test(x), x);
  }
  const full = answersFor(C, 'INTJ');
  for (const part of [{big5: full.big5}, {inti: full.inti}, {facet: full.facet}, {fungsi: full.fungsi}, {}]) {
    const ans = {...C.emptyAns(), ...part}, I = C.insights(C.compute(ans), C.canon(ans));
    for (const x of textsOf(I)) assert.ok(!/undefined|NaN/.test(x), x);
  }
});

test('ringkasan kepribadian: pola gabungan dari soal Expressive per emosi', () => {
  const ans = answersFor(C, 'INFP'), c = C.canon(ans);
  Object.assign(c, {'ei-x1': 5, 'ei-x2': 5, 'ei-x4': 5, 'ei-x6': 5, 'ei-x5': 1});
  const I = C.insights(C.resultOf(c), c);
  assert.ok(I.special.some(x => /Rasa kesal mudah terlihat/.test(x.t)));
  assert.ok(I.tips.some(x => /terlihat kesal/.test(x.t)));
});

test('catatan khusus: dibersihkan dan dibatasi', () => {
  const n = C.cleanNotes([{tag: 'A'.repeat(99), title: 'Judul', text: 'x\u0007y'}, null, 'teks', {}, ...Array(20).fill({title: 't'})]);
  assert.equal(n.length, 12); assert.equal(n[0].tag.length, 40); assert.equal(n[0].text, 'xy');
  assert.deepEqual(Array.from(C.cleanNotes('bukan array')), []);
  assert.equal(C.esc('<img src=x onerror="a">&\''), '&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;');
  const ex = C.exportData('A', C.canon(answersFor(C, 'INFP')));
  assert.ok(!('notes' in ex) && !('summary' in ex));
});

test('link hasil: bolak-balik utuh, termasuk catatan dan huruf non-ASCII', () => {
  const ans = answersFor(C, 'ENTP', 'A', 1);
  const d = C.sanitizeImport(JSON.parse(JSON.stringify(C.exportData('Contoh ✨', C.canon(ans), {summary: 'Ringkasan — é', notes: [{tag: 'T/F · −2', title: 'Judul', text: 'Isi'}]}))));
  const back = C.decodeShare(C.encodeShare(d));
  assert.deepEqual(JSON.parse(JSON.stringify(back.c)), JSON.parse(JSON.stringify(d.c)));
  assert.equal(back.name, d.name); assert.equal(back.summary, 'Ringkasan — é'); assert.equal(back.notes[0].tag, 'T/F · −2');
  assert.equal(C.resultOf(back.c).type, 'ENTP');
  // link versi 2 (jawaban per posisi) tetap terbaca
  const v2 = {v: 2, n: 'Lama', a: Object.fromEntries(Object.entries(v2Ans(C.canon(ans))).map(([k, a]) => [k, a.join('')]))};
  const old = C.decodeShare(Buffer.from(JSON.stringify(v2)).toString('base64url'));
  assert.equal(old.name, 'Lama'); assert.equal(old.c.c0, C.canon(ans).c0); assert.equal(old.migrated, true);
  for (const bad of ['', 'abc', '!!!!!!!!!!', 'eyJ2IjoyfQ', 'A'.repeat(30000), null]) assert.equal(C.decodeShare(bad), null, String(bad).slice(0, 12));
});

test('Pendalaman adaptif: kosong sebelum modul utama selesai, berbeda per profil', () => {
  const part = C.canon({...C.emptyAns(), inti: answersFor(C, 'INFP').inti});
  assert.equal(C.deepPlan(C.resultOf(part), part).length, 0);
  const plans = {};
  for (const t of C.TABLE) for (const id of ['A', 'T']) {
    const c = C.canon(answersFor(C, t, id, 1 + (t.charCodeAt(1) % 2)));
    const p = C.deepPlan(C.resultOf(c), c).map(x => x.id);
    assert.ok(p.length >= 5 && p.length <= DEEPN, `${t}-${id}: ${p.length}`);
    assert.equal(new Set(p).size, p.length);
    plans[t + id] = p.join(',');
  }
  assert.ok(new Set(Object.values(plans)).size >= 10, 'soal Pendalaman harus berbeda-beda antarprofil');
});

test('Pendalaman adaptif: soal lanjutan muncul dari jawaban, posisi A/B stabil', () => {
  const c = C.canon(answersFor(C, 'INFP'));
  const R = C.resultOf(c), before = C.deepPlan(R, c).map(x => x.id);
  assert.ok(before.includes('d-dekat') && !before.includes('d-dekat-ulang'));
  const after = C.deepPlan(R, {...c, 'd-dekat': 5});
  assert.ok(after.some(x => x.id === 'd-dekat-ulang'));
  const f1 = C.deepPlan(R, c).map(x => x.fl).join(), f2 = C.deepPlan(R, c).map(x => x.fl).join();
  assert.equal(f1, f2);
  for (const it of after) if (it.k === 'fc') { const d = C.DEEP.find(x => x[0] === it.id); assert.deepEqual(it.fl ? [it.b, it.a] : [it.a, it.b], [d[3], d[4]]); }
  assert.equal(C.deepDone(R, c), false);
  const all = {...c}; for (const it of C.deepPlan(R, c)) all[it.id] = 3;
  let guard = 0; while (!C.deepDone(R, all) && guard++ < 5) for (const it of C.deepPlan(R, all)) if (!C.valid(all[it.id])) all[it.id] = 3;
  assert.equal(C.deepDone(R, all), true);
});

test('Pendalaman: soal valid dan aman', () => {
  assert.equal(new Set(C.DEEP.map(d => d[0])).size, C.DEEP.length);
  for (const d of C.DEEP) { assert.ok(['fc', 'lk'].includes(d[1])); for (const t of d.slice(2)) assert.ok(t && !/[<>"`]/.test(t), t); }
});

const withDeep = (type, deep) => { const c = C.canon(answersFor(C, type)); return {...c, ...deep}; };
const titles = c => C.deepFindings(C.resultOf(c), c).map(f => f.title);

test('temuan khusus: introvert murni vs sebagian karena cemas', () => {
  assert.ok(titles(withDeep('INFP', {'d-energi': 1})).includes('Introvert murni'));
  assert.ok(titles(withDeep('INFP', {'d-energi': 5})).includes('Sebagian karena cemas, bukan hanya preferensi'));
  assert.ok(!titles(withDeep('ENFP', {'d-energi': 1})).includes('Introvert murni'), 'extravert tidak dapat temuan introvert');
  assert.ok(titles(withDeep('ENFP', {'d-sendiri': 5})).includes('Energi dari orang lain'));
});

test('temuan khusus: filter orang tersayang vs kenalan, dengan soal lanjutan', () => {
  assert.ok(titles(withDeep('INFP', {'d-dekat': 5, 'd-kenal': 1})).includes('Filternya: siapa orangnya bagimu'));
  assert.ok(titles(withDeep('INFP', {'d-dekat': 1, 'd-kenal': 1})).includes('Tegas kepada siapa pun'));
  assert.ok(!titles(withDeep('INFP', {'d-dekat': 5})).some(t => /Filternya/.test(t)), 'butuh dua jawaban');
  const f = C.deepFindings(C.resultOf(withDeep('INFP', {})), withDeep('INFP', {'d-dekat': 5, 'd-kenal': 1, 'd-dekat-ulang': 1})).find(x => x.key === 'tfctx');
  assert.match(f.text, /kesabaranmu ada batasnya/);
});

test('temuan khusus: S/N dua wilayah', () => {
  assert.ok(titles(withDeep('INFP', {'d-kebiasaan': 1, 'd-pikiran': 5})).includes('N di pikiran, S di kebiasaan'));
  assert.ok(titles(withDeep('ESTP', {'d-kebiasaan': 5, 'd-pikiran': 1})).includes('Praktis di pikiran, suka variasi di keseharian'));
});

test('temuan khusus: tidak muncul tanpa jawaban Pendalaman (kecuali pola skor murni)', () => {
  for (const t of C.TABLE) for (const f of C.deepFindings(C.resultOf(withDeep(t, {})), withDeep(t, {}))) assert.equal(f.key, 'ide', `${t}: ${f.title}`);
});

test('temuan khusus: kalimat lengkap untuk semua kombinasi jawaban Pendalaman', () => {
  let s = 3; const rnd = () => (s = s * 16807 % 2147483647) % 5 + 1;
  const ids = C.DEEP.map(d => d[0]);
  for (const t of C.TABLE) for (let k = 0; k < 12; k++) {
    const c = withDeep(t, Object.fromEntries(ids.map(id => [id, rnd()])));
    const F = C.deepFindings(C.resultOf(c), c);
    for (const f of F) for (const v of [f.tag, f.title, f.text, f.b]) assert.ok(v && !/undefined|NaN/.test(v), `${t}: ${v}`);
    assert.equal(new Set(F.map(f => f.key)).size, F.length, 'satu temuan per kunci');
  }
});

test('temuan khusus menggantikan pola gabungan yang sama di gambaran keseharian', () => {
  const c = withDeep('INFP', {'d-rutin': 5});
  const I = C.insights(C.resultOf(c), c);
  assert.ok(!I.special.some(x => /bukan karena suka jadwal/.test(x.t)));
});

test('riwayat: hanya hasil lengkap, jawaban utama sama memperbarui entri terakhir', () => {
  const a = answersFor(C, 'INFP'), b = answersFor(C, 'ESTJ', 'A');
  const ca = C.canon(a), cb = C.canon(b);
  let h = C.histAdd([], {name: 'X', c: C.canon({...C.emptyAns(), inti: a.inti})});
  assert.equal(h.length, 0, 'belum lengkap');
  h = C.histAdd(h, {name: 'X', c: ca}, '2026-01-01T00:00:00Z');
  h = C.histAdd(h, {name: 'X', c: {...ca, 'd-energi': 1}}, '2026-01-02T00:00:00Z');
  assert.equal(h.length, 1); assert.equal(h[0].t, '2026-01-01T00:00:00Z'); assert.equal(h[0].c['d-energi'], 1);
  h = C.histAdd(h, {name: 'X', c: cb, notes: [{title: 'n', text: 't'}]});
  assert.equal(h.length, 2);
  const d = C.histData(h[1]);
  assert.equal(C.resultOf(d.c).type, 'ESTJ'); assert.equal(d.notes[0].title, 'n');
  assert.equal(C.histData(null), null);
  let many = []; for (let i = 0; i < 40; i++) many = C.histAdd(many, {name: '', c: C.canon(answersFor(C, C.TABLE[i % 16], i % 2 ? 'A' : 'T', 1 + (i % 2)))});
  assert.ok(many.length <= 30);
});

test('huruf kapital di awal kata untuk tagline kartu', () => {
  assert.equal(C.titleCase('sangat introvert'), 'Sangat Introvert');
  assert.equal(C.titleCase('berpegang pada nilai'), 'Berpegang pada Nilai');
});

test('palet per tipe: 16 tipe unik, kontras cukup di dua tema', () => {
  const seen = new Set();
  for (const t of C.TABLE) {
    const d = C.typePal(t, true), l = C.typePal(t, false);
    assert.ok(C.contrast(d.a, '#121019') >= 4.5 && C.contrast(d.b, '#121019') >= 4.5, `${t} gelap`);
    assert.ok(C.contrast(l.a, '#ffffff') >= 3 && C.contrast(l.b, '#ffffff') >= 3, `${t} terang`);
    seen.add(d.a + d.b);
  }
  assert.equal(seen.size, 16);
});

test('Pendalaman: jawaban tengah juga menghasilkan temuan', () => {
  const titlesOf = c => C.deepFindings(C.resultOf(c), c).map(f => f.title);
  const base = C.canon(answersFor(C, 'INFP'));
  assert.ok(titlesOf({...base, 'd-yakin': 3}).includes('Logika dan hati harus sepakat'));
  assert.ok(titlesOf({...base, 'd-cemas': 3}).includes('Cemas ke dua arah'));
  const f = C.deepFindings(C.resultOf(base), {...base, 'd-dekat': 5, 'd-kenal': 1, 'd-dekat-ulang': 5}).find(x => x.key === 'tfctx');
  assert.match(f.text, /sayang bukan berarti lemah/);
});

test('kenapa tipe ini: huruf dan fungsi beda tipe dijelaskan, tipe yang jelas tidak diberi kotak', () => {
  const a = answersFor(C, 'ENFP', 'T', 1), b = answersFor(C, 'ENTP', 'T', 2); a.fungsi = b.fungsi;
  const R = C.resultOf(C.canon(a)), W = C.typeWhy(R);
  assert.equal(R.letters, 'ENFP'); assert.equal(R.type, 'ENTP');
  assert.ok(W && W.diff && W.a === 'ENTP' && W.b === 'ENFP', JSON.stringify(W));
  assert.match(W.lines.join(' '), /Dari 4 huruf saja hasilmu ENFP: Feeling-mu \d+%/);
  assert.match(W.lines.join(' '), /urutan fungsimu .* lebih mirip ENTP/);
  for (const t of C.TABLE) assert.equal(C.typeWhy(C.resultOf(C.canon(answersFor(C, t, 'A', 2)))), null, t);
});
test('kenapa tipe ini: dua tipe teratas hampir seri ditandai, tidak diklaim pasti', () => {
  const R = C.resultOf(C.canon(answersFor(C, 'ENFP', 'T', 1)));
  const fits = [{t: 'ENTP', d: 62, st: 80.8, v: 71.4}, {t: 'ENFP', d: 74, st: 68.6, v: 71.3}, ...R.fits.slice(2)];
  const W = C.typeWhy({...R, type: 'ENTP', letters: 'ENFP', fits});
  assert.ok(W.tie && W.title === 'ENTP atau ENFP?', JSON.stringify(W));
  assert.match(W.lines.join(' '), /Selisihnya hanya 0,1 poin/);
});

test('karakter: 16 tipe (biasa dan melambai) dan telur menghasilkan SVG yang valid', async () => {
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const src = ['data.js', 'legacy.js', 'core.js', 'karakter.js'].map(f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n;\n');
  const ctx = vm.createContext({});
  const K = vm.runInContext(src + '\n;KARAKTER', ctx);
  const types = Object.keys(vm.runInContext('TYPE_PAL', ctx));
  assert.equal(types.length, 16);
  const famOf = t => t[1] === 'N' ? (t[2] === 'T' ? 'NT' : 'NF') : (t[3] === 'J' ? 'SJ' : 'SP');
  for (const t of types) for (const o of [{}, {wave: true}]) {
    const s = K.svg(t, o);
    assert.ok(s.startsWith('<svg class="chr f-' + famOf(t)) && s.endsWith('</svg>'), t);
    assert.ok(!/NaN|undefined|\[object/.test(s), t + JSON.stringify(o));
    const ids = [...s.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, 'id unik dalam satu SVG: ' + t);
    for (const m of s.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(m[1]), 'rujukan ' + m[1] + ' ada di ' + t);
    assert.equal((s.match(/<svg/g) || []).length, (s.match(/<\/svg>/g) || []).length);
  }
  // Telur: aman di luar batas, retakan sesuai modul, mata mengintip hanya di 75–99%.
  for (const [p, k] of [[-1, -2], [0, 0], [.3, 1], [.8, 3], [1, 4], [2, 9], [NaN, 2]]) { const e = K.egg(p, k); assert.ok(e.startsWith('<svg class="egg"') && !/NaN|undefined/.test(e), p + ',' + k); }
  const cracks = e => (e.match(/stroke="#fff6d6" stroke-width="2"/g) || []).length;
  assert.deepEqual([0, 1, 2, 3, 4].map(k => cracks(K.egg(.5, k))), [0, 1, 2, 3, 4]);
  assert.ok(K.egg(.8, 3).includes('eg-peek') && !K.egg(.5, 2).includes('eg-peek') && !K.egg(1, 4).includes('eg-peek'));
  // Netral: telur hanya bergantung pada progres, bukan tipe (fungsi tidak menerima tipe sama sekali).
  assert.ok(/^function eggSVG\(p, k, o\)/.test(K.egg.toString()), 'telur hanya menerima progres, modul, dan pilihan ketukan (tanpa tipe)');
  // Ketukan menetas: retakan bertambah sampai 5, mata mengintip bisa dipaksa.
  assert.deepEqual([0, 1, 3, 5, 9].map(n => cracks(K.egg(1, 4, {extra: n}))), [4, 5, 7, 9, 9]);
  assert.ok(K.egg(1, 4, {peek: true}).includes('eg-peek') && !K.egg(.8, 3, {peek: false}).includes('eg-peek'));
  assert.equal(K.egg(.42, 2).replace(/eg\d+/g, ''), K.egg(.42, 2).replace(/eg\d+/g, ''));
});
