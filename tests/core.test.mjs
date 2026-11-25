import test from 'node:test';
import assert from 'node:assert/strict';
import {loadCore, answersFor} from './helpers.mjs';

const C = loadCore();
const finite = x => typeof x === 'number' && Number.isFinite(x);

test('jumlah soal per modul sesuai rancangan', () => {
  assert.deepEqual(Array.from(C.MODS, m => m.items.length), [44, 45, 60, 40]);
  assert.equal(C.TOTAL, 189);
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
  for (const d of C.B5) { assert.equal(d[2].length, 6, d[1]); for (const f of d[2]) assert.equal(f.length, 3); }
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
  const ok = C.sanitizeImport(JSON.parse(JSON.stringify(C.exportData('Gama <b>', ans))));
  assert.equal(ok.name, 'Gama b');
  assert.equal(C.compute(ok.ans).type, 'INFP');
  assert.equal(C.sanitizeImport(null), null);
  assert.equal(C.sanitizeImport({app: 'lain', ans: {}}), null);
  assert.equal(C.sanitizeImport({app: 'tes-kepribadian'}), null);
  const weird = C.sanitizeImport({app: 'tes-kepribadian', ans: {inti: [9, '3', -1, 2.5, null, 4], facet: 'x'}});
  assert.deepEqual(Array.from(weird.ans.inti.slice(0, 6)), [0, 0, 0, 0, 0, 4]);
  assert.equal(weird.ans.inti.length, 44);
  assert.equal(weird.ans.facet.every(v => v === 0), true);
});

test('nama file aman', () => {
  assert.equal(C.fileSlug('Gama Putra'), 'gama-putra');
  assert.equal(C.fileSlug('../../etc/passwd'), 'etc-passwd');
  assert.equal(C.fileSlug('   '), '');
  assert.equal(C.safeName('x'.repeat(50)).length, 30);
});

test('ringkasan teks lengkap', () => {
  const t = C.summaryText(C.compute(answersFor(C, 'INFP')), 'Gama');
  assert.match(t, /Peta Kepribadian · Gama/);
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
  const d = C.sanitizeImport({app: 'tes-kepribadian', v: 1, name: 'Lama', ans: {...full, facet: v1Facet({'sn-c1': 5, 'sn-t2': 2, 'ei-x5': 1, 'ei-g1': 4})}});
  assert.equal(d.v, C.DATA_V);
  assert.equal(d.migrated, true);
  const c = C.canon(d.ans);
  assert.equal(c['sn-c1'], 5); assert.equal(c['sn-t2'], 2); assert.equal(c['ei-x5'], 1); assert.equal(c['ei-g1'], 4);
  assert.equal(c['tf-l1'], undefined); assert.equal(c['jp-s1'], undefined); assert.equal(c['ei-x1'], undefined);
  assert.deepEqual(Array.from(d.ans.inti), Array.from(full.inti));
  assert.equal(C.answered(d.ans, C.MODS[1]), 5 + 10);
  // file versi 2 dibaca apa adanya
  const v2 = C.sanitizeImport(JSON.parse(JSON.stringify(C.exportData('Baru', full))));
  assert.equal(v2.migrated, false);
  assert.deepEqual(Array.from(v2.ans.facet), Array.from(full.facet));
});

test('canon dan fromCanon saling balik', () => {
  const full = answersFor(C, 'ESTJ', 'A', 1);
  assert.deepEqual(JSON.parse(JSON.stringify(C.fromCanon(C.canon(full)))), JSON.parse(JSON.stringify(full)));
});

const textsOf = I => [I.summary, ...I.sections.flatMap(s => [s.title, ...s.items.flatMap(x => [x.t, x.b])]), ...[...I.strengths, ...I.watch, ...I.tips].flatMap(x => [x.t, x.b])];

test('ringkasan kepribadian: 16 tipe x 2 identitas, kalimat lengkap tanpa undefined/NaN', () => {
  for (const t of C.TABLE) for (const id of ['A', 'T']) for (const st of [1, 2]) {
    const ans = answersFor(C, t, id, st), I = C.insights(C.compute(ans), ans);
    assert.ok(I.summary.startsWith('Kamu '), t);
    for (const x of textsOf(I)) assert.ok(typeof x === 'string' && x.length > 0 && !/undefined|NaN|null/.test(x), `${t}-${id}: ${x}`);
    assert.ok(I.sections.every(s => s.items.length <= 6) && I.strengths.length <= 6 && I.watch.length <= 5 && I.tips.length <= 6);
  }
});

test('ringkasan kepribadian: arah kalimat ikut skor', () => {
  const intro = answersFor(C, 'INFP'), extro = answersFor(C, 'ESTJ', 'A');
  const a = C.insights(C.compute(intro), intro), b = C.insights(C.compute(extro), extro);
  assert.match(a.summary, /waktu sendiri/); assert.match(b.summary, /interaksi dengan orang/);
  assert.match(a.summary, /fleksibel/); assert.match(b.summary, /rencana dan kepastian/);
  assert.match(b.summary, /tenang/);
});

test('ringkasan kepribadian: jawaban acak dan hasil sebagian tidak error', () => {
  let s = 7; const rnd = () => (s = s * 16807 % 2147483647) % 5 + 1;
  for (let k = 0; k < 200; k++) {
    const ans = Object.fromEntries(C.MODS.map(m => [m.id, m.items.map(rnd)]));
    for (const x of textsOf(C.insights(C.compute(ans), ans))) assert.ok(!/undefined|NaN/.test(x), x);
  }
  const full = answersFor(C, 'INTJ');
  for (const part of [{big5: full.big5}, {inti: full.inti}, {facet: full.facet}, {fungsi: full.fungsi}, {}]) {
    const ans = {...C.emptyAns(), ...part}, I = C.insights(C.compute(ans), ans);
    for (const x of textsOf(I)) assert.ok(!/undefined|NaN/.test(x), x);
  }
});

test('ringkasan kepribadian: pola gabungan dari soal Expressive per emosi', () => {
  const ans = answersFor(C, 'INFP'), c = C.canon(ans);
  Object.assign(c, {'ei-x1': 5, 'ei-x2': 5, 'ei-x4': 5, 'ei-x5': 1, 'ei-x3': 5});
  const a2 = C.fromCanon(c), I = C.insights(C.compute(a2), a2);
  assert.ok(I.special.some(x => /seperti kesal lebih mudah terlihat/.test(x.t)));
  assert.ok(I.tips.some(x => /terlihat kesal/.test(x.t)));
});

test('catatan khusus: dibersihkan dan dibatasi', () => {
  const n = C.cleanNotes([{tag: 'A'.repeat(99), title: 'Judul', text: 'x\u0007y'}, null, 'teks', {}, ...Array(20).fill({title: 't'})]);
  assert.equal(n.length, 12); assert.equal(n[0].tag.length, 40); assert.equal(n[0].text, 'xy');
  assert.deepEqual(Array.from(C.cleanNotes('bukan array')), []);
  assert.equal(C.esc('<img src=x onerror="a">&\''), '&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;');
  const ex = C.exportData('A', answersFor(C, 'INFP'));
  assert.ok(!('notes' in ex) && !('summary' in ex));
});

test('link hasil: bolak-balik utuh, termasuk catatan dan huruf non-ASCII', () => {
  const ans = answersFor(C, 'ENTP', 'A', 1);
  const d = C.sanitizeImport(JSON.parse(JSON.stringify(C.exportData('Gama ✨', ans, {summary: 'Ringkasan — é', notes: [{tag: 'T/F · −2', title: 'Judul', text: 'Isi'}]}))));
  const back = C.decodeShare(C.encodeShare(d));
  assert.deepEqual(JSON.parse(JSON.stringify(back.ans)), JSON.parse(JSON.stringify(d.ans)));
  assert.equal(back.name, d.name); assert.equal(back.summary, 'Ringkasan — é'); assert.equal(back.notes[0].tag, 'T/F · −2');
  assert.equal(C.compute(back.ans).type, 'ENTP');
  for (const bad of ['', 'abc', '!!!!!!!!!!', 'eyJ2IjoyfQ', 'A'.repeat(30000), null]) assert.equal(C.decodeShare(bad), null, String(bad).slice(0, 12));
});
