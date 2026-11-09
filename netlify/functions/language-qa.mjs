import {KY_ERROR_RULES,KY_FORBIDDEN_HEADINGS} from './ky-glossary.mjs';
/** AI Ustad G pre-export QA. Deterministic checks only; never claims linguistic perfection. */
export const LANGUAGES = Object.freeze({Kyrgyz:'ky',Russian:'ru',Turkish:'tr',English:'en'});
export const LABELS = Object.freeze({
 ky:{aims:'Сабактын максаты',objectives:'Окутуунун натыйжалары',inclusion:'Инклюзивдүү окутуу',teacher:'Мугалимдин иш-аракети',student:'Окуучулардын иш-аракети',resources:'Окуу ресурстары',evaluation:'Сабакты баалоо',activity:'Класстык иш барагы',homework:'Үй тапшырмасы',support:'Колдоочу тапшырмалар',core:'Негизги тапшырмалар',advanced:'Татаал тапшырмалар',answerKey:'Мугалим үчүн жооптор',stages:['Киришүү','Кызыктыруу','Изилдөө','Түшүндүрүү','Тереңдетүү','Баалоо','Жыйынтыктоо']},
 ru:{aims:'Цель урока',objectives:'Планируемые результаты обучения',inclusion:'Инклюзивное обучение',teacher:'Действия учителя',student:'Действия учащихся',resources:'Учебные ресурсы',evaluation:'Оценка урока',activity:'Рабочий лист для работы в классе',homework:'Домашнее задание',support:'Задания с поддержкой',core:'Основные задания',advanced:'Задания повышенной сложности',answerKey:'Ответы для учителя',stages:['Введение','Вовлечение','Исследование','Объяснение','Углубление','Оценивание','Подведение итогов']},
 tr:{aims:'Dersin amacı',objectives:'Öğrenme kazanımları',inclusion:'Kapsayıcı öğretim',teacher:'Öğretmenin etkinlikleri',student:'Öğrencilerin etkinlikleri',resources:'Öğrenme kaynakları',evaluation:'Ders değerlendirmesi',activity:'Sınıf etkinlik çalışma kâğıdı',homework:'Ev ödevi',support:'Destekleyici etkinlikler',core:'Temel etkinlikler',advanced:'İleri düzey etkinlikler',answerKey:'Öğretmen cevap anahtarı',stages:['Giriş','Dikkat çekme','Keşfetme','Açıklama','Derinleştirme','Değerlendirme','Kapanış']},
 en:{aims:'Learning aims',objectives:'Learning objectives',inclusion:'Inclusion',teacher:'Teacher activities',student:'Student activities',resources:'Learning resources',evaluation:'Lesson evaluation',activity:'Class activity sheet',homework:'Homework sheet',support:'Support worksheet',core:'Core worksheet',advanced:'Advanced worksheet',answerKey:'Teacher answer key',stages:['Introduction','Engage','Explore','Explain','Elaborate','Evaluate','Closure']}
});
// Examples from a real teacher-reviewed sample; expand only after native-speaker approval.
export const KY_TERMINOLOGY = Object.freeze([
 {incorrect:'Билүүнү баалоо',preferred:'Билүү',reason:'Bloom level confused with assessment'},
 {incorrect:'Колдонууну баалоо',preferred:'Колдонуу',reason:'Bloom level confused with assessment'},
 {incorrect:'Анализдөөнү баалоо',preferred:'Талдоо',reason:'Use a consistent cognitive-level label'},
 {incorrect:'тырмакчөлөрдүн',preferred:'тырмакчалардын',reason:'Spelling'},
 {incorrect:'маркелер',preferred:'маркерлер',reason:'Spelling'},
 {incorrect:'кайталап көргөзмө аткарышат',preferred:'көрсөтүлгөн кадамдарды кайталап, практикалык тапшырманы аткарышат',reason:'Unnatural classroom phrasing'}
]);
const textFields=new Set(['aims','resources','differentiation','assessment','teacher','student','question','answer','diagram','left','right','name','answerKey']);
function visit(value,path='',out=[]){if(typeof value==='string'){out.push({path,value});return out;}if(Array.isArray(value)){value.forEach((v,i)=>visit(v,`${path}[${i}]`,out));return out;}if(value&&typeof value==='object')for(const [k,v] of Object.entries(value)){if(k==='options'||k==='pairs'||k==='slos'||k==='stages'||k==='worksheetItems'||k==='classActivity'||k==='homework'||k==='support'||k==='core'||k==='advanced'||textFields.has(k))visit(v,path?`${path}.${k}`:k,out);}return out;}
export function checkTeachingPackage(plan,language='Kyrgyz',duration){const code=LANGUAGES[language]||language;const issues=[];const add=(severity,code,path,message,suggestion)=>issues.push({severity,code,path,message,...(suggestion?{suggestion}:{})});
 if(!LABELS[code])add('error','UNSUPPORTED_LANGUAGE','language','Unsupported language');
 if(!Array.isArray(plan?.slos)||plan.slos.length!==3)add('error','SLO_COUNT','slos','Exactly three learning outcomes required');
 if(!Array.isArray(plan?.stages)||plan.stages.length!==7)add('error','STAGE_COUNT','stages','Exactly seven stages required');
 if(Number.isFinite(duration)&&Array.isArray(plan?.stages)&&plan.stages.reduce((n,s)=>n+Number(s.minutes||0),0)!==duration)add('error','DURATION','stages','Stage minutes do not match lesson duration');
 for(const {path,value} of visit(plan)){
  if(!value.trim() && !/\.diagram$/.test(path))add('error','EMPTY_TEXT',path,'Required text is empty');
  if(code==='ky')for(const t of KY_TERMINOLOGY)if(value.toLowerCase().includes(t.incorrect.toLowerCase()))add('error','KY_TERMINOLOGY',path,t.reason,t.preferred);
  if(code==='ky'){
   for(const rule of KY_ERROR_RULES)if(value.toLocaleLowerCase('ky').includes(rule.pattern.toLocaleLowerCase('ky')))add('error','KY_CORPUS_ERROR',path,`Known ${rule.kind} issue: ${rule.pattern}`,rule.suggestion);
   for(const heading of KY_FORBIDDEN_HEADINGS)if(value.trim().toLowerCase()===heading.toLowerCase())add('error','KY_ENGLISH_HEADING',path,`Untranslated heading: ${heading}`);
  }
  if(code!=='en'&&/\b(Class Activity Sheet|Homework Sheet|Learning objectives|Lesson Evaluation|What are your students doing\?|Learning materials and resources)\b/i.test(value))add('warning','ENGLISH_TEMPLATE_TEXT',path,'English heading found in localized content');
  if(/(?:^|\s)\.\.\.(?:\s|$)|[—-]\s*\.\.\./.test(value)&&/question|classActivity|homework|support|core|advanced/.test(path))add('warning','INCOMPLETE_QUESTION',path,'Question may be incomplete');
 }
 for(const key of ['classActivity','homework','support','core','advanced']){
  const rich=plan?.worksheetItems?.[key];if(!Array.isArray(rich))continue;
  rich.forEach((q,i)=>{const path=`worksheetItems.${key}[${i}]`;
   if(!q.question?.trim())add('error','MISSING_QUESTION',path,'Question text missing');
   if(!q.answer?.trim())add('error','MISSING_ANSWER',path,'Answer key entry missing');
   if(q.type==='mcq'&&(!Array.isArray(q.options)||q.options.length!==4))add('error','MCQ_OPTIONS',path,'MCQ must have exactly four options');
   if(q.type==='matching'&&(!Array.isArray(q.pairs)||q.pairs.length<3))add('warning','MATCHING_TOO_SHORT',path,'Matching should have at least three pairs');
  });
 }
 return {status:issues.some(x=>x.severity==='error')?'blocked':issues.length?'review_required':'automated_checks_passed',issues,checksRun:['structure','duration','known Kyrgyz terminology','sample-derived Kyrgyz error corpus','untranslated English headings','English heading leakage','missing answers','MCQ option count','possible incomplete questions'],disclaimer:'Automated checks cannot guarantee grammar, semantic correctness, native fluency, or publication readiness. Native-speaker review remains required.'};
}
