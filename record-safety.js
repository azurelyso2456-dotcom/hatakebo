/* Local record validation. No network, analytics or automatic deletion. */
(function(root){
  'use strict';
  const MAX_BYTES=10*1024*1024,MAX_ITEMS=10000,MAX_NODES=500000;
  const reserved=new Set(['__proto__','prototype','constructor']);
  function fail(code){throw new Error(code||'invalid');}
  function object(v){if(!v||typeof v!=='object'||Array.isArray(v))fail();return v;}
  function list(v,max=MAX_ITEMS){if(!Array.isArray(v)||v.length>max)fail('limit');return v;}
  function text(v,max=20000){if(typeof v!=='string'||v.length>max)fail();return v;}
  function id(v){text(v,512);if(!v||reserved.has(v))fail();}
  function number(v,min,max,integer=false){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))fail();}
  function fields(v,names){names.forEach(k=>{if(v[k]!=null)text(v[k]);});}
  function date(v,required=false){
    if(required&&v.year==null)fail();
    if(v.year!=null)number(v.year,1,9999,true);
    if(v.month!=null)number(v.month,1,12,true);
    if(v.day!=null){number(v.day,1,31,true);if(!v.month)fail();const max=new Date(Date.UTC(v.year||2000,v.month,0)).getUTCDate();if(v.day>max)fail();}
  }
  function dict(v,visit){object(v);const entries=Object.entries(v);if(entries.length>MAX_ITEMS)fail('limit');entries.forEach(([k,x])=>{id(k);visit(x,k);});}
  function unique(items){const seen=new Set();items.forEach(x=>{id(x.id);if(seen.has(x.id))fail();seen.add(x.id);});}
  function dimensions(f){
    object(f);number(f.rows,1,150,true);number(f.cols,1,150,true);
    list(f.grid,150);if(f.grid.length!==f.rows)fail();
    f.grid.forEach(row=>{list(row,150);if(row.length!==f.cols||row.some(x=>![true,false,0,1].includes(x)))fail();});
    if(f.cellCm!=null)number(f.cellCm,.01,1000);
    ['widthM','heightM'].forEach(k=>{if(f[k]!=null)number(f[k],.001,1500);});
    if(f.landmarks!=null)dict(f.landmarks,(x,k)=>{object(x);if(!/^(top|bot|lft|rgt)-\d+(?:-\d+)?$|^inner-\d+-\d+$/.test(k))fail();fields(x,['id','icon','label','memo']);});
  }
  function versions(v,visit){if(v.versions!=null)dict(v.versions,(x,k)=>{if(!/^(0|\d{1,4})$/.test(k))fail();visit(x);});}
  function bed(b,partial=false){
    object(b);['gx','gy','gl'].forEach(k=>{if(!partial||b[k]!=null)number(b[k],k==='gl'?.000001:-10000,10000);});
    if(!partial||b.orientation!=null){if(!['H','V'].includes(b.orientation))fail();}
    if(b.ridgeW!=null)number(b.ridgeW,.000001,10000);
    fields(b,['name']);['id','parentRid'].forEach(k=>{if(b[k]!=null)id(b[k]);});
    ['addedFrom','deletedFrom'].forEach(k=>{if(b[k]!=null)number(b[k],1,9999,true);});
    versions(b,x=>bed(x,true));
  }
  function ridges(group){dict(group,(r,k)=>{if(/^\d{4}$/.test(k)&&r&&r.gx===undefined)dict(r,b=>bed(b));else bed(r);});}
  function crop(c,depth=0){
    if(c==null)return;if(typeof c==='string'){text(c,512);if(reserved.has(c))fail();return;}
    object(c);if(c.vid!=null)text(c.vid,512);fields(c,['note','amount','place']);date(c);
    if(c.geometry!=null)bed(c.geometry,true);
    if(c.past!=null){if(depth>0)fail();list(c.past).forEach(p=>{if(!p||typeof p!=='object')fail();crop(p,1);});}
    // Unknown crop IDs remain displayable text; prototype lookups must never supply images.
    if(c.vid&&reserved.has(c.vid))fail();
  }
  function crops(group){dict(group,c=>crop(c));}
  function farm(f){
    object(f);id(f.id);text(f.name);dimensions(f);versions(f,dimensions);
    if(f.journal!=null){list(f.journal);unique(f.journal);f.journal.forEach(e=>{
      object(e);if(!['plant','fertilizer','green','greenSow','greenCut','greenMix','harvest','end','note'].includes(e.kind))fail();
      date(e,true);fields(e,['name','amount','note','place','vid']);if(e.rid!=null)id(e.rid);if(e.geometry!=null)bed(e.geometry,true);if(e.createdAt!=null)number(e.createdAt,0,8640000000000000);
    });}
  }
  function validate(data){
    object(data);if(data.schemaVersion!==undefined&&![1,2].includes(data.schemaVersion))fail('version');
    list(data.farms,100);unique(data.farms);data.farms.forEach(farm);
    const out={schemaVersion:2,farms:data.farms,plantings:data.plantings||{},ridges:data.ridges||{},snapshots:data.snapshots||{},soil:data.soil||{}};
    for(const k of ['plantings','ridges','snapshots','soil'])if(data[k]!==undefined)object(data[k]);
    dict(out.ridges,ridges);
    dict(out.plantings,years=>dict(years,(ps,y)=>{if(!/^\d{1,4}$/.test(y)||Number(y)<1)fail();crops(ps);}));
    dict(out.snapshots,snaps=>{list(snaps);unique(snaps);snaps.forEach(s=>{
      object(s);date(s,true);if(s.ts!=null)number(s.ts,0,8640000000000000);fields(s,['note']);
      if(s.farm!=null)farm(s.farm);ridges(s.ridges||{});crops(s.plantings||{});
    });});
    dict(out.soil,records=>list(records).forEach(s=>{bed(s);date(s,true);text(s.vid,512);}));
    return out;
  }
  function parse(raw){
    if(typeof raw!=='string'||raw.length>MAX_BYTES||new TextEncoder().encode(raw).byteLength>MAX_BYTES)fail('limit');
    const data=JSON.parse(raw);let nodes=0;
    function walk(v,depth){
      if(++nodes>MAX_NODES||depth>24)fail('limit');
      if(typeof v==='string')text(v);else if(typeof v==='number'&&!Number.isFinite(v))fail();
      else if(v&&typeof v==='object'){for(const k of Object.keys(v)){if(reserved.has(k))fail();walk(v[k],depth+1);}}
    }
    walk(data,0);return {data:validate(data),rawObject:data};
  }
  const empty=()=>({schemaVersion:2,farms:[],ridges:{},plantings:{},snapshots:{},soil:{}});
  function load(storage){
    let raw=null;try{raw=storage.getItem('hatakebo_data');if(raw===null)return {data:empty(),recovery:[]};
      const p=parse(raw),recovery=[];
      if(p.rawObject.recovery!=null){list(p.rawObject.recovery,5);for(const entry of p.rawObject.recovery){try{recovery.push(validate(entry));}catch(e){/* A bad undo item must not replace a valid current record. */}}}
      return {data:p.data,recovery};
    }catch(e){return {error:true,code:e.message,raw};}
  }
  function candidates(storage){
    const found=[];function add(raw){try{const d=parse(raw).data;if(d.farms.length)found.push(d);}catch(e){}}
    try{const raw=storage.getItem('hatakebo_data');if(raw&&raw.length<=MAX_BYTES){const d=JSON.parse(raw);if(Array.isArray(d.recovery))d.recovery.slice(-5).reverse().forEach(x=>add(JSON.stringify(x)));}}catch(e){}
    try{add(storage.getItem('hatakebo_before_import'));}catch(e){}
    return found.filter((d,i,a)=>a.findIndex(v=>JSON.stringify(v)===JSON.stringify(d))===i);
  }
  function replace(storage,data,{quarantine=false}={}){
    // Validate the final serialized object too. Do not mutate React state before this succeeds.
    const next=JSON.stringify(validate(data));parse(next);
    const old=storage.getItem('hatakebo_data');
    if(old!==null){
      if(quarantine){let key='hatakebo_recovery_original_'+Date.now(),n=0;while(storage.getItem(key)!==null)key+='_'+(++n);storage.setItem(key,old);}
      else storage.setItem('hatakebo_before_import',old);
    }
    storage.setItem('hatakebo_data',next);
    return JSON.parse(next);
  }
  function readFile(file){
    return new Promise((resolve,reject)=>{if(!file||file.size>MAX_BYTES){reject(Error('limit'));return;}
      const reader=new FileReader();reader.onerror=()=>reject(Error('read'));reader.onabort=()=>reject(Error('read'));
      reader.onload=()=>{try{resolve(parse(reader.result).data);}catch(e){reject(e);}};reader.readAsText(file);
    });
  }
  root.HatakeboRecordSafety={MAX_BYTES,parse,validate,load,candidates,replace,readFile,empty};
})(typeof window==='undefined'?globalThis:window);
