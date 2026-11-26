# Arsip desain

Semua draf dan desain lama disimpan di sini supaya bisa dipakai lagi kapan saja. Yang sedang dipakai di web tetap ada di `index.html`; folder ini tidak dimuat oleh situs.

Gambar contoh di `gambar/` dibuat dari jawaban buatan (nama "Contoh"), bukan data orang sungguhan.

## Motif sampul INFP (`motif-infp-draf.js`)
Buka `pratinjau-infp.html` lewat server lokal (misalnya `npx serve` di akar repo, lalu buka `/docs/desain/pratinjau-infp.html`) untuk melihat semua varian sekaligus, gelap dan terang.

| Varian | Nama | Isi | Gambar |
|---|---|---|---|
| `malam` | A. Malam Danau | **dipakai sekarang**: nebula, aurora, riak, bulan sabit + pantulan, rasi, bintang jatuh, lentera, kupu-kupu | `gambar/infp-malam-*.jpg` |
| `taman` | B. Taman Rahasia | sulur, daun, bunga, kunang-kunang | `gambar/infp-taman-*.jpg` |
| `tamanRimbun` | B+. Taman Rahasia, rimbun | B diperkaya: latar cat air, gerbang lengkung bercahaya, tirai wisteria, pakis, mawar spiral, bunga lonceng, beri, embun, kupu-kupu, kelopak berguguran | `gambar/infp-tamanRimbun-*.jpg` |
| `tamanRimbun2` | B++. Taman Rahasia, rimbun (perbaikan) | B+ diperbaiki: wisteria berupa untaian kuntum yang mengerucut dari dahan berdaun, gerbang kotak diganti lengkung bunga (teralis, mawar, bunga kecil) dengan pemandangan kecil dan cahaya hangat di dalamnya | `gambar/infp-tamanRimbun2-*.jpg` |
| `bangau` | C. Burung Kertas | bangau origami, coretan jurnal | `gambar/infp-bangau-*.jpg` |
| `kosmos` | D. Kosmos Cat Air | nebula cat air, galaksi spiral, planet bercincin | `gambar/infp-kosmos-*.jpg` |
| `jendela` | E. Jendela Dunia Dalam | jendela bulat berisi bukit, pohon, seseorang menatap bulan | `gambar/infp-jendela-*.jpg` |
| `tamanKosmos` | F. Taman Kosmos | gabungan bagian yang disukai dari B (sulur yang mengalir) dan D (nebula cat air, planet bercincin): planet berpita dan berbayang dengan cincin debu bintang, bulan kecil di orbit putus-putus, untaian bunga melingkari planet, galaksi spiral, debu bintang di sepanjang sulur, tanpa elemen menjuntai | `gambar/infp-tamanKosmos-*.jpg` |

Pemilik menyukai B dan D. B diperkaya jadi B+, lalu B+ dinilai "kureng" di bagian wisteria dan gerbang, jadi diperbaiki jadi B++. Elemen yang menjuntai (wisteria) akhirnya dinilai kurang bagus; yang disukai adalah sulur B asli dan planet bercincin D, lalu digabung jadi F. Untuk mengganti motif INFP: salin isi varian ke fungsi `drawInfp` di `index.html`. Helper-nya sama (`rgba`, `line`, `circ`, `star`, `glow`, `mist`); helper khusus draf (`ripples`, `stars`, `fireflies`, `leaf`, `flower`, `halo`) ikut disalin. Untuk cahaya, pakai `glow(..., cx, cy)` dengan titik pusat (sprite, ringan), bukan `shadowBlur` per titik.

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
