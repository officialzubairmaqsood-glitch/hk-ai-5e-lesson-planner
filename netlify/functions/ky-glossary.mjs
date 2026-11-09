/** Provisional Kyrgyz educational glossary. Requires native-teacher sign-off. */
export const KY_APPROVED_TERMS = Object.freeze({
  'teacher name':'Мугалимдин аты-жөнү', 'school name':'Мектептин аталышы',
  'learning objectives':'Окутуунун натыйжалары','learning aims':'Сабактын жалпы максаты',
  'worksheet':'Иш баракчасы','homework':'Үй тапшырмасы',
  'variable':'өзгөрмө','algorithm':'алгоритм','programming':'программалоо',
  'input':'киргизүү','output':'чыгаруу','loop':'цикл',
  'conditional statement':'шарттуу оператор','syntax error':'синтаксистик ката',
  'subtraction':'кемитүү','expression':'туюнтма','student':'окуучу'
});
// Exact or boundary-based phrases observed in teacher-submitted samples.
// These are detection rules, not global find-and-replace operations.
export const KY_ERROR_RULES = Object.freeze([
  {pattern:'өз алдынча иштөө аткарат',suggestion:'тапшырмаларды өз алдынча аткарышат',kind:'grammar'},
  {pattern:'программалоо кайда колдонулаары',suggestion:'программалоо кайсы тармактарда колдонулары',kind:'style'},
  {pattern:'көрсөткөн аракеттерди кайталайт',suggestion:'көрсөткөн кадамдарды кайталашат',kind:'style'},
  {pattern:'күнүмдүк дневникке',suggestion:'күндөлүккө',kind:'vocabulary'},
  {pattern:'Кемсүү',suggestion:'Кемитүү',kind:'terminology'},
  {pattern:'a % b мисалынын жообу',suggestion:'a % b туюнтмасынын мааниси',kind:'mathematical terminology'},
  {pattern:'Атыңызды сактаган өзгөрмө',suggestion:'Атыңарды сактоочу өзгөрмө',kind:'style'},
  {pattern:'Type() функциясы',suggestion:'type() функциясы',kind:'Python syntax'},
  {pattern:'тырмакчөлөрдүн',suggestion:'тырмакчалардын',kind:'spelling'},
  {pattern:'маркелер',suggestion:'маркерлер',kind:'spelling'},
  {pattern:'кайталап көргөзмө аткарышат',suggestion:'көрсөтүлгөн кадамдарды кайталап, практикалык тапшырманы аткарышат',kind:'style'},
  {pattern:'Билүүнү баалоо',suggestion:'Билүү',kind:'Bloom taxonomy'},
  {pattern:'Колдонууну баалоо',suggestion:'Колдонуу',kind:'Bloom taxonomy'},
  {pattern:'Анализдөөнү баалоо',suggestion:'Талдоо',kind:'Bloom taxonomy'}
]);
export const KY_FORBIDDEN_HEADINGS = Object.freeze([
 'Your AI-generated teaching package','Session title','Learner group','Learning aims',
 'Learning objectives','What should learners know or do?','Inclusion',
 'What are you doing?','What are your students doing?',
 'Learning materials and resources','Lesson Evaluation','Class Activity Sheet',
 'Homework Sheet','Support Worksheet','Core Worksheet','Advanced Worksheet',
 'Teacher:','Student:','Page 1 of 2','Page 2 of 2'
]);
export function kyrgyzEditorialGuidance(){
 return `Use formal, natural Kyrgyz. Do not translate Python code, keywords or proper names.\n`+
 `Mandatory terminology: ${JSON.stringify(KY_APPROVED_TERMS)}.\n`+
 `Never use these known incorrect expressions; use the suggested alternatives: ${JSON.stringify(KY_ERROR_RULES.map(({pattern,suggestion})=>({pattern,suggestion})))}.\n`+
 `Never emit English template headings: ${KY_FORBIDDEN_HEADINGS.join('; ')}.\n`+
 `Use clear, consistent plural forms of address and natural classroom instructions.\n`+
 `Verify each Python built-in's exact lowercase spelling, especially print(), input(), type().`;
}
