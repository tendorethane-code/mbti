// Draf motif sampul INFP. draftInfp(varian, dark) -> canvas 1240x1767 (ukuran motif sampul PDF).
// Varian: malam (A, dipakai sekarang), taman (B), tamanRimbun (B+), tamanRimbun2 (B++), bangau (C), kosmos (D), jendela (E), tamanKosmos (F = B + D).
// Butuh typePal() dari core.js. Lihat pratinjau-infp.html untuk melihat semuanya sekaligus.
// Untuk memakai salah satu: salin isi varian ke fungsi drawInfp di index.html (helper-nya sama).
function draftInfp(v,dark){
  const W=1240,H=1767,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const P=typePal('INFP',dark),A=P.a,B=P.b,LT=dark?'#ffffff':B,fx=W*.84,fy=H*.15;
  let sd=97531+v.length*13;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
  const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
  const line=(x1,y1,x2,y2)=>{x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke()};
  const circ=(cx,cy,r,fill)=>{x.beginPath();x.arc(cx,cy,Math.max(r,.1),0,Math.PI*2);fill?x.fill():x.stroke()};
  const star=(cx,cy,r)=>{x.beginPath();for(let k=0;k<8;k++){const an=k*Math.PI/4,rr=k%2?r*.28:r;x.lineTo(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr)}x.closePath();x.fill()};
  const glow=(col,blur,fn,cx,cy)=>{if(cx!=null){halo(col,cx,cy,blur*1.5);fn();return}x.save();x.shadowColor=col;x.shadowBlur=blur;fn();x.restore()};
  const halo=(col,cx,cy,r)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col);g.addColorStop(.35,col.replace(/[\d.]+\)$/,'.3)'));g.addColorStop(1,col.replace(/[\d.]+\)$/,'0)'));x.fillStyle=g;x.fillRect(cx-r,cy-r,2*r,2*r)};
  const mist=l=>l.forEach(([X,Y,r,col,al])=>{const g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,rgba(col,al));g.addColorStop(.6,rgba(col,al*.35));g.addColorStop(1,rgba(col,0));x.fillStyle=g;x.fillRect(X-r,Y-r,2*r,2*r)});
  const ripples=(cx,cy,n,al)=>{for(let r=30;r<n;r+=26){x.strokeStyle=rgba((r/26)%2<1?A:B,Math.max(0,al-r/(n*1.4)));x.lineWidth=1.4;circ(cx,cy,r)}};
  const stars=(n,x0,y0,w,h)=>{for(let i=0;i<n;i++){const X=x0+rnd()*w,Y=y0+rnd()*h,r=2+rnd()*rnd()*14;x.fillStyle=rgba(rnd()<.5?A:LT,.35+rnd()*.6);if(r>10){halo(rgba(A,.8),X,Y,r*2.4);star(X,Y,r)}else if(r>7)star(X,Y,r);else circ(X,Y,r*.35,1)}};
  const fireflies=(n,x0,y0,w,h)=>{for(let i=0;i<n;i++){const X=x0+rnd()*w,Y=y0+rnd()*h;halo(rgba(rnd()<.5?A:B,.9),X,Y,30);x.fillStyle=rgba(dark?'#fff6e8':A,.9);circ(X,Y,2.5+rnd()*3,1)}};
  const leaf=(X,Y,an,s,col)=>{x.save();x.translate(X,Y);x.rotate(an);x.fillStyle=col;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(s*.5,-s*.42,s,0);x.quadraticCurveTo(s*.5,s*.42,0,0);x.fill();x.strokeStyle=rgba(LT,.35);x.lineWidth=1;line(0,0,s*.9,0);x.restore()};
  const flower=(X,Y,r)=>{x.save();x.translate(X,Y);for(let k=0;k<6;k++){x.rotate(Math.PI/3);const g=x.createLinearGradient(0,0,r,0);g.addColorStop(0,rgba(B,.9));g.addColorStop(1,rgba(A,.75));x.fillStyle=g;x.beginPath();x.ellipse(r*.55,0,r*.55,r*.27,0,0,Math.PI*2);x.fill()}halo(rgba(A,.9),0,0,r*.9);x.fillStyle=rgba(LT,.95);circ(0,0,r*.18,1);x.restore()};
  x.lineCap='round';x.lineJoin='round';
  ({
    // A. Malam Danau: versi yang sedang dipakai (sama dengan drawInfp di index.html).
    malam(){draftInfpMalam(x,W,H,A,B,LT,fx,fy,rnd,rgba,line,circ,star,glow,mist,dark)},
    // B. Taman Rahasia: sulur yang tumbuh melingkar, daun, bunga, kuncup, dan kunang-kunang.
    taman(){mist([[fx,fy,600,A,.3],[W*.6,H*.3,420,B,.22]]);ripples(fx,fy,700,.4);
      const vine=(X,Y,an,len,d)=>{x.strokeStyle=rgba(d%2?B:A,.85-d*.12);x.lineWidth=Math.max(1.5,6-d*1.4);x.beginPath();x.moveTo(X,Y);let curl=(rnd()-.5)*.05;
        for(let i=0;i<len;i++){an+=Math.sin(i*.07+d)*.035+curl;X+=Math.cos(an)*9;Y+=Math.sin(an)*9;x.lineTo(X,Y);
          if(i%7===0){x.stroke();leaf(X,Y,an+(i%14?1.1:-1.1),18+rnd()*22-d*3,rgba(i%14?A:B,.55+rnd()*.3));x.beginPath();x.moveTo(X,Y)}
          if(d<2&&i%38===19&&rnd()<.8){x.stroke();vine(X,Y,an+(rnd()<.5?.9:-.9),len*.45,d+1);x.beginPath();x.moveTo(X,Y)}}
        x.stroke();// sulur spiral di ujung
        let r=26-d*6;x.beginPath();for(let t=0;t<14;t+=.2){x.lineTo(X+Math.cos(an+t)*r*(1-t/16),Y+Math.sin(an+t)*r*(1-t/16))}x.lineWidth=2;x.stroke();
        if(rnd()<.85)flower(X,Y,30-d*6)};
      vine(W*1.02,H*.5,-2.2,120,0);vine(W*.62,-10,1.9,95,0);vine(W*1.02,H*.05,2.6,85,0);vine(W*.86,H*.62,-2.6,70,1);
      [[W*.9,H*.12,62],[W*.7,H*.2,40],[W*.98,H*.3,46],[W*.55,H*.08,34]].forEach(([X,Y,r])=>flower(X,Y,r));
      fireflies(55,W*.3,0,W*.7,H*.55);stars(50,W*.35,0,W*.65,H*.45)},
    // C. Burung Kertas: bangau origami terbang di jalur putus-putus, coretan jurnal, dan bintang.
    bangau(){mist([[fx,fy,600,A,.28],[W*.5,H*.25,420,B,.2]]);ripples(fx,fy,640,.35);
      // coretan jurnal
      for(let r=0;r<9;r++){const y=H*.04+r*46;x.strokeStyle=rgba(LT,.22);x.lineWidth=2;x.beginPath();let X=W*.56+rnd()*30;x.moveTo(X,y);while(X<W*.98){const w=20+rnd()*40;for(let t=0;t<1;t+=.1)x.lineTo(X+t*w,y+Math.sin(t*Math.PI*2*(1+rnd()))*8-(t>.5?6:0));X+=w+(rnd()<.2?26:6)}x.stroke()}
      const crane=(X,Y,s,rot)=>{x.save();x.translate(X,Y);x.rotate(rot);x.scale(s,s);
        const tri=(pts,col,al)=>{x.fillStyle=rgba(col,al);x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill()};
        tri([[-14,0],[-78,-118],[22,-8]],B,.85);                       // sayap belakang
        tri([[-44,10],[-128,-58],[-30,0]],B,.95);                      // ekor
        tri([[40,8],[112,-66],[28,0]],A,.95);tri([[112,-66],[132,-52],[106,-58]],A,1); // leher dan kepala
        tri([[-50,10],[0,-6],[50,10],[0,32]],A,.95);tri([[0,-6],[50,10],[0,32]],LT,.18);   // badan
        tri([[-4,0],[58,-128],[34,8]],A,.8);tri([[-4,0],[58,-128],[14,-2]],LT,.22);          // sayap depan
        x.strokeStyle=rgba(LT,.45);x.lineWidth=1.2;line(0,-6,0,32);line(-4,0,58,-128);x.restore()};
      x.strokeStyle=rgba(LT,.4);x.lineWidth=2;x.setLineDash([6,12]);x.beginPath();const path=t=>[W*.3+t*W*.62,H*.46-t*H*.36+Math.sin(t*5)*50];for(let t=0;t<=1;t+=.01){const [a,b]=path(t);x.lineTo(a,b)}x.stroke();x.setLineDash([]);
      [[.06,.42],[.27,.6],[.5,.78],[.78,1.05]].forEach(([t,k],i)=>{const [a,b]=path(t);halo(rgba(A,.5),a,b,120*k);crane(a,b,k,-.1+Math.sin(i)*.1)});[[W*.62,H*.05,.45],[W*.97,H*.34,.5],[W*.44,H*.2,.35]].forEach(([a,b,k],i)=>{halo(rgba(B,.4),a,b,90*k);crane(a,b,k,.15-i*.1)});
      stars(70,W*.3,0,W*.7,H*.55);fireflies(25,W*.35,0,W*.65,H*.5)},
    // D. Kosmos Cat Air: nebula yang meresap seperti cat air, galaksi spiral, planet bercincin.
    kosmos(){const bloom=(X,Y,r,col)=>{for(let k=0;k<26;k++){x.fillStyle=rgba(col,.035);x.beginPath();const n=40,rr=r*(.7+rnd()*.35);for(let i=0;i<=n;i++){const an=i/n*Math.PI*2,d=rr*(1+(rnd()-.5)*.28);x.lineTo(X+Math.cos(an)*d,Y+Math.sin(an)*d)}x.fill()}};
      [[fx,fy,420,A],[W*.62,H*.1,320,B],[W*.98,H*.34,360,B],[W*.7,H*.32,260,A],[W*.48,H*.04,220,A],[W*.9,H*.02,200,B]].forEach(([X,Y,r,col])=>bloom(X,Y,r,col));
      ripples(fx,fy,620,.3);
      // galaksi spiral
      for(let arm=0;arm<3;arm++)for(let i=0;i<260;i++){const t=i/260*4.2,r=14*Math.exp(t*.72),an=t+arm*2.094+(rnd()-.5)*.35,X=W*.66+Math.cos(an)*r*1.1,Y=H*.2+Math.sin(an)*r*.55;x.fillStyle=rgba(rnd()<.5?A:LT,.25+rnd()*.6*(1-t/4.5));circ(X,Y,.8+rnd()*2.4,1)}
      halo(rgba(LT,.9),W*.66,H*.2,60);
      // planet bercincin
      const px=W*.9,py=H*.08,pr=70;x.save();x.translate(px,py);x.rotate(-.35);x.strokeStyle=rgba(B,.8);x.lineWidth=6;x.beginPath();x.ellipse(0,0,pr*2,pr*.5,0,Math.PI,Math.PI*2);x.stroke();
      const pg=x.createLinearGradient(-pr,-pr,pr,pr);pg.addColorStop(0,A);pg.addColorStop(1,B);x.fillStyle=pg;circ(0,0,pr,1);x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(14,10,pr,0,Math.PI*2);x.arc(0,0,pr,0,Math.PI*2,true);x.fill();
      x.strokeStyle=rgba(A,.9);x.beginPath();x.ellipse(0,0,pr*2,pr*.5,0,0,Math.PI);x.stroke();x.restore();
      x.fillStyle=rgba(B,.9);circ(W*.78,H*.33,18,1);x.fillStyle=rgba(A,.8);circ(W*.5,H*.16,10,1);
      stars(140,W*.25,0,W*.75,H*.6);fireflies(20,W*.4,0,W*.6,H*.45)},
    // E. Jendela Dunia Dalam: jendela bulat berisi bukit, pohon, seseorang yang duduk menatap bulan.
    jendela(){mist([[fx,fy,620,A,.28],[W*.6,H*.3,420,B,.18]]);const cx=W*.73,cy=H*.2,R=330;
      for(let r=R+30;r<R+420;r+=24){x.strokeStyle=rgba((r/24)%2<1?A:B,Math.max(0,.55-(r-R)/600));x.lineWidth=1.5;circ(cx,cy,r)}
      x.save();x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.clip();
      const sky=x.createLinearGradient(0,cy-R,0,cy+R);sky.addColorStop(0,rgba(dark?'#1a1030':'#ffffff',dark?1:.6));sky.addColorStop(.55,rgba(B,dark?.55:.4));sky.addColorStop(1,rgba(A,dark?.75:.5));x.fillStyle=sky;x.fillRect(cx-R,cy-R,2*R,2*R);
      for(let i=0;i<90;i++){x.fillStyle=rgba(LT,.3+rnd()*.6);circ(cx-R+rnd()*2*R,cy-R+rnd()*R*1.1,.8+rnd()*2.2,1)}
      halo(rgba(LT,.8),cx+120,cy-120,150);x.fillStyle=rgba(dark?'#fff3e6':'#ffffff',.95);circ(cx+120,cy-120,56,1);
      const hill=(y0,amp,ph,col,al)=>{x.fillStyle=rgba(col,al);x.beginPath();x.moveTo(cx-R,cy+R);for(let X=cx-R;X<=cx+R;X+=8)x.lineTo(X,y0+Math.sin((X-cx)/120+ph)*amp+Math.sin((X-cx)/53+ph)*amp*.3);x.lineTo(cx+R,cy+R);x.closePath();x.fill()};
      hill(cy+60,40,1,B,.55);hill(cy+120,30,2.4,A,.6);
      const dk=dark?'#120c18':'#3b2a40';hill(cy+190,22,.3,dk,.95);
      // pohon dan seseorang
      x.fillStyle=rgba(dk,1);x.strokeStyle=rgba(dk,1);x.lineWidth=8;const tx=cx-150,ty=cy+165;line(tx,ty,tx+6,ty-120);x.lineWidth=4;line(tx+4,ty-80,tx-30,ty-118);line(tx+5,ty-100,tx+36,ty-130);
      [[tx+4,ty-150,60],[tx-34,ty-126,38],[tx+44,ty-138,40]].forEach(([X,Y,r])=>circ(X,Y,r,1));
      const hx=cx-40,hy=cy+178;circ(hx,hy-34,10,1);x.beginPath();x.moveTo(hx-12,hy-22);x.quadraticCurveTo(hx,hy-30,hx+12,hy-22);x.lineTo(hx+16,hy);x.lineTo(hx-16,hy);x.closePath();x.fill();
      for(let i=0;i<26;i++){const X=cx-R+rnd()*2*R,Y=cy+rnd()*R*.8;halo(rgba(dark?'#ffd98a':A,.9),X,Y,16);x.fillStyle=rgba(dark?'#fff1c9':A,.95);circ(X,Y,2,1)}
      x.restore();
      x.strokeStyle=rgba(LT,.9);x.lineWidth=6;circ(cx,cy,R);x.strokeStyle=rgba(A,.7);x.lineWidth=2;circ(cx,cy,R+14);
      for(let k=0;k<24;k++){const an=k*Math.PI/12;x.fillStyle=rgba(k%2?A:LT,.9);star(cx+Math.cos(an)*(R+40),cy+Math.sin(an)*(R+40),k%3?4:9)}
      stars(70,W*.25,0,W*.75,H*.55);fireflies(30,W*.3,0,W*.7,H*.55)},
    // B+. Taman Rahasia, rimbun: latar cat air tipis, gerbang lengkung rahasia yang dibingkai sulur, tirai wisteria,
    // sulur dengan daun dan pakis, mawar spiral, bunga lonceng, beri, kuncup, embun, kupu-kupu, kunang-kunang, kelopak berguguran.
    tamanRimbun(){
      const bloom=(X,Y,r,col,n)=>{for(let k=0;k<(n||18);k++){x.fillStyle=rgba(col,.03);x.beginPath();const m=36,rr=r*(.7+rnd()*.35);for(let i=0;i<=m;i++){const an=i/m*Math.PI*2,d=rr*(1+(rnd()-.5)*.3);x.lineTo(X+Math.cos(an)*d,Y+Math.sin(an)*d)}x.fill()}};
      [[fx,fy,400,A],[W*.6,H*.08,300,B],[W*.98,H*.34,340,B],[W*.72,H*.3,260,A],[W*.46,H*.02,220,B]].forEach(([X,Y,r,col])=>bloom(X,Y,r,col));
      mist([[fx,fy,600,A,.26],[W*.6,H*.3,420,B,.18]]);ripples(fx,fy,720,.3);
      // gerbang lengkung rahasia, cahaya di dalamnya
      const gx=W*.8,gy=H*.24,gw=190,gh=300;
      const gl=x.createLinearGradient(gx,gy-gh,gx,gy);gl.addColorStop(0,rgba(dark?'#fff3e0':A,.55));gl.addColorStop(1,rgba(A,.08));x.fillStyle=gl;
      x.beginPath();x.moveTo(gx-gw/2,gy);x.lineTo(gx-gw/2,gy-gh+gw/2);x.arc(gx,gy-gh+gw/2,gw/2,Math.PI,0);x.lineTo(gx+gw/2,gy);x.closePath();x.fill();
      x.strokeStyle=rgba(LT,.85);x.lineWidth=5;x.stroke();x.strokeStyle=rgba(A,.6);x.lineWidth=2;x.beginPath();x.moveTo(gx-gw/2-14,gy);x.lineTo(gx-gw/2-14,gy-gh+gw/2);x.arc(gx,gy-gh+gw/2,gw/2+14,Math.PI,0);x.lineTo(gx+gw/2+14,gy);x.stroke();
      for(let i=0;i<5;i++){const yy=gy-gh*.55+i*6;}halo(rgba(dark?'#ffe2b0':A,.8),gx,gy-gh*.45,140);
      x.fillStyle=rgba(dark?'#3a2430':B,.7);for(let i=0;i<6;i++){x.fillRect(gx-gw/2+8+i*((gw-16)/6),gy-8,(gw-16)/6-4,8)} // anak tangga kecil
      // tirai wisteria dari atas
      for(let k=0;k<22;k++){const X=W*.42+k*W*.027+rnd()*12,len=90+rnd()*220,col=k%2?B:A;x.strokeStyle=rgba(col,.4);x.lineWidth=1.5;line(X,0,X+6,len*.3);
        for(let j=0;j<len/9;j++){const t=j/(len/9),Y=len*.25+j*9,r=(1-t)*9+3;x.fillStyle=rgba(col,.35+.5*(1-t));x.beginPath();x.ellipse(X+Math.sin(j*.9)*4+6,Y,r,r*.7,0,0,Math.PI*2);x.fill()}}
      // sulur
      const rose=(X,Y,r)=>{halo(rgba(A,.7),X,Y,r*1.8);for(let t=0;t<11;t+=.35){const rr=r*(t/11),an=t*2.2;x.fillStyle=rgba(t%1.4<.7?A:B,.55+t*.03);x.beginPath();x.ellipse(X+Math.cos(an)*rr*.4,Y+Math.sin(an)*rr*.4,rr*.55+3,rr*.32+2,an,0,Math.PI*2);x.fill()}x.fillStyle=rgba(LT,.8);circ(X,Y,r*.08+1,1)};
      const bell=(X,Y,s)=>{x.save();x.translate(X,Y);x.fillStyle=rgba(B,.85);x.beginPath();x.moveTo(-s*.5,0);x.quadraticCurveTo(-s*.55,-s,0,-s*1.05);x.quadraticCurveTo(s*.55,-s,s*.5,0);x.quadraticCurveTo(s*.25,-s*.15,0,s*.05);x.quadraticCurveTo(-s*.25,-s*.15,-s*.5,0);x.fill();x.restore()};
      const fern=(X,Y,an,len)=>{x.strokeStyle=rgba(A,.6);x.lineWidth=2;line(X,Y,X+Math.cos(an)*len,Y+Math.sin(an)*len);for(let i=1;i<14;i++){const t=i/14,px=X+Math.cos(an)*len*t,py=Y+Math.sin(an)*len*t,l=(1-t)*30+6;leaf(px,py,an-1.1,l,rgba(B,.5));leaf(px,py,an+1.1,l,rgba(A,.45))}};
      const vine=(X,Y,an,len,d)=>{x.strokeStyle=rgba(d%2?B:A,.9-d*.12);x.lineWidth=Math.max(1.5,7-d*1.6);x.beginPath();x.moveTo(X,Y);const curl=(rnd()-.5)*.05;
        for(let i=0;i<len;i++){an+=Math.sin(i*.07+d)*.035+curl;X+=Math.cos(an)*9;Y+=Math.sin(an)*9;x.lineTo(X,Y);
          if(i%5===0){x.stroke();leaf(X,Y,an+(i%10?1.1:-1.1),20+rnd()*24-d*3,rgba(i%10?A:B,.5+rnd()*.35));x.beginPath();x.moveTo(X,Y)}
          if(i%23===11&&rnd()<.6){x.stroke();const k=rnd();if(k<.4)bell(X+8,Y+22,22-d*4);else if(k<.7){for(let b=0;b<6;b++){x.fillStyle=rgba(b%2?A:B,.85);circ(X+(rnd()-.5)*28,Y+12+rnd()*22,5+rnd()*3,1)}}else{x.fillStyle=rgba(B,.8);x.beginPath();x.ellipse(X,Y,9,15,an,0,Math.PI*2);x.fill()}x.beginPath();x.moveTo(X,Y)}
          if(d<2&&i%34===17&&rnd()<.85){x.stroke();vine(X,Y,an+(rnd()<.5?.9:-.9),len*.5,d+1);x.beginPath();x.moveTo(X,Y)}}
        x.stroke();let r=30-d*7;x.beginPath();for(let t=0;t<14;t+=.2)x.lineTo(X+Math.cos(an+t)*r*(1-t/16),Y+Math.sin(an+t)*r*(1-t/16));x.lineWidth=2;x.stroke();
        rnd()<.5?rose(X,Y,34-d*7):flower(X,Y,34-d*7)};
      vine(W*1.02,H*.52,-2.2,130,0);vine(W*.6,-10,1.9,105,0);vine(W*1.02,H*.06,2.6,95,0);vine(W*.88,H*.64,-2.5,80,1);vine(W*.5,-10,1.6,70,1);vine(gx-gw/2-14,gy+10,-1.45,52,1);vine(gx+gw/2+14,gy+10,-1.75,52,1);
      fern(W*.96,H*.5,-2.4,260);fern(W*.66,H*.42,-1.9,180);
      [[W*.9,H*.1,64],[W*.68,H*.17,44],[W*.98,H*.3,50],[W*.54,H*.07,36]].forEach(([X,Y,r],i)=>i%2?rose(X,Y,r):flower(X,Y,r));
      // embun
      for(let i=0;i<30;i++){const X=W*.4+rnd()*W*.6,Y=rnd()*H*.5,r=3+rnd()*5;x.fillStyle=rgba(LT,.35);circ(X,Y,r,1);x.fillStyle=rgba('#ffffff',.8);circ(X-r*.35,Y-r*.35,r*.3,1)}
      // kupu-kupu
      [[W*.6,H*.13,.9,.4],[W*.92,H*.42,.7,-.3],[W*.47,H*.27,.55,.2],[W*.72,H*.04,.5,-.4]].forEach(([X,Y,k,rot])=>{x.save();x.translate(X,Y);x.rotate(rot);x.scale(k,k);
        const g=x.createLinearGradient(-40,-30,40,30);g.addColorStop(0,rgba(A,.85));g.addColorStop(1,rgba(B,.85));x.fillStyle=g;
        [[-1,-1,30,20],[1,-1,30,20],[-1,1,20,14],[1,1,20,14]].forEach(([sx,sy,rx,ry])=>{x.beginPath();x.ellipse(sx*rx*.8,sy*ry*.6,rx,ry,sx*sy*.5,0,Math.PI*2);x.fill()});
        x.strokeStyle=rgba(LT,.9);x.lineWidth=3;line(0,-20,0,22);x.lineWidth=1.5;line(0,-20,-10,-36);line(0,-20,10,-36);x.restore()});
      // kelopak berguguran
      for(let i=0;i<40;i++){const X=W*.3+rnd()*W*.7,Y=H*.04+rnd()*H*.58;x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI*2);const s=.6+rnd()*.8;x.scale(s,s);x.fillStyle=rgba(rnd()<.5?A:B,.6);x.beginPath();x.moveTo(-14,0);x.quadraticCurveTo(0,-10,14,0);x.quadraticCurveTo(0,10,-14,0);x.fill();x.restore()}
      fireflies(60,W*.3,0,W*.7,H*.58);stars(40,W*.35,0,W*.65,H*.4)},
    tamanRimbun2(){
      const bloom=(X,Y,r,col,n)=>{for(let k=0;k<(n||18);k++){x.fillStyle=rgba(col,.03);x.beginPath();const m=36,rr=r*(.7+rnd()*.35);for(let i=0;i<=m;i++){const an=i/m*Math.PI*2,d=rr*(1+(rnd()-.5)*.3);x.lineTo(X+Math.cos(an)*d,Y+Math.sin(an)*d)}x.fill()}};
      [[fx,fy,400,A],[W*.6,H*.08,300,B],[W*.98,H*.34,340,B],[W*.72,H*.3,260,A],[W*.46,H*.02,220,B]].forEach(([X,Y,r,col])=>bloom(X,Y,r,col));
      mist([[fx,fy,600,A,.26],[W*.6,H*.3,420,B,.18]]);ripples(fx,fy,720,.3);
      // lengkung bunga (rose arch) dengan cahaya hangat dan jalan setapak ke dalam taman
      const gx=W*.79,gy=H*.29,R=132,post=170;
      halo(rgba(dark?'#ffd9a8':A,.75),gx,gy-post*.55,300);
      x.save();x.beginPath();x.moveTo(gx-R,gy);x.lineTo(gx-R,gy-post);x.arc(gx,gy-post,R,Math.PI,0);x.lineTo(gx+R,gy);x.closePath();x.clip();
      const ig=x.createRadialGradient(gx,gy-post*.55,8,gx,gy-post*.55,R*2.3);ig.addColorStop(0,rgba(dark?'#fff3dc':'#ffffff',.95));ig.addColorStop(.4,rgba(A,.6));ig.addColorStop(1,rgba(B,.35));x.fillStyle=ig;x.fillRect(gx-R,gy-post-R,2*R,post+R);
      [[.55,B,.35],[.75,A,.3]].forEach(([k,col,al],i)=>{x.fillStyle=rgba(col,al);x.beginPath();x.moveTo(gx-R,gy);for(let X=gx-R;X<=gx+R;X+=6)x.lineTo(X,gy-post*k*.6+Math.sin((X-gx)/30+i*2)*10);x.lineTo(gx+R,gy);x.closePath();x.fill()});
      [[gx-60,gy-70,26],[gx+56,gy-62,22],[gx-20,gy-84,16]].forEach(([X,Y,r])=>{x.fillStyle=rgba(B,.45);circ(X,Y,r,1);x.fillRect(X-2,Y,4,r)});
      {const pl=x.createRadialGradient(gx,gy-6,4,gx,gy-6,R);pl.addColorStop(0,rgba(dark?'#fff3e0':'#ffffff',.8));pl.addColorStop(1,rgba(A,0));x.fillStyle=pl;x.save();x.translate(gx,gy-6);x.scale(1,.28);x.beginPath();x.arc(0,0,R,0,Math.PI*2);x.restore();x.fill()}
      for(let i=0;i<26;i++){x.fillStyle=rgba('#ffffff',.5+rnd()*.5);circ(gx-R+rnd()*2*R,gy-post-R+rnd()*(post+R),1+rnd()*2,1)}
      x.restore();
      // bingkai lengkung: batang, daun rapat, bunga kecil, mawar
      const archPts=r=>{const p=[];for(let Y=gy;Y>gy-post;Y-=8)p.push([gx-r,Y,-1,0]);for(let a=Math.PI;a<=Math.PI*2+.01;a+=.06)p.push([gx+Math.cos(a)*r,gy-post+Math.sin(a)*r,Math.cos(a),Math.sin(a)]);for(let Y=gy-post;Y<gy;Y+=8)p.push([gx+r,Y,1,0]);return p};
      const inn=archPts(R),out=archPts(R+18);
      x.strokeStyle=rgba(LT,.75);x.lineWidth=4;[inn,out].forEach(p=>{x.beginPath();p.forEach(([X,Y],i)=>i?x.lineTo(X,Y):x.moveTo(X,Y));x.stroke()});
      x.lineWidth=2;x.strokeStyle=rgba(LT,.5);for(let i=0;i<Math.min(inn.length,out.length);i+=3){if(inn[i][3]<-.05)line(inn[i][0],inn[i][1],out[i][0],out[i][1])}
      inn.forEach(([X,Y,nx,ny],i)=>{if(ny===0&&i%2===0){leaf(X+nx*9,Y,(i%4?.6:-.6)+(nx<0?Math.PI:0),14+rnd()*10,rgba(rnd()<.5?A:B,.7));if(i%6===0){x.fillStyle=rgba(i%12?A:B,.85);circ(X+nx*9+(rnd()-.5)*8,Y,5,1)}}});
      out.forEach(([X,Y,nx,ny],i)=>{if(i%2)return;const d=6+rnd()*18;leaf(X+nx*d,Y+ny*d,Math.atan2(ny,nx)+(rnd()-.5)*1.6,16+rnd()*16,rgba(rnd()<.5?A:B,.5+rnd()*.35))});
      out.forEach(([X,Y,nx,ny],i)=>{const d=8+rnd()*10;if(i%11===5)rose(X+nx*d,Y+ny*d,19+rnd()*6);else if(i%4===0)flower(X+nx*d,Y+ny*d,9+rnd()*5)});
      // tirai wisteria: dahan melengkung di atas, untaian kuntum yang mengerucut ke bawah
      const bxf=t=>W*.33+t*W*.74,byf=t=>14+Math.sin(t*Math.PI)*46+t*8;
      x.strokeStyle=rgba(dark?'#5b3b52':B,.9);x.lineWidth=8;x.beginPath();for(let t=0;t<=1;t+=.01){const X=bxf(t),Y=byf(t);t?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();
      for(let t=0;t<=1;t+=.035){const X=bxf(t),Y=byf(t);leaf(X,Y,-.6-rnd()*.8,20+rnd()*14,rgba(A,.55));leaf(X,Y,Math.PI+.6+rnd()*.8,20+rnd()*14,rgba(B,.5))}
      const raceme=(X,Y,len,sway)=>{halo(rgba(B,.28),X+sway*.3,Y+len*.4,len*.5);const n=Math.round(len/7);
        for(let j=0;j<n;j++){const u=j/n,wd=Math.pow(1-u,1.1)*26+3,cy=Y+j*7+(rnd()-.5)*2,cx=X+sway*u*u,m=Math.max(1,Math.round(wd/7.5));
          for(let i=0;i<m;i++){const fx2=cx+(i-(m-1)/2)*7.5+(j%2?3.5:0)+(rnd()-.5)*3,fy2=cy,r=(1-u)*3.6+2.8,col=u<.3?B:u<.7?A:LT;
            x.save();x.translate(fx2,fy2);x.rotate((rnd()-.5)*.7);const g=x.createLinearGradient(0,-r,0,r*1.6);g.addColorStop(0,rgba(col,.9-.35*u));g.addColorStop(1,rgba(u<.5?A:LT,.6-.25*u));x.fillStyle=g;
            x.beginPath();x.moveTo(0,-r);x.bezierCurveTo(r*1.3,-r*.6,r*.9,r*1.4,0,r*1.6);x.bezierCurveTo(-r*.9,r*1.4,-r*1.3,-r*.6,0,-r);x.fill();x.restore()}}
        x.strokeStyle=rgba(dark?'#5b3b52':B,.6);x.lineWidth=1.5;line(X,Y,X+sway*.2,Y+len*.3)};
      for(let k=0;k<20;k++){const t=k/19*.96+.02+(rnd()-.5)*.02,X=bxf(t),Y=byf(t)+4,nearArch=Math.abs(X-gx)<R+50,len=nearArch?60+rnd()*40:150+rnd()*210;raceme(X,Y,len,(rnd()-.5)*40)}
      // sulur
      function rose(X,Y,r){halo(rgba(A,.7),X,Y,r*1.8);for(let t=0;t<11;t+=.35){const rr=r*(t/11),an=t*2.2;x.fillStyle=rgba(t%1.4<.7?A:B,.55+t*.03);x.beginPath();x.ellipse(X+Math.cos(an)*rr*.4,Y+Math.sin(an)*rr*.4,rr*.55+3,rr*.32+2,an,0,Math.PI*2);x.fill()}x.fillStyle=rgba(LT,.8);circ(X,Y,r*.08+1,1)};
      const bell=(X,Y,s)=>{x.save();x.translate(X,Y);x.fillStyle=rgba(B,.85);x.beginPath();x.moveTo(-s*.5,0);x.quadraticCurveTo(-s*.55,-s,0,-s*1.05);x.quadraticCurveTo(s*.55,-s,s*.5,0);x.quadraticCurveTo(s*.25,-s*.15,0,s*.05);x.quadraticCurveTo(-s*.25,-s*.15,-s*.5,0);x.fill();x.restore()};
      const fern=(X,Y,an,len)=>{x.strokeStyle=rgba(A,.6);x.lineWidth=2;line(X,Y,X+Math.cos(an)*len,Y+Math.sin(an)*len);for(let i=1;i<14;i++){const t=i/14,px=X+Math.cos(an)*len*t,py=Y+Math.sin(an)*len*t,l=(1-t)*30+6;leaf(px,py,an-1.1,l,rgba(B,.5));leaf(px,py,an+1.1,l,rgba(A,.45))}};
      const vine=(X,Y,an,len,d)=>{x.strokeStyle=rgba(d%2?B:A,.9-d*.12);x.lineWidth=Math.max(1.5,7-d*1.6);x.beginPath();x.moveTo(X,Y);const curl=(rnd()-.5)*.05;
        for(let i=0;i<len;i++){an+=Math.sin(i*.07+d)*.035+curl;X+=Math.cos(an)*9;Y+=Math.sin(an)*9;x.lineTo(X,Y);
          if(i%5===0){x.stroke();leaf(X,Y,an+(i%10?1.1:-1.1),20+rnd()*24-d*3,rgba(i%10?A:B,.5+rnd()*.35));x.beginPath();x.moveTo(X,Y)}
          if(i%23===11&&rnd()<.6){x.stroke();const k=rnd();if(k<.4)bell(X+8,Y+22,22-d*4);else if(k<.7){for(let b=0;b<6;b++){x.fillStyle=rgba(b%2?A:B,.85);circ(X+(rnd()-.5)*28,Y+12+rnd()*22,5+rnd()*3,1)}}else{x.fillStyle=rgba(B,.8);x.beginPath();x.ellipse(X,Y,9,15,an,0,Math.PI*2);x.fill()}x.beginPath();x.moveTo(X,Y)}
          if(d<2&&i%34===17&&rnd()<.85){x.stroke();vine(X,Y,an+(rnd()<.5?.9:-.9),len*.5,d+1);x.beginPath();x.moveTo(X,Y)}}
        x.stroke();let r=30-d*7;x.beginPath();for(let t=0;t<14;t+=.2)x.lineTo(X+Math.cos(an+t)*r*(1-t/16),Y+Math.sin(an+t)*r*(1-t/16));x.lineWidth=2;x.stroke();
        rnd()<.5?rose(X,Y,34-d*7):flower(X,Y,34-d*7)};
      vine(W*1.02,H*.52,-2.2,130,0);vine(W*.6,-10,1.9,105,0);vine(W*1.02,H*.06,2.6,95,0);vine(W*.88,H*.64,-2.5,80,1);vine(W*.5,-10,1.6,70,1);vine(gx-R-10,gy+20,-1.4,40,1);vine(gx+R+10,gy+20,-1.75,40,1);
      fern(W*.96,H*.5,-2.4,260);fern(W*.66,H*.42,-1.9,180);
      [[W*.9,H*.1,64],[W*.68,H*.17,44],[W*.98,H*.3,50],[W*.54,H*.07,36]].forEach(([X,Y,r],i)=>i%2?rose(X,Y,r):flower(X,Y,r));
      // embun
      for(let i=0;i<30;i++){const X=W*.4+rnd()*W*.6,Y=rnd()*H*.5,r=3+rnd()*5;x.fillStyle=rgba(LT,.35);circ(X,Y,r,1);x.fillStyle=rgba('#ffffff',.8);circ(X-r*.35,Y-r*.35,r*.3,1)}
      // kupu-kupu
      [[W*.6,H*.13,.9,.4],[W*.92,H*.42,.7,-.3],[W*.47,H*.27,.55,.2],[W*.72,H*.04,.5,-.4]].forEach(([X,Y,k,rot])=>{x.save();x.translate(X,Y);x.rotate(rot);x.scale(k,k);
        const g=x.createLinearGradient(-40,-30,40,30);g.addColorStop(0,rgba(A,.85));g.addColorStop(1,rgba(B,.85));x.fillStyle=g;
        [[-1,-1,30,20],[1,-1,30,20],[-1,1,20,14],[1,1,20,14]].forEach(([sx,sy,rx,ry])=>{x.beginPath();x.ellipse(sx*rx*.8,sy*ry*.6,rx,ry,sx*sy*.5,0,Math.PI*2);x.fill()});
        x.strokeStyle=rgba(LT,.9);x.lineWidth=3;line(0,-20,0,22);x.lineWidth=1.5;line(0,-20,-10,-36);line(0,-20,10,-36);x.restore()});
      // kelopak berguguran
      for(let i=0;i<40;i++){const X=W*.3+rnd()*W*.7,Y=H*.04+rnd()*H*.58;x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI*2);const s=.6+rnd()*.8;x.scale(s,s);x.fillStyle=rgba(rnd()<.5?A:B,.6);x.beginPath();x.moveTo(-14,0);x.quadraticCurveTo(0,-10,14,0);x.quadraticCurveTo(0,10,-14,0);x.fill();x.restore()}
      fireflies(60,W*.3,0,W*.7,H*.58);stars(40,W*.35,0,W*.65,H*.4)},
    // F. Taman Kosmos: gabungan B (sulur yang mengalir) dan D (nebula cat air, planet bercincin).
    // Planet bercincin sebagai pusat, untaian bunga melingkarinya, sulur mengalir ke arah judul, debu bintang di sepanjang sulur.
    tamanKosmos(){
      const bloom=(X,Y,r,col,n)=>{for(let k=0;k<(n||22);k++){x.fillStyle=rgba(col,.026);x.beginPath();const m=40,rr=r*(.7+rnd()*.35);for(let i=0;i<=m;i++){const an=i/m*Math.PI*2,d=rr*(1+(rnd()-.5)*.28);x.lineTo(X+Math.cos(an)*d,Y+Math.sin(an)*d)}x.fill()}};
      [[W*.8,H*.13,380,A],[W*.58,H*.06,300,B],[W*.98,H*.36,340,B],[W*.68,H*.3,250,A],[W*.42,H*.02,200,B],[W*.92,H*.02,220,A]].forEach(([X,Y,r,col])=>bloom(X,Y,r,col));
      mist([[W*.8,H*.13,520,A,.22],[W*.55,H*.32,380,B,.14]]);ripples(W*.8,H*.13,720,.22);
      // galaksi spiral kecil
      for(let arm=0;arm<3;arm++)for(let i=0;i<200;i++){const t=i/200*4,r=10*Math.exp(t*.7),an=t+arm*2.094+(rnd()-.5)*.35,X=W*.52+Math.cos(an)*r*1.1,Y=H*.15+Math.sin(an)*r*.5;x.fillStyle=rgba(rnd()<.5?A:LT,.25+rnd()*.55*(1-t/4.3));circ(X,Y,.8+rnd()*2,1)}
      halo(rgba(LT,.8),W*.52,H*.15,44);
      // sulur, daun dua warna, bunga berlapis, mawar, kuncup, debu bintang
      const leaf2=(X,Y,an,s)=>{x.save();x.translate(X,Y);x.rotate(an);const g=x.createLinearGradient(0,0,s,0);g.addColorStop(0,rgba(B,.95));g.addColorStop(1,rgba(A,.85));x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(s*.5,-s*.45,s,0);x.quadraticCurveTo(s*.5,s*.45,0,0);x.fill();x.strokeStyle=rgba(LT,.35);x.lineWidth=1;line(0,0,s*.85,0);x.restore()};
      const bloomFlower=(X,Y,r)=>{halo(rgba(A,.7),X,Y,r*2);x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI);
        [[1,B,.75,6],[.68,A,.85,6]].forEach(([k,col,al,n],L)=>{for(let i=0;i<n;i++){x.rotate(Math.PI*2/n);const g=x.createLinearGradient(0,0,r*k,0);g.addColorStop(0,rgba(col,al));g.addColorStop(1,rgba(L?A:B,al*.75));x.fillStyle=g;x.beginPath();x.ellipse(r*k*.55,0,r*k*.55,r*k*.3,0,0,Math.PI*2);x.fill()}x.rotate(Math.PI/6)});
        for(let i=0;i<7;i++){const an=i*Math.PI*2/7;x.fillStyle=rgba(LT,.9);circ(Math.cos(an)*r*.22,Math.sin(an)*r*.22,1.8,1)}x.fillStyle=rgba(LT,.95);circ(0,0,r*.12,1);x.restore()};
      const rose=(X,Y,r)=>{halo(rgba(A,.6),X,Y,r*1.8);for(let t=0;t<11;t+=.35){const rr=r*(t/11),an=t*2.2;x.fillStyle=rgba(t%1.4<.7?A:B,.55+t*.03);x.beginPath();x.ellipse(X+Math.cos(an)*rr*.4,Y+Math.sin(an)*rr*.4,rr*.55+3,rr*.32+2,an,0,Math.PI*2);x.fill()}x.fillStyle=rgba(LT,.85);circ(X,Y,r*.08+1,1)};
      const bud=(X,Y,an)=>{x.save();x.translate(X,Y);x.rotate(an);x.fillStyle=rgba(A,.85);x.beginPath();x.ellipse(8,0,9,5,0,0,Math.PI*2);x.fill();x.fillStyle=rgba(B,.8);x.beginPath();x.moveTo(0,0);x.lineTo(6,-5);x.lineTo(6,5);x.closePath();x.fill();x.restore()};
      const vine=(X,Y,an,len,d)=>{x.strokeStyle=rgba(d%2?B:A,.9-d*.12);x.lineWidth=Math.max(2.2,8-d*1.8);x.beginPath();x.moveTo(X,Y);const curl=(rnd()-.5)*.05;
        for(let i=0;i<len;i++){an+=Math.sin(i*.07+d)*.035+curl;X+=Math.cos(an)*9;Y+=Math.sin(an)*9;x.lineTo(X,Y);
          if(i%6===0){x.stroke();leaf2(X,Y,an+(i%12?1.1:-1.1),24+rnd()*24-d*3);x.beginPath();x.moveTo(X,Y)}
          if(i%4===0&&rnd()<.6){x.fillStyle=rgba(LT,.4+rnd()*.5);circ(X+(rnd()-.5)*24,Y+(rnd()-.5)*24,.8+rnd()*1.8,1)}
          if(i%17===8&&rnd()<.6){x.stroke();bud(X,Y,an+(rnd()<.5?.9:-.9));x.beginPath();x.moveTo(X,Y)}
          if(d<2&&i%36===18&&rnd()<.85){x.stroke();vine(X,Y,an+(rnd()<.5?.9:-.9),len*.5,d+1);x.beginPath();x.moveTo(X,Y)}}
        x.stroke();let r=26-d*6;x.beginPath();for(let t=0;t<14;t+=.2)x.lineTo(X+Math.cos(an+t)*r*(1-t/16),Y+Math.sin(an+t)*r*(1-t/16));x.lineWidth=2;x.stroke();
        rnd()<.55?bloomFlower(X,Y,42-d*8):rose(X,Y,34-d*7)};
      vine(W*1.02,H*.5,-2.2,125,0);vine(W*.6,-10,1.9,100,0);vine(W*1.02,H*.06,2.6,90,0);vine(W*.86,H*.62,-2.6,72,1);vine(W*.4,-10,1.4,60,1);vine(W*.7,-10,2.45,95,0);
      // planet bercincin
      const px=W*.8,py=H*.13,pr=118,tilt=-.32;
      halo(rgba(A,.55),px,py,pr*2.8);
      const ring=back=>{x.save();x.translate(px,py);x.rotate(tilt);
        [[1.55,8,B,.55],[1.72,5,A,.75],[1.86,3,LT,.45],[2.02,10,B,.35],[2.18,3,A,.55]].forEach(([k,w,col,al])=>{x.strokeStyle=rgba(col,al);x.lineWidth=w;x.beginPath();x.ellipse(0,0,pr*k,pr*k*.26,0,back?Math.PI:0,back?Math.PI*2:Math.PI);x.stroke()});
        for(let i=0;i<520;i++){const an=back?Math.PI+rnd()*Math.PI:rnd()*Math.PI,k=1.5+rnd()*.75;x.fillStyle=rgba(rnd()<.5?LT:A,.3+rnd()*.6);circ(Math.cos(an)*pr*k,Math.sin(an)*pr*k*.26+(rnd()-.5)*4,.6+rnd()*1.6,1)}x.restore()};
      ring(true);
      x.save();x.beginPath();x.arc(px,py,pr,0,Math.PI*2);x.clip();
      const pb=x.createRadialGradient(px-pr*.4,py-pr*.45,pr*.1,px,py,pr*1.1);pb.addColorStop(0,rgba(dark?'#ffe9e0':'#ffffff',.95));pb.addColorStop(.35,rgba(A,.95));pb.addColorStop(1,rgba(B,.95));x.fillStyle=pb;x.fillRect(px-pr,py-pr,pr*2,pr*2);
      x.translate(px,py);x.rotate(tilt);for(let i=-5;i<=5;i++){x.fillStyle=rgba(i%2?B:'#ffffff',i%2?.22:.12);x.beginPath();for(let X=-pr;X<=pr;X+=6)x.lineTo(X,i*20+Math.sin(X/30+i)*5);for(let X=pr;X>=-pr;X-=6)x.lineTo(X,i*20+9+Math.sin(X/26+i)*4);x.fill()}
      x.setTransform(1,0,0,1,0,0);const sh=x.createRadialGradient(px+pr*.55,py+pr*.5,pr*.2,px+pr*.4,py+pr*.4,pr*1.3);sh.addColorStop(0,'rgba(20,10,30,.55)');sh.addColorStop(1,'rgba(20,10,30,0)');x.fillStyle=sh;x.fillRect(px-pr,py-pr,pr*2,pr*2);x.restore();
      ring(false);
      // bulan kecil di orbit putus-putus
      x.strokeStyle=rgba(LT,.4);x.lineWidth=1.5;x.setLineDash([4,9]);x.beginPath();x.ellipse(px,py,pr*2.7,pr*1.1,-.5,0,Math.PI*2);x.stroke();x.setLineDash([]);
      {const an=2.5,mx=px+Math.cos(an)*pr*2.7*Math.cos(-.5)-Math.sin(an)*pr*1.1*Math.sin(-.5),my=py+Math.cos(an)*pr*2.7*Math.sin(-.5)+Math.sin(an)*pr*1.1*Math.cos(-.5);halo(rgba(LT,.7),mx,my,46);const mg=x.createRadialGradient(mx-8,my-8,2,mx,my,22);mg.addColorStop(0,rgba(dark?'#ffffff':LT,.95));mg.addColorStop(1,rgba(B,.9));x.fillStyle=mg;circ(mx,my,20,1)}
      // untaian bunga yang melingkari planet
      for(let a=Math.PI*.15;a<Math.PI*1.05;a+=.09){const X=px+Math.cos(a)*pr*2.25,Y=py+Math.sin(a)*pr*1.25;leaf2(X,Y,a+Math.PI/2+(rnd()-.5)*1.2,18+rnd()*12);leaf2(X,Y,a-Math.PI/2+(rnd()-.5)*1.2,16+rnd()*10)}
      x.strokeStyle=rgba(A,.7);x.lineWidth=3;x.beginPath();x.ellipse(px,py,pr*2.25,pr*1.25,0,Math.PI*.15,Math.PI*1.05);x.stroke();
      [.25,.5,.72,.95].forEach((a,i)=>{const an=Math.PI*a,X=px+Math.cos(an)*pr*2.25,Y=py+Math.sin(an)*pr*1.25;i%2?rose(X,Y,22):bloomFlower(X,Y,26)});
      [[W*.62,H*.22,50],[W*.97,H*.32,54],[W*.5,H*.06,38],[W*.72,H*.36,34]].forEach(([X,Y,r],i)=>i%2?rose(X,Y,r*.8):bloomFlower(X,Y,r));
      stars(130,W*.25,0,W*.75,H*.6);fireflies(55,W*.3,0,W*.7,H*.58)},
  })[v]();
  for(let i=0;i<11000;i++){const X=rnd()*W,Y=rnd()*H*.8;x.fillStyle=rgba(rnd()<.5?A:(dark?'#ffffff':B),.05+rnd()*.12);x.fillRect(X,Y,2,2)}
  x.globalCompositeOperation='destination-in';const m=x.createRadialGradient(fx,fy,0,fx,fy,W*.98);m.addColorStop(0,'rgba(0,0,0,1)');m.addColorStop(.35,'rgba(0,0,0,.72)');m.addColorStop(.7,'rgba(0,0,0,.2)');m.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=m;x.fillRect(0,0,W,H);
  return c;
}

function draftInfpMalam(x,W,H,A,B,LT,fx,fy,rnd,rgba,line,circ,star,glow,mist,dark){
  mist([[fx,fy,600,A,.34],[W*.62,H*.1,420,B,.3],[W*.98,H*.36,460,B,.24],[W*.74,H*.3,320,A,.2],[W*.45,H*.04,300,A,.16],[W*.55,H*.42,380,B,.14]]);
  // aurora: tirai cahaya yang bergelombang
  for(let band=0;band<3;band++){const y0=H*(.03+band*.07),amp=40+band*16,ph=band*1.3;for(let X=W*.25;X<W+20;X+=5){const top=y0+Math.sin(X/170+ph)*amp+Math.sin(X/63+ph)*12,len=150+Math.sin(X/90+ph*2)*60+band*20;
      const g=x.createLinearGradient(X,top,X,top+len);g.addColorStop(0,rgba(band%2?A:B,0));g.addColorStop(.25,rgba(band%2?A:B,.22));g.addColorStop(1,rgba(band%2?B:A,0));x.strokeStyle=g;x.lineWidth=4;line(X,top,X,top+len)}}
  // riak dari tiga tetesan
  [[fx,fy,1],[W*.6,H*.06,.7],[W*1.02,H*.36,.6]].forEach(([cx,cy,k],di)=>{for(let r=26;r<900*k;r+=24){const wob=4+r*.012,ph=di*1.7+r*.013;x.beginPath();for(let a=0;a<=Math.PI*2+.01;a+=.04){const rr=r+Math.sin(a*5+ph)*wob*.4+Math.sin(a*3-ph)*wob*.3;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}
    x.strokeStyle=rgba((r/24)%2<1?A:B,Math.max(0,.75-r/(1100*k)));x.lineWidth=r<200?2.4:1.6;x.stroke()}});
  // rasi bintang (dua)
  [[[W*.46,H*.2],[W*.53,H*.15],[W*.6,H*.19],[W*.66,H*.13],[W*.72,H*.22],[W*.79,H*.27],[W*.9,H*.24]],[[W*.88,H*.05],[W*.95,H*.09],[W*.92,H*.15],[W*.99,H*.18]]].forEach(cons=>{
    x.strokeStyle=rgba(LT,.45);x.lineWidth=1.6;x.setLineDash([3,7]);x.beginPath();cons.forEach(([X,Y],i)=>i?x.lineTo(X,Y):x.moveTo(X,Y));x.stroke();x.setLineDash([]);
    cons.forEach(([X,Y])=>glow(rgba(A,.9),16,()=>{x.fillStyle=rgba(LT,.95);star(X,Y,9)},X,Y))});
  // halo bulan
  [205,240,282,330].forEach((r,i)=>{x.strokeStyle=rgba(i%2?B:A,.55-i*.12);x.lineWidth=i?1.5:2.5;circ(fx-85,fy-5,r)});
  // bulan sabit + pantulannya di riak
  const moon=()=>{const m=document.createElement('canvas');m.width=m.height=420;const q=m.getContext('2d'),g=q.createLinearGradient(60,60,360,360);g.addColorStop(0,A);g.addColorStop(1,B);q.fillStyle=g;q.beginPath();q.arc(210,210,150,0,Math.PI*2);q.fill();
    q.fillStyle='rgba(255,255,255,.16)';[[150,260,22],[120,190,14],[185,320,12],[95,255,9]].forEach(([X,Y,r])=>{q.beginPath();q.arc(X,Y,r,0,Math.PI*2);q.fill()});q.globalCompositeOperation='destination-out';q.fillStyle='#000';q.beginPath();q.arc(275,165,140,0,Math.PI*2);q.fill();return m};
  const mo=moon();glow(rgba(A,.95),90,()=>x.drawImage(mo,fx-250,fy-170,330,330));
  x.save();x.globalAlpha=.28;x.translate(0,(fy+160)*2+120);x.scale(1,-1);x.drawImage(mo,fx-250,fy-170,330,330);x.restore();
  for(let i=0;i<9;i++){x.strokeStyle=rgba(LT,.35-i*.03);x.lineWidth=2;const Y=fy+330+i*14,w=150-i*12;line(fx-85-w/2+rnd()*20,Y,fx-85+w/2+rnd()*20,Y)}
  // bintang jatuh (tiga) dengan debu bintang
  [[W*.3,H*.07,W*.62,H*.25,1],[W*.45,H*.01,W*.62,H*.08,.6],[W*.95,H*.48,W*.75,H*.56,.6]].forEach(([sx,sy,ex,ey,k])=>{const tg=x.createLinearGradient(sx,sy,ex,ey);tg.addColorStop(0,rgba(LT,0));tg.addColorStop(1,rgba(LT,.95));x.strokeStyle=tg;x.lineWidth=4*k;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo((sx+ex)/2,sy+(ey-sy)*.1,ex,ey);x.stroke();
    for(let i=0;i<24;i++){const t=rnd();x.fillStyle=rgba(LT,.6*t);circ(sx+(ex-sx)*t+(rnd()-.5)*20,sy+(ey-sy)*t*t+(rnd()-.5)*20,1+rnd()*2,1)}
    glow(rgba(A,1),30,()=>{x.fillStyle=rgba(LT,1);star(ex,ey,22*k)},ex,ey)});
  // bintang dan kilau
  for(let i=0;i<150;i++){const X=W*.22+rnd()*W*.78,Y=rnd()*H*.62,r=2+rnd()*rnd()*16;x.fillStyle=rgba(rnd()<.5?A:LT,.35+rnd()*.6);
    if(r>10)glow(rgba(A,.8),18,()=>{star(X,Y,r);x.strokeStyle=rgba(LT,.5);x.lineWidth=1.2;line(X-r*2.2,Y,X+r*2.2,Y);line(X,Y-r*2.2,X,Y+r*2.2)},X,Y);else if(r>7)star(X,Y,r);else circ(X,Y,r*.35,1)}
  // lentera yang naik pelan
  [[W*.5,H*.34,1],[W*.58,H*.27,.8],[W*.66,H*.36,.9],[W*.43,H*.24,.6],[W*.72,H*.46,.7],[W*.36,H*.4,.55],[W*.95,H*.5,.75]].forEach(([X,Y,k])=>{const w=34*k,h=46*k;
    glow(rgba(dark?'#ffb36b':A,1),40*k,()=>{const g=x.createLinearGradient(X,Y-h/2,X,Y+h/2);g.addColorStop(0,rgba(dark?'#ffe2b0':A,.95));g.addColorStop(1,rgba(dark?'#ff9a5c':B,.9));x.fillStyle=g;x.beginPath();if(x.roundRect)x.roundRect(X-w/2,Y-h/2,w,h,w*.4);else x.rect(X-w/2,Y-h/2,w,h);x.fill()},X,Y);
    x.fillStyle=rgba(dark?'#5a3a2a':B,.7);x.fillRect(X-w*.35,Y+h/2-2,w*.7,4*k)});
  // kupu-kupu
  [[W*.56,H*.12,1,.4],[W*.83,H*.4,.8,-.3],[W*.36,H*.07,.65,.2],[W*.97,H*.08,.6,-.5],[W*.64,H*.5,.55,.5]].forEach(([X,Y,k,rot])=>{x.save();x.translate(X,Y);x.rotate(rot);x.scale(k,k);
    const g=x.createLinearGradient(-40,-30,40,30);g.addColorStop(0,rgba(A,.85));g.addColorStop(1,rgba(B,.85));x.fillStyle=g;
    [[-1,-1,30,20],[1,-1,30,20],[-1,1,20,14],[1,1,20,14]].forEach(([sx,sy,rx,ry])=>{x.beginPath();x.ellipse(sx*rx*.8,sy*ry*.6,rx,ry,sx*sy*.5,0,Math.PI*2);x.fill()});
    x.strokeStyle=rgba(LT,.9);x.lineWidth=3;line(0,-20,0,22);x.lineWidth=1.5;line(0,-20,-10,-36);line(0,-20,10,-36);x.restore()});
  // kunang-kunang
  for(let i=0;i<60;i++){const X=W*.25+rnd()*W*.75,Y=H*.04+rnd()*H*.6;{const r=2.5+rnd()*3;glow(rgba(rnd()<.5?A:B,1),22,()=>{x.fillStyle=rgba(dark?'#fff6e8':A,.9);circ(X,Y,r,1)},X,Y)}}
  // kelopak melayang
  for(let i=0;i<24;i++){const X=W*.3+rnd()*W*.7,Y=H*.04+rnd()*H*.55;x.save();x.translate(X,Y);x.rotate(rnd()*Math.PI*2);const s=.7+rnd()*.8;x.scale(s,s);const pg=x.createLinearGradient(-18,0,18,0);pg.addColorStop(0,rgba(B,.8));pg.addColorStop(1,rgba(A,.6));x.fillStyle=pg;
    x.beginPath();x.moveTo(-18,0);x.quadraticCurveTo(0,-12,18,0);x.quadraticCurveTo(0,12,-18,0);x.fill();x.restore()}
}
