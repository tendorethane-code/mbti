// Logika murni Peta Kepribadian: susun modul, hitung skor, susun ringkasan. Tanpa DOM, biar bisa dites.
const POS={EI:'I',SN:'N',TF:'F',JP:'P',AT:'T'};
const RIGHT={EI:'I',SN:'N',TF:'F',JP:'P'};
const TABLE=["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"];
const STACK={INFP:['Fi','Ne','Si','Te'],ISFP:['Fi','Se','Ni','Te'],INTP:['Ti','Ne','Si','Fe'],ISTP:['Ti','Se','Ni','Fe'],INFJ:['Ni','Fe','Ti','Se'],INTJ:['Ni','Te','Fi','Se'],ISFJ:['Si','Fe','Ti','Ne'],ISTJ:['Si','Te','Fi','Ne'],ENFP:['Ne','Fi','Te','Si'],ENTP:['Ne','Ti','Fe','Si'],ESFP:['Se','Fi','Te','Ni'],ESTP:['Se','Ti','Fe','Ni'],ENFJ:['Fe','Ni','Se','Ti'],ENTJ:['Te','Ni','Se','Fi'],ESFJ:['Fe','Si','Ne','Ti'],ESTJ:['Te','Si','Ne','Fi']};
const FAM={NF:'Diplomat',NT:'Analyst',SJ:'Sentinel',SP:'Explorer'};
const STRAT={IA:'Confident Individualism',EA:'People Mastery',IT:'Constant Improvement',ET:'Social Engagement'};
// Palet per tipe: [warna utama, warna kedua]. Tiap tipe unik, tetap satu nuansa dengan family-nya.
const TYPE_PAL={INTJ:['#7f86e8','#79a8d6'],INTP:['#8b90ff','#5fcab8'],ENTJ:['#6f8cf2','#e2b65a'],ENTP:['#a785ff','#ff9473'],
INFJ:['#c07bbd','#8cbf98'],INFP:['#f2826f','#b7a1e0'],ENFJ:['#e9739b','#f2b36b'],ENFP:['#ff9a62','#4fc5b8'],
ISTJ:['#4fa8a0','#cfae72'],ISFJ:['#79bf98','#f0a8a0'],ESTJ:['#4f9cc0','#d8a650'],ESFJ:['#4cc4aa','#ffb48c'],
ISTP:['#7c9cc2','#f0aa48'],ISFP:['#e08b6a','#a9bf72'],ESTP:['#ec6b72','#f0c35a'],ESFP:['#ff7f9e','#ffc96b']};
const hexRgb=h=>{const n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255]};
const rgbHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const lum=h=>{const c=hexRgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
// Di tema terang, warna digelapkan bertahap sampai kontrasnya dengan latar putih cukup (minimal 3:1, untuk teks besar dan grafis).
function typePal(type,dark){
  const p=TYPE_PAL[type]||TYPE_PAL.INFP;if(dark)return {a:p[0],b:p[1]};
  const deep=h=>{let c=hexRgb(h);for(let i=0;i<20&&contrast(rgbHex(c),'#ffffff')<3.2;i++)c=c.map(v=>v*.9);return rgbHex(c)};
  return {a:deep(p[0]),b:deep(p[1])};
}
const FUNCS=['Fi','Fe','Ti','Te','Ni','Ne','Si','Se'];
const APP_ID='tes-kepribadian';
const DATA_V=3;

const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:NaN;
const famOf=t=>t[1]==='N'?'N'+t[2]:'S'+t[3];
const roundRobin=groups=>{const out=[],g=groups.map(x=>x.slice());while(g.some(x=>x.length))g.forEach(x=>{if(x.length)out.push(x.shift())});return out};
// Soal pilihan di posisi ganjil ditukar A/B biar jawaban nggak condong ke satu sisi.
const flipOdd=list=>list.map((it,i)=>it.k==='fc'&&i%2?{...it,a:it.b,b:it.a,fl:true}:{...it,fl:false});

function buildModules(){
  const coreG=Object.keys(AX).map(ax=>CORE.filter(c=>c[0]===ax).map(c=>({k:'fc',id:c[5],ax,bl:c[1],q:c[2],a:c[3],b:c[4]})));
  const facG=Object.keys(FACETS).map(ax=>FITEMS.filter(c=>c[0]===ax).map(c=>({k:'fc',id:c[5],ax,f:c[1],q:c[2],a:c[3],b:c[4]})));
  const b5P=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',id:f[3],d:d[0],f:i,rev:false,q:f[1]}))));
  const b5R=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',id:f[4],d:d[0],f:i,rev:true,q:f[2]}))));
  const fnG=['Fi','Se','Ti','Ne','Fe','Si','Te','Ni'].map(fn=>FN1.filter(x=>x[0]===fn).map(x=>({k:'lk',id:x[2],fn,q:x[1]})));
  return [
    {id:'inti',name:'Inti: 4 huruf + identitas',items:flipOdd(roundRobin(coreG))},
    {id:'facet',name:'Facet Step II',items:flipOdd(roundRobin(facG))},
    {id:'big5',name:'Big Five',items:b5P.concat(b5R)},
    {id:'fungsi',name:'Cognitive functions',items:flipOdd(roundRobin(fnG).concat(FN2.map(x=>({k:'fc',id:x[5],fa:x[0],fb:x[1],q:x[2],a:x[3],b:x[4]}))))}];
}
const MODS=buildModules();
MODS.forEach(m=>{const n=m.items.length;m.sub=`${n} ${m.id==='big5'?'pernyataan':'soal'}`});
// Huruf kapital di awal tiap kata, kecuali kata sambung pendek.
const titleCase=t=>String(t).split(' ').map((w,i)=>i>0&&['pada','dan','di','ke','yang','dari','atau','untuk'].includes(w)?w:w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
const MAIN=MODS;
const TOTAL=MAIN.reduce((s,m)=>s+m.items.length,0);

const valid=v=>v===1||v===2||v===3||v===4||v===5;
const answered=(ans,m)=>m.items.reduce((s,_,i)=>s+(ans[m.id]&&valid(ans[m.id][i])?1:0),0);
const isDone=(ans,m)=>answered(ans,m)===m.items.length;
const lab=p=>{const d=Math.abs(p-50);return d>=30?'sangat jelas':d>=15?'jelas':d>=5?'condong':'seimbang'};
const eff=(it,v)=>it.fl?6-v:v;

function compute(ans){
  const R={done:{}};
  MODS.forEach(m=>R.done[m.id]=isDone(ans,m));
  const [mI,mF,mB,mN]=MODS;
  if(R.done.inti){R.core={};Object.keys(AX).forEach(ax=>{const s=[];mI.items.forEach((it,i)=>{if(it.ax!==ax)return;const v=eff(it,ans.inti[i]);s.push(it.bl===POS[ax]?v-3:3-v)});R.core[ax]=50+avg(s)*25})}
  if(R.done.facet){R.fac={};R.facAx={};Object.keys(FACETS).forEach(ax=>{R.fac[ax]=FACETS[ax].map((_,f)=>{const s=[];mF.items.forEach((it,i)=>{if(it.ax===ax&&it.f===f)s.push(eff(it,ans.facet[i])-3)});return avg(s)});R.facAx[ax]=50+avg(R.fac[ax])*25})}
  if(R.done.big5){R.b5={};B5.forEach(d=>{const fs=d[2].map((_,f)=>{const s=[];mB.items.forEach((it,i)=>{if(it.d===d[0]&&it.f===f)s.push(it.rev?6-ans.big5[i]:ans.big5[i])});return avg(s)});R.b5[d[0]]={name:d[1],fs,dom:avg(fs)}})}
  if(R.done.fungsi){const p1={},p2={};mN.items.forEach((it,i)=>{const v=ans.fungsi[i];if(it.k==='lk')(p1[it.fn]=p1[it.fn]||[]).push(v);else{const e=eff(it,v);(p2[it.fb]=p2[it.fb]||[]).push(e);(p2[it.fa]=p2[it.fa]||[]).push(6-e)}});
    R.fn=FUNCS.map(f=>{const a=avg(p1[f]),b=p2[f]?avg(p2[f]):a;return {f,a,b,g:(a+b)/2}}).sort((x,y)=>y.g-x.g||FUNCS.indexOf(x.f)-FUNCS.indexOf(y.f))}
  R.ax={};R.src={};
  Object.keys(AX).forEach(ax=>{const src={};if(R.core)src.inti=R.core[ax];if(R.facAx&&R.facAx[ax]!=null)src.facet=R.facAx[ax];if(ax==='AT'&&R.b5)src.b5=(R.b5.N.dom-1)/4*100;const v=Object.values(src);R.src[ax]=src;R.ax[ax]=v.length?avg(v):null});
  R.hasType=['EI','SN','TF','JP'].every(ax=>R.ax[ax]!=null);
  if(R.hasType){
    const p=ax=>R.ax[ax]/100,lp=(L,ax)=>L===POS[ax]?p(ax):1-p(ax);
    const fnMap=R.fn?Object.fromEntries(R.fn.map(x=>[x.f,x.g])):null;
    R.fits=TABLE.map(t=>{const d=avg([lp(t[0],'EI'),lp(t[1],'SN'),lp(t[2],'TF'),lp(t[3],'JP')])*100;const st=fnMap?STACK[t].reduce((s,f,i)=>s+[4,3,2,1][i]*(fnMap[f]-1)/4,0)/10*100:null;return {t,d,st,v:st==null?d:(st+d)/2}}).sort((a,b)=>b.v-a.v||b.d-a.d);
    R.type=R.fits[0].t;
    R.letters=['EI','SN','TF','JP'].map(ax=>R.ax[ax]>=50?POS[ax]:AX[ax][0]).join('');
    R.id=R.ax.AT!=null?(R.ax.AT>=50?'T':'A'):'';
    const pN=p('SN'),pF=p('TF'),pP=p('JP');
    const fam={NF:pN*pF,NT:pN*(1-pF),SP:(1-pN)*pP,SJ:(1-pN)*(1-pP)};
    R.fam=Object.entries(fam).map(([k,v])=>[k,v*100]).sort((a,b)=>b[1]-a[1]);
    R.strat=R.id?STRAT[(R.ax.EI>=50?'I':'E')+R.id]:'';
  }
  const all=MODS.flatMap(m=>(ans[m.id]||[]).filter(valid));
  R.ext=all.length?all.filter(v=>v===1||v===5).length/all.length:0;
  R.count=all.length;
  return R;
}

// Jawaban disimpan per id soal dalam orientasi asli (A = 1, B = 5), jadi aman kalau urutan soal berubah.
function canon(ans){
  const o={};MODS.forEach(m=>m.items.forEach((it,i)=>{const v=ans&&ans[m.id]&&ans[m.id][i];if(valid(v))o[it.id]=it.k==='fc'?eff(it,v):v}));return o;
}
// Dari peta id -> nilai asli, susun jawaban mentah per modul sesuai posisi A/B yang tampil di layar (untuk compute).
function fromCanon(c){
  return Object.fromEntries(MODS.map(m=>[m.id,m.items.map(it=>{const v=c&&c[it.id];return valid(v)?(it.k==='fc'?eff(it,v):v):0})]));
}
const resultOf=c=>compute(fromCanon(c));
const ITEM_IDS=new Set(MODS.flatMap(m=>m.items.map(it=>it.id)).concat(DEEP.map(d=>d[0])));
// File versi 1: modul facet 40 soal dengan urutan lama.
function legacyFacetV1(arr,c){
  const axes=Object.keys(FACETS);
  axes.forEach((ax,ai)=>LEGACY_FACET_V1[ax].forEach((id,k)=>{const p=k*axes.length+ai,v=arr&&arr[p];if(id&&valid(v))c[id]=p%2?6-v:v}));
}
// File versi 1 dan 2: jawaban per posisi. Dibaca lewat LAYOUT_V2 (awalan ~ = A/B ditukar).
function legacyAns(ans,v1){
  const c={};
  Object.entries(LAYOUT_V2).forEach(([mid,ids])=>{
    if(v1&&mid==='facet'){legacyFacetV1(ans.facet,c);return}
    const a=Array.isArray(ans[mid])?ans[mid]:[];ids.forEach((raw,i)=>{const fl=raw[0]==='~',id=fl?raw.slice(1):raw,v=a[i];if(valid(v))c[id]=fl?6-v:v});
  });
  return c;
}
const cleanC=c=>{const o={};if(c&&typeof c==='object')Object.keys(c).forEach(k=>{if(ITEM_IDS.has(k)&&valid(c[k]))o[k]=c[k]});return o};
const clean=(s,n)=>String(s==null?'':s).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g,'').trim().slice(0,n);
const esc=s=>String(s).replace(/[&<>"'`]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]));
const safeName=s=>String(s||'').replace(/[<>&"'`]/g,'').trim().slice(0,30);
const fileSlug=s=>safeName(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const emptyAns=()=>Object.fromEntries(MODS.map(m=>[m.id,[]]));
function cleanNotes(n){
  if(!Array.isArray(n))return [];
  return n.filter(x=>x&&typeof x==='object').map(x=>({tag:clean(x.tag,40),title:clean(x.title,90),text:clean(x.text,900)})).filter(x=>x.title||x.text).slice(0,12);
}
function sanitizeImport(d){
  if(!d||typeof d!=='object'||d.app!==APP_ID)return null;
  let c,old=false;
  if(d.v===DATA_V){if(!d.c||typeof d.c!=='object')return null;c=cleanC(d.c)}
  else{if(!d.ans||typeof d.ans!=='object')return null;c=cleanC(legacyAns(d.ans,d.v!==2));old=true}
  const missing=MAIN.reduce((s,m)=>s+m.items.filter(it=>!valid(c[it.id])).length,0);
  const hadAny=old&&Object.values(d.ans).some(a=>Array.isArray(a)&&a.some(valid));
  return {v:DATA_V,name:safeName(d.name),c,summary:clean(d.summary,900),notes:cleanNotes(d.notes),migrated:hadAny&&missing>0,missing};
}
const exportData=(name,c,extra)=>{const o={app:APP_ID,v:DATA_V,name:safeName(name),date:new Date().toISOString(),c:cleanC(c)};
  if(extra&&extra.summary)o.summary=clean(extra.summary,900);const n=cleanNotes(extra&&extra.notes);if(n.length)o.notes=n;return o};

// Link hasil: seluruh isi file jawaban, dipadatkan ke base64url di bagian # URL (nggak pernah dikirim ke server).
const b64e=str=>{const bytes=new TextEncoder().encode(str);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64d=str=>{const bin=atob(str.replace(/-/g,'+').replace(/_/g,'/'));return new TextDecoder().decode(Uint8Array.from(bin,ch=>ch.charCodeAt(0)))};
function encodeShare(data){
  const o={v:DATA_V,n:data.name||'',c:cleanC(data.c)};
  if(data.summary)o.s=data.summary;if(data.notes&&data.notes.length)o.t=data.notes.map(x=>[x.tag,x.title,x.text]);
  return b64e(JSON.stringify(o));
}
function decodeShare(str){
  try{
    if(typeof str!=='string'||!/^[A-Za-z0-9_-]{8,20000}$/.test(str))return null;
    const o=JSON.parse(b64d(str));if(!o||typeof o!=='object')return null;
    const notes=Array.isArray(o.t)?o.t.map(x=>Array.isArray(x)?{tag:x[0],title:x[1],text:x[2]}:null):[];
    if(o.v===DATA_V&&o.c)return sanitizeImport({app:APP_ID,v:DATA_V,name:o.n,c:o.c,summary:o.s,notes});
    if(o.a)return sanitizeImport({app:APP_ID,v:2,name:o.n,ans:Object.fromEntries(Object.keys(LAYOUT_V2).map(k=>[k,String(o.a[k]||'').split('').map(Number)])),summary:o.s,notes});
    return null;
  }catch(e){return null}
}

const nmf=(n,d=1)=>n.toFixed(d).replace('.',',');
const sgn=v=>(v>0?'+':v<0?'−':'')+nmf(Math.abs(v));

// ---------- Ringkasan kepribadian dari skor ----------
// Setiap kalimat punya dasar skor yang ditampilkan, biar bukan ramalan umum yang cocok buat siapa aja.
const FAC_TXT={
EI:[["Kamu cenderung yang memulai: mengajak berkenalan, menghubungi lebih dulu, atau mengajak berkumpul.","Kamu jarang memulai interaksi. Biasanya kamu menunggu diajak atau dihubungi lebih dulu."],
["Perasaanmu mudah terbaca dari luar. Orang di sekitarmu biasanya tahu suasana hatimu.","Perasaanmu jarang terlihat dari luar. Kamu lebih memilih menyimpannya sendiri."],
["Kamu menikmati lingkar pertemanan yang luas dan obrolan ramai yang berganti-ganti topik.","Kamu lebih memilih sedikit teman yang benar-benar dekat, dan obrolan berdua yang mendalam."],
["Kamu berpikir sambil berinteraksi. Ide dan energimu justru muncul saat bersama orang.","Kamu mengolah ide dan pengalaman sendiri dulu, dan butuh waktu sendiri untuk mengisi energi."],
["Di kelompok, kamu termasuk yang ikut menghidupkan suasana.","Di kelompok, kamu lebih banyak menyimak dan bicara seperlunya."]],
SN:[["Kamu menangkap kata-kata apa adanya dan lebih suka orang bicara langsung tanpa kiasan.","Kamu cepat menangkap makna tersirat, baik dari kiasan maupun dari nada bicara orang."],
["Kamu memilih solusi yang sudah terbukti dan menghargai hal yang masuk akal.","Kamu suka mengakali masalah dengan cara kreatif dan senang punya ide yang tidak terpikir orang lain."],
["Menurutmu, ide yang bagus adalah ide yang bisa dipakai.","Kamu menikmati ide dan pengetahuan walaupun tidak langsung berguna."],
["Kamu belajar dengan langsung mencoba, tanpa perlu tahu teorinya dulu.","Kamu ingin memahami cara kerja dan alasan di balik sesuatu."],
["Kamu nyaman dengan cara standar dan gaya yang umum.","Kamu cenderung mencari cara sendiri dan punya gaya yang berbeda dari kebanyakan orang."]],
TF:[["Saat ada masalah, yang pertama kamu cari adalah penyebab dan jalan keluarnya.","Saat ada masalah, yang pertama kamu perhatikan adalah orangnya dan perasaannya."],
["Kamu memegang aturan dan janji secara konsisten, termasuk kepada orang yang sedang kesulitan.","Kamu mudah memberi kelonggaran kalau kondisi seseorang memang sulit."],
["Kamu tidak segan meluruskan yang keliru dan bertahan dalam perdebatan sampai tuntas.","Kamu lebih memilih menjaga suasana daripada berdebat panjang."],
["Kamu cepat melihat celah dan kelemahan dalam ide atau tulisan orang.","Kamu cenderung melihat potensi dan maksud baik dulu sebelum mencari kekurangan."],
["Kamu menyampaikan hal yang tidak enak secara langsung dan singkat.","Kamu menyampaikan hal yang tidak enak dengan hati-hati, dan mudah tersentuh oleh kesedihan orang."]],
JP:[["Catatan, file, dan keuanganmu punya sistem yang jelas.","Catatan, file, dan keuanganmu cenderung mengalir tanpa sistem yang ketat."],
["Kamu suka tahu dari jauh hari apa yang akan kamu lakukan.","Kamu lebih suka membiarkan rencana tetap terbuka dan memutuskan belakangan."],
["Kamu mulai dan menyelesaikan tugas jauh sebelum deadline.","Tugas besar biasanya baru kamu kerjakan dan selesaikan mendekati deadline."],
["Harimu punya pola yang cukup tetap, termasuk jam tidur dan urutan kegiatan.","Harimu mengikuti suasana hati. Jam tidur dan kegiatanmu berubah-ubah."],
["Untuk hal baru, kamu mengikuti langkah dan urutan yang jelas.","Untuk hal baru, kamu langsung jalan dan membentuk strukturnya sambil mengerjakan."]]};
// [kalimat skor tinggi, kalimat skor rendah] per facet Big Five, urutan sama dengan B5.
const B5_TXT={
N:[["Kamu cukup sering mengkhawatirkan hal yang belum tentu terjadi.","Kamu jarang dihantui rasa cemas."],["Rasa kesal dan marah cukup mudah muncul.","Kamu tidak gampang terpancing marah."],["Suasana hatimu bisa turun tanpa alasan yang jelas.","Secara umum kamu cukup puas dengan hidupmu."],["Kamu mudah merasa malu atau canggung di depan orang.","Kamu tidak terlalu memikirkan penilaian orang tentangmu."],["Menahan keinginan sesaat, seperti belanja atau bermain lebih lama, terasa sulit.","Kamu cukup mudah menahan godaan."],["Di bawah tekanan, kamu mudah kewalahan.","Kamu cenderung tetap tenang saat krisis."]],
O:[["Kamu sering tenggelam dalam khayalan dan skenario di kepala.","Kamu jarang melamun. Pikiranmu lebih banyak di hal nyata."],["Musik, pemandangan, atau karya seni bisa sangat menyentuhmu.","Fungsi lebih penting bagimu daripada keindahan."],["Kamu mengenali dan merasakan emosimu dengan jelas dan dalam.","Kamu jarang memikirkan apa yang sedang kamu rasakan."],["Kamu suka mencoba makanan, tempat, dan cara baru.","Kamu lebih suka yang sudah biasa daripada berganti-ganti."],["Kamu menikmati ide dan teori yang rumit.","Diskusi yang terlalu teoretis cepat membuatmu bosan."],["Kamu suka mempertanyakan aturan dan tradisi yang dianggap sudah pasti benar.","Kamu cenderung menghormati aturan dan tradisi yang ada."]],
C:[["Kamu yakin dengan kemampuanmu menyelesaikan tugas.","Kamu cukup sering meragukan kemampuanmu sendiri."],["Barang-barangmu cenderung rapi dan ada di tempatnya.","Barang-barangmu cenderung berantakan."],["Kamu menepati janji walaupun tidak ada yang mengecek.","Kamu kadang melonggarkan janji atau aturan yang menurutmu tidak penting."],["Kamu punya target tinggi untuk hal yang kamu anggap penting.","Kamu cukup puas dengan hasil yang secukupnya."],["Begitu mulai, kamu bisa bertahan sampai selesai walaupun bosan.","Menunda pekerjaan adalah tantangan yang cukup besar bagimu."],["Kamu berpikir matang sebelum memutuskan.","Kamu kadang bicara atau bertindak dulu, baru menyesal kemudian."]],
A:[["Kamu cenderung percaya orang lain punya niat baik.","Kamu cukup waspada terhadap motif orang lain."],["Kamu apa adanya dan tidak suka memanipulasi orang.","Kamu cukup luwes memakai sikap manis untuk mendapat yang kamu mau."],["Kamu senang membantu orang tanpa pamrih.","Kamu cukup selektif soal mau repot demi orang lain."],["Kamu lebih memilih mengalah daripada ribut.","Kalau ada yang bersikap kasar, kamu tidak tinggal diam."],["Kamu tidak suka membicarakan kelebihanmu sendiri.","Kamu cukup yakin bahwa kamu lebih baik dari kebanyakan orang."],["Penderitaan orang yang tidak kamu kenal pun bisa menyentuhmu.","Kamu cenderung melihat kesulitan orang sebagai akibat pilihannya sendiri."]],
E:[["Kamu mudah akrab, bahkan dengan orang baru.","Kamu butuh waktu lama untuk benar-benar akrab dengan orang."],["Kamu menikmati tempat dan acara yang ramai.","Kamu menghindari keramaian kalau bisa."],["Dalam kelompok, kamu sering mengambil keputusan atau mengarahkan.","Dalam kelompok, kamu lebih nyaman kalau orang lain yang memimpin."],["Ritme hidupmu cepat dan kamu hampir selalu sibuk.","Kamu menyukai ritme hidup yang santai."],["Kamu menikmati hal yang memacu adrenalin.","Kamu menghindari hal yang terlalu heboh atau berisiko."],["Kamu mudah merasa senang dan antusias.","Rasa antusias dan gembira tidak terlalu sering muncul."]]};
const FN_STR={Fi:'Teguh pada prinsip',Fe:'Peka menjaga suasana',Ti:'Logis dan teliti',Te:'Efektif dan berorientasi hasil',Ni:'Membaca arah jangka panjang',Ne:'Kaya ide dan kemungkinan',Si:'Peka terhadap perubahan kecil',Se:'Sigap di saat ini'};
const FN_TXT={Fi:"Keputusan pentingmu bertumpu pada nilai pribadi yang kamu pegang.",Fe:"Kamu peka terhadap suasana kelompok dan berusaha menjaganya.",Ti:"Kamu ingin memahami sesuatu sampai ke logika dasarnya.",Te:"Kamu mengutamakan hasil, data, dan efisiensi.",Ni:"Kamu sering menangkap arah besar atau ujung dari suatu keadaan.",Ne:"Pikiranmu mudah melompat ke banyak kemungkinan.",Si:"Kamu banyak bertumpu pada pengalaman masa lalu dan peka terhadap perubahan kecil.",Se:"Kamu hidup di saat ini dan cepat merespons apa yang terjadi di sekitarmu."};
// Label singkat kekuatan [kutub kiri, kutub kanan] per facet; null = bukan kekuatan yang jelas.
const FAC_STR={EI:[["Berani memulai",null],["Terbuka dan mudah dibaca","Tenang dari luar"],["Jaringan pertemanan luas","Hubungan yang dalam dan setia"],["Berpikir cepat bersama orang","Mendalami sebelum bicara"],["Menghidupkan suasana","Pendengar yang baik"]],
SN:[["Lugas dan jelas","Peka terhadap makna tersirat"],["Solusi yang masuk akal","Kreatif mengakali masalah"],["Fokus pada yang berguna","Senang belajar apa saja"],["Belajar lewat praktik","Ingin paham sampai ke akar"],["Bisa diandalkan dengan cara yang terbukti","Punya cara sendiri"]],
TF:[["Cepat mencari solusi","Pendengar yang empatik"],["Konsisten dan adil","Mudah memberi kelonggaran"],["Kritis dan berani meluruskan","Menjaga suasana tetap enak"],["Teliti menemukan celah","Melihat potensi orang"],["Terus terang","Halus dalam menyampaikan"]],
JP:[["Rapi dan terstruktur","Santai soal detail"],["Siap jauh hari","Fleksibel saat rencana berubah"],["Menyelesaikan tugas lebih awal",null],["Ritme hidup teratur",null],["Teliti mengikuti langkah","Cepat mulai tanpa menunggu sempurna"]]};
const B5_STR={N:[["Tenang",0],["Sabar",0],["Puas dengan hidup",0],["Percaya diri di depan orang",0],["Pandai menahan diri",0],["Tenang saat krisis",0]],
O:[["Imajinatif",1],["Peka terhadap keindahan",1],["Kenal dengan emosinya sendiri",1],["Terbuka pada hal baru",1],["Senang mengulik ide",1],["Berani mempertanyakan hal yang dianggap pasti",1]],
C:[["Yakin pada kemampuan sendiri",1],["Rapi",1],["Bisa dipegang janjinya",1],["Punya target tinggi",1],["Tekun sampai selesai",1],["Berpikir matang",1]],
A:[["Berprasangka baik",1],["Jujur dan apa adanya",1],["Suka menolong",1],["Tidak suka ribut",1],["Rendah hati",1],["Peduli pada orang yang tidak dikenal",1]],
E:[["Mudah akrab",1],["Menikmati keramaian",1],["Berani memimpin",1],["Energik",1],["Berani mengambil risiko",1],["Ceria dan antusias",1]]};
const B5_WATCH={N:[["Mudah cemas soal hal yang belum terjadi",1],["Emosi marah cepat naik",1],["Suasana hati bisa turun tanpa sebab",1],["Mudah canggung di depan orang",1],["Sulit menahan keinginan sesaat",1],["Mudah kewalahan di bawah tekanan",1]],
C:[["Sering meragukan kemampuan sendiri",0],["Barang mudah berantakan",0],["Kadang longgar soal janji kecil",0],[null,0],["Mudah menunda pekerjaan",0],["Kadang bertindak sebelum berpikir",0]],
A:[["Sulit percaya pada orang baru",0],[null,0],[null,0],["Mudah terpancing konflik",0],[null,0],[null,0]],
E:[["Butuh waktu lama untuk akrab",0],[null,0],[null,0],[null,0],[null,0],[null,0]]};
const SECT=[['sosial','Bergaul dan mengisi energi'],['pikir','Cara berpikir'],['putus','Mengambil keputusan dan menghadapi orang'],['kerja','Mengatur waktu dan pekerjaan'],['emosi','Emosi dan stres']];
const AXSEC={EI:'sosial',SN:'pikir',TF:'putus',JP:'kerja'},B5SEC={N:'emosi',O:'pikir',C:'kerja',A:'putus',E:'sosial'};

function insights(R,cIn){
  const S=Object.fromEntries(SECT.map(s=>[s[0],[]])),str=[],watch=[],tips=[],special=[];
  const c=cIn||{},found=new Set(deepFindings(R,c).map(x=>x.key));
  const add=(sec,t,w,b,q)=>S[sec].push(q?{t,w,b,q}:{t,w,b});
  // Kutipan jawaban asli yang paling mendukung kalimat, supaya tiap orang membaca bukti dari jawabannya sendiri.
  const quoteFac=(ax,f,pole)=>{let best=null,bs=0;FITEMS.filter(x=>x[0]===ax&&x[1]===f).forEach(x=>{const v=c[x[5]];if(!valid(v))return;const st=pole?v-3:3-v;if(st>bs){bs=st;best=pole?x[4]:x[3]}});return best?`Kamu memilih: “${best}”`:''};
  const quoteB5=(d,i,hi)=>{const f=B5.find(x=>x[0]===d)[2][i],p=c[f[3]],r=c[f[4]],cand=[];
    if(valid(p))cand.push(hi?[p-3,`Kamu setuju: “${f[1]}”`]:[3-p,`Kamu tidak setuju: “${f[1]}”`]);
    if(valid(r))cand.push(hi?[3-r,`Kamu tidak setuju: “${f[2]}”`]:[r-3,`Kamu setuju: “${f[2]}”`]);
    cand.sort((a,b)=>b[0]-a[0]);return cand.length&&cand[0][0]>0?cand[0][1]:''};
  const fnRank=f=>R.fn?R.fn.findIndex(x=>x.f===f):-1,fnG=f=>R.fn?R.fn.find(x=>x.f===f).g:NaN;
  const b5f=(d,name)=>R.b5?R.b5[d].fs[B5.find(x=>x[0]===d)[2].findIndex(f=>f[0]===name)]:NaN;
  const fac=(ax,f)=>R.fac?R.fac[ax][f]:NaN;
  const facB=(ax,f)=>`Facet ${FACETS[ax][f][fac(ax,f)>=0?1:0]} ${sgn(fac(ax,f))}`;
  const b5B=(d,name)=>`Big Five ${name} ${nmf(b5f(d,name))}`;
  // pola gabungan
  const covered=new Set();
  const sp=(sec,t,b,kind,cov,key)=>{if(key&&found.has(key))return;add(sec,t,3,b);special.push({t,b,sec});if(kind==='watch')watch.push({t:t.split('. ')[0].replace(/\.$/,''),w:1.2,b});(cov||[]).forEach(k=>covered.add(k))};
  const pos=['ei-x1','ei-x2','ei-x4','ei-x6'].map(k=>c[k]).filter(valid),neg=[['ei-x5','kesal']].filter(([k])=>valid(c[k])&&c[k]<=2).map(x=>x[1]);
  if(pos.length>=3&&avg(pos)>=4&&neg.length)sp('emosi',`Rasa ${neg.join(' dan ')} mudah terlihat dari luar, sementara senang, sedih, antusias, dan hal yang mengganggu pikiranmu cenderung kamu simpan sendiri.`,`Soal Expressive per jenis emosi`,null,['EI1'],'bocor');
  if(R.hasType&&R.ax.EI>=75&&b5f('N','Canggung')>=4)sp('sosial','Selain butuh waktu sendiri untuk mengisi energi, situasi sosial juga bisa terasa menegangkan bagimu. Keduanya berbeda: yang pertama soal energi, yang kedua soal rasa cemas.',`Introvert ${Math.round(R.ax.EI)}% · ${b5B('N','Canggung')}`,null,null,'introcanggung');
  if(R.hasType&&R.ax.JP>=60&&R.fn&&fnRank('Si')<=1)sp('kerja','Kamu menyukai hal yang familiar, tapi bukan karena suka jadwal. Rutinitasmu terbentuk dari kenyamanan, bukan dari rencana.',`Prospecting ${Math.round(R.ax.JP)}% · Fungsi Si ${nmf(fnG('Si'))}`,null,null,'rutin');
  if(R.fac&&fac('JP',2)>=1&&R.b5&&(b5f('N','Mudah kewalahan')>=4||(R.ax.AT||0)>=65))sp('kerja','Kamu sering mengerjakan tugas mendekati deadline, padahal tekanan membuatmu stres. Mencicil sedikit di awal bisa mengurangi beban itu.',`${facB('JP',2)} · ${b5B('N','Mudah kewalahan')}`,'watch',['JP2'],'telat');
  if(R.fn&&fnRank('Fi')<=1&&fnRank('Fe')>=5)sp('putus','Kamu berpegang pada nilai pribadi, bukan pada apa yang dianggap pantas oleh kelompok. Kamu tidak merasa wajib menjaga suasana kalau itu bertentangan dengan prinsipmu.',`Fungsi Fi ${nmf(fnG('Fi'))} · Fe ${nmf(fnG('Fe'))}`);
  if(R.src&&R.src.TF&&R.src.TF.inti!=null&&R.src.TF.facet!=null&&Math.abs(R.src.TF.inti-R.src.TF.facet)>=20){const b=`T/F modul Inti ${Math.round(R.src.TF.inti)}% F · Facet ${Math.round(R.src.TF.facet)}% F`;
    sp('putus',R.src.TF.inti>R.src.TF.facet?'Cara memutuskanmu bergantung pada siapa orangnya. Untuk orang dekat dan hidupmu sendiri kamu memakai perasaan, tapi kepada kenalan dan urusan tugas kamu lebih logis dan tegas.':'Untuk keputusan besar kamu cenderung logis, tapi saat berhadapan langsung dengan orang kamu lebih lunak.',b,null,null,'tfctx')}
  if(R.fac&&fac('TF',2)<=-1&&R.b5&&b5f('A','Mengalah')<=2.5)sp('putus','Kamu tidak mudah mengalah dalam perdebatan. Kamu lebih memilih meluruskan yang keliru walaupun suasananya jadi tegang.',`${facB('TF',2)} · ${b5B('A','Mengalah')}`,null,['TF2']);
  if(R.hasType&&R.fn){const st=STACK[R.type],ni=fnG('Ni'),ne=fnG('Ne');
    if(st.slice(0,2).includes('Ne')&&ni-ne>=.8)sp('pikir',`Intuisimu lebih berupa firasat yang mengerucut ke satu kesimpulan (Ni) daripada lompatan ke banyak kemungkinan (Ne). Ini tidak umum untuk tipe ${R.type}.`,`Fungsi Ni ${nmf(ni)} · Ne ${nmf(ne)}`);
    else if(st.slice(0,2).includes('Ni')&&ne-ni>=.8)sp('pikir',`Intuisimu lebih berupa lompatan ke banyak kemungkinan (Ne) daripada firasat yang mengerucut (Ni). Ini tidak umum untuk tipe ${R.type}.`,`Fungsi Ne ${nmf(ne)} · Ni ${nmf(ni)}`)}
  if(R.b5&&b5f('O','Ide')>=4&&b5f('C','Disiplin diri')<=2)sp('kerja','Minat dan idemu banyak, tapi menyelesaikannya butuh dorongan. Target kecil yang jelas biasanya lebih membantu daripada rencana besar.',`${b5B('O','Ide')} · ${b5B('C','Disiplin diri')}`,'watch');
  if(R.b5&&R.b5.N.dom>=3.8&&b5f('E','Emosi positif')<=2.5)sp('emosi','Suasana hatimu lebih mudah turun daripada naik. Hal kecil yang menyenangkan perlu sengaja kamu cari.',`Neuroticism ${nmf(R.b5.N.dom)} · ${b5B('E','Emosi positif')}`,'watch');
  // facet
  if(R.fac)Object.keys(FACETS).forEach(ax=>R.fac[ax].forEach((v,f)=>{
    if(Math.abs(v)<1)return;const pole=v>0?1:0;if(!covered.has(ax+f))add(AXSEC[ax],FAC_TXT[ax][f][pole],Math.abs(v)/2,facB(ax,f),quoteFac(ax,f,pole));
    const s=FAC_STR[ax][f][pole];if(s)str.push({t:s,w:Math.abs(v)/2,b:facB(ax,f),cat:ax});}));
  // Big Five facet
  if(R.b5)B5.forEach(d=>d[2].forEach((f,i)=>{const v=R.b5[d[0]].fs[i];if(v>2&&v<4)return;const hi=v>=4,sec=(d[0]==='O'&&i===2)?'emosi':B5SEC[d[0]];
    add(sec,B5_TXT[d[0]][i][hi?0:1],Math.abs(v-3)/2*.95,b5B(d[0],f[0]),quoteB5(d[0],i,hi));
    const st=B5_STR[d[0]][i];if(st&&(st[1]?hi:!hi)&&v!==3)str.push({t:st[0],w:Math.abs(v-3)/2*.9,b:b5B(d[0],f[0]),cat:d[0]});
    const wt=B5_WATCH[d[0]]&&B5_WATCH[d[0]][i];if(wt&&wt[0]&&(wt[1]?hi:!hi))watch.push({t:wt[0],w:Math.abs(v-3)/2,b:b5B(d[0],f[0])});}));
  // fungsi teratas
  if(R.fn)R.fn.slice(0,2).forEach((x,i)=>{add('pikir',FN_TXT[x.f],.8-i*.15,`Fungsi ${x.f} ${nmf(x.g)} (peringkat ${i+1})`);if(x.g>=3.5)str.push({t:FN_STR[x.f],w:1.05-i*.1,b:`Fungsi ${x.f} ${nmf(x.g)}`,cat:'fn'})});
  if(R.hasType&&R.ax.AT>=65)watch.push({t:'Keras pada diri sendiri',w:(R.ax.AT-50)/50,b:`Turbulent ${Math.round(R.ax.AT)}%`});
  if(R.fac&&fac('JP',2)>=1&&!watch.some(x=>/deadline/.test(x.t)))watch.push({t:'Sering mengerjakan mepet deadline',w:fac('JP',2)/2*.8,b:facB('JP',2)});
  if(R.fac&&fac('TF',4)<=-1)watch.push({t:'Bisa terdengar terlalu blak-blakan',w:.5,b:facB('TF',4)});
  // tips buat orang lain
  const tip=(t,b,w=1)=>tips.push({t,b,w});
  if(R.fac){
    if(fac('EI',0)>=1)tip('Kamu jarang memulai. Teman yang mengajak lebih dulu akan lebih mudah dekat denganmu.',facB('EI',0),1.1);
    if(fac('EI',0)<=-1)tip('Kamu sering yang mengajak lebih dulu. Membalas ajakanmu membuatmu merasa tidak berjalan sendiri.',facB('EI',0));
    if(fac('EI',2)>=1)tip('Obrolan berdua lebih cocok untukmu daripada keramaian.',facB('EI',2));
    if(fac('EI',2)<=-1)tip('Kamu menikmati suasana ramai. Ajak kamu ke acara kelompok.',facB('EI',2));
    if(special.some(x=>/kesal/.test(x.t)))tip('Kalau kamu terlihat kesal, kamu butuh ruang dulu sebelum diajak bicara.','Soal Expressive per jenis emosi',1.05);
    else if(fac('EI',1)>=.5)tip('Perasaanmu jarang terlihat, jadi orang perlu bertanya langsung bagaimana kabarmu.',facB('EI',1));
    if(fac('EI',1)<=-1)tip('Perasaanmu mudah terbaca. Tanggapi saat kamu terlihat senang atau sedih.',facB('EI',1));
    if(fac('EI',3)>=1)tip('Beri waktu untuk berpikir. Kamu tidak suka didesak menjawab cepat.',facB('EI',3));
    if(fac('TF',2)<=-1)tip('Kamu suka adu argumen. Itu tanda kamu serius dengan topiknya, bukan tanda tidak suka orangnya.',facB('TF',2));
    if(fac('TF',4)<=-1)tip('Kamu bicara terus terang. Itu bukan serangan.',facB('TF',4));
    if(fac('TF',4)>=1)tip('Kritik lebih mudah kamu terima kalau disampaikan dengan halus.',facB('TF',4));
  }
  if(R.hasType&&R.ax.EI>=80)tip('Ajakan yang kamu tolak biasanya soal energi, bukan soal orangnya.',`Introvert ${Math.round(R.ax.EI)}%`,.95);
  if(R.fn&&fnRank('Fi')<=1)tip('Prinsipmu kuat. Memaksamu ikut arus jarang berhasil. Lebih baik ajak bicara soal alasannya.',`Fungsi Fi ${nmf(fnG('Fi'))}`,.9);
  if(R.b5&&R.b5.N.dom>=3.8)tip('Saat kamu tertekan, kehadiran yang tenang biasanya lebih membantu daripada banyak nasihat.',`Neuroticism ${nmf(R.b5.N.dom)}`,.85);
  if(R.hasType&&R.ax.JP>=65)tip('Rencana kaku jauh hari kurang cocok untukmu. Ruang untuk berubah pikiran lebih membantu.',`Prospecting ${Math.round(R.ax.JP)}%`,.8);
  if(R.hasType&&R.ax.JP<=35)tip('Kamu menghargai kepastian. Kabari perubahan rencana sejak awal.',`Judging ${Math.round(100-R.ax.JP)}%`,.8);
  // ringkasan
  let summary='';
  if(R.hasType){
    const D={EI:[['sangat menikmati dan mendapat energi dari interaksi dengan orang','lebih banyak mengisi energi lewat interaksi dengan orang','cenderung mengisi energi lewat interaksi dengan orang'],['sangat membutuhkan waktu sendiri untuk mengisi energi','lebih banyak mengisi energi lewat waktu sendiri','cenderung mengisi energi lewat waktu sendiri'],'seimbang antara waktu sendiri dan bersama orang'],
      SN:[['sangat berpegang pada fakta dan hal yang konkret','berpegang pada fakta dan hal yang konkret','cenderung berpegang pada hal yang konkret'],['sangat menikmati pola, konsep, dan makna','berpikir lewat pola, konsep, dan makna','cenderung berpikir lewat konsep dan makna'],'seimbang antara hal konkret dan konsep'],
      TF:[['memutuskan dengan logika dan konsistensi','menimbang keputusan dengan logika','cenderung menimbang keputusan dengan logika'],['memutuskan berdasarkan nilai dan dampaknya ke orang','menimbang keputusan dengan nilai dan perasaan','cenderung menimbang keputusan dengan nilai dan perasaan'],'berada di antara logika dan perasaan, tergantung situasinya'],
      JP:[['sangat menyukai rencana dan kepastian','lebih suka rencana dan kepastian','cenderung suka rencana'],['sangat suka hidup yang terbuka dan fleksibel','lebih suka terbuka dan fleksibel daripada terjadwal','cenderung suka yang fleksibel'],'seimbang antara rencana dan spontanitas']};
    const part=ax=>{const p=R.ax[ax],d=Math.abs(p-50);return d<5?D[ax][2]:D[ax][p>=50?1:0][d>=30?0:d>=15?1:2]};
    const ps=['EI','SN','TF','JP'].map(part);
    summary=`Kamu ${ps[0]}, ${ps[1]}, ${ps[2]}, dan ${ps[3]}.`;
    if(R.ax.AT!=null){const a=R.ax.AT;summary+=a>=65?' Emosimu cukup mudah terguncang oleh kritik, tekanan, dan keraguan diri.':a>=50?' Kadang kamu cukup keras pada dirimu sendiri.':a>=35?' Kamu cukup tenang menghadapi kritik dan tekanan.':' Kamu tenang dan yakin diri saat menghadapi kritik dan tekanan.'}
    if(special.length)summary+=' '+special[0].t;
  }
  // seberapa bisa dipegang
  const rel={sure:[],mid:[],unsure:[]};
  if(R.hasType)['EI','SN','TF','JP','AT'].filter(ax=>R.ax[ax]!=null).forEach(ax=>{const p=R.ax[ax],d=Math.abs(p-50),s=R.src[ax],gap=s.inti!=null&&s.facet!=null?Math.abs(s.inti-s.facet):0;
    const name=`${p>=50?AX[ax][3]:AX[ax][2]} ${Math.round(p>=50?p:100-p)}%`;(d<10||gap>=30?rel.unsure:d>=25&&gap<25?rel.sure:rel.mid).push(name)});
  const by=a=>a.sort((x,y)=>y.w-x.w);
  const uniq=a=>a.filter((x,i)=>a.findIndex(y=>y.t===x.t)===i);
  return {summary,special,sections:SECT.map(([id,title])=>({id,title,items:by(S[id]).slice(0,6)})).filter(s=>s.items.length),
    strengths:uniq(by(str)).filter((x,i,a)=>a.slice(0,i).filter(y=>y.cat===x.cat).length<2).slice(0,6),watch:uniq(by(watch)).slice(0,5),tips:uniq(by(tips)).slice(0,6),rel};
}

// ---------- Pendalaman adaptif ----------
// Setiap soal punya pemicu dari pola hasil modul utama. Soal lanjutan hanya muncul setelah jawaban tertentu.
function probeCtx(R,c){
  const b5f=(d,name)=>R.b5?R.b5[d].fs[B5.find(x=>x[0]===d)[2].findIndex(f=>f[0]===name)]:NaN;
  const fac=(ax,f)=>R.fac?R.fac[ax][f]:NaN,fnRank=f=>R.fn?R.fn.findIndex(x=>x.f===f):-1;
  const ax=k=>R.hasType&&R.ax[k]!=null?R.ax[k]:NaN,dist=k=>Math.abs(ax(k)-50);
  const gap=k=>{const s=R.src&&R.src[k];return s&&s.inti!=null&&s.facet!=null?Math.abs(s.inti-s.facet):0};
  const has=k=>valid(c[k]),hi=k=>has(k)&&c[k]>=4,lo=k=>has(k)&&c[k]<=2;
  return {b5f,fac,fnRank,ax,dist,gap,has,hi,lo};
}
const PROBE_RULES={
  'd-energi':X=>X.ax('EI')>=55&&(X.b5f('N','Canggung')>=3.5||X.fac('EI',0)>=1||X.fac('EI',4)>=1),
  'd-gugup-ganggu':X=>X.hi('d-energi')||(X.b5f('N','Canggung')>=4&&X.ax('EI')>=55),
  'd-sendiri':X=>X.ax('EI')<=50,
  'd-diam':X=>X.fac('EI',4)>=.5,
  'd-bocor':(X,c)=>X.lo('ei-x5')&&avg(['ei-x1','ei-x2','ei-x4','ei-x6'].map(k=>c[k]).filter(valid))>=3.5,
  'd-kebiasaan':X=>X.gap('SN')>=20||X.dist('SN')<10,
  'd-pikiran':X=>X.gap('SN')>=20||X.dist('SN')<10,
  'd-dekat':X=>X.gap('TF')>=20||X.dist('TF')<12||X.fnRank('Fi')<=1,
  'd-kenal':X=>X.gap('TF')>=20||X.dist('TF')<12||X.fnRank('Fi')<=1,
  'd-dekat-ulang':X=>X.hi('d-dekat'),
  'd-debat-dekat':X=>X.fac('TF',2)<=-1,
  'd-yakin':X=>X.dist('TF')<10||(X.fnRank('Fi')<=1&&X.fnRank('Ti')<=3),
  'd-pantas':X=>X.b5f('A','Mudah tersentuh')>=4||X.fac('TF',4)>=1,
  'd-telat':(X,c)=>X.fac('JP',2)>=.5||(valid(c.c28)&&c.c28>=4),
  'd-rutin':X=>X.fnRank('Si')<=2||X.fac('JP',3)<=-.5,
  'd-batal':X=>X.ax('JP')<=45,
  'd-berarti':X=>X.fnRank('Fi')<=1||X.b5f('C','Disiplin diri')<=2.5||X.b5f('C','Ambisi')>=4,
  'd-ingin-rapi':X=>X.b5f('C','Keteraturan')<=2.5,
  'd-ingin-tuntas':X=>X.b5f('C','Disiplin diri')<=2.5,
  'd-marah':X=>X.b5f('N','Mudah marah')>=3.5,
  'd-cemas':X=>X.b5f('N','Cemas')>=4,
  'd-tekanan':X=>R_N(X)>=3.5};
const R_N=X=>X._N;
const PROBE_FALLBACK=['d-tekanan','d-berarti','d-yakin','d-kebiasaan','d-pikiran','d-batal'];
const deepFlip=id=>[...id].reduce((s,ch)=>s+ch.charCodeAt(0),0)%2===1;
// Soal Pendalaman yang berlaku sekarang. Kosong sampai semua modul utama selesai.
function deepPlan(R,cIn){
  const c=cIn||{};if(!R||!R.hasType||!R.fac||!R.b5||!R.fn)return [];
  const X=probeCtx(R,c);X._N=R.b5.N.dom;
  const ids=DEEP.map(d=>d[0]).filter(id=>{try{return !!PROBE_RULES[id](X,c)}catch(e){return false}});
  for(const id of PROBE_FALLBACK){if(ids.length>=5)break;if(!ids.includes(id))ids.push(id)}
  const order=DEEP.map(d=>d[0]);ids.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  return ids.map(id=>{const d=DEEP.find(x=>x[0]===id),fl=d[1]==='fc'&&deepFlip(id);return d[1]==='fc'?{k:'fc',id,q:d[2],a:fl?d[4]:d[3],b:fl?d[3]:d[4],fl}:{k:'lk',id,q:d[2],fl:false}});
}
const deepDone=(R,c)=>{const p=deepPlan(R,c);return p.length>0&&p.every(it=>valid(c[it.id]))};

// ---------- Temuan khusus: jawaban Pendalaman + skor utama ----------
function deepFindings(R,cIn){
  const c=cIn||{},out=[],X=probeCtx(R,c),{b5f,fac,fnRank,ax,has,hi,lo}=X;
  const add=(key,tag,title,text,b)=>out.push({key,tag,title,text,b});
  const pct=k=>`${AX[k][ax(k)>=50?3:2]} ${Math.round(ax(k)>=50?ax(k):100-ax(k))}%`;
  // E/I
  if(lo('d-energi')&&ax('EI')>=55)add('introcanggung',`E/I · ${pct('EI')}`,'Introvert murni','Walaupun tanpa rasa gugup, kamu tetap memilih waktu sendiri. Introvert-mu soal sumber energi, bukan soal rasa cemas.'+(b5f('N','Canggung')>=4?' Rasa canggung di depan orang adalah lapisan terpisah di atasnya.':''),`Pendalaman · ${pct('EI')}${R.b5?` · Canggung ${nmf(b5f('N','Canggung'))}`:''}`);
  if(hi('d-energi')&&ax('EI')>=55)add('introcanggung',`E/I · ${pct('EI')}`,'Sebagian karena cemas, bukan hanya preferensi','Kamu cenderung menjauhi keramaian, tapi tanpa rasa gugup kamu sebenarnya ingin lebih sering bersama orang. Sebagian sikap tertutupmu kemungkinan berasal dari rasa cemas, bukan dari kebutuhan energi.',`Pendalaman · ${pct('EI')}`);
  if(hi('d-gugup-ganggu'))add('gugup','Kecemasan sosial','Rasa gugup yang mulai membatasi','Rasa gugup di depan orang cukup sering membuatmu menghindari hal yang sebenarnya ingin kamu lakukan. Ini bukan bagian dari sifat introvert dan bisa dilatih. Kalau terasa berat, berbicara dengan psikolog adalah langkah yang wajar.',`Pendalaman${R.b5?` · Canggung ${nmf(b5f('N','Canggung'))}`:''}`);
  if(lo('d-sendiri')&&ax('EI')<=50)add('sendiri',`E/I · ${pct('EI')}`,'Ekstrovert yang tetap nyaman sendiri','Kamu menikmati bersama orang, tapi seharian sendiri pun tetap nyaman bagimu. Energimu fleksibel, tidak bergantung penuh pada keramaian.',`Pendalaman · ${pct('EI')}`);
  if(hi('d-sendiri')&&ax('EI')<=50)add('sendiri',`E/I · ${pct('EI')}`,'Energi dari orang lain','Kamu benar-benar mengisi energi lewat orang lain. Sendirian terlalu lama membuatmu gelisah, jadi jadwal yang terlalu sepi bisa menurunkan semangatmu.',`Pendalaman · ${pct('EI')}`);
  if(hi('d-diam')&&fac('EI',4)>=.5)add('diam','Facet Quiet','Diam karena sungkan, bukan karena tidak ingin','Kamu sering diam di kelompok bukan karena tidak ada yang ingin kamu katakan, tapi karena gugup atau sungkan.',`Pendalaman · Facet Quiet ${sgn(fac('EI',4))}`);
  if(lo('d-diam')&&fac('EI',4)>=.5)add('diam','Facet Quiet','Diam karena pilihan','Kamu diam di kelompok karena memang tidak merasa perlu bicara, bukan karena takut atau sungkan.',`Pendalaman · Facet Quiet ${sgn(fac('EI',4))}`);
  if(hi('d-bocor'))add('bocor','Ekspresi emosi','Emosi yang bocor tanpa dipilih','Hampir semua perasaanmu kamu simpan sendiri. Rasa kesal adalah pengecualian: ia terlihat dari luar walaupun sebenarnya ingin kamu tahan.','Pendalaman · soal Expressive per jenis emosi');
  if(lo('d-bocor'))add('bocor','Ekspresi emosi','Kesal yang sengaja diperlihatkan','Hampir semua perasaanmu kamu simpan sendiri, tapi rasa kesal sengaja kamu perlihatkan supaya orang tahu batasmu.','Pendalaman · soal Expressive per jenis emosi');
  // S/N
  if(has('d-kebiasaan')&&has('d-pikiran')){const k=c['d-kebiasaan'],p=c['d-pikiran'],b=`Pendalaman · S/N modul Inti ${R.src&&R.src.SN&&R.src.SN.inti!=null?Math.round(R.src.SN.inti)+'% N':'-'} · Facet ${R.src&&R.src.SN&&R.src.SN.facet!=null?Math.round(R.src.SN.facet)+'% N':'-'}`;
    if(k<=2&&p>=4)add('sn','S/N · dua wilayah','N di pikiran, S di kebiasaan','Cara berpikirmu konseptual, tapi kebiasaan sehari-harimu menyukai yang familiar. Itu yang membuat skor S/N bisa terlihat goyang: kedua sisi memang ada, di wilayah yang berbeda.',b);
    else if(k>=4&&p<=2)add('sn','S/N · dua wilayah','Praktis di pikiran, suka variasi di keseharian','Saat berpikir kamu berpegang pada fakta dan contoh nyata, tapi dalam keseharian kamu suka mencoba hal baru.',b);
    else if(k<=2&&p<=2)add('sn','S/N','Konkret dan familiar','Baik dalam berpikir maupun kebiasaan, kamu berpegang pada yang nyata dan sudah terbukti.',b);
    else if(k<=2&&p===3)add('sn','S/N · dua wilayah','Familiar di kebiasaan, terbuka di pikiran','Kebiasaanmu menyukai yang familiar, sedangkan pikiranmu nyaman di fakta maupun konsep. Sisi S-mu lebih terlihat di kebiasaan daripada di cara berpikir.',b);
    else if(k>=4&&p>=4)add('sn','S/N','Konsep dan variasi','Baik dalam berpikir maupun kebiasaan, kamu tertarik pada kemungkinan dan hal baru.',b)}
  // T/F
  if(has('d-dekat')&&has('d-kenal')){const b='Pendalaman · orang tersayang vs kenalan',ul=hi('d-dekat-ulang')?' Bagimu sayang bukan berarti lemah: kesalahan yang berulang tetap kamu maafkan, tapi kamu bicarakan dari hati ke hati dengan tegas.':lo('d-dekat-ulang')?' Tapi kesabaranmu ada batasnya: kesalahan yang terus berulang membuatmu menjaga jarak.':'';
    if(c['d-dekat']>=4&&c['d-kenal']<=2)add('tfctx','T/F · konteks','Filternya: siapa orangnya bagimu','Kepada orang yang kamu sayang kamu mengalah dan memaafkan, tapi kepada kenalan biasa kamu tegas. Cara memutuskanmu berubah tergantung seberapa berarti orang itu bagimu.'+ul,b);
    else if(c['d-dekat']>=4&&c['d-kenal']>=4)add('tfctx','T/F · konteks','Mudah memaafkan siapa pun','Kamu cenderung memaafkan dan mengalah, baik kepada orang terdekat maupun kenalan biasa.'+(ul||' Hati-hati, kebaikan ini bisa dimanfaatkan orang.'),b);
    else if(c['d-dekat']<=2&&c['d-kenal']<=2)add('tfctx','T/F · konteks','Tegas kepada siapa pun','Kamu menegur kesalahan dengan tegas, bahkan kepada orang yang paling kamu sayang. Kamu konsisten, tapi orang terdekat bisa merasa kurang diberi kelonggaran.',b)}
  if(has('d-debat-dekat')&&fac('TF',2)<=-1){const b=`Pendalaman · Facet Questioning ${sgn(fac('TF',2))}`;
    if(lo('d-debat-dekat'))add('debat','T/F · debat','Bertahan tanpa pengecualian','Kamu tetap bertahan dalam perdebatan, bahkan dengan orang yang kamu sayang. Bagimu, kebenaran lebih penting daripada suasana.',b);
    if(hi('d-debat-dekat'))add('debat','T/F · debat','Teguh, kecuali kepada orang tersayang','Dengan orang lain kamu bertahan sampai tuntas, tapi dengan orang yang kamu sayang kamu memilih mengalah. Hubungan itu lebih penting daripada menang.',b)}
  const mid=k=>has(k)&&c[k]===3;
  if(mid('d-yakin'))add('yakin','Cara meyakinkan diri','Logika dan hati harus sepakat','Keputusan pribadimu baru terasa mantap kalau alasannya masuk akal dan juga terasa benar di hati. Kalau salah satunya belum setuju, kamu cenderung menunda memutuskan.','Pendalaman · jawaban seimbang');
  if(lo('d-yakin'))add('yakin','Cara meyakinkan diri','Yakin lewat alasan','Keputusan pribadimu baru terasa mantap kalau alasannya bisa dijelaskan secara logis.',`Pendalaman${R.fn?` · Fungsi Ti ${nmf(R.fn.find(x=>x.f==='Ti').g)}`:''}`);
  if(hi('d-yakin'))add('yakin','Cara meyakinkan diri','Yakin lewat hati','Keputusan pribadimu bertumpu pada rasa benar di dalam diri, walau sulit dijelaskan ke orang lain. Ini ciri khas Fi.',`Pendalaman${R.fn?` · Fungsi Fi ${nmf(R.fn.find(x=>x.f==='Fi').g)}`:''}`);
  if(hi('d-pantas')&&b5f('A','Mudah tersentuh')>=3.5)add('peduli','Kepedulian','Peduli yang selektif','Penderitaan orang yang tidak bersalah menyentuhmu, tapi kepada orang yang kamu anggap jahat kamu tidak peduli. Kepedulianmu disaring oleh pantas-tidaknya orang itu dikasihani.',`Pendalaman · Big Five Mudah tersentuh ${nmf(b5f('A','Mudah tersentuh'))}`);
  // J/P dan kebiasaan
  if(lo('d-telat'))add('telat','J/P · deadline','Mulai telat karena belum ada dorongan','Kamu bukan tipe yang sengaja menunggu tekanan. Kamu mulai telat karena dorongannya belum muncul'+(b5f('N','Mudah kewalahan')>=4?', padahal tekanan membuatmu stres. Memulai dengan langkah sangat kecil bisa membantu memancing dorongan itu.':'.'),`Pendalaman · Facet Pressure-Prompted ${sgn(fac('JP',2))}`);
  if(hi('d-telat'))add('telat','J/P · deadline','Tekanan sebagai bahan bakar','Kamu memang paling fokus di bawah tekanan, jadi mengerjakan mendekati deadline adalah strategimu, bukan sekadar menunda.',`Pendalaman · Facet Pressure-Prompted ${sgn(fac('JP',2))}`);
  if(hi('d-rutin'))add('rutin',`J/P · ${pct('JP')}`,'Suka yang familiar, bukan suka jadwal','Rutinitas terasa nyaman bagimu karena familiar dan tidak menuntut adaptasi, bukan karena kamu suka merencanakan.',`Pendalaman · ${pct('JP')}${R.fn?` · Fungsi Si ${nmf(R.fn.find(x=>x.f==='Si').g)}`:''}`);
  if(lo('d-rutin'))add('rutin',`J/P · ${pct('JP')}`,'Teratur karena rencana','Rutinitasmu nyaman karena memang terencana. Keteraturan adalah pilihan sadar, bukan sekadar kebiasaan.',`Pendalaman · ${pct('JP')}`);
  if(lo('d-batal')&&ax('JP')<=45)add('batal',`J/P · ${pct('JP')}`,'Butuh kepastian','Rencana yang batal mendadak cukup mengganggumu. Kabar perubahan lebih awal sangat membantu.',`Pendalaman · ${pct('JP')}`);
  if(hi('d-batal')&&ax('JP')<=45)add('batal',`J/P · ${pct('JP')}`,'Terencana tapi luwes','Kamu suka rencana, tapi saat rencana batal kamu cepat beradaptasi. Rencana bagimu adalah alat, bukan aturan mati.',`Pendalaman · ${pct('JP')}`);
  if(hi('d-berarti'))add('berarti','Motivasi','Saringan: berarti atau tidak bagimu','Semangatmu sangat ditentukan oleh apakah sesuatu berarti atau menguntungkan bagimu. Kewajiban saja jarang cukup untuk menggerakkanmu.'+(R.fn&&fnRank('Fi')<=1?' Ini sejalan dengan Fi-mu yang kuat.':''),`Pendalaman${R.fn?` · Fungsi Fi ${nmf(R.fn.find(x=>x.f==='Fi').g)}`:''}`);
  {const w=[];if(hi('d-ingin-rapi')&&b5f('C','Keteraturan')<=2.5)w.push(['lebih teratur',`Keteraturan ${nmf(b5f('C','Keteraturan'))}`]);if(hi('d-ingin-tuntas')&&b5f('C','Disiplin diri')<=2.5)w.push(['menuntaskan lebih banyak hal penting',`Disiplin diri ${nmf(b5f('C','Disiplin diri'))}`]);
    if(w.length)add('jarak','Keinginan vs kebiasaan','Jarak antara keinginan dan kenyataan',`Kamu ingin ${w.map(x=>x[0]).join(' dan ')}, tapi kebiasaanmu saat ini belum ke sana. Jarak ini wajar, dan bisa jadi sumber rasa kurang puas pada diri sendiri.`+(ax('AT')>=65?' Ini juga bisa menjelaskan kenapa kamu cukup keras pada dirimu sendiri.':''),`Pendalaman · Big Five ${w.map(x=>x[1]).join(' · ')}`)}
  // Emosi
  if(hi('d-marah')&&b5f('N','Mudah marah')>=3.5)add('marah','Emosi','Marah yang reaktif dan lama reda','Rasa marahmu cepat naik dan lama turun. Setelah bertengkar, kamu cenderung menjauh.'+(b5f('A','Mengalah')<=2?' Kamu juga tidak mudah mengalah saat konflik.':''),`Pendalaman · Mudah marah ${nmf(b5f('N','Mudah marah'))}`);
  if(lo('d-marah')&&b5f('N','Mudah marah')>=3.5)add('marah','Emosi','Cepat panas, cepat dingin','Rasa marahmu cepat naik, tapi juga cepat reda. Setelah bertengkar, kamu bisa kembali biasa.',`Pendalaman · Mudah marah ${nmf(b5f('N','Mudah marah'))}`);
  if(mid('d-cemas'))add('cemas','Kecemasan','Cemas ke dua arah','Kekhawatiranmu tertuju ke dua arah sekaligus: penilaian orang tentang dirimu dan apa yang akan terjadi ke depan. Wajar kalau pikiranmu sering terasa penuh.',`Pendalaman · Cemas ${nmf(b5f('N','Cemas'))}`);
  if(lo('d-cemas'))add('cemas','Kecemasan','Cemas soal penilaian orang','Kekhawatiranmu paling sering tertuju pada bagaimana orang lain menilaimu.',`Pendalaman · Cemas ${nmf(b5f('N','Cemas'))}`);
  if(hi('d-cemas'))add('cemas','Kecemasan','Cemas soal masa depan','Kekhawatiranmu paling sering tertuju pada apa yang akan terjadi ke depan, seperti rencana dan masa depan.',`Pendalaman · Cemas ${nmf(b5f('N','Cemas'))}`);
  if(lo('d-tekanan'))add('tekanan','Saat tertekan','Menarik diri saat tertekan','Saat tertekan, kamu cenderung menarik diri dan diam. Orang di sekitarmu mungkin tidak sadar kamu sedang kesulitan.',`Pendalaman${R.b5?` · Neuroticism ${nmf(R.b5.N.dom)}`:''}`);
  if(hi('d-tekanan'))add('tekanan','Saat tertekan','Butuh tempat meluapkan','Saat tertekan, kamu butuh meluapkannya atau bercerita ke orang terdekat supaya lega.',`Pendalaman${R.b5?` · Neuroticism ${nmf(R.b5.N.dom)}`:''}`);
  if(R.b5&&(b5f('O','Ide')>=4||b5f('O','Nilai')>=4)&&b5f('O','Pengalaman baru')<=2.5)add('ide','Openness','Terbuka pada ide, hati-hati pada pengalaman','Kamu senang mengulik ide dan mempertanyakan nilai, tapi jarang mencoba makanan atau tempat baru. Keterbukaanmu ada di pikiran, bukan di kebiasaan.',`Big Five Ide ${nmf(b5f('O','Ide'))} · Nilai ${nmf(b5f('O','Nilai'))} · Pengalaman baru ${nmf(b5f('O','Pengalaman baru'))}`);
  return out;
}

// ---------- Riwayat: satu entri = jawaban per id + nama + catatan ----------
// Alur cerita hasil (web dan PDF): tiga temuan paling khas tampil besar, sisanya ringkas.
// "Khas" = paling banyak memisahkan hal yang di tes utama tercampur. Ketiganya diambil dari wilayah yang berbeda.
const FIND_AREA={introcanggung:'EI',sendiri:'EI',diam:'EI',gugup:'emosi',bocor:'emosi',marah:'emosi',cemas:'emosi',tekanan:'emosi',sn:'SN',ide:'SN',tfctx:'TF',debat:'TF',yakin:'TF',peduli:'TF',telat:'JP',rutin:'JP',batal:'JP',berarti:'motiv',jarak:'motiv'};
const FIND_RANK=['tfctx','sn','introcanggung','bocor','jarak','rutin','telat','debat','gugup','peduli','yakin','berarti','sendiri','batal','marah','cemas','tekanan','ide','diam'];
function storyFindings(F,notes){
  const rk=k=>{const i=FIND_RANK.indexOf(k);return i<0?FIND_RANK.length:i},sorted=(F||[]).slice().sort((a,b)=>rk(a.key)-rk(b.key));
  const big=[],used=new Set();
  for(const f of sorted){const a=FIND_AREA[f.key]||f.key;if(big.length<3&&!used.has(a)){big.push(f);used.add(a)}}
  for(const f of sorted)if(big.length<3&&!big.includes(f))big.push(f);
  const rest=(notes||[]).map(n=>({title:n.title,text:n.text,tag:n.tag||'Dari sesi analisis'})).concat((F||[]).filter(f=>!big.includes(f)));
  while(big.length<3&&rest.length)big.push(rest.shift());
  return {big,rest};
}
const lcFirst=t=>t?t[0].toLowerCase()+t.slice(1):'';
// Penutup: satu kekuatan untuk dipegang, satu hal untuk dijaga (keduanya urutan teratas di insights).
const closingLines=I=>({keep:I.strengths[0]?I.strengths[0].t:'',care:I.watch[0]?I.watch[0].t:''});
const histEntry=(D,date)=>{const e={t:date||new Date().toISOString(),n:D.name||'',c:cleanC(D.c)};if(D.summary)e.s=D.summary;if(D.notes&&D.notes.length)e.cn=D.notes;return e};
const histData=e=>e&&typeof e==='object'&&e.c?sanitizeImport({app:APP_ID,v:DATA_V,name:e.n,c:e.c,summary:e.s,notes:e.cn}):null;
const mainDone=c=>{const a=fromCanon(c);return MAIN.every(m=>isDone(a,m))};
// Tambah ke riwayat hanya kalau semua modul utama selesai. Kalau jawaban modul utama sama dengan entri terakhir, entri itu diperbarui.
function histAdd(list,D,date){
  const a=Array.isArray(list)?list.filter(e=>e&&e.c):[];if(!mainDone(D.c||{}))return a;
  const e=histEntry(D,date),main=x=>JSON.stringify(MAIN.flatMap(m=>m.items.map(it=>x.c[it.id]||0))),last=a[a.length-1];
  if(last&&main(last)===main(e)){a[a.length-1]={...e,t:last.t};return a}
  a.push(e);return a.slice(-30);
}

function summaryText(R,name){
  const L=[`Peta Kepribadian${name?' · '+name:''}`];
  if(R.hasType){L.push(`Tipe: ${R.type}${R.id?'-'+R.id:''} (${FAM[famOf(R.type)]})`);
    ['EI','SN','TF','JP','AT'].filter(ax=>R.ax[ax]!=null).forEach(ax=>{const p=R.ax[ax];L.push(`${p>=50?AX[ax][3]:AX[ax][2]} ${Math.round(p>=50?p:100-p)}%`)});
    L.push(`Top 3: ${R.fits.slice(0,3).map(f=>`${f.t} ${nmf(f.v)}`).join(', ')}`)}
  if(R.fn)L.push(`Fungsi: ${R.fn.map(x=>x.f).join(' > ')}`);
  if(R.b5)L.push(`Big Five: ${B5.map(d=>`${d[1]} ${nmf(R.b5[d[0]].dom)}`).join(', ')}`);
  return L.join('\n');
}
