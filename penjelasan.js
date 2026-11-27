// Penjelasan istilah di halaman hasil: cognitive functions, facet Step II, Big Five.
// Bahasa sehari-hari, ditulis sendiri (bukan salinan deskripsi resmi). Dipakai index.html; dites di tests/core.test.mjs.

// ---------- Cognitive functions (teori Jung/MBTI; lemah secara ilmiah, dipakai sebagai bahasa refleksi) ----------
const FN_INFO = {
  Fi: {lengkap: 'Introverted Feeling',
    arti: 'Menimbang dari dalam: apakah ini selaras dengan nilai dan perasaanku sendiri?',
    contoh: 'Menolak tawaran yang menguntungkan karena rasanya "bukan aku".',
    kuat: 'Kamu tahu apa yang penting bagimu dan sulit dipaksa melanggarnya.',
    lemah: 'Saat stres, perasaan sendiri bisa terasa membingungkan atau meledak tiba-tiba.'},
  Fe: {lengkap: 'Extraverted Feeling',
    arti: 'Membaca dan menjaga perasaan orang di sekitar; keputusan mempertimbangkan keharmonisan bersama.',
    contoh: 'Sadar ada teman yang diam saja di tongkrongan, lalu mengajaknya bicara.',
    kuat: 'Kamu cepat menangkap suasana dan pandai membuat orang merasa diterima.',
    lemah: 'Saat stres, kamu bisa merasa tidak ada yang mengerti, atau malah canggung secara sosial.'},
  Ti: {lengkap: 'Introverted Thinking',
    arti: 'Membongkar sesuatu sampai paham cara kerjanya; mencari penjelasan yang konsisten menurut logikamu sendiri.',
    contoh: 'Tidak puas dengan "pokoknya begitu"; harus tahu kenapa.',
    kuat: 'Kamu teliti menguji alasan dan cepat menemukan bagian yang tidak masuk akal.',
    lemah: 'Saat stres, kamu bisa terlalu keras mengkritik, atau keputusan jadi asal-asalan.'},
  Te: {lengkap: 'Extraverted Thinking',
    arti: 'Mengatur hal di luar diri supaya efektif: tujuan, data, langkah, dan hasil yang bisa diukur.',
    contoh: 'Langsung membuat daftar tugas dan pembagian kerja saat proyek kelompok dimulai.',
    kuat: 'Kamu pandai mengubah rencana jadi tindakan dan menyelesaikannya.',
    lemah: 'Saat stres, kamu bisa jadi kaku, memaksa, atau justru kehilangan arah.'},
  Ni: {lengkap: 'Introverted Intuition',
    arti: 'Merangkai pola diam-diam sampai muncul satu gambaran besar atau firasat tentang arah sesuatu.',
    contoh: 'Tiba-tiba "tahu" bagaimana sebuah situasi akan berakhir, walau sulit menjelaskan alasannya.',
    kuat: 'Kamu melihat ke depan dan menangkap makna di balik kejadian.',
    lemah: 'Saat stres, kamu bisa curiga berlebihan atau terpaku pada skenario terburuk.'},
  Ne: {lengkap: 'Extraverted Intuition',
    arti: 'Melompat dari satu ide ke ide lain, melihat banyak kemungkinan dan hubungan baru.',
    contoh: 'Satu obrolan ringan berubah jadi sepuluh ide proyek.',
    kuat: 'Kamu kreatif, cepat menemukan alternatif, dan senang hal baru.',
    lemah: 'Saat stres, semua kemungkinan bisa terasa menakutkan, atau kamu sulit memilih satu.'},
  Si: {lengkap: 'Introverted Sensing',
    arti: 'Membandingkan yang sekarang dengan pengalaman dan kebiasaan yang sudah terbukti; peka pada detail dan kondisi tubuh.',
    contoh: 'Ingat persis bagaimana sesuatu biasanya dilakukan, dan nyaman dengan rutinitas yang jelas.',
    kuat: 'Kamu teliti, bisa diandalkan, dan belajar dari pengalaman.',
    lemah: 'Saat stres, kamu bisa terpaku pada detail kecil atau keluhan fisik.'},
  Se: {lengkap: 'Extraverted Sensing',
    arti: 'Hadir penuh di saat ini: menangkap apa yang terlihat, terdengar, dan terasa, lalu bereaksi cepat.',
    contoh: 'Paling hidup saat ada aksi langsung, dan cepat menyadari perubahan kecil di sekitar.',
    kuat: 'Kamu tanggap, praktis, dan menikmati pengalaman nyata.',
    lemah: 'Saat stres, kamu bisa mencari pelarian lewat kesenangan sesaat atau bertindak gegabah.'}
};
// ---------- Ikon garis buatan sendiri (24×24, warna mengikuti teks/aksen) ----------
// Sentuhan bintang kecil (kelas "f", terisi) supaya sebahasa dengan rasi dan gerhana di web.
const IKON = {
  Fi: '<circle cx="12" cy="12" r="9"/><path d="M12 5L14.2 12H9.8Z" class="f"/><path d="M9.8 12L12 19L14.2 12"/><circle cx="12" cy="12" r="1.2" class="f"/>',
  Fe: '<circle cx="7.5" cy="8.5" r="2.6"/><circle cx="16.5" cy="8.5" r="2.6"/><path d="M3 19.5C3 15.8 5 13.8 7.5 13.8C9.4 13.8 10.8 14.8 11.5 16.4M21 19.5C21 15.8 19 13.8 16.5 13.8C14.6 13.8 13.2 14.8 12.5 16.4"/><path d="M12 2.6l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" class="f"/><path d="M12 20.5C10.2 19.3 9.3 18.3 9.3 17.2C9.3 16.3 10 15.7 10.8 15.7C11.3 15.7 11.7 16 12 16.4C12.3 16 12.7 15.7 13.2 15.7C14 15.7 14.7 16.3 14.7 17.2C14.7 18.3 13.8 19.3 12 20.5Z" class="f"/>',
  Ti: '<path d="M12 3L19.8 7.5V16.5L12 21L4.2 16.5V7.5Z"/><path d="M12 12V21M12 12L4.2 7.5M12 12L19.8 7.5"/><circle cx="12" cy="12" r="1.6" class="f"/>',
  Te: '<path d="M5 20V15M10 20V11M15 20V8"/><path d="M4 20H20"/><path d="M14 4H20V10M20 4L13 11"/>',
  Ni: '<path d="M2.5 12C5.5 6.5 18.5 6.5 21.5 12C18.5 17.5 5.5 17.5 2.5 12Z"/><path d="M12 8.6l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z" class="f"/>',
  Ne: '<circle cx="5" cy="12" r="2"/><path d="M7 12H11M11 12C13 12 13 6 17 6M11 12H16.5M11 12C13 12 13 18 17 18"/><circle cx="18.5" cy="6" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/><circle cx="18.5" cy="18" r="1.6"/><path d="M21 2.6l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" class="f"/>',
  Si: '<path d="M12 3.5L20 7.5L12 11.5L4 7.5Z"/><path d="M4 12L12 16L20 12"/><path d="M4 16.5L12 20.5L20 16.5"/>',
  Se: '<circle cx="12" cy="12" r="2.6" class="f"/><path d="M12 2.5V6M12 18V21.5M2.5 12H6M18 12H21.5M5.3 5.3L7.8 7.8M16.2 16.2L18.7 18.7M18.7 5.3L16.2 7.8M7.8 16.2L5.3 18.7"/>',
  N: '<path d="M3 9C5 6.5 7 6.5 9 9S13 11.5 15 9S19 6.5 21 9"/><path d="M3 15C5 12.5 7 12.5 9 15S13 17.5 15 15S19 12.5 21 15"/>',
  O: '<path d="M12 4L19 18H5Z"/><path d="M1.8 13.4L8.2 11.8"/><path d="M15.9 11.8L22 8.8M16.6 13.3L22.2 13.6M17.3 14.7L21.8 18.2"/>',
  C: '<path d="M4 6.5L5.6 8L8.4 5M4 12.5L5.6 14L8.4 11M4 18.5L5.6 20L8.4 17"/><path d="M11.5 6.5H20M11.5 12.5H20M11.5 18.5H17"/>',
  A: '<path d="M12 20C5.5 15.5 3 12 3 8.8C3 6.2 5 4.5 7.3 4.5C9.3 4.5 10.9 5.7 12 7.4C13.1 5.7 14.7 4.5 16.7 4.5C19 4.5 21 6.2 21 8.8C21 12 18.5 15.5 12 20Z"/><path d="M8 9.5Q9 8 10.5 8.3" />',
  E: '<path d="M3 5.5H14A1.5 1.5 0 0 1 15.5 7V12.5A1.5 1.5 0 0 1 14 14H8L4.5 17V14H3A1.5 1.5 0 0 1 1.5 12.5V7A1.5 1.5 0 0 1 3 5.5Z"/><path d="M17.5 9H21A1.5 1.5 0 0 1 22.5 10.5V16A1.5 1.5 0 0 1 21 17.5H20V20.5L16.5 17.5H11A1.5 1.5 0 0 1 9.5 16V16"/>'
};
const ikon = k => IKON[k] ? `<svg class="ik" viewBox="0 0 24 24" aria-hidden="true">${IKON[k]}</svg>` : '';

// Posisi dalam urutan fungsi, dengan perumpamaan peran di "tim".
const POS_INFO = [
  {pos: 'Dominan', peran: 'Kapten', arti: 'Fungsi yang paling sering dan paling nyaman kamu pakai. Cara utama kamu melihat dunia.'},
  {pos: 'Auxiliary', peran: 'Co-pilot', arti: 'Pendukung yang menyeimbangkan kapten. Arahnya berlawanan: kalau kapten ke dalam, co-pilot ke luar, dan sebaliknya.'},
  {pos: 'Tertiary', peran: 'Si Bungsu', arti: 'Berkembang belakangan. Muncul saat kamu santai atau sedang bermain.'},
  {pos: 'Inferior', peran: 'Titik Buta', arti: 'Paling jarang dipakai dan paling melelahkan. Sering muncul dengan cara canggung saat kamu stres.'}
];
const IE_INFO = {i: 'Fungsi i (introvert) mengolah di dalam kepala: menimbang, menyimpan, menyusun.', e: 'Fungsi e (ekstravert) bekerja langsung dengan dunia luar: orang, benda, ide yang sedang dibicarakan.'};

// ---------- Facet Step II: arti tiap kutub (urutan sama dengan FACETS di data.js) ----------
const FACET_INFO = {
  EI: [['Memulai kenalan dan obrolan lebih dulu', 'Menunggu didekati; nyaman setelah dikenalkan'],
    ['Mudah menunjukkan perasaan dan minat', 'Menyimpan perasaan; berbagi ke orang tertentu saja'],
    ['Suka lingkar pertemanan yang luas', 'Lebih suka sedikit hubungan yang dalam'],
    ['Mengenal dunia lewat melakukan dan bicara', 'Mengenal dunia lewat membaca, mengamati, dan merenung'],
    ['Bersemangat dan mudah menghidupkan suasana', 'Tenang; energi disimpan untuk hal yang penting']],
  SN: [['Berpegang pada fakta yang bisa dicek', 'Membaca makna dan arti di balik fakta'],
    ['Mengutamakan yang masuk akal dan bisa dijalankan', 'Menikmati ide dan kemungkinan baru'],
    ['Mencari kegunaan langsung', 'Tertarik pada konsep dan teori'],
    ['Percaya pada pengalaman langsung', 'Ingin paham kerangka dan teorinya dulu'],
    ['Menghargai cara yang sudah terbukti', 'Suka cara baru dan berbeda']],
  TF: [['Memutuskan lewat analisis sebab-akibat', 'Memutuskan lewat nilai dan dampaknya ke orang'],
    ['Mengutamakan aturan yang adil untuk semua', 'Mempertimbangkan keadaan tiap orang'],
    ['Suka mempertanyakan dan menguji pendapat', 'Mencari titik temu dan menjaga suasana'],
    ['Cepat melihat kekurangan untuk diperbaiki', 'Cenderung menerima dan memberi pujian'],
    ['Tegas mengejar target walau tidak populer', 'Lembut; mendahulukan hubungan']],
  JP: [['Suka struktur dan sistem yang jelas', 'Santai; mengikuti alur'],
    ['Merencanakan jauh hari', 'Membiarkan pilihan tetap terbuka'],
    ['Mulai lebih awal dan mencicil', 'Paling produktif saat tenggat sudah dekat'],
    ['Nyaman dengan jadwal rutin', 'Lebih suka spontan'],
    ['Langkah demi langkah sesuai rencana', 'Mulai dulu, rencananya menyusul']]
};

// ---------- Big Five ----------
const B5_INFO = {
  N: {arti: 'Seberapa mudah emosi negatif muncul: cemas, kesal, sedih.', tinggi: 'Kamu lebih peka terhadap stres dan perasaanmu cepat bergejolak.', rendah: 'Kamu cenderung tenang dan tidak mudah goyah.'},
  O: {arti: 'Keterbukaan pada ide, seni, perasaan, dan pengalaman baru.', tinggi: 'Kamu penasaran, imajinatif, dan suka hal baru.', rendah: 'Kamu lebih suka yang sudah dikenal dan praktis.'},
  C: {arti: 'Keteraturan, tanggung jawab, dan disiplin mengejar tujuan.', tinggi: 'Kamu terencana, rapi, dan bisa diandalkan.', rendah: 'Kamu lebih santai dan mengikuti alur.'},
  A: {arti: 'Kehangatan dan kerja sama: percaya, jujur, suka menolong.', tinggi: 'Kamu ramah, mudah percaya, dan suka membantu.', rendah: 'Kamu lebih kritis, lugas, dan mendahulukan kepentingan sendiri bila perlu.'},
  E: {arti: 'Energi sosial dan semangat: hangat, suka keramaian, aktif, ceria.', tinggi: 'Kamu mudah bergaul dan bersemangat di tengah orang.', rendah: 'Kamu lebih tenang dan menikmati suasana yang sepi.'}
};
// Arti tiap facet Big Five (urutan sama dengan B5 di data.js).
const B5F_INFO = {
  N: ['Mudah khawatir dan tegang', 'Cepat kesal atau frustrasi', 'Mudah sedih dan kecewa pada diri sendiri', 'Malu atau kikuk di depan orang', 'Sulit menahan keinginan sesaat (ngemil, belanja)', 'Sulit menghadapi tekanan; mudah panik'],
  O: ['Imajinasi dan suka melamun', 'Menikmati seni, musik, dan keindahan', 'Menyadari dan menghargai emosi sendiri', 'Suka mencoba hal baru dan variasi', 'Rasa ingin tahu; suka memikirkan ide', 'Terbuka menimbang ulang nilai dan aturan'],
  C: ['Yakin mampu menyelesaikan tugas', 'Rapi dan terorganisir', 'Memegang janji dan aturan', 'Kerja keras mengejar prestasi', 'Mampu memulai dan menyelesaikan walau bosan', 'Berpikir dulu sebelum bertindak'],
  A: ['Berprasangka baik pada orang', 'Lurus; tidak memanipulasi', 'Senang menolong', 'Menghindari konflik; mudah memaafkan', 'Tidak menonjolkan diri', 'Mudah iba pada yang kesusahan'],
  E: ['Ramah dan mudah akrab', 'Senang berada di tengah banyak orang', 'Berani mengambil peran dan bicara', 'Hidup cepat dan sibuk', 'Suka keseruan dan tantangan', 'Mudah gembira dan optimis']
};
// Tingkat skor 1–5.
const lvlB5 = v => v >= 3.6 ? 'tinggi' : v <= 2.4 ? 'rendah' : 'sedang';
