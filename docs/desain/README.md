# Arsip desain

Semua draf dan desain lama disimpan di sini supaya bisa dipakai lagi kapan saja. Yang sedang dipakai di web tetap ada di `index.html`; folder ini tidak dimuat oleh situs.

Gambar contoh di `gambar/` dibuat dari jawaban buatan (nama "Contoh"), bukan data orang sungguhan.

## Motif sampul INFP (`motif-infp-draf.js`)
Buka `pratinjau-infp.html` lewat server lokal (misalnya `npx serve` di akar repo, lalu buka `/docs/desain/pratinjau-infp.html`) untuk melihat semua varian sekaligus, gelap dan terang.

| Varian | Nama | Isi | Gambar |
|---|---|---|---|
| `malam` | A. Malam Danau | dipakai sebelumnya: nebula, aurora, riak, bulan sabit + pantulan, rasi, bintang jatuh, lentera, kupu-kupu | `gambar/infp-malam-*.jpg` |
| `taman` | B. Taman Rahasia | sulur, daun, bunga, kunang-kunang | `gambar/infp-taman-*.jpg` |
| `tamanRimbun` | B+. Taman Rahasia, rimbun | B diperkaya: latar cat air, gerbang lengkung bercahaya, tirai wisteria, pakis, mawar spiral, bunga lonceng, beri, embun, kupu-kupu, kelopak berguguran | `gambar/infp-tamanRimbun-*.jpg` |
| `tamanRimbun2` | B++. Taman Rahasia, rimbun (perbaikan) | B+ diperbaiki: wisteria berupa untaian kuntum yang mengerucut dari dahan berdaun, gerbang kotak diganti lengkung bunga (teralis, mawar, bunga kecil) dengan pemandangan kecil dan cahaya hangat di dalamnya | `gambar/infp-tamanRimbun2-*.jpg` |
| `bangau` | C. Burung Kertas | bangau origami, coretan jurnal | `gambar/infp-bangau-*.jpg` |
| `kosmos` | D. Kosmos Cat Air | nebula cat air, galaksi spiral, planet bercincin | `gambar/infp-kosmos-*.jpg` |
| `jendela` | E. Jendela Dunia Dalam | jendela bulat berisi bukit, pohon, seseorang menatap bulan | `gambar/infp-jendela-*.jpg` |
| `tamanKosmos` | F. Taman Kosmos | gabungan bagian yang disukai dari B (sulur yang mengalir) dan D (nebula cat air, planet bercincin): planet berpita dan berbayang dengan cincin debu bintang, bulan kecil di orbit putus-putus, untaian bunga melingkari planet, galaksi spiral, debu bintang di sepanjang sulur, tanpa elemen menjuntai | `gambar/infp-tamanKosmos-*.jpg` |
| `lubangHitam` | G. Lubang Hitam | seperti F, tapi planet diganti lubang hitam: inti gelap, piringan materi yang melintas di depan inti dan lebih terang di satu sisi, lengkung cahaya yang dibelokkan di atas inti, kelopak yang berpilin masuk | `gambar/infp-lubangHitam-*.jpg` |
| `gerhana` | H. Gerhana | seperti F, tapi planet diganti gerhana: bulatan gelap, korona sinar halus, cincin berlian, lidah api kecil di tepi | `gambar/infp-gerhana-*.jpg` |
| `gerhana2` | H+. Gerhana, lebih kreatif (**dipakai sekarang**, dengan penyesuaian tema terang) | H dengan simbol INFP "luar tenang, dalam penuh cahaya": sebagian sinar korona tumbuh jadi tangkai berdaun dengan bunga dan kuncup, bunga bergaris halus tersembunyi di dalam bulatan gelap, manik cahaya (Baily's beads) di dekat cincin berlian, kelopak cahaya yang berguguran ke arah judul. Versi terang masih lemah (cahaya tidak bisa bersinar di latar terang) | `gambar/infp-gerhana2-*.jpg` |
| `gerhana3` | H++. Gerhana Pusaran | H+ ditambah mahkota daun yang memeluk gerhana (dengan celah di dekat cincin berlian) dan tiga lengan spiral seperti sapuan kuas, dengan daun, bunga, dan debu bintang di sepanjangnya | `gambar/infp-gerhana3-*.jpg` |
| `gerhana4` | H3. Gerhana Pita Sutra | H+ ditambah tiga pita cahaya tipis seperti selendang sutra yang mengorbit gerhana dengan kemiringan hampir sejajar; lewat di belakang bulatan lalu di depannya (menipis saat menutupi gerhana), lebar berubah seperti kain terpilin, ada daun, dua kuntum bunga, mutiara cahaya, debu bintang | `gambar/infp-gerhana4-*.jpg` |

Pemilik menyukai B dan D. B diperkaya jadi B+, lalu B+ dinilai "kureng" di bagian wisteria dan gerbang, jadi diperbaiki jadi B++. Elemen yang menjuntai (wisteria) akhirnya dinilai kurang bagus; yang disukai adalah sulur B asli dan planet bercincin D, lalu digabung jadi F. Planet bercincin F dinilai "agak alay", jadi dibuat G (lubang hitam) dan H (gerhana). Pemilik suka H, lalu dibuat H+ yang lebih kreatif; H+ dinilai "bagus banget, puas" dan menjadi favorit. H++ (pusaran) dibuat sebagai eksplorasi lanjutan; pemilik lebih suka versi awalnya yang tipis dan lembut mengitari gerhana, jadi dibuat H3 (pita sutra) yang elegan. Percobaan pantulan gerhana di air beriak dibuang karena terlihat seperti tangga. Catatan: wisteria memang selalu menjuntai; bunga rambat yang tidak menjuntai misalnya melati, morning glory, atau clematis. Untuk mengganti motif INFP: salin isi varian ke fungsi `drawInfp` di `index.html`. Helper-nya sama (`rgba`, `line`, `circ`, `star`, `glow`, `mist`); helper khusus draf (`ripples`, `stars`, `fireflies`, `leaf`, `flower`, `halo`) ikut disalin. Untuk cahaya, pakai `glow(..., cx, cy)` dengan titik pusat (sprite, ringan), bukan `shadowBlur` per titik.

## Karakter per tipe (`karakter-draf.js`)
Buka `pratinjau-karakter.html` lewat server lokal (atau raw.githack) untuk melihat animasinya: gerak diam per family, reaksi saat diketuk, demo Pemandu saat mengisi soal, dan animasi hasil terungkap. Semua karakter berupa SVG yang dibuat kode, dicontohkan untuk INFP, ENTP, ISFJ, ESTP.

| Arah | Nama | Isi | Gambar |
|---|---|---|---|
| `roh` | A. Roh Peta | makhluk roh orisinal; badan mengikuti bahasa motif family (NT kristal, NF tetesan, SJ roti, SP api miring); aksesori per tipe | `gambar/karakter-draf-*.jpg` |
| `chibi` | B. Chibi Mini | kepala besar bertudung gaya stiker; kulit krem pastel bersemburat warna tipe, rambut warna tipe (tidak menetapkan ras/gender) | sama |
| `hewan` | C. Sahabat Hewan | INFP rusa kecil, ENTP rubah, ISFJ kelinci, ESTP anak harimau | sama |
| `pemandu` | Pemandu | maskot bintang netral untuk menemani saat mengisi soal (tidak membocorkan tipe) | sama |

Gerak per family: Diplomat melayang, Analyst memiringkan kepala, Sentinel bernapas tenang, Explorer melompat. Animasi hasil terungkap: `gambar/karakter-reveal.jpg`. Hindari kemiripan dengan ilustrasi 16Personalities (figur manusia low-poly).

### Roh Peta 16 tipe (`karakter-roh.js`, dipilih)
Pemilik memilih arah A. `pratinjau-roh.html` menampilkan ke-16 tipe dan 7 opsi INFP (gambar: `gambar/roh16-*.jpg`, `gambar/roh-infp-opsi-*.jpg`).

| Tipe | Ciri | Tipe | Ciri |
|---|---|---|---|
| INTJ | mata tenang, bidak kuda, rasi | INFJ | lentera, cahaya di ujung kepala, bulan sabit |
| INTP | roda gigi berputar, kubus, tanda tanya | INFP | bunga, gerhana kecil (lihat opsi) |
| ENTJ | mahkota, jubah, bendera | ENFJ | lingkaran matahari, hati berdetak |
| ENTP | bohlam ide, alis terangkat | ENFP | pelangi, mata bintang, kupu-kupu |
| ISTJ | kacamata kotak, dasi kupu-kupu, daftar centang | ISTP | bandana, kunci pas, roda gigi |
| ISFJ | syal rajut, teh hangat | ISFP | baret, kuas, palet, kupu-kupu |
| ESTJ | topi kapten, toa, peluit | ESTP | kacamata hitam, lompat-lompat |
| ESFJ | pita, celemek, kue mangkuk | ESFP | mikrofon, mata bintang, not musik |

Badan unik per tipe (`rohUnik(t)`, data bentuk di `UNIK`; gambar `gambar/roh-unik-*.jpg`): INTJ menara kristal, INTP awan pikiran, ENTJ perisai bahu lebar, ENTP bohlam, INFJ bola kristal, INFP tetesan kosmos + gerhana, ENFJ matahari, ENFP bintang, ISTJ buku berdiri, ISFJ bakpao, ESTJ balok kokoh, ESFJ hati, ISTP mur heksagon, ISFP kuncup daun, ESTP api, ESFP balon. Aksesori sama dengan versi family; aksesori kepala ikut ujung kepala (`tip`), aksesori wajah (`faceAcc`) ikut posisi wajah.

Jalan tengah (gambar `gambar/roh-tengah-*.jpg`): badan unik, family tetap terbaca lewat tekstur halus di dalam badan (`famTex`: NT kisi, NF riak, SJ garis rapi, SP diagonal, sama dengan bahasa motif PDF), pin berlambang family (`famPin`), dan gaya gerak per family. Panggil `rohUnik(t, {tex: true, pin: true})`. ENTJ, ISTJ, ESTJ diganti jadi roket, jam weker, lencana perisai supaya tidak sama-sama kotak; bentuk lama (perisai bahu lebar, buku berdiri, balok kokoh) disimpan di `UNIK_LAMA`.

Gabungan INFP permintaan pemilik (badan 3 + gerhana 2; gambar `gambar/roh-infp-gabungan-*.jpg`): `kosmosGerhana` (gerhana sebagai lingkaran cahaya di belakang kepala) dan `gerhanaDalam` (gerhana kecil menyala di dalam badan jeli).

Opsi INFP (`rohInfp(kunci)`): `bunga` 1. Bunga & Gerhana Kecil, `gerhana` 2. Penjaga Gerhana (gerhana H+ sebagai lingkaran cahaya di belakang kepala), `kosmos` 3. Roh Kosmos (badan jeli berisi nebula, dari D), `taman` 4. Taman di Kepala (sulur B), `penulis` 5. Penulis Mimpi (jurnal, burung kertas C), `lentera` 6. Lentera Hati, `awan` 7. Kepala di Awan.

## Progres karakter saat mengisi soal (`pratinjau-progres.html`)
Pemilik ingin karakter yang "terbentuk" selama mengisi soal lalu terungkap setelah selesai. Syaratnya netral: yang tumbuh sama untuk semua orang dan tidak bergantung pada jawaban, supaya tidak memengaruhi jawaban berikutnya. Tiga konsep (gambar `gambar/progres-konsep.jpg`, baris = 0, 50, 100, 170, 189 soal):
- A. Telur Kosmos: bintang masuk ke telur tiap jawaban, cahaya naik, retak di akhir tiap modul, bergoyang lalu gemetar, menetas.
- B. Awan Bintang: debu bintang makin banyak dan rapat, inti makin terang, meletup jadi karakter.
- C. Botol Ramuan: cairan naik, satu lapis warna per modul (warna dari modul, bukan jawaban), sumbat meletup, karakter keluar dari asap.

## Penempatan karakter di PDF dan kartu (mockup)
Dibuat dari web sungguhan dengan data buatan "Contoh" (gambar `gambar/penempatan-*.jpg`):
- Sampul PDF P1: karakter di kanan, sejajar judul. P2: karakter berdiri di atas baris angka, cap family mengecil di sampingnya. P3: karakter di tengah antara judul dan kotak "yang paling khas", cap family dihilangkan (pin di karakter sudah menandai family). Ketiganya muat satu halaman (265 mm).
- Kartu K1: Poster dengan karakter kecil di kanan atas (sempit untuk judul tipe yang lebar seperti ENTP). K2: gaya kartu baru "Karakter" dengan karakter besar di tengah, nama tipe bergradien, family, dan tiga tipe paling cocok.

## Arsip (`arsip/`)
| File | Isi | Asal |
|---|---|---|
| `kartu-konstelasi.js` | kartu Konstelasi (ditolak) | commit `bf3aa3d` |
| `kartu-jurnal.js` | kartu Jurnal (ditolak) | commit `bf3aa3d` |
| `kartu-paspor.js` | kartu Paspor (ditolak) | commit `315618a` |
| `kartu-piringan.js` | kartu Piringan (ditolak, diganti Takaran) | commit `6b587f5` |
| `kartu-gelombang.js` | konsep kartu Gelombang (189 jawaban sebagai garis), tidak dipakai | draf |
| `motif-family-css.css` | motif sampul versi pertama: satu pola CSS per family | commit `165a213` |
| `motif-per-tipe-v1.js` | motif per tipe versi pertama, sebelum diperkaya | commit `d3abb91` |

Kode kartu lama memakai `cardKit(R)` dan helper `index.html` pada commit asalnya; kalau ada yang tidak cocok lagi, lihat `git show <commit>:index.html`.
