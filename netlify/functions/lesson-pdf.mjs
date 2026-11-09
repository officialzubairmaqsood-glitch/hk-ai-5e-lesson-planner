import {PDFDocument,StandardFonts,rgb} from 'pdf-lib';
const err=(message,status=400)=>new Response(JSON.stringify({error:message}),{status,headers:{'content-type':'application/json'}});
const st=v=>String(v??'').replace(/[\u0000-\u001f]/g,' ').replace(/[^\x20-\x7E]/g,'?').slice(0,3500);
export default async req=>{
 if(req.method!=='POST')return err('Method not allowed',405);let v;try{v=await req.json()}catch{return err('Invalid JSON')}
 const a=v.plan,b=v.payload;if(!a||!b||!Array.isArray(a.stages))return err('Missing lesson plan');
 const pdf=await PDFDocument.create();const font=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);const W=841.89,H=595.28,M=13;const line=rgb(.46,.48,.5),gray=rgb(.84,.84,.84),white=rgb(1,1,1),black=rgb(.12,.13,.15);
 const pages=[pdf.addPage([W,H]),pdf.addPage([W,H])];
 function text(p,s,x,top,w,size=8,weight=false,maxLines=10){let f=weight?bold:font;let words=st(s).split(/\s+/);let lines=[],cur='';for(const word of words){let test=cur?cur+' '+word:word;if(f.widthOfTextAtSize(test,size)>w&&cur){lines.push(cur);cur=word}else cur=test}if(cur)lines.push(cur);lines.slice(0,maxLines).forEach((t,i)=>p.drawText(t,{x,y:H-top-size-i*(size+2),font:f,size,color:black}));return Math.min(lines.length,maxLines)*(size+2)}
 function rect(p,x,t,w,h,fill){p.drawRectangle({x,y:H-t-h,width:w,height:h,borderColor:line,borderWidth:.65,...(fill?{color:fill}:{})})}
 function row(p,t,h,cols,vals,fillHeader=false,size=8){let x=M;cols.forEach((w,i)=>{rect(p,x,t,w,h,fillHeader?gray:undefined);text(p,vals[i]||'',x+5,t+5,w-10,size,fillHeader,Math.floor((h-8)/(size+2)));x+=w})}
 const cols=[62,253,253,247];let p=pages[0];
 row(p,12,27,[174,236,58,125,60,162],['Session title',st(b.topic),'Date','____________','Location',st(b.location||'ICT Lab')],false,8);
 row(p,39,27,[174,236,58,125,60,162],['Learner group',`${st(b.grade)} ${st(b.section)}`,'Duration',`${b.duration} minutes`,'Group size','__________'],false,8);
 const block=(top,height,label,help,body)=>{rect(p,M,top,174,height,gray);rect(p,M+174,top,641,height);text(p,label,M+6,top+6,163,10,true,2);text(p,help,M+6,top+26,160,7,false,4);text(p,body,M+180,top+7,627,8,false,Math.floor((height-10)/10))};
 block(72,58,'Learning aims','A statement of the overall intent of the lesson.',`Learning Aim (According to Bloom's Taxonomy): ${a.aims}  Teacher: ${b.teacher}. Reference: ${b.textbook||b.curriculum||'Teacher-prepared resources'}.`);
 block(136,83,'Learning objectives','What are learners expected to learn after completing the lesson?',`Student Learning Outcomes (SLOs) - According to Bloom's Taxonomy. By the end of the lesson, students will be able to: ${(a.slos||[]).map((x,i)=>`${i+1}. ${x}`).join('   ')}`);
 block(225,65,'Inclusion','How will you make your lesson inclusive?',`${a.differentiation||''}`);
 row(p,296,26,cols,['Time','What are you doing?','What are your students doing?','Learning materials and resources'],true,8);
 const stages=a.stages.slice(0,7);const h1=[48,55,65,85];let y=322;stages.slice(0,4).forEach((s,i)=>{row(p,y,h1[i],cols,[`${s.minutes} min`,`${s.name}: ${s.teacher}`,s.student,s.resources||a.resources],false,7.6);y+=h1[i]});
 text(p,`${b.grade} ${b.subject} | Week ____ | Lesson 1`,M,579,450,7);text(p,'Page 1 of 2',420,579,100,7);
 p=pages[1];row(p,13,27,cols,['Time','What are you doing?','What are your students doing?','Learning materials and resources'],true,8);const h2=[160,160,105];y=40;stages.slice(4,7).forEach((s,i)=>{row(p,y,h2[i],cols,[`${s.minutes} min`,`${s.name}: ${s.teacher}`,s.student,s.resources||a.resources],false,7.6);y+=h2[i]});
 rect(p,M,474,815,88);text(p,'Lesson Evaluation:',M+6,481,780,9,true);text(p,'What went well: ___________________________________   Evidence of SLO achievement: ___________________________________',M+6,504,780,8);text(p,'What I would improve next time: _________________________   Learners requiring follow-up support: _________________________',M+6,531,780,8);
 text(p,`${b.grade} ${b.subject} | Week ____ | Lesson 1`,M,579,450,7);text(p,'Page 2 of 2',420,579,100,7);
 try{let out=await pdf.save();return new Response(out,{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="5E_Lesson_Plan_Two_Page_Landscape.pdf"','cache-control':'no-store'}})}catch{return err('PDF export failed',500)}
};
