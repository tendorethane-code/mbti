# Catatan lanjutan (untuk sesi berikutnya)

Dokumen ini merangkum keadaan proyek dan keputusan yang sudah diambil bersama pemilik proyek, supaya sesi baru bisa melanjutkan tanpa mengulang. Baca seluruhnya sebelum mulai.

## Cara kerja dengan pemilik proyek
- Bahasa santai, tapi jujur dan kritis. Pemilik ingin mitra yang menantang ide, bukan yang selalu setuju. Sebutkan asumsi, risiko, dan bias, termasuk ketika hasil tesnya sendiri yang dipertanyakan.
- Sebelum menafsirkan jawaban yang ambigu, tetapkan aturan dulu dan umumkan, jangan mengubah aturan setelah melihat hasil.
- Jangan mengisi jawaban yang tidak ada buktinya.
- **Jangan merge PR apa pun tanpa kata "merge" dari pemilik.** Push ke branch PR boleh. Pemilik mencoba perubahan di HP lewat link pratinjau (lihat "Pratinjau di HP").
- Pemilik suka diberi contoh visual (screenshot/gambar) sebelum memutuskan, dan sering memberi masukan lewat screenshot yang dicoret.
- Untuk desain: tunjukkan beberapa draf, simpan semua draf ke `docs/desain/` (pemilik ingin semuanya disimpan), baru pasang yang dipilih.
- Situs live = `main` di GitHub Pages (`https://tendorethane-code.github.io/mbti/`).

## Status (per 27 Nov 2026)
Rilis **2026-11-27** sudah di-merge ke `main` (squash, urutan #1 → #3 → #5 → #2 → #4). Branch PR lama (`claude/kuis-seru`, `claude/karakter`, `claude/pendalaman-fungsi`, `claude/penjelasan`) harus dihapus karena riwayatnya memuat data pribadi yang sudah dihapus dari file; sesi Claude tidak bisa menghapus branch (proxy menolak), jadi pemilik menghapusnya di GitHub (Code → Branches). `claude/hopeful-dijkstra-5g5kvh` dimulai ulang dari `main` untuk PR #6. Isi rilis: lihat `CHANGELOG.md`. Sebelum merge sudah lewat cek rilis lengkap pada gabungan kelima PR (51 unit, 156 E2E); pemilik mengecek di HP setelah deploy.

| PR | Branch | Base | Isi |
|---|---|---|---|
| #6 | (sudah di-merge, rilis kedua 2026-11-27) | `main` | Momen terungkap + suara/musik (Ballad D minor) + mode developer `#dev`. Draf: `docs/desain/pratinjau-terungkap.html`, `docs/desain/musik-terungkap-draf.js`, `docs/desain/musik-soal-draf.js`. |
| #7 | `claude/hopeful-dijkstra-5g5kvh` | `main` | Suara adaptif untuk HP lemah + diagnostik di mode developer (masukan pemilik: suara putus-putus di HP-nya). |

### Yang sedang ditunggu / berikutnya (per 27 Nov 2026 malam)
1. **PR #7 (terbuka)**: suara lancar di HP lemah. Pemilik mencoba versi suara adaptif: animasi buka lancar, tapi ketukan telur agak patah dan suara masih hilang-muncul ("kualitas tidak boleh turun"). Diukur: sintesis musik langsung 40% rata-rata / 84% puncak satu inti desktop (ringan ~50%), efek suara 4–7%. Solusi: musik diputar dari rekaman render kualitas penuh (`audio/musik-terungkap.mp3`, `tools/render-musik.mjs`), sintesis langsung jadi cadangan; persiapan suara saat senggang; telur diperbarui di tempat. Menunggu pemilik mencoba lagi di HP (link githack + `#dev`), idealnya dengan screenshot baris diagnostik (harus tertulis "musik rekaman") dan merek/tipe HP. Merge hanya setelah pemilik bilang "merge".
2. **Logo: pemilik memilih E "Rasi Empat"** (`docs/desain/logo/logo-draf.js`, kunci `rasi`): 4 bintang = 4 huruf tipe, tersambung jadi layang-layang, satu paling terang, di atas gradien indigo→koral. **Belum dipasang.** Rencana pemasangan: favicon (ganti SVG data-URI di `<link rel="icon">`), `apple-touch-icon` (PNG 180 px), tanda merek di bilah atas (`.brand:before`, sekarang kotak gradien), lalu tanyakan apakah juga di kartu PNG dan sampul PDF. Cek ulang keterbacaan di 16 px.
3. Pemilik belum menghapus 4 branch lama di GitHub (lihat paragraf di atas).

Keputusan pemilik yang sudah final: musik momen terungkap **Ballad D minor** (gaya `manis`, apa adanya, tanpa struktur "naik terus"); layar soal **tanpa musik**; efek suara dipertahankan; mode developer `#dev` dipakai untuk mengecek semua tipe.

Cara merge yang dipakai untuk PR bertumpuk: sebelum merge, gabungkan branch dasarnya ke branch PR (`git merge`, bukan rebase/force-push); setelah induknya di-squash, ganti base ke `main` lalu gabungkan `main` ke branch PR dan selesaikan konflik ("ambil dua-duanya"). Bandingkan tree akhir dengan gabungan yang sudah dites.

**Tambahan baru dari pemilik**: tanya dulu masuk ke PR mana. Aturan praktis: perbaikan untuk rilis utama ke #1; hal yang berkaitan dengan Pendalaman ke #2; layar soal ke #3; fitur baru yang besar ke branch/PR baru dari branch #1.

## Pratinjau di HP
Pemilik mencoba lewat raw.githack, dikunci ke commit supaya tidak kena cache:
`https://raw.githack.com/tendorethane-code/mbti/<SHA commit>/index.html`
Selalu berikan link dengan SHA terbaru setelah push. Data di raw.githack terpisah dari situs live (beda alamat), jadi uji upgrade data lama baru bisa setelah merge.

## Keadaan sekarang (`main`; tes: 51 unit, 156 E2E sebelum #6)
- 189 soal di 4 modul utama + Pendalaman adaptif (`DEEP` di `data.js`, aturan `PROBE_RULES` di `core.js`). Bahasa "kamu"/"saya", tanpa perkiraan waktu. Soal sudah diaudit dan dicocokkan dengan IPIP-NEO-120.
- File jawaban v3 per id soal; v1/v2 dibaca lewat `legacy.js`. Data browser versi lama dimigrasi otomatis, dan beranda memberi tahu berapa soal yang perlu dijawab lagi.
- **Hasil web** (alur cerita, sama dengan PDF): hero (tipe bergradien, hook "yang paling khas", 3 tipe teratas, kotak **"Kenapa X, bukan Y?"** dari `typeWhy()` kalau huruf dan urutan fungsi menunjuk tipe berbeda atau selisih < 2 poin, tombol Simpan & bagikan) → Bab 1 satu kalimat + peta → Bab 2 kekuatan → Bab 3 tiga temuan paling khas (`storyFindings`) → Bab 4 keseharian → Bab 5 yang perlu dijaga + orang terdekat → penutup → "Angka di balik hasilmu" → "Seberapa bisa dipegang".
- **Navigasi**: bilah atas satu baris (logo = ke beranda, tema ikon ☾/☀, tombol Riwayat berangka), sembunyi saat menggulir ke bawah. **Riwayat** dan **Simpan & bagikan** berupa popup (panel bawah di HP, jendela di desktop; `openSheet`/`closeSheets`, Esc, klik latar). Di hasil ada dok kaca kecil (Beranda, Ke atas, Bagikan) yang muncul hanya saat menggulir ke atas dan setelah tombol atas lewat.
- **PDF**: sampul dengan motif khas tiap tipe (`drawMotif`) + cap family (`drawStamp`) + tanggal di bawah; latar bersemburat warna tipe (`typeSurf`); Bab 1 memuat kotak "Kenapa…"; bagian angka tidak terbelah. Gambar sampul dipasang sebagai `<img>` PNG, **bukan canvas** (Chrome HP mencetak canvas dengan latar putih). Motif sampul digambar saat browser senggang dan cadangan sinkron saat `beforeprint`.
- **Motif**: 16 motif per tipe dalam bahasa family (NT kisi, NF riak, SJ garis rapi, SP diagonal). Pemilik ingin motif ramai dan bercampur dengan judul (halus, bertekstur), versi besar ENTP/ISFJ/ESFJ/ENTJ dipertahankan. **INFP harus selalu paling kaya**; yang dipasang: H+ (gerhana dengan korona yang tumbuh jadi taman, bunga tersembunyi, manik cahaya, kelopak cahaya), dengan versi terang khusus.
- **Warna**: palet per tipe (`TYPE_PAL`, `typePal()`) dipakai di seluruh hasil, kartu, dan PDF.
- **Kartu PNG** 1080×1920, 8 gaya: Karakter (bawaan, karakter besar + balon "INI AKU"), Poster (dengan motif tipe dan maskot mini), Takaran, Mozaik, Peta, Editorial, Aura, Koleksi. Ditolak: Konstelasi, Jurnal, Paspor, Piringan (arsip di `docs/desain/arsip/`).
- **Performa**: kartu dan motif digambar berskala, bertahap (idle/IntersectionObserver), dan di-cache. Script memakai `?v=` (ganti angkanya setiap rilis; lihat README bagian Rilis).

## Arsip desain (`docs/desain/`)
13 draf motif INFP (A Malam Danau, B Taman, B+, B++, C Bangau, D Kosmos, E Jendela, F Taman Kosmos, G Lubang Hitam, H Gerhana, H+ dipakai, H++ Pusaran, H3 Pita Sutra) dengan `pratinjau-infp.html`, kartu yang ditolak, dan motif versi lama. Pemilik tidak suka elemen menjuntai (wisteria) dan planet bercincin ("agak alay"); suka sulur mengalir (B), kosmos cat air (D), gerhana (H+), dan pita tipis yang mengitari (H3).

## Karakter dan animasi seru (permintaan 26 Nov 2026)
Pemilik minta animasi yang fun, seru, kreatif, dan karakter lucu per tipe (chibi atau apa saja yang eye-catching). Keputusan dan batasan yang sudah disampaikan ke pemilik:
- Orisinal, jangan mirip ilustrasi 16Personalities (figur manusia low-poly).
- Selama mengisi soal yang tampil hanya **Telur Nebula** yang netral (rencana awal maskot Pemandu diganti telur); karakter tipe baru muncul saat menetas, supaya tidak memengaruhi jawaban.
- Karakter adalah hiasan/identitas; teks hasil tetap dari skor (jangan menambah klaim stereotip).
- SVG buatan kode, animasi transform/opacity saja, hormati "kurangi gerakan".
- Rencana setelah pemilik memilih: 16 karakter (draf dulu, simpan semua), karakter di hero hasil + animasi hasil terungkap, di kartu Poster dan sampul PDF (SVG → canvas/PNG), animasi seru di layar soal (masuk #3). Semua sudah dirilis kecuali momen terungkap (#6).

Keputusan pemilik sejauh ini (detail di `docs/desain/README.md`):
- Gaya **Roh Peta** (`docs/desain/karakter-roh.js`), versi **jalan tengah**: badan unik per tipe (`rohUnik`) dengan **tekstur + pin** family (`{tex: true, pin: true}`) dan gaya gerak per family. ENTJ roket, ISTJ jam weker, ESTJ lencana perisai.
- INFP: **Kosmos Gerhana** (badan jeli kosmos + gerhana sebagai lingkaran cahaya di belakang kepala).
- Dipilih pemilik (27 Nov): progres **E1 Telur Nebula** (`pratinjau-progres.html`), kartu **gaya baru "Karakter" jadi bawaan** dengan balon kata "INI AKU: …" + **maskot mini di bilah bawah Poster**, sampul PDF **karakter di kiri bawah** (cap family tetap kanan bawah), **karakter melambai di halaman penutup PDF**. Ikon emoji tidak disukai: pakai ikon/gambar buatan sendiri.
- Kapan karakter muncul (dijawab ke pemilik): menetas setelah **4 modul utama** selesai (tipe final butuh modul fungsi; Pendalaman tidak mengubah tipe). Sebelum itu hasil sementara menampilkan telur dengan progres modul. Di halaman hasil karakter tampil di hero (dengan tombol putar ulang animasi menetas), juga di riwayat.
- Rencana teknis: branch `claude/karakter` menggabungkan #3 (layar soal) dulu, lalu `karakter.js` produksi (port dari `docs/desain/karakter-*.js`, hanya versi terpilih) + telur E1 kecil di kepala kartu soal dan besar di beranda/layar selesai modul; menetas di layar selesai modul terakhir; gambar karakter untuk kartu/PDF lewat SVG → Image → canvas/PNG (bukan canvas langsung di cetak). PR-nya nanti base #3.

## Ide yang sudah dibahas tapi belum dikerjakan
- Kartu lain diberi motif juga (sekarang hanya Poster). Saranku: jangan, supaya gaya lain tetap punya karakter sendiri.
- Motif tipe lain dinaikkan setara kekayaannya dengan INFP (dengan INFP tetap paling kaya).

## Data pribadi pemilik
File jawaban pemilik **tidak disimpan di repo** karena berisi data pribadi dan repo ini publik. Minta pemilik mengunggahnya di sesi baru kalau perlu membuat PDF/PNG untuknya. **Jangan menulis nama, skor, atau hasil tes pemilik (atau temannya) di file mana pun di repo**, termasuk gambar contoh: pakai data buatan bernama "Contoh".

## Cara membuat file untuk pemilik
- PDF/PNG dibuat dari web sungguhan dengan Playwright: layani file repo di URL `https://tendorethane-code.github.io/mbti/` (route ke file lokal), buka file jawaban lewat `#fileIn`, tunggu `#pcType`/`#pcStamp` punya `dataset.ok`, kirim `beforeprint`, tunggu `#pcMotif` `dataset.ok`, lalu `emulateMedia({media:'print'})` + `page.pdf({printBackground:true, preferCSSPageSize:true})`.
- Semua gaya kartu bisa digambar langsung: `drawCard(resultOf(sanitizeImport(data).c), nama, gaya)`.
- Data uji 16 tipe: `answersFor(C, tipe, 'A'|'T', kekuatan)` dari `tests/helpers.mjs`.
