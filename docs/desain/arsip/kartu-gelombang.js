// Kartu Gelombang (konsep, tidak dipakai): 189 jawaban sebagai garis, tinggi = seberapa tegas.
// Butuh parameter ke-4 c (jawaban per id) dan helper cardHead/cardFoot/AXWORD di bawah.

function cardHead(K,name,y0){const {x,F,txt,fit}=K;const INK=K.INK2||K.INK,COL=K.COL;
  if('letterSpacing' in x)x.letterSpacing='8px';txt('PETA KEPRIBADIAN',72,y0||112,F(800,24),COL);if('letterSpacing' in x)x.letterSpacing='0px';
  if(name){x.font=F(700,44);txt(fit(name,900),72,(y0||112)+58,F(700,44),INK)}}
function cardFoot(K,MUTE,INK){const {x,F,txt,fit,H}=K;x.font=F(600,26);const s1='Coba juga: ',w1=x.measureText(s1).width;
  txt(s1,72,H-52,F(600,26),MUTE);txt(fit(siteName(),640),72+w1,H-52,F(800,26),INK);txt(today(),1008,H-52,F(600,24),MUTE,'right')}
const AXWORD={EI:p=>p>=50?'Introvert':'Ekstrovert',SN:p=>p>=50?'Intuitive':'Observant',TF:p=>p>=50?'Feeling':'Thinking',JP:p=>p>=50?'Prospecting':'Judging',AT:p=>p>=50?'Turbulent':'Assertive'};

function cardGelombang(R,name,K,c){
  // Gelombang: setiap jawaban satu garis. Tinggi = seberapa tegas jawabannya, arah = pilihan A atau B. Bentuknya unik untuk tiap orang.
  const {W,H,x,dk,COL,IND,fam,F,rgba,rr,fit,txt,blob,weakOf}=K;
  const BG=dk?'#0c0b11':'#f9f7f3',INK=dk?'#f5f2fb':'#18141f',MUTE=dk?'rgba(245,242,251,.6)':'rgba(24,20,31,.6)';
  x.fillStyle=BG;x.fillRect(0,0,W,H);blob(540,980,760,COL,dk?.20:.10);K.INK2=INK;cardHead(K,name);
  if(R.hasType){x.font=F(800,210);const tw=x.measureText(R.type).width,g=x.createLinearGradient(72,0,72+tw,0);g.addColorStop(0,COL);g.addColorStop(1,IND);
    txt(R.type,64,430,F(800,210),g);if(R.id)txt('-'+R.id,64+tw+8,430,F(800,110),INK);
    txt(fit(`${FAM[fam]}${R.strat?' · '+R.strat:''}`,936),72,494,F(700,32),MUTE)}
  // gelombang vertikal: 4 modul berurutan
  const ids=[];MODS.forEach(m=>m.items.forEach(it=>ids.push([m.id,it.id])));
  const vals=ids.map(([m,id])=>[m,c&&c[id]!=null?c[id]:3]);
  const top=590,bot=1580,cx=540,step=(bot-top)/vals.length,amp=430;
  const g2=x.createLinearGradient(0,top,0,bot);g2.addColorStop(0,COL);g2.addColorStop(1,IND);
  x.lineCap='round';
  vals.forEach(([m,v],i)=>{const d=(v-3)/2,y=top+i*step+step/2,len=Math.max(6,Math.abs(d)*amp);
    x.strokeStyle=Math.abs(d)<.01?rgba(dk?'#ffffff':'#18141f',.18):g2;x.globalAlpha=Math.abs(d)<.01?1:.45+.55*Math.abs(d);x.lineWidth=Math.max(2,step*.55);
    x.beginPath();x.moveTo(cx-len/2,y);x.lineTo(cx+len/2,y);x.stroke()});x.globalAlpha=1;
  // label modul di kiri
  let acc=0;MODS.forEach(m=>{const n=m.items.length,y=top+(acc+n/2)*step;txt(m.name.replace('Cognitive functions','Fungsi').replace('Facet Step II','Facet'),72,y+8,F(700,22),MUTE);acc+=n;
    if(acc<vals.length){x.strokeStyle=rgba(dk?'#ffffff':'#18141f',.10);x.lineWidth=1;x.beginPath();x.moveTo(72,top+acc*step);x.lineTo(1008,top+acc*step);x.stroke()}});
  const ext=Math.round((R.ext||0)*100);txt(`${vals.length} jawaban`,1008,top-24,F(800,26),INK,'right');
  // sumbu ringkas
  let y=1650;AXW.filter(ax=>R.ax[ax]!=null).forEach((ax,i)=>{const p=R.ax[ax],pp=Math.round(p>=50?p:100-p),wk=weakOf(ax),cx2=72+i*188;
    txt(`${pp}%`,cx2,y,F(800,40),wk?COL:INK);txt(AXWORD[ax](p)+(wk?' · tipis':''),cx2,y+34,F(700,20),MUTE)});
  txt('Satu garis = satu jawaban. Makin panjang, makin tegas.',72,H-112,F(600,22),MUTE);
  cardFoot(K,MUTE,INK);
}
