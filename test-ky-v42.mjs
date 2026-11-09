import assert from 'node:assert/strict';
import {checkTeachingPackage} from './netlify/functions/language-qa.mjs';
import {KY_ERROR_RULES,KY_FORBIDDEN_HEADINGS,kyrgyzEditorialGuidance} from './netlify/functions/ky-glossary.mjs';
const base={slos:['Python тилин түшүндүрөт','print() колдонушат','Өзгөрмө түзүшөт'],stages:Array.from({length:7},(_,i)=>({minutes:i===6?4:6,teacher:'Мугалим түшүндүрөт',student:'Окуучулар аткарышат'})),worksheetItems:{}};
assert.equal(checkTeachingPackage(base,'Kyrgyz',40).status,'automated_checks_passed');
for(const r of KY_ERROR_RULES){const result=checkTeachingPackage({...base,aims:`Бул мисал: ${r.pattern}.`},'Kyrgyz',40);assert.equal(result.status,'blocked',r.pattern);assert.ok(result.issues.some(i=>i.suggestion===r.suggestion),r.pattern)}
for(const h of KY_FORBIDDEN_HEADINGS){const result=checkTeachingPackage({...base,aims:`${h}`},'Kyrgyz',40);assert.equal(result.status,'blocked',h)}
assert.match(kyrgyzEditorialGuidance(),/type\(\)/);
console.log(`PASS: ${KY_ERROR_RULES.length} sample-derived error rules; ${KY_FORBIDDEN_HEADINGS.length} English heading rules; baseline clean`);
