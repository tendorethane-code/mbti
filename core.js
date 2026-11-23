// Logika murni Peta Kepribadian: susun modul, hitung skor. Tanpa DOM, biar bisa dites.
const POS={EI:'I',SN:'N',TF:'F',JP:'P',AT:'T'};
const RIGHT={EI:'I',SN:'N',TF:'F',JP:'P'};
const TABLE=["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"];
const STACK={INFP:['Fi','Ne','Si','Te'],ISFP:['Fi','Se','Ni','Te'],INTP:['Ti','Ne','Si','Fe'],ISTP:['Ti','Se','Ni','Fe'],INFJ:['Ni','Fe','Ti','Se'],INTJ:['Ni','Te','Fi','Se'],ISFJ:['Si','Fe','Ti','Ne'],ISTJ:['Si','Te','Fi','Ne'],ENFP:['Ne','Fi','Te','Si'],ENTP:['Ne','Ti','Fe','Si'],ESFP:['Se','Fi','Te','Ni'],ESTP:['Se','Ti','Fe','Ni'],ENFJ:['Fe','Ni','Se','Ti'],ENTJ:['Te','Ni','Se','Fi'],ESFJ:['Fe','Si','Ne','Ti'],ESTJ:['Te','Si','Ne','Fi']};
const FAM={NF:'Diplomat',NT:'Analyst',SJ:'Sentinel',SP:'Explorer'};
const STRAT={IA:'Confident Individualism',EA:'People Mastery',IT:'Constant Improvement',ET:'Social Engagement'};
const FUNCS=['Fi','Fe','Ti','Te','Ni','Ne','Si','Se'];
const APP_ID='tes-kepribadian';

const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:NaN;
const famOf=t=>t[1]==='N'?'N'+t[2]:'S'+t[3];
const roundRobin=groups=>{const out=[],g=groups.map(x=>x.slice());while(g.some(x=>x.length))g.forEach(x=>{if(x.length)out.push(x.shift())});return out};
// Soal pilihan di posisi ganjil ditukar A/B biar jawaban nggak condong ke satu sisi.
const flipOdd=list=>list.map((it,i)=>it.k==='fc'&&i%2?{...it,a:it.b,b:it.a,fl:true}:{...it,fl:false});

function buildModules(){
  const coreG=Object.keys(AX).map(ax=>CORE.filter(c=>c[0]===ax).map(c=>({k:'fc',ax,bl:c[1],q:c[2],a:c[3],b:c[4]})));
  const facG=Object.keys(FACETS).map(ax=>FITEMS.filter(c=>c[0]===ax).map(c=>({k:'fc',ax,f:c[1],q:c[2],a:c[3],b:c[4]})));
  const b5P=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',d:d[0],f:i,rev:false,q:f[1]}))));
  const b5R=roundRobin(B5.map(d=>d[2].map((f,i)=>({k:'lk',d:d[0],f:i,rev:true,q:f[2]}))));
  const fnG=['Fi','Se','Ti','Ne','Fe','Si','Te','Ni'].map(fn=>FN1.filter(x=>x[0]===fn).map(x=>({k:'lk',fn,q:x[1]})));
  return [
    {id:'inti',name:'Inti: 4 huruf + identitas',items:flipOdd(roundRobin(coreG))},
    {id:'facet',name:'Facet Step II',items:flipOdd(roundRobin(facG))},
    {id:'big5',name:'Big Five',items:b5P.concat(b5R)},
    {id:'fungsi',name:'Cognitive functions',items:flipOdd(roundRobin(fnG).concat(FN2.map(x=>({k:'fc',fa:x[0],fb:x[1],q:x[2],a:x[3],b:x[4]}))))}];
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

const safeName=s=>String(s||'').replace(/[<>&"'`]/g,'').trim().slice(0,30);
const fileSlug=s=>safeName(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const emptyAns=()=>Object.fromEntries(MODS.map(m=>[m.id,[]]));
function sanitizeImport(d){
  if(!d||typeof d!=='object'||d.app!==APP_ID||!d.ans||typeof d.ans!=='object')return null;
  const ans={};
  MODS.forEach(m=>{const a=Array.isArray(d.ans[m.id])?d.ans[m.id]:[];ans[m.id]=m.items.map((_,i)=>valid(a[i])?a[i]:0)});
  return {name:safeName(d.name),ans};
}
const exportData=(name,ans)=>({app:APP_ID,v:1,name:safeName(name),date:new Date().toISOString(),ans});
const nmf=(n,d=1)=>n.toFixed(d).replace('.',',');
function summaryText(R,name){
  const L=[`Peta Kepribadian${name?' · '+name:''}`];
  if(R.hasType){L.push(`Tipe: ${R.type}${R.id?'-'+R.id:''} (${FAM[famOf(R.type)]})`);
    ['EI','SN','TF','JP','AT'].filter(ax=>R.ax[ax]!=null).forEach(ax=>{const p=R.ax[ax];L.push(`${p>=50?AX[ax][3]:AX[ax][2]} ${Math.round(p>=50?p:100-p)}%`)});
    L.push(`Top 3: ${R.fits.slice(0,3).map(f=>`${f.t} ${nmf(f.v)}`).join(', ')}`)}
  if(R.fn)L.push(`Fungsi: ${R.fn.map(x=>x.f).join(' > ')}`);
  if(R.b5)L.push(`Big Five: ${B5.map(d=>`${d[1]} ${nmf(R.b5[d[0]].dom)}`).join(', ')}`);
  return L.join('\n');
}
