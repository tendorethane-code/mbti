// Kartu Paspor (ditolak)
// Diambil dari commit 315618a (index.html). Memakai cardKit(R) dan helper di index.html versi itu.
// Untuk mencoba: tempel ke index.html, lalu tambahkan ke CARD_STYLES dan drawCard.

function cardPaspor(R,name,K){
  // Paspor kepribadian: monogram tipe, kolom identitas, cap per sumbu (cap putus-putus = tipis), baris kode di bawah.
  const {W,H,x,dk,COL,IND,fam,F,rgba,rr,fit,txt,blob,weakOf}=K;
  const PAPER=dk?'#14121b':'#f6f2ea',INK=dk?'#efeaf7':'#231d2e',MUTE=dk?'rgba(239,234,247,.6)':'rgba(35,29,46,.6)',PANEL=dk?'#1c1926':'#fffdf8';
  const MONO=(w,z)=>`${w} ${z}px ui-monospace, 'SF Mono', Menlo, Consolas, monospace`;
  x.fillStyle=PAPER;x.fillRect(0,0,W,H);blob(980,140,520,COL,dk?.25:.16);blob(80,1300,560,IND,dk?.18:.12);
  // pola pengaman (guilloche)
  x.lineWidth=1.2;for(let k=0;k<26;k++){x.strokeStyle=rgba(k%2?COL:IND,dk?.10:.12);x.beginPath();for(let i=0;i<=W;i+=6){const y=250+k*9+Math.sin(i/58+k*.7)*26+Math.sin(i/23+k)*7;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()}
  if('letterSpacing' in x)x.letterSpacing='8px';txt('PASPOR KEPRIBADIAN',72,128,F(800,30),INK);txt('PETA KEPRIBADIAN · PK',72,170,F(700,20),COL);if('letterSpacing' in x)x.letterSpacing='0px';
  // lambang: lingkaran dengan 4 kuadran family
  const ex=944,ey=140;['NT','NF','SJ','SP'].forEach((f,i)=>{x.fillStyle=f===fam?COL:rgba(IND,.25);x.beginPath();x.moveTo(ex,ey);x.arc(ex,ey,46,i*Math.PI/2-Math.PI/2,(i+1)*Math.PI/2-Math.PI/2);x.closePath();x.fill()});x.strokeStyle=INK;x.lineWidth=3;x.beginPath();x.arc(ex,ey,46,0,Math.PI*2);x.stroke();
  // panel identitas
  x.save();x.shadowColor='rgba(0,0,0,.18)';x.shadowBlur=30;x.shadowOffsetY=10;rr(56,500,968,640,30,PANEL);x.restore();
  const g=x.createLinearGradient(96,540,416,940);g.addColorStop(0,COL);g.addColorStop(1,IND);rr(96,540,320,400,22,g);
  if(R.hasType){[...R.type].forEach((L,i)=>txt(L,96+80+(i%2)*160,540+150+Math.floor(i/2)*170,F(800,130),'rgba(255,255,255,.95)','center'))}
  if(R.id){rr(330,900,72,56,14,PANEL);txt(R.id,366,940,F(800,34),COL,'center')}
  const field=(lb,v,y,big)=>{if('letterSpacing' in x)x.letterSpacing='3px';txt(lb,460,y,F(700,18),MUTE);if('letterSpacing' in x)x.letterSpacing='0px';x.font=F(800,big||34);txt(fit(v,530),460,y+(big?50:42),F(800,big||34),INK)};
  field('NAMA',name||'Tanpa nama',580);field('TIPE',R.hasType?`${R.type}${R.id?'-'+R.id:''}`:'Sementara',680,52);
  field('FAMILY',R.hasType?FAM[fam]:'-',800);field('STRATEGI',R.strat||'-',890,28);
  field('FUNGSI UTAMA',R.fn?R.fn.slice(0,2).map(f=>f.f).join(' · '):'-',980);
  txt(`Diterbitkan ${today()}`,96,1100,F(600,22),MUTE);
  // cap per sumbu
  if('letterSpacing' in x)x.letterSpacing='6px';txt('CAP PERJALANAN',72,1230,F(800,22),MUTE);if('letterSpacing' in x)x.letterSpacing='0px';
  const spots=[[200,1390,-.18],[470,1350,.12],[760,1400,-.08],[320,1610,.16],[640,1620,-.14],[900,1600,.1]];
  AXW.filter(ax=>R.hasType&&R.ax[ax]!=null).forEach((ax,i)=>{const p=R.ax[ax],right=p>=50,pp=Math.round(right?p:100-p),wk=weakOf(ax),[cx,cy,a]=spots[i],col=i%2?IND:COL;
    x.save();x.translate(cx,cy);x.rotate(a);x.globalAlpha=.9;x.strokeStyle=col;x.lineWidth=5;if(wk)x.setLineDash([10,8]);
    if(i%2){x.beginPath();if(x.roundRect)x.roundRect(-118,-82,236,164,18);else x.rect(-118,-82,236,164);x.stroke()}else{x.beginPath();x.arc(0,0,105,0,Math.PI*2);x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,90,0,Math.PI*2);x.stroke()}
    x.setLineDash([]);if('letterSpacing' in x)x.letterSpacing='3px';txt((right?AX[ax][3]:AX[ax][2]).toUpperCase(),0,-30,F(800,19),col,'center');if('letterSpacing' in x)x.letterSpacing='0px';
    txt(`${pp}%`,0,32,F(800,54),col,'center');txt(wk?(wk==='TIPIS'?'TIPIS':'BELUM STABIL'):'DISAHKAN',0,64,F(800,15),col,'center');x.restore()});
  // baris kode seperti paspor
  const nm2=(name||'TANPA NAMA').toUpperCase().replace(/[^A-Z0-9]+/g,'<');
  const l1=`P<PK<${nm2}<<${R.hasType?R.type:'XXXX'}`.padEnd(40,'<').slice(0,40);
  const l2=(R.hasType?AXW.filter(ax=>R.ax[ax]!=null).map(ax=>{const p=R.ax[ax];return Math.round(p>=50?p:100-p)+(p>=50?POS[ax]:AX[ax][0])}).join('')+'<<'+(R.fn?R.fn.slice(0,4).map(f=>f.f.toUpperCase()).join('<'):''):'').padEnd(40,'<').slice(0,40);
  rr(0,H-210,W,210,0,dk?'rgba(255,255,255,.04)':'rgba(35,29,46,.05)');
  if('letterSpacing' in x)x.letterSpacing='5px';txt(l1,72,H-140,MONO(700,30),INK);txt(l2,72,H-92,MONO(700,30),INK);if('letterSpacing' in x)x.letterSpacing='0px';
  txt(siteName(),1008,H-34,F(600,20),MUTE,'right');
}
