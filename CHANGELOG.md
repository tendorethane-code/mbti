# Catatan rilis

## Berikutnya: momen terungkap
- Ketukan ke-5 pada telur membuka **momen terungkap** layar penuh: telur pecah, cahayanya menjadi peta 16 tipe, lalu tipe tersingkir **sesuai urutan kecocokan dari jawabanmu** (yang paling tidak cocok padam duluan, jadi dua terakhir memang dua tipe teratas).
- Penyaringan makin pelan dan tegang: sorotan memindai peta, yang tersingkir menyala merah, bergetar, lalu pecah (16 → 11 → 7 → 5), lalu "Siapa yang keluar?" dan "Satu lagi…" dengan sorotan yang meloncat-loncat, tinggal 3 berdetak, tinggal 2 berduel. Kalau selisih kecocokan di bawah 2 poin, duelnya lebih lama dan tertulis "Ketat sekali!".
- Akhirnya: kilatan, karakter melompat keluar dengan konfeti, empat huruf tipe jatuh satu per satu dengan nama sumbunya, kilau emas, lalu family, kecocokan, dan "Hampir: <tipe kedua>". Tombol "Kenalan dengan karaktermu" menutupnya, lalu telur di layar menetas.
- Bisa dilewati (tombol Lewati, ketuk panggung, atau Esc). Kalau "kurangi gerakan" aktif, langsung tampil keadaan akhir. Juga dipakai oleh "Putar ulang menetas" di hasil.
- **Suara** yang disintesis langsung di browser (Web Audio), tanpa file musik dan tanpa lisensi. Efek mengikuti tiap kejadian: retakan tiap ketukan telur, dentuman dan denting saat telur pecah, pecahan kaca tiap tipe tersingkir, detak "Tinggal 3", drum dan suara naik saat duel, hening sesaat, simbal saat karakter keluar, dentang tiap huruf.
- **Musik latar** bertempo yang berubah per tahap (intro, penyaringan, satu per satu, tinggal 3, tinggal 2, hening, lalu lagu tema saat karakter keluar). Tiga draf dengan tempo, nada dasar, akor, melodi, dan instrumen sendiri, sedang dipilih pemilik: **Film** (90 bpm, D minor ke D mayor; taiko, string, braam, paduan suara, horn), **Ceria** (128 bpm, C mayor; marimba, pizzicato, tepuk tangan, siulan, glockenspiel), **Lembut** (72 bpm, E minor ke G mayor; piano, string, kotak musik, cello). Draf keempat **Orkestra** (66 bpm, F# mayor; biola I/II, viola, cello, kontrabas), gayanya dipelajari dari lagu referensi pemilik (nada dasar, akor diatonik maj7/sus4, gerak seperdelapan mengalir, bawah yang hangat, ending menipis ke biola); melodinya ditulis sendiri, lagu referensi tidak disalin atau disertakan. Draf kelima **Orkestra D minor** (64 bpm; seksi gesek lebih tebal dengan posisi stereo seperti tempat duduk orkestra, harpa, timpani), dari lagu referensi kedua: pembuka tanpa bas lalu bas masuk, sus4 yang selesai, crescendo panjang ke puncak yang bawahnya penuh; ditutup Dm(add9). Melodi ditulis sendiri. Draf keenam **Ballad** (68 bpm; ballad orkestra "manis"): seluruh orkestra langsung masuk begitu telur pecah, penyaringan di D minor dengan akor berwarna (add9, maj7) dan biola dalam terts, lalu mekar ke D mayor saat terungkap; piano, harpa, horn lembut, paduan suara samar. Draf ketujuh **Ballad D mayor** (bawaan sementara): satu melodi panjang yang memanjat dari tahap ke tahap (cello/viola saat penyaringan, biola satu oktaf lebih tinggi saat satu per satu, terus naik saat tinggal 3, nada tinggi ditahan saat tinggal 2, lagu tema di register tertinggi); intensitas naik terus tanpa jeda hening dan baru turun di kadens akhir G → Gm → D(add9). Akor panjang dimainkan crescendo. Efek suara dicampur di jalur sendiri ~3 dB lebih pelan supaya busur musik terasa; dentuman "Tinggal 3" sedikit dikecilkan.
- **Lebih lancar tanpa mengurangi efek**: selama layar ini tampil, halaman di belakangnya tidak digambar dan animasinya berhenti, pekerjaan latar (motif sampul PDF, gambar kecil kartu) ditunda sampai selesai, dan karakter baru digambar menjelang keluar. Jumlah partikel dan cahayanya sama dengan draf yang disetujui. Hanya kalau HP sangat lambat (median frame > 24 ms saat peta muncul; di uji CPU 10x lebih lambat pun tidak terpicu) efek dikurangi: partikel setengah, tanpa getar layar, sinar diam.

- **Musik latar saat mengisi soal** (tombol ♪ di layar soal, bawaan mati, pilihan disimpan): tenang dan netral, tidak bergantung pada jawaban (suasana hati bisa menggeser cara orang menilai diri), tanpa melodi menonjol supaya tidak mengganggu membaca, pola diacak tiap bar supaya tidak berulang persis, ringan untuk baterai (gema dari dua tunda, bukan konvolusi). Berhenti saat keluar dari layar soal atau tab disembunyikan. Tiga draf sedang dipilih pemilik: Tenang (piano + pad), Hangat (harpa + string), Ringan (marimba + pizzicato).

### Perbaikan
- Kartu: kalau kartu diunduh sebelum pratinjau di latar selesai dimuat, pratinjau ukuran penuh (1080 px, untuk tekan lama di HP) bisa tertimpa versi 540 px. Sekarang pratinjau hasil unduhan dipertahankan selama gaya, tema, dan data sama. Ditemukan lewat CI yang gagal sekali; ada tes E2E baru yang memunculkannya dengan pasti.

## 2026-11-27
Perubahan sejak versi live (`main` 244590f).

### Karakter per tipe
- **Roh Peta**: satu karakter orisinal per tipe, berupa SVG. Bentuk badannya unik per tipe (mis. ENTP bohlam, ENFP bintang, ISTJ jam weker, ESFP balon). INFP memakai badan jeli kosmos dengan gerhana sebagai lingkaran cahaya. Family tetap terbaca lewat tekstur halus di dalam badan, pin berlambang family, dan gaya gerak (Diplomat melayang, Analyst memiringkan kepala, Sentinel bernapas tenang, Explorer melompat).
- **Telur Nebula** selama mengisi soal: telur mini di kepala kartu soal dan di beranda. Bintang di dalamnya bertambah tiap jawaban, retak di akhir tiap modul, ada mata yang mengintip di 75%. Setelah 4 modul utama selesai, telur **tidak langsung menetas**: ketuk telurnya, tiap ketukan membuatnya bergetar dan retak bertambah, dan ketukan kelima membuatnya pecah (juga bisa dengan Enter/Spasi). Telur ini **netral**: hanya bergantung pada jumlah soal terjawab dan modul selesai, bukan isi jawaban. Karakter tipe tidak pernah muncul selama tes.
- **Hasil**: karakter di bagian atas (bisa diketuk, ada tombol putar ulang menetas); sebelum lengkap, tampil telur dengan progres modul. Karakter mini di riwayat.
- **Kartu**: gaya baru **Karakter** (jadi bawaan) dengan balon kata "INI AKU: …"; Poster mendapat maskot mini di bilah bawah.
- **PDF**: karakter di kiri bawah sampul (cap family tetap di kanan); karakter melambai di halaman penutup.
- Semua animasi memakai transform/opacity dan mati kalau pengguna memilih "kurangi gerakan".

### Mengisi soal jadi lebih seru
- **Rasi bintang**: setiap modul punya rasi sendiri (Kompas, Mozaik, Lima Arah, Delapan Cahaya, Lentera). Setiap jawaban menyalakan satu bintang, bintang yang berurutan tersambung garis, dan bintang berikutnya berkedip. Di layar selesai, rasinya tergambar utuh dengan percikan cahaya dan jumlah rasi yang sudah terkumpul.
- **Babak pendek**: tiap modul dibagi jadi babak berisi ~11 soal. Di awal babak baru muncul kartu jeda berisi satu fakta tentang kepribadian dan pilihan "istirahat dulu".
- **Perayaan kecil**: pesan di 25/50/75%, "Tinggal 5 lagi", "Satu lagi"; pilihan jawaban memantul sedikit saat dipilih; soal bergeser masuk dari kanan (dari kiri saat kembali).
- **Sapaan saat kembali**: beranda menampilkan "Selamat datang lagi" dengan sisa soal dan tombol Lanjutkan; kartu modul menampilkan rasi kecilnya.
- Semua hiasan **netral**: posisi bintang, pesan, dan fakta tidak bergantung pada isi jawaban, supaya tidak memengaruhi jawaban berikutnya. Animasi dimatikan kalau pengguna memilih "kurangi gerakan".

### Pendalaman per fungsi
- 12 soal Pendalaman baru untuk fungsi yang sebelumnya belum punya soal khusus (Fe, Ti, Te, Ni, Ne, Si, Se), terutama untuk memisahkan fungsi yang sering tertukar: Fi/Fe, Ti/Te, Ni/Ne, Si/Se. Setiap jawaban (termasuk tengah) menghasilkan temuan yang menyebut skor fungsinya.
- Soal dipilih kalau fungsi itu dominan/auxiliary atau bersaing ketat dengan kembarannya. Rata-rata per tipe kini lebih merata (simulasi: 9,9–13,8 soal; sebelumnya ENTP/ESTP ~6 vs INFP ~10), dan INFJ/ISFJ tidak lagi mendapat soal yang sama.
- Maksimal 16 soal per orang (soal lanjutan dan soal yang sudah dijawab tidak dibuang). Pengguna yang sudah selesai bisa mendapat 1–4 soal baru; ajakan Pendalaman menyebut sisa soalnya.

### Penjelasan istilah di halaman hasil
- **Cognitive functions**: pengantar singkat (teori Jung, bukan ukuran ilmiah), kartu **"Tim di kepalamu"** (Kapten, Co-pilot, Si Bungsu, Titik Buta) dengan ikon, nama asli (mis. Fi · Introverted Feeling), arti, dan contoh sehari-hari. Di HP kartunya digeser ke samping. Tiap fungsi bisa diketuk untuk penjelasan lengkap; penjelasan i/e.
- **Ikon garis buatan sendiri** untuk 8 fungsi dan 5 sifat Big Five (tanpa emoji), sebahasa dengan web (garis membulat, aksen bintang kecil).
- **Facet Step II**: arti kedua kutub tiap facet dan ke mana kamu condong (ketuk baris).
- **PDF ikut rinci**: kartu tim, arti dan contoh kedelapan fungsi, arti kutub facet yang menang, dan arti tiap facet Big Five ikut dicetak.
- **Big Five**: arti tiap sifat dan arti skormu (tinggi/sedang/rendah); tiap facet bisa diketuk untuk artinya.
- Penjelasan di `penjelasan.js`; tes unit memastikan semua istilah punya penjelasan.

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
- Tes: 51 unit, 156 cek E2E.

### Catatan untuk rollback
Versi lama tidak bisa membaca data browser format baru. Kalau situs dikembalikan ke versi lama, jawaban aktif pengguna yang sudah memakai versi baru akan tertimpa begitu mereka menjawab soal. Riwayat tidak terpengaruh. Utamakan perbaikan maju daripada revert.
