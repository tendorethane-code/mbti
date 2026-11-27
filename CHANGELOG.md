# Catatan rilis

## Berikutnya: penjelasan istilah di halaman hasil
- **Cognitive functions**: pengantar singkat (teori Jung, bukan ukuran ilmiah), kartu **"Tim di kepalamu"** (Kapten, Co-pilot, Si Bungsu, Titik Buta) dengan ikon, nama asli (mis. Fi · Introverted Feeling), arti, dan contoh sehari-hari. Di HP kartunya digeser ke samping. Tiap fungsi bisa diketuk untuk penjelasan lengkap; penjelasan i/e.
- **Ikon garis buatan sendiri** untuk 8 fungsi dan 5 sifat Big Five (tanpa emoji), sebahasa dengan web (garis membulat, aksen bintang kecil).
- **Facet Step II**: arti kedua kutub tiap facet dan ke mana kamu condong (ketuk baris).
- **PDF ikut rinci**: kartu tim, arti dan contoh kedelapan fungsi, arti kutub facet yang menang, dan arti tiap facet Big Five ikut dicetak.
- **Big Five**: arti tiap sifat dan arti skormu (tinggi/sedang/rendah); tiap facet bisa diketuk untuk artinya.
- Penjelasan di `penjelasan.js`; tes unit memastikan semua istilah punya penjelasan.

## 2026-11-26 (belum dirilis)
Perubahan sejak versi live (`main` 244590f).

### Tes
- Semua soal diaudit dan Big Five dicocokkan dengan IPIP-NEO-120; 9 soal diganti, beberapa diperjelas.
- Bahasa "kamu"/"saya" yang rapi, tanpa perkiraan waktu.
- Modul **Pendalaman** opsional dan adaptif (bank 22 soal) untuk temuan khusus.
- File jawaban versi 3 (per id soal). File dan data browser versi lama tetap terbaca; soal yang isinya berubah dikosongkan, dan beranda memberi tahu berapa soal yang perlu dijawab lagi.

### Hasil
- Halaman hasil disusun sebagai alur cerita (hook, 5 bab, penutup, simpan & bagikan, lalu angka), sama dengan PDF.
- Ringkasan, kekuatan, yang perlu dijaga, keseharian (mengutip jawaban asli), tips untuk orang terdekat, temuan khusus.
- Riwayat tes di browser (maks. 30) dengan tabel perbandingan, dan link hasil (`#h=`) dengan mode lihat.
- Warna khas per tipe di seluruh halaman hasil, kartu, dan PDF.
- **Kenapa tipe ini?**: kalau huruf dan urutan fungsi menunjuk tipe berbeda, atau dua tipe teratas selisihnya < 2 poin, hasil dan PDF menjelaskan skor huruf, skor fungsi, dan gabungannya, serta menandai hasil yang hampir seri.
- Pintasan: **Riwayat** dibuka sebagai popup dari tombol di kanan atas (tidak lagi di bawah beranda). **Simpan & bagikan** dibuka sebagai popup (panel bawah di HP, jendela di desktop) dari tombol di atas hasil, tombol Bagikan yang mengambang, atau langsung dari beranda.
- Bilah atas satu baris yang sembunyi saat menggulir ke bawah dan muncul lagi saat menggulir ke atas; dok kecil (Beranda, Ke atas, Bagikan) ikut aturan yang sama. Logo di bilah atas kembali ke beranda.

### Kartu dan PDF
- Kartu PNG 1080×1920, 7 gaya: Poster (bawaan, dengan motif tipe), Takaran, Mozaik, Peta, Editorial, Aura, Koleksi. Pratinjau langsung dan contoh kecil tiap gaya.
- PDF: sampul dengan motif khas tiap tipe dan cap family, latar bersemburat warna tipe, bagian angka tidak terbelah antarhalaman. Motif INFP: gerhana (H+).

### Teknis
- Script memakai penanda versi (`?v=`) supaya cache GitHub Pages tidak mencampur file lama dan baru.
- Gambar kartu dan motif digambar bertahap dan di-cache supaya ringan di HP.
- Gambar sampul PDF (judul, motif, cap) dipasang sebagai PNG transparan, bukan canvas: Chrome di HP mencetak canvas dengan latar putih.
- Kartu tidak lagi menunggu font dari Google tanpa batas: kalau font lambat, kartu digambar dengan font cadangan dulu lalu digambar ulang begitu font datang.
- Unduh kartu cukup sekali mengubah kartu ke PNG (sebelumnya dua kali), pratinjau tidak lagi tertimpa gaya lama kalau gaya diganti saat unduhan berjalan, dan motif sampul PDF tidak digambar di latar selama popup simpan & bagikan terbuka. Ganti gaya kartu di HP lambat jadi jauh lebih cepat.
- Layar soal: tombol **Kembali** dan **Lanjut** (dan panah kiri/kanan), dua kolom sama lebar di semua ukuran layar dan ukuran huruf. Lanjut untuk meninjau jawaban maju-mundur tanpa memilih ulang; soal yang belum dijawab tidak bisa dilewati.
- Tombol beranda tersusun 2×2 sama lebar, tombol layar selesai modul rapi, dan riwayat di HP menumpuk info di atas tombol (sebelumnya teks terjepit satu kata per baris di HP dengan huruf besar).
- Tes: 46 unit, 131 cek E2E.

### Catatan untuk rollback
Versi lama tidak bisa membaca data browser format baru. Kalau situs dikembalikan ke versi lama, jawaban aktif pengguna yang sudah memakai versi baru akan tertimpa begitu mereka menjawab soal. Riwayat tidak terpengaruh. Utamakan perbaikan maju daripada revert.
