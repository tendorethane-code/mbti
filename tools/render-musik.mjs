// Rekam musik momen terungkap ke audio/musik-terungkap.mp3 dengan kualitas sintesis penuh, lalu tulis ulang baris MUS_FILE di index.html.
// Kenapa: menyintesis orkestra secara langsung butuh ~40% satu inti prosesor desktop (puncak ~85%); HP lemah tidak sanggup sehingga suara putus-putus.
// Rekaman diputar sebagai satu sumber suara, jadi kualitasnya sama di semua perangkat. Efek suara tetap disintesis langsung di browser.
// Kode musik diambil apa adanya dari index.html (sekuenser yang sama, termasuk jeda jadwal 0,2 detik), dijalankan di OfflineAudioContext.
// Butuh: Playwright (Chromium) dan ffmpeg. Jalankan dari akar repo: node tools/render-musik.mjs
// Jalankan ulang setiap kali musik di index.html diubah.
import {readFileSync, writeFileSync, mkdirSync, rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const ROOT = new URL('..', import.meta.url).pathname;
const SR = 48000;

// Linimasa standar animasi (detik sejak potongan dimulai), diukur dari ungkap(): isyarat 'open' memulai intro 0,55 dtk kemudian,
// 'scan' pertama mengganti ke drive, 'hop' pertama ke peak, 'three' mereset ke break, 'two' ke roll, 'land' memudarkan musik, 'reveal' memulai anthem.
// stop = saat isyarat reset berikutnya (penjadwalan berhenti, nada yang sudah berbunyi dibiarkan habis). roll diberi panjang maksimum
// (duel ketat ~2,7 dtk); saat 'land' pemutar memudarkannya seperti sintesis langsung.
const SEG = [
  {k: 'intro', stop: 7.773, ev: [[1.056, 'drive', 'intro'], [4.626, 'peak', 'drive']], len: 14},
  {k: 'break', stop: 2.747, ev: [], len: 9},
  {k: 'roll', stop: 2.95, ev: [], len: 7},
  {k: 'anthem', stop: null, ev: [], len: 22},
];

const html = readFileSync(ROOT + 'index.html', 'utf8');
const a = html.indexOf('const SFX_KEY='), m0 = html.indexOf('const sfx=(()=>{'), b = html.indexOf('\n})();', m0) + 6;
if (a < 0 || m0 < 0 || b < 6) throw new Error('modul suara tidak ditemukan di index.html');
let src = html.slice(a, b);
const sub = (x, y) => { if (src.split(x).length !== 2) throw new Error('pola harus muncul tepat sekali: ' + x.slice(0, 60)); src = src.replace(x, y); };
// keluaran sebelum kompresor master (kompresor tetap jalan di browser bersama efek suara), volume penuh, sintesis penuh, tanpa memuat rekaman
sub("const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=6;comp.ratio.value=6;comp.attack.value=.003;comp.release.value=.25;comp.connect(ac.destination);",
  "const comp=ac.createGain();comp.connect(ac.destination);");
sub('out.gain.value=on?.7:0', 'out.gain.value=1');
sub('const aqDecide=()=>{', "const aqDecide=()=>{aqLite=false;aqForce='render';return;");
sub('const musFetch=()=>{', 'const musFetch=()=>{return null;');
sub('  return {\n    get on()', '  window.__M={musGo,musStop,mus,init};\n  return {\n    get on()');

const b64f32 = s => { const u = Buffer.from(s, 'base64'); return new Float32Array(u.buffer, u.byteOffset, u.length / 4); };

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><title>render</title>');
const rendered = [];
for (const s of SEG) {
  const out = await page.evaluate(async ([src, k, stop, ev, len, SR]) => {
    const Q = .04; let OAC = null; const ticks = [];
    window.AudioContext = function () { OAC = new OfflineAudioContext(2, Math.ceil(SR * len), SR); OAC._res = OAC.resume.bind(OAC); OAC.resume = () => Promise.resolve(); return OAC; };
    window.setInterval = f => { ticks.push(f); return ticks.length; }; window.clearInterval = id => { if (id) ticks[id - 1] = null; };
    new Function(src + ';return sfx')();
    const M = window.__M; M.init(); M.musGo(k, 0, true);
    let stopped = false, ei = 0;
    for (let i = 1; i < Math.floor(len / Q); i++) {
      const T = +(i * Q).toFixed(4);
      OAC.suspend(T).then(() => {
        if (!stopped) {
          if (stop != null && T >= stop) { M.mus.ph = null; stopped = true; }
          else { while (ei < ev.length && ev[ei][0] <= T) { const [, np, need] = ev[ei++]; if (M.mus.ph === need) M.musGo(np, T + .01); } ticks.forEach(f => f && f()); }
        }
        OAC._res();
      });
    }
    const buf = await OAC.startRendering();
    const enc = f => { const u = new Uint8Array(f.buffer); let s = ''; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); };
    return [enc(buf.getChannelData(0)), enc(buf.getChannelData(1))];
  }, [src, s.k, s.stop, s.ev, s.len, SR]);
  rendered.push(out.map(b64f32));
  console.log('terekam:', s.k);
}

// potong ekor yang sudah di bawah -66 dBFS, beri pudar 50 ms
const TH = Math.pow(10, -66 / 20), FADE = Math.round(.05 * SR);
const parts = rendered.map(([L, R]) => {
  let end = L.length - 1; while (end > 0 && Math.abs(L[end]) < TH && Math.abs(R[end]) < TH) end--;
  end = Math.min(L.length, end + FADE);
  const l = L.slice(0, end), r = R.slice(0, end);
  for (let i = 0; i < FADE && i < end; i++) { const g = i / FADE; l[end - 1 - i] *= g; r[end - 1 - i] *= g; }
  return [l, r];
});
let peak = 0; for (const [l, r] of parts) for (let i = 0; i < l.length; i++) peak = Math.max(peak, Math.abs(l[i]), Math.abs(r[i]));
const G = .85 / peak;

// satu file: jeda 0,25 dtk, lalu potongan dipisah jeda 0,5 dtk
const PRE = Math.round(.25 * SR), GAP = Math.round(.5 * SR);
const total = PRE + parts.reduce((s, [l]) => s + l.length + GAP, 0);
const inter = new Float32Array(total * 2), seg = {};
let pos = PRE;
parts.forEach(([l, r], j) => {
  seg[SEG[j].k] = [pos / SR, l.length / SR];
  for (let i = 0; i < l.length; i++) { inter[(pos + i) * 2] = l[i] * G; inter[(pos + i) * 2 + 1] = r[i] * G; }
  pos += l.length + GAP;
});
const tmp = join(tmpdir(), 'render-musik-' + process.pid); mkdirSync(tmp, {recursive: true});
writeFileSync(join(tmp, 'm.f32'), Buffer.from(inter.buffer));
mkdirSync(ROOT + 'audio', {recursive: true});
const mp3 = ROOT + 'audio/musik-terungkap.mp3';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', join(tmp, 'm.f32'), '-c:a', 'libmp3lame', '-q:a', '2', mp3]);

// cek: decode di Chromium, ukur geser waktu dekoder (dikoreksi ke tabel) dan selisih terhadap aslinya
const bytes = readFileSync(mp3).toString('base64');
const [dl, dr] = (await page.evaluate(async ([b, SR]) => {
  const u = Uint8Array.from(atob(b), c => c.charCodeAt(0));
  const buf = await new OfflineAudioContext(2, SR, SR).decodeAudioData(u.buffer);
  const enc = f => { const x = new Uint8Array(f.buffer); let s = ''; for (let i = 0; i < x.length; i += 32768) s += String.fromCharCode.apply(null, x.subarray(i, i + 32768)); return btoa(s); };
  return [enc(buf.getChannelData(0)), enc(buf.getChannelData(1))];
}, [bytes, SR])).map(b64f32);
const ref = new Float32Array(total); for (let i = 0; i < total; i++) ref[i] = inter[i * 2];
const o0 = Math.round(seg.intro[0] * SR), W = SR * 2;
let best = 0, lag = 0;
for (let d = -3000; d <= 3000; d++) { let c = 0; for (let i = 0; i < W; i += 4) c += ref[o0 + i] * (dl[o0 + i + d] || 0); if (c > best) { best = c; lag = d; } }
let e = 0, n = 0; for (let i = 0; i < total - Math.abs(lag) - 1; i++) { const x = ref[i]; const y = dl[i + lag] || 0; e += (x - y) ** 2; n += x * x; }
for (const k in seg) seg[k] = [+(seg[k][0] + lag / SR).toFixed(4), +seg[k][1].toFixed(4)];
await browser.close();
rmSync(tmp, {recursive: true, force: true});

const ver = createHash('sha1').update(readFileSync(mp3)).digest('hex').slice(0, 8);
const line = `  const MUS_FILE={src:'audio/musik-terungkap.mp3?v=${ver}',g:${+(1 / G).toFixed(4)},seg:${JSON.stringify(seg)}};`;
const re = /^  const MUS_FILE=\{.*\};$/m;
if (!re.test(html)) throw new Error('baris MUS_FILE tidak ditemukan di index.html');
writeFileSync(ROOT + 'index.html', html.replace(re, line));
const kb = Math.round(readFileSync(mp3).length / 1024);
console.log(`audio/musik-terungkap.mp3: ${kb} KB, ${(total / SR).toFixed(1)} dtk, geser dekoder ${lag} sampel, selisih terhadap asli ${(10 * Math.log10(e / n)).toFixed(1)} dB`);
console.log(line.trim());
