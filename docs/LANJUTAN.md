# Catatan lanjutan (untuk sesi berikutnya)

Dokumen ini merangkum keadaan proyek dan keputusan yang sudah diambil bersama pemilik proyek, supaya sesi baru bisa melanjutkan tanpa mengulang.

## Cara kerja dengan pemilik proyek
- Bahasa santai, tapi jujur dan kritis. Pemilik ingin mitra yang menantang ide, bukan yang selalu setuju. Sebutkan asumsi, risiko, dan bias, termasuk ketika hasil tesnya sendiri yang dipertanyakan.
- Sebelum menafsirkan jawaban yang ambigu, tetapkan aturan dulu dan umumkan, jangan mengubah aturan setelah melihat hasil.
- Jangan mengisi jawaban yang tidak ada buktinya. Kalau jawaban lama diisi dari chat, sebutkan soal mana dan dari ucapan apa.
- Push hanya ke branch `claude/hopeful-dijkstra-5g5kvh`. **Jangan buat PR atau merge dulu**: pemilik ingin tahap pengecekan sendiri setelah semua beres.
- Situs live (`main`, GitHub Pages) masih versi lama. Semua perubahan di bawah baru ada di branch ini.

## Keadaan sekarang (semua tes lulus: 44 unit test, 105 cek E2E)
- 189 soal di 4 modul utama + Pendalaman adaptif (bank 22 soal, `PROBE_RULES` di `core.js`). Bahasa "kamu"/"saya", tanpa perkiraan waktu.
- Soal sudah diaudit dan dicocokkan dengan IPIP-NEO-120 (lihat README, "Perubahan soal versi 3").
- File jawaban v3 per id soal; v1/v2 dibaca lewat `legacy.js`.
- Hasil: ringkasan, kekuatan, "yang perlu kamu jaga", temuan khusus (otomatis + catatan manual), gambaran keseharian dengan kutipan jawaban asli, tips untuk orang terdekat, riwayat, link hasil (mode lihat).
- Palet warna per tipe (`TYPE_PAL`, `typePal()`), dipakai di seluruh halaman hasil (`#res` mengganti `--acc`/`--ind`), kartu, dan PDF. Pemilik minta warna khas tiap tipe dipertahankan, dan PDF tiap tipe harus unik (pemilik suka tema PDF INFP). Ada `typeSurf()` (semburat latar/panel/garis), motif sampul khas per tipe (`drawMotif`, 16 motif dalam bahasa family-nya) dan cap family (`drawStamp`). Pemilik sangat suka variasinya; INFP minta motif paling spesial (nebula, riak, bulan sabit berhalo, bintang jatuh, rasi, kunang-kunang, kelopak). Pemilik ingin motif tetap ramai dan bercampur dengan judul (asal halus dan bertekstur), versi besar/megah ENTP, ISFJ, ESFJ, ENTJ dipertahankan, dan INFP harus selalu paling kaya. Kartu Poster memakai motif tipe sebagai latar. Sudah dicek render 16 tipe × 2 tema.
- Performa: kartu digambar berskala (`drawCard(R,name,style,scale)`), malas (IntersectionObserver + idle), dan di-cache (`CARD_CACHE`). Uji dengan CPU 4x lebih lambat: tidak ada blok di atas ~130 ms.
- Halaman hasil web dan PDF memakai alur cerita yang sama: hook → Bab 1 satu kalimat + peta → Bab 2 kekuatan → Bab 3 tiga temuan paling khas (`storyFindings` di `core.js`), sisanya ringkas/dilipat → Bab 4 keseharian (3 poin terbuka) → Bab 5 yang perlu dijaga + orang terdekat → penutup → simpan & bagikan → "Angka di balik hasilmu". Versi cetak tetap punya markup sendiri (`.story`, `.pcover`).
- Kartu PNG 1080×1920, 7 gaya: Poster (bawaan, disukai), Takaran dan Mozaik (keduanya dicentang pemilik), Peta (dinilai "lumayan bagus"), Editorial, Aura, Koleksi. Konsep Gelombang (189 jawaban sebagai garis) sempat dibuat tapi tidak dipakai.
- Bagian simpan & bagikan: pratinjau kartu langsung tampil, contoh kecil tiap gaya (`canvas[data-thumb]`), satu tombol utama, 4 cara lain, catatan dilipat.

## Arsip desain
Semua draf (motif INFP A–E dan B+, kartu yang ditolak, motif versi lama) ada di `docs/desain/` dengan halaman pratinjau. Pemilik ingin semua draf disimpan. Pemilik menyukai draf INFP B dan D; B sudah diperkaya jadi B+ dan menunggu keputusan apakah menggantikan A.

## Pekerjaan berikutnya
1. Tunggu tanggapan pemilik soal bagian simpan & bagikan yang baru dan kartu Mozaik. Yang ditolak sebelumnya: Konstelasi, Jurnal, Paspor, Piringan.
2. Tahap pengecekan menyeluruh bersama pemilik, baru PR ke `main`.

## Data pribadi pemilik
File jawaban pemilik (`jawaban-peta-kepribadian-gama-v3.json`, berisi jawaban lengkap, Pendalaman, ringkasan, dan 2 catatan manual) **tidak disimpan di repo** karena berisi data pribadi dan repo ini kemungkinan publik. Minta pemilik mengunggah file itu di sesi baru. Hasil terakhirnya: INFP-T (I 98 · N 75 · F 53 tipis · P 86 · T 85), urutan INFP 74,3 · INTP 66,8 · ISFP 65,1, Pendalaman lengkap (15 temuan otomatis).

## Cara membuat file untuk pemilik
- PDF/PNG dibuat dari web sungguhan dengan Playwright: layani file repo di URL `https://tendorethane-code.github.io/mbti/` (route ke file lokal), buka file jawaban lewat `#fileIn`, unduh kartu lewat `#dlCard`/`#cardPrev`, cetak dengan `emulateMedia({media:'print'})` + `page.pdf({printBackground:true, preferCSSPageSize:true})`.
- Semua gaya kartu bisa digambar langsung: `drawCard(resultOf(sanitizeImport(data).c), nama, gaya)`.
