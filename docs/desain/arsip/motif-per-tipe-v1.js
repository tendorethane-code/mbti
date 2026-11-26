// Motif sampul per tipe, versi pertama (commit d3abb91), sebelum diperkaya.
// drawMotif(type,dark) dan drawStamp(type,dark); butuh typePal/famOf/FAM dari core.js.

// ---------- Motif sampul PDF: satu motif khas per tipe, memakai "bahasa" family-nya ----------
// NT: kisi/geometri · NF: riak/lingkaran · SJ: garis rapi · SP: diagonal dinamis. Ditambah cap family.
function drawMotif(type,dark){
  const W=1240,H=1767,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const P=typePal(type,dark),A=P.a,B=P.b,fx=W*.84,fy=H*.15;
  let sd=[...type].reduce((s,ch)=>s*31+ch.charCodeAt(0),7)%2147483647;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
  const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
  const grad=(a1,a2)=>{const g=x.createLinearGradient(W*.2,H*.5,W,0);g.addColorStop(0,rgba(B,a2==null?a1:a2));g.addColorStop(1,rgba(A,a1));return g};
  const line=(x1,y1,x2,y2)=>{x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke()};
  const circ=(cx,cy,r,fill)=>{x.beginPath();x.arc(cx,cy,Math.max(r,.1),0,Math.PI*2);fill?x.fill():x.stroke()};
  const grid=(s,a)=>{x.strokeStyle=grad(a);x.lineWidth=1.4;for(let i=0;i<=W;i+=s)line(i,0,i,H);for(let j=0;j<=H;j+=s)line(0,j,W,j)};
  const star=(cx,cy,r)=>{x.beginPath();for(let k=0;k<8;k++){const an=k*Math.PI/4,rr=k%2?r*.28:r;x.lineTo(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr)}x.closePath();x.fill()};
  x.lineCap='round';x.lineJoin='round';
  ({
    // Arsitek: kisi blueprint, semua garis mengerucut ke satu titik (Ni: satu kesimpulan).
    INTJ(){grid(56,.35);x.strokeStyle=grad(.7,.25);x.lineWidth=2;for(let i=0;i<30;i++){const t=i/29;line(t*W*1.1-W*.1,H,fx,fy);line(0,H*.25+t*H*.75,fx,fy)}
      x.fillStyle=rgba(A,.9);for(let r=60;r<420;r+=60){x.save();x.translate(fx,fy);x.rotate(Math.PI/4);x.strokeStyle=rgba(A,.8-r/600);x.lineWidth=2.5;x.strokeRect(-r/2,-r/2,r,r);x.restore()}circ(fx,fy,10,1)},
    // Logika: pembagian rekursif persegi emas + spiral (Ti: membedah sampai dasar).
    INTP(){grid(56,.25);let rx=W*.2,ry=-H*.05,rw=W*.95,rh=rw/1.618;x.lineWidth=2.5;
      for(let i=0;i<11;i++){x.strokeStyle=rgba(i%2?B:A,.85-i*.05);x.strokeRect(rx,ry,rw,rh);const s=Math.min(rw,rh);x.beginPath();
        if(i%4===0){x.arc(rx+s,ry+s,s,Math.PI,1.5*Math.PI);x.stroke();rx+=s;rw-=s}
        else if(i%4===1){x.arc(rx,ry+s,s,1.5*Math.PI,2*Math.PI);x.stroke();ry+=s;rh-=s}
        else if(i%4===2){x.arc(rx+rw-s,ry+rh-s,s,0,.5*Math.PI);x.stroke();rw-=s}
        else{x.arc(rx+s,ry+rh-s,s,.5*Math.PI,Math.PI);x.stroke();rh-=s}}},
    // Komandan: anak tangga naik menuju titik tujuan, panah chevron.
    ENTJ(){grid(56,.25);x.lineWidth=3;for(let i=0;i<9;i++){const w=70,h=40+i*30,X=W*.42+i*(w+8),Y=H*.42-i*36;x.strokeStyle=rgba(i%2?B:A,.35+i*.07);x.strokeRect(X,Y-h,w,h);x.fillStyle=rgba(A,.05+i*.025);x.fillRect(X,Y-h,w,h)}
      x.strokeStyle=rgba(A,.9);x.lineWidth=6;for(let i=0;i<4;i++){const o=i*44;x.beginPath();x.moveTo(fx-90,fy+70-o+60);x.lineTo(fx,fy-o+60);x.lineTo(fx+90,fy+70-o+60);x.stroke()}},
    // Penemu: cabang-cabang kemungkinan dari satu ide (Ne), ujungnya lingkaran kecil.
    ENTP(){grid(56,.22);const br=(X,Y,an,len,d)=>{if(d>7||len<16){x.fillStyle=rgba(d%2?A:B,.9);circ(X,Y,5+rnd()*5,1);return}const X2=X+Math.cos(an)*len,Y2=Y+Math.sin(an)*len;x.strokeStyle=rgba(d%2?B:A,.9-d*.07);x.lineWidth=Math.max(1.5,7-d*.7);line(X,Y,X2,Y2);
        const n=rnd()<.35?3:2;for(let k=0;k<n;k++)br(X2,Y2,an+(k-(n-1)/2)*(.5+rnd()*.35),len*(.68+rnd()*.12),d+1)};br(W*.86,H*.44,-Math.PI/2.1,150,0)},
    // Mediator: riak dari beberapa tetesan yang saling bertemu, bulan sabit, dan bintang (dunia dalam yang kaya).
    INFP(){const drops=[[fx,fy,1],[W*.6,H*.06,.7],[W*1.02,H*.36,.6]];
      drops.forEach(([cx,cy,k],di)=>{for(let r=26;r<900*k;r+=24){const wob=4+r*.012,ph=di*1.7+r*.013;x.beginPath();for(let a=0;a<=Math.PI*2+.01;a+=.04){const rr=r+Math.sin(a*5+ph)*wob*.4+Math.sin(a*3-ph)*wob*.3;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}
        x.strokeStyle=rgba((r/24)%2<1?A:B,Math.max(0,.75-r/(1100*k)));x.lineWidth=r<200?2.4:1.6;x.stroke()}});
      // bulan sabit
      const m=document.createElement('canvas');m.width=m.height=420;const q=m.getContext('2d'),g=q.createLinearGradient(60,60,360,360);g.addColorStop(0,A);g.addColorStop(1,B);q.fillStyle=g;q.beginPath();q.arc(210,210,150,0,Math.PI*2);q.fill();q.globalCompositeOperation='destination-out';q.beginPath();q.arc(275,165,140,0,Math.PI*2);q.fill();
      x.save();x.shadowColor=rgba(A,.9);x.shadowBlur=60;x.globalAlpha=.95;x.drawImage(m,fx-250,fy-170,330,330);x.restore();
      for(let i=0;i<70;i++){const X=W*.35+rnd()*W*.65,Y=rnd()*H*.55,r=2+rnd()*rnd()*14;x.fillStyle=rgba(rnd()<.5?A:'#ffffff',.35+rnd()*.6);r>8?star(X,Y,r):circ(X,Y,r*.35,1)}},
    // Advokat: mandala berlapis dengan kelopak, simetris dan dalam.
    INFJ(){x.save();x.translate(fx,fy);for(let ring=0;ring<7;ring++){const r=70+ring*70,n=8+ring*4;x.strokeStyle=rgba(ring%2?B:A,.85-ring*.09);x.lineWidth=2;circ(0,0,r);
        for(let k=0;k<n;k++){x.save();x.rotate(k*2*Math.PI/n);x.beginPath();x.ellipse(r+32,0,32,12,0,0,Math.PI*2);x.stroke();x.restore()}}
      x.lineWidth=1;x.strokeStyle=rgba(A,.35);for(let k=0;k<48;k++){x.rotate(Math.PI/24);line(0,0,620,0)}x.restore();x.fillStyle=rgba(A,.9);circ(fx,fy,14,1)},
    // Protagonis: "bunga kehidupan", lingkaran-lingkaran yang saling terhubung (orang-orang di sekitarnya).
    ENFJ(){const R=78;for(let row=-9;row<=9;row++)for(let col=-9;col<=9;col++){const X=fx+col*R+(row%2?R/2:0),Y=fy+row*R*.866,d=Math.hypot(X-fx,Y-fy);if(d>720)continue;x.strokeStyle=rgba(d<300?A:B,Math.max(0,.85-d/800));x.lineWidth=2;circ(X,Y,R)}
      x.fillStyle=rgba(A,.9);circ(fx,fy,12,1)},
    // Juru kampanye: gelembung ide yang meletup ke segala arah.
    ENFP(){for(let i=0;i<150;i++){const an=rnd()*Math.PI*2,d=Math.pow(rnd(),.7)*720,X=fx+Math.cos(an)*d,Y=fy+Math.sin(an)*d*1.1,r=6+rnd()*58*(1-d/900);const col=rnd()<.5?A:B;
        x.strokeStyle=rgba(col,.8);x.lineWidth=2.5;circ(X,Y,r);if(rnd()<.35){x.fillStyle=rgba(col,.28);circ(X,Y,r,1)}if(r>30&&rnd()<.5){x.fillStyle=rgba('#ffffff',.5);circ(X-r*.35,Y-r*.35,r*.15,1)}}},
    // Logistikus: buku besar, garis rapi dengan margin ganda dan tanda centang kecil.
    ISTJ(){x.lineWidth=1.6;for(let j=40,i=0;j<H;j+=34,i++){x.strokeStyle=rgba(i%5===0?A:B,i%5===0?.75:.4);line(0,j,W,j);if(i%5===0){x.fillStyle=rgba(A,.8);x.font='700 20px Manrope, sans-serif';x.fillText(String(i).padStart(3,'0'),W*.5,j-8)}}
      x.strokeStyle=rgba(A,.8);x.lineWidth=2.5;line(W*.56,0,W*.56,H);line(W*.567,0,W*.567,H);
      x.strokeStyle=rgba(A,.9);x.lineWidth=4;for(let i=0;i<9;i++){const X=W*.62+(i%3)*150,Y=110+Math.floor(i/3)*170+i*6;x.beginPath();x.moveTo(X,Y);x.lineTo(X+16,Y+16);x.lineTo(X+44,Y-18);x.stroke()}},
    // Pelindung: anyaman, benang-benang yang saling menjaga.
    ISFJ(){const s=64;for(let r=0;r*s<H;r++)for(let k=0;k*s<W;k++){const X=k*s,Y=r*s,hz=(r+k)%2===0;x.fillStyle=rgba(hz?A:B,.12);x.strokeStyle=rgba(hz?A:B,.5);x.lineWidth=2;
        x.beginPath();if(x.roundRect)hz?x.roundRect(X+4,Y+16,s-8,s-32,14):x.roundRect(X+16,Y+4,s-32,s-8,14);else x.rect(X+4,Y+4,s-8,s-8);x.fill();x.stroke()}},
    // Eksekutif: susunan bata yang kokoh, beberapa terisi penuh.
    ESTJ(){const bw=150,bh=56;for(let r=0;r*bh<H;r++)for(let k=-1;k*bw<W;k++){const X=k*bw+(r%2?bw/2:0),Y=r*bh;x.strokeStyle=rgba(r%3?B:A,.5);x.lineWidth=2;x.strokeRect(X+5,Y+5,bw-10,bh-10);if(rnd()<.14){x.fillStyle=rgba(A,.25);x.fillRect(X+5,Y+5,bw-10,bh-10)}}},
    // Konsul: untaian bendera dan lengkung girlang, suasana kumpul yang hangat.
    ESFJ(){for(let j=0;j<12;j++){const Y=40+j*150,amp=46;x.strokeStyle=rgba(j%2?B:A,.75);x.lineWidth=2.5;x.beginPath();for(let X=-20;X<W+40;X+=8)x.lineTo(X,Y+Math.abs(Math.sin(X/120*Math.PI))*amp);x.stroke();
        for(let X=60;X<W;X+=120){const yy=Y+amp;x.fillStyle=rgba((X/120+j)%2<1?A:B,.38);x.beginPath();x.moveTo(X-26,yy-6);x.lineTo(X+26,yy-6);x.lineTo(X,yy+44);x.closePath();x.fill()}}},
    // Virtuoso: garis potong teknis, crosshair presisi, dan baut.
    ISTP(){x.lineWidth=2;x.setLineDash([46,12,6,12]);for(let i=-H;i<W+H;i+=58){x.strokeStyle=rgba(B,.5);line(i,0,i-H*.62,H)}x.setLineDash([]);
      x.strokeStyle=rgba(A,.9);x.lineWidth=3;[90,170,260].forEach(r=>circ(fx,fy,r));line(fx-340,fy,fx+340,fy);line(fx,fy-340,fx,fy+340);for(let k=0;k<72;k++){const an=k*Math.PI/36,l=k%6?12:28;line(fx+Math.cos(an)*260,fy+Math.sin(an)*260,fx+Math.cos(an)*(260+l),fy+Math.sin(an)*(260+l))}
      for(let i=0;i<7;i++){const X=W*.3+rnd()*W*.6,Y=H*.05+rnd()*H*.5;x.save();x.translate(X,Y);x.beginPath();for(let k=0;k<6;k++)x.lineTo(Math.cos(k*Math.PI/3)*22,Math.sin(k*Math.PI/3)*22);x.closePath();x.strokeStyle=rgba(A,.8);x.stroke();circ(0,0,8);x.restore()}},
    // Petualang seni: sapuan kuas diagonal yang lembut dan tidak seragam.
    ISFP(){for(let i=0;i<46;i++){const X=W*.2+rnd()*W*.95,Y=rnd()*H*.75,len=180+rnd()*420,an=-Math.PI*.3+(rnd()-.5)*.35,w=6+rnd()*26,col=rnd()<.55?A:B;
        const dx=Math.cos(an)*len,dy=Math.sin(an)*len,nx=-Math.sin(an),ny=Math.cos(an),bend=(rnd()-.5)*80;x.fillStyle=rgba(col,.18+rnd()*.35);x.beginPath();x.moveTo(X,Y);
        x.quadraticCurveTo(X+dx/2+nx*(bend+w),Y+dy/2+ny*(bend+w),X+dx,Y+dy);x.quadraticCurveTo(X+dx/2+nx*(bend-w),Y+dy/2+ny*(bend-w),X,Y);x.fill()}
      for(let i=0;i<10;i++){const X=W*.5+rnd()*W*.5,Y=rnd()*H*.4;x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI);x.fillStyle=rgba(B,.6);x.beginPath();x.ellipse(0,0,22,9,0,0,Math.PI*2);x.fill();x.restore()}},
    // Pengusaha: garis kecepatan dan kilat, semuanya bergerak dari satu titik aksi.
    ESTP(){for(let i=0;i<70;i++){const an=Math.PI*(.55+rnd()*.5),d0=60+rnd()*160,len=200+rnd()*700;x.strokeStyle=rgba(rnd()<.5?A:B,.25+rnd()*.6);x.lineWidth=1.5+rnd()*5;line(fx+Math.cos(an)*d0,fy+Math.sin(an)*d0,fx+Math.cos(an)*(d0+len),fy+Math.sin(an)*(d0+len))}
      x.fillStyle=rgba(A,.9);[[fx-40,fy-60,1],[W*.55,H*.2,.6],[W*.95,H*.42,.5]].forEach(([X,Y,k])=>{x.beginPath();x.moveTo(X+20*k,Y-90*k);x.lineTo(X-30*k,Y+10*k);x.lineTo(X+2*k,Y+10*k);x.lineTo(X-18*k,Y+90*k);x.lineTo(X+36*k,Y-14*k);x.lineTo(X+4*k,Y-14*k);x.closePath();x.fill()})},
    // Penghibur: konfeti, pita bergelombang, dan kilau.
    ESFP(){for(let s=0;s<6;s++){x.strokeStyle=rgba(s%2?B:A,.65);x.lineWidth=9;x.beginPath();for(let t=0;t<=1;t+=.01){const X=W*.25+t*W*.9+s*40,Y=-60+t*H*.7+s*90+Math.sin(t*16+s)*26;x.lineTo(X-s*120,Y)}x.stroke()}
      for(let i=0;i<120;i++){const X=W*.25+rnd()*W*.8,Y=rnd()*H*.6,col=rnd()<.5?A:B;x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI);x.fillStyle=rgba(col,.5+rnd()*.45);const k=rnd();if(k<.5)x.fillRect(-10,-4,20,8);else if(k<.8)circ(0,0,6,1);else{x.fillStyle=rgba('#ffffff',.8);star(0,0,12)}x.restore()}}
  })[type]();
  // Pudar dari titik fokus (pojok kanan atas) supaya teks di sampul tetap mudah dibaca.
  x.globalCompositeOperation='destination-in';const m=x.createRadialGradient(fx,fy,0,fx,fy,W*.95);m.addColorStop(0,'rgba(0,0,0,1)');m.addColorStop(.3,'rgba(0,0,0,.75)');m.addColorStop(.58,'rgba(0,0,0,.16)');m.addColorStop(.82,'rgba(0,0,0,0)');x.fillStyle=m;x.fillRect(0,0,W,H);
  return c;
}
function drawStamp(type,dark){
  // Cap family: stempel bulat dengan nama family melingkar dan simbol motif family di tengah.
  const S=600,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),P=typePal(type,dark),f=famOf(type),cx=S/2,cy=S/2;
  const g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,P.a);g.addColorStop(1,P.b);x.strokeStyle=g;x.fillStyle=g;
  x.translate(cx,cy);x.rotate(-.14);x.translate(-cx,-cy);
  x.lineWidth=12;x.beginPath();x.arc(cx,cy,280,0,Math.PI*2);x.stroke();x.lineWidth=4;x.beginPath();x.arc(cx,cy,256,0,Math.PI*2);x.stroke();x.beginPath();x.arc(cx,cy,176,0,Math.PI*2);x.stroke();
  const label=`${FAM[f].toUpperCase()} · ${f} · ${FAM[f].toUpperCase()} · ${f} · `;x.font='800 44px Manrope, system-ui, sans-serif';
  const tot=[...label].reduce((s,ch)=>s+x.measureText(ch).width,0),sp=(2*Math.PI*216-tot)/label.length;let an=-Math.PI/2;
  for(const ch of label){const w=x.measureText(ch).width;an+=(w/2+sp/2)/216;x.save();x.translate(cx+Math.cos(an)*216,cy+Math.sin(an)*216);x.rotate(an+Math.PI/2);x.textAlign='center';x.fillText(ch,0,15);x.restore();an+=(w/2+sp/2)/216}
  // simbol family
  x.lineWidth=7;x.lineCap='round';x.save();x.beginPath();x.arc(cx,cy,150,0,Math.PI*2);x.clip();
  if(f==='NT'){for(let i=-3;i<=3;i++){x.beginPath();x.moveTo(cx+i*42,cy-150);x.lineTo(cx+i*42,cy+150);x.moveTo(cx-150,cy+i*42);x.lineTo(cx+150,cy+i*42);x.lineWidth=3;x.stroke()}x.lineWidth=9;x.beginPath();x.moveTo(cx,cy-92);x.lineTo(cx+92,cy);x.lineTo(cx,cy+92);x.lineTo(cx-92,cy);x.closePath();x.stroke()}
  else if(f==='NF'){[34,70,106,142].forEach((r,i)=>{x.lineWidth=i?5:9;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke()});x.beginPath();x.arc(cx,cy,12,0,Math.PI*2);x.fill()}
  else if(f==='SJ'){for(let i=-3;i<=3;i++){x.lineWidth=i===0?12:5;x.beginPath();x.moveTo(cx-120,cy+i*38);x.lineTo(cx+120,cy+i*38);x.stroke()}}
  else{for(let i=-4;i<=4;i++){x.lineWidth=5;x.beginPath();x.moveTo(cx+i*44-150,cy+150);x.lineTo(cx+i*44+150,cy-150);x.stroke()}x.lineWidth=10;x.beginPath();x.moveTo(cx-70,cy+70);x.lineTo(cx+70,cy-70);x.moveTo(cx+10,cy-70);x.lineTo(cx+70,cy-70);x.lineTo(cx+70,cy-10);x.stroke()}
  x.restore();
  // tekstur tinta: bintik-bintik kecil yang tidak tercetak, seperti cap sungguhan
  let sd=[...f].reduce((s,ch)=>s*31+ch.charCodeAt(0),11);const rnd=()=>(sd=sd*16807%2147483647)/2147483647;x.globalCompositeOperation='destination-out';
  for(let i=0;i<900;i++){x.fillStyle=`rgba(0,0,0,${.25+rnd()*.6})`;x.beginPath();x.arc(rnd()*S,rnd()*S,rnd()*3.2,0,Math.PI*2);x.fill()}
  return c;
}
