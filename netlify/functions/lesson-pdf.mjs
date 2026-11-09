import {PDFDocument,rgb} from 'pdf-lib';
import {unicodeFonts} from './unicode-font.mjs';
import {LABELS,LANGUAGES} from './language-qa.mjs';
const reply=(message,status=400)=>new Response(JSON.stringify({error:message}),{status,headers:{'content-type':'application/json'}});
const safe=x=>String(x??'').replace(/[\u0000-\u001f]/g,' ').slice(0,4500);
export default async function(req){
 if(req.method!=='POST')return reply('Method not allowed',405);
 let body;try{body=await req.json()}catch{return reply('Invalid JSON')}
 const {plan:a,payload:b}=body;if(!a||!b||!Array.isArray(a.stages))return reply('Missing lesson data');
 try{
 const pdf=await PDFDocument.create();const {normal:font}=await unicodeFonts(pdf);
 const lang=LANGUAGES[(b.languages||[])[0]]||'en',L=LABELS[lang];
 const W=841.89,H=595.28,M=17,usable=W-2*M,ink=rgb(.11,.17,.25),line=rgb(.68,.72,.77),pale=rgb(.92,.95,.98);
 const pages=[pdf.addPage([W,H]),pdf.addPage([W,H])];
 function wrap(s,width,size){const result=[];for(const raw of safe(s).split('\n')){let current='';for(const word of raw.split(/\s+/)){if(!word)continue;const test=current?current+' '+word:word;if(font.widthOfTextAtSize(test,size)>width&&current){result.push(current);current=word;}else current=test;}result.push(current);}return result;}
 function text(pg,s,x,top,w,size=8,maxLines=12){const rows=wrap(s,w,size);const lineH=size+2.4;const cap=Math.min(maxLines,rows.length);for(let i=0;i<cap;i++)pg.drawText(rows[i],{x,y:H-top-size-i*lineH,size,font,color:ink});return {height:cap*lineH,overflow:rows.length>maxLines};}
 function rect(pg,x,top,w,h,fill){pg.drawRectangle({x,y:H-top-h,width:w,height:h,borderColor:line,borderWidth:.6,...(fill?{color:fill}:{})});}
 function row(pg,top,h,widths,vals,header=false,size=7.4){let x=M;let overflow=false;for(let i=0;i<widths.length;i++){rect(pg,x,top,widths[i],h,header?pale:null);const z=text(pg,vals[i]||'',x+5,top+4,widths[i]-10,size,Math.floor((h-8)/(size+2.4)));overflow ||=z.overflow;x+=widths[i];}return overflow;}
 const meta=[112,232,64,102,64,233], cols=[63,250,250,usable-563];let pg=pages[0];let over=false;
 const d={en:['Session title','Date','Location','Learner group','Duration','Group size','minutes','Time'],ky:['Сабактын темасы','Дата','Өтүүчү жай','Класс','Узактыгы','Окуучулардын саны','мүнөт','Убакыт'],ru:['Тема урока','Дата','Место','Класс','Продолжительность','Количество учащихся','минут','Время'],tr:['Ders konusu','Tarih','Yer','Sınıf','Süre','Öğrenci sayısı','dakika','Süre']}[lang];
 over ||=row(pg,12,27,meta,[d[0],b.topic,d[1],'____________',d[2],b.location||'ICT Lab']);
 over ||=row(pg,39,27,meta,[d[3],`${b.grade} ${b.section}`,d[4],`${b.duration} ${d[6]}`,d[5],'____________']);
 function block(top,h,label,content){rect(pg,M,top,167,h,pale);rect(pg,M+167,top,usable-167,h);over ||=text(pg,label,M+6,top+7,154,9,3).overflow;over ||=text(pg,content,M+173,top+7,usable-185,8,Math.floor((h-10)/10.4)).overflow;}
 block(72,59,L.aims,`${a.aims}   ${b.teacher||''}  ${b.textbook||b.curriculum||''}`);
 block(137,81,L.objectives,(a.slos||[]).map((s,i)=>`${i+1}. ${s}`).join('\n'));
 block(224,64,L.inclusion,a.differentiation||'');
 over ||=row(pg,295,26,cols,[d[7],L.teacher,L.student,L.resources],true);
 let y=321;for(const [i,h] of [48,55,65,85].entries()){const s=a.stages[i]||{};over ||=row(pg,y,h,cols,[`${s.minutes||0} ${d[6]}`,`${L.stages[i]}: ${s.teacher||''}`,s.student||'',s.resources||a.resources||''],false,7.3);y+=h;}
 text(pg,'1 / 2',W-M-55,579,45,8);
 pg=pages[1];over ||=row(pg,12,26,cols,[d[7],L.teacher,L.student,L.resources],true);y=38;
 for(const [i,h] of [143,143,128].entries()){const s=a.stages[i+4]||{};over ||=row(pg,y,h,cols,[`${s.minutes||0} ${d[6]}`,`${L.stages[i+4]}: ${s.teacher||''}`,s.student||'',s.resources||a.resources||''],false,7.3);y+=h;}
 rect(pg,M,460,usable,101);text(pg,L.evaluation,M+7,468,usable-15,10);const blanks={en:['What went well','Evidence of learning','What to improve','Learners requiring support'],ky:['Ийгиликтүү болгон жактары','Окуу натыйжаларынын далилдери','Жакшыртуу жолдору','Кошумча колдоого муктаж окуучулар'],ru:['Что удалось','Подтверждение результатов','Что улучшить','Учащиеся, которым нужна поддержка'],tr:['İyi giden yönler','Öğrenme kanıtları','Geliştirilecek yönler','Ek desteğe ihtiyaç duyan öğrenciler']}[lang];
 blanks.forEach((s,i)=>text(pg,s+': __________________________',M+8+(i%2)*400,487+Math.floor(i/2)*28,385,8));text(pg,'2 / 2',W-M-55,579,45,8);
 if(over)return reply('Lesson content does not fit the approved two-page layout. Shorten text or revise content before exporting.',422);
 return new Response(await pdf.save(),{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="AI_Ustad_G_Lesson.pdf"'}});
 }catch(e){return reply('Multilingual PDF export failed: '+e.message,503)}
}
