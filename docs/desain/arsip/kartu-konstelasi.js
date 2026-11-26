// Kartu Konstelasi (ditolak)
// Diambil dari commit bf3aa3d (index.html). Memakai cardKit(R) dan helper di index.html versi itu.
// Untuk mencoba: tempel ke index.html, lalu tambahkan ke CARD_STYLES dan drawCard.

function cardKonstelasi(R,name,K){
  // Konstelasi: 8 fungsi sebagai rasi bintang. Ukuran bintang = skor; garis = urutan 4 fungsi teratas.
  const {W,H,x,dk,COL,IND,fam,F,rgba,rr,fit,txt,blob,weakOf}=K;
  const sky=x.createLinearGradient(0,0,0,H);if(dk){sky.addColorStop(0,'#07061a');sky.addColorStop(.55,'#141038');sky.addColorStop(1,'#241a4a')}else{sky.addColorStop(0,'#fdf8ff');sky.addColorStop(.6,'#f3ecff');sky.addColorStop(1,'#ffe8e0')}
  x.fillStyle=sky;x.fillRect(0,0,W,H);
  const INK=dk?'#ffffff':'#1d1638',MUTE=dk?'rgba(255,255,255,.66)':'rgba(29,22,56,.62)',STAR=dk?'#ffffff':'#2d2266';
  blob(820,1500,620,COL,dk?.28:.22);blob(180,420,520,IND,dk?.3:.16);
  // bintang latar, acak tapi tetap untuk tipe yang sama
  let seed=[...(R.type||'X')+(name||'')].reduce((s,ch)=>s*31+ch.charCodeAt(0),7)%2147483647;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  for(let i=0;i<170;i++){const sx=rnd()*W,sy=rnd()*H,sr=rnd()*1.8+.4;x.fillStyle=dk?`rgba(255,255,255,${.25+rnd()*.6})`:`rgba(45,34,102,${.12+rnd()*.3})`;x.beginPath();x.arc(sx,sy,sr,0,Math.PI*2);x.fill()}
  if('letterSpacing' in x)x.letterSpacing='10px';txt('PETA KEPRIBADIAN',540,118,F(800,22),MUTE,'center');if('letterSpacing' in x)x.letterSpacing='0px';
  if(name){x.font=F(700,48);txt(fit(name,900),540,186,F(700,48),INK,'center')}
  if(R.fn){
    const cx=540,cy=640,pos={Fi:[-.62,-.55],Fe:[.70,-.38],Ti:[-.18,-.92],Te:[.28,.70],Ni:[.86,.32],Ne:[-.86,.18],Si:[.05,-.08],Se:[-.45,.82]},P=f=>[cx+pos[f][0]*380,cy+pos[f][1]*330];
    x.strokeStyle=dk?'rgba(255,255,255,.12)':'rgba(45,34,102,.14)';x.lineWidth=1.5;x.setLineDash([4,8]);x.beginPath();R.fn.forEach((f,i)=>{const[a,b]=P(f.f);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke();x.setLineDash([]);
    x.strokeStyle=rgba(COL,.9);x.lineWidth=4;x.lineCap='round';x.beginPath();R.fn.slice(0,4).forEach((f,i)=>{const[a,b]=P(f.f);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke();
    R.fn.forEach((f,i)=>{const[a,b]=P(f.f),r=6+(f.g-1)/4*20;
      const g=x.createRadialGradient(a,b,0,a,b,r*4);g.addColorStop(0,i<4?rgba(COL,.55):(dk?'rgba(255,255,255,.18)':'rgba(45,34,102,.12)'));g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(a,b,r*4,0,Math.PI*2);x.fill();
      x.fillStyle=i===0?COL:STAR;x.beginPath();x.arc(a,b,r,0,Math.PI*2);x.fill();
      txt(f.f,a,b-r-18,F(800,i<4?34:26),i<4?INK:MUTE,'center');txt(String(i+1),a,b+r+30,F(700,20),MUTE,'center')});
    txt('Rasi fungsimu: makin besar bintang, makin kuat fungsinya',540,1050,F(600,22),MUTE,'center');
  }
  if(R.hasType){
    if('letterSpacing' in x)x.letterSpacing='18px';x.font=F(800,150);txt(R.type,540+9,1250,F(800,150),INK,'center');if('letterSpacing' in x)x.letterSpacing='0px';
    if(R.id)txt('— '+R.id+' —',540,1316,F(800,40),COL,'center');
    x.font=F(700,32);txt(fit(`${FAM[fam]}${R.strat?' · '+R.strat:''}`,900),540,1380,F(700,32),INK,'center');
    let cx=0;const chips=AXW.filter(ax=>R.ax[ax]!=null).map(ax=>{const p=R.ax[ax],right=p>=50,pp=Math.round(right?p:100-p);return [`${right?AX[ax][3]:AX[ax][2]} ${pp}%`,weakOf(ax)]});
    x.font=F(700,26);const ws=chips.map(c=>x.measureText(c[0]).width+44);
    const rows=[[0,1,2],[3,4]];rows.forEach((row,ri)=>{const tw=row.reduce((s,i)=>s+ws[i],0)+(row.length-1)*14;let sx=540-tw/2;row.forEach(i=>{const y=1450+ri*76;
      if(chips[i][1]){x.strokeStyle=rgba(COL,.9);x.lineWidth=2.5;x.setLineDash([8,7]);x.beginPath();if(x.roundRect)x.roundRect(sx,y,ws[i],56,28);else x.rect(sx,y,ws[i],56);x.stroke();x.setLineDash([])}
      else rr(sx,y,ws[i],56,28,dk?'rgba(255,255,255,.10)':'rgba(45,34,102,.08)');
      txt(chips[i][0],sx+ws[i]/2,y+37,F(700,26),INK,'center');sx+=ws[i]+14})});
    txt('Garis putus-putus = skor tipis atau kurang stabil',540,1640,F(600,20),MUTE,'center');
  }
  x.font=F(600,26);const s1='Coba juga: ',s2=siteName(),w1=x.measureText(s1).width;x.font=F(800,26);const w2=x.measureText(s2).width,sx=540-(w1+w2)/2;
  txt(s1,sx,H-70,F(600,26),MUTE);txt(s2,sx+w1,H-70,F(800,26),INK);
}
