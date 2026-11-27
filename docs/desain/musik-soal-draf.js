// Arsip draf musik latar saat mengisi soal (Web Audio). TIDAK dipakai: pemilik memutuskan layar soal tanpa musik.
// Draf: tenang (piano + pad), hangat (harpa + string), ringan (marimba + pizzicato), orkestra (F mayor: string, cello, harpa).
// Prinsip yang dipakai saat membuatnya: netral (tidak bergantung jawaban, tidak terlalu sedih/riang), tanpa melodi menonjol
// supaya tidak mengganggu membaca, pola diacak tiap bar, ringan untuk baterai, bawaan mati.
// Untuk memasang lagi: tempel blok ini setelah modul `sfx` di index.html, tambahkan tombol dan CSS di bawah, lalu
// panggil bgm.play()/bgm.stop() di start() dan show() (lihat riwayat git commit "Musik latar saat mengisi soal").
// Tombol (di dalam .qtr layar soal):
// <button type="button" class="qmus" id="qMus" aria-pressed="false" aria-label="Musik latar mati, ketuk untuk menyalakan"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path class="x" d="M3 3l18 18"/></svg></button>
// CSS:
// .qmus{width:36px;height:36px;flex:none;margin-right:10px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--mute);display:grid;place-items:center;cursor:pointer}.qmus svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.qmus[aria-pressed=true]{color:var(--ink);border-color:var(--ind);background:var(--pan)}.qmus[aria-pressed=true] .x{display:none}

// ---------- Musik latar saat mengisi soal ----------
// Tenang dan netral: tidak bergantung pada jawaban (suasana hati bisa menggeser cara orang menilai diri), tanpa melodi menonjol supaya tidak mengganggu membaca.
// Pola diacak tiap bar supaya tidak berulang persis selama tes panjang. Ringan untuk baterai: gema dari dua tunda, bukan konvolusi.
const BGM_KEY='tesKepribadian.musikSoal';
const bgm=(()=>{let ac=null,out=null,dl=null,tm=null,next=0,step=0,st=null,seed=1;
  const rnd=()=>(seed=seed*16807%2147483647)/2147483647,hz=m=>440*Math.pow(2,(m-69)/12);
  const init=()=>{if(ac){if(ac.state==='suspended')ac.resume();return true}const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;try{ac=new A()}catch(e){return false}
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-20;comp.ratio.value=4;comp.connect(ac.destination);out=ac.createGain();out.gain.value=0;out.connect(comp);
    // dua tunda bersilang dengan umpan balik tersaring = gema ringan
    dl=ac.createGain();dl.gain.value=.5;const w=ac.createGain();w.gain.value=.45;w.connect(out);
    [[.37,.45],[.53,.4]].forEach(([t,fb])=>{const d=ac.createDelay(1.5);d.delayTime.value=t;const f=ac.createGain();f.gain.value=fb;const l=ac.createBiquadFilter();l.type='lowpass';l.frequency.value=2200;dl.connect(d);d.connect(l);l.connect(f);f.connect(d);l.connect(w)});
    return true};
  const env=(t,a,v,d,send)=>{const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);g.connect(out);if(send){const s=ac.createGain();s.gain.value=send;g.connect(s);s.connect(dl)}return g};
  const osc=(type,f,t,d,to,det)=>{const o=ac.createOscillator();o.type=type;o.frequency.value=f;if(det)o.detune.value=det;o.connect(to);o.start(t);o.stop(t+d+.05)};
  const lp=(f,to)=>{const b=ac.createBiquadFilter();b.type='lowpass';b.frequency.value=f;b.connect(to);return b};
  const piano=(t,m,v=.07,d=2.2)=>{const g=env(t,.006,v,d,.6),l=lp(2400,g);l.frequency.setValueAtTime(3200,t);l.frequency.exponentialRampToValueAtTime(900,t+d);osc('triangle',hz(m),t,d,l);osc('sine',hz(m)*2,t,d*.5,env(t,.006,v*.18,d*.4))};
  const pad=(t,ns,d,v=.022)=>{const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+d*.4);g.gain.setValueAtTime(v,t+d*.7);g.gain.exponentialRampToValueAtTime(.0001,t+d+.8);g.connect(out);const s=ac.createGain();s.gain.value=.5;g.connect(s);s.connect(dl);const l=lp(900,g);ns.forEach(m=>{osc('sawtooth',hz(m),t,d+.9,l,-6);osc('sawtooth',hz(m),t,d+.9,l,6)})};
  const harp=(t,m,v=.05)=>osc('triangle',hz(m),t,1.7,lp(3000,env(t,.003,v,1.6,.6)));
  const mar=(t,m,v=.06)=>{osc('sine',hz(m),t,.6,env(t,.003,v,.5,.5));osc('sine',hz(m)*4,t,.1,env(t,.002,v*.2,.08))};
  const pz=(t,m,v=.07)=>osc('triangle',hz(m),t,.4,lp(900,env(t,.004,v,.35,.3)));
  const sub=(t,m,d,v=.06)=>osc('sine',hz(m),t,d,env(t,.2,v,d));
  // string ringan: dua saw berselisih nada per nada, vibrato bersama, mengembang pelan
  const strg=(t,ns,d,v,cut=1300,att=.35)=>{const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+d*att);g.gain.setValueAtTime(v,t+d*.75);g.gain.exponentialRampToValueAtTime(.0001,t+d+1.2);g.connect(out);
    const s=ac.createGain();s.gain.value=.6;g.connect(s);s.connect(dl);const l=lp(cut,g);const vb=ac.createOscillator(),vg=ac.createGain();vb.frequency.value=5;vg.gain.value=7;vb.connect(vg);vb.start(t);vb.stop(t+d+1.3);
    ns.forEach(m=>[-7,7].forEach(dt=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=hz(m);o.detune.value=dt;vg.connect(o.detune);o.connect(l);o.start(t);o.stop(t+d+1.3)}))};
  const ST={
    tenang:{bpm:70,CH:[[50,[62,66,69,73]],[47,[62,66,69,71]],[43,[62,66,67,71]],[45,[61,64,69,71]]],
      bar(t,b,sp){const [r,c]=this.CH[Math.floor(b/2)%4];if(b%2===0){pad(t,c.map(m=>m-12),sp*32,.018);sub(t,r-12,sp*32,.05)}
        const pat=[[0,4,8,12],[0,6,8,14],[0,4,10,12],[2,6,8,12]][Math.floor(rnd()*4)],tn=[c[0],c[1],c[2],c[3],c[2]+12,c[1]+12];
        pat.forEach(s=>{if(rnd()<.85)piano(t+s*sp,tn[Math.floor(rnd()*tn.length)],.055+rnd()*.02)});if(rnd()<.3)piano(t+sp*Math.floor(rnd()*14),c[3]+12,.035)}},
    hangat:{bpm:64,CH:[[50,[62,66,69,74]],[49,[61,64,69,73]],[47,[62,66,69,71]],[43,[62,67,71,74]]],
      bar(t,b,sp){const [r,c]=this.CH[Math.floor(b/2)%4];if(b%2===0){pad(t,c.map(m=>m-12),sp*32,.026);sub(t,r-12,sp*32,.05)}
        for(let s=0;s<16;s+=2)if(rnd()<.7)harp(t+s*sp,c[(s/2)%4]+(s>=8?12:0),.04)}},
    orkestra:{bpm:66,vol:1.6,
      // F mayor (saudara D minor musik terungkap): Fmaj7, Dm9, Bbmaj7, Csus4->C
      CH:[[41,[57,60,64,69]],[38,[57,60,64,65]],[46,[57,62,65,69]],[48,[55,60,65]]],
      bar(t,b,sp){const k=Math.floor(b/2)%4,[r,c]=this.CH[k];
        if(b%2===0){strg(t,c,sp*32,.016,1200,.4);strg(t,[r],sp*32,.03,600,.3);if(k===3)strg(t+sp*24,[55,60,64],sp*8,.012,1200,.3)}
        for(let s=0;s<16;s+=2)if(rnd()<.55)harp(t+s*sp,c[Math.floor(rnd()*c.length)]+(rnd()<.5?12:0),.032);
        if(b%4===1){let s=Math.floor(rnd()*4)*2;for(let n=0;n<2;n++){strg(t+s*sp,[c[Math.floor(rnd()*c.length)]+12],sp*8,.012,2200,.45);s+=8}}
        if(rnd()<.6)pz(t,r-12+12,.05)}},
    ringan:{bpm:92,vol:2.6,CH:[[48,[60,64,67,72]],[45,[60,64,69,72]],[41,[60,65,69,72]],[43,[59,62,67,71]]],
      bar(t,b,sp){const [r,c]=this.CH[b%4];pz(t,r,.08);pz(t+sp*8,r+7,.06);if(b%2===0)pad(t,c.map(m=>m-12),sp*16,.012);
        [0,3,6,8,11,14].forEach(s=>{if(rnd()<.7)mar(t+s*sp,c[Math.floor(rnd()*4)]+12,.045)})}}};
  const style=()=>{let s='orkestra';try{s=localStorage.getItem('tesKepribadian.musikSoalGaya')||'orkestra'}catch(e){}return ST[s]?s:'orkestra'};
  const tick=()=>{if(!ac||!st)return;const sp=60/st.bpm/4;while(next<ac.currentTime+.4){st.bar(next,step,sp);step++;next+=sp*16}};
  return {get on(){try{return localStorage.getItem(BGM_KEY)==='1'}catch(e){return false}},get playing(){return !!tm},
    set(v){try{localStorage.setItem(BGM_KEY,v?'1':'0')}catch(e){}},
    play(){if(tm||!init())return;st=ST[style()];seed=(Date.now()%100000)+1;step=0;const n=ac.currentTime;next=n+.15;out.gain.cancelScheduledValues(n);out.gain.setValueAtTime(0,n);out.gain.linearRampToValueAtTime(st.vol||1.5,n+2.5);tick();tm=setInterval(tick,200)},
    stop(){if(!tm)return;clearInterval(tm);tm=null;st=null;const a=ac,o=out;ac=null;try{o.gain.setTargetAtTime(0,a.currentTime,.3);setTimeout(()=>a.close().catch(()=>{}),1500)}catch(e){}}};
})();
document.addEventListener('visibilitychange',()=>{if(document.hidden)bgm.stop();else if(bgm.on&&!$('quiz').hidden){bgm.play();musUi()}});
const musUi=()=>{const b=$('qMus');if(!b)return;b.setAttribute('aria-pressed',String(bgm.on));b.setAttribute('aria-label',bgm.on?'Musik latar nyala, ketuk untuk mematikan':'Musik latar mati, ketuk untuk menyalakan');b.dataset.playing=bgm.playing?'1':''};
