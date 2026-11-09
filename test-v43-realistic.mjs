import {checkTeachingPackage,LABELS} from './netlify/functions/language-qa.mjs';
import {sheets} from './netlify/functions/worksheet-utils.mjs';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const labels=['ky','ru','tr','en'];
for(const l of labels){assert.equal(LABELS[l].stages.length,7);for(const key of ['activity','homework','support','core','advanced'])assert(LABELS[l][key].length>4)}
const types=['mcq','mcq','mcq','mcq','mcq','define','define','explain','explain','matching','critical','critical','think','diagram','practical'];
const make=(type,i)=>({type,question:`Кыргыз тилинде тапшырма ${i+1}?`,answer:'Жооп',options:type==='mcq'?['Бир','Эки','Үч','Төрт']:[],pairs:type==='matching'?[1,2,3,4].map(n=>({left:`Сол ${n}`,right:`Оң ${n}`})):[],diagram:'',marks:2});
const plan={slos:['Бир','Эки','Үч'],stages:LABELS.ky.stages.map((name,i)=>({name,minutes:i===0?4:6,teacher:'Мугалим түшүндүрөт',student:'Окуучулар аткарышат',resources:'Такта'})),worksheetItems:{classActivity:types.map(make),homework:Array.from({length:6},(_,i)=>make('short',i)),support:[make('short',1)],core:[make('short',2)],advanced:[make('short',3)]}};
assert.equal(plan.stages.reduce((a,b)=>a+b.minutes,0),40);
let result=checkTeachingPackage(plan,'Kyrgyz',40);assert.equal(result.status,'automated_checks_passed',JSON.stringify(result.issues));
for(const phrase of ['өз алдынча иштөө аткарат','Кемсүү','күнүмдүк дневникке','Type() функциясы','Learning objectives']){let altered=structuredClone(plan);altered.aims=phrase;let check=checkTeachingPackage(altered,'Kyrgyz',40);assert.equal(check.status,'blocked',phrase)}
const b={languages:['Kyrgyz'],materials:['Class Activity Sheet','Homework Sheet (2 A4 pages)','SUPPORT WORKSHEET','CORE WORKSHEET','ADVANCED WORKSHEET']};const selected=sheets(plan,b);assert.equal(selected.length,5);assert(selected.every(x=>!/(worksheet|sheet|homework)/i.test(x.title)));assert.equal(selected[0].questions.length,15);
const gen=readFileSync(new URL('./netlify/functions/generate.mjs',import.meta.url),'utf8');assert(gen.includes('Independent language proofreading failed'));assert(gen.includes('quality errors that must be corrected'));
console.log('PASS: 4 locales, 15-item fixture, 5 localized worksheet titles, 5 Kyrgyz known-error rejection cases, generation blocking');
console.log('UNTESTED: actual Gemini requests, PDF/DOCX/PPTX rendering, native-speaker correctness');
