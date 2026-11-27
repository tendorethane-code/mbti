// Kartu Piringan (ditolak, diganti Takaran)
// Diambil dari commit 6b587f5 (index.html). Memakai cardKit(R) dan helper di index.html versi itu.
// Untuk mencoba: tempel ke index.html, lalu tambahkan ke CARD_STYLES dan drawCard.

function cardPiringan(R,name,K){
  // Piringan: sampul album dengan seni abstrak dari skor, piringan hitam menyembul, daftar lagu = sumbu dan fungsi.
  const {W,H,x,dk,COL,IND,fam,F,rgba,rr,fit,txt,blob,weakOf}=K;
  const BG1=dk?'#0e0c12':'#f4efe7',INK=dk?'#f3eef7':'#221b2c',MUTE=dk?'rgba(243,238,247,.6)':'rgba(34,27,44,.6)';
  x.fillStyle=BG1;x.fillRect(0,0,W,H);blob(900,300,700,COL,dk?.30:.18);blob(150,1500,600,IND,dk?.22:.14);
  const sx=64,sy=150,sw=700;
  // piringan hitam (di belakang sampul)
  const vx=sx+sw+72,vy=sy+sw/2,vr=sw/2-14;
  x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=40;x.fillStyle='#111015';x.beginPath();x.arc(vx,vy,vr,0,Math.PI*2);x.fill();x.restore();
  for(let r=vr-12;r>130;r-=7){x.strokeStyle=`rgba(255,255,255,${r%21<7?.07:.03})`;x.lineWidth=1.5;x.beginPath();x.arc(vx,vy,r,0,Math.PI*2);x.stroke()}
  x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=18;x.beginPath();x.arc(vx,vy,vr-60,-1.1,-.55);x.stroke();x.beginPath();x.arc(vx,vy,vr-60,2.05,2.6);x.stroke();
  const lg=x.createLinearGradient(vx-120,vy-120,vx+120,vy+120);lg.addColorStop(0,COL);lg.addColorStop(1,IND);x.fillStyle=lg;x.beginPath();x.arc(vx,vy,120,0,Math.PI*2);x.fill();
  txt(R.hasType?R.type:'PK',vx,vy-34,F(800,40),'#ffffff','center');txt(R.fn?R.fn.slice(0,2).map(f=>f.f).join(' · '):'',vx,vy+56,F(700,22),'rgba(255,255,255,.85)','center');
  x.fillStyle='#111015';x.beginPath();x.arc(vx,vy,9,0,Math.PI*2);x.fill();
  // sampul: seni abstrak dari skor (lingkaran per sumbu, ukuran = kejelasan)
  x.save();x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=36;x.shadowOffsetY=14;rr(sx,sy,sw,sw,6,'#000');x.restore();
  x.save();x.beginPath();x.rect(sx,sy,sw,sw);x.clip();
  const bg=x.createLinearGradient(sx,sy,sx+sw,sy+sw);bg.addColorStop(0,dk?'#1b1424':'#fff6ee');bg.addColorStop(1,dk?'#0f0c16':'#f1e8f7');x.fillStyle=bg;x.fillRect(sx,sy,sw,sw);
  const spots=[[.28,.3],[.72,.26],[.5,.55],[.25,.78],[.78,.75]];
  AXW.filter(ax=>R.hasType&&R.ax[ax]!=null).forEach((ax,i)=>{const p=R.ax[ax],d=Math.abs(p-50),r=80+d*5.2,[fx,fy]=spots[i],cx=sx+fx*sw,cy=sy+fy*sw,g=x.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,rgba(i%2?IND:COL,.95));g.addColorStop(.6,rgba(i%2?IND:COL,.45));g.addColorStop(1,rgba(i%2?IND:COL,0));x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill()});
  for(let i=0;i<9;i++){x.strokeStyle=dk?'rgba(255,255,255,.10)':'rgba(255,255,255,.55)';x.lineWidth=2;x.beginPath();x.arc(sx+sw*.5,sy+sw*.55,60+i*48,0,Math.PI*2);x.stroke()}
  // butiran halus
  let sd=[...(R.type||'X')].reduce((s2,ch)=>s2*31+ch.charCodeAt(0),5)%2147483647;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
  for(let i=0;i<1600;i++){x.fillStyle=`rgba(${dk?255:0},${dk?255:0},${dk?255:0},${rnd()*.06})`;x.fillRect(sx+rnd()*sw,sy+rnd()*sw,2,2)}
  x.restore();
  if('letterSpacing' in x)x.letterSpacing='8px';txt((name||'Peta Kepribadian').toUpperCase(),sx+36,sy+64,F(800,24),dk?'#fff':'#221b2c');if('letterSpacing' in x)x.letterSpacing='0px';
  if(R.hasType){x.font=F(800,150);const tw=x.measureText(R.type).width;txt(R.type,sx+30,sy+sw-56,F(800,150),dk?'#fff':'#221b2c');if(R.id)txt('-'+R.id,sx+30+tw+6,sy+sw-56,F(800,70),dk?'#fff':'#221b2c')}
  rr(sx+sw-176,sy+30,146,38,8,dk?'rgba(255,255,255,.88)':'rgba(34,27,44,.88)');txt(`EDISI ${new Date().getFullYear()}`,sx+sw-103,sy+56,F(800,18),dk?'#111':'#fff','center');
  // judul album
  let y=sy+sw+88;
  txt(R.hasType?`${FAM[fam]}${R.strat?' · '+R.strat:''}`:'Hasil sementara',64,y,F(800,40),INK);y+=44;
  txt(`Album kepribadian ${name||'tanpa nama'} · ${today()}`,64,y,F(600,24),MUTE);y+=70;
  // daftar lagu
  const head=t=>{if('letterSpacing' in x)x.letterSpacing='6px';txt(t,64,y,F(800,22),COL);if('letterSpacing' in x)x.letterSpacing='0px';y+=48};
  head('SISI A');
  AXW.filter(ax=>R.hasType&&R.ax[ax]!=null).forEach((ax,i)=>{const p=R.ax[ax],right=p>=50,pp=Math.round(right?p:100-p),wk=weakOf(ax),t=(right?AX[ax][3]:AX[ax][2])+(wk?' (demo)':'');
    txt(String(i+1).padStart(2,'0'),64,y,F(700,26),MUTE);txt(t,128,y,F(800,30),INK);x.font=F(800,30);const tw=x.measureText(t).width;
    x.fillStyle=MUTE;for(let dx=128+tw+18;dx<880;dx+=14)x.fillRect(dx,y-8,4,4);txt(`${pp}%`,1016,y,F(800,30),wk?COL:INK,'right');y+=60});
  if(R.fn){y+=18;head('SISI B');R.fn.slice(0,4).forEach((f,i)=>{txt(String(i+1).padStart(2,'0'),64,y,F(700,26),MUTE);txt(`Fungsi ${f.f}`,128,y,F(800,30),INK);
    x.font=F(800,30);const tw=x.measureText(`Fungsi ${f.f}`).width;x.fillStyle=MUTE;for(let dx=128+tw+18;dx<880;dx+=14)x.fillRect(dx,y-8,4,4);txt(nmf(f.g),1016,y,F(800,30),INK,'right');y+=60})}
  if(R.hasType){const tags=['EI','SN','TF','JP'].filter(ax=>Math.abs(R.ax[ax]-50)>=10).map(ax=>{const p=R.ax[ax];return {EI:p>=50?(p>=80?'sangat introvert':'introvert'):(p<=20?'sangat ekstrovert':'ekstrovert'),SN:p>=50?'konseptual':'praktis',TF:p>=50?'berpegang pada nilai':'logis',JP:p>=50?'fleksibel':'terencana'}[ax]}).map(titleCase);
    if(tags.length){y+=26;rr(64,y,952,112,22,dk?'rgba(255,255,255,.06)':'rgba(34,27,44,.05)');if('letterSpacing' in x)x.letterSpacing='5px';txt('CATATAN SAMPUL',96,y+40,F(800,18),COL);if('letterSpacing' in x)x.letterSpacing='0px';x.font=F(700,28);txt(fit(tags.join(' · '),890),96,y+84,F(700,28),INK)}}
  txt('(demo) = masih tipis, bisa berubah',64,H-30,F(600,20),MUTE);txt(siteName(),1016,H-30,F(600,20),MUTE,'right');
}
