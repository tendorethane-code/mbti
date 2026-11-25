# Catatan lanjutan (untuk sesi berikutnya)

Dokumen ini merangkum keadaan proyek dan keputusan yang sudah diambil bersama pemilik proyek, supaya sesi baru bisa melanjutkan tanpa mengulang.

## Cara kerja dengan pemilik proyek
- Bahasa santai, tapi jujur dan kritis. Pemilik ingin mitra yang menantang ide, bukan yang selalu setuju. Sebutkan asumsi, risiko, dan bias, termasuk ketika hasil tesnya sendiri yang dipertanyakan.
- Sebelum menafsirkan jawaban yang ambigu, tetapkan aturan dulu dan umumkan, jangan mengubah aturan setelah melihat hasil.
- Jangan mengisi jawaban yang tidak ada buktinya. Kalau jawaban lama diisi dari chat, sebutkan soal mana dan dari ucapan apa.
- Push hanya ke branch `claude/hopeful-dijkstra-5g5kvh`. **Jangan buat PR atau merge dulu**: pemilik ingin tahap pengecekan sendiri setelah semua beres.
- Situs live (`main`, GitHub Pages) masih versi lama. Semua perubahan di bawah baru ada di branch ini.

## Keadaan sekarang (semua tes lulus: 44 unit test, 100 cek E2E)
- 189 soal di 4 modul utama + Pendalaman adaptif (bank 22 soal, `PROBE_RULES` di `core.js`). Bahasa "kamu"/"saya", tanpa perkiraan waktu.
- Soal sudah diaudit dan dicocokkan dengan IPIP-NEO-120 (lihat README, "Perubahan soal versi 3").
- File jawaban v3 per id soal; v1/v2 dibaca lewat `legacy.js`.
- Hasil: ringkasan, kekuatan, "yang perlu kamu jaga", temuan khusus (otomatis + catatan manual), gambaran keseharian dengan kutipan jawaban asli, tips untuk orang terdekat, riwayat, link hasil (mode lihat).
- Palet warna per tipe (`TYPE_PAL`, `typePal()`), dipakai di hasil, kartu, dan PDF.
- PDF disusun sebagai alur cerita (sampul + hook → Bab 1–5 → penutup → "Angka di balik hasilmu"). Markup ada di `renderRes` (`.story`, `.pcover`, hanya cetak).
- Kartu PNG 1080×1920, 6 gaya: Poster (bawaan, disukai), Piringan, Peta (dinilai "lumayan bagus"), Editorial, Aura, Koleksi.

## Pekerjaan berikutnya (diminta pemilik)
1. **Terapkan alur cerita PDF ke halaman hasil web.** Sekarang web masih menumpuk: ringkasan → temuan → keseharian → tips → angka. Ikuti tempo PDF: hook di atas, satu kalimat + tiga kata + peta singkat, kekuatan dulu, 3 temuan paling khas yang besar, sisanya ringkas/dilipat, keseharian maks. 3 poin per bagian, "yang perlu kamu jaga" lalu bagian hangat untuk orang terdekat, penutup, lalu angka (boleh dilipat). Bagian lama yang sudah diceritakan ulang jangan dobel. Perhatikan tes E2E yang bergantung pada id `#ringkasan`, `#catatan`, `#keseharian`, `#tips`, `#akhir`, `.rhero`.
2. **Ganti kartu Piringan** (ditolak: "kurang kreatif"). Sebelumnya juga ditolak: Konstelasi, Jurnal, Paspor. Pemilik ingin yang inovatif, eye catchy, elegan, tidak alay, warna dari palet tipe. Konsep yang disukai: Poster (gradien, peta 16 tipe, batang dari tengah) dan judul tipe bergradien. Pertimbangkan beberapa konsep dulu, tunjukkan pratinjau, baru pilih.
3. Setelah itu: tahap pengecekan menyeluruh bersama pemilik, baru PR ke `main`.

## Data pribadi pemilik
File jawaban pemilik (`jawaban-peta-kepribadian-gama-v3.json`, berisi jawaban lengkap, Pendalaman, ringkasan, dan 2 catatan manual) **tidak disimpan di repo** karena berisi data pribadi dan repo ini kemungkinan publik. Minta pemilik mengunggah file itu di sesi baru. Hasil terakhirnya: INFP-T (I 98 · N 75 · F 53 tipis · P 86 · T 85), urutan INFP 74,3 · INTP 66,8 · ISFP 65,1, Pendalaman lengkap (15 temuan otomatis).

## Cara membuat file untuk pemilik
- PDF/PNG dibuat dari web sungguhan dengan Playwright: layani file repo di URL `https://tendorethane-code.github.io/mbti/` (route ke file lokal), buka file jawaban lewat `#fileIn`, unduh kartu lewat `#dlCard`/`#cardPrev`, cetak dengan `emulateMedia({media:'print'})` + `page.pdf({printBackground:true, preferCSSPageSize:true})`.
- Semua gaya kartu bisa digambar langsung: `drawCard(resultOf(sanitizeImport(data).c), nama, gaya)`.
