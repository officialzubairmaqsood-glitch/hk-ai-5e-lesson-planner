import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {checkTeachingPackage,LABELS} from './netlify/functions/language-qa.mjs';
import {sheets} from './netlify/functions/worksheet-utils.mjs';
for(const lang of ['ky','ru','tr','en']){assert.equal(LABELS[lang].stages.length,7);for(const key of ['activity','homework','answerKey','teacher'])assert.ok(LABELS[lang][key]);}
assert.ok(existsSync('reference/original_two_page_lesson_template.pdf'));
assert.ok(existsSync('reference/approved_flowcharts_test.pdf'));
assert.ok(existsSync('netlify/functions/fonts/NotoSans-Regular.ttf'));
const source=readFileSync('netlify/functions/generate.mjs','utf8');assert.ok(source.includes("process.env.GEMINI_MODEL||'gemini-3.5-flash-lite'"));
assert.ok(source.includes('Independent language proofreading failed'));
assert.ok(source.includes('Reviewer damaged MCQ options'));
for(const language of ['Kyrgyz','Russian','Turkish','English']){const a=sheets({worksheetItems:{classActivity:[{type:'mcq',question:'Example?',options:['A','B','C','D'],answer:'A',marks:1}]}},{languages:[language],materials:['Class Activity Sheet']});assert.equal(a.length,1);assert.ok(a[0].title);}
const broken={slos:['a','b','c'],stages:Array.from({length:7},(_,i)=>({name:LABELS.ky.stages[i],minutes:i===0?40:0,teacher:'ok',student:'ok',resources:'ok'})),worksheetItems:{classActivity:[{type:'mcq',question:'test',options:['A','B','C','D'],answer:''}]}};assert.equal(checkTeachingPackage(broken,'Kyrgyz',40).status,'blocked');
console.log('PASS V4: locale dictionaries, original references, font asset, default model, reviewer safeguards, localized worksheet metadata, QA failure blocking');
