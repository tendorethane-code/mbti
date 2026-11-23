# Peta Kepribadian

Tes 16 tipe versi lengkap, 184 soal dalam 4 modul:

1. **Inti** (44): 4 huruf + identitas (Assertive/Turbulent)
2. **Facet Step II** (40): 20 facet, 2 soal per facet
3. **Big Five** (60): 5 domain × 6 facet
4. **Cognitive functions** (40): 24 pernyataan + 16 adu langsung

Live: https://tendorethane-code.github.io/mbti/

## Fitur
- Progres kesimpan otomatis di browser (localStorage), bisa dicicil.
- Hasil: tipe + identitas, 3 tipe paling cocok (tabel 16 tipe yang nyala), skor tiap sumbu dari tiap modul, urutan fungsi, family & strategy, facet, Big Five.
- Tema gelap (bawaan) atau terang, dipilih di atas. Kartu PNG dan PDF ngikut tema yang dipilih.
- Simpan hasil: kartu PNG, PDF lengkap, file jawaban `.json` (bisa dibuka lagi di perangkat lain), salin ringkasan.
- Semua jalan di browser. Nggak ada jawaban yang dikirim ke server.

## Struktur
- `data.js` — semua soal
- `core.js` — logika skor (tanpa DOM, bisa dites di Node)
- `index.html` — tampilan
- `tests/core.test.mjs` — unit test: integritas soal, ke-16 tipe × A/T terdeteksi benar, 500 jawaban acak tanpa NaN, impor file
- `tests/e2e.mjs` — tes end-to-end di Chrome headless: ngerjain semua soal, cek hasil, download PNG/JSON, PDF, muat ulang, hapus, buka file, HP/laptop, mode gelap

## Jalanin tes
```
npm test            # butuh Node 22+ dan Chrome/Chromium
CHROME_BIN=/path/ke/chrome npm run test:e2e
```
CI (GitHub Actions) jalanin dua-duanya tiap push ke `main`.

## Cara hitung
- Persentase huruf: rata-rata modul Inti dan Facet (Turbulent juga pakai Big Five Neuroticism).
- Fungsi: rata-rata skor pernyataan dan adu langsung.
- Kecocokan tipe: 50% urutan fungsi (bobot 4-3-2-1) + 50% peluang tiap huruf.

Bukan tes MBTI® resmi dan belum divalidasi secara ilmiah. MBTI adalah merek dagang The Myers-Briggs Company.
