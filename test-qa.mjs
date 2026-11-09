import assert from 'node:assert/strict';
import {checkTeachingPackage,LABELS,LANGUAGES} from './netlify/functions/language-qa.mjs';
for(const [name,code] of Object.entries(LANGUAGES)){
 assert.equal(LABELS[code].stages.length,7,`${name} stages`);
 for(const key of ['aims','objectives','inclusion','teacher','student','resources','evaluation','activity','homework','support','core','advanced','answerKey'])assert.ok(LABELS[code][key],`${name} missing ${key}`);
}
const plan={slos:['a','b','c'],stages:Array.from({length:7},(_,i)=>({minutes:i===6?4:6,teacher:'Teach',student:'Learn'})),worksheetItems:{classActivity:[{type:'mcq',question:'Which?',options:['A','B','C','D'],answer:'A'}]}};
assert.equal(checkTeachingPackage(plan,'English',40).status,'automated_checks_passed');
assert.equal(checkTeachingPackage({...plan,slos:['a']},'English',40).status,'blocked');
assert.equal(checkTeachingPackage({...plan,worksheetItems:{classActivity:[{type:'mcq',question:'?',options:['A'],answer:''}]}},'English',40).status,'blocked');
assert.equal(checkTeachingPackage({...plan,aims:'тырмакчөлөрдүн'},'Kyrgyz',40).status,'blocked');
console.log('PASS: locale dictionaries, duration, structural checks, Kyrgyz terminology, missing answers and MCQ validation');
