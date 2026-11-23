import test from 'node:test';
import assert from 'node:assert/strict';
import {loadCore, answersFor} from './helpers.mjs';

const C = loadCore();
const finite = x => typeof x === 'number' && Number.isFinite(x);

test('jumlah soal per modul sesuai rancangan', () => {
  assert.deepEqual(Array.from(C.MODS, m => m.items.length), [44, 40, 60, 40]);
  assert.equal(C.TOTAL, 184);
  const per = ax => C.CORE.filter(c => c[0] === ax).length;
  assert.deepEqual(['EI', 'SN', 'TF', 'JP', 'AT'].map(per), [8, 10, 10, 8, 8]);
});

test('setiap facet Step II punya tepat 2 soal', () => {
  for (const ax of Object.keys(C.FACETS)) for (let f = 0; f < 5; f++)
    assert.equal(C.FITEMS.filter(x => x[0] === ax && x[1] === f).length, 2, `${ax} facet ${f}`);
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
