/* Pure, offline analysis. Inputs are never modified. No diagnosis or risk score. */
(function(root){
'use strict';
const FAMILY_GROUPS={
  Solanaceae:['tomato','cherry_tomato','eggplant','pepper','paprika','chili','potato'],
  Cucurbitaceae:['cucumber','pumpkin','watermelon','zucchini','bitter_melon'],
  Brassicaceae:['cabbage','hakusai','broccoli','cauliflower','komatsuna','chingensai','daikon','turnip','rocket','radish','kale'],
  Apiaceae:['carrot','parsley','mitsuba','dill'],Amaryllidaceae:['onion','garlic','negi','nira'],Asparagaceae:['asparagus'],
  Fabaceae:['edamame','green_bean','broad_bean','snap_pea','yardlong_bean','cowpea'],Poaceae:['corn'],Asteraceae:['lettuce','shungiku'],
  Convolvulaceae:['sweetpotato','kangkung'],Rosaceae:['strawberry'],Lamiaceae:['basil','shiso'],Araceae:['taro'],Amaranthaceae:['spinach','amaranth','beetroot'],Malvaceae:['okra']
};
const FAMILIES=Object.assign(Object.create(null),Object.fromEntries(Object.entries(FAMILY_GROUPS).flatMap(([f,ids])=>ids.map(id=>[id,f]))));
const FAMILY_JA={Solanaceae:'ナス科',Cucurbitaceae:'ウリ科',Brassicaceae:'アブラナ科',Apiaceae:'セリ科',Amaryllidaceae:'ヒガンバナ科',Asparagaceae:'キジカクシ科',Fabaceae:'マメ科',Poaceae:'イネ科',Asteraceae:'キク科',Convolvulaceae:'ヒルガオ科',Rosaceae:'バラ科',Lamiaceae:'シソ科',Araceae:'サトイモ科',Amaranthaceae:'ヒユ科',Malvaceae:'アオイ科'};
const BASE='https://www.maff.go.jp/j/syouan/syokubo/gaicyu/g_ipm/';
const SOURCES={
 green:{id:'green',title:'緑肥利用マニュアル ― 土づくりと減肥を目指して',publisher:'農研機構',url:'https://www.naro.go.jp/publicity_report/publication/files/ryokuhi_manual_carc20221007.pdf',section:'第3章 3-3 腐熟期間（冊子18ページ）',version:'2020年3月版・掲載PDF 2022年10月',checked:'2026-10-23',scope:'緑肥の種類・後作物・温度等で条件が変わる'},
 tomatoModel:{id:'tomatoModel',title:'総合防除実践指標モデル（施設栽培トマト）',publisher:'農林水産省',url:BASE+'attach/pdf/jissenn_sihyou-9.pdf#page=3',section:'PDF 3ページ・項目2、6、8（片付け・排水・土壌診断）',version:'総合防除実践指標モデル・掲載版',checked:'2026-10-23',scope:'施設栽培トマトの例示。地域・栽培体系への適合確認が必要'},
 rotation:{id:'rotation',title:'葉物野菜を上手に育てるヒケツ',publisher:'農林水産省',url:'https://www.maff.go.jp/j/pr/aff/2301/spe1_04.html',section:'ローテーションで連作障害を避ける',version:'2023年1月',checked:'2026-10-22'},
 general:{id:'general',title:'総合防除実践マニュアル・第1章',publisher:'農林水産省',url:BASE+'attach/pdf/index-45.pdf#page=7',section:'PDF 7ページ・総合防除とは',version:'2026年3月公表版',checked:'2026-10-22'},
 tomato:{id:'tomato',title:'総合防除実践マニュアル・トマト編',scope:'九州・促成栽培の体系例',scopeEn:'Kyushu, forcing cultivation example',file:51},
 cabbage:{id:'cabbage',title:'総合防除実践マニュアル・キャベツ編',scope:'群馬県・夏秋キャベツの体系例',scopeEn:'Gunma, summer/autumn cabbage example',file:47},
 negi:{id:'negi',title:'総合防除実践マニュアル・ネギ編',scope:'関東地域・秋冬どり根深ネギの体系例',scopeEn:'Kanto, autumn/winter long onion example',file:48},
 cucumber:{id:'cucumber',title:'総合防除実践マニュアル・施設キュウリ編',scope:'群馬県・施設促成栽培の体系例',scopeEn:'Gunma, protected forcing cucumber example',file:49},
 eggplant:{id:'eggplant',title:'総合防除実践マニュアル・露地ナス編',scope:'関東地域・夏秋の露地ナスの体系例',scopeEn:'Kanto, summer/autumn outdoor eggplant example',file:50},
 strawberry:{id:'strawberry',title:'総合防除実践マニュアル・イチゴ編',scope:'栃木県を想定した体系例',scopeEn:'Tochigi cultivation example',file:52}
};
Object.values(SOURCES).filter(s=>s.file).forEach(s=>Object.assign(s,{publisher:'農林水産省',url:BASE+'attach/pdf/index-'+s.file+'.pdf#page=2',section:'PDF 2ページ・病害編',version:'2026年3月公表版',checked:'2026-10-22'}));
const RULES=[
 {id:'IPM-GENERAL',source:'general',crops:null,ja:'予防・発生状況の把握・複数の防除手段を組み合わせるのが総合防除の基本です。地域の発生予察情報も参考にします。',en:'IPM combines prevention, observation and suitable control methods. Consult local pest forecasting information.'},
 {id:'ROTATION-FAMILY',source:'rotation',sameFamily:true,ja:'同じ科を同じ場所で繰り返すときは、異なる科を組み込む輪作を検討する、という一般指針があります。記録だけで病害の有無や必要な休作年数は決まりません。',en:'General guidance recommends considering rotation with other families when repeating the same family in one place. Records do not establish disease or a required resting period.'},
 {id:'IPM-TOMATO',source:'tomato',crops:['tomato','cherry_tomato'],ja:'資料では健全な苗の使用、換気・風通し、適切な肥培管理を紹介しています。',en:'The manual describes healthy planting material, ventilation and appropriate crop nutrition.'},
 {id:'IPM-CABBAGE',source:'cabbage',crops:['cabbage'],ja:'資料では連作を避けること、排水対策、作業機械の洗浄などを病害別に紹介しています。',en:'The manual describes avoiding repeated cropping, drainage and cleaning equipment, with measures organized by disease.'},
 {id:'IPM-NEGI',source:'negi',crops:['negi'],ja:'資料では連作を避けること、排水対策、適正な施肥などを病害別に紹介しています。',en:'The manual describes avoiding repeated cropping, drainage and appropriate fertilization, with measures organized by disease.'},
 {id:'IPM-CUCUMBER',source:'cucumber',crops:['cucumber'],ja:'施設栽培の資料では健全な苗の使用、排水・通風の確保などを紹介しています。露地栽培への適合は別途確認が必要です。',en:'For protected cultivation, the manual describes healthy planting material, drainage and airflow. Applicability outdoors requires separate confirmation.'},
 {id:'IPM-EGGPLANT',source:'eggplant',crops:['eggplant'],ja:'露地栽培の資料では健全な苗の使用、排水・通風の確保などを紹介しています。',en:'For outdoor eggplant, the manual describes healthy planting material, drainage and airflow.'},
 {id:'IPM-STRAWBERRY',source:'strawberry',crops:['strawberry'],ja:'資料では健全な苗の使用、換気・風通し、水や泥の跳ね返りを防ぐことなどを紹介しています。',en:'The manual describes healthy planting material, ventilation and preventing water or soil splash.'}
];
const DAY=86400000;
function dateRange(v){
 const y=Number(v&&v.year),m=v&&v.month,d=v&&v.day;
 if(!Number.isInteger(y)||y<1900||y>2200)return null;
 if(m!=null&&(!Number.isInteger(m)||m<1||m>12))return null;
 if(d!=null&&(!m||!Number.isInteger(d)||d<1||d>new Date(Date.UTC(y,m,0)).getUTCDate()))return null;
 return {lo:Date.UTC(y,m?m-1:0,d||1),hi:Date.UTC(y,m?m-1:11,d||new Date(Date.UTC(y,m||12,0)).getUTCDate()),precision:d?'day':m?'month':'year'};
}
function geometryAt(b,y){if(!b)return null;const k=Object.keys(b.versions||{}).map(Number).filter(n=>n<=y).sort((a,b)=>b-a)[0];return k===undefined?b:{...b,...b.versions[k]};}
function box(g){
 if(!g||!['gx','gy','gl'].every(k=>Number.isFinite(g[k]))||g.gl<=0||!['H','V'].includes(g.orientation))return null;
 const w=g.ridgeW==null?0.46:g.ridgeW;if(!Number.isFinite(w)||w<=0)return null;
 return g.orientation==='H'?[g.gx-g.gl/2,g.gy-w/2,g.gx+g.gl/2,g.gy+w/2]:[g.gx-w/2,g.gy-g.gl/2,g.gx+w/2,g.gy+g.gl/2];
}
function overlaps(a,b){const x=box(a),y=box(b);return !!(x&&y&&x[0]<y[2]&&x[2]>y[0]&&x[1]<y[3]&&x[3]>y[1]);}
function collect({plantings={},soil=[],beds={}}){
 const records=[];
 Object.entries(plantings).forEach(([year,group])=>Object.entries(group||{}).forEach(([rid,raw])=>{
  const rec=typeof raw==='string'?{vid:raw}:raw;if(!rec)return;
  (rec.past||[]).concat(rec.vid?[rec]:[]).forEach((p,i)=>{
   if(!p||!p.vid)return;
   records.push({...p,year:Number(year),rid,key:'crop:'+year+':'+rid+':'+i,current:i===(rec.past||[]).length&&!!rec.vid,source:'crop',geometry:p.geometry||geometryAt(beds[rid],Number(year)),inferredGeometry:!p.geometry});
  });
 }));
 soil.forEach((p,i)=>{
  // Old deletion archives omitted dates. Collapse a coarser copy only when
  // exactly one retained planting in a deleted bed establishes its origin.
  const matches=records.filter(r=>r.source==='crop'&&r.year===p.year&&r.vid===p.vid&&box(p)&&JSON.stringify(box(r.geometry))===JSON.stringify(box(p)));
  const exact=matches.some(r=>(r.month||null)===(p.month||null)&&(r.day||null)===(p.day||null));
  const legacyCopy=!p.month&&!p.day&&matches.length===1&&!!(beds[matches[0].rid]||{}).deletedFrom;
  const same=exact||legacyCopy;
  if(!same&&p.vid)records.push({...p,key:'soil:'+i,source:'soil',geometry:p,inferredGeometry:false});
 });
 return records.map(r=>({...r,family:FAMILIES[r.vid]||null,date:dateRange(r)}));
}
function archiveBed({plantings={},beds={},rid}){
 return collect({plantings,beds}).filter(r=>r.rid===rid).map(r=>{
  const g=r.geometry||{};
  return {gx:g.gx,gy:g.gy,gl:g.gl,ridgeW:g.ridgeW,orientation:g.orientation,year:r.year,vid:r.vid,month:r.month||null,day:r.day||null,note:r.note||'',place:r.place||'',rid:r.rid};
 });
}
function analyze(input){
 const all=collect(input),target=input.target?{...input.target,family:FAMILIES[input.target.vid]||null,date:dateRange(input.target)}:null;
 const geom=(target&&target.geometry)||input.geometry||geometryAt(input.beds&&input.beds[input.rid],input.year);
 const missingPosition=all.filter(r=>!box(r.geometry)).length;
 const relevant=all.filter(r=>overlaps(geom,r.geometry)&&!(target&&target.key===r.key));
 const until=dateRange(input.until);
 const cutoff=until?until.hi:target&&target.date?target.date.hi:Date.UTC(input.year,11,31);
 const rows=relevant.filter(r=>!r.date||r.date.lo<=cutoff).map(r=>({...r,relation:target&&target.date&&r.date?(r.date.hi<target.date.lo?'before':'uncertain'):'uncertain'}));
 const before=rows.filter(r=>r.relation==='before');
 // Retain all potentially latest records if their date intervals overlap.
 const latestStart=before.reduce((max,r)=>Math.max(max,r.date.lo),-Infinity);
 const previous=before.filter(r=>r.date.hi>=latestStart);
 const uncertain=rows.filter(r=>r.relation==='uncertain');
 const relation=!target?'no-target':!target.family?'unknown-family':uncertain.length||previous.length>1?'ambiguous':!previous.length?'no-previous':!previous[0].family?'unknown-family':previous[0].family===target.family?'same':'different';
 const sameFamily=!!(target&&target.family&&before.some(r=>r.family===target.family));
 const endEvents=(input.journal||[]).filter(e=>e.kind==='end'&&overlaps(geom,e.geometry||geometryAt(input.beds&&input.beds[e.rid],e.year))&&(!dateRange(e)||dateRange(e).lo<=cutoff));
 // An end note is linked only when exact dates, name, location and a single last planting agree.
 const named=input.lookup||((id)=>({name:id}));
 for(const row of rows){
  row.end=null;row.durationDays=null;
  if(row.source!=='crop'||!row.date||row.date.precision!=='day')continue;
  const candidates=endEvents.filter(e=>{
   const date=dateRange(e);if(e.rid!==row.rid||!date||date.precision!=='day'||date.lo<row.date.hi||!e.name||e.name!==(named(row.vid)||{}).name)return false;
   const starts=all.filter(r=>r.rid===row.rid&&(!r.date||r.date.lo<=date.hi));
   if(starts.some(r=>!r.date||r.date.hi>date.lo))return false;
   const last=starts.reduce((max,r)=>Math.max(max,r.date.lo),-Infinity);
   const latest=starts.filter(r=>r.date.hi>=last);
   // An unversioned old bed location cannot prove where a legacy end note occurred.
   const endGeometry=e.geometry||geometryAt(input.beds&&input.beds[e.rid],e.year);
   return latest.length===1&&latest[0].key===row.key&&overlaps(row.geometry,endGeometry);
  });
  if(candidates.length===1){row.end=candidates[0];row.durationDays=(dateRange(row.end).lo-row.date.lo)/DAY;}
 }
 const rules=RULES.filter(r=>r.sameFamily?sameFamily:r.crops?!!target&&r.crops.includes(target.vid):true);
 return {target,rows:rows.sort((a,b)=>(b.date?b.date.lo:0)-(a.date?a.date.lo:0)),previous,relation,rules,sameFamily,missingPosition,positionUnknown:!box(geom),endEvents,
  hasSpecific:rules.some(r=>r.crops),inferredGeometry:rows.some(r=>r.inferredGeometry),unknownDates:rows.some(r=>!r.date||r.date.precision!=='day'),unknownEnds:rows.some(r=>!r.end)};
}
// These are source selectors, not disease models. Text matching retrieves notes only.
const PROFILES={tomato:{source:'tomatoModel',water:true,nutrition:true,cleanup:true},cherry_tomato:{source:'tomatoModel',water:true,nutrition:true,cleanup:true},eggplant:{source:'eggplant',water:true},cabbage:{source:'cabbage',water:true,nutrition:true,cleanup:true},negi:{source:'negi',water:true,nutrition:true,cleanup:true},cucumber:{source:'cucumber',water:true,nutrition:true,cleanup:true}};
const WORK_LABELS={note:'メモ',fertilizer:'肥料・堆肥',green:'緑肥の記録',greenSow:'緑肥をまいた',greenCut:'緑肥を刈った',greenMix:'緑肥を土に混ぜた',harvest:'収穫',end:'栽培終了',plant:'植付'};
function when(e){return e.year+(e.month?'/'+String(e.month).padStart(2,'0')+(e.day?'/'+String(e.day).padStart(2,'0'):'（日不明）'):'（月日不明）');}
function review(input){
 const history=analyze(input),target=history.target;
 const geom=target&&target.geometry||geometryAt(input.beds&&input.beds[input.rid],input.year);
 const requestedDate=input.asOf||{year:input.year,month:12,day:31};
 const asOf=input.planning&&target&&target.date&&dateRange(requestedDate)&&target.date.hi<dateRange(requestedDate).hi?{year:target.year,month:target.month,day:target.day}:requestedDate,limit=dateRange(asOf);
 const cutoff=limit?limit.hi:Date.UTC(input.year,11,31);
 const ledger=analyze({...input,target:null,geometry:geom,until:asOf});
 const name=id=>(input.lookup&&input.lookup(id)||{}).name||id;
 const sorted=rs=>rs.sort((a,b)=>(b.date?b.date.lo:0)-(a.date?a.date.lo:0));
 const journal=(input.journal||[]).map((e,i)=>{
  const g=e.geometry||geometryAt(input.beds&&input.beds[e.rid],e.year);
  const whole=!e.rid&&!e.geometry&&(!e.place||e.place==='畑全体');
  return {...e,key:'journal:'+i,date:dateRange(e),scope:overlaps(geom,g)?'local':whole?'whole':box(g)?'elsewhere':'unlocated',inferredGeometry:!e.geometry&&!whole};
 }).filter(e=>!e.date||e.date.lo<=cutoff);
 const local=sorted(journal.filter(e=>e.scope==='local'));
 const cropNotes=ledger.rows.filter(r=>r.note).map(r=>({...r,kind:'plant',name:name(r.vid)}));
 const notes=sorted(local.filter(e=>e.kind==='note'||e.note).concat(cropNotes));
 const drainage=notes.filter(e=>/排水|水はけ|水捌け|水たまり|冠水|ぬかるみ/.test((e.name||'')+' '+(e.note||'')));
 const green=local.filter(e=>['green','greenSow','greenCut','greenMix'].includes(e.kind));
 const fertilizer=local.filter(e=>e.kind==='fertilizer');
 const date=target&&target.date;
 const applicable=rs=>rs.filter(e=>!date||!e.date||e.date.lo<=date.hi);
 const mixes=applicable(green.filter(e=>e.kind==='greenMix'));
 const latestMixStart=mixes.reduce((v,e)=>Math.max(v,e.date?e.date.lo:-Infinity),-Infinity);
 const latestMixes=mixes.filter(e=>!e.date||e.date.hi>=latestMixStart);
 const mix=latestMixes.length===1?latestMixes[0]:null;
 const greenDays=mix&&mix.date&&mix.date.precision==='day'&&date&&date.precision==='day'&&mix.date.hi<=date.lo?(date.lo-mix.date.lo)/DAY:null;
 const currentPeriod=target&&ledger.rows.find(r=>r.key===target.key);
 const beforeCompleted=ledger.rows.filter(r=>r.end&&(!date||dateRange(r.end).hi<date.lo));
 const completed=sorted(beforeCompleted).sort((a,b)=>dateRange(b.end).hi-dateRange(a.end).hi)[0]||null;
 const predecessor=history.previous.length===1?ledger.rows.find(r=>r.key===history.previous[0].key):null;
 const gapDays=history.relation!=='ambiguous'&&predecessor&&predecessor.end&&date&&date.precision==='day'&&dateRange(predecessor.end).hi<=date.lo?(date.lo-dateRange(predecessor.end).lo)/DAY:null;
 const profile=PROFILES[target&&target.vid]||(!target&&completed?PROFILES[completed.vid]:null);
 const cards=[];
 function add(id,title,fact,action,source,evidence=[],recordKind){cards.push({id,title,fact,action,source,evidence,recordKind});}
 if(green.length){
  add('green','緑肥と次の植付けの間隔',greenDays!==null?when(mix)+'のすき込み → '+when(target)+'の'+(input.planning?'植付予定':'植付記録')+'まで '+greenDays+'日。':mix?'すき込みの記録はありますが、植付けまでの日数を一意に計算できません。':'緑肥の記録があります。対象の植付けより前のすき込み日を一意に確認できません。',
   '緑肥名・すき込み量・気温や土の状態を、資料の後作条件と照らし合わせてください。日数だけで腐熟の完了や植付けの可否は判定しません。','green',green,'greenMix');
 }
 if(drainage.length||profile&&profile.water){
  const src=profile&&profile.water?profile.source:null;
  if(src)add('water','排水の記録を次の確認につなげる',drainage.length?when(drainage[0])+'の記録に排水に関する記述があります。対策の完了・効果は未確認です。':'この範囲の記録に、排水に関する記述は見つかりません。対策をしていないという意味ではありません。',
   '資料には排水対策が挙げられています。雨の後の水の残り方や、対策後の変化を確認してメモに残しましょう。資料の地域・栽培条件への適合も確認してください。',src,drainage,'note');
 }
 if(notes.length)add('observe','過去のメモと今の様子を比べる',when(notes[0])+'のメモを含む '+notes.length+' 件が、この場所に重なります。',
  '過去に書いた変化が今も見られるか、場所と日付を添えて確認しましょう。メモの語句から病害名や発生の有無を判定することはありません。','general',notes,'note');
 else add('observe','観察の記録を残す','この場所の観察・作業メモは確認できません。異常がないことを示すものではありません。',
  '総合防除では状況の把握が出発点です。葉・株・周囲の様子について、変化があった点も、なかった点も日付付きで残すと次回に比較できます。','general',[],'note');
 if(fertilizer.length&&profile&&profile.nutrition)add('nutrition','施肥記録を見てから次の施肥を考える',when(fertilizer[0])+'を含む肥料・堆肥の記録 '+fertilizer.length+' 件があります。',
  '記録した資材名・量を確認し、資料の肥培管理と照らし合わせましょう。投入量だけでは土壌の養分量や追加施肥の必要量は分かりません。',profile.source,fertilizer,'fertilizer');
 if(history.sameFamily)add('rotation','同じ科を植えた場所を振り返る',history.rows.filter(r=>r.relation==='before'&&r.family===target.family).map(r=>when(r)+' '+name(r.vid)).join(' ／ '),
  '次作を検討するときは異なる科を組み込む選択肢も比較できます。同科の記録だけで病害の発生や必要な休作年数は決まりません。','rotation',history.rows.filter(r=>r.relation==='before'&&r.family===target.family));
 const ended=currentPeriod&&currentPeriod.end?currentPeriod:completed,cleanupProfile=ended&&PROFILES[ended.vid];
 if((input.planning||!target||currentPeriod&&currentPeriod.end)&&ended&&cleanupProfile&&cleanupProfile.cleanup)add('cleanup','栽培終了後に確認すること',name(ended.vid)+'：'+when(ended)+' → '+when(ended.end)+'（'+ended.durationDays+'日）の栽培記録があります。',
  '栽培終了の記録だけでは、片付けの完了までは分かりません。作物別資料の栽培後の項目を読み、残さや資材の片付け状況を確認してください。',cleanupProfile.source,[ended],'note');
 return {history,ledger,local,whole:journal.filter(e=>e.scope==='whole'),unlocated:journal.filter(e=>e.scope==='unlocated'),notes,drainage,green,fertilizer,greenDays,gapDays,currentPeriod,completed,cards,asOf,
  positionUnknown:!box(geom),uncertainWork:local.some(e=>!e.date||e.date.precision!=='day'||e.date.hi>cutoff||e.inferredGeometry),partialArea:ledger.rows.some(r=>JSON.stringify(box(r.geometry))!==JSON.stringify(box(geom)))};
}
const api={analyze,review,collect,archiveBed,dateRange,geometryAt,box,overlaps,when,FAMILIES,FAMILY_JA,SOURCES,RULES,WORK_LABELS,TAB_LABEL:'栽培レポート'};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HatakeboIPM=api;
})(typeof window!=='undefined'?window:globalThis);

(function () {
  const api = window.HatakeboIPM;
  function Source({
    id
  }) {
    const s = api.SOURCES[id];
    return s ? React.createElement("div", {
      className: "ipm-source"
    }, React.createElement("a", {
      href: s.url,
      target: "_blank",
      rel: "noopener noreferrer",
      referrerPolicy: "no-referrer"
    }, s.publisher, " \xB7 ", s.title), React.createElement("div", null, s.section, " \xB7 ", s.version), s.scope && React.createElement("div", null, "\u8CC7\u6599\u306E\u5BFE\u8C61\uFF1A", s.scope)) : null;
  }
  function Report({
    farm = {},
    beds = {},
    plantings = {},
    soil = [],
    rid,
    year,
    target: pending,
    lookup = id => ({
      name: id
    }),
    crops = [],
    locale,
    onRecord,
    asOf: providedDate
  }) {
    const language = String(locale || document.documentElement.lang || 'ja').toLowerCase().split(/[-_]/)[0];
    const [next, setNext] = React.useState(''),
      [date, setDate] = React.useState(''),
      [more, setMore] = React.useState(false);
    if (language !== 'ja') return null;
    const now = new Date(),
      asOf = providedDate || (year < now.getFullYear() ? {
        year,
        month: 12,
        day: 31
      } : {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      });
    const records = api.collect({
        beds,
        plantings,
        soil
      }),
      current = records.find(r => r.rid === rid && r.year === year && r.current);
    const parts = date.split('-').map(Number),
      planning = !!pending || !!next;
    const target = pending || (next ? {
      vid: next,
      year: date ? parts[0] : year,
      month: date ? parts[1] : null,
      day: date ? parts[2] : null,
      geometry: api.geometryAt(beds[rid], date ? parts[0] : year)
    } : current);
    const v = api.review({
        beds,
        plantings,
        soil,
        rid,
        year,
        target,
        journal: farm.journal || [],
        lookup,
        asOf,
        planning
      }),
      r = v.history;
    const name = id => (lookup(id) || {}).name || id,
      family = id => api.FAMILY_JA[api.FAMILIES[id]] || '科不明',
      dateText = api.when;
    const changedLocation = !planning && current && JSON.stringify(api.box(current.geometry)) !== JSON.stringify(api.box(api.geometryAt(beds[rid], year)));
    const relation = {
      same: '直前の作付け記録は同じ科です。',
      different: '直前の作付け記録は異なる科です。病害がないことの判定ではありません。',
      ambiguous: '日付や範囲の重なりにより、前作を一つに確定できません。',
      'unknown-family': '科が不明な作物があるため、科の関係は判定しません。',
      'no-previous': '前作を確定できる記録がありません。',
      'no-target': '現在の作付けは未登録です。次作を選ぶと、この場所の履歴と比較できます。'
    }[r.relation];
    function Evidence({
      items
    }) {
      return React.createElement("ul", {
        className: "ipm-evidence"
      }, items.map((e, i) => React.createElement("li", {
        key: e.key || e.id || i
      }, React.createElement("span", null, dateText(e), " \xB7 ", e.vid ? name(e.vid) : api.WORK_LABELS[e.kind] || '記録', e.name ? ' · ' + e.name : '', e.amount ? ' · ' + e.amount : ''), e.note && React.createElement("p", {
        className: "ipm-note"
      }, e.note), e.inferredGeometry && React.createElement("span", {
        className: "ipm-meta"
      }, "\u4F4D\u7F6E\u306F\u305D\u306E\u5E74\u306E\u755D\u306E\u914D\u7F6E\u304B\u3089\u53C2\u7167"))));
    }
    return React.createElement("section", {
      className: "ipm-report",
      lang: "ja",
      "aria-label": "\u683D\u57F9\u30EC\u30DD\u30FC\u30C8"
    }, React.createElement("style", null, `.ipm-report{color:#263e32;font-size:16px;line-height:1.7;overflow-wrap:anywhere;user-select:text;min-width:0}.ipm-report *{box-sizing:border-box}.ipm-report h3{font-size:19px;margin:4px 0 6px}.ipm-report h4{font-size:17px;margin:0 0 8px}.ipm-report p{margin:6px 0}.ipm-report .ipm-meta,.ipm-report .ipm-source{font-size:14px;color:#50644e}.ipm-report label{display:block;margin:12px 0}.ipm-report select,.ipm-report input{display:block;width:100%;max-width:100%;min-height:44px;font:inherit;background:#fff;color:#263e32;border:1px solid #81978a;padding:8px}.ipm-report summary{cursor:pointer;min-height:44px;padding:10px 0;font-weight:500}.ipm-report a{color:#235c46;text-decoration:underline;text-underline-offset:3px}.ipm-report a:focus-visible,.ipm-report summary:focus-visible{outline:3px solid #257350;outline-offset:3px}.ipm-report .ipm-check{margin:14px 0;padding:14px;background:#f3f5ee;border-left:3px solid #738e72}.ipm-report .ipm-fact{font-weight:500}.ipm-report .ipm-source{margin-top:10px}.ipm-report .ipm-section{border-top:1px solid #c3cdbd;margin-top:14px;padding-top:6px}.ipm-report ul{padding-left:22px}.ipm-report li{margin:8px 0}.ipm-report button{font:inherit;min-height:44px;padding:8px 12px;max-width:100%;background:#faf9f2;color:#263e32;border:1px solid #81978a;cursor:pointer}.ipm-report .ipm-note{white-space:pre-wrap}.ipm-report .ipm-evidence{margin:0}.ipm-report .ipm-history-item{padding:10px 0;border-top:1px solid #d4dacd}.ipm-report .ipm-context{margin:12px 0;padding:0 0 12px;border-bottom:1px solid #c3cdbd}.ipm-report .ipm-picker{margin-bottom:10px}`), React.createElement("h3", null, "\u683D\u57F9\u30EC\u30DD\u30FC\u30C8"), React.createElement("p", {
      className: "ipm-meta"
    }, "\u3053\u306E\u5834\u6240\u306E\u8A18\u9332\u304B\u3089\u3001\u6B21\u306B\u78BA\u8A8D\u3059\u308B\u3053\u3068\u3092\u6574\u7406\u3057\u307E\u3057\u305F\u3002"), !pending && React.createElement("details", {
      className: "ipm-picker"
    }, React.createElement("summary", null, "\u6B21\u306E\u4F5C\u7269\u3092\u691C\u8A0E\u3059\u308B"), React.createElement("label", null, "\u6BD4\u8F03\u3059\u308B\u4F5C\u7269", React.createElement("select", {
      value: next,
      onChange: e => setNext(e.target.value)
    }, React.createElement("option", {
      value: ""
    }, "\u73FE\u5728\u306E\u8A18\u9332"), crops.map(c => React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.name)))), next && React.createElement("label", null, "\u690D\u4ED8\u4E88\u5B9A\u65E5\uFF08\u4EFB\u610F\uFF09", React.createElement("input", {
      type: "date",
      min: "1900-01-01",
      max: "2200-12-31",
      value: date,
      onChange: e => setDate(e.target.value)
    })), React.createElement("p", {
      className: "ipm-meta"
    }, "\u3053\u3053\u3067\u9078\u3093\u3060\u5185\u5BB9\u306F\u683D\u57F9\u8A18\u9332\u306B\u4FDD\u5B58\u3057\u307E\u305B\u3093\u3002")), React.createElement("div", {
      className: "ipm-context",
      "aria-live": "polite"
    }, React.createElement("p", null, target ? React.createElement("strong", null, planning ? '次作の比較' : '記録している作物', "\uFF1A", name(target.vid), "\uFF08", family(target.vid), "\uFF09 \xB7 ", dateText(target)) : '現在の作付けは未登録です。'), v.currentPeriod && v.currentPeriod.end ? React.createElement("p", null, "\u683D\u57F9\u671F\u9593\uFF1A", dateText(v.currentPeriod), " \u2192 ", dateText(v.currentPeriod.end), " \xB7 ", v.currentPeriod.durationDays, "\u65E5") : target && !planning ? React.createElement("p", {
      className: "ipm-meta"
    }, "\u7D42\u4E86\u65E5\u3092\u4E00\u610F\u306B\u78BA\u8A8D\u3067\u304D\u306A\u3044\u305F\u3081\u3001\u683D\u57F9\u671F\u9593\u306F\u672A\u78BA\u5B9A\u3067\u3059\u3002") : null, !target && v.completed && React.createElement("p", null, "\u76F4\u8FD1\u306E\u7D42\u4E86\u8A18\u9332\uFF1A", name(v.completed.vid), " \xB7 ", dateText(v.completed), " \u2192 ", dateText(v.completed.end), "\uFF08", v.completed.durationDays, "\u65E5\uFF09"), v.gapDays !== null && React.createElement("p", null, "\u524D\u4F5C\u306E\u7D42\u4E86\u8A18\u9332\u304B\u3089\u3053\u306E\u690D\u4ED8\u3051\u307E\u3067\uFF1A", v.gapDays, "\u65E5\u3002\u4F11\u4F5C\u3084\u571F\u58CC\u56DE\u5FA9\u3092\u793A\u3059\u5024\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002"), React.createElement("p", {
      className: "ipm-meta"
    }, "\u4F5C\u696D\u8A18\u9332\u306E\u53C2\u7167\u65E5\uFF1A", dateText(v.asOf), "\u3002\u755D\u306E\u7BC4\u56F2\u304C\u4E00\u90E8\u3067\u3082\u91CD\u306A\u308B\u8A18\u9332\u3092\u542B\u307F\u307E\u3059\u3002"), changedLocation && React.createElement("p", null, "\u4FDD\u5B58\u3057\u305F\u4F5C\u4ED8\u3051\u306F\u690D\u4ED8\u6642\u306E\u4F4D\u7F6E\u3067\u53C2\u7167\u3057\u3066\u3044\u307E\u3059\u3002\u5F15\u304D\u76F4\u3057\u305F\u755D\u306E\u4F4D\u7F6E\u3067\u8ABF\u3079\u308B\u306B\u306F\u300C\u6B21\u306E\u4F5C\u7269\u3092\u691C\u8A0E\u3059\u308B\u300D\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002"), v.positionUnknown && React.createElement("p", null, "\u3053\u306E\u5834\u6240\u306E\u5EA7\u6A19\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002\u5834\u6240\u306B\u7D10\u3065\u304F\u78BA\u8A8D\u9805\u76EE\u306F\u4F5C\u308C\u307E\u305B\u3093\u3002")), React.createElement("h4", null, "\u8A18\u9332\u304B\u3089\u898B\u3048\u3066\u304D\u305F\u78BA\u8A8D\u70B9"), !v.positionUnknown && v.cards.slice(0, more ? v.cards.length : 3).map(c => React.createElement("article", {
      className: "ipm-check",
      key: c.id,
      "data-check": c.id
    }, React.createElement("h4", null, c.title), React.createElement("p", {
      className: "ipm-fact"
    }, c.fact), React.createElement("p", null, c.action), c.evidence.length > 0 && React.createElement("details", null, React.createElement("summary", null, "\u3053\u306E\u78BA\u8A8D\u70B9\u306E\u3082\u3068\u306B\u306A\u3063\u305F\u8A18\u9332\uFF08", c.evidence.length, "\u4EF6\uFF09"), React.createElement(Evidence, {
      items: c.evidence
    })), React.createElement("details", null, React.createElement("summary", null, "\u6839\u62E0\u3068\u9069\u7528\u6761\u4EF6"), React.createElement(Source, {
      id: c.source
    })), onRecord && c.recordKind && React.createElement("button", {
      type: "button",
      onClick: () => onRecord(c.recordKind)
    }, c.recordKind === 'note' ? '確認した様子をメモする' : c.recordKind === 'greenMix' ? 'すき込み日を記録する' : '肥料・堆肥の記録を追加する'))), !v.positionUnknown && v.cards.length > 3 && React.createElement("button", {
      type: "button",
      onClick: () => setMore(!more)
    }, more ? '確認点を折りたたむ' : '確認点をすべて見る（' + v.cards.length + '件）'), React.createElement("details", {
      className: "ipm-section"
    }, React.createElement("summary", null, "\u9023\u4F5C\u30FB\u4F5C\u4ED8\u3051\u671F\u9593\u306E\u5C65\u6B74\uFF08", v.ledger.rows.length, "\u4EF6\uFF09"), React.createElement("p", null, relation), r.previous.length > 0 && React.createElement("p", null, "\u524D\u4F5C\u5019\u88DC\uFF1A", r.previous.map(e => name(e.vid) + '（' + family(e.vid) + '・' + dateText(e) + '）').join(' ／ ')), v.ledger.rows.map(p => React.createElement("article", {
      className: "ipm-history-item",
      key: p.key
    }, React.createElement("strong", null, name(p.vid), "\uFF08", family(p.vid), "\uFF09"), React.createElement("p", null, dateText(p), " \u2192 ", p.end ? dateText(p.end) + ' 終了 · ' + p.durationDays + '日' : '終了日・期間は未確定'), React.createElement("p", {
      className: "ipm-meta"
    }, p.place || (beds[p.rid] || {}).name || '土壌履歴に残る作付け'), p.note && React.createElement("p", {
      className: "ipm-note"
    }, p.note))), !v.ledger.rows.length && React.createElement("p", null, "\u53C2\u7167\u3067\u304D\u308B\u4F5C\u4ED8\u3051\u8A18\u9332\u306F\u3042\u308A\u307E\u305B\u3093\u3002")), React.createElement("details", {
      className: "ipm-section"
    }, React.createElement("summary", null, "\u53C2\u7167\u3057\u305F\u4F5C\u696D\u30FB\u89B3\u5BDF\u30E1\u30E2\uFF08", v.local.length, "\u4EF6\uFF09"), React.createElement(Evidence, {
      items: v.local
    }), !v.local.length && React.createElement("p", null, "\u3053\u306E\u7BC4\u56F2\u306B\u7D50\u3073\u4ED8\u304F\u4F5C\u696D\u8A18\u9332\u306F\u3042\u308A\u307E\u305B\u3093\u3002"), v.whole.length > 0 && React.createElement(React.Fragment, null, React.createElement("h4", null, "\u7551\u5168\u4F53\u306E\u8A18\u9332\uFF08\u3053\u306E\u755D\u3067\u306E\u5B9F\u65BD\u306F\u672A\u78BA\u8A8D\uFF09"), React.createElement(Evidence, {
      items: v.whole
    }))), React.createElement("details", {
      className: "ipm-section"
    }, React.createElement("summary", null, "\u4F5C\u7269\u306B\u5BFE\u5FDC\u3059\u308B\u516C\u7684\u8CC7\u6599"), r.rules.filter(rule => rule.crops).map(rule => React.createElement("article", {
      key: rule.id
    }, React.createElement("p", null, rule.ja), React.createElement(Source, {
      id: rule.source
    }))), target && !r.hasSpecific && React.createElement("p", null, "\u3053\u306E\u4F5C\u7269\u5C02\u7528\u306E\u8CC7\u6599\u306F\u540C\u68B1\u4E00\u89A7\u306B\u672A\u767B\u9332\u3067\u3059\u3002\u4ED6\u306E\u4F5C\u7269\u306E\u8CC7\u6599\u3092\u4EE3\u7528\u3057\u307E\u305B\u3093\u3002"), React.createElement("p", null, React.createElement("a", {
      href: "https://www.maff.go.jp/j/syouan/syokubo/gaicyu/g_ipm/",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "\u8FB2\u6797\u6C34\u7523\u7701\u306E\u7DCF\u5408\u9632\u9664\u8CC7\u6599\u4E00\u89A7"))), React.createElement("details", {
      className: "ipm-section"
    }, React.createElement("summary", null, "\u307E\u3060\u5206\u304B\u3089\u306A\u3044\u3053\u3068"), React.createElement("ul", null, React.createElement("li", null, "\u672A\u8A18\u9332\u306F\u672A\u5B9F\u65BD\u3092\u610F\u5473\u3057\u307E\u305B\u3093\u3002\u30E1\u30E2\u306F\u539F\u6587\u306E\u8A18\u9332\u3068\u3057\u3066\u6271\u3044\u3001\u75C5\u5BB3\u8A3A\u65AD\u30FB\u767A\u751F\u78BA\u7387\u30FB\u5FC5\u8981\u306A\u4F11\u4F5C\u5E74\u6570\u306B\u306F\u5909\u63DB\u3057\u307E\u305B\u3093\u3002"), React.createElement("li", null, "\u5730\u57DF\u30FB\u9732\u5730\uFF0F\u65BD\u8A2D\u30FB\u54C1\u7A2E\u30FB\u53F0\u6728\u30FB\u571F\u58CC\u6E2C\u5B9A\u5024\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002\u8CC7\u6599\u306E\u9069\u7528\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"), React.createElement("li", null, "\u7DD1\u80A5\u3084\u65BD\u80A5\u306E\u8A18\u9332\u304B\u3089\u3001\u571F\u58CC\u306E\u56DE\u5FA9\u30FB\u8150\u719F\u5B8C\u4E86\u30FB\u990A\u5206\u91CF\u306F\u5224\u5B9A\u3057\u307E\u305B\u3093\u3002"), v.partialArea && React.createElement("li", null, "\u90E8\u5206\u7684\u306B\u91CD\u306A\u308B\u53E4\u3044\u7BC4\u56F2\u3092\u542B\u307F\u307E\u3059\u3002\u755D\u5168\u4F53\u3067\u540C\u3058\u4F5C\u696D\u3084\u683D\u57F9\u3092\u3057\u305F\u3068\u306F\u9650\u308A\u307E\u305B\u3093\u3002"), r.inferredGeometry && React.createElement("li", null, "\u4F4D\u7F6E\u306E\u306A\u3044\u53E4\u3044\u4F5C\u4ED8\u3051\u306B\u306F\u3001\u305D\u306E\u5E74\u306E\u755D\u306E\u914D\u7F6E\u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002"), (r.unknownDates || v.uncertainWork) && React.createElement("li", null, "\u65E5\u4ED8\u3084\u4F5C\u696D\u5834\u6240\u306E\u78BA\u5EA6\u304C\u4E0D\u8DB3\u3059\u308B\u8A18\u9332\u3092\u542B\u307F\u307E\u3059\u3002\u9806\u5E8F\u30FB\u671F\u9593\u30FB\u5B9F\u65BD\u7BC4\u56F2\u3092\u78BA\u5B9A\u3067\u304D\u306A\u3044\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002"), v.unlocated.length > 0 && React.createElement("li", null, "\u4F4D\u7F6E\u3092\u78BA\u8A8D\u3067\u304D\u305A\u6BD4\u8F03\u306B\u4F7F\u3048\u306A\u3044\u4F5C\u696D\u8A18\u9332\uFF1A", v.unlocated.length, "\u4EF6\u3002"), r.missingPosition > 0 && React.createElement("li", null, "\u4F4D\u7F6E\u3092\u78BA\u8A8D\u3067\u304D\u306A\u3044\u4F5C\u4ED8\u3051\u8A18\u9332\uFF1A", r.missingPosition, "\u4EF6\u3002"))), React.createElement("p", {
      className: "ipm-meta"
    }, "\u8A18\u9332\u3068\u8981\u70B9\u306F\u30AA\u30D5\u30E9\u30A4\u30F3\u3067\u8AAD\u3081\u307E\u3059\u3002\u51FA\u5178\u3092\u958B\u304F\u306B\u306F\u901A\u4FE1\u304C\u5FC5\u8981\u3067\u3059\u3002\u51FA\u5178\u78BA\u8A8D\uFF1A2026/10/23\u3002"));
  }
  api.Report = Report;
})();
