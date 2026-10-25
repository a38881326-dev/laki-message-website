(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const config = window.LETTER_CONFIG || {};
  const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.supabaseUrl || '') && !!config.supabasePublishableKey;
  const templates = [
    {theme:'confidence',text:'فيكِ أشياء جميلة لا تشبه أحدًا.\nامنحي نفسكِ فرصة، وارفعي يدكِ، وقولي فكرتكِ… صوتكِ يستحق أن يُسمع، ومحاولتكِ تستحق أن تُقدَّر.'},
    {theme:'confidence',text:'ليس عليكِ أن تعرفي كل الإجابات كي تكوني رائعة.\nيكفي أن تسألي، وتتعلمي، وتمنحي نفسكِ وقتًا. ثقي بخطواتكِ الصغيرة؛ فهي تأخذكِ إلى أماكن جميلة.'},
    {theme:'confidence',text:'لا تقارني زهرتكِ بزهرة أخرى؛ لكل واحدة وقتها ولونها وجمالها.\nتعلّمي بطريقتكِ، واحتفلي بتقدّمكِ، وتذكّري أن لكِ مكانًا جميلًا بيننا.'},
    {theme:'confidence',text:'فكرتكِ تستحق المحاولة، حتى لو قلتِها بصوت خافت.\nخذي نفسًا، وابدئي بما تعرفين. كل مرة تشاركين فيها، تمنحين ثقتكِ فرصة لتكبر.'},
    {theme:'confidence',text:'لا تدعي سؤالًا صعبًا يجعلكِ تنسين كل ما تعلّمتِه.\nتوقفي قليلًا، وجرّبي طريقة أخرى، واطلبي المساعدة إن احتجتِها. أنتِ تتعلمين، وهذا شيء يستحق الفخر.'},
    {theme:'confidence',text:'أحب أن تمنحي نفسكِ الكلمات اللطيفة نفسها التي تمنحينها لصديقاتكِ.\nقولي لنفسكِ: أستطيع أن أتعلم، وأستطيع أن أحاول من جديد. كوني صديقةً لقلبكِ.'},
    {theme:'effort',text:'قد لا تنجح المحاولة من أول مرة، وهذا لا يُنقص منكِ شيئًا.\nكل مرة تعودين فيها للتجربة، تتعلّمين شيئًا جديدًا. أنا أشجّع خطوتكِ القادمة، مهما كانت صغيرة.'},
    {theme:'effort',text:'كل سطر تكتبينه، وكل سؤال تطرحينه، وكل محاولة تبدئينها… خطوة لها قيمة.\nلا تستصغري جهدكِ؛ الأشياء الجميلة تكبر قليلًا قليلًا.'},
    {theme:'effort',text:'الخطأ ليس نهاية الطريق، بل إشارة تساعدنا على التعلّم.\nخذي منه فكرة، وعدّلي خطوتكِ، ثم حاولي مرة أخرى. لكِ مساحة آمنة لتجربي وتتعلمي.'},
    {theme:'effort',text:'إذا بدا الدرس كبيرًا، قسّميه إلى خطوات صغيرة.\nابدئي بسؤال واحد، ثم خذي استراحة قصيرة، وعودي. التقدّم الهادئ تقدّم أيضًا، وجهدكِ يستحق التقدير.'},
    {theme:'effort',text:'أحيانًا يكون الإنجاز أن نحاول رغم التردد، أو نسأل عندما لا نفهم.\nامنحي نفسكِ التقدير على هذه الخطوات؛ منها تبدأ حكايات التعلّم الجميلة.'},
    {theme:'effort',text:'لا تحتاجين إلى خطوة كبيرة كل يوم.\nقليل من التركيز، ومحاولة صادقة، وسؤال عند الحاجة… هكذا تبنين تعلّمكِ يومًا بعد يوم. استمري برفق.'},
    {theme:'hope',text:'كل صباح يمنحكِ صفحة جديدة.\nلا تحملي تعثّر الأمس إلى يومكِ كله؛ اختاري خطوة ممكنة، وابدئي بها. هناك دائمًا فرصة لتتعلمي شيئًا جديدًا.'},
    {theme:'hope',text:'إذا كان اليوم متعبًا، فكوني رفيقةً بنفسكِ.\nخذي وقتكِ، واطلبي الدعم، وتذكّري أن يومًا صعبًا لا يصفكِ ولا يحدّد ما تستطيعين تعلّمه.'},
    {theme:'hope',text:'ما لا تفهمينه اليوم قد يصبح أوضح غدًا.\nامنحي عقلكِ وقتًا، وامنحي نفسكِ فرصة أخرى. التعلّم رحلة، ومن الجميل أن نمشيها خطوة خطوة.'},
    {theme:'hope',text:'ليس مطلوبًا أن يكون يومكِ كاملًا حتى يكون فيه شيء جميل.\nابحثي عن فكرة فهمتِها، أو محاولة بدأتِها، أو لحظة لطيفة. للأشياء الصغيرة ضوء يستحق أن نراه.'},
    {theme:'hope',text:'يمكنكِ أن تبدئي من جديد، حتى في منتصف اليوم.\nرتّبي أفكاركِ، وخذي نفسًا هادئًا، واختاري أول خطوة. البداية الجديدة لا تحتاج إلا فرصة تمنحينها لنفسكِ.'},
    {theme:'hope',text:'ضعي لنفسكِ هدفًا صغيرًا يمكنكِ الوصول إليه اليوم.\nوحين تصلين، توقفي لحظة وابتسمي. الفرح بالتقدّم يمنحنا طاقة للخطوة التي تليه.'},
    {theme:'kindness',text:'الكلمة اللطيفة قد تجعل يوم شخص آخر أجمل.\nابتسامة، أو مساعدة، أو إنصات لصديقة… تفاصيل صغيرة تصنع أثرًا دافئًا. للطفكِ قيمة.'},
    {theme:'kindness',text:'في الفصل مكان لكل فكرة، ولكل سؤال، ولكل طالبة.\nوجودكِ مهم، واحترامكِ لنفسكِ ولمن حولكِ يجعل هذا المكان أدفأ وأجمل.'},
    {theme:'kindness',text:'أن تنجحي جميل، وأن تفرحي لنجاح صديقتكِ جميل أيضًا.\nفي قلوبنا متّسع للفرح بالجميع. شاركي لطفكِ، واحتفظي لنفسكِ بنصيب منه.'},
    {theme:'kindness',text:'حين تساعدين صديقة على فهم فكرة، تتعلمان معًا.\nوحين تطلبين المساعدة، تمنحين غيركِ فرصة ليكون لطيفًا. التعلّم أجمل عندما نتشارك الطريق.'},
    {theme:'kindness',text:'قد يكون أجمل ما تقدّمينه اليوم كلمة تشجيع.\nقوليها لصديقة، وقوليها لنفسكِ أيضًا. الكلمات الطيبة بذور، ومن الجميل أن نزرعها أينما ذهبنا.'},
    {theme:'kindness',text:'تذكّري أن الاستماع هدية، والاحترام قوة، واللطف اختيار جميل.\nكوني كما تحبين أن يُعاملكِ الآخرون، واطلبي حقكِ بهدوء وثقة. أنتِ تستحقين المعاملة الطيبة.'},
    {theme:'ambition',text:'أحلامكِ ليست كبيرة عليكِ؛ أنتِ من ستكبرين لتصلي إليها.\nابدئي اليوم بخطوة واحدة، وغدًا بخطوة أخرى، وسترين كيف يقترب ما كنتِ تظنينه بعيدًا.'},
    {theme:'ambition',text:'فخورة بكِ، وبكل مرة اخترتِ فيها أن تحاولي بدل أن تستسلمي.\nهذا الإصرار الذي فيكِ سيصنع لكِ مستقبلًا جميلًا، فحافظي عليه.'},
    {theme:'ambition',text:'التميّز لا يعني ألا تخطئي أبدًا، بل أن تتعلّمي من كل خطوة.\nواصلي السؤال والبحث والتجربة؛ فالعقول المتميزة تبدأ بفضول جميل مثل فضولكِ.'},
    {theme:'ambition',text:'لديكِ قدرات قد لا ترينها بعد، لكنني أراها.\nثقي أن ما تتعلّمينه اليوم يبني امرأة قوية واثقة غدًا، تصنع أثرًا يفخر به الجميع.'},
    {theme:'ambition',text:'اجعلي هدفكِ أن تكوني أفضل من نفسكِ أمس، لا أن تشبهي أحدًا.\nكل تقدّم صغير تحققينه يستحق أن تحتفلي به، وأنا أحتفل به معكِ.'},
    {theme:'ambition',text:'النجاح ليس محطة نصل إليها مرة واحدة، بل عادة نبنيها كل يوم.\nتنظيم وقتكِ، ومراجعة دروسكِ، وسعيكِ المستمر… كلها بذور ستُزهر نجاحًا يليق بكِ.'},
    {theme:'start',text:'أهلًا بكِ في عام دراسي جديد!\nصفحاته بيضاء تنتظر ما ستكتبينه فيها من جهد وفضول وإنجاز. أنا سعيدة بأنكِ معنا، ومتحمسة لما سنتعلّمه معًا.'},
    {theme:'start',text:'بداية جديدة، وفرصة جديدة لتكوني أجمل نسخة من نفسكِ.\nضعي لنفسكِ هدفًا لهذا العام، وتذكّري أنني هنا لأساعدكِ في كل خطوة نحوه.'},
    {theme:'start',text:'مرحبًا بكِ في فصلنا!\nهنا مكان آمن لأسئلتكِ وأفكاركِ ومحاولاتكِ. لا تترددي أن تكوني أنتِ، فوجودكِ يضيف لنا شيئًا جميلًا.'},
    {theme:'start',text:'كل عام جديد يحمل في داخله مفاجآت جميلة.\nابدئيه بقلب متفائل وحقيبة مرتّبة وعزيمة صادقة، وسترين كم ستكبرين وتتعلّمين.'},
    {theme:'exams',text:'أنتِ مستعدة أكثر مما تظنين.\nخذي نفسًا عميقًا، واقرئي السؤال بهدوء، وابدئي بما تعرفين. كل ما ذاكرتِه حاضر معكِ، وأنا أثق بكِ.'},
    {theme:'exams',text:'الاختبار ليس مقياسًا لقيمتكِ، بل فرصة لتُري نفسكِ ما تعلّمتِه.\nنامي جيدًا، وتناولي فطوركِ، وادخلي القاعة بثقة. بالتوفيق يا جميلة ♡'},
    {theme:'exams',text:'إذا شعرتِ بالتوتر، فهذا يعني أنكِ تهتمين.\nحوّلي هذا الاهتمام إلى تركيز: سؤال بعد سؤال، وخطوة بعد خطوة. أنا فخورة بجهدكِ مهما كانت النتيجة.'},
    {theme:'exams',text:'تذكّري أن تتوكلي على الله، ثم على جهدكِ ومذاكرتكِ.\nراجعي إجاباتكِ قبل التسليم، ولا تستعجلي. قلبي معكِ، وأنتظر أن أسمع أخبارًا جميلة.'},
    {theme:'end',text:'وصلنا إلى نهاية العام، وأنتِ اليوم أقوى وأذكى وأجمل مما كنتِ في أوله.\nشكرًا لكل لحظة جميلة شاركتِنا إياها. أتمنى لكِ إجازة سعيدة ومستقبلًا مشرقًا.'},
    {theme:'end',text:'مبارك لكِ ما أنجزتِه هذا العام!\nكل درس تعلّمتِه، وكل صعوبة تجاوزتِها، صارت جزءًا منكِ. افخري بنفسكِ كما أفخر بكِ.'},
    {theme:'end',text:'كان وجودكِ في فصلنا هدية جميلة.\nأتمنى أن تحملي معكِ ذكريات طيبة، وأن تبقى فيكِ روح التعلّم أينما ذهبتِ. سأشتاق إليكِ.'},
    {theme:'end',text:'إلى خريجتنا الغالية: هذه ليست نهاية، بل بداية فصل جديد من حكايتكِ.\nانطلقي بثقة، واحلمي كثيرًا، ولا تنسي أن هناك من يدعو لكِ ويفخر بكِ دائمًا.'},
    {theme:'national',text:'كل عام ووطننا الغالي بخير وعزّ ♡\nأنتِ جزء من مستقبل هذا الوطن، وكل ما تتعلّمينه اليوم يبني غدًا أجمل له ولكِ.'},
    {theme:'national',text:'في يوم الوطن، نفخر بأرض جمعتنا وبأحلام تكبر فينا.\nكوني دائمًا مصدر فخر لوطنكِ بعلمكِ وأخلاقكِ وطموحكِ. دام عزّكِ يا وطن.'},
    {theme:'national',text:'حب الوطن ليس كلمات فقط، بل عمل وإخلاص وطموح.\nاجتهادكِ في دراستكِ، واحترامكِ لمن حولكِ، هدية جميلة تقدّمينها لوطنكِ كل يوم.'},
    {theme:'national',text:'نحتفل اليوم بوطن نحبه، وبجيل مثلكِ نفخر به.\nأحلامكِ جزء من رؤية هذا الوطن، فاسعي إليها بثقة. كل عام وأنتِ ووطنكِ بألف خير.'},
    {theme:'ramadan',text:'مبارك عليكِ الشهر الكريم ♡\nأسأل الله أن يكون رمضانكِ مليئًا بالطمأنينة والفرح والإنجاز، وأن يتقبّل منكِ صالح الأعمال.'},
    {theme:'ramadan',text:'رمضان فرصة جميلة لنتعلّم الصبر واللطف والعطاء.\nاجعلي لكِ فيه هدفًا صغيرًا: صفحة تقرئينها، أو خيرًا تقدّمينه، أو عادة جميلة تبدئينها.'},
    {theme:'ramadan',text:'عيدكِ مبارك، وأيامكِ سعيدة!\nأتمنى أن تقضي العيد مع أحبّتكِ بقلب فرحان، وأن تعودي إلينا بطاقة جميلة ونشاط متجدّد.'},
    {theme:'ramadan',text:'كل عام وأنتِ بخير يا جميلة ♡\nبابتسامتكِ ولطفكِ تزيدين العيد جمالًا. تقبّل الله منكِ، وأعاده عليكِ بالخير والسعادة.'},
  ];
  // ثاني-1، ثاني / ١ and ثاني1 are the same class.
  const classKey=s=>digits(normalize(s)).replace(/[^p{L}p{N}]/gu,'');
  const occasions=['start','exams','end','national','ramadan'];
  const digits=s=>String(s??'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).trim();
  const normalize = s => String(s).normalize('NFKC').trim().toLocaleLowerCase().replace(/[\u064B-\u065F\u0670\u0640\s]/g,'').replace(/[أإآٱ]/g,'ا').replace(/[ىئ]/g,'ي').replace(/ؤ/g,'و').replace(/ء/g,'').replace(/ة/g,'ه');
  const matchesStudentName=(registered,input)=>normalize(registered)===normalize(input)||normalize(String(registered).trim().split(/\s+/)[0])===normalize(input);
  const number = n => new Intl.NumberFormat('ar-SA').format(n);
  const date = d => d ? new Intl.DateTimeFormat('ar-SA',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'Asia/Riyadh'}).format(new Date(d)) : '';
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uuid = () => {
    if(typeof crypto.randomUUID==='function')return crypto.randomUUID();
    const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
    const h=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  };
  const storage = {
    get(k,fallback){try{return JSON.parse(sessionStorage.getItem('laki-'+k)) ?? fallback;}catch{return fallback;}},
    set(k,v){try{sessionStorage.setItem('laki-'+k,JSON.stringify(v));}catch{}},
    remove(k){try{sessionStorage.removeItem('laki-'+k);}catch{}},
  };
  // The teacher stays signed in on her own phone, so the installed app opens straight to the dashboard.
  const keep = {
    get(k,fallback){try{return JSON.parse(localStorage.getItem('laki-'+k)) ?? fallback;}catch{return fallback;}},
    set(k,v){try{localStorage.setItem('laki-'+k,JSON.stringify(v));}catch{}},
    remove(k){try{localStorage.removeItem('laki-'+k);}catch{}},
  };
  let demo = false, session = keep.get('session',null), profile = null, rows = [], currentLetter = null, deleteId = null;
  let lastTemplate = -1, fetchEpoch = 0, routeEpoch = 0, toastTimer, refreshPromise = null;
  let activeGroup=null,importSheets=[],importPlan=null,importing=false;
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
  function chooseMessage(theme='all'){
    const pool=templates.map((m,i)=>({...m,index:i})).filter(m=>(theme==='all'?!occasions.includes(m.theme):m.theme===theme)&&m.index!==lastTemplate);
    const item=pool[Math.floor(Math.random()*pool.length)];lastTemplate=item.index;return item.text;
  }
  function seedRows(){const names=[['جود','أحمد','رابع / ١'],['ليان','محمد','رابع / ١'],['ريم','خالد','رابع / ٢'],['نورة','عبدالله','رابع / ٢']];return names.map((n,i)=>({id:uuid(),access_token:uuid(),first_name:n[0],father_name:n[1],grade:n[2],message:templates[i+5].text,teacher_name:'معلمتكِ',school_name:'',created_at:new Date().toISOString(),first_opened_at:null,last_opened_at:null,open_count:0,loved_at:null}));}
  async function token(){
    if(!session)throw new Error('انتهت جلسة الدخول. سجّلي الدخول من جديد.');
    if((session.expires_at||0)*1000>Date.now()+60000)return session.access_token;
    if(!refreshPromise) refreshPromise=(async()=>{const data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token},auth:false});session={...data,expires_at:Math.floor(Date.now()/1000)+data.expires_in};keep.set('session',session);return session.access_token;})().finally(()=>{refreshPromise=null;});
    return refreshPromise;
  }
  async function request(path,{method='GET',body,auth=true,headers={}}={}){
    const key=config.supabasePublishableKey;
    const bearer=auth?await token():(key?.startsWith('eyJ')?key:null);
    const response=await fetch(config.supabaseUrl.replace(/\/$/,'')+path,{method,headers:{apikey:key,'Content-Type':'application/json',...(bearer?{Authorization:'Bearer '+bearer}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(18000)});
    const text=await response.text();let data;try{data=text?JSON.parse(text):null;}catch{data=null;}
    if(!response.ok){if(response.status===401&&auth){session=null;keep.remove('session');throw new Error('انتهت جلسة الدخول. سجّلي الدخول من جديد.');}throw new Error(data?.message||data?.msg||data?.error_description||'تعذّر إتمام الطلب. حاولي مجددًا.');}return data;
  }
  function errorMessage(error){if(error.name==='TimeoutError'||error.name==='AbortError')return 'الاتصال أخذ وقتًا أطول من المعتاد. تحقّقي من الشبكة وحاولي مجددًا.';if(error instanceof TypeError)return 'تعذّر الاتصال. تحقّقي من الإنترنت وحاولي مجددًا.';return error.message||'حدث خطأ. حاولي مجددًا.';}
  function showView(view){for(const name of ['student','letter','teacher'])$('#'+name+'-view').hidden=name!==view;document.title=view==='teacher'?'مساحة المعلمة · لكِ رسالة':view==='letter'?'كلمات تُزهر · لكِ رسالة':'لكِ رسالة · كلمات تُزهر';}
  function hashParams(){return new URLSearchParams(location.hash.slice(1));}
  async function route(){
    ++routeEpoch;const hash=location.hash;document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    if(hash==='#teacher'){
      showView('teacher');if(session||demo){$('#login-panel').hidden=true;$('#dashboard').hidden=false;await loadDashboard();}else{$('#login-panel').hidden=false;$('#dashboard').hidden=true;}
    }else{
      showView('student');$('#student-error').textContent='';currentLetter=null;
      const hasLetter=!!hashParams().get('letter'),demoLetter=!!hashParams().get('demo-letter');
      $('#sample-notice').hidden=ready||hasLetter||demoLetter;
      $('#private-notice').hidden=!(ready||hasLetter||demoLetter);
      $('#code-field').hidden=true;$('#pin-field').hidden=true;$('#letter-pin').value='';
      $('#letter-code').required=false;
      $('#student-name').value='';
      if(demoLetter){$('#private-notice').textContent='تجربة محلية لرسالة تجريبية. يظهر الفتح في اللوحة داخل هذه الجلسة فقط.';}else{$('#private-notice').textContent='اكتبي اسمكِ كما سجّلته معلمتكِ لتفتحي رسالتكِ. يُسجَّل فتح الظرف لدى معلمتكِ.';}
      // A scanned QR carries her name and PIN: fill them in, drop the PIN from the address bar, and open.
      const qrName=hashParams().get('n'),qrPin=hashParams().get('pin');
      if(ready&&hasLetter&&qrName){$('#student-name').value=qrName;if(qrPin){$('#pin-field').hidden=false;$('#letter-pin').value=qrPin;}history.replaceState(null,'',location.pathname+'#letter='+encodeURIComponent(hashParams().get('letter')));setTimeout(()=>$('#open-form').requestSubmit(),400);}
    }
    window.scrollTo({top:0,behavior:'instant'});
  }
  async function loadDashboard(){
    const epoch=++fetchEpoch;$('#dashboard-error').textContent='';$('#demo-banner').hidden=!demo;
    try{
      if(demo){rows=storage.get('demoRows',null);if(!Array.isArray(rows)){rows=seedRows();storage.set('demoRows',rows);}profile={display_name:config.teacherName||'معلمتكِ',school_name:config.schoolName||''};}
      else{
        const [profiles,letters]=await Promise.all([request('/rest/v1/teacher_profiles?select=display_name,school_name&limit=1'),loadAllLetters()]);
        if(epoch!==fetchEpoch||demo)return;
        if(!profiles?.length)throw new Error('هذا الحساب غير مضاف كمعلمة بعد. أضيفي حساب المعلمة إلى قاعدة البيانات لإكمال التفعيل.');profile=profiles[0];rows=letters;
      }
      if(!$('#edit-id').value){$('#signature-name').value=profile.display_name;$('#school-name').value=profile.school_name||'';}
      renderRows();
    }catch(e){if(epoch!==fetchEpoch)return;$('#dashboard-error').textContent=errorMessage(e);if(!session&&!demo){$('#dashboard').hidden=true;$('#login-panel').hidden=false;$('#login-error').textContent=errorMessage(e);}}
  }
  async function loadAllLetters(){const all=[];for(let offset=0;;offset+=1000){const page=await request('/rest/v1/letters?select=*&order=created_at.desc,id.desc&limit=1000&offset='+offset);all.push(...page);if(page.length<1000)return all;}}
  function renderGroups(){
    const groups=new Map();for(const row of rows){const name=row.import_group||'';if(!groups.has(name))groups.set(name,[]);groups.get(name).push(row);}
    if(activeGroup!==null&&!groups.has(activeGroup))activeGroup=null;
    $('#group-cards').innerHTML=`<button class="group-card ${activeGroup===null?'active':''}" data-all="1" aria-pressed="${activeGroup===null}"><strong><span class="group-icon">✉</span>كل الطالبات</strong><span>الطالبات: ${number(rows.length)} · المفتوحة: ${number(rows.filter(r=>r.first_opened_at).length)}</span></button>`+Array.from(groups,([name,list])=>`<button class="group-card ${activeGroup===name?'active':''}" data-group="${esc(encodeURIComponent(name))}" aria-pressed="${activeGroup===name}"><strong><span class="group-icon">${name?'▦':'♡'}</span>${esc(name||'إضافة فردية')}</strong><span>الطالبات: ${number(list.length)} · المفتوحة: ${number(list.filter(r=>r.first_opened_at).length)}</span></button>`).join('');
    $('#active-group-note').textContent=activeGroup===null?'الإحصاءات لكل الطالبات':'الإحصاءات للمجموعة: '+(activeGroup||'إضافة فردية');
  }
  function renderRows(){
    renderGroups();const groupRows=activeGroup===null?rows:rows.filter(r=>(r.import_group||'')===activeGroup);
    $('#stat-total').textContent=number(groupRows.length);$('#stat-open').textContent=number(groupRows.filter(r=>r.first_opened_at).length);$('#stat-wait').textContent=number(groupRows.filter(r=>!r.first_opened_at).length);$('#stat-loved').textContent=number(groupRows.filter(r=>r.loved_at).length);
    const term=normalize($('#search').value),filter=$('#filter').value,classFilter=$('#class-filter').value;
    const visible=groupRows.filter(r=>normalize([r.first_name,r.father_name,r.grade].join(' ')).includes(term)&&(filter==='all'||filter==='opened'&&r.first_opened_at||filter==='waiting'&&!r.first_opened_at||filter==='replied'&&r.reply)&&(classFilter==='all'||classKey(r.grade)===classKey(classFilter)));
    $('#empty-state').hidden=visible.length>0;
    $('#empty-state h3').textContent=rows.length?'لا توجد رسائل مطابقة':'أول كلمة جميلة تبدأ من هنا';$('#empty-state p').textContent=rows.length?'جرّبي اسمًا آخر أو غيّري التصفية.':'أضيفي طالبة وجهّزي لها ظرفًا بمحبة.';
    $('#letters-list').innerHTML=visible.map(r=>`<article class="student-row"><span class="avatar" aria-hidden="true">${esc(r.first_name.slice(0,1))}</span><div><h3>${esc(r.first_name)} ${esc(r.father_name)}</h3><p class="row-meta">${esc(r.grade)}</p><p class="row-preview">${esc(r.message)}</p>${r.reply?`<p class="row-reply"><strong>💬 ردّها:</strong> ${esc(r.reply)}</p>`:''}<div class="row-actions"><button data-action="share" data-id="${r.id}">رابط الظرف ↗</button><button data-action="preview" data-id="${r.id}">معاينة</button>${r.pin?`<button data-action="qr" data-id="${r.id}">باركود ▦</button>`:''}<button data-action="edit" data-id="${r.id}">تعديل</button><button data-action="delete" data-id="${r.id}">حذف</button></div></div><div class="row-state"><span class="badge ${r.first_opened_at?'opened':'waiting'}">${r.first_opened_at?'♡ فُتح الظرف':'◷ بانتظار الفتح'}</span>${r.first_opened_at?`<time datetime="${esc(r.first_opened_at)}" title="وقت أول فتح بتوقيت السعودية">${date(r.first_opened_at)}</time>`:''}${r.loved_at?'<div class="love-badge">❀ أسعدتها الكلمات</div>':''}${r.pin?`<div class="pin-badge">🔒 الرمز: ${esc(r.pin)}${r.failed_pin_attempts>=10?' · مقفلة، احفظيها لفتحها':''}</div>`:''}</div></article>`).join('');
  }
  function resetComposer(){
    const signature=$('#signature-name').value,school=$('#school-name').value;$('#letter-form').reset();$('#edit-id').value='';$('#signature-name').value=signature||profile?.display_name||config.teacherName||'معلمتكِ';$('#school-name').value=school||'';$('#message').value=chooseMessage();$('#composer-heading').textContent='ظرف جديد';$('#create-letter').innerHTML='جهّزي الظرف <span>✉</span>';$('#cancel-edit').hidden=true;$('#composer-error').textContent='';
  }
  function preview(row){$('#preview-title').textContent='عزيزتي '+row.first_name+'،';$('#preview-message').textContent=row.message;$('#preview-signature').textContent=row.teacher_name;$('#preview-dialog').showModal();}
  function share(row){
    const link=new URL(location.href);link.search='';link.hash=demo?'demo-letter='+row.id:'';
    $('#share-student').textContent='إلى '+row.first_name+'، في '+row.grade;$('#share-url').value=link.href.replace(/#$/,'');
    $('#share-note').textContent=demo?'هذه معاينة محلية. جرّبي الفتح في الصفحة نفسها؛ الروابط الحقيقية تعمل بعد ربط قاعدة البيانات.':'رابط الموقع واحد لكل الطالبات. تفتحه '+row.first_name+' وتكتب اسمها لتصلها رسالتها'+(row.pin?'، ثم الرمز السري: '+row.pin+' 🔒':'.');
    $('#copy-link').textContent=demo?'جرّبي فتح الطالبة ←':'نسخ الرابط ♡';$('#copy-link').dataset.demo=demo?row.id:'';$('#share-dialog').showModal();
  }
  // The QR opens this exact letter with her name and PIN already filled in; all of it stays in the # part of the link.
  function qrLink(row){const link=new URL(location.href);link.search='';const p=new URLSearchParams({letter:row.access_token,n:row.first_name});if(row.pin)p.set('pin',row.pin);link.hash=p.toString();return link.href;}
  function qrCanvas(row){
    const qr=qrcode(0,'M');qr.addData(qrLink(row));qr.make();const n=qr.getModuleCount(),cell=Math.max(4,Math.floor(520/(n+8))),size=cell*(n+8),W=720,H=size+340;
    const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    x.fillStyle='#f4edf8';x.fillRect(0,0,W,H);x.fillStyle='#fffdfb';x.fillRect(24,24,W-48,H-48);x.strokeStyle='#d8c6e5';x.lineWidth=2;x.strokeRect(40,40,W-80,H-80);
    x.direction='rtl';x.textAlign='center';x.fillStyle='#79539a';x.font='bold 40px Amiri, serif';x.fillText('لكِ رسالة 💌',W/2,112);x.fillStyle='#412e4a';x.font='36px Amiri, serif';x.fillText(row.first_name+(row.grade?' · '+row.grade:''),W/2,168);
    const ox=(W-size)/2,oy=195;x.fillStyle='#ffffff';x.fillRect(ox,oy,size,size);x.fillStyle='#3d2650';for(let r=0;r<n;r++)for(let col=0;col<n;col++)if(qr.isDark(r,col))x.fillRect(ox+(col+4)*cell,oy+(r+4)*cell,cell,cell);
    x.fillStyle='#8a7694';x.font='22px Tahoma';x.fillText('امسحي الرمز بكاميرا جوالكِ لتفتحي رسالتكِ',W/2,oy+size+52);x.fillText('هذا الرمز خاص بكِ، فلا تشاركيه',W/2,oy+size+88);return c;
  }
  let qrRow=null;
  async function showQr(row){await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1500))]);qrRow=row;$('#qr-name').textContent=row.first_name;$('#qr-image').src=qrCanvas(row).toDataURL('image/png');$('#qr-dialog').showModal();}
  $('#qr-download').addEventListener('click',async()=>{if(!qrRow)return;const blob=await new Promise(resolve=>qrCanvas(qrRow).toBlob(resolve,'image/png'));if(!blob)return toast('تعذّر تجهيز الصورة. حاولي مجددًا.');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='باركود-'+qrRow.first_name+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('حُفظت صورة الباركود ♡');});
  function setBusy(button,busy,label){button.disabled=busy;if(busy){button.dataset.original=button.innerHTML;button.textContent=label;}else if(button.dataset.original){button.innerHTML=button.dataset.original;delete button.dataset.original;}}
  function burst(){if(document.body.classList.contains('motion-paused')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<18;i++){const p=document.createElement('span');p.className='burst-petal';p.style.setProperty('--bx',(Math.random()-.5)*650+'px');p.style.setProperty('--by',(Math.random()-.35)*550+'px');p.style.background=['#a77cc0','#c8a7dc','#dcc6e9','#9670b5'][i%4];document.body.append(p);setTimeout(()=>p.remove(),1800);}}
  function scatterFlowers(x=innerWidth/2,y=innerHeight*.45,count=12){
    if(document.body.classList.contains('motion-paused')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    for(let i=0;i<count;i++){const f=document.createElement('span');f.className='click-flower'+(i%5===0?' heart':'');f.textContent=i%5===0?'♡':i%2?'✿':'❀';f.setAttribute('aria-hidden','true');const angle=(i/count)*Math.PI*2;const radius=70+Math.random()*110;f.style.cssText=`--fx:${x}px;--fy:${y}px;--fs:${18+Math.random()*18}px;--fc:${['#8e5eae','#b58bce','#caa3de','#a178c1','#d1b6e2'][i%5]};--fdx:${Math.cos(angle)*radius}px;--fdy:${Math.sin(angle)*radius+70}px;--fr:${Math.random()*240-120}deg`;document.body.append(f);setTimeout(()=>f.remove(),1600);}
  }
  document.addEventListener('click',e=>{if(!e.target.closest('#student-view,#letter-view'))return;const r=e.target.getBoundingClientRect();scatterFlowers(e.detail?e.clientX:r.x+r.width/2,e.detail?e.clientY:r.y+r.height/2,10);});
  $('.envelope-scene').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const r=e.currentTarget.getBoundingClientRect();scatterFlowers(r.x+r.width/2,r.y+r.height/2,16);$('#student-name').focus();}});
  $('.envelope-scene').addEventListener('click',()=>{if($('#student-name').value.trim())$('#open-form').requestSubmit();else $('#student-name').focus();});
  function displayLetter(letter,{sample=false,demoLetter=false}={}){
    currentLetter={...letter,sample,demoLetter};$('#recipient-name').textContent='عزيزتي '+letter.first_name+'،';$('#recipient-grade').textContent=letter.grade||'';$('#letter-message').textContent=letter.message;$('#letter-teacher').textContent=letter.teacher_name||'معلمتكِ';$('#letter-school').textContent=letter.school_name||'';$('#letter-status').textContent=sample?'هذه رسالة تجريبية باسمكِ؛ لم تُسجَّل زيارة لدى معلمة.':demoLetter?'تجربة محلية: سُجّل الفتح في اللوحة التجريبية لهذه الجلسة.':'فُتح ظرفكِ بمحبة. وصل إشعار الفتح إلى معلمتكِ.';
    $('#love-letter').textContent=letter.loved_at?'وصلت ابتسامتكِ ❀':'أسعدتني كلماتكِ ♡';$('#love-letter').disabled=!!letter.loved_at;
    $('#reply-text').value='';$('#reply-form').hidden=sample||!!letter.reply;$('#reply-done').hidden=!letter.reply;$('#reply-done').textContent=letter.reply?'وصل ردّكِ إلى معلمتكِ ♡':'';showView('letter');$('#letter-paper').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});burst();scatterFlowers(innerWidth/2,innerHeight*.43,20);
  }
  async function revealLetter(letter,options,epoch){
    $('.envelope-scene').classList.add('opening');
    await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?20:850));
    if(epoch===routeEpoch)displayLetter(letter,options);
    $('.envelope-scene').classList.remove('opening');
  }
  $('#open-form').addEventListener('submit',async e=>{
    e.preventDefault();const name=$('#student-name').value.trim();if(!name)return;const button=$('.open-submit');const epoch=routeEpoch;$('#student-error').textContent='';setBusy(button,true,'نفتح ظرفكِ…');
    try{
      const params=hashParams(),demoId=params.get('demo-letter'),access=params.get('letter');
      if(demoId){const demoRows=storage.get('demoRows',[]);const row=demoRows.find(r=>r.id===demoId);if(!row||!matchesStudentName(row.first_name,name))throw new Error('تأكّدي من الاسم الأول. هذا الظرف التجريبي يفتح في جلسة المعلمة نفسها فقط.');const now=new Date().toISOString();row.first_opened_at||=now;row.last_opened_at=now;row.open_count++;storage.set('demoRows',demoRows);await revealLetter(row,{demoLetter:true},epoch);}
      else if(ready){
        if(access&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(access))throw new Error('الرابط غير مكتمل. افتحي صفحة الموقع واكتبي اسمكِ.');
        const pin=digits($('#letter-pin').value);if(!$('#pin-field').hidden&&!/^[0-9]{3}$/.test(pin))throw new Error('اكتبي الرمز السري المكوّن من ٣ أرقام.');
        const result=await request('/rest/v1/rpc/open_card',{method:'POST',auth:false,body:{p_name:name,p_pin:pin||null,p_token:access||null}});if(epoch!==routeEpoch)return;
        const status=result?.status;
        if(status==='pin_required'){$('#pin-field').hidden=false;$('#letter-pin').focus();throw new Error('هذه رسالة خاصة 🔒 اكتبي الرمز السري الذي أعطتكِ إياه معلمتكِ.');}
        if(status==='wrong_pin')throw new Error('الرمز السري غير صحيح. تأكّدي منه وحاولي مجددًا.');
        if(status==='locked')throw new Error('أُغلقت هذه الرسالة بعد محاولات كثيرة. تواصلي مع معلمتكِ.');
        if(status==='ambiguous')throw new Error('يوجد أكثر من طالبة بهذا الاسم. اكتبي اسمكِ واسم والدكِ، مثل: سارة أحمد.');
        if(status!=='ok')throw new Error('لم نجد رسالة بهذا الاسم. اكتبي اسمكِ كما سجّلته معلمتكِ.');
        await revealLetter(result.letter,{},epoch);
      }else if(access){throw new Error('هذا الموقع لم يُربط بقاعدة البيانات بعد. الرسائل الخاصة ستعمل بعد إكمال التفعيل.');}
      else{await revealLetter({first_name:name,message:chooseMessage(),teacher_name:config.teacherName||'معلمتكِ',school_name:config.schoolName||''},{sample:true},epoch);}
    }catch(error){if(epoch===routeEpoch)$('#student-error').textContent=errorMessage(error);}finally{setBusy(button,false);}
  });
  $('#login-form').addEventListener('submit',async e=>{
    e.preventDefault();if(!ready){$('#login-error').textContent='لم يكتمل الربط بعد. استكشفي اللوحة التجريبية حتى يتم التفعيل.';return;}
    const b=$('#login-form button');setBusy(b,true,'جارٍ الدخول…');$('#login-error').textContent='';try{const data=await request('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email:$('#teacher-email').value.trim(),password:$('#teacher-password').value}});session={...data,expires_at:Math.floor(Date.now()/1000)+data.expires_in};keep.set('session',session);demo=false;$('#teacher-password').value='';await route();}catch(error){$('#login-error').textContent=errorMessage(error);}finally{setBusy(b,false);}
  });
  $('#try-dashboard')?.addEventListener('click',async()=>{demo=true;await route();});
  $('#logout').addEventListener('click',async()=>{
    const wasDemo=demo;const oldSession=session;demo=false;session=null;profile=null;rows=[];++fetchEpoch;keep.remove('session');$('#teacher-email').value='';$('#teacher-password').value='';$('#letter-form').reset();$('#edit-id').value='';resetComposer();await route();
    if(!wasDemo&&ready&&oldSession){try{await fetch(config.supabaseUrl.replace(/\/$/,'')+'/auth/v1/logout',{method:'POST',headers:{apikey:config.supabasePublishableKey,Authorization:'Bearer '+oldSession.access_token},signal:AbortSignal.timeout(8000)});}catch{}}
  });
  $('#letter-form').addEventListener('submit',async e=>{
    e.preventDefault();$('#composer-error').textContent='';const b=$('#create-letter');const editId=$('#edit-id').value;
    const item={first_name:$('#first-name').value.trim(),father_name:$('#father-name').value.trim(),grade:$('#grade').value.trim(),message:$('#message').value.trim(),teacher_name:$('#signature-name').value.trim(),school_name:$('#school-name').value.trim(),import_group:editId?(rows.find(r=>r.id===editId)?.import_group||''):(activeGroup||'')};
    if(!item.first_name||!item.grade||!item.message||!item.teacher_name){$('#composer-error').textContent='أكملي الاسم والصف والرسالة وتوقيع المعلمة.';return;}
    item.pin=digits($('#pin-set').value)||null;if(item.pin&&!/^[0-9]{3}$/.test(item.pin)){$('#composer-error').textContent='الرمز السري ٣ أرقام فقط، أو اتركيه فارغًا.';return;}if(editId)item.failed_pin_attempts=0;
    setBusy(b,true,'نجهّز الظرف…');try{
      let saved;
      if(demo){if(editId){const i=rows.findIndex(r=>r.id===editId);if(i<0)throw new Error('الرسالة لم تعد موجودة. حدّثي القائمة.');rows[i]={...rows[i],...item};saved=rows[i];}else{saved={...item,id:uuid(),access_token:uuid(),created_at:new Date().toISOString(),first_opened_at:null,last_opened_at:null,open_count:0,loved_at:null};rows.unshift(saved);}storage.set('demoRows',rows);}
      else{const data=await request('/rest/v1/letters'+(editId?'?id=eq.'+encodeURIComponent(editId):''),{method:editId?'PATCH':'POST',body:item,headers:{Prefer:'return=representation'}});if(!data?.length)throw new Error('لم تُحفظ الرسالة. تحقّقي من صلاحية الحساب ثم حدّثي القائمة.');saved=data[0];rows=editId?rows.map(r=>r.id===editId?saved:r):[saved,...rows];}
      resetComposer();renderRows();toast(editId?'حُفظت كلماتكِ الجديدة ♡':'ظرف جديد، وأثر جميل ينتظر ♡');if(!editId)share(saved);
    }catch(error){$('#composer-error').textContent=errorMessage(error);}finally{b.disabled=false;delete b.dataset.original;b.innerHTML=$('#edit-id').value?'حفظ التعديل ♡':'جهّزي الظرف <span>✉</span>';}
  });
  $('#theme').addEventListener('change',()=>{$('#message').value=chooseMessage($('#theme').value);});$('#shuffle').addEventListener('click',()=>{$('#message').value=chooseMessage($('#theme').value);});$('#cancel-edit').addEventListener('click',resetComposer);
  $('#search').addEventListener('input',renderRows);$('#class-filter').addEventListener('change',renderRows);$('#filter').addEventListener('change',renderRows);
  $('#group-cards').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;activeGroup=b.dataset.all?null:decodeURIComponent(b.dataset.group||'');renderRows();});
  $('#new-import').addEventListener('click',()=>{
    importSheets=[];importPlan=null;$('#import-form').reset();$('#import-file-name').textContent='يُقرأ الملف على جهازكِ قبل تأكيد الاستيراد.';$('#import-preview').hidden=true;$('#sheet-field').hidden=true;$('#import-error').textContent='';$('#confirm-import').disabled=true;$('#confirm-import').textContent='اختاري ملفًا للمتابعة';$('#import-signature').value=$('#signature-name').value||profile?.display_name||'معلمتكِ';$('#import-dialog').showModal();
  });
  function renderImport(){
    importPlan=null;$('#import-error').textContent='';$('#import-preview').hidden=true;$('#confirm-import').disabled=true;
    const sheet=importSheets[Number($('#import-sheet').value)||0];if(!sheet)return;
    try{
      importPlan=window.LetterImport.prepare(sheet.rows,rows);const {valid,duplicate,issues}=importPlan;
      $('#import-summary').innerHTML=`<span>♡ ${number(valid.length)} جاهزة للإضافة</span><span>${number(duplicate)} مكررة</span><span>${number(issues.length)} تحتاج تصحيحًا</span>`;
      const classes=new Map();valid.forEach(r=>classes.set(r.grade,(classes.get(r.grade)||0)+1));$('#import-class-summary').textContent=Array.from(classes,([name,count])=>name+': '+number(count)).join(' · ');
      $('#import-table-body').innerHTML=valid.slice(0,40).map(r=>`<tr><td>${esc(r.first_name)} ${esc(r.father_name)}</td><td>${esc(r.grade)}</td></tr>`).join('');
      const notes=[];if(duplicate)notes.push('تُتجاهل الأسماء المطابقة للاسم واسم الأب والفصل، في الملف أو في المجموعات السابقة.');if(issues.length)notes.push(...issues.slice(0,8).map(i=>'الصف '+number(i.line)+': '+i.reason));if(issues.length>8)notes.push('توجد صفوف أخرى تحتاج تصحيحًا.');if(valid.length>40)notes.push('المعاينة تعرض أول ٤٠ اسمًا؛ الاستيراد يشمل جميع الأسماء الجاهزة.');
      $('#import-issues').textContent=notes.join('\n');$('#import-preview').hidden=false;$('#confirm-import').disabled=!valid.length;$('#confirm-import').textContent=valid.length?'استيراد الأسماء ('+number(valid.length)+')':'لا توجد أسماء جديدة جاهزة';
    }catch(error){$('#import-error').textContent=errorMessage(error);$('#confirm-import').textContent='صحّحي الملف ثم أعيدي اختياره';}
  }
  $('#roster-file').addEventListener('change',async()=>{
    const file=$('#roster-file').files[0];if(!file)return;$('#import-error').textContent='';$('#import-preview').hidden=true;$('#confirm-import').disabled=true;$('#confirm-import').textContent='نقرأ الملف…';
    try{importSheets=await window.LetterImport.readFile(file);$('#import-file-name').textContent=file.name;$('#import-group-name').value=file.name.replace(/\.[^.]+$/,'').slice(0,80);$('#import-sheet').innerHTML=importSheets.map((s,i)=>`<option value="${i}">${esc(s.name)}</option>`).join('');$('#sheet-field').hidden=importSheets.length<2;const index=importSheets.findIndex(s=>window.LetterImport.findHeader(s.rows));$('#import-sheet').value=String(index<0?0:index);renderImport();}catch(error){importSheets=[];importPlan=null;$('#import-error').textContent=errorMessage(error);$('#confirm-import').textContent='اختاري ملفًا آخر';}
  });
  $('#import-sheet').addEventListener('change',renderImport);
  $('#import-dialog').addEventListener('cancel',e=>{if(importing)e.preventDefault();});
  $('#import-form').addEventListener('submit',async e=>{
    e.preventDefault();if(importing||!importPlan?.valid.length)return;const group=$('#import-group-name').value.trim(),signature=$('#import-signature').value.trim();if(!group||!signature){$('#import-error').textContent='أكملي اسم المجموعة وتوقيع المعلمة.';return;}
    importing=true;const button=$('#confirm-import');setBusy(button,true,'نجهّز أظرف المجموعة…');$('#import-error').textContent='';$('#import-dialog').querySelectorAll('[data-close],input,select').forEach(el=>el.disabled=true);
    try{
      if(!demo){rows=await loadAllLetters();importPlan=window.LetterImport.prepare(importSheets[Number($('#import-sheet').value)||0].rows,rows);if(!importPlan.valid.length)throw new Error('هذه الأسماء موجودة بالفعل. لم تُضف أي نسخة مكررة.');}
      const theme=$('#import-theme').value;const additions=importPlan.valid.map(r=>({...r,import_group:group,teacher_name:signature,school_name:$('#school-name').value.trim(),message:chooseMessage(theme)}));
      let saved;if(demo){saved=additions.map(r=>({...r,id:uuid(),access_token:uuid(),created_at:new Date().toISOString(),first_opened_at:null,last_opened_at:null,open_count:0,loved_at:null}));}
      else{saved=await request('/rest/v1/letters',{method:'POST',body:additions,headers:{Prefer:'return=representation'}});if(!saved||saved.length!==additions.length)throw new Error('تعذّر تأكيد العدد المحفوظ. حدّثي القائمة قبل المحاولة مجددًا.');}
      rows=[...saved,...rows];if(demo)storage.set('demoRows',rows);activeGroup=group;$('#search').value='';$('#filter').value='all';renderRows();$('#import-dialog').close();toast('استُوردت المجموعة «'+group+'» · عدد الطالبات: '+number(saved.length)+' ♡');
    }catch(error){if(!demo){try{rows=await loadAllLetters();renderRows();}catch{}}$('#import-error').textContent=errorMessage(error);}
    finally{importing=false;$('#import-dialog').querySelectorAll('[data-close],input,select').forEach(el=>el.disabled=false);setBusy(button,false);}
  });
  $('#refresh').addEventListener('click',async()=>{const b=$('#refresh');setBusy(b,true,'تحديث…');await loadDashboard();setBusy(b,false);});
  $('#letters-list').addEventListener('click',e=>{
    const b=e.target.closest('button[data-action]');if(!b)return;const r=rows.find(row=>row.id===b.dataset.id);if(!r)return;
    if(b.dataset.action==='share')share(r);if(b.dataset.action==='preview')preview(r);if(b.dataset.action==='qr')showQr(r);
    if(b.dataset.action==='delete'){deleteId=r.id;$('#delete-dialog').showModal();}
    if(b.dataset.action==='edit'){
      for(const [id,key] of [['first-name','first_name'],['father-name','father_name'],['message','message'],['signature-name','teacher_name'],['school-name','school_name'],['pin-set','pin']])$('#'+id).value=r[key]||'';
      {const g=$('#grade');if(r.grade&&![...g.options].some(o=>o.value===r.grade))g.add(new Option(r.grade,r.grade));g.value=r.grade||g.options[0].value;}$('#edit-id').value=r.id;$('#composer-heading').textContent='رتّبي كلماتكِ';$('#create-letter').textContent='حفظ التعديل ♡';$('#cancel-edit').hidden=false;$('#composer-error').textContent='';$('.composer').scrollIntoView({behavior:'smooth',block:'start'});$('#first-name').focus({preventScroll:true});
    }
  });
  $('#confirm-delete').addEventListener('click',async()=>{if(!deleteId)return;const id=deleteId,b=$('#confirm-delete');setBusy(b,true,'حذف…');try{if(!demo)await request('/rest/v1/letters?id=eq.'+encodeURIComponent(id),{method:'DELETE'});rows=rows.filter(r=>r.id!==id);if(demo)storage.set('demoRows',rows);if($('#edit-id').value===id)resetComposer();renderRows();$('#delete-dialog').close();deleteId=null;toast('حُذفت الرسالة وتوقف رابطها.');}catch(error){toast(errorMessage(error));}finally{setBusy(b,false);}});
  $('#copy-link').addEventListener('click',async()=>{
    const demoId=$('#copy-link').dataset.demo;if(demoId){$('#share-dialog').close();location.hash='demo-letter='+demoId;return;}
    try{await navigator.clipboard.writeText($('#share-url').value);toast('نُسخ الرابط. شاركيه مع صاحبته ♡');}catch{$('#share-url').focus();$('#share-url').select();toast('حدّدي الرابط وانسخيه من الحقل.');}
  });
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $('#love-letter').addEventListener('click',async()=>{
    if(!currentLetter)return;const letter=currentLetter,b=$('#love-letter');setBusy(b,true,'نرسل ابتسامتكِ…');
    try{if(letter.demoLetter){const saved=storage.get('demoRows',[]);const row=saved.find(r=>r.id===letter.id);if(row){row.loved_at=new Date().toISOString();storage.set('demoRows',saved);}}else if(!letter.sample){const result=await request('/rest/v1/rpc/love_letter',{method:'POST',auth:false,body:{p_token:letter.access_token,p_name:letter.first_name}});if(result!==true)throw new Error('تعذّر إرسال ابتسامتكِ. ربما لم يعد الرابط متاحًا.');}b.textContent='وصلت ابتسامتكِ ❀';b.disabled=true;delete b.dataset.original;toast(letter.sample?'ابتسامتكِ أجمل ختام للتجربة ❀':'وصلت ابتسامتكِ إلى معلمتكِ ❀');burst();}catch(error){setBusy(b,false);toast(errorMessage(error));}
  });
  $('#reply-form').addEventListener('submit',async e=>{
    e.preventDefault();if(!currentLetter)return;const text=$('#reply-text').value.trim();if(!text){$('#reply-text').focus();return;}const letter=currentLetter,b=$('#reply-form button');setBusy(b,true,'نرسل ردّكِ…');
    try{if(letter.demoLetter){const saved=storage.get('demoRows',[]);const row=saved.find(r=>r.id===letter.id);if(row){row.reply=text;row.replied_at=new Date().toISOString();storage.set('demoRows',saved);}}else if(!letter.sample){const result=await request('/rest/v1/rpc/reply_letter',{method:'POST',auth:false,body:{p_token:letter.access_token,p_name:letter.first_name,p_reply:text}});if(result!==true)throw new Error('تعذّر إرسال ردّكِ. ربما أرسلتِ ردًّا من قبل.');}letter.reply=text;$('#reply-form').hidden=true;$('#reply-done').hidden=false;$('#reply-done').textContent='وصل ردّكِ إلى معلمتكِ ♡';toast('وصل ردّكِ إلى معلمتكِ ♡');burst();}catch(error){toast(errorMessage(error));}finally{setBusy(b,false);}
  });
  function wrappedLines(ctx,text,maxWidth){const lines=[];for(const paragraph of text.split('\n')){if(!paragraph.trim()){lines.push('');continue;}let line='';for(const word of paragraph.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;}lines.push(line);}return lines;}
  async function downloadCard(){
    if(!currentLetter)return;const b=$('#save-card');setBusy(b,true,'نجهّز بطاقتكِ…');try{
      await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,2000))]);const l=currentLetter,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=1200;ctx.font='40px Amiri, serif';const lines=wrappedLines(ctx,l.message,940);canvas.height=Math.max(1300,750+lines.length*78);const h=canvas.height;
      ctx.fillStyle='#f4edf8';ctx.fillRect(0,0,1200,h);ctx.fillStyle='#fffdfb';ctx.fillRect(50,50,1100,h-100);ctx.strokeStyle='#d8c6e5';ctx.lineWidth=2;ctx.strokeRect(75,75,1050,h-150);ctx.direction='rtl';ctx.textAlign='center';ctx.fillStyle='#b995cc';ctx.font='72px serif';ctx.fillText('❀',600,190);ctx.fillStyle='#9a7bad';ctx.font='23px Tahoma';ctx.fillText('لكِ رسالة · كلمات تُزهر',600,255);ctx.fillStyle='#79539a';let nameSize=64;do{ctx.font=nameSize+'px Amiri, serif';if(ctx.measureText('عزيزتي '+l.first_name+'،').width<940)break;nameSize-=2;}while(nameSize>28);ctx.fillText('عزيزتي '+l.first_name+'،',600,365);ctx.fillStyle='#8a7694';ctx.font='22px Tahoma';ctx.fillText(l.grade||'',600,420);ctx.strokeStyle='#e9dfee';ctx.beginPath();ctx.moveTo(350,475);ctx.lineTo(850,475);ctx.stroke();ctx.fillStyle='#412e4a';ctx.font='40px Amiri, serif';lines.forEach((line,i)=>ctx.fillText(line,600,565+i*78));ctx.fillStyle='#9678a6';ctx.font='24px Tahoma';ctx.fillText('بكلّ محبة وفخر،',600,h-295);ctx.fillStyle='#79539a';ctx.font='39px Amiri, serif';ctx.fillText(l.teacher_name||'معلمتكِ',600,h-230);ctx.fillStyle='#9983a4';ctx.font='21px Tahoma';ctx.fillText(l.school_name||'',600,h-180);ctx.fillStyle='#cfb4e0';ctx.font='60px serif';ctx.fillText('♡',600,h-103);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('تعذّر تجهيز الصورة. حاولي مجددًا.');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='رسالتي-الجميلة.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('بطاقتكِ جاهزة للاحتفاظ بها ♡');
    }catch(error){toast(errorMessage(error));}finally{setBusy(b,false);}
  }
  $('#save-card').addEventListener('click',downloadCard);
  let paused=storage.get('paused',matchMedia('(prefers-reduced-motion: reduce)').matches);
  function motion(){document.body.classList.toggle('motion-paused',paused);$('#motion-toggle').setAttribute('aria-pressed',String(paused));$('#motion-toggle').title=paused?'تشغيل تساقط الورد':'إيقاف تساقط الورد';$('#motion-label').textContent=paused?'حركة الورد متوقفة':'الورد يتحرّك';}
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;storage.set('paused',paused);motion();});motion();
  for(let i=0;i<17;i++){const p=document.createElement('span');p.className='petal';p.style.cssText=`--x:${Math.random()*100}%;--size:${7+Math.random()*9}px;--duration:${14+Math.random()*14}s;--delay:${-Math.random()*27}s;--drift:${(Math.random()-.5)*250}px`;$('#petals').append(p);}
  $('#setup-note').hidden=ready;$('#message').value=chooseMessage();$('#signature-name').value=config.teacherName||'معلمتكِ';
  window.addEventListener('hashchange',route);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&location.hash==='#teacher'&&(session||demo))loadDashboard();});
  route();
})();
