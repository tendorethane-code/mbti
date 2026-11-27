// Arsip draf musik "momen terungkap" (Web Audio, disintesis di browser; tanpa file musik).
// Disalin utuh dari index.html sebelum dibersihkan. Pemilik memilih draf 6 "Ballad D minor" (gaya `manis`); yang lain hanya arsip.
// Draf: film (trailer), ceria (playful), lembut (piano), orkestra (seksi gesek F# mayor, referensi 1),
//       megah (orkestra D minor, referensi 2), manis (ballad D minor, DIPAKAI), ballad (ballad D mayor "naik terus").
// Bergantung pada fungsi efek suara di index.html (ac, out, rev, noise, filt, amp, osc ...). Untuk mencoba lagi:
// tempel blok ini kembali di dalam modul `sfx` index.html, sebelum `const riser`.
  // --- musik latar: sekuenser bertempo, tiap gaya punya tempo, nada dasar, akor, melodi, dan instrumen sendiri ---
  // Tahap: intro (peta muncul) → drive (penyaringan) → peak (satu per satu) → break (tinggal 3) → roll (tinggal 2) → hening → anthem (karakter keluar).
  const hz=m=>440*Math.pow(2,(m-69)/12);
  const mus={ph:null,step:0,next:0,tm:null,ph0:0,bus:null,dl:null,sc:null};
  const menv=(t,a,v,dur,to,dly,rv)=>{const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dur);g.connect(to||mus.bus);
    if(dly){const s=ac.createGain();s.gain.value=dly;g.connect(s);s.connect(mus.dl)}if(rv){const s=ac.createGain();s.gain.value=rv;g.connect(s);s.connect(rev)}return g};
  const mosc=(type,f,t,dur,to,det)=>{const o=ac.createOscillator();o.type=type;o.frequency.value=f;if(det)o.detune.value=det;o.connect(to);o.start(t);o.stop(t+dur+.05);return o};
  const mlp=(f,q,to,type='lowpass')=>{const b=ac.createBiquadFilter();b.type=type;b.frequency.value=f;if(q)b.Q.value=q;b.connect(to);return b};
  const vibr=(t,dur,rate,depth,o)=>{const v=ac.createOscillator(),g=ac.createGain();v.frequency.value=rate;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(depth,t+Math.min(.4,dur*.5));v.connect(g);g.connect(o.detune);v.start(t);v.stop(t+dur+.1)};
  // ---- perkusi ----
  const kick=(t,v=.9)=>{const g=menv(t,.002,v,.3);const o=ac.createOscillator();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);o.connect(g);o.start(t);o.stop(t+.35)};
  const taiko=(t,v=.8,f=95)=>{const g=menv(t,.002,v,.9,null,0,.5);const o=ac.createOscillator();o.frequency.setValueAtTime(f*1.9,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.25);o.connect(g);o.start(t);o.stop(t+1);noise(t,.14,mlp(700,0,menv(t,.001,v*.55,.14)))};
  const snare=(t,v=.4)=>{noise(t,.16,mlp(1900,.8,menv(t,.001,v,.15),'bandpass'));mosc('triangle',190,t,.1,menv(t,.001,v*.45,.08))};
  const clap=(t,v=.35)=>{[0,.011,.023].forEach((d,i)=>noise(t+d,.09,mlp(1300,1.2,menv(t+d,.001,v*(i==2?1:.6),i==2?.12:.02,null,0,.25),'bandpass')))};
  const shaker=(t,v=.07)=>noise(t,.07,mlp(7000,0,menv(t,.012,v,.05),'highpass'));
  const tamb=(t,v=.1)=>{noise(t,.12,mlp(9000,0,menv(t,.002,v,.1),'highpass'));mosc('sine',4800,t,.06,menv(t,.001,v*.3,.05))};
  const tickk=(t,v=.06)=>mosc('square',2400,t,.02,mlp(5000,0,menv(t,.001,v,.015)));
  const timpH=(t,f,v)=>{const g=menv(t,.003,v,.5,null,0,.4);const o=ac.createOscillator();o.frequency.setValueAtTime(f*1.3,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);o.connect(g);o.start(t);o.stop(t+.6)};
  // ---- nada: film ----
  const braam=(t,r,dur=2.6,v=.12)=>{const g=menv(t,.05,v,dur,null,0,.45),lp=mlp(220,2,g);lp.frequency.setValueAtTime(220,t);lp.frequency.exponentialRampToValueAtTime(1500,t+.25);lp.frequency.exponentialRampToValueAtTime(260,t+dur*.8);
    [r-12,r,r+7].forEach((m,i)=>{mosc('sawtooth',hz(m),t,dur,lp,-10);mosc('sawtooth',hz(m),t,dur,lp,10)});mosc('sine',hz(r-12),t,dur,menv(t,.03,v*1.4,dur))};
  const choir=(t,notes,dur,v=.05)=>{const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.9,dur*.4));g.gain.setValueAtTime(v,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(mus.bus);const s=ac.createGain();s.gain.value=.7;g.connect(s);s.connect(rev);
    const f1=mlp(720,6,g,'bandpass'),f2=mlp(1150,7,g,'bandpass');notes.forEach(m=>[-7,7].forEach(d=>{const o=mosc('sawtooth',hz(m),t,dur,f1,d);o.connect(f2);vibr(t,dur,5,12,o)}))};
  const horn=(t,m,dur,v=.12)=>{const g=menv(t,.07,v,dur+.25,null,.15,.5),lp=mlp(1500,1,g);[['sawtooth',-5],['sawtooth',5],['triangle',0]].forEach(([ty,d])=>{const o=mosc(ty,hz(m),t,dur+.3,lp,d);vibr(t+.15,dur,5,9,o)})};
  const spicc=(t,m,v=.07)=>{const lp=mlp(1700,1,menv(t,.004,v,.12));mosc('sawtooth',hz(m),t,.13,lp,-7);mosc('sawtooth',hz(m),t,.13,lp,7)};
  const brassStab=(t,notes,dur,v=.05)=>{const lp=mlp(1400,1,menv(t,.03,v,dur,null,0,.4));lp.frequency.setValueAtTime(600,t);lp.frequency.exponentialRampToValueAtTime(1800,t+.15);lp.frequency.exponentialRampToValueAtTime(700,t+dur);notes.forEach(m=>{mosc('sawtooth',hz(m),t,dur,lp,-8);mosc('sawtooth',hz(m),t,dur,lp,8)})};
  const lowStr=(t,m,dur,v=.08)=>{const lp=mlp(500,1,menv(t,.15,v,dur,null,0,.3));mosc('sawtooth',hz(m),t,dur,lp,-6);mosc('sawtooth',hz(m),t,dur,lp,6)};
  // ---- nada: ceria ----
  const marimba=(t,m,v=.13)=>{mosc('sine',hz(m),t,.45,menv(t,.002,v,.4,null,.2,.2));mosc('sine',hz(m)*4,t,.08,menv(t,.001,v*.25,.06))};
  const pizz=(t,m,v=.1)=>{const lp=mlp(1800,1,menv(t,.003,v,.2,null,0,.25));lp.frequency.setValueAtTime(2600,t);lp.frequency.exponentialRampToValueAtTime(500,t+.18);mosc('triangle',hz(m),t,.22,lp);mosc('sawtooth',hz(m),t,.22,mlp(900,0,menv(t,.003,v*.25,.15)))};
  const glock=(t,m,v=.07)=>{mosc('sine',hz(m),t,1,menv(t,.001,v,.9,null,.3,.35));mosc('sine',hz(m)*2.76,t,.3,menv(t,.001,v*.35,.25))};
  const bounce=(t,m,dur,v=.22)=>{const lp=mlp(900,1,menv(t,.004,v,dur));mosc('triangle',hz(m),t,dur,lp);mosc('sine',hz(m-12),t,dur,menv(t,.004,v*.6,dur))};
  const strum=(t,notes,v=.06)=>notes.forEach((m,i)=>{const tt=t+i*.018;const lp=mlp(2600,1,menv(tt,.002,v,.35,null,0,.2));lp.frequency.setValueAtTime(3500,tt);lp.frequency.exponentialRampToValueAtTime(900,tt+.3);mosc('triangle',hz(m),tt,.4,lp);mosc('square',hz(m),tt,.15,mlp(1500,0,menv(tt,.002,v*.25,.1)))});
  const whistle=(t,m,dur,v=.09)=>{const g=menv(t,.03,v,dur+.1,null,.4,.4);const o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(hz(m-1),t);o.frequency.exponentialRampToValueAtTime(hz(m),t+.05);o.connect(g);o.start(t);o.stop(t+dur+.2);vibr(t+.1,dur,6,14,o);mosc('sine',hz(m)*2,t,dur,menv(t,.03,v*.12,dur))};
  // ---- nada: lembut ----
  const piano=(t,m,dur=1.6,v=.11)=>{const d=Math.min(3.2,Math.max(.8,dur));const lp=mlp(2800,0,menv(t,.004,v,d,null,0,.55));lp.frequency.setValueAtTime(3600,t);lp.frequency.exponentialRampToValueAtTime(1100,t+d);
    mosc('triangle',hz(m),t,d,lp);mosc('sine',hz(m)*2,t,d*.6,menv(t,.004,v*.22,d*.5,null,0,.4));mosc('sine',hz(m)*3.01,t,d*.3,menv(t,.003,v*.08,d*.25));noise(t,.02,mlp(2000,0,menv(t,.001,v*.15,.02)))};
  const strPad=(t,notes,dur,v=.035)=>{const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+dur*.45);g.gain.setValueAtTime(v,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.6);g.connect(mus.bus);const s=ac.createGain();s.gain.value=.8;g.connect(s);s.connect(rev);
    const lp=mlp(1100,.5,g);notes.forEach(m=>[-6,6].forEach(d=>{const o=mosc('sawtooth',hz(m),t,dur+.7,lp,d);vibr(t,dur,4.5,6,o)}))};
  const mbox=(t,m,v=.05)=>{mosc('sine',hz(m),t,1.4,menv(t,.001,v,1.3,null,.3,.5));mosc('sine',hz(m)*4.2,t,.4,menv(t,.001,v*.3,.3))};
  const cello=(t,m,dur,v=.07)=>{const g=menv(t,.25,v,dur,null,0,.35),lp=mlp(650,1,g);[-5,5].forEach(d=>{const o=mosc('sawtooth',hz(m),t,dur+.1,lp,d);vibr(t+.2,dur,5,10,o)})};
  // ---- orkestra gesek: biola I/II, viola, cello, kontrabas (gaya dipelajari dari referensi pemilik: F# mayor, akor diatonik maj7/sus4, gerak seperdelapan mengalir, ending menipis ke biola) ----
  const SEC={vn:{n:3,cut:2300,pk:1900,vib:13},va:{n:3,cut:1700,pk:1200,vib:11},vc:{n:3,cut:1200,pk:700,vib:10},cb:{n:2,cut:650,pk:180,vib:7}};
  const bow=(t,m,dur,v,sec,o={})=>{const S=SEC[sec],att=o.att||.32,rel=o.rel||.7,g=ac.createGain();
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v*(o.from||1),t+att);if(o.to)g.gain.linearRampToValueAtTime(v*o.to,t+dur);else g.gain.setValueAtTime(v,t+Math.max(att,dur));g.gain.exponentialRampToValueAtTime(.0001,t+dur+rel);
    g.connect(mus.bus);const s=ac.createGain();s.gain.value=o.wet||.7;g.connect(s);s.connect(rev);let into=g;
    if(o.trem){const tg=ac.createGain();tg.gain.value=.6;tg.connect(g);const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.trem;lg.gain.value=.4;l.connect(lg);lg.connect(tg.gain);l.start(t);l.stop(t+dur+rel+.1);into=tg}
    const pk=ac.createBiquadFilter();pk.type='peaking';pk.frequency.value=S.pk;pk.Q.value=1.2;pk.gain.value=4;pk.connect(into);const lp=mlp(S.cut,.6,pk);
    for(let k=0;k<S.n;k++){const o2=mosc('sawtooth',hz(m),t,dur+rel+.05,lp,(k-(S.n-1)/2)*9+(Math.random()-.5)*4);vibr(t+Math.min(.35,dur*.4),dur+rel,5+Math.random()*.7,o.novib?0:S.vib,o2)}
    if(sec==='cb'||sec==='vc')mosc('sine',hz(m),t,dur+rel,into,0);
    noise(t,Math.min(.25,att),mlp(S.pk*1.5,2,menv(t,.02,v*.12,Math.min(.25,att)),'bandpass'))};
  const pizzS=(t,m,v=.12)=>{const lp=mlp(1200,1,menv(t,.003,v,.45,null,0,.5));lp.frequency.setValueAtTime(1800,t);lp.frequency.exponentialRampToValueAtTime(300,t+.35);mosc('triangle',hz(m),t,.5,lp);mosc('sine',hz(m),t,.5,menv(t,.003,v*.6,.4))};
  const OK={I:{b:42,vc:54,va:[61,65],v2:[70,73]},ii:{b:44,vc:56,va:[63,66],v2:[71,75]},iii:{b:46,vc:58,va:[65,68],v2:[73,77]},IV:{b:47,vc:59,va:[63,66],v2:[70,75]},
    V:{b:49,vc:61,va:[65,68],v2:[73,77]},Vs:{b:49,vc:61,va:[66,68],v2:[73,78]},vi:{b:51,vc:63,va:[66,70],v2:[73,78]}};
  // ---- orkestra D minor (referensi kedua pemilik): seksi lebih tebal, posisi stereo seperti tempat duduk orkestra, harpa, timpani ----
  const PAN={vn:-.45,va:.12,vc:.35,cb:.5};
  const bowR=(t,m,dur,v,sec,o={})=>{const S=SEC[sec],n=S.n+(sec==='cb'?1:2),att=o.att||.4,rel=o.rel||.8,g=ac.createGain();
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v*(o.from||1),t+att);if(o.to)g.gain.linearRampToValueAtTime(v*o.to,t+dur);else g.gain.setValueAtTime(v,t+Math.max(att,dur));g.gain.exponentialRampToValueAtTime(.0001,t+dur+rel);
    let dst=mus.bus;if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=o.pan!=null?o.pan:PAN[sec];p.connect(mus.bus);dst=p}
    g.connect(dst);const s=ac.createGain();s.gain.value=o.wet||.75;g.connect(s);s.connect(rev);let into=g;
    if(o.trem){const tg=ac.createGain();tg.gain.value=.6;tg.connect(g);const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.trem;lg.gain.value=.4;l.connect(lg);lg.connect(tg.gain);l.start(t);l.stop(t+dur+rel+.1);into=tg}
    const pk=ac.createBiquadFilter();pk.type='peaking';pk.frequency.value=S.pk;pk.Q.value=1.1;pk.gain.value=4;pk.connect(into);const lp=mlp(S.cut,.6,pk);
    const vb=ac.createOscillator(),vg=ac.createGain();vb.frequency.value=5.2+Math.random()*.5;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(o.novib?0:S.vib,t+Math.min(.6,dur*.5));vb.connect(vg);vb.start(t);vb.stop(t+dur+rel+.1);
    for(let k=0;k<n;k++){const os=mosc('sawtooth',hz(m),t,dur+rel+.05,lp,(k-(n-1)/2)*7+(Math.random()-.5)*5);vg.connect(os.detune)}
    if(sec==='cb'||sec==='vc')mosc('sine',hz(m),t,dur+rel,into,0);
    noise(t,Math.min(.25,att),mlp(S.pk*1.5,2,menv(t,.02,v*.1,Math.min(.25,att)),'bandpass'))};
  const harp=(t,m,v=.05)=>{let dst=mus.bus;if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=-.2;p.connect(mus.bus);dst=p}
    const g=menv(t,.002,v,2,dst,.15,.7),lp=mlp(3200,0,g);lp.frequency.setValueAtTime(4200,t);lp.frequency.exponentialRampToValueAtTime(1200,t+1.2);mosc('triangle',hz(m),t,2.1,lp);mosc('sine',hz(m)*2,t,.8,menv(t,.002,v*.3,.7,dst))};
  const DM={i:{b:38,vc:[50,57],va:[62,65],v2:[69,74]},VI:{b:34,vc:[46,53],va:[62,65],v2:[70,74]},III:{b:41,vc:[53,60],va:[60,65],v2:[69,72]},
    VIIs:{b:36,vc:[48,55],va:[60,65],v2:[67,72]},VII:{b:36,vc:[48,55],va:[60,64],v2:[67,72]},iv:{b:43,vc:[55,62],va:[62,67],v2:[70,74]},
    Vs:{b:33,vc:[45,52],va:[62,64],v2:[69,74]},V:{b:33,vc:[45,52],va:[61,64],v2:[69,73]},i9:{b:38,vc:[50,57],va:[62,64,65],v2:[69,74,76]}};
  // ---- ballad orkestra "manis": D minor saat penyaringan, mekar ke D mayor saat terungkap; biola dalam terts, piano, harpa, horn lembut, paduan suara samar ----
  const hornPad=(t,notes,dur,v=.03)=>{let dst=mus.bus;if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=.2;p.connect(mus.bus);dst=p}
    const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.35);g.gain.setValueAtTime(v,t+dur);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.9);g.connect(dst);const s=ac.createGain();s.gain.value=.7;g.connect(s);s.connect(rev);
    const lp=mlp(850,.7,g);notes.forEach(m=>{mosc('sawtooth',hz(m),t,dur+1,lp,-4);mosc('triangle',hz(m),t,dur+1,lp,4)})};
  const MN={i9:{b:38,vc:[50,57],va:[62,64,65],v2:[69,74],mel:[76,74],th:[72,70]},VI7:{b:34,vc:[46,53],va:[62,65,69],v2:[69,74],mel:[81,79],th:[77,76]},
    III9:{b:41,vc:[53,60],va:[60,65,67],v2:[69,72],mel:[79,77],th:[76,74]},VIIs:{b:36,vc:[48,55],va:[60,65],v2:[67,72],mel:[77,76],th:[74,72]},VII:{b:36,vc:[48,55],va:[60,64],v2:[67,72]},
    iv7:{b:43,vc:[55,62],va:[62,65],v2:[70,74],mel:[77,74],th:[74,70]},VI:{b:34,vc:[46,53],va:[62,65],v2:[70,74],mel:[77,74],th:[74,70]},
    Vs:{b:33,vc:[45,52],va:[62,64],v2:[69,74],mel:[74,73],th:[70,69]},V:{b:33,vc:[45,52],va:[61,64],v2:[69,73]},
    I9:{b:38,vc:[50,57],va:[62,64,66],v2:[69,74,76]},V6:{b:37,vc:[45,52],va:[61,64],v2:[69,73]},vi7:{b:35,vc:[47,54],va:[62,66],v2:[69,74]},
    IVM7:{b:43,vc:[55,62],va:[62,66],v2:[67,71]},ii7:{b:40,vc:[52,59],va:[62,67],v2:[67,71]}};
  Object.assign(MN,{I6:{b:42,vc:[50,57],va:[62,66],v2:[69,74],mel:[78,76],th:[74,73]},IV9:{b:43,vc:[55,62],va:[62,67,69],v2:[67,71],mel:[79,78],th:[76,74]},
    ivm:{b:43,vc:[55,62],va:[62,65,69],v2:[67,70]}});
  Object.assign(MN.I9,{mel:[76,74],th:[73,71]});Object.assign(MN.V6,{mel:[76,73],th:[73,69]});Object.assign(MN.vi7,{mel:[74,73],th:[71,69]});Object.assign(MN.ii7,{mel:[79,78],th:[76,74]});MN.VDs={...MN.Vs,mel:[74,73],th:[71,69]};MN.VD=MN.V;
  const TH3={78:74,76:73,74:71,73:69,81:78,79:76,71:67,69:66};  // terts di bawah dalam D mayor
  // ---- skor ----
  const at=(H,i)=>H.filter(n=>n[0]===i);
  const SC={
    film:{bpm:90,dly:.75,bars:4,
      MIN:[[38,[62,65,69]],[34,[58,62,65]],[31,[55,58,62]],[33,[57,61,64]]],
      MAJ:[[38,[62,66,69]],[35,[59,62,66]],[31,[55,59,62]],[33,[57,61,64]]],
      HOOK:[[[0,62,6],[6,69,2],[8,69,6],[14,67,1],[15,66,1]],[[0,66,4],[4,64,2],[6,62,2],[8,71,8]],[[0,71,4],[4,69,2],[6,67,2],[8,69,6],[14,71,2]],[[0,73,4],[4,76,4],[8,78,8]]],
      intro(t,i,b){const [r,c]=this.MIN[0];if(i===0){choir(t,[c[0]-12,c[0],c[2]-12],2.8,.045);lowStr(t,r+12,2.6,.07)}if(i===8)timpH(t,hz(38),.35)},
      drive(t,i,b,k){const [r0,c0]=this.MIN[b%4],r=r0+k,c=c0.map(n=>n+k);spicc(t,[r+12,r+12,r+19,r+12][i%4],.075);if(k)spicc(t,[r+24,r+24,r+31,r+24][i%4],.05);
        if(i===0||i===8)taiko(t,i?.7:.95);if([3,6,11,14].includes(i))taiko(t,.4,140);if(k&&i>=12)taiko(t,.45,160);if(i===0){brassStab(t,c.map(n=>n-12),1.6,.045);lowStr(t,r,2.4,.06)}if(k&&i===0)braam(t,r+12,2.2,.08)},
      brk(t,i,b){if(i===0){braam(t,45,2.6,.11);choir(t,[57,61,64],2.6,.04)}if(i%4===0)tickk(t);if(i===0||i===3)taiko(t,i?.4:.6,80)},
      roll(t,i,b,e){const d=e<.7?2:1;if(i%d===0)timpH(t,hz(45),.12+Math.min(.3,e*.12));spicc(t,57+Math.floor(e*6)+((i%2)?7:0),.05+Math.min(.05,e*.02))},
      anthem(t,i,b){if(b>=4){if(i===0){braam(t,50,3.2,.1);choir(t,[62,66,69,74],3.4,.05);brassStab(t,[50,57,62,66],3,.05);horn(t,74,2.6,.12);taiko(t,1)}return}
        const [r,c]=this.MAJ[b];if(i===0){brassStab(t,c.map(n=>n-12),2.4,.05);choir(t,c,2.6,.035);lowStr(t,r,2.6,.07)}spicc(t,[r+12,r+12,r+19,r+12][i%4],.06);
        if(i===0||i===6||i===8)taiko(t,i?.6:1);if(i===12||i===14)taiko(t,.5,150);at(this.HOOK[b],i).forEach(([,m,l])=>horn(t,m,l*this.sp*.95,.12))}},
    ceria:{bpm:128,dly:.5,bars:4,
      MIN:[[36,[60,64,67]],[31,[59,62,67]],[33,[60,64,69]],[29,[60,65,69]]],
      MAJ:[[36,[60,64,67]],[31,[59,62,67]],[33,[60,64,69]],[29,[60,65,69]]],
      HOOK:[[[0,72,1],[2,76,1],[3,79,2],[6,76,1],[8,81,2],[10,79,1],[12,76,2],[14,74,2]],[[0,74,1],[2,79,1],[3,83,2],[6,79,1],[8,86,3],[12,83,2],[14,79,2]],[[0,76,1],[2,81,1],[3,84,2],[6,81,1],[8,79,2],[10,77,1],[12,76,2],[14,74,2]],[[0,77,2],[2,76,1],[4,74,2],[6,72,2],[8,74,2],[10,76,2],[12,79,4]]],
      intro(t,i,b){const [r,c]=this.MIN[b%4];if(i%2===0)marimba(t,[c[0]+12,c[1]+12,c[2]+12,c[1]+12][(i/2)%4],.09);if(i%2)shaker(t,.04)},
      drive(t,i,b,k){const [r0,c0]=this.MIN[b%4],r=r0+k,c=c0.map(n=>n+k);if(i===0||i===8)bounce(t,r,.2);if(i===6||i===14)bounce(t,r+12,.12,.16);if(i===4||i===12){c.forEach(n=>pizz(t,n,.05));clap(t,.28)}
        shaker(t,i%4===2?.07:.035);if([0,3,6,10,12].includes(i))marimba(t,c[[0,2,1,2,0][[0,3,6,10,12].indexOf(i)]]+12,.11);if(i===14)glock(t,c[2]+24,.05);if(k&&i%4===0)kick(t,.7);if(k&&[2,7,11].includes(i))whistle(t,c[[2,7,11].indexOf(i)]+12,.12,.05)},
      brk(t,i,b){if(i%2===0)pizz(t,[45,46,47,48,49,50,51,52][(i/2)%8],.12);if(i%4===0)tickk(t,.07);if(i===0)glock(t,81,.04)},
      roll(t,i,b,e){const x=i+Math.floor(e*8);marimba(t,72+[0,2,4,5,7,9,11][x%7]+12*(Math.floor(x/7)%2),.08);const d=e<.8?4:e<1.6?2:1;if(i%d===0)clap(t,.15+Math.min(.25,e*.1));shaker(t,.05)},
      anthem(t,i,b){if(b>=4){if(i===0||i===3){strum(t,[48,55,60,64,67,72],.08);bounce(t,36,.4);kick(t,.9);glock(t,84,.08)}if(i===0)whistle(t,84,1.2,.1);return}
        const [r,c]=this.MAJ[b];if(i%4===0)kick(t,.9);if(i===4||i===12)clap(t,.35);tamb(t,i%2?.05:.09);if(i%2===0)bounce(t,i%4?r+12:r,.12);if([2,6,10,14].includes(i))strum(t,c,.05);if(i%4===0)marimba(t,c[(i/4)%3]+24,.06);
        at(this.HOOK[b],i).forEach(([,m,l])=>{whistle(t,m,l*this.sp*.9,.09);glock(t,m+12,.025)})}},
    lembut:{bpm:72,dly:.75,bars:4,
      MIN:[[40,[64,67,71]],[36,[60,64,67]],[43,[62,67,71]],[38,[62,66,69]]],
      MAJ:[[43,[62,67,71]],[38,[62,66,69]],[40,[64,67,71]],[36,[60,64,67]]],
      HOOK:[[[0,71,4],[4,69,2],[6,67,2],[8,74,6],[14,71,2]],[[0,72,3],[3,71,1],[4,69,4],[8,66,2],[10,67,2],[12,69,4]],[[0,71,4],[4,67,2],[6,76,6],[12,74,2],[14,71,2]],[[0,72,4],[4,71,2],[6,69,2],[8,69,4],[12,67,2],[14,66,2]]],
      intro(t,i,b){const [r,c]=this.MIN[0];if(i===0)strPad(t,[c[0]-12,c[1]-12,c[2]-12],3.2,.03);if(i%4===0)piano(t,[r+12,r+19,r+24,c[1]][i/4],2,.06)},
      drive(t,i,b,k){const [r,c]=this.MIN[b%4];if(i===0){strPad(t,c.map(n=>n-12),3.3,.03);mosc('sine',hz(r),t,3.3,menv(t,.2,.09,3.2))}
        if(i%2===0)piano(t,[r+12,r+19,c[1],r+24,c[2],r+24,c[1],r+19][(i/2)%8],1.4,.055);if(k&&i%2)piano(t,[c[2]+12,c[1]+12][(i>>1)%2],.8,.03);if(k&&i===0)cello(t,r+12,3,.06);if(i===12&&b%2===1)mbox(t,c[2]+24,.03)},
      brk(t,i,b){if(i===0){strPad(t,[50,54,57],3.4,.03);mosc('sine',hz(38),t,3.3,menv(t,.3,.08,3.2))}if(i===0||i===6||i===10)piano(t,[78,76,74][[0,6,10].indexOf(i)],2.2,.06);if(i===0||i===3)mosc('sine',55,t,.3,menv(t,.01,.12,.25))},
      roll(t,i,b,e){piano(t,62+[0,4,7,12,16,19,24,28][Math.min(7,Math.floor(e*3)+i%4)],1,.04+Math.min(.04,e*.02));if(i===0)strPad(t,[50,57,62,66],3,.035)},
      anthem(t,i,b){if(b>=4){if(i===0){strPad(t,[55,62,67,71],4.5,.04);piano(t,43,3.2,.08);piano(t,67,3.2,.07);piano(t,79,3.2,.08);mbox(t,91,.04);cello(t,43,4,.06)}return}
        const [r,c]=this.MAJ[b];if(i===0){strPad(t,c.map(n=>n-12),3.5,.035);cello(t,r,3.3,.055);piano(t,r,2.6,.06)}if(i%2===0&&i)piano(t,[0,c[0],c[1],c[2],c[0]+12,c[2],c[1],c[0]][(i/2)%8],1.2,.035);
        at(this.HOOK[b],i).forEach(([,m,l])=>{piano(t,m+12,Math.max(1.2,l*this.sp*1.6),.1);if(l>=4)mbox(t,m+24,.025)})}},
    orkestra:{bpm:66,dly:.5,bars:3,tail:9,
      SEQ:['I','ii','iii','IV','vi','Vs','V','I'],
      HOOK:[[[0,73,6],[6,75,2],[8,78,6],[14,77,2]],[[0,75,4],[4,73,2],[6,71,2],[8,70,6],[14,71,2]],[[0,73,4],[4,75,2],[6,78,2],[8,80,4],[12,78,2],[14,77,2]]],
      ANTH:[['I','Vs'],['vi','IV'],['ii','V']],
      intro(t,i,b){if(i===0){const c=OK.I;bow(t,c.b-12,3.6,.12,'cb',{att:1.2,from:.2});bow(t,c.b,3.6,.08,'cb',{att:1.2});bow(t,c.vc,3.6,.08,'vc',{att:1});c.va.forEach(m=>bow(t+.4,m,3.2,.045,'va',{att:1}));bow(t+.8,c.v2[1]+12,2.8,.04,'vn',{att:1.2})}},
      drive(t,i,b,k){const h=b*2+(i>=8?1:0),c=OK[this.SEQ[h%this.SEQ.length]],sd=8*this.sp,cr=1+h*.12;
        if(i%8===0){bow(t,c.b-12,sd+.2,.11*cr,'cb',{att:.4});bow(t,c.vc,sd+.2,.075*cr,'vc',{att:.35});c.va.forEach(m=>bow(t,m,sd+.2,.035*cr,'va',{att:.4}));bow(t,c.v2[1]+12,sd+.3,.04*cr,'vn',{att:.5,trem:k?13:0})}
        if(i%2===0)bow(t,[c.v2[0],c.v2[1],c.v2[0]+5>c.v2[1]?c.v2[0]+12:c.v2[0]+5,c.v2[1]][(i/2)%4],this.sp*1.8,.035*cr,'vn',{att:.04,rel:.25,novib:1});
        if(k&&i%2===1)bow(t,c.vc+12,this.sp*1.6,.03,'vc',{att:.04,rel:.2,novib:1})},
      brk(t,i,b){const c=OK.vi;if(i===0){c.va.forEach(m=>bow(t,m,3.4,.03,'va',{att:.6,trem:11}));bow(t,c.vc-12,3.4,.04,'vc',{att:.8})}if(i%4===0)pizzS(t,c.b-12,.13)},
      roll(t,i,b,e){if(i===0){bow(t,37,3.2,.05,'cb',{att:.3,to:2.2});bow(t,49,3.2,.05,'vc',{att:.3,to:2.2});[65,68].forEach(m=>bow(t,m,3.2,.03,'va',{att:.3,trem:14,to:2}))}
        if(i%2===0)bow(t,[73,75,77,78,80,82,83,85][Math.min(7,i/2)],this.sp*2.2,.03+Math.min(.04,e*.02),'vn',{att:.05,trem:15,rel:.2})},
      anthem(t,i,b){if(b>=3){if(i===0){const c=OK.I;bow(t,c.b-12,4.2,.13,'cb',{att:.25});bow(t,c.vc,4.2,.09,'vc');c.va.forEach(m=>bow(t,m,4,.045,'va'));[70,73,78].forEach(m=>bow(t,m,4,.035,'vn'));bow(t,78,3.6,.05,'vn',{att:.3})}
          if(i===8){[73,78].forEach(m=>bow(t,m,4.5,.03,'va',{att:1.4,wet:.9}));bow(t,85,4.5,.022,'vn',{att:1.6,wet:.9})}return}
        const c=OK[this.ANTH[b][i>=8?1:0]],sd=8*this.sp;
        if(i%8===0){bow(t,c.b-12,sd+.2,.13,'cb',{att:.3});bow(t,c.vc,sd+.15,.085,'vc',{att:.3});bow(t,c.b,sd+.2,.05,'cb',{att:.3})}
        if(i%2===0)bow(t,c.va[(i/2)%2],this.sp*2.2,.032,'va',{att:.05,rel:.3,novib:1});if(i%4===2)bow(t,c.v2[(i/4|0)%2],this.sp*3,.03,'vn',{att:.06,rel:.3,novib:1});
        at(this.HOOK[b],i).forEach(([,m,l])=>{const d=l*this.sp;bow(t,m,d,.06,'vn',{att:.12,rel:.45});bow(t,m-12,d,.045,'vn',{att:.14,rel:.45});bow(t,m-24,d,.045,'vc',{att:.16,rel:.4})})}},
    megah:{bpm:64,dly:.5,bars:3,tail:9,
      SEQ:['i','VI','III','VIIs','i','VI','iv','Vs'],
      HOOK:[[[0,69,6],[6,70,2],[8,72,4],[12,74,4]],[[0,77,6],[6,76,2],[8,74,6],[14,72,2]],[[0,70,4],[4,72,2],[6,74,2],[8,73,6],[14,76,2]]],
      ANTH:[['i','VI'],['III','VII'],['iv','Vs']],
      // pembuka tanpa bas, seperti referensi: viola dan biola mengembang, harpa naik
      intro(t,i,b){if(i===0){const c=DM.i9;c.va.forEach(m=>bowR(t,m,4,.03,'va',{att:1.4,from:.15}));c.v2.forEach(m=>bowR(t+.5,m,3.6,.022,'vn',{att:1.4,from:.15}))}
        if(i<12)harp(t,[50,57,62,65,69,74,77,81,86,89,93,98][i],.045)},
      drive(t,i,b,k){const h=b*2+(i>=8?1:0),key=this.SEQ[h%this.SEQ.length],c=DM[key],sd=8*this.sp,cr=1+h*.1;
        if(i%8===0){bowR(t,c.b,sd+.2,.12*cr,'cb',{att:.5});c.vc.forEach(m=>bowR(t,m,sd+.2,.05*cr,'vc',{att:.45}));c.va.forEach(m=>bowR(t,m,sd+.2,.03*cr,'va',{att:.5}));c.v2.forEach(m=>bowR(t,m+12,sd+.3,.024*cr,'vn',{att:.6,trem:k?13:0}))}
        if(i===4&&/s$/.test(key)){const r=DM[key.slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.03*cr,'va',{att:.3}))}
        if(i%2===0)bowR(t,[c.v2[0],c.v2[1],c.v2[0]+12,c.v2[1]][(i/2)%4],this.sp*1.9,.028*cr,'vn',{att:.05,rel:.3,novib:1,pan:-.25});
        if(i%4===0)harp(t,c.v2[(i/4)%2]+12,.035);if(k&&i%2===1)bowR(t,c.vc[1],this.sp*1.6,.03,'vc',{att:.04,rel:.25,novib:1});if(k&&i===0)timpH(t,hz(c.b+12),.18)},
      brk(t,i,b){const c=DM.Vs;if(i===0){c.va.forEach(m=>bowR(t,m,3.6,.028,'va',{att:.7,trem:11}));bowR(t,c.vc[0],3.6,.045,'vc',{att:.9})}if(i%4===0)pizzS(t,c.b,.14)},
      roll(t,i,b,e){if(i===0){bowR(t,33,3.4,.08,'cb',{att:.3,to:2.4});bowR(t,45,3.4,.05,'vc',{att:.3,to:2.4});[61,64].forEach(m=>bowR(t,m,3.4,.028,'va',{att:.3,trem:14,to:2}))}
        if(i%2===0)bowR(t,[69,70,73,74,76,77,79,81][Math.min(7,i/2)],this.sp*2.2,.028+Math.min(.035,e*.018),'vn',{att:.05,trem:15,rel:.2});if(i%2===0)timpH(t,hz(45),.06+Math.min(.18,e*.07))},
      anthem(t,i,b){if(b>=3){if(i===0){const c=DM.i9;bowR(t,c.b-12,4.6,.1,'cb',{att:.3});bowR(t,c.b,4.6,.08,'cb',{att:.3});c.vc.forEach(m=>bowR(t,m,4.6,.06,'vc'));c.va.forEach(m=>bowR(t,m,4.4,.035,'va'));c.v2.forEach(m=>bowR(t,m,4.4,.03,'vn'));bowR(t,74,4,.055,'vn',{att:.3});timpH(t,hz(50),.3);[50,57,62,65,69,74,77,81].forEach((m,k)=>harp(t+k*.07,m,.045))}
          if(i===8){[69,74].forEach(m=>bowR(t,m,4.8,.028,'va',{att:1.5,wet:.95}));bowR(t,81,4.8,.02,'vn',{att:1.7,wet:.95})}return}
        const key=this.ANTH[b][i>=8?1:0],c=DM[key],sd=8*this.sp;
        if(i%8===0){bowR(t,c.b,sd+.2,.13,'cb',{att:.35});bowR(t,c.b+12,sd+.2,.04,'cb',{att:.35});c.vc.forEach(m=>bowR(t,m,sd+.15,.03,'vc',{att:.35}));c.va.forEach(m=>bowR(t,m,sd+.15,.042,'va',{att:.4}));c.v2.forEach(m=>bowR(t,m,sd+.15,.022,'vn',{att:.45,pan:-.3}));if(i===0)timpH(t,hz(c.b+12),.2)}
        if(i===4&&/s$/.test(key)){const r=DM[key.slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.03,'va',{att:.25}))}
        if(i%2===0)harp(t,[c.vc[0]+12,c.va[0],c.va[1],c.v2[0],c.v2[1],c.v2[0]+12,c.v2[1],c.va[1]][(i/2)%8],.035);if(i%4===2)bowR(t,c.v2[(i/4|0)%2],this.sp*3,.034,'vn',{att:.06,rel:.3,novib:1,pan:-.2});
        at(this.HOOK[b],i).forEach(([,m,l])=>{const d=l*this.sp;bowR(t,m,d,.068,'vn',{att:.14,rel:.5,pan:-.4});bowR(t,m-12,d,.048,'vn',{att:.16,rel:.5,pan:-.15});bowR(t,m-24,d,.028,'vc',{att:.18,rel:.45})})}}
,
    manis:{bpm:68,dly:.5,bars:3,tail:9,
      SEQ:['i9','VI7','III9','VIIs','iv7','VI','Vs','V'],
      HOOK:[[[0,78,4],[4,76,2],[6,74,2],[8,76,6],[14,73,2]],[[0,74,4],[4,78,2],[6,81,2],[8,79,6],[14,78,2]],[[0,76,4],[4,78,2],[6,79,2],[8,81,4],[12,79,2],[14,76,2]]],
      ANTH:[['I9','V6'],['vi7','IVM7'],['ii7','Vs']],
      chord(t,c,d,v=1){bowR(t,c.b-12,d,.1*v,'cb',{att:.3});bowR(t,c.b,d,.05*v,'cb',{att:.3});c.vc.forEach(m=>bowR(t,m,d,.034*v,'vc',{att:.3}));c.va.forEach(m=>bowR(t,m,d,.03*v,'va',{att:.35}));hornPad(t,[c.vc[0],c.vc[1],c.va[0]],d,.022*v)},
      // langsung megah: seluruh orkestra masuk begitu telur pecah
      intro(t,i,b){if(i===0){const c=MN.i9;this.chord(t,c,3.8,1.1);c.v2.forEach(m=>bowR(t,m+12,3.6,.026,'vn',{att:.3}));choir(t,[62,65,69],3.6,.025);[50,57,62,65,69,74,76,81,86,88,93].forEach((m,k)=>harp(t+k*.05,m,.04))}
        if(i<6&&i%2===0)timpH(t,hz(38),.12+i*.04)},
      drive(t,i,b,k){const h=b*2+(i>=8?1:0),key=this.SEQ[h%this.SEQ.length],c=MN[key],sd=8*this.sp,cr=1+h*.08;
        if(i%8===0){this.chord(t,c,sd+.2,cr);if(c.mel){const d6=6*this.sp;bowR(t,c.mel[0]+(k?12:0),d6,.05*cr,'vn',{att:.18,rel:.4,pan:-.45});bowR(t,c.th[0]+(k?12:0),d6,.036*cr,'vn',{att:.2,rel:.4,pan:-.2})}if(k)timpH(t,hz(c.b+12),.15)}
        if(i%8===6&&c.mel){const d2=2*this.sp+.1;bowR(t,c.mel[1]+(k?12:0),d2,.045*cr,'vn',{att:.08,rel:.35,pan:-.45});bowR(t,c.th[1]+(k?12:0),d2,.032*cr,'vn',{att:.08,rel:.35,pan:-.2})}
        if(i===4&&/s$/.test(key)){const r=MN[key.slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.03,'va',{att:.25}))}
        if(i%2===0||k)piano(t,[c.vc[0]+12,c.va[0],c.va[1],c.v2[0],c.v2[1],c.v2[0],c.va[1],c.va[0]][(k?i:i/2)%8],1.1,.04);if(i%4===2)harp(t,c.v2[1]+12,.03)},
      brk(t,i,b){const c=MN.VI7;if(i===0){c.va.forEach(m=>bowR(t,m,3.6,.026,'va',{att:.6}));bowR(t,c.vc[0],3.6,.04,'vc',{att:.7});hornPad(t,[46,53,57],3.4,.02)}if(i===0||i===6||i===10)piano(t,[81,77,74][[0,6,10].indexOf(i)],2.2,.06);if(i%4===0)pizzS(t,c.b+12,.11)},
      roll(t,i,b,e){if(i===0){bowR(t,33,3.4,.08,'cb',{att:.3,to:2.4});bowR(t,45,3.4,.05,'vc',{att:.3,to:2.4});[61,64].forEach(m=>bowR(t,m,3.4,.028,'va',{att:.3,trem:14,to:2}));choir(t,[57,61,64],3.2,.03);hornPad(t,[45,52,57],3,.025)}
        if(i%2===0)bowR(t,[69,70,73,74,76,77,79,81][Math.min(7,i/2)],this.sp*2.2,.028+Math.min(.035,e*.018),'vn',{att:.05,trem:15,rel:.2});if(i%2===0)timpH(t,hz(45),.06+Math.min(.18,e*.07));if(i===12)[57,61,64,69,73,76,81,85].forEach((m,k)=>harp(t+k*.05,m,.035))},
      // mekar ke D mayor: melodi biola oktaf + terts di bawah, cello kontramelodi, piano dan harpa mengalir
      anthem(t,i,b){if(b>=3){if(i===0){const c=MN.I9;this.chord(t,c,4.6,1.2);c.v2.forEach(m=>bowR(t,m,4.4,.026,'vn',{pan:-.3}));bowR(t,78,4.2,.05,'vn',{att:.3,pan:-.45});bowR(t,74,4.2,.036,'vn',{att:.3,pan:-.2});choir(t,[62,66,69,74],4.6,.03);timpH(t,hz(50),.3);
            [50,57,62,66,69,74,76,78,81,86,90].forEach((m,k)=>harp(t+k*.05,m,.045))}
          if(i===8){[69,74].forEach(m=>bowR(t,m,4.8,.026,'va',{att:1.5,wet:.95}));bowR(t,81,4.8,.022,'vn',{att:1.7,wet:.95});piano(t,86,3,.05)}return}
        const key=this.ANTH[b][i>=8?1:0],c=MN[key],sd=8*this.sp;
        if(i%8===0){this.chord(t,c,sd+.2,1.1);choir(t,c.va.map(m=>m+12).slice(0,2),sd+.3,.018);if(i===0)timpH(t,hz(c.b+12),.2)}
        if(i===4&&/s$/.test(key)){const r=MN[key.slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.03,'va',{att:.25}))}
        piano(t,[c.vc[0]+12,c.va[0],c.va[1],c.v2[0],c.v2[1],c.v2[0],c.va[1],c.va[0]][(i/2|0)%8]+(i%2?12:0),1,i%2?.025:.04);if(i%2===0)harp(t,c.v2[(i/2)%2]+12,.03);
        at(this.HOOK[b],i).forEach(([,m,l])=>{const d=l*this.sp;bowR(t,m,d,.06,'vn',{att:.14,rel:.5,pan:-.45});bowR(t,m-12,d,.035,'vn',{att:.16,rel:.5,pan:-.3});if(TH3[m])bowR(t,TH3[m],d,.04,'vn',{att:.16,rel:.5,pan:-.15});bowR(t,m-24,d,.026,'vc',{att:.18,rel:.45})})}}
,
    ballad:{bpm:68,dly:.5,bars:3,tail:14,resetAll:true,
      // Satu melodi panjang yang memanjat dari tahap ke tahap; intensitas naik terus dan baru turun di kadens akhir.
      // Ciri melodi mengikuti pembuka referensi: hampir semua melangkah dekat, nada panjang di ujung frasa.
      A:[[0,62,4],[4,64,2],[6,66,2],[8,64,6],[14,61,2],[16,59,4],[20,61,2],[22,62,2],[24,67,6],[30,66,2],[32,66,4],[36,64,2],[38,62,2],[40,64,6],[46,66,2],[48,67,4],[52,69,2],[54,71,2],[56,69,8]],
      ASEQ:['I9','V6','vi7','IV9','I6','ii7','IV9','VDs'],
      B:[[0,74,4],[4,76,2],[6,78,2],[8,79,6],[14,78,2],[16,81,6],[22,79,2],[24,78,4],[28,79,4]],BSEQ:['IV9','I6','ii7','VDs'],
      C:[[0,78,3],[3,79,1],[4,81,4],[8,83,4],[12,81,2],[14,83,2],[16,85,8]],CSEQ:['vi7','IV9','VDs','VDs'],
      HOOK:[[[0,81,4],[4,83,2],[6,85,2],[8,86,6],[14,85,2]],[[0,83,4],[4,81,2],[6,79,2],[8,81,6],[14,79,2]],[[0,78,4],[4,79,2],[6,81,2],[8,83,4],[12,85,4]]],
      ANTH:[['I9','V6'],['vi7','IVM7'],['ii7','VDs']],
      TH:{86:83,85:81,83:79,82:79,81:78,79:76,78:74,76:73,74:71,71:67,69:66,67:64,66:62,64:61,62:59,61:57,59:55},
      lay(t,c,d,L,o){const sw={att:.5,from:.55,to:1.35,...o};bowR(t,c.b-12,d,.09*L,'cb',sw);bowR(t,c.b,d,.045*L,'cb',sw);c.vc.forEach(m=>bowR(t,m,d,.026*L,'vc',sw));c.va.forEach(m=>bowR(t,m,d,.04*L,'va',sw));
        if(L>.8)c.va.forEach(m=>bowR(t,m+12,d,.016*L,'vn',{...sw,pan:-.3}));if(L>.9)hornPad(t,[c.vc[0],c.vc[1],c.va[0]],d,.02*L);if(L>1)choir(t,c.va.map(m=>m+12).slice(0,2),d+.3,.016*L)},
      sing(t,m,d,L,sec,oct){const o={att:.14,rel:.5};if(sec==='low'){bowR(t,m,d,.05*L,'vc',{...o,pan:.25});bowR(t,m,d,.035*L,'va',{...o,pan:0})}
        else{bowR(t,m,d,.055*L,'vn',{...o,pan:-.45});if(oct)bowR(t,m-12,d,.032*L,'vn',{...o,pan:-.3});if(this.TH[m])bowR(t,this.TH[m],d,.036*L,'vn',{...o,pan:-.15})}},
      flow(t,i,c,L,dens){if(i%dens===0)piano(t,[c.vc[0]+12,c.va[0],c.va[1],c.v2[0],c.v2[1],c.v2[0],c.va[1],c.va[0]][(i/dens|0)%8],1.1,.036*Math.min(L,1.1));if(i%4===2)harp(t,c.v2[1]+12,.03)},
      phrase(t,s,M,SEQ,L,sec,oct,dens,res){const i=s%16,c=MN[SEQ[Math.floor(s/8)%SEQ.length]];if(i%8===0)this.lay(t,c,8*this.sp+.2,L);
        if(res&&i===4&&/s$/.test(SEQ[Math.floor(s/8)%SEQ.length])){const r=MN[SEQ[Math.floor(s/8)%SEQ.length].slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.03*L,'va',{att:.25}))}
        M.filter(n=>n[0]===s).forEach(([,m,l])=>this.sing(t,m,l*this.sp,L,sec,oct));this.flow(t,i,c,L,dens)},
      intro(t,i,b){if(i===0){[50,57,62,66,69,74,76,78,81,86,90].forEach((m,k)=>harp(t+k*.05,m,.04));this.lay(t,MN.I9,2.6,.58,{att:.18,from:1,to:1.1});this.sing(t,62,2.4,.55,'low');choir(t,[62,66,69],3.4,.022)}if(i===4)timpH(t,hz(38),.14);this.flow(t,i,MN.I9,.65,2)},
      drive(t,i,b,k,s){const L=.5+Math.min(.45,s*.022);this.phrase(t,s,this.A,this.ASEQ,L,'low',0,2,1);if(s===0){timpH(t,hz(38),.22);[62,66,69,74,78,81].forEach((m,j)=>harp(t+j*.04,m,.032))}},
      peak(t,i,b,s){const L=.95+Math.min(.2,s*.011);this.phrase(t,s,this.B,this.BSEQ,L,'hi',1,1,1);if(i===0)timpH(t,hz(MN[this.BSEQ[Math.floor(s/8)%4]].b+12),.18)},
      brk(t,i,b,s){const L=1.05+Math.min(.12,s*.006);this.phrase(t,s,this.C,this.CSEQ,L,'hi',1,1,1);if(i%4===0)timpH(t,hz(45),.14+s*.004)},
      roll(t,i,b,e,s){const L=1.3+Math.min(.15,e*.06);if(s===0){const c=MN.VDs;this.lay(t,c,3.6,1.38);this.sing(t,85,3.6,1.35,'hi',1);choir(t,[62,64,69],3.6,.036)}this.flow(t,i,MN.VDs,L,1);
        if(s%2===0&&s<16)bowR(t,[57,59,61,62,64,66,67,69][s/2],this.sp*2.2,.028+Math.min(.03,e*.015),'va',{att:.05,trem:15,rel:.2});timpH(t,hz(45),.08+Math.min(.2,e*.08));if(s===12)[57,61,64,69,73,76,81,85].forEach((m,j)=>harp(t+j*.05,m,.035))},
      // sesaat sebelum karakter keluar: tidak hening, akor ditahan dan mengembang ke puncak
      hold(t,i,b,s){if(s===0){const c=MN.V;this.lay(t,c,2.4,1.45);this.sing(t,85,2.4,1.4,'hi',1);choir(t,[61,64,69,73],2.4,.034)}if(s%2===0)timpH(t,hz(45),.22+s*.012);this.flow(t,i,MN.V,1.2,1)},
      anthem(t,i,b){const L=1.9;if(b>=3){const step=(c,d,v,m)=>{this.lay(t,c,d,v);this.sing(t,m,d-.2,v,'hi',1)};
          if(i===0){step(MN.IV9,4*this.sp+.3,1.15,86);piano(t,67,1.5,.05)}
          if(i===4){step(MN.ivm,4*this.sp+.3,1.0,82);piano(t,70,1.5,.05)}
          if(i===8){const c=MN.I9;this.lay(t,c,4.8,.95);this.sing(t,81,4.2,.85,'hi',1);timpH(t,hz(50),.22);[50,57,62,66,69,74,76,78,81,86,90].forEach((m,j)=>harp(t+j*.05,m,.04));piano(t,74,3,.045);piano(t,86,3,.035)}
          if(i===13){[69,74].forEach(m=>bowR(t,m,4.2,.022,'va',{att:1.4,wet:.95}));bowR(t,81,4.2,.018,'vn',{att:1.6,wet:.95})}return}
        const key=this.ANTH[b][i>=8?1:0],c=MN[key];if(i%8===0){this.lay(t,c,8*this.sp+.2,L);choir(t,[c.va[0]+12,c.v2[0]],8*this.sp+.3,.026);c.v2.forEach(m=>bowR(t,m,8*this.sp+.1,.026,'vn',{att:.3,pan:-.35}));timpH(t,hz(c.b+12),i?.16:.26)}
        if(i===4&&/s$/.test(key)){const r=MN[key.slice(0,-1)];r.va.forEach(m=>bowR(t,m,4*this.sp+.2,.034,'va',{att:.25}))}
        at(this.HOOK[b],i).forEach(([,m,l])=>this.sing(t,m,l*this.sp,L,'hi',1));this.flow(t,i,c,L,1)}}
};
  for(const k in SC)SC[k].sp=60/SC[k].bpm/4;
  const style=()=>{let s='ballad';try{s=localStorage.getItem('tesKepribadian.musik')||'ballad'}catch(e){}return SC[s]?s:'ballad'};
  const busInit=()=>{if(mus.bus&&mus.bus.context===ac)return;mus.sc=SC[style()];mus.bus=ac.createGain();mus.bus.gain.value=.6;mus.bus.connect(out);
    const d=ac.createDelay(2);d.delayTime.value=60/mus.sc.bpm*mus.sc.dly;const fb=ac.createGain();fb.gain.value=.3;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
    d.connect(lp);lp.connect(fb);fb.connect(d);const dw=ac.createGain();dw.gain.value=.35;lp.connect(dw);dw.connect(mus.bus);mus.dl=d};
  const playStep=(t,s)=>{const S=mus.sc,i=s%16,b=Math.floor(s/16),ph=mus.ph;
    if(ph==='intro')S.intro(t,i,b,s);else if(ph==='drive')S.drive(t,i,b,0,s);else if(ph==='peak'){if(S.peak)S.peak(t,i,b,s);else S.drive(t,i,b,1,s)}else if(ph==='break')S.brk(t,i,b,s);else if(ph==='roll')S.roll(t,i,b,t-mus.ph0,s);else if(ph==='hold'){if(S.hold)S.hold(t,i,b,s)}else if(ph==='anthem')S.anthem(t,i,b)};
  const tick16=()=>{if(!ac||!mus.ph)return;while(mus.next<ac.currentTime+.2){playStep(mus.next,mus.step);mus.step++;mus.next+=mus.sc.sp;if(mus.ph==='anthem'&&mus.step>=16*mus.sc.bars+(mus.sc.tail||1)){mus.ph=null;break}}};
  const musGo=(ph,t,reset)=>{busInit();const was=mus.ph;mus.ph=ph;mus.ph0=t;if(reset||!was||mus.sc.resetAll){mus.step=0;mus.next=t}if(!mus.tm)mus.tm=setInterval(tick16,40);tick16()};
  const musStop=()=>{mus.ph=null;if(mus.tm){clearInterval(mus.tm);mus.tm=null}if(mus.bus&&ac){try{mus.bus.gain.setTargetAtTime(0,ac.currentTime,.03)}catch(e){}mus.bus=null}};
