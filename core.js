// Logika murni Peta Kepribadian: susun modul, hitung skor, susun ringkasan. Tanpa DOM, biar bisa dites.
const POS={EI:'I',SN:'N',TF:'F',JP:'P',AT:'T'};
const RIGHT={EI:'I',SN:'N',TF:'F',JP:'P'};
const TABLE=["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"];
const STACK={INFP:['Fi','Ne','Si','Te'],ISFP:['Fi','Se','Ni','Te'],INTP:['Ti','Ne','Si','Fe'],ISTP:['Ti','Se','Ni','Fe'],INFJ:['Ni','Fe','Ti','Se'],INTJ:['Ni','Te','Fi','Se'],ISFJ:['Si','Fe','Ti','Ne'],ISTJ:['Si','Te','Fi','Ne'],ENFP:['Ne','Fi','Te','Si'],ENTP:['Ne','Ti','Fe','Si'],ESFP:['Se','Fi','Te','Ni'],ESTP:['Se','Ti','Fe','Ni'],ENFJ:['Fe','Ni','Se','Ti'],ENTJ:['Te','Ni','Se','Fi'],ESFJ:['Fe','Si','Ne','Ti'],ESTJ:['Te','Si','Ne','Fi']};
const FAM={NF:'Diplomat',NT:'Analyst',SJ:'Sentinel',SP:'Explorer'};
const STRAT={IA:'Confident Individualism',EA:'People Mastery',IT:'Constant Improvement',ET:'Social Engagement'};
const FUNCS=['Fi','Fe','Ti','Te','Ni','Ne','Si','Se'];
const APP_ID='tes-kepribadian';
const DATA_V=2;

const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:NaN;
const famOf=t=>t[1]==='N'?'N'+t[2]:'S'+t[3];
const roundRobin=groups=>{const out=[],g=groups.map(x=>x.slice());while(g.some(x=>x.length))g.forEach(x=>{if(x.length)out.push(x.shift())});return out};
// Soal pilihan di posisi ganjil ditukar A/B biar jawaban nggak condong ke satu sisi.
const flipOdd=list=>list.map((it,i)=>it.k==='fc'&&i%2?{...it,a:it.b,b:it.a,fl:true}:{...it,fl:false});

function buildModules(){
  const coreG=Object.keys(AX).map(ax=>CORE.map((c,i)=>[c,i]).filter(([c])=>c[0]===ax).map(([c,i])=>({k:'fc',id:'c'+i,ax,bl:c[1],q:c[2],a:c[3],b:c[4]})));
  const facG=Object.keys(FACETS).map(ax=>FITEMS.filter(c=>c[0]===ax).map(c=>({k:'fc',id:c[5],ax,f:c[1],q:c[2],a:c[3],b:c[4]})));
  const b5P=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',id:`b${d[0]}${i}p`,d:d[0],f:i,rev:false,q:f[1]}))));
  const b5R=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',id:`b${d[0]}${i}r`,d:d[0],f:i,rev:true,q:f[2]}))));
  const fnG=['Fi','Se','Ti','Ne','Fe','Si','Te','Ni'].map(fn=>FN1.map((x,i)=>[x,i]).filter(([x])=>x[0]===fn).map(([x,i])=>({k:'lk',id:'n'+i,fn,q:x[1]})));
  return [
    {id:'inti',name:'Inti: 4 huruf + identitas',items:flipOdd(roundRobin(coreG))},
    {id:'facet',name:'Facet Step II',items:flipOdd(roundRobin(facG))},
    {id:'big5',name:'Big Five',items:b5P.concat(b5R)},
    {id:'fungsi',name:'Cognitive functions',items:flipOdd(roundRobin(fnG).concat(FN2.map((x,i)=>({k:'fc',id:'m'+i,fa:x[0],fb:x[1],q:x[2],a:x[3],b:x[4]}))))}];
}
const MODS=buildModules();
MODS.forEach(m=>{const n=m.items.length;m.sub=`${n} ${m.id==='big5'?'pernyataan':'soal'} · ±${Math.max(5,Math.round(n*9/60))} menit`});
const TOTAL=MODS.reduce((s,m)=>s+m.items.length,0);

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

// Jawaban per id soal, sudah dibalik ke orientasi asli (A = 1, B = 5). Soal yang belum dijawab tidak masuk.
function canon(ans){
  const o={};MODS.forEach(m=>m.items.forEach((it,i)=>{const v=ans[m.id]&&ans[m.id][i];if(valid(v))o[it.id]=it.k==='fc'?eff(it,v):v}));return o;
}
// Dari peta id -> nilai asli, susun ulang jawaban mentah sesuai posisi A/B yang tampil di layar.
function fromCanon(c){
  return Object.fromEntries(MODS.map(m=>[m.id,m.items.map(it=>{const v=c[it.id];return valid(v)?(it.k==='fc'?eff(it,v):v):0})]));
}
// File versi 1: modul facet punya 40 soal dengan urutan lama. Soal yang isinya sama dipindahkan, sisanya dikosongkan.
function migrateFacetV1(arr){
  const axes=Object.keys(FACETS),c={};
  axes.forEach((ax,ai)=>LEGACY_FACET_V1[ax].forEach((id,k)=>{const p=k*axes.length+ai,v=arr[p];if(id&&valid(v))c[id]=p%2?6-v:v}));
  const m=MODS[1];return m.items.map(it=>valid(c[it.id])?eff(it,c[it.id]):0);
}

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
  if(!d||typeof d!=='object'||d.app!==APP_ID||!d.ans||typeof d.ans!=='object')return null;
  const ans={},old=d.v!==DATA_V;
  MODS.forEach(m=>{const a=Array.isArray(d.ans[m.id])?d.ans[m.id]:[];ans[m.id]=old&&m.id==='facet'?migrateFacetV1(a):m.items.map((_,i)=>valid(a[i])?a[i]:0)});
  return {v:DATA_V,name:safeName(d.name),ans,summary:clean(d.summary,900),notes:cleanNotes(d.notes),migrated:old&&Array.isArray(d.ans.facet)&&d.ans.facet.some(valid)};
}
const exportData=(name,ans,extra)=>{const o={app:APP_ID,v:DATA_V,name:safeName(name),date:new Date().toISOString(),ans};
  if(extra&&extra.summary)o.summary=clean(extra.summary,900);const n=cleanNotes(extra&&extra.notes);if(n.length)o.notes=n;return o};

// Link hasil: seluruh isi file jawaban, dipadatkan ke base64url di bagian # URL (nggak pernah dikirim ke server).
function encodeShare(data){
  const o={v:DATA_V,n:data.name||'',a:Object.fromEntries(MODS.map(m=>[m.id,m.items.map((_,i)=>{const v=data.ans[m.id]&&data.ans[m.id][i];return valid(v)?v:0}).join('')]))};
  if(data.summary)o.s=data.summary;if(data.notes&&data.notes.length)o.t=data.notes.map(x=>[x.tag,x.title,x.text]);
  const bytes=new TextEncoder().encode(JSON.stringify(o));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeShare(str){
  try{
    if(typeof str!=='string'||!/^[A-Za-z0-9_-]{8,20000}$/.test(str))return null;
    const bin=atob(str.replace(/-/g,'+').replace(/_/g,'/')),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
    const o=JSON.parse(new TextDecoder().decode(bytes));if(!o||typeof o!=='object'||!o.a)return null;
    const ans=Object.fromEntries(MODS.map(m=>[m.id,String(o.a[m.id]||'').split('').map(Number)]));
    return sanitizeImport({app:APP_ID,v:o.v,name:o.n,ans,summary:o.s,notes:Array.isArray(o.t)?o.t.map(x=>Array.isArray(x)?{tag:x[0],title:x[1],text:x[2]}:null):[]});
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

function insights(R,ans){
  const S=Object.fromEntries(SECT.map(s=>[s[0],[]])),str=[],watch=[],tips=[],special=[];
  const c=canon(ans||{});
  const add=(sec,t,w,b)=>S[sec].push({t,w,b});
  const fnRank=f=>R.fn?R.fn.findIndex(x=>x.f===f):-1,fnG=f=>R.fn?R.fn.find(x=>x.f===f).g:NaN;
  const b5f=(d,name)=>R.b5?R.b5[d].fs[B5.find(x=>x[0]===d)[2].findIndex(f=>f[0]===name)]:NaN;
  const fac=(ax,f)=>R.fac?R.fac[ax][f]:NaN;
  const facB=(ax,f)=>`Facet ${FACETS[ax][f][fac(ax,f)>=0?1:0]} ${sgn(fac(ax,f))}`;
  const b5B=(d,name)=>`Big Five ${name} ${nmf(b5f(d,name))}`;
  // pola gabungan
  const covered=new Set();
  const sp=(sec,t,b,kind,cov)=>{add(sec,t,3,b);special.push({t,b,sec});if(kind==='watch')watch.push({t:t.split('. ')[0].replace(/\.$/,''),w:1.2,b});(cov||[]).forEach(k=>covered.add(k))};
  const pos=['ei-x1','ei-x2','ei-x4'].map(k=>c[k]).filter(valid),neg=[['ei-x5','kesal'],['ei-x3','gugup']].filter(([k])=>valid(c[k])&&c[k]<=2).map(x=>x[1]);
  if(pos.length===3&&avg(pos)>=4&&neg.length)sp('emosi',`Emosi yang intens seperti ${neg.join(' dan ')} lebih mudah terlihat dari luar, sementara senang, sedih, dan antusiasmu cenderung kamu simpan sendiri.`,`Soal Expressive per jenis emosi`,null,['EI1']);
  if(R.hasType&&R.ax.EI>=75&&b5f('N','Canggung')>=4)sp('sosial','Selain butuh waktu sendiri untuk mengisi energi, situasi sosial juga bisa terasa menegangkan bagimu. Keduanya berbeda: yang pertama soal energi, yang kedua soal rasa cemas.',`Introvert ${Math.round(R.ax.EI)}% · ${b5B('N','Canggung')}`);
  if(R.hasType&&R.ax.JP>=60&&R.fn&&fnRank('Si')<=1)sp('kerja','Kamu menyukai hal yang familiar, tapi bukan karena suka jadwal. Rutinitasmu terbentuk dari kenyamanan, bukan dari rencana.',`Prospecting ${Math.round(R.ax.JP)}% · Fungsi Si ${nmf(fnG('Si'))}`);
  if(R.fac&&fac('JP',2)>=1&&R.b5&&(b5f('N','Mudah kewalahan')>=4||(R.ax.AT||0)>=65))sp('kerja','Kamu sering mengerjakan tugas mendekati deadline, padahal tekanan membuatmu stres. Mencicil sedikit di awal bisa mengurangi beban itu.',`${facB('JP',2)} · ${b5B('N','Mudah kewalahan')}`,'watch',['JP2']);
  if(R.fn&&fnRank('Fi')<=1&&fnRank('Fe')>=5)sp('putus','Kamu berpegang pada nilai pribadi, bukan pada apa yang dianggap pantas oleh kelompok. Kamu tidak merasa wajib menjaga suasana kalau itu bertentangan dengan prinsipmu.',`Fungsi Fi ${nmf(fnG('Fi'))} · Fe ${nmf(fnG('Fe'))}`);
  if(R.src&&R.src.TF&&R.src.TF.inti!=null&&R.src.TF.facet!=null&&Math.abs(R.src.TF.inti-R.src.TF.facet)>=20){const b=`T/F modul Inti ${Math.round(R.src.TF.inti)}% F · Facet ${Math.round(R.src.TF.facet)}% F`;
    sp('putus',R.src.TF.inti>R.src.TF.facet?'Cara memutuskanmu bergantung pada siapa orangnya. Untuk orang dekat dan hidupmu sendiri kamu memakai perasaan, tapi kepada kenalan dan urusan tugas kamu lebih logis dan tegas.':'Untuk keputusan besar kamu cenderung logis, tapi saat berhadapan langsung dengan orang kamu lebih lunak.',b)}
  if(R.fac&&fac('TF',2)<=-1&&R.b5&&b5f('A','Mengalah')<=2.5)sp('putus','Kamu tidak mudah mengalah dalam perdebatan. Kamu lebih memilih meluruskan yang keliru walaupun suasananya jadi tegang.',`${facB('TF',2)} · ${b5B('A','Mengalah')}`,null,['TF2']);
  if(R.hasType&&R.fn){const st=STACK[R.type],ni=fnG('Ni'),ne=fnG('Ne');
    if(st.slice(0,2).includes('Ne')&&ni-ne>=.8)sp('pikir',`Intuisimu lebih berupa firasat yang mengerucut ke satu kesimpulan (Ni) daripada lompatan ke banyak kemungkinan (Ne). Ini tidak umum untuk tipe ${R.type}.`,`Fungsi Ni ${nmf(ni)} · Ne ${nmf(ne)}`);
    else if(st.slice(0,2).includes('Ni')&&ne-ni>=.8)sp('pikir',`Intuisimu lebih berupa lompatan ke banyak kemungkinan (Ne) daripada firasat yang mengerucut (Ni). Ini tidak umum untuk tipe ${R.type}.`,`Fungsi Ne ${nmf(ne)} · Ni ${nmf(ni)}`)}
  if(R.b5&&b5f('O','Ide')>=4&&b5f('C','Disiplin diri')<=2)sp('kerja','Minat dan idemu banyak, tapi menyelesaikannya butuh dorongan. Target kecil yang jelas biasanya lebih membantu daripada rencana besar.',`${b5B('O','Ide')} · ${b5B('C','Disiplin diri')}`,'watch');
  if(R.b5&&R.b5.N.dom>=3.8&&b5f('E','Emosi positif')<=2.5)sp('emosi','Suasana hatimu lebih mudah turun daripada naik. Hal kecil yang menyenangkan perlu sengaja kamu cari.',`Neuroticism ${nmf(R.b5.N.dom)} · ${b5B('E','Emosi positif')}`,'watch');
  // facet
  if(R.fac)Object.keys(FACETS).forEach(ax=>R.fac[ax].forEach((v,f)=>{
    if(Math.abs(v)<1)return;const pole=v>0?1:0;if(!covered.has(ax+f))add(AXSEC[ax],FAC_TXT[ax][f][pole],Math.abs(v)/2,facB(ax,f));
    const s=FAC_STR[ax][f][pole];if(s)str.push({t:s,w:Math.abs(v)/2,b:facB(ax,f),cat:ax});}));
  // Big Five facet
  if(R.b5)B5.forEach(d=>d[2].forEach((f,i)=>{const v=R.b5[d[0]].fs[i];if(v>2&&v<4)return;const hi=v>=4,sec=(d[0]==='O'&&i===2)?'emosi':B5SEC[d[0]];
    add(sec,B5_TXT[d[0]][i][hi?0:1],Math.abs(v-3)/2*.95,b5B(d[0],f[0]));
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

function summaryText(R,name){
  const L=[`Peta Kepribadian${name?' · '+name:''}`];
  if(R.hasType){L.push(`Tipe: ${R.type}${R.id?'-'+R.id:''} (${FAM[famOf(R.type)]})`);
    ['EI','SN','TF','JP','AT'].filter(ax=>R.ax[ax]!=null).forEach(ax=>{const p=R.ax[ax];L.push(`${p>=50?AX[ax][3]:AX[ax][2]} ${Math.round(p>=50?p:100-p)}%`)});
    L.push(`Top 3: ${R.fits.slice(0,3).map(f=>`${f.t} ${nmf(f.v)}`).join(', ')}`)}
  if(R.fn)L.push(`Fungsi: ${R.fn.map(x=>x.f).join(' > ')}`);
  if(R.b5)L.push(`Big Five: ${B5.map(d=>`${d[1]} ${nmf(R.b5[d[0]].dom)}`).join(', ')}`);
  return L.join('\n');
}
