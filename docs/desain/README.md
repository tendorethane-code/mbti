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

Gabungan telur + awan bintang (permintaan pemilik; gambar `gambar/progres-telur-awan.jpg`, baris = 0, 60, 120, 150, 189 soal):
- E1. Telur Nebula: kulit telur dari awan nebula yang berputar, bintang bertambah tiap jawaban, pinggiran debu bintang makin padat, retakan cahaya tiap modul, sepasang mata netral mengintip di 75%.
- E2. Telur Rasi: garis telur digambar titik demi titik seperti rasi, bintang besar menyala tiap modul, kabut nebula makin tebal.
- E3. Telur Awan + Bulan: telur dari gumpalan awan dengan galaksi berputar, satu bulan mengorbit per modul (4 bulan).

## Penempatan karakter di PDF dan kartu (mockup)
Dibuat dari web sungguhan dengan data buatan "Contoh" (gambar `gambar/penempatan-*.jpg`):
- Sampul PDF P1: karakter di kanan, sejajar judul. P2: karakter berdiri di atas baris angka, cap family mengecil di sampingnya. P3: karakter di tengah antara judul dan kotak "yang paling khas", cap family dihilangkan (pin di karakter sudah menandai family). Ketiganya muat satu halaman (265 mm).
- Sampul P4 (pemilik): karakter di kiri bawah di atas baris angka, cap family tetap di kanan bawah (`gambar/penempatan-sampul-kiri-bawah.jpg`).
- Kartu K1: Poster dengan karakter kecil di kanan atas (ditolak pemilik: menutupi) (sempit untuk judul tipe yang lebar seperti ENTP). K2: gaya kartu baru "Karakter" dengan karakter besar di tengah, nama tipe bergradien, family, dan tiga tipe paling cocok. K2 + balon kata "INI AKU: …" berisi dua ciri pertama; Poster + maskot mini di bilah bawah di samping tanggal (`gambar/penempatan-kartu-2.jpg`).

## Uji coba tekstur (tidak dipasang)
Permintaan pemilik "iseng, coba kasih tekstur lebih". Dibandingkan tiga versi di hasil web, kartu Karakter, sampul dan halaman PDF (gambar `gambar/uji-tex-*.jpg`, kolom kiri ke kanan): V0 sekarang (polos dengan semburat warna tipe), V1 butiran halus (noise, overlay di gelap, multiply di terang), V2 butiran + pola family samar (riak NF, kisi NT, garis SJ, diagonal SP). Dibuat dengan menempelkan CSS/canvas saat mengambil gambar; kode web tidak diubah.

Keputusan pemilik: tetap pakai yang sekarang (V0).

## Momen terungkap: telur membuka peta tipe (`pratinjau-terungkap.html`)
Lanjutan dari animasi "peta 16 tipe mengacak" di `pratinjau-karakter.html`, yang belum pernah dipasang di web. Diubah dari kesan undian menjadi **penyaringan**, supaya hasil tidak terkesan untung-untungan: urutan padam mengikuti kecocokan dari jawaban (`R.fits`, yang paling tidak cocok padam duluan). Draf memakai urutan tiruan; web asli memakai `R.fits`.

Alur setelah ketukan ke-5 (sekitar 17–18 detik, ketuk panggung untuk melewati, langsung ke keadaan akhir kalau "kurangi gerakan" aktif):
1. Telur pecah, inti cahaya meledak, 16 kotak terbang keluar dari telur.
2. Penyaringan (versi 2, lebih intens atas permintaan pemilik, sekitar 6,5 detik), makin sedikit makin pelan dan tegang. Angka "tipe tersisa" besar berdetak tiap ada yang keluar:
   - 16 → 11: sorotan cahaya memindai peta dari atas ke bawah, lima kotak terjauh menyala merah dan bergetar, lalu pecah satu per satu jadi empat keping + debu bintang, layar bergetar.
   - 11 → 7: sama, sedikit lebih pelan.
   - 7 → 5: sepasang menyala merah tanpa pindaian.
   - 5 → 4 dan 4 → 3: "Siapa yang keluar?" / "Satu lagi…": sorotan emas meloncat-loncat di antara yang tersisa, melambat seperti roda putar, berhenti di yang paling tidak cocok, menyala merah, pecah.
3. Tinggal 3: layar meredup, tiga kotak berjajar dan berdetak, lalu satu jatuh.
4. Tinggal 2 (puncak): cahaya bolak-balik makin cepat. Kalau beda kecocokan < 2% (`TIE_GAP`), duel lebih lama dan tertulis "Ketat sekali!".
5. Akhirnya: kotak pemenang memadat jadi bintang, kilatan, gelombang cahaya, sinar berputar, karakter melompat keluar dengan konfeti.
6. Huruf megah: E/I, S/N, T/F, J/P jatuh satu per satu dengan gelombang cahaya dan getaran, nama sumbunya muncul di bawah, kilau emas menyapu keempatnya, lalu family + kecocokan dan "Hampir: <tipe kedua>".

Panggung selalu gelap (seperti layar bioskop) di tema terang maupun gelap. Semua gerak memakai transform/opacity lewat Web Animations API. Gambar: `gambar/terungkap-1-telur-sampai-tinggal2.jpg`, `gambar/terungkap-2-duel-sampai-huruf.jpg`, `gambar/terungkap-3-ketat.jpg`, penyaringan versi 2: `gambar/terungkap-4-eliminasi.jpg` (gambar 1 masih versi 1).

## Musik momen terungkap dan musik soal (`musik-terungkap-draf.js`)
Semua musik disintesis di browser dengan Web Audio (tanpa file musik, tanpa lisensi), mengikuti tiap kejadian animasi.
- Momen terungkap, tujuh draf: Film, Ceria, Lembut, Orkestra F# (gaya dari lagu referensi pertama pemilik), Orkestra D minor (referensi kedua), **Ballad D minor (dipilih, gaya `manis`)**, Ballad D mayor "naik terus". Draf yang tidak dipakai diarsipkan utuh di `musik-terungkap-draf.js`. Lagu referensi hanya dianalisis (nada dasar, akor, tekstur, dinamika); melodinya tidak disalin dan filenya tidak disimpan di repo.
- Efek suara (retak, pecah, dentuman, dentang huruf) disukai pemilik dan dipertahankan; dicampur di jalur sendiri.
- Musik saat mengisi soal: sempat dibuat empat draf (Tenang, Hangat, Ringan, Orkestra), tetapi pemilik memutuskan layar soal **tanpa musik**. Kodenya diarsipkan di `musik-soal-draf.js`.

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
