import {PDFDocument,rgb} from 'pdf-lib';
import {unicodeFonts} from './unicode-font.mjs';
import {sheets,distribute} from './worksheet-utils.mjs';
import {LABELS,LANGUAGES} from './language-qa.mjs';
const safe=x=>String(x??'').replace(/[\u0000-\u001f]/g,' ').slice(0,3500);
const fail=(error,status=422)=>new Response(JSON.stringify({error}),{status,headers:{'content-type':'application/json'}});
export default async function(req){
 if(req.method!=='POST')return fail('Method not allowed',405);
 let v;try{v=await req.json()}catch{return fail('Invalid JSON',400)}
 const {plan:a,payload:b}=v;if(!a||!b)return fail('Missing data',400);
 try{
 const pdf=await PDFDocument.create();const {normal:font}=await unicodeFonts(pdf);const W=595.28,H=841.89,M=37,ink=rgb(.1,.2,.31),line=rgb(.7,.76,.8),dark=rgb(.11,.23,.37);
 const lang=LANGUAGES[(b.languages||[])[0]]||'en',L=LABELS[lang];
 const tx={en:['Topic','Teacher','Student name','Date','Page','marks','Answer'],ky:['Тема','Мугалим','Окуучунун аты-жөнү','Дата','Бет','упай','Жооп'],ru:['Тема','Учитель','ФИО ученика','Дата','Страница','баллов','Ответ'],tr:['Konu','Öğretmen','Öğrencinin adı soyadı','Tarih','Sayfa','puan','Cevap']}[lang];
 function wrapped(s,width,size){let out=[];for(const raw of safe(s).split('\n')){let row='';for(const word of raw.split(/\s+/)){if(!word)continue;const next=row?row+' '+word:word;if(font.widthOfTextAtSize(next,size)>width&&row){out.push(row);row=word}else row=next;}out.push(row)}return out;}
 function write(pg,s,x,y,width,size=9){const lines=wrapped(s,width,size),lh=size+4;for(const z of lines){if(y-lh<48)throw Error('Content exceeds A4 page; revise question length or layout');pg.drawText(z,{x,y,size,font,color:ink});y-=lh;}return y;}
 function rule(pg,y){pg.drawLine({start:{x:M+10,y},end:{x:W-M,y},color:line,thickness:.65});}
 function head(pg,s,i,count){pg.drawRectangle({x:M,y:H-89,width:W-2*M,height:50,color:dark});pg.drawText(s.title,{x:M+13,y:H-57,size:14,font,color:rgb(1,1,1)});let y=H-111;y=write(pg,`${b.school||''}  |  ${b.subject||''}`,M,y,W-2*M,9)-5;y=write(pg,`${tx[0]}: ${b.topic||''}`,M,y,W-2*M,9)-5;y=write(pg,`${tx[1]}: ${b.teacher||''}  |  ${b.grade||''} ${b.section||''}`,M,y,W-2*M,9)-5;y=write(pg,`${tx[2]}: _______________________   ${tx[3]}: __________`,M,y,W-2*M,9)-14;pg.drawText(`${tx[4]} ${i+1} / ${count}`,{x:W-M-92,y:30,size:8,font,color:ink});return y;}
 function question(pg,q,n,y){y=write(pg,`${n}. ${q.question}${b.worksheetMarks?' ('+q.marks+' '+tx[5]+')':''}`,M,y,W-2*M,9.2)-7;
 if(q.type==='mcq'){for(const [i,o] of (q.options||[]).entries())y=write(pg,`${'ABCD'[i]||i+1}. ${o}`,M+12,y,W-2*M-14,8.7)-3;y-=8;}
 else if(q.type==='matching'){for(const [i,z] of (q.pairs||[]).entries())y=write(pg,`${i+1}. ${z.left}          ${String.fromCharCode(65+i)}. ${z.right}`,M+12,y,W-2*M-14,8.6)-5;y-=12;}
 else if(q.type==='diagram'){if(y-100<48)throw Error('Diagram does not fit');pg.drawRectangle({x:M+30,y:y-100,width:W-2*M-60,height:95,borderColor:line});y-=113;}
 else {const lines=q.type==='practical'?3:q.type==='critical'||q.type==='think'?3:2;for(let i=0;i<lines;i++){if(y-22<48)throw Error('Answer space does not fit');rule(pg,y-19);y-=24;}y-=7;}
 return y;}
 const all=sheets(a,b);for(const s of all){
 if(!s.questions.length)throw Error('Missing questions for '+s.title);
 if(s.key==='classActivity'&&s.questions.length!==15)throw Error('Class activity must contain exactly 15 questions');
 let bins=distribute(s.questions,s.pageCount);
 // Use the exact PDF drawing functions to test every possible ordered split.
 // Never ship a worksheet with silently clipped questions or missing answer lines.
 if(s.pageCount===2){
   const fits=(list,pageIndex)=>{const probe=pdf.addPage([W,H]);let y,ok=false;try{y=head(probe,s,pageIndex,2);for(const [j,q] of list.entries())y=question(probe,q,j+1,y);ok=y>=48;}catch{}pdf.removePage(pdf.getPageCount()-1);return {ok,y:y||0};};
   let best=null;
   for(let cut=1;cut<s.questions.length;cut++){
     const left=fits(s.questions.slice(0,cut),0),right=fits(s.questions.slice(cut),1);
     if(left.ok&&right.ok){const imbalance=Math.abs(left.y-right.y);if(!best||imbalance<best.imbalance)best={cut,imbalance};}
   }
   if(!best)throw Error('The generated questions cannot fit in two A4 pages with readable text and answer space. Please shorten the questions and regenerate.');
   bins=[s.questions.slice(0,best.cut),s.questions.slice(best.cut)];
 }
 let offset=0;for(let i=0;i<bins.length;i++){const pg=pdf.addPage([W,H]);let y=head(pg,s,i,bins.length);for(const q of bins[i]){y=question(pg,q,++offset,y);}}
 }
 if(b.answers){let pg=pdf.addPage([W,H]),y=H-55;y=write(pg,L.answerKey,M,y,W-2*M,14)-18;for(const s of all){if(y<100){pg=pdf.addPage([W,H]);y=H-55;}y=write(pg,s.title,M,y,W-2*M,11)-8;for(const [i,q] of s.questions.entries()){if(y<100){pg=pdf.addPage([W,H]);y=H-55;}const answer=`${i+1}. ${q.answer||'—'}`;const needed=wrapped(answer,W-2*M,8.5).length*12.5+7;if(y-needed<48){pg=pdf.addPage([W,H]);y=H-55;}y=write(pg,answer,M,y,W-2*M,8.5)-7;}}}
 return new Response(await pdf.save(),{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="AI_Ustad_G_Worksheets.pdf"'}});
 }catch(e){return fail('Worksheet PDF export failed: '+e.message,503)}
}
