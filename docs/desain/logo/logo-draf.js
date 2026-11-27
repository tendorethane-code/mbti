// Draf logo "Peta Kepribadian". Semua SVG orisinal, dibuat kode, viewBox 0 0 64 64 (ikon persegi berujung bulat).
// Warna merek: indigo #3b2fc9, koral #e8492c; warna family: Analyst ungu, Diplomat koral, Sentinel teal, Explorer kuning.
(function (G) {
  const IND = '#3b2fc9', IND2 = '#6a5cff', COR = '#e8492c', COR2 = '#ff8a5c', NT = '#7f86e8', NF = '#f07a6a', SJ = '#2bb3a1', SP = '#f2b33d';
  const star4 = (cx, cy, r, f, s = .34) => `<path d="M${cx} ${cy - r}Q${cx + r * s} ${cy - r * s} ${cx + r} ${cy}Q${cx + r * s} ${cy + r * s} ${cx} ${cy + r}Q${cx - r * s} ${cy + r * s} ${cx - r} ${cy}Q${cx - r * s} ${cy - r * s} ${cx} ${cy - r}Z" fill="${f}"/>`;
  const tile = (id, inner, a = IND, b = COR) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#${id})"/>${inner}</svg>`;
  const L = {
    // A. Peta 4x4: 16 kotak = 16 tipe, satu kotak menjadi bintang = "kamu di peta"
    peta: {nama: 'A. Peta 16', ket: '16 kotak = 16 tipe; satu kotak jadi bintang: kamu di peta.',
      svg: () => tile('gA', (() => {let s = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {const x = 10 + c * 11.5, y = 10 + r * 11.5; if (r === 1 && c === 2) s += star4(x + 4.5, y + 4.5, 6.4, '#fff'); else s += `<rect x="${x}" y="${y}" width="9" height="9" rx="2.6" fill="#fff" opacity="${.32 + .1 * ((r + c) % 3)}"/>`} return s})())},
    // B. Kompas: 4 mata angin = 4 sumbu (E/I, S/N, T/F, J/P), tiap ujung warna family
    kompas: {nama: 'B. Kompas', ket: '4 arah = 4 sumbu kepribadian; tiap ujung satu warna family.',
      svg: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="gB" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2a2170"/><stop offset="1" stop-color="#140f3a"/></radialGradient></defs><rect width="64" height="64" rx="15" fill="url(#gB)"/>
        <circle cx="32" cy="32" r="22" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.6"/>
        <path d="M32 6L37 27L32 32L27 27Z" fill="${NT}"/><path d="M58 32L37 37L32 32L37 27Z" fill="${NF}"/><path d="M32 58L27 37L32 32L37 37Z" fill="${SJ}"/><path d="M6 32L27 27L32 32L27 37Z" fill="${SP}"/>
        <circle cx="32" cy="32" r="4.2" fill="#fff"/></svg>`},
    // C. Telur Nebula: telur yang menetas di aplikasi, kulit nebula, rasi kecil, satu retakan
    telur: {nama: 'C. Telur Nebula', ket: 'Telur yang menetas jadi karaktermu; kulit nebula dengan rasi kecil.',
      svg: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><radialGradient id="gC" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#b9a8ff"/><stop offset=".45" stop-color="${IND2}"/><stop offset="1" stop-color="#2a1d8f"/></radialGradient><radialGradient id="gC2" cx=".7" cy=".75" r=".5"><stop offset="0" stop-color="${COR2}" stop-opacity=".85"/><stop offset="1" stop-color="${COR2}" stop-opacity="0"/></radialGradient></defs>
        <rect width="64" height="64" rx="15" fill="#120d33"/>
        <path d="M32 7C44 7 52 25 52 38C52 50 43 58 32 58C21 58 12 50 12 38C12 25 20 7 32 7Z" fill="url(#gC)"/><path d="M32 7C44 7 52 25 52 38C52 50 43 58 32 58C21 58 12 50 12 38C12 25 20 7 32 7Z" fill="url(#gC2)"/>
        <path d="M22 30L27 34L33 31L38 36" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity=".75" stroke-linecap="round" stroke-linejoin="round"/>
        ${star4(25, 21, 3.6, '#fff')}${star4(40, 44, 2.6, '#fff')}<circle cx="21" cy="44" r="1.2" fill="#fff" opacity=".8"/><circle cx="43" cy="24" r="1" fill="#fff" opacity=".7"/>
        <path d="M30 20C34 22 32 26 28 27" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/></svg>`},
    // D. Pin Peta: penanda lokasi yang kepalanya dibagi 4 family, bintang di tengah
    pin: {nama: 'D. Pin Peta', ket: 'Penanda "kamu di sini"; kepala pin = 4 family, bintang di tengah.',
      svg: () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#f4f2ff"/>
        <path d="M32 58C32 58 13 38 13 26A19 19 0 0 1 51 26C51 38 32 58 32 58Z" fill="${IND}"/>
        <path d="M32 13A13 13 0 0 1 45 26H32Z" fill="${NT}"/><path d="M45 26A13 13 0 0 1 32 39V26Z" fill="${NF}"/><path d="M32 39A13 13 0 0 1 19 26H32Z" fill="${SJ}"/><path d="M19 26A13 13 0 0 1 32 13V26Z" fill="${SP}"/>
        ${star4(32, 26, 6.5, '#fff', .3)}</svg>`},
    // E. Rasi: empat bintang (4 huruf) tersambung jadi layang-layang, satu paling terang
    rasi: {nama: 'E. Rasi Empat', ket: '4 bintang = 4 huruf tipe, tersambung jadi rasi; satu paling terang.',
      svg: () => tile('gE', `<path d="M32 12L49 30L32 52L16 30Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 30L49 30" stroke="#fff" stroke-opacity=".3" stroke-width="1.4"/>
        ${star4(32, 12, 6, '#fff')}<circle cx="49" cy="30" r="3.4" fill="#fff"/><circle cx="32" cy="52" r="3" fill="#fff" opacity=".9"/><circle cx="16" cy="30" r="3.4" fill="#fff"/>`, '#2a1f9e', COR)},
    // F. Roh: kepala karakter Roh Peta yang netral (bukan tipe tertentu), dua mata dan semburat pipi
    roh: {nama: 'F. Si Roh', ket: 'Karakter Roh Peta yang netral (bukan tipe tertentu): ramah, mudah diingat.',
      svg: () => tile('gF', `<path d="M32 9C41 18 52 27 52 39C52 50 43 57 32 57C21 57 12 50 12 39C12 27 23 18 32 9Z" fill="#fff"/>
        <ellipse cx="25" cy="38" rx="3.2" ry="4.3" fill="#1a1440"/><ellipse cx="39" cy="38" rx="3.2" ry="4.3" fill="#1a1440"/><circle cx="26.2" cy="36.4" r="1.2" fill="#fff"/><circle cx="40.2" cy="36.4" r="1.2" fill="#fff"/>
        <ellipse cx="20" cy="45" rx="3.4" ry="2" fill="${COR2}" opacity=".55"/><ellipse cx="44" cy="45" rx="3.4" ry="2" fill="${COR2}" opacity=".55"/><path d="M29 46Q32 49 35 46" fill="none" stroke="#1a1440" stroke-width="1.8" stroke-linecap="round"/>
        ${star4(32, 20, 3.6, IND)}`)}
  };
  G.LOGO_DRAF = L;
})(typeof window !== 'undefined' ? window : globalThis);
