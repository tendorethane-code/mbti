# Catatan lanjutan (untuk sesi berikutnya)

Dokumen ini merangkum keadaan proyek dan keputusan yang sudah diambil bersama pemilik proyek, supaya sesi baru bisa melanjutkan tanpa mengulang. Baca seluruhnya sebelum mulai.

## Cara kerja dengan pemilik proyek
- Bahasa santai, tapi jujur dan kritis. Pemilik ingin mitra yang menantang ide, bukan yang selalu setuju. Sebutkan asumsi, risiko, dan bias, termasuk ketika hasil tesnya sendiri yang dipertanyakan.
- Sebelum menafsirkan jawaban yang ambigu, tetapkan aturan dulu dan umumkan, jangan mengubah aturan setelah melihat hasil.
- Jangan mengisi jawaban yang tidak ada buktinya.
- **Jangan merge PR apa pun tanpa kata "merge" dari pemilik.** Push ke branch PR boleh. Pemilik mencoba perubahan di HP lewat link pratinjau (lihat "Pratinjau di HP").
- Pemilik suka diberi contoh visual (screenshot/gambar) sebelum memutuskan, dan sering memberi masukan lewat screenshot yang dicoret.
- Untuk desain: tunjukkan beberapa draf, simpan semua draf ke `docs/desain/` (pemilik ingin semuanya disimpan), baru pasang yang dipilih.
- Situs live = `main` di GitHub Pages, masih versi lama sampai PR #1 di-merge.

## Status PR (per 26 Nov 2026)
Semua CI hijau. Tidak ada yang di-merge. Pemilik masih ingin menambah perubahan sebelum merge.

| PR | Branch | Base | Isi |
|---|---|---|---|
| #1 | `claude/hopeful-dijkstra-5g5kvh` | `main` | Rilis besar v3 (semua isi di bawah "Keadaan sekarang"). Sudah lewat cek rilis lengkap (lihat CHANGELOG). Menunggu pemilik mencoba di HP lalu bilang "merge". |
| #2 | `claude/pendalaman-fungsi` | branch #1 | 12 soal Pendalaman per fungsi (Fe, Ti, Te, Ni, Ne, Si, Se), maks. 16 soal per orang. |
| #3 | `claude/kuis-seru` | branch #1 | Mengisi soal jadi seru: rasi bintang per modul, babak ~11 soal + kartu jeda fakta, pesan 25/50/75%, sapaan "selamat datang lagi". Semua hiasan netral terhadap isi jawaban. |
| (belum PR) | `claude/karakter` | #3 (sudah memuat #1 + #3) | Karakter di web: `karakter.js` (Roh Peta + Telur Nebula), telur netral di layar soal/beranda, menetas setelah 4 modul utama, karakter di hero hasil/riwayat, gaya kartu Karakter (bawaan) + maskot mini Poster, karakter di sampul PDF kiri bawah + melambai di penutup. Tes 47 unit, 144 E2E. Menunggu pemilik mencoba di HP; PR bisa dibuat kalau diminta (base #3). |
| #4 | `claude/penjelasan` | branch #1 | Penjelasan istilah di hasil (masukan teman pemilik): Tim di kepalamu, ikon garis SVG sendiri (tanpa emoji), nama asli fungsi, arti fungsi/facet/Big Five yang bisa diketuk, detail ikut di PDF. `penjelasan.js`. |

Urutan merge yang disepakati: #1 dulu (**squash merge**, lalu hapus branch-nya, karena riwayat branch memuat data pribadi yang sudah dihapus dari file), lalu ganti base #2 dan #3 ke `main` (di GitHub: Edit base), lalu merge sesuai pilihan pemilik. #2 dan #3 tidak saling bergantung. Kalau #2 dan #3 sama-sama menyentuh `CHANGELOG.md`/`README.md`, merge base ke branch-nya dan selesaikan konflik (jangan rebase/force-push).

**Tambahan baru dari pemilik**: tanya dulu masuk ke PR mana. Aturan praktis: perbaikan untuk rilis utama ke #1; hal yang berkaitan dengan Pendalaman ke #2; layar soal ke #3; fitur baru yang besar ke branch/PR baru dari branch #1.

## Pratinjau di HP
Pemilik mencoba lewat raw.githack, dikunci ke commit supaya tidak kena cache:
`https://raw.githack.com/tendorethane-code/mbti/<SHA commit>/index.html`
Selalu berikan link dengan SHA terbaru setelah push. Data di raw.githack terpisah dari situs live (beda alamat), jadi uji upgrade data lama baru bisa setelah merge.

## Keadaan sekarang (branch #1; tes: 46 unit, 128 E2E)
- 189 soal di 4 modul utama + Pendalaman adaptif (`DEEP` di `data.js`, aturan `PROBE_RULES` di `core.js`). Bahasa "kamu"/"saya", tanpa perkiraan waktu. Soal sudah diaudit dan dicocokkan dengan IPIP-NEO-120.
- File jawaban v3 per id soal; v1/v2 dibaca lewat `legacy.js`. Data browser versi lama dimigrasi otomatis, dan beranda memberi tahu berapa soal yang perlu dijawab lagi.
- **Hasil web** (alur cerita, sama dengan PDF): hero (tipe bergradien, hook "yang paling khas", 3 tipe teratas, kotak **"Kenapa X, bukan Y?"** dari `typeWhy()` kalau huruf dan urutan fungsi menunjuk tipe berbeda atau selisih < 2 poin, tombol Simpan & bagikan) → Bab 1 satu kalimat + peta → Bab 2 kekuatan → Bab 3 tiga temuan paling khas (`storyFindings`) → Bab 4 keseharian → Bab 5 yang perlu dijaga + orang terdekat → penutup → "Angka di balik hasilmu" → "Seberapa bisa dipegang".
- **Navigasi**: bilah atas satu baris (logo = ke beranda, tema ikon ☾/☀, tombol Riwayat berangka), sembunyi saat menggulir ke bawah. **Riwayat** dan **Simpan & bagikan** berupa popup (panel bawah di HP, jendela di desktop; `openSheet`/`closeSheets`, Esc, klik latar). Di hasil ada dok kaca kecil (Beranda, Ke atas, Bagikan) yang muncul hanya saat menggulir ke atas dan setelah tombol atas lewat.
- **PDF**: sampul dengan motif khas tiap tipe (`drawMotif`) + cap family (`drawStamp`) + tanggal di bawah; latar bersemburat warna tipe (`typeSurf`); Bab 1 memuat kotak "Kenapa…"; bagian angka tidak terbelah. Gambar sampul dipasang sebagai `<img>` PNG, **bukan canvas** (Chrome HP mencetak canvas dengan latar putih). Motif sampul digambar saat browser senggang dan cadangan sinkron saat `beforeprint`.
- **Motif**: 16 motif per tipe dalam bahasa family (NT kisi, NF riak, SJ garis rapi, SP diagonal). Pemilik ingin motif ramai dan bercampur dengan judul (halus, bertekstur), versi besar ENTP/ISFJ/ESFJ/ENTJ dipertahankan. **INFP harus selalu paling kaya**; yang dipasang: H+ (gerhana dengan korona yang tumbuh jadi taman, bunga tersembunyi, manik cahaya, kelopak cahaya), dengan versi terang khusus.
- **Warna**: palet per tipe (`TYPE_PAL`, `typePal()`) dipakai di seluruh hasil, kartu, dan PDF.
- **Kartu PNG** 1080×1920, 7 gaya: Poster (bawaan, dengan motif tipe), Takaran, Mozaik, Peta, Editorial, Aura, Koleksi. Ditolak: Konstelasi, Jurnal, Paspor, Piringan (arsip di `docs/desain/arsip/`).
- **Performa**: kartu dan motif digambar berskala, bertahap (idle/IntersectionObserver), dan di-cache. Script memakai `?v=` (ganti angkanya setiap rilis; lihat README bagian Rilis).

## Arsip desain (`docs/desain/`)
13 draf motif INFP (A Malam Danau, B Taman, B+, B++, C Bangau, D Kosmos, E Jendela, F Taman Kosmos, G Lubang Hitam, H Gerhana, H+ dipakai, H++ Pusaran, H3 Pita Sutra) dengan `pratinjau-infp.html`, kartu yang ditolak, dan motif versi lama. Pemilik tidak suka elemen menjuntai (wisteria) dan planet bercincin ("agak alay"); suka sulur mengalir (B), kosmos cat air (D), gerhana (H+), dan pita tipis yang mengitari (H3).

## Karakter dan animasi seru (permintaan 26 Nov 2026)
Pemilik minta animasi yang fun, seru, kreatif, dan karakter lucu per tipe (chibi atau apa saja yang eye-catching). Keputusan dan batasan yang sudah disampaikan ke pemilik:
- Orisinal, jangan mirip ilustrasi 16Personalities (figur manusia low-poly).
- Selama mengisi soal hanya **Pemandu** (maskot netral) yang tampil, reaksinya sama untuk jawaban apa pun; karakter tipe baru muncul saat hasil terungkap, supaya tidak memengaruhi jawaban.
- Karakter adalah hiasan/identitas; teks hasil tetap dari skor (jangan menambah klaim stereotip).
- SVG buatan kode, animasi transform/opacity saja, hormati "kurangi gerakan".
- Rencana setelah pemilik memilih: 16 karakter (draf dulu, simpan semua), karakter di hero hasil + animasi hasil terungkap, di kartu Poster dan sampul PDF (SVG → canvas/PNG), Pemandu dan animasi seru di layar soal (bagian ini masuk #3).

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
