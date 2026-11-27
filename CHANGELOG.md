# Catatan rilis

## Berikutnya: karakter per tipe
- **Roh Peta**: satu karakter orisinal per tipe, berupa SVG. Bentuk badannya unik per tipe (mis. ENTP bohlam, ENFP bintang, ISTJ jam weker, ESFP balon). INFP memakai badan jeli kosmos dengan gerhana sebagai lingkaran cahaya. Family tetap terbaca lewat tekstur halus di dalam badan, pin berlambang family, dan gaya gerak (Diplomat melayang, Analyst memiringkan kepala, Sentinel bernapas tenang, Explorer melompat).
- **Telur Nebula** selama mengisi soal: telur mini di kepala kartu soal dan di beranda. Bintang di dalamnya bertambah tiap jawaban, retak di akhir tiap modul, ada mata yang mengintip di 75%. Setelah 4 modul utama selesai, telur **tidak langsung menetas**: ketuk telurnya, tiap ketukan membuatnya bergetar dan retak bertambah, dan ketukan kelima membuatnya pecah (juga bisa dengan Enter/Spasi). Telur ini **netral**: hanya bergantung pada jumlah soal terjawab dan modul selesai, bukan isi jawaban. Karakter tipe tidak pernah muncul selama tes.
- **Hasil**: karakter di bagian atas (bisa diketuk, ada tombol putar ulang menetas); sebelum lengkap, tampil telur dengan progres modul. Karakter mini di riwayat.
- **Kartu**: gaya baru **Karakter** (jadi bawaan) dengan balon kata "INI AKU: …"; Poster mendapat maskot mini di bilah bawah.
- **PDF**: karakter di kiri bawah sampul (cap family tetap di kanan); karakter melambai di halaman penutup.
- Semua animasi memakai transform/opacity dan mati kalau pengguna memilih "kurangi gerakan".

## Berikutnya: mengisi soal jadi lebih seru
- **Rasi bintang**: setiap modul punya rasi sendiri (Kompas, Mozaik, Lima Arah, Delapan Cahaya, Lentera). Setiap jawaban menyalakan satu bintang, bintang yang berurutan tersambung garis, dan bintang berikutnya berkedip. Di layar selesai, rasinya tergambar utuh dengan percikan cahaya dan jumlah rasi yang sudah terkumpul.
- **Babak pendek**: tiap modul dibagi jadi babak berisi ~11 soal. Di awal babak baru muncul kartu jeda berisi satu fakta tentang kepribadian dan pilihan "istirahat dulu".
- **Perayaan kecil**: pesan di 25/50/75%, "Tinggal 5 lagi", "Satu lagi"; pilihan jawaban memantul sedikit saat dipilih; soal bergeser masuk dari kanan (dari kiri saat kembali).
- **Sapaan saat kembali**: beranda menampilkan "Selamat datang lagi" dengan sisa soal dan tombol Lanjutkan; kartu modul menampilkan rasi kecilnya.
- Semua hiasan **netral**: posisi bintang, pesan, dan fakta tidak bergantung pada isi jawaban, supaya tidak memengaruhi jawaban berikutnya. Animasi dimatikan kalau pengguna memilih "kurangi gerakan".

## Berikutnya: Pendalaman per fungsi
- 12 soal Pendalaman baru untuk fungsi yang sebelumnya belum punya soal khusus (Fe, Ti, Te, Ni, Ne, Si, Se), terutama untuk memisahkan fungsi yang sering tertukar: Fi/Fe, Ti/Te, Ni/Ne, Si/Se. Setiap jawaban (termasuk tengah) menghasilkan temuan yang menyebut skor fungsinya.
- Soal dipilih kalau fungsi itu dominan/auxiliary atau bersaing ketat dengan kembarannya. Rata-rata per tipe kini lebih merata (simulasi: 9,9–13,8 soal; sebelumnya ENTP/ESTP ~6 vs INFP ~10), dan INFJ/ISFJ tidak lagi mendapat soal yang sama.
- Maksimal 16 soal per orang (soal lanjutan dan soal yang sudah dijawab tidak dibuang). Pengguna yang sudah selesai bisa mendapat 1–4 soal baru; ajakan Pendalaman menyebut sisa soalnya.

## 2026-11-26 (belum dirilis)
Perubahan sejak versi live (`main` 244590f).

### Tes
- Semua soal diaudit dan Big Five dicocokkan dengan IPIP-NEO-120; 9 soal diganti, beberapa diperjelas.
- Bahasa "kamu"/"saya" yang rapi, tanpa perkiraan waktu.
- Modul **Pendalaman** opsional dan adaptif untuk temuan khusus.
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
