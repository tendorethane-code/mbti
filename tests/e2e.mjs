// Tes end-to-end: buka situs di Chrome headless lewat DevTools Protocol, kerjain semua soal, cek hasil & fitur simpan.
// Tanpa dependensi npm. Butuh Node 22+ (WebSocket bawaan) dan Chrome/Chromium.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn, execSync} from 'node:child_process';
import {ROOT, loadCore, answersFor} from './helpers.mjs';

const OUT = path.join(ROOT, 'tests', 'artifacts');
fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});
const DL = fs.mkdtempSync(path.join(os.tmpdir(), 'peta-dl-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const check = (name, ok, info = '') => { results.push({name, ok: !!ok, info}); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${!ok && info ? ' :: ' + info : ''}`); };

// --- server statis (meniru GitHub Pages) ---
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json'};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, {'content-type': TYPES[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

// --- Chrome ---
const findChrome = () => {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  for (const c of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) { try { return execSync(`command -v ${c}`).toString().trim(); } catch {} }
  throw new Error('Chrome tidak ditemukan. Set CHROME_BIN.');
};
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'peta-prof-'));
const chrome = spawn(findChrome(), ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${prof}`, 'about:blank'], {stdio: ['ignore', 'ignore', 'pipe']});
const wsUrl = await new Promise((res, rej) => {
  let buf = ''; const t = setTimeout(() => rej(new Error('Chrome tidak merespons')), 20000);
  chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
});

// --- klien CDP minimal ---
const ws = new WebSocket(wsUrl);
await new Promise(r => ws.addEventListener('open', r, {once: true}));
let seq = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const {res, rej} = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else if (m.method) listeners.forEach(l => l(m));
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, {res, rej}); ws.send(JSON.stringify({id, method, params, sessionId})); });
const {targetId} = await send('Target.createTarget', {url: 'about:blank'});
const {sessionId: S} = await send('Target.attachToTarget', {targetId, flatten: true});
const cmd = (m, p) => send(m, p, S);
const errors = [];
listeners.push(m => {
  if (m.sessionId !== S) return;
  if (m.method === 'Runtime.exceptionThrown') errors.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && m.params.entry.source !== 'network') errors.push('log: ' + m.params.entry.text);
});
await cmd('Page.enable'); await cmd('Runtime.enable'); await cmd('Log.enable'); await cmd('DOM.enable');
await send('Browser.setDownloadBehavior', {behavior: 'allow', downloadPath: DL, eventsEnabled: true});

const ev = async expr => {
  const r = await cmd('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true});
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const waitFor = async (expr, ms = 5000) => { const end = Date.now() + ms; while (Date.now() < end) { try { if (await ev(expr)) return true; } catch {} await sleep(50); } return false; };
const load = async () => { const done = new Promise(r => listeners.push(function f(m) { if (m.sessionId === S && m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(f), 1); r(); } })); await cmd('Page.navigate', {url: BASE}); await done; await sleep(150); };
const viewport = (w, h, mobile) => cmd('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile});
const shot = async name => { const {data} = await cmd('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true}); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data, 'base64')); };
const click = sel => ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)throw new Error('tidak ada: ${sel.replace(/'/g, '')}');e.click();return true})()`);
const noOverflow = () => ev('document.documentElement.scrollWidth<=window.innerWidth+1');
const visible = id => ev(`!document.getElementById(${JSON.stringify(id)}).hidden`);
const text = sel => ev(`(document.querySelector(${JSON.stringify(sel)})||{}).textContent||''`);
const waitFile = async (ext, ms = 8000) => { const end = Date.now() + ms; while (Date.now() < end) { const f = fs.readdirSync(DL).find(x => x.endsWith(ext)); if (f) { await sleep(200); return path.join(DL, f); } await sleep(100); } return null; };
const setFile = async file => { const {root} = await cmd('DOM.getDocument', {depth: 1}); const {nodeId} = await cmd('DOM.querySelector', {nodeId: root.nodeId, selector: '#fileIn'}); await cmd('DOM.setFileInputFiles', {nodeId, files: [file]}); };

// Fungsi di halaman: jawab soal yang lagi tampil supaya mengarah ke INFP-T.
const ANSWER = `(()=>{const T='INFP',ID='T';const L={EI:T[0],SN:T[1],TF:T[2],JP:T[3],AT:ID};
  const mod=MODS.find(m=>m.name===document.getElementById('qMod').textContent);const i=+document.getElementById('qCount').textContent.split('/')[0]-1;const it=mod.items[i];
  const rank=f=>{const k=STACK[T].indexOf(f);return k<0?1:5-k};let w;
  if(mod.id==='inti')w=it.bl===L[it.ax]?5:1;else if(mod.id==='facet')w=RIGHT[it.ax]===L[it.ax]?5:1;
  else if(mod.id==='big5')w=it.d==='N'?(it.rev?1:5):(i%3?4:2);else if(it.k==='lk')w=rank(it.fn);else w=rank(it.fb)>rank(it.fa)?5:1;
  const v=it.fl?6-w:w;document.querySelector('#qBody [data-v="'+v+'"]').click();return mod.id+':'+i})()`;

try {
  // A. Beranda di HP
  await viewport(390, 844, true);
  await load();
  check('judul halaman "Peta Kepribadian"', (await ev('document.title')) === 'Peta Kepribadian');
  check('h1 beranda', (await text('#home h1')) === 'Peta Kepribadian');
  check('total soal 184', (await text('#totalQ')) === '184');
  check('HP: peta tipe tampil di atas daftar modul', await ev("document.getElementById('ttHome').getBoundingClientRect().top<document.getElementById('mods').getBoundingClientRect().top"));
  check('HP: peta tipe kelihatan di layar pertama', await ev("document.getElementById('ttHome').getBoundingClientRect().top<innerHeight*0.75"));
  check('peta beranda: 16 sel, 4 family', await ev("document.querySelectorAll('#ttHome .cell').length===16&&new Set([...document.querySelectorAll('#ttHome small')].map(s=>s.textContent)).size===4"));
  check('HP: nggak ada scroll ke samping (beranda)', await noOverflow());
  check('"Lihat hasil" mati sebelum ada modul selesai', await ev("document.getElementById('goRes').disabled"));
  await shot('01-beranda-hp');
  await ev(`(()=>{const i=document.getElementById('nama');i.value='Tes QA';i.dispatchEvent(new Event('input'));})()`);

  // B. Navigasi soal: keyboard, mundur, simpan & keluar
  await click('#mods button[data-m="0"]');
  check('modul 1 mulai dari soal 1', (await text('#qCount')) === '1 / 44');
  await shot('02-soal-hp');
  check('HP: nggak ada scroll ke samping (soal)', await noOverflow());
  await cmd('Input.dispatchKeyEvent', {type: 'keyDown', key: '4', text: '4', code: 'Digit4'});
  check('tombol keyboard 4 menjawab dan lanjut', await waitFor("document.getElementById('qCount').textContent==='2 / 44'"));
  await cmd('Input.dispatchKeyEvent', {type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft'});
  check('panah kiri balik ke soal sebelumnya', await waitFor("document.getElementById('qCount').textContent==='1 / 44'"));
  check('jawaban sebelumnya ditandai', await ev(`document.querySelector('#qBody [data-v="4"]').getAttribute('aria-pressed')==='true'`));
  check('tombol "Sebelumnya" mati di soal pertama', await ev("document.getElementById('qBack').disabled"));
  await click('#qHome');
  check('progres kesimpan: 1/44 dijawab', (await text('#mods .mod small')).includes('1/44 dijawab'));
  check('tombol modul berubah jadi "Lanjut"', (await text('#mods button[data-m="0"]')) === 'Lanjut');

  // C. Kerjain semua modul
  await click('#mods button[data-m="0"]');
  let n = 0, guard = 0;
  while (guard++ < 400) {
    if (await visible('quiz')) {
      const before = await text('#qCount');
      await ev(ANSWER); n++;
      await waitFor(`document.getElementById('quiz').hidden||document.getElementById('qCount').textContent!==${JSON.stringify(before)}`, 3000);
    } else if (await visible('done')) {
      if (await ev("!document.getElementById('doneNext').hidden")) await click('#doneNext');
      else break;
    } else break;
  }
  check('sisa 183 soal terjawab lewat klik (1 udah lewat keyboard)', n === 183, `terjawab ${n}`);
  check('layar akhir: tombol lanjut hilang, semua selesai', (await text('#doneText')).includes('Semua modul selesai'));
  await click('#doneRes');

  // D. Halaman hasil
  const h1 = await text('#res h1');
  check('hasil: tipe INFP-T dengan nama', h1.includes('INFP-T') && h1.includes('Tes QA'), h1);
  check('hasil: 3 sel nyala berurutan, 13 redup', await ev("(()=>{const r=[...document.querySelectorAll('#ttRes .cell')].map(c=>c.dataset.rank);return r.filter(x=>x==='0').length===13&&['1','2','3'].every(k=>r.filter(x=>x===k).length===1)&&document.querySelector('#ttRes .cell[data-rank=\"1\"]').textContent.startsWith('INFP')})()"));
  check('hasil: semua bagian tampil (8 section)', (await ev("document.querySelectorAll('#res section').length")) === 8);
  check('hasil: nggak ada NaN/undefined/null', await ev("!/NaN|undefined|null|Infinity/.test(document.getElementById('res').innerText)"));
  check('hasil: urutan fungsi Fi duluan', (await text('#res .grid2 .frow b')) === 'Fi');
  check('HP: nggak ada scroll ke samping (hasil)', await noOverflow());
  await shot('03-hasil-hp');

  // E. Simpan & download
  await click('#dlJson');
  const jf = await waitFile('.json');
  let jd = null; try { jd = JSON.parse(fs.readFileSync(jf, 'utf8')); } catch {}
  check('download file jawaban (.json)', jd && jd.app === 'tes-kepribadian' && jd.name === 'Tes QA' && jd.ans.inti.length === 44 && jd.ans.fungsi.length === 40, jf || 'tidak ada file');
  check('nama file jawaban aman', jf && path.basename(jf) === 'jawaban-peta-kepribadian-tes-qa.json', jf);
  await click('#dlCard');
  check('kartu PNG tampil di halaman', await waitFor("(()=>{const i=document.getElementById('cardPrev');return !i.hidden&&i.naturalWidth===1080&&i.naturalHeight>=1350})()", 8000));
  const pf = await waitFile('.png');
  check('download kartu PNG valid', pf && fs.readFileSync(pf).subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), pf || 'tidak ada file');
  if (pf) fs.copyFileSync(pf, path.join(OUT, '04-kartu.png'));
  await click('#copy');
  check('salin ringkasan (clipboard atau kotak manual)', await waitFor("(()=>{const m=document.getElementById('copyMsg').textContent;const b=document.getElementById('copyBox');return m.includes('disalin')||(!b.hidden&&b.value.includes('INFP-T'))})()", 3000));

  // F. Mode cetak (PDF)
  await cmd('Emulation.setEmulatedMedia', {media: 'print'});
  check('cetak: tombol & footer disembunyikan, hasil tampil', await ev("getComputedStyle(document.querySelector('#res .noprint')).display==='none'&&getComputedStyle(document.querySelector('footer')).display==='none'&&getComputedStyle(document.getElementById('res')).display!=='none'"));
  const pdf = await cmd('Page.printToPDF', {printBackground: true});
  fs.writeFileSync(path.join(OUT, '05-hasil.pdf'), Buffer.from(pdf.data, 'base64'));
  check('cetak PDF berhasil', pdf.data.length > 10000);
  await cmd('Emulation.setEmulatedMedia', {media: ''});

  // G. Muat ulang: progres tetap ada
  await load();
  check('muat ulang: 4 modul tetap selesai', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 4);
  check('muat ulang: nama tetap', (await ev("document.getElementById('nama').value")) === 'Tes QA');
  check('"Lihat hasil" aktif', await ev("!document.getElementById('goRes').disabled"));

  // H. Ulangi modul butuh 2 tap
  await click('#mods button[data-m="1"]');
  check('ulangi: tap pertama cuma minta konfirmasi', (await text('#mods button[data-m="1"]')) === 'Tap lagi buat ulangi' && (await visible('home')));
  check('ulangi: jawaban belum kehapus', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 4);

  // I. Hapus semua
  await click('#askReset');
  check('hapus: muncul konfirmasi', await visible('confirmReset'));
  await click('#noReset');
  check('hapus: batal nggak ngapus apa-apa', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 4);
  await click('#askReset'); await click('#doReset');
  check('hapus: semua modul kosong lagi', (await ev("[...document.querySelectorAll('#mods small')].every(s=>s.textContent.includes('belum mulai'))")));
  check('hapus: "Lihat hasil" mati lagi', await ev("document.getElementById('goRes').disabled"));

  // J. Buka file jawaban
  if (jf) {
    await setFile(jf);
    check('buka file jawaban: hasil langsung muncul lagi', await waitFor("!document.getElementById('res').hidden&&document.querySelector('#res h1').textContent.includes('INFP-T')", 4000));
  }
  await click('#resHome');
  const bad = path.join(DL, 'rusak.json'); fs.writeFileSync(bad, '{"bukan":"file kita"');
  await setFile(bad);
  check('buka file rusak: pesan error, nggak crash', await waitFor("document.getElementById('fileMsg').textContent.includes('bukan file jawaban')", 3000));

  // K. Hasil sebagian (cuma Big Five)
  const C = loadCore();
  const part = path.join(DL, 'sebagian.json');
  fs.writeFileSync(part, JSON.stringify({app: 'tes-kepribadian', v: 1, name: '', ans: {big5: Array.from(answersFor(C, 'INTJ').big5)}}));
  await setFile(part);
  check('hasil sebagian: judul "Hasil sementara" + Big Five', await waitFor("!document.getElementById('res').hidden&&document.querySelector('#res h1').textContent==='Hasil sementara'&&/Big Five/.test(document.getElementById('res').innerText)", 4000));
  check('hasil sebagian: nggak ada NaN', await ev("!/NaN|undefined|Infinity/.test(document.getElementById('res').innerText)"));
  await click('#dlCard');
  check('hasil sebagian: kartu PNG tetap bisa dibuat', await waitFor("(()=>{const i=document.getElementById('cardPrev');return !i.hidden&&i.naturalWidth===1080})()", 8000));

  // L. Laptop + mode gelap
  if (jf) { await click('#resHome'); await setFile(jf); await waitFor("!document.getElementById('res').hidden", 4000); }
  await viewport(1280, 900, false);
  check('laptop: nggak ada scroll ke samping (hasil)', await noOverflow());
  await shot('06-hasil-laptop');
  const lightCell = await ev("document.querySelector('#ttHome .cell').style.background");
  const lightTop = await ev("document.querySelector('#ttRes .cell[data-rank=\"1\"]').style.background");
  await cmd('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: 'dark'}]});
  await sleep(200);
  check('mode gelap: warna peta beranda ikut ganti', (await ev("document.querySelector('#ttHome .cell').style.background")) !== lightCell);
  check('mode gelap: warna tabel hasil ikut ganti', (await ev("document.querySelector('#ttRes .cell[data-rank=\"1\"]').style.background")) !== lightTop);
  check('mode gelap: latar ikut gelap', (await ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 16, 25)');
  await shot('07-hasil-gelap');
  await click('#resHome');
  check('laptop: peta di kanan judul', await ev("(()=>{const a=document.getElementById('ttHome').getBoundingClientRect(),b=document.querySelector('#home h1').getBoundingClientRect();return a.left>b.right-1&&a.top<b.bottom+200})()"));
  await shot('08-beranda-laptop-gelap');

  check('nggak ada error JavaScript sama sekali', errors.length === 0, errors.join(' | '));
} catch (e) {
  check('tes jalan sampai selesai', false, e.stack);
} finally {
  ws.close(); chrome.kill('SIGKILL'); server.close();
  const fail = results.filter(r => !r.ok);
  console.log(`\n${results.length - fail.length}/${results.length} lulus. Screenshot & PDF di tests/artifacts/`);
  process.exitCode = fail.length ? 1 : 0;
}
