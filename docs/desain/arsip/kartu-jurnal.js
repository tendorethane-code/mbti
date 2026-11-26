// Kartu Jurnal (ditolak)
// Diambil dari commit bf3aa3d (index.html). Memakai cardKit(R) dan helper di index.html versi itu.
// Untuk mencoba: tempel ke index.html, lalu tambahkan ke CARD_STYLES dan drawCard.

function cardJurnal(R,name,K){
  // Jurnal: kertas bergaris, polaroid berisi tipe, catatan tempel untuk tiap sumbu. Catatan miring = tipis.
  const {W,H,x,dk,COL,IND,fam,F,rgba,rr,fit,txt,weakOf}=K;
  const PAPER=dk?'#1d1a17':'#f7f1e6',RULE=dk?'rgba(255,255,255,.06)':'rgba(70,90,160,.13)',INK=dk?'#f1ebe0':'#2a241d',MUTE=dk?'rgba(241,235,224,.6)':'rgba(42,36,29,.58)';
  const HAND=(w,z)=>`${w} ${z}px Caveat, 'Segoe Print', cursive`;
  x.fillStyle=PAPER;x.fillRect(0,0,W,H);
  for(let y=210;y<H-80;y+=56){x.fillStyle=RULE;x.fillRect(0,y,W,2)}
  x.fillStyle=dk?'rgba(255,120,100,.25)':'rgba(220,80,70,.35)';x.fillRect(118,0,3,H);
  const tape=(cx,cy,w,a)=>{x.save();x.translate(cx,cy);x.rotate(a);x.fillStyle=dk?'rgba(255,255,255,.16)':'rgba(255,255,255,.65)';x.fillRect(-w/2,-20,w,40);x.restore()};
  txt(fit(name?`Catatan kepribadian ${name}`:'Catatan kepribadianku',880),150,142,HAND(700,64),INK);
  txt(today(),1008,190,F(600,22),MUTE,'right');
  // polaroid
  x.save();x.translate(540,640);x.rotate(-.035);
  x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=30;x.shadowOffsetY=12;rr(-330,-330,660,700,10,dk?'#2a2622':'#ffffff');x.shadowColor='transparent';
  const g=x.createLinearGradient(-300,-300,300,300);g.addColorStop(0,COL);g.addColorStop(1,IND);rr(-300,-300,600,520,6,g);
  for(let i=0;i<9;i++){x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=2;x.beginPath();x.arc(140,-180,40+i*46,0,Math.PI*2);x.stroke()}
  if(R.hasType){x.font=F(800,180);txt(R.type,0,-10,F(800,180),'#ffffff','center');if(R.id)txt('-'+R.id,0,90,F(800,70),'rgba(255,255,255,.9)','center')}
  else txt('Sementara',0,0,F(800,90),'#ffffff','center');
  txt(R.hasType?`${FAM[fam]}${R.strat?' · '+R.strat:''}`:'',0,300,HAND(700,46),dk?'#f1ebe0':'#2a241d','center');
  x.restore();tape(540,300,200,.04);
  // catatan tempel
  if(R.hasType){
    const notes=AXW.filter(ax=>R.ax[ax]!=null).map(ax=>{const p=R.ax[ax],right=p>=50,pp=Math.round(right?p:100-p);return {w:right?AX[ax][3]:AX[ax][2],pp,wk:weakOf(ax)}});
    const pal=dk?['#5b4a2a','#3d4a6b','#5a3446','#2f5245','#4f3f63']:['#ffe58f','#cfe3ff','#ffd1dc','#c9f2d9','#e6d6ff'];
    const spots=[[230,1120,-.06],[540,1110,.04],[850,1125,-.03],[385,1360,.05],[700,1355,-.05]];
    notes.forEach((n,i)=>{const[cx,cy,a]=spots[i];x.save();x.translate(cx,cy);x.rotate(a+(n.wk?.05:0));x.shadowColor='rgba(0,0,0,.18)';x.shadowBlur=16;x.shadowOffsetY=6;rr(-135,-95,270,190,6,pal[i]);x.shadowColor='transparent';
      txt(n.w,0,-28,F(800,30),INK,'center');txt(`${n.pp}%`,0,40,HAND(700,72),INK,'center');if(n.wk)txt(n.wk==='TIPIS'?'(masih tipis)':'(kurang stabil)',0,78,HAND(700,30),MUTE,'center');x.restore();tape(cx,cy-95,90,a*2)});
  }
  let y=1560;
  if(R.fits){txt('Paling cocok:',150,y,HAND(700,44),MUTE);txt(R.fits.slice(0,3).map(f=>`${f.t} ${nmf(f.v)}`).join('   '),150,y+58,F(800,34),INK)}
  if(R.fn){txt('Fungsi:',150,y+130,HAND(700,44),MUTE);txt(R.fn.slice(0,4).map(f=>f.f).join(' → '),300,y+130,F(800,34),INK)}
  txt(`coba juga di ${siteName()}`,540,H-60,HAND(700,36),MUTE,'center');
}
