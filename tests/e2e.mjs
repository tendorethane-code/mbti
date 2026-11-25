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
  const st=JSON.parse(localStorage.getItem('tesKepribadian.v1'));const mm=MODS.find(m=>m.name===document.getElementById('qMod').textContent);
  const mod=mm||{id:'dalam',items:deepPlan(resultOf(st.c),st.c)};const i=+document.getElementById('qCount').textContent.split('/')[0]-1;const it=mod.items[i];
  const rank=f=>{const k=STACK[T].indexOf(f);return k<0?1:5-k};let w;
  if(mod.id==='inti')w=it.bl===L[it.ax]?5:1;else if(mod.id==='facet')w=RIGHT[it.ax]===L[it.ax]?5:1;
  else if(mod.id==='big5')w=it.d==='N'?(it.rev?1:5):(i%3?4:2);else if(it.k==='lk')w=rank(it.fn);else w=rank(it.fb)>rank(it.fa)?5:1;
  const v=it.fl?6-w:w;document.querySelector('#qBody [data-v="'+v+'"]').click();return mod.id+':'+i})()`;

const C0 = loadCore();
try {
  // A. Beranda di HP
  await viewport(390, 844, true);
  await load();
  check('judul halaman "Peta Kepribadian"', (await ev('document.title')) === 'Peta Kepribadian');
  check('h1 beranda', (await text('#home h1')).startsWith('Kenali cara kamu'));
  check('beranda tanpa perkiraan waktu', await ev("!/menit/.test(document.getElementById('home').innerText)"));
  check('total soal 189', (await text('#totalQ')) === '189');
  check('tema bawaan: gelap', (await ev("document.documentElement.dataset.theme")) === 'dark' && (await ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 16, 25)');
  check('pilihan tema ada di atas, "Gelap" aktif', await ev(`document.querySelector('.topbar [data-theme-set="dark"]').getAttribute('aria-pressed')==='true'&&document.querySelector('.topbar').getBoundingClientRect().top<60`));
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
  check('tombol modul berubah jadi "Lanjutkan"', (await text('#mods button[data-m="0"]')) === 'Lanjutkan');

  // C. Kerjain semua modul
  await click('#mods button[data-m="0"]');
  let n = 0, guard = 0, deepPrompt = false;
  while (guard++ < 400) {
    if (await visible('quiz')) {
      const before = await text('#qCount');
      await ev(ANSWER); n++;
      await waitFor(`document.getElementById('quiz').hidden||document.getElementById('qCount').textContent!==${JSON.stringify(before)}`, 3000);
    } else if (await visible('done')) {
      if ((await text('#doneText')).includes('Semua modul utama selesai') && (await text('#doneNext')) === 'Lanjut ke Pendalaman') deepPrompt = true;
      if (await ev("!document.getElementById('doneNext').hidden")) await click('#doneNext');
      else break;
    } else break;
  }
  check('setelah 4 modul utama, ditawari modul Pendalaman', deepPrompt);
  check('sisa soal terjawab lewat klik (188 utama + minimal 5 Pendalaman)', n >= 193, `terjawab ${n}`);
  check('layar akhir: tombol lanjut hilang, semua selesai termasuk Pendalaman', (await text('#doneText')).includes('termasuk Pendalaman'));
  await click('#doneRes');

  // D. Halaman hasil
  const h1 = await text('#res h1');
  check('hasil: tipe INFP-T dengan nama', h1.includes('INFP-T') && h1.includes('Tes QA'), h1);
  check('hasil: 3 sel nyala berurutan, 13 redup', await ev("(()=>{const r=[...document.querySelectorAll('#ttRes .cell')].map(c=>c.dataset.rank);return r.filter(x=>x==='0').length===13&&['1','2','3'].every(k=>r.filter(x=>x===k).length===1)&&document.querySelector('#ttRes .cell[data-rank=\"1\"]').textContent.startsWith('INFP')})()"));
  check('hasil: semua bagian tampil (15 section: hero, 5 bab, penutup, simpan, 6 bagian angka, seberapa bisa dipegang)', (await ev("document.querySelectorAll('#res section').length")) === 15, await ev("document.querySelectorAll('#res section').length"));
  check('hasil: ringkasan kepribadian dari skor', /^Kamu .*waktu sendiri/.test(await text('#sumText')), await text('#sumText'));
  check('hasil: gambaran keseharian 5 kelompok, tiap kalimat ada dasarnya', await ev("(()=>{const s=document.querySelectorAll('#keseharian .sec');const li=[...document.querySelectorAll('#keseharian li')];return s.length===5&&li.length>=10&&li.every(l=>/Dasar: /.test(l.textContent))})()"));
  check('hasil: kalimat keseharian mengutip jawaban asli', await ev("document.querySelectorAll('#keseharian .quote').length>=5&&[...document.querySelectorAll('#keseharian .quote')].every(q=>/^Kamu (memilih|setuju|tidak setuju): “/.test(q.textContent))"));
  check('hasil: kekuatan, perlu diperhatikan, tips teman tampil', await ev("document.querySelectorAll('#kekuatan .c-tiles li').length>=4&&document.querySelectorAll('#jaga .c-watch li').length>=2&&document.querySelectorAll('#tips li').length>=3"));
  check('hasil web: alur bab berurutan (hook, Bab 1-5, penutup, simpan, angka)', await ev("(()=>{const ids=['ringkasan','kekuatan','catatan','keseharian','jaga','penutup','akhir','angka','pegang'].map(i=>document.getElementById(i));if(ids.some(x=>!x))return false;for(let i=1;i<ids.length;i++)if(!(ids[i-1].compareDocumentPosition(ids[i])&Node.DOCUMENT_POSITION_FOLLOWING))return false;return document.querySelector('.rhero').compareDocumentPosition(ids[0])&Node.DOCUMENT_POSITION_FOLLOWING})()"));
  check('hasil web: 3 temuan besar, sisanya ringkas, keseharian maks. 3 poin terbuka', await ev("(()=>{const big=document.querySelectorAll('#catatan .c-feat').length;const open=[...document.querySelectorAll('#keseharian .sec')].every(s=>s.querySelectorAll(':scope>ul>li').length<=3);return big===3&&open})()"));
  check('hasil web: yang perlu dijaga tidak diulang di keseharian', await ev("(()=>{const w=[...document.querySelectorAll('#jaga .c-watch b')].map(b=>b.textContent);return w.length>0&&[...document.querySelectorAll('#keseharian li')].every(l=>!w.some(t=>l.textContent.startsWith(t)))})()"));
  await click('#res [data-jump="catatan"]');
  check('hasil web: "Baca selengkapnya" di hook menggulir ke temuan', await waitFor("Math.abs(document.getElementById('catatan').getBoundingClientRect().top)<80", 3000));
  check('hasil: temuan khusus otomatis dari Pendalaman, lengkap dengan dasarnya', await ev("/Introvert murni/.test(document.getElementById('catatan').innerText)&&[...document.querySelectorAll('#catatan .ncard')].every(c=>/Dasar: /.test(c.textContent))"));
  check('hasil: ajakan Pendalaman tidak muncul kalau sudah dikerjakan', await ev("!document.getElementById('goDeep')"));
  check('hasil: warna halaman mengikuti palet tipe (INFP)', (await ev("document.getElementById('res').style.getPropertyValue('--fam')")) === C0.typePal('INFP', true).a);
  check('hasil: hook "Yang paling khas darimu" tampil', await ev("!!document.querySelector('#res .hook b')&&document.querySelector('#res .hook b').textContent.length>3"));
  check('cetak: alur cerita PDF (5 bab + penutup) hanya untuk PDF', await ev("(()=>{const st=document.querySelector('#res .story');return !!st&&getComputedStyle(st).display==='none'&&st.querySelectorAll('.spage').length>=6&&/Yang membuatmu kuat/.test(st.textContent)})()"));
  check('cetak: judul tipe bergradien di sampul berupa gambar', await waitFor("(()=>{const i=document.getElementById('pcType');return !!i&&i.src.startsWith('data:image/png')})()", 3000));
  check('cetak: sampul dengan tipe dan hook, hanya untuk PDF', await ev("(()=>{const c=document.querySelector('#res .pcover');return !!c&&getComputedStyle(c).display==='none'&&/INFP/.test(c.textContent)&&/Yang paling khas darimu/.test(c.textContent)})()"));
  check('hasil: belum ada perbandingan riwayat (baru 1 tes)', await ev("!document.getElementById('riwayat')"));
  check('hasil: nggak ada NaN/undefined/null', await ev("!/NaN|undefined|null|Infinity/.test(document.getElementById('res').innerText)"));
  check('hasil: urutan fungsi Fi duluan', (await text('#res .grid2 .frow b')) === 'Fi');
  check('HP: nggak ada scroll ke samping (hasil)', await noOverflow());
  await shot('03-hasil-hp');

  // E. Simpan & download
  await click('#dlJson');
  const jf = await waitFile('.json');
  let jd = null; try { jd = JSON.parse(fs.readFileSync(jf, 'utf8')); } catch {}
  check('download file jawaban (.json) versi 3, per id soal', jd && jd.app === 'tes-kepribadian' && jd.v === 3 && jd.name === 'Tes QA' && Object.keys(jd.c).length >= 194 && C0.MODS.every(m => m.items.every(it => C0.valid(jd.c[it.id]))), jf || 'tidak ada file');
  check('nama file jawaban aman', jf && path.basename(jf) === 'jawaban-peta-kepribadian-tes-qa.json', jf);
  await click('#dlCard');
  check('kartu PNG tampil di halaman, ukuran story 1080x1920', await waitFor("(()=>{const i=document.getElementById('cardPrev');return !i.hidden&&i.naturalWidth===1080&&i.naturalHeight===1920})()", 8000));
  const px = `(()=>{const i=document.getElementById('cardPrev'),c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);return [...x.getImageData(30,700,1,1).data].slice(0,3).join(',')})()`;
  check('kartu PNG ikut tema gelap', (await ev(px)) === '18,16,25', await ev(px));
  const pf = await waitFile('.png');
  check('pratinjau kartu langsung tampil, contoh kecil tiap gaya tergambar', await waitFor("[...document.querySelectorAll('#akhir canvas[data-thumb]')].every(c=>{const d=c.getContext('2d').getImageData(45,80,1,1).data;return d[3]>0})", 8000));
  check('pilihan gaya kartu: 7 gaya tersedia, Poster bawaan', (await ev("document.querySelectorAll('[data-card-style]').length")) === 7 && (await ev("document.querySelector('[data-card-style=\"poster\"]').getAttribute('aria-pressed')")) === 'true');
  await ev("document.getElementById('cardPrev').src=''");
  await click('[data-card-style="takaran"]');
  check('ganti gaya kartu: tersimpan dan kartu dibuat ulang', await waitFor("localStorage.getItem('tesKepribadian.kartu')==='takaran'&&document.getElementById('cardPrev').naturalHeight>=960", 6000));
  await click('[data-card-style="poster"]');
  check('download kartu PNG valid', pf && fs.readFileSync(pf).subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), pf || 'tidak ada file');
  if (pf) fs.copyFileSync(pf, path.join(OUT, '04-kartu.png'));
  await click('#copy');
  check('salin ringkasan (clipboard atau kotak manual)', await waitFor("(()=>{const m=document.getElementById('copyMsg').textContent;const b=document.getElementById('copyBox');return m.includes('disalin')||(!b.hidden&&b.value.includes('INFP-T'))})()", 3000));
  await ev("document.getElementById('copyMsg').textContent='';document.getElementById('copyBox').hidden=true");
  await click('#shareLink');
  check('salin link hasil', await waitFor("(()=>{const m=document.getElementById('copyMsg').textContent;const b=document.getElementById('copyBox');return m.includes('Link hasil sudah disalin')||(!b.hidden&&/#h=[A-Za-z0-9_-]+$/.test(b.value))})()", 3000));

  // F. Mode cetak (PDF)
  await cmd('Emulation.setEmulatedMedia', {media: 'print'});
  check('cetak: latar ikut tema gelap, diberi semburat warna tipe', await ev("(()=>{const m=getComputedStyle(document.body).backgroundColor.match(/\\d+/g).map(Number);const s=typeSurf('INFP',true).bg;return m.every(v=>v<40)&&getComputedStyle(document.body).backgroundColor===`rgb(${parseInt(s.slice(1,3),16)}, ${parseInt(s.slice(3,5),16)}, ${parseInt(s.slice(5,7),16)})`&&document.getElementById('pageStyle').textContent.includes(s)})()"));
  check('cetak: sampul punya motif khas tipe dan cap family', await waitFor("(()=>{const m=document.getElementById('pcMotif'),s=document.getElementById('pcStamp');return !!m&&m.src.startsWith('data:image/png')&&!!s&&s.src.startsWith('data:image/png')&&/Diplomat/.test(s.alt)})()", 3000));
  check('cetak: tombol & footer disembunyikan, hasil tampil', await ev("getComputedStyle(document.querySelector('#res .noprint')).display==='none'&&getComputedStyle(document.querySelector('footer')).display==='none'&&getComputedStyle(document.getElementById('res')).display!=='none'"));
  await ev("window.dispatchEvent(new Event('beforeprint'))");
  check('cetak: tabel skor rinci ikut kebuka', await ev("[...document.querySelectorAll('#res details')].every(d=>d.open)"));
  const pdf = await cmd('Page.printToPDF', {printBackground: true});
  fs.writeFileSync(path.join(OUT, '05-hasil.pdf'), Buffer.from(pdf.data, 'base64'));
  check('cetak PDF berhasil', pdf.data.length > 10000);
  await cmd('Emulation.setEmulatedMedia', {media: ''});

  // G. Muat ulang: progres tetap ada
  await load();
  check('muat ulang: 5 modul tetap selesai', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 5);
  check('riwayat: 1 hasil tersimpan otomatis', (await ev("document.querySelectorAll('#hist .hrow').length")) === 1);
  check('muat ulang: nama tetap', (await ev("document.getElementById('nama').value")) === 'Tes QA');
  check('"Lihat hasil" aktif', await ev("!document.getElementById('goRes').disabled"));

  // H. Ulangi modul butuh 2 tap
  await click('#mods button[data-m="1"]');
  check('ulangi: tap pertama hanya minta konfirmasi', (await text('#mods button[data-m="1"]')) === 'Ketuk lagi untuk mengulang' && (await visible('home')));
  check('ulangi: jawaban belum terhapus', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 5);

  // I. Hapus semua
  await click('#askReset');
  check('hapus: muncul konfirmasi', await visible('confirmReset'));
  await click('#noReset');
  check('hapus: batal tidak menghapus apa-apa', (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 5);
  await click('#askReset'); await click('#doReset');
  check('hapus: semua modul kosong lagi', (await ev("[...document.querySelectorAll('#mods small')].slice(0,4).every(s=>s.textContent.includes('belum dimulai'))&&/Terbuka setelah 4 modul utama/.test(document.querySelectorAll('#mods small')[4].textContent)")));
  check('hapus: "Lihat hasil" mati lagi', await ev("document.getElementById('goRes').disabled"));
  check('mulai tes baru: nama tetap, hasil lama ada di riwayat', (await ev("document.getElementById('nama').value")) === 'Tes QA' && (await ev("document.querySelectorAll('#hist .hrow').length")) === 1);
  await click('#hist [data-hv="0"]');
  check('riwayat: lihat hasil lama dalam mode lihat', await waitFor("!document.getElementById('res').hidden&&!document.getElementById('viewBar').hidden&&/hasil tes/.test(document.getElementById('viewText').textContent)&&document.querySelector('#res h1').textContent.includes('INFP-T')", 3000));
  check('riwayat: jawaban aktif tetap kosong saat melihat riwayat', await ev("Object.keys(JSON.parse(localStorage.getItem('tesKepribadian.v1')).c).length===0"));
  await click('#viewMine');
  check('riwayat: kembali ke beranda tanpa mengubah apa pun', (await visible('home')) && (await ev("document.getElementById('goRes').disabled")));
  await click('#hist [data-hd="0"]');
  check('riwayat: hapus minta ketuk dua kali', (await text('#hist [data-hd="0"]')) === 'Ketuk lagi untuk hapus' && (await ev("document.querySelectorAll('#hist .hrow').length")) === 1);

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
  fs.writeFileSync(part, JSON.stringify(C.exportData('', C.canon({...C.emptyAns(), big5: answersFor(C, 'INTJ').big5}))));
  await setFile(part);
  check('hasil sebagian: judul "Hasil sementara" + Big Five', await waitFor("!document.getElementById('res').hidden&&document.querySelector('#res h1').textContent==='Hasil sementara'&&/Big Five/.test(document.getElementById('res').innerText)", 4000));
  // Kasus family beda: tipe dari fungsi ≠ family dari huruf
  const mixed = path.join(DL, 'campur.json');
  const mx = answersFor(C, 'INFP'); const tp = answersFor(C, 'INTP');
  fs.writeFileSync(mixed, JSON.stringify(C.exportData('', C.canon({inti: tp.inti, facet: tp.facet, big5: mx.big5, fungsi: mx.fungsi}))));
  await click('#resHome'); await setFile(mixed);
  await waitFor("!document.getElementById('res').hidden", 4000);
  check('family beda: ada penjelasan kenapa', await ev("/peluang terbesar ada di/.test(document.getElementById('res').innerText)"));
  check('family beda: hero jelasin huruf vs fungsi', await ev("/Dari huruf saja hasilnya INTP/.test(document.querySelector('#res .lead').textContent)"));
  await click('#resHome'); await setFile(part); await waitFor("!document.getElementById('res').hidden", 4000);
  check('hasil sebagian: nggak ada NaN', await ev("!/NaN|undefined|Infinity/.test(document.getElementById('res').innerText)"));
  await click('#dlCard');
  check('hasil sebagian: kartu PNG tetap bisa dibuat', await waitFor("(()=>{const i=document.getElementById('cardPrev');return !i.hidden&&i.naturalWidth===1080})()", 8000));

  // K2. File versi 1 (soal facet lama): beranda + pesan, facet perlu dijawab ulang
  const old = path.join(DL, 'lama.json'); const full = answersFor(C, 'INFP');
  const fc = C.canon(full), v2 = Object.fromEntries(Object.entries(C.LAYOUT_V2).map(([m, ids]) => [m, ids.map(raw => { const fl = raw[0] === '~', v = fc[fl ? raw.slice(1) : raw]; return C.valid(v) ? (fl ? 6 - v : v) : 0; })]));
  const oldData = {app: 'tes-kepribadian', v: 1, name: 'Lama', ans: {inti: v2.inti, facet: new Array(40).fill(3), big5: v2.big5, fungsi: v2.fungsi}};
  fs.writeFileSync(old, JSON.stringify(oldData)); const oldMissing = C.sanitizeImport(oldData).missing;
  await click('#resHome'); await setFile(old);
  check(`file versi 1: buka beranda dan beri tahu ${oldMissing} soal yang perlu dijawab`, await waitFor(`!document.getElementById('home').hidden&&/versi lama.* ${oldMissing} soal yang perlu kamu jawab lagi/.test(document.getElementById('fileMsg').textContent)`, 4000), await text('#fileMsg'));
  check('file versi 1: modul Facet terisi sebagian (15/45)', (await text('#mods .mod:nth-child(2) small')).includes('15/45 dijawab'), await text('#mods .mod:nth-child(2) small'));

  // K3. Catatan khusus dari file, termasuk teks berbahaya yang harus tampil sebagai teks
  const withNotes = path.join(DL, 'catatan.json');
  fs.writeFileSync(withNotes, JSON.stringify(C.exportData('Gama', C.canon(full), {summary: 'Ringkasan khusus <b>tebal</b>', notes: [{tag: 'Pola 1', title: 'Judul catatan', text: '<img src=x onerror="window.__xss=1">isi'}]})));
  await setFile(withNotes);
  await waitFor("!document.getElementById('res').hidden", 4000);
  check('catatan khusus: bagian "Temuan khusus" tampil', await ev("!!document.getElementById('catatan')&&/Judul catatan/.test(document.getElementById('catatan').innerText)"));
  check('catatan khusus: ringkasan dari file dipakai, ringkasan otomatis tetap ada', (await text('#sumText')).startsWith('Ringkasan khusus <b>tebal</b>') && /Ringkasan otomatis/.test(await text('#ringkasan')));
  check('catatan khusus: HTML tidak dijalankan', await ev("!document.querySelector('#res img:not(#cardPrev):not(#pcType):not(#pcMotif):not(#pcStamp)')&&!document.querySelector('#sumText b')&&!window.__xss"));
  await click('#dlJson');
  const nf = await waitFile('jawaban-peta-kepribadian-gama.json');
  check('catatan khusus ikut tersimpan di file jawaban', nf && JSON.parse(fs.readFileSync(nf, 'utf8')).notes?.[0]?.title === 'Judul catatan');

  // K4. Link hasil: dilihat tanpa menimpa jawaban sendiri
  if (jf) { await click('#resHome'); await setFile(jf); await waitFor("!document.getElementById('res').hidden", 4000); }
  const other = C.sanitizeImport(C.exportData('Teman', C.canon(answersFor(C, 'ESTJ', 'A')), {notes: [{title: 'Catatan teman', text: 'x'}]}));
  const goto = async url => { await cmd('Page.navigate', {url: 'about:blank'}); await sleep(100); const done = new Promise(r => listeners.push(function f(m) { if (m.sessionId === S && m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(f), 1); r(); } })); await cmd('Page.navigate', {url}); await done; await sleep(200); };
  await goto(BASE + '#h=' + C.encodeShare(other));
  check('link hasil: tampil mode lihat dengan banner', await waitFor("!document.getElementById('res').hidden&&!document.getElementById('viewBar').hidden&&/Teman/.test(document.getElementById('viewText').textContent)", 4000));
  check('link hasil: menampilkan hasil orang itu (ESTJ-A) dan catatannya', (await text('#res h1')).includes('ESTJ-A') && /Catatan teman/.test(await text('#catatan')));
  check('link hasil: jawaban di browser ini tidak berubah', await ev("JSON.parse(localStorage.getItem('tesKepribadian.v1')).name==='Tes QA'"));
  await click('#viewMine');
  check('link hasil: "Kerjakan tesmu sendiri" kembali ke beranda dengan data sendiri', (await visible('home')) && !(await ev('location.hash')) && (await ev("document.getElementById('nama').value")) === 'Tes QA' && (await ev("document.querySelectorAll('#mods .mod.ok').length")) === 5);
  await goto(BASE + '#h=' + C.encodeShare(other));
  await click('#viewSave');
  check('link hasil: simpan minta konfirmasi kalau browser sudah berisi jawaban', await visible('viewConfirm'));
  await click('#viewSaveYes');
  check('link hasil: setelah disimpan jadi data browser ini', await waitFor("document.getElementById('viewBar').hidden&&JSON.parse(localStorage.getItem('tesKepribadian.v1')).name==='Teman'&&!location.hash", 3000));
  check('riwayat: hasil kedua memunculkan tabel perbandingan', await ev("!!document.getElementById('riwayat')&&/ESTJ-A/.test(document.getElementById('riwayat').innerText)&&/INFP-T/.test(document.getElementById('riwayat').innerText)&&/berubah/.test(document.getElementById('riwayat').innerText)"));
  await goto(BASE + '#h=rusak123456');
  check('link hasil rusak: pesan, tidak crash', await waitFor("!document.getElementById('home').hidden&&/tidak valid/.test(document.getElementById('fileMsg').textContent)", 3000));
  if (jf) { await setFile(jf); await waitFor("!document.getElementById('res').hidden", 4000); }

  // L. Laptop + ganti tema
  if (jf) { await click('#resHome'); await setFile(jf); await waitFor("!document.getElementById('res').hidden", 4000); }
  await viewport(1280, 900, false);
  check('laptop: nggak ada scroll ke samping (hasil)', await noOverflow());
  await shot('06-hasil-laptop-gelap');
  const darkCell = await ev("document.querySelector('#ttHome .cell').style.background");
  const darkTop = await ev("document.querySelector('#ttRes .cell[data-rank=\"1\"]').style.background");
  await click('#res [data-theme-set="light"]');
  await sleep(150);
  check('tema terang: latar putih', (await ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(255, 255, 255)');
  check('tema terang: tombol di hasil & di atas sama-sama aktif', (await ev(`[...document.querySelectorAll('[data-theme-set="light"]')].every(b=>b.getAttribute('aria-pressed')==='true')`)));
  check('tema terang: warna peta beranda ikut ganti', (await ev("document.querySelector('#ttHome .cell').style.background")) !== darkCell);
  check('tema terang: warna tabel hasil ikut ganti', (await ev("document.querySelector('#ttRes .cell[data-rank=\"1\"]').style.background")) !== darkTop);
  await click('#dlCard');
  check('kartu PNG ikut tema terang', await waitFor(`(${px})==='255,255,255'`, 6000));
  await cmd('Emulation.setEmulatedMedia', {media: 'print'});
  check('cetak tema terang: latar terang dengan semburat tipe', await ev("(()=>{const m=getComputedStyle(document.body).backgroundColor.match(/\\d+/g).map(Number);return m.every(v=>v>240)&&document.getElementById('pageStyle').textContent.includes(typeSurf(document.querySelector('#res .code').textContent.slice(0,4),false).bg)})()"));
  const pdf2 = await cmd('Page.printToPDF', {printBackground: true});
  fs.writeFileSync(path.join(OUT, '05b-hasil-terang.pdf'), Buffer.from(pdf2.data, 'base64'));
  await cmd('Emulation.setEmulatedMedia', {media: ''});
  await shot('07-hasil-laptop-terang');
  await load();
  check('tema terang tetap setelah muat ulang', (await ev("document.documentElement.dataset.theme")) === 'light');
  check('laptop: peta di kanan judul', await ev("(()=>{const a=document.getElementById('ttHome').getBoundingClientRect(),b=document.querySelector('#home h1').getBoundingClientRect();return a.left>b.right-1&&a.top<b.bottom+200})()"));
  await shot('08-beranda-laptop-terang');
  await click('.topbar [data-theme-set="dark"]');
  check('balik ke tema gelap dari tombol atas', (await ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 16, 25)');

  check('nggak ada error JavaScript sama sekali', errors.length === 0, errors.join(' | '));
} catch (e) {
  check('tes jalan sampai selesai', false, e.stack);
} finally {
  ws.close(); chrome.kill('SIGKILL'); server.close();
  const fail = results.filter(r => !r.ok);
  console.log(`\n${results.length - fail.length}/${results.length} lulus. Screenshot & PDF di tests/artifacts/`);
  process.exitCode = fail.length ? 1 : 0;
}
