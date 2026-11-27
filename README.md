# Peta Kepribadian

Tes 16 tipe versi lengkap, 189 soal dalam 4 modul:

1. **Inti** (44): 4 huruf + identitas (Assertive/Turbulent)
2. **Facet Step II** (45): 20 facet, minimal 2 soal per facet
3. **Big Five** (60): 5 domain × 6 facet
4. **Cognitive functions** (40): 24 pernyataan + 16 adu langsung

Plus modul opsional **Pendalaman adaptif** untuk temuan khusus: soalnya dipilih dari pola hasil (5–19 soal, tergantung profil), dan sebagian soal muncul sebagai lanjutan dari jawaban sebelumnya. Modul ini tidak memengaruhi skor tipe.

Live: https://tendorethane-code.github.io/mbti/

## Fitur
- Mengisi soal dibuat ringan: rasi bintang per modul yang menyala satu bintang per jawaban, babak pendek dengan kartu jeda berisi fakta, perayaan kecil di 25/50/75%, dan sapaan "selamat datang lagi". Semua hiasan netral, tidak bergantung pada isi jawaban.
- Tanpa perkiraan waktu. Progres tersimpan otomatis di browser (localStorage) setiap kali menjawab, jadi bisa dikerjakan sesantainya dan dilanjutkan kapan saja.
- Tampilan: aksen warna mengikuti family hasil, layar soal dengan kartu yang tenang, kalimat penyemangat kecil, dan transisi halus (dimatikan kalau pengguna memilih kurangi gerakan).
- **Palet per tipe**: 16 tipe punya 16 pasangan warna sendiri (`TYPE_PAL`), satu nuansa per family. Di tema terang, warnanya digelapkan lewat kecerahan (HSL) supaya tetap hidup, tidak kusam. `typeSurf()` memberi semburat warna tipe pada latar, panel, dan garis (PDF: seluruh halaman; web: panel dan garis). Sampul PDF punya motif khas untuk tiap tipe (`drawMotif`), masing-masing tetap memakai bahasa family-nya: Analyst berbasis kisi (INTJ garis mengerucut ke satu titik, INTP spiral emas, ENTJ tangga naik, ENTP pohon kemungkinan), Diplomat berbasis lingkaran/riak (INFJ mandala, INFP paling kaya: gerhana "H+" dengan korona yang tumbuh jadi taman, bunga tersembunyi di dalam bulatan gelap, manik cahaya, cincin berlian, kelopak cahaya yang berguguran, sulur mengalir, dan nebula cat air; di tema terang ada ruang terang di sekitar gerhana supaya tetap kontras. Draf lain ada di `docs/desain/`, ENFJ bunga kehidupan, ENFP gelembung ide), Sentinel berbasis garis rapi (ISTJ buku besar, ISFJ anyaman, ESTJ susunan bata, ESFJ untaian bendera), Explorer berbasis diagonal dinamis (ISTP crosshair teknis, ISFP sapuan kuas, ESTP garis kecepatan + kilat, ESFP konfeti + pita). Semua motif diberi butiran halus supaya bertekstur, dan sengaja boleh bercampur dengan judul. Identitas family dijaga oleh cap bulat (`drawStamp`) bertuliskan nama family, yang duduk di bawah kotak hook (ikut alur, tidak pernah menimpa teks). Kartu Poster juga memakai motif tipenya sebagai latar. Performa: motif sampul baru digambar saat akan mencetak (`beforeprint`), gambar sampul ditaruh langsung di `<canvas>` (tanpa penyandian PNG), cahaya memakai sprite gradien (bukan `shadowBlur`), dan motif kartu digambar sesuai skala pratinjau. Di halaman hasil, `--acc` dan `--ind` diganti palet tipe, jadi semua elemen (judul, tabel 16 tipe, batang skor, titik, fungsi, tombol) ikut warna tipenya, begitu juga kartu dan PDF. Di tema terang warnanya digelapkan otomatis sampai kontrasnya cukup (diuji).
- **Hasil disusun sebagai alur cerita**, di web maupun PDF: hook "Yang paling khas darimu" → Bab 1 "Kamu, dalam satu kalimat" (kalimat pembuka + peta singkat 5 sumbu) → Bab 2 kekuatan + kutipan jawaban sendiri → Bab 3 tiga temuan paling khas (besar), sisanya ringkas dan sebagian dilipat → Bab 4 keseharian (3 poin terbuka per bagian, sisanya dilipat) → Bab 5 yang perlu dijaga + untuk orang terdekat → penutup (satu kekuatan untuk dipegang, satu hal untuk dijaga) → simpan & bagikan → Bagian 2 "Angka di balik hasilmu". PDF memakai urutan yang sama, dengan sampul dan satu bab per halaman.
- "Paling khas" dipilih oleh `storyFindings()`: temuan yang paling banyak memisahkan hal yang di tes utama tercampur (urutan `FIND_RANK`), diambil dari tiga wilayah berbeda (`FIND_AREA`). Kalimat yang sudah tampil di "Yang perlu kamu jaga" tidak diulang di keseharian.
- Bingkai bahasa yang nyaman: "Yang perlu kamu jaga", bukan "kelemahan".
- Hasil: tipe + identitas, 3 tipe paling cocok (tabel 16 tipe yang menyala), skor tiap sumbu dari tiap modul, urutan fungsi, family & strategy, facet, Big Five.
- **Ringkasan kepribadian otomatis**: ringkasan singkat, kekuatan, hal yang perlu diperhatikan, gambaran keseharian (bergaul, berpikir, mengambil keputusan, mengatur waktu, emosi), dan tips supaya orang lain lebih dekat. Setiap kalimat menampilkan skor dasarnya dan mengutip jawaban asli orangnya ("Kamu memilih: …"), dan sebagian berasal dari gabungan beberapa skor.
- **Temuan khusus otomatis**: modul Pendalaman (bank 22 soal, aturan pemilihan di `PROBE_RULES`) berisi pertanyaan lanjutan yang memisahkan hal yang di tes utama bisa tercampur (introvert vs cemas, rutinitas karena rencana vs karena familiar, mulai telat karena mood vs sengaja, sikap ke orang tersayang vs kenalan, keinginan vs kebiasaan). Jawabannya digabung dengan skor utama menjadi temuan, dan setiap temuan menyebutkan dasarnya. Pola gabungan di gambaran keseharian yang sudah dibahas temuan khusus tidak ditampilkan dua kali.
- **Riwayat**: popup dari tombol Riwayat di kanan atas (muncul kalau ada riwayat). Setiap hasil lengkap tersimpan otomatis di browser (maksimal 30). Di beranda ada daftar riwayat, tabel perbandingan 4 tes terakhir, serta tombol lihat dan hapus. "Mulai tes baru" mengosongkan jawaban aktif tanpa menghapus riwayat. Hasil hanya ditambahkan kalau jawaban modul utama berubah.
- **Kartu PNG** berukuran story (1080×1920), 7 gaya yang bisa dipilih, masing-masing dengan contoh kecil dan pratinjau langsung: Poster (bawaan), Takaran (huruf tipe raksasa yang terisi seperti gelas ukur sesuai persentasenya, garis putus = seimbang, huruf yang tipis diisi arsiran), Mozaik (16 tipe sebagai ubin, luas ubin = kecocokan), Peta (kontur topografi, penanda "Kamu di sini", kompas N/S/E/I), Editorial, Aura, dan Koleksi. Setiap gaya menandai sumbu yang tipis atau kurang stabil dengan caranya sendiri. Gaya Poster: warna mengikuti family, peta 16 tipe dengan tipe utama menyala, batang sumbu dari tengah (sumbu yang tipis atau tidak stabil antarmodul diarsir dan diberi label), radar Big Five, dan urutan fungsi.
- **Catatan khusus**: file jawaban boleh berisi `summary` dan `notes` (hasil sesi analisis di luar tes). Keduanya tampil di halaman hasil dan PDF, selalu sebagai teks biasa.
- **Link hasil**: hasil bisa dibagikan lewat link (`#h=…`). Isinya dipadatkan di bagian `#` URL sehingga tidak pernah dikirim ke server. Orang yang membuka link hanya melihat hasil itu; jawaban di browser mereka tidak berubah kecuali mereka memilih "Simpan hasil ini di browser ini".
- Tema gelap (bawaan) atau terang. Kartu PNG dan PDF mengikuti tema yang dipilih.
- Ringan di HP: pratinjau dan contoh kartu digambar dalam resolusi kecil, satu per satu saat browser senggang atau saat bagian simpan mendekati layar, lalu disimpan sementara (ganti tema tidak menggambar ulang yang sudah ada). Kartu resolusi penuh baru dibuat saat diunduh.
- Simpan hasil (popup "Simpan & bagikan", dibuka dari beranda, dari atas hasil, atau dari tombol Bagikan yang mengambang): kartu PNG (pratinjau langsung tampil, contoh kecil tiap gaya), PDF lengkap, file jawaban `.json`, salin link, salin ringkasan. Catatan soal link dan PDF dilipat supaya bagiannya ringkas.
- PDF: tiap bagian di "Angka di balik hasilmu" tidak terbelah antarhalaman.
- Semua berjalan di browser. Tidak ada jawaban yang dikirim ke server.

## Bahasa
Soal memakai "kamu", pernyataan Big Five dan fungsi memakai "saya". Bahasanya rapi tapi tetap santai. Unit test menolak kata gaul seperti lu/gw/nggak di soal dan tampilan.

## File jawaban
- Versi 3 (`"v": 3`): jawaban disimpan **per id soal** (`"c": {"c0": 1, ...}`) dalam orientasi asli (A = 1, B = 5). Urutan dan posisi A/B di layar boleh berubah tanpa merusak file. Soal yang isinya berubah wajib diberi id baru.
- Versi 1 dan 2 (jawaban per posisi): masih bisa dibuka lewat `legacy.js` (`LAYOUT_V2`, `LEGACY_FACET_V1`). Soal yang isinya sudah berubah dikosongkan, dan beranda memberi tahu berapa soal yang perlu dijawab ulang.
- Link hasil versi 2 juga masih terbaca.

## Perubahan soal versi 3 (audit + IPIP-NEO-120)
Semua soal diaudit: satu soal satu hal, tidak tercampur sumbu lain, kedua pilihan sama-sama wajar, dan konteksnya jelas. Big Five dicocokkan dengan IPIP-NEO-120 (Johnson, 2014, domain publik), lalu diadaptasi, tidak diterjemahkan mentah. Soal politik di facet Liberalism IPIP tidak dipakai karena tidak cocok dengan konteks di sini.
- S/N: "orang menyebutmu… suka melamun" (pilihan B terdengar negatif) dan "aplikasi edit foto" (kedua pilihan tidak berlawanan) diganti.
- T/F: "korban banjir: biasa saja vs ikut sedih" mengukur rasa kasihan, bukan cara memutuskan. Diganti dengan soal keputusan menyumbang.
- Facet Expressive: "gugup terlihat" (mengukur cemas) diganti dengan "cerita atau dipendam". Facet Reasonable: "piket karena tidak mood" (hampir semua orang menolak) diganti dengan kasus yang lebih sulit diputuskan.
- Big Five: Perasaan (O3) yang berisi dua hal sekaligus dipecah mengikuti IPIP, dan pernyataan terbalik Murung (N3) mengikuti IPIP ("nyaman dengan diri sendiri").
- Fungsi: Ni "memikirkan arah hidup" (lebih ke merencanakan atau cemas) dan Ne "lebih suka tahap awal" (ikut mengukur rendahnya disiplin) diganti.
- Diperjelas tanpa mengubah isi: soal "adil" (diberi contoh), "resep baru", "kamar", dan pilihan B soal obrolan kelompok.

## Perubahan soal versi 2
Facet Expressive, Active, dan Enthusiastic, serta semua facet T/F dan J/P, diganti soal yang lebih spesifik:
- Expressive dipecah per jenis emosi (senang, sedih, gugup, tertarik, kesal).
- Soal J/P tidak lagi menyebut keluar rumah atau bertemu orang, supaya tidak ikut mengukur introvert.
- Soal "mulai lebih awal" memisahkan kebiasaan nyata dari rasa tidak suka pada tekanan.

## Struktur
- `data.js`: semua soal, masing-masing dengan id tetap, plus bank soal Pendalaman
- `legacy.js`: urutan soal versi lama, untuk membaca file dan link lama
- `core.js`: logika skor, migrasi file lama, ringkasan kepribadian, link hasil (tanpa DOM, bisa dites di Node)
- `index.html`: tampilan
- `tests/core.test.mjs`: unit test untuk integritas soal, bahasa, ke-16 tipe × A/T, jawaban acak, impor & migrasi file, ringkasan kepribadian, catatan, dan link hasil
- `tests/e2e.mjs`: tes end-to-end di Chrome headless untuk semua alur, termasuk file versi lama, catatan khusus (dan teks berbahaya), serta mode lihat link

## Rilis
- Situs live = branch `main` di GitHub Pages. GitHub Pages meng-cache tiap file 10 menit, jadi setiap kali `data.js`, `legacy.js`, atau `core.js` berubah, **ganti angka `?v=` di tag `<script>` pada `index.html`** supaya pengunjung tidak mendapat campuran file lama dan baru.
- Jalankan `npm test` sebelum merge. CI menjalankan tes yang sama untuk setiap pull request.
- Kalau rilis bermasalah: revert commit merge di `main`, GitHub Pages memperbarui situs dalam beberapa menit.

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
