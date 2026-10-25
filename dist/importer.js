/* Reads local roster files; no file contents are sent until teacher confirms. */
(function(root){
  'use strict';
  const MAX_ROWS=500,MAX_BYTES=5*1024*1024,MAX_XML=8*1024*1024;
  function normalize(s){return String(s??'').normalize('NFKC').trim().toLowerCase().replace(/[\u064B-\u065F\u0670\u0640\s_\-()/]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');}
  function parseCSV(text){
    text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/,1)[0];const delimiter=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(quoted||!field){quoted=!quoted;}else field+=c;}
      else if(c===delimiter&&!quoted){row.push(field);field='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);rows.push(row);row=[];field='';if(rows.length>MAX_ROWS+30)throw new Error('الحد الأعلى ٥٠٠ طالبة في كل ملف. قسّمي الملف إلى مجموعات أصغر.');}
      else field+=c;
    }
    if(quoted)throw new Error('ملف CSV يحتوي على علامة اقتباس غير مغلقة. أعيدي حفظه من Excel بصيغة CSV UTF-8.');
    if(field||row.length){row.push(field);rows.push(row);}return rows;
  }
  function xml(text){if(text.length>MAX_XML)throw new Error('محتوى الملف كبير جدًا. استخدمي ملف أسماء بسيطًا.');const doc=new DOMParser().parseFromString(text,'application/xml');if(doc.querySelector('parsererror'))throw new Error('تعذّر قراءة بنية ملف Excel. أعيدي حفظه بصيغة xlsx.');return doc;}
  const elements=(el,name)=>Array.from(el.getElementsByTagNameNS('*',name));
  async function readXlsx(file){
    if(!root.JSZip)throw new Error('تعذّر تحميل قارئ الإكسل. حدّثي الصفحة وحاولي مجددًا.');
    let zip;try{zip=await root.JSZip.loadAsync(await file.arrayBuffer());}catch{throw new Error('هذا الملف تالف أو محمي بكلمة مرور. استخدمي نسخة xlsx غير محمية.');}
    if(Object.keys(zip.files).length>1000)throw new Error('الملف معقّد جدًا. انسخي عمودي الاسم والفصل إلى القالب الجاهز.');
    async function part(name,required=true){const f=zip.file(name);if(!f){if(required)throw new Error('ملف Excel غير مكتمل أو غير مدعوم.');return null;}if(f._data?.uncompressedSize>MAX_XML)throw new Error('محتوى الملف كبير جدًا. استخدمي ملف أسماء بسيطًا.');return xml(await f.async('string'));}
    const [workbook,rels,shared]=await Promise.all([part('xl/workbook.xml'),part('xl/_rels/workbook.xml.rels'),part('xl/sharedStrings.xml',false)]);
    const strings=shared?elements(shared,'si').map(si=>elements(si,'t').map(t=>t.textContent).join('')):[];
    const links=new Map(elements(rels,'Relationship').filter(r=>r.getAttribute('TargetMode')!=='External').map(r=>[r.getAttribute('Id'),r.getAttribute('Target')]));
    const sheets=[];
    for(const s of elements(workbook,'sheet')){
      if(s.getAttribute('state')==='hidden'||s.getAttribute('state')==='veryHidden')continue;
      const rel=s.getAttribute('r:id')||s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');const target=links.get(rel);if(!target)continue;
      const path=target.startsWith('/')?target.slice(1):new URL(target,'https://xlsx.local/xl/').pathname.slice(1);
      const doc=await part(path);const result=[];const sheetRows=elements(doc,'row');if(sheetRows.length>MAX_ROWS+30)throw new Error('الحد الأعلى ٥٠٠ طالبة في كل ملف. احذفي الصفوف الزائدة أو قسّمي الملف.');
      for(const r of sheetRows){const values=[];for(const c of elements(r,'c')){const ref=c.getAttribute('r')||'';const letters=ref.match(/^[A-Z]+/i)?.[0]||'A';let index=0;for(const x of letters.toUpperCase())index=index*26+x.charCodeAt(0)-64;index--;if(index>100)throw new Error('الملف يحتوي أعمدة كثيرة. استخدمي قالب الاسم والفصل.');
        const type=c.getAttribute('t'),v=elements(c,'v')[0]?.textContent||'';let value=type==='s'?(strings[Number(v)]||''):type==='inlineStr'?elements(c,'t').map(t=>t.textContent).join(''):v;
        if(elements(c,'f').length)value='';values[index]=value;
      }result.push(values);}sheets.push({name:s.getAttribute('name')||'ورقة',rows:result});
    }
    if(!sheets.length)throw new Error('لا توجد ورقة ظاهرة تحتوي بيانات.');return sheets;
  }
  async function readFile(file){
    if(file.size>MAX_BYTES)throw new Error('الحد الأعلى لحجم الملف ٥ ميجابايت.');
    if(/\.xlsx$/i.test(file.name))return readXlsx(file);
    if(/\.csv$/i.test(file.name))return [{name:'الطالبات',rows:parseCSV(await file.text())}];
    throw new Error('اختاري ملف Excel بصيغة xlsx أو CSV UTF-8. للملفات القديمة xls استخدمي «حفظ باسم xlsx».');
  }
  const aliases={name:['اسم الطالبة','اسم الطالب','الاسم','اسم الطالبة الكامل','اسم الطالبة الأول','first name','student name','name'],grade:['الفصل','الصف','الصف والشعبة','الشعبة','الصف الدراسي','class','grade'],father:['اسم الأب','الاب','اسم الاب','father name']};
  function findHeader(rows){for(let i=0;i<Math.min(rows.length,20);i++){const h=rows[i].map(normalize),m={};for(const [key,names] of Object.entries(aliases))m[key]=h.findIndex(c=>names.some(n=>normalize(n)===c));if(m.name>=0&&m.grade>=0)return {index:i,...m};}return null;}
  function key(r){return [r.first_name,r.father_name||'',r.grade].map(normalize).join('|');}
  function prepare(rows,existing=[]){
    const header=findHeader(rows);if(!header)throw new Error('نحتاج في أول صف عنوانَي «اسم الطالبة» و«الفصل». حمّلي القالب الجاهز أو عدّلي عناوين ملفكِ.');
    const data=rows.slice(header.index+1),valid=[],issues=[];const seen=new Set(existing.map(key));let duplicate=0,blank=0;
    if(data.filter(r=>r.some(v=>String(v??'').trim())).length>MAX_ROWS)throw new Error('الحد الأعلى ٥٠٠ طالبة في كل استيراد.');
    data.forEach((r,i)=>{if(!r.some(v=>String(v??'').trim())){blank++;return;}const item={first_name:String(r[header.name]??'').trim(),grade:String(r[header.grade]??'').trim(),father_name:header.father<0?'':String(r[header.father]??'').trim()};const line=header.index+i+2;
      if(!item.first_name||!item.grade){issues.push({line,reason:'الاسم أو الفصل غير مكتمل'});return;}
      if(item.first_name.length>50||item.grade.length>60||item.father_name.length>80){issues.push({line,reason:'الاسم أو الفصل أطول من المساحة المتاحة'});return;}
      if([item.first_name,item.grade,item.father_name].some(v=>/^[=+@]/.test(v))){issues.push({line,reason:'استخدمي أسماء وفصولًا مكتوبة كنصوص'});return;}
      const k=key(item);if(seen.has(k)){duplicate++;return;}seen.add(k);valid.push(item);
    });
    return {valid,issues,duplicate,blank};
  }
  root.LetterImport={readFile,parseCSV,findHeader,prepare,key};
  if(typeof module!=='undefined')module.exports=root.LetterImport;
})(typeof window!=='undefined'?window:globalThis);
