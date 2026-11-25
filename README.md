# Peta Kepribadian

Tes 16 tipe versi lengkap, 189 soal dalam 4 modul:

1. **Inti** (44): 4 huruf + identitas (Assertive/Turbulent)
2. **Facet Step II** (45): 20 facet, minimal 2 soal per facet
3. **Big Five** (60): 5 domain × 6 facet
4. **Cognitive functions** (40): 24 pernyataan + 16 adu langsung

Plus modul opsional **Pendalaman** (11 soal) untuk temuan khusus. Modul ini tidak memengaruhi skor tipe.

Live: https://tendorethane-code.github.io/mbti/

## Fitur
- Progres tersimpan otomatis di browser (localStorage), bisa dicicil.
- Hasil: tipe + identitas, 3 tipe paling cocok (tabel 16 tipe yang menyala), skor tiap sumbu dari tiap modul, urutan fungsi, family & strategy, facet, Big Five.
- **Ringkasan kepribadian otomatis**: ringkasan singkat, kekuatan, hal yang perlu diperhatikan, gambaran keseharian (bergaul, berpikir, mengambil keputusan, mengatur waktu, emosi), dan tips supaya orang lain lebih dekat. Setiap kalimat menampilkan skor dasarnya, dan sebagian berasal dari gabungan beberapa skor.
- **Temuan khusus otomatis**: modul Pendalaman berisi pertanyaan lanjutan yang memisahkan hal yang di tes utama bisa tercampur (introvert vs cemas, rutinitas karena rencana vs karena familiar, mulai telat karena mood vs sengaja, sikap ke orang tersayang vs kenalan, keinginan vs kebiasaan). Jawabannya digabung dengan skor utama menjadi temuan, dan setiap temuan menyebutkan dasarnya. Pola gabungan di gambaran keseharian yang sudah dibahas temuan khusus tidak ditampilkan dua kali.
- **Riwayat**: setiap hasil lengkap tersimpan otomatis di browser (maksimal 30). Di beranda ada daftar riwayat, tabel perbandingan 4 tes terakhir, serta tombol lihat dan hapus. "Mulai tes baru" mengosongkan jawaban aktif tanpa menghapus riwayat. Hasil hanya ditambahkan kalau jawaban modul utama berubah.
- **Kartu PNG** berukuran story (1080×1920), dengan label kejelasan per sumbu (sumbu yang tipis atau tidak stabil antarmodul ditandai) dan kekuatan teratas.
- **Catatan khusus**: file jawaban boleh berisi `summary` dan `notes` (hasil sesi analisis di luar tes). Keduanya tampil di halaman hasil dan PDF, selalu sebagai teks biasa.
- **Link hasil**: hasil bisa dibagikan lewat link (`#h=…`). Isinya dipadatkan di bagian `#` URL sehingga tidak pernah dikirim ke server. Orang yang membuka link hanya melihat hasil itu; jawaban di browser mereka tidak berubah kecuali mereka memilih "Simpan hasil ini di browser ini".
- Tema gelap (bawaan) atau terang. Kartu PNG dan PDF mengikuti tema yang dipilih.
- Simpan hasil: kartu PNG, PDF lengkap, file jawaban `.json`, salin ringkasan.
- Semua berjalan di browser. Tidak ada jawaban yang dikirim ke server.

## Bahasa
Soal memakai "kamu", pernyataan Big Five dan fungsi memakai "saya". Bahasanya rapi tapi tetap santai. Unit test menolak kata gaul seperti lu/gw/nggak di soal dan tampilan.

## File jawaban
- Versi 2 (`"v": 2`): urutan soal mengikuti `data.js` sekarang.
- Versi 1 (184 soal): masih bisa dibuka. Modul Inti, Big Five, dan Cognitive functions dipakai apa adanya. Di modul Facet, soal yang isinya tidak berubah dipindahkan lewat `LEGACY_FACET_V1`, dan sisanya dikosongkan supaya dijawab ulang. Halaman beranda memberi tahu berapa soal yang perlu dijawab.

## Perubahan soal versi 2
Facet Expressive, Active, dan Enthusiastic, serta semua facet T/F dan J/P, diganti soal yang lebih spesifik:
- Expressive dipecah per jenis emosi (senang, sedih, gugup, tertarik, kesal).
- Soal J/P tidak lagi menyebut keluar rumah atau bertemu orang, supaya tidak ikut mengukur introvert.
- Soal "mulai lebih awal" memisahkan kebiasaan nyata dari rasa tidak suka pada tekanan.

## Struktur
- `data.js`: semua soal, dengan id tetap untuk soal facet
- `core.js`: logika skor, migrasi file lama, ringkasan kepribadian, link hasil (tanpa DOM, bisa dites di Node)
- `index.html`: tampilan
- `tests/core.test.mjs`: unit test untuk integritas soal, bahasa, ke-16 tipe × A/T, jawaban acak, impor & migrasi file, ringkasan kepribadian, catatan, dan link hasil
- `tests/e2e.mjs`: tes end-to-end di Chrome headless untuk semua alur, termasuk file versi lama, catatan khusus (dan teks berbahaya), serta mode lihat link

## Menjalankan tes
```
npm test            # butuh Node 22+ dan Chrome/Chromium
CHROME_BIN=/path/ke/chrome npm run test:e2e
```
CI (GitHub Actions) menjalankan keduanya setiap push ke `main` dan setiap pull request.

## Cara hitung
- Persentase huruf: rata-rata modul Inti dan Facet (Turbulent juga memakai Big Five Neuroticism).
- Facet: rata-rata soal di facet itu, skala −2 sampai +2.
- Fungsi: rata-rata skor pernyataan dan adu langsung.
- Kecocokan tipe: 50% urutan fungsi (bobot 4-3-2-1) + 50% peluang tiap huruf.

Bukan tes MBTI® resmi dan belum divalidasi secara ilmiah. MBTI adalah merek dagang The Myers-Briggs Company.
