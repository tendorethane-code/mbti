// Penjelasan istilah di halaman hasil: cognitive functions, facet Step II, Big Five.
// Bahasa sehari-hari, ditulis sendiri (bukan salinan deskripsi resmi). Dipakai index.html; dites di tests/core.test.mjs.

// ---------- Cognitive functions (teori Jung/MBTI; lemah secara ilmiah, dipakai sebagai bahasa refleksi) ----------
const FN_INFO = {
  Fi: {nama: 'Kompas Nilai', ikon: '🧭', lengkap: 'Introverted Feeling',
    arti: 'Menimbang dari dalam: apakah ini selaras dengan nilai dan perasaanku sendiri?',
    contoh: 'Menolak tawaran yang menguntungkan karena rasanya "bukan aku".',
    kuat: 'Kamu tahu apa yang penting bagimu dan sulit dipaksa melanggarnya.',
    lemah: 'Saat stres, perasaan sendiri bisa terasa membingungkan atau meledak tiba-tiba.'},
  Fe: {nama: 'Penjaga Suasana', ikon: '🤝', lengkap: 'Extraverted Feeling',
    arti: 'Membaca dan menjaga perasaan orang di sekitar; keputusan mempertimbangkan keharmonisan bersama.',
    contoh: 'Sadar ada teman yang diam saja di tongkrongan, lalu mengajaknya bicara.',
    kuat: 'Kamu cepat menangkap suasana dan pandai membuat orang merasa diterima.',
    lemah: 'Saat stres, kamu bisa merasa tidak ada yang mengerti, atau malah canggung secara sosial.'},
  Ti: {nama: 'Arsitek Logika', ikon: '🧩', lengkap: 'Introverted Thinking',
    arti: 'Membongkar sesuatu sampai paham cara kerjanya; mencari penjelasan yang konsisten menurut logikamu sendiri.',
    contoh: 'Tidak puas dengan "pokoknya begitu"; harus tahu kenapa.',
    kuat: 'Kamu teliti menguji alasan dan cepat menemukan bagian yang tidak masuk akal.',
    lemah: 'Saat stres, kamu bisa terlalu keras mengkritik, atau keputusan jadi asal-asalan.'},
  Te: {nama: 'Manajer Efisiensi', ikon: '📋', lengkap: 'Extraverted Thinking',
    arti: 'Mengatur hal di luar diri supaya efektif: tujuan, data, langkah, dan hasil yang bisa diukur.',
    contoh: 'Langsung membuat daftar tugas dan pembagian kerja saat proyek kelompok dimulai.',
    kuat: 'Kamu pandai mengubah rencana jadi tindakan dan menyelesaikannya.',
    lemah: 'Saat stres, kamu bisa jadi kaku, memaksa, atau justru kehilangan arah.'},
  Ni: {nama: 'Penangkap Firasat', ikon: '🔮', lengkap: 'Introverted Intuition',
    arti: 'Merangkai pola diam-diam sampai muncul satu gambaran besar atau firasat tentang arah sesuatu.',
    contoh: 'Tiba-tiba "tahu" bagaimana sebuah situasi akan berakhir, walau sulit menjelaskan alasannya.',
    kuat: 'Kamu melihat ke depan dan menangkap makna di balik kejadian.',
    lemah: 'Saat stres, kamu bisa curiga berlebihan atau terpaku pada skenario terburuk.'},
  Ne: {nama: 'Penjelajah Kemungkinan', ikon: '💡', lengkap: 'Extraverted Intuition',
    arti: 'Melompat dari satu ide ke ide lain, melihat banyak kemungkinan dan hubungan baru.',
    contoh: 'Satu obrolan ringan berubah jadi sepuluh ide proyek.',
    kuat: 'Kamu kreatif, cepat menemukan alternatif, dan senang hal baru.',
    lemah: 'Saat stres, semua kemungkinan bisa terasa menakutkan, atau kamu sulit memilih satu.'},
  Si: {nama: 'Penjaga Arsip', ikon: '📚', lengkap: 'Introverted Sensing',
    arti: 'Membandingkan yang sekarang dengan pengalaman dan kebiasaan yang sudah terbukti; peka pada detail dan kondisi tubuh.',
    contoh: 'Ingat persis bagaimana sesuatu biasanya dilakukan, dan nyaman dengan rutinitas yang jelas.',
    kuat: 'Kamu teliti, bisa diandalkan, dan belajar dari pengalaman.',
    lemah: 'Saat stres, kamu bisa terpaku pada detail kecil atau keluhan fisik.'},
  Se: {nama: 'Pemburu Momen', ikon: '⚡', lengkap: 'Extraverted Sensing',
    arti: 'Hadir penuh di saat ini: menangkap apa yang terlihat, terdengar, dan terasa, lalu bereaksi cepat.',
    contoh: 'Paling hidup saat ada aksi langsung, dan cepat menyadari perubahan kecil di sekitar.',
    kuat: 'Kamu tanggap, praktis, dan menikmati pengalaman nyata.',
    lemah: 'Saat stres, kamu bisa mencari pelarian lewat kesenangan sesaat atau bertindak gegabah.'}
};
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
  N: {ikon: '🌊', arti: 'Seberapa mudah emosi negatif muncul: cemas, kesal, sedih.', tinggi: 'Kamu lebih peka terhadap stres dan perasaanmu cepat bergejolak.', rendah: 'Kamu cenderung tenang dan tidak mudah goyah.'},
  O: {ikon: '🎨', arti: 'Keterbukaan pada ide, seni, perasaan, dan pengalaman baru.', tinggi: 'Kamu penasaran, imajinatif, dan suka hal baru.', rendah: 'Kamu lebih suka yang sudah dikenal dan praktis.'},
  C: {ikon: '🗂️', arti: 'Keteraturan, tanggung jawab, dan disiplin mengejar tujuan.', tinggi: 'Kamu terencana, rapi, dan bisa diandalkan.', rendah: 'Kamu lebih santai dan mengikuti alur.'},
  A: {ikon: '🫶', arti: 'Kehangatan dan kerja sama: percaya, jujur, suka menolong.', tinggi: 'Kamu ramah, mudah percaya, dan suka membantu.', rendah: 'Kamu lebih kritis, lugas, dan mendahulukan kepentingan sendiri bila perlu.'},
  E: {ikon: '🎉', arti: 'Energi sosial dan semangat: hangat, suka keramaian, aktif, ceria.', tinggi: 'Kamu mudah bergaul dan bersemangat di tengah orang.', rendah: 'Kamu lebih tenang dan menikmati suasana yang sepi.'}
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
