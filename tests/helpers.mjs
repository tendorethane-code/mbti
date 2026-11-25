import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Muat data.js + core.js persis seperti browser memuatnya (script biasa, satu scope global).
export function loadCore() {
  const src = ['data.js', 'legacy.js', 'core.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n;\n');
  const ctx = vm.createContext({console, TextEncoder, TextDecoder, btoa, atob, Uint8Array});
  return vm.runInContext(src + '\n;({AX,CORE,FACETS,FITEMS,B5,FN1,FN2,POS,RIGHT,TABLE,STACK,FAM,FUNCS,MODS,MAIN,TOTAL,DATA_V,DEEP,deepFindings,deepPlan,storyFindings,closingLines,FIND_RANK,FIND_AREA,deepDone,histEntry,histData,histAdd,resultOf,LAYOUT_V2,LEGACY_FACET_V1,compute,canon,fromCanon,insights,encodeShare,decodeShare,esc,cleanNotes,sanitizeImport,exportData,safeName,fileSlug,summaryText,famOf,isDone,answered,emptyAns,valid,titleCase,typePal,typeSurf,contrast,TYPE_PAL})', ctx);
}

// Jawaban buatan yang mengarah ke satu tipe, dengan nilai mentah sesuai posisi A/B yang tampil di layar.
export function answersFor(C, type, ident = 'T', strength = 2) {
  const hi = 3 + strength, lo = 3 - strength;
  const letterOf = {EI: type[0], SN: type[1], TF: type[2], JP: type[3], AT: ident};
  const rank = f => {const i = C.STACK[type].indexOf(f); return i < 0 ? 1 : 5 - i;};
  const ans = {};
  for (const m of C.MODS) {
    ans[m.id] = m.items.map(it => {
      let want;
      if (m.id === 'inti') want = it.bl === letterOf[it.ax] ? hi : lo;
      else if (m.id === 'facet') want = C.RIGHT[it.ax] === letterOf[it.ax] ? hi : lo;
      else if (m.id === 'big5') want = it.d === 'N' ? ((ident === 'T') !== it.rev ? hi : lo) : 3;
      else if (it.k === 'lk') want = rank(it.fn);
      else want = rank(it.fb) > rank(it.fa) ? hi : rank(it.fb) < rank(it.fa) ? lo : 3;
      return it.fl ? 6 - want : want;
    });
  }
  return ans;
}
