import pptxgen from 'pptxgenjs';
const json=(v,status=400)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json'}});
const str=v=>String(v??'').slice(0,1500);
const safeItems=v=>Array.isArray(v)?v.map(str):[];
const themes={bright:{navy:'12345A',accent:'1678D3',soft:'EAF4FF',yellow:'F7BC43'},minimal:{navy:'203149',accent:'326D87',soft:'F1F5F7',yellow:'D3B46B'}};
export default async req=>{
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 let data;try{data=await req.json()}catch{return json({error:'Invalid JSON'})}
 const {plan:a,payload:b}=data||{};if(!a||!b||!Array.isArray(a.stages))return json({error:'Missing teaching package'});
 const pptx=new pptxgen();pptx.layout='LAYOUT_WIDE';pptx.author=str(b.teacher);pptx.subject=str(b.topic);pptx.title=`${str(b.topic)} - 5E Lesson`;pptx.lang='en-US';
 const T=themes[b.pptTheme]||themes.bright;const sw=13.333,sh=7.5;
 const slide=(section,title,subtitle='')=>{let s=pptx.addSlide();s.background={color:'FFFFFF'};s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:sw,h:.16,line:{color:T.accent},fill:{color:T.accent}});s.addText(section.toUpperCase(),{x:.62,y:.38,w:7,h:.3,fontSize:11,bold:true,color:T.accent});s.addText(str(title),{x:.62,y:.86,w:12,h:.68,fontSize:29,bold:true,color:T.navy,breakLine:false,margin:0});if(subtitle)s.addText(str(subtitle),{x:.65,y:1.57,w:11.8,h:.6,fontSize:14,color:'53677F',margin:0,breakLine:false});s.addText(`${str(b.school)}  •  ${str(b.grade)} ${str(b.section)}  •  ${str(b.subject)}`,{x:.65,y:7.09,w:10.8,h:.22,fontSize:9,color:'60718A'});s.addText(String(pptx._slides.length).padStart(2,'0'),{x:12.1,y:7.06,w:.5,h:.22,fontSize:9,color:T.accent,align:'right'});return s};
 const content=(s,lines,{start=2.25,size=21}={})=>{let arr=safeItems(lines).filter(Boolean).slice(0,6);arr.forEach((line,i)=>{const y=start+i*.72;s.addShape(pptx.ShapeType.roundRect,{x:.67,y:y+.02,w:.12,h:.12,rectRadius:.03,line:{color:T.accent},fill:{color:T.accent}});s.addText(line,{x:.99,y:y-.09,w:11.6,h:.62,fontSize:size,color:T.navy,breakLine:false,margin:.05,fit:'shrink'})})};
 const card=(s,heading,body,x,y,w=5.7)=>{s.addShape(pptx.ShapeType.roundRect,{x,y,w,h:2.05,rectRadius:.13,line:{color:'DCE6F0'},fill:{color:T.soft}});s.addText(str(heading),{x:x+.25,y:y+.22,w:w-.5,h:.4,fontSize:19,bold:true,color:T.accent,margin:0});s.addText(str(body),{x:x+.25,y:y+.77,w:w-.5,h:1.05,fontSize:17,color:T.navy,breakLine:false,fit:'shrink',margin:0})};
 const stages=a.stages||[];const stage=n=>stages.find(x=>String(x.name).toLowerCase().includes(n.toLowerCase()))||{};
 const topic=str(b.topic),subject=str(b.subject);
 let s=slide('5E Learning Model',topic,`${str(b.grade)} ${subject}  •  ${str(b.duration)} minutes`);s.addShape(pptx.ShapeType.roundRect,{x:.67,y:2.55,w:11.9,h:2.35,rectRadius:.15,line:{color:'C9E4F7'},fill:{color:T.soft}});s.addText('PLAN  •  EXPLORE  •  LEARN  •  APPLY',{x:1.08,y:3.15,w:11,h:.7,fontSize:30,bold:true,color:T.accent,align:'center'});s.addText(`Teacher: ${str(b.teacher)}   |   ${str(b.curriculum||'General curriculum')}`,{x:1,y:5.28,w:11.3,h:.5,fontSize:16,color:T.navy,align:'center'});
 s=slide('Engage','Think before you begin','Discuss with a partner. Do not reveal the answer yet.');card(s,'Starter challenge',str(a.ppt?.starterQuestion||`Before working on ${topic}, what would you need to know or prepare?`),.72,2.25,11.8);
 s=slide('Engage','Let’s discuss the answer');content(s,[str(a.ppt?.starterAnswer||stage('Engage').teacher||`Good preparation helps us understand ${topic} and avoid mistakes.`),`Connection to today's topic: ${topic}.`],{size:22});
 s=slide('Learning goals','Three student learning outcomes');content(s,safeItems(a.slos).map((x,i)=>`${i+1}. ${x}`),{size:19});
 s=slide('Explore','Explore: a real-life problem','Think, pair, share — no answers yet.');card(s,'Your challenge',str(a.ppt?.exploreQuestion||stage('Explore').teacher||`How could you solve a simple real-life problem using ${topic}?`),.72,2.3,11.8);
 s=slide('Explore','Discuss your solution');content(s,safeItems(a.ppt?.exploreAnswers).length?a.ppt.exploreAnswers:[str(stage('Explore').student||'Compare ideas with a partner.'),str(stage('Explore').teacher||'Explain how the example works.')]);
 s=slide('Explain',`What is ${topic}?`);card(s,'Key idea',str(a.ppt?.definition||a.aims),.72,2.2,11.8);
 s=slide('Explain','Why is it important?');content(s,safeItems(a.ppt?.importance).length?a.ppt.importance:[str(a.aims),'It helps us make good decisions.','It helps us explain our thinking.']);
 s=slide('Explain','Important terms');content(s,safeItems(a.ppt?.keyTerms).length?a.ppt.keyTerms:[`Topic: ${topic}`,str(a.resources),str(stage('Explain').teacher)],{size:18});
 s=slide('Explain','Learn it step by step');content(s,safeItems(a.ppt?.steps).length?a.ppt.steps:[str(stage('Explain').teacher),str(stage('Explain').student)],{size:19});
 s=slide('Explain','Worked example');card(s,'Example',str(a.ppt?.workedExample||stage('Explain').teacher||`Explain a simple example of ${topic}.`),.72,2.25,11.8);
 s=slide('Elaborate','Guided classroom activity');content(s,safeItems(a.classActivity).slice(0,3),{size:20});
 s=slide('Elaborate','Try it yourself');content(s,safeItems(a.classActivity).slice(3,6).length?safeItems(a.classActivity).slice(3,6):[str(stage('Elaborate').student),str(a.ppt?.independentTask||'Explain your answer to your partner.')],{size:20});
 s=slide('Differentiate','Choose your challenge');card(s,'Support',safeItems(a.support).slice(0,2).join('\n'),.65,2.15,3.85);card(s,'Core',safeItems(a.core).slice(0,2).join('\n'),4.75,2.15,3.85);card(s,'Advanced',safeItems(a.advanced).slice(0,2).join('\n'),8.85,2.15,3.85);
 s=slide('Evaluate','Check your understanding');content(s,safeItems(a.ppt?.checkQuestions).length?a.ppt.checkQuestions:safeItems(a.classActivity).slice(0,3),{size:19});
 s=slide('Evaluate','Answers and feedback');content(s,safeItems(a.ppt?.checkAnswers).length?a.ppt.checkAnswers:[str(a.assessment),str(a.answerKey).slice(0,220)],{size:18});
 s=slide('Closure','Summary and exit ticket');content(s,safeItems(a.ppt?.summary).length?a.ppt.summary:[str(a.aims),str(stage('Closure').student||'Share one thing you learned today.'),`Exit ticket: Explain one key idea from ${topic}.`],{size:18});
 s=slide('Homework','Keep practising');content(s,safeItems(a.homework).slice(0,4),{size:18});
 if(b.pptAnswers===false){pptx._slides.splice(15,1);}
 if(b.pptSlides===15){while(pptx._slides.length>15){pptx._slides.splice(pptx._slides.length>17?10:8,1)}}
 if(b.pptNotes!==false){pptx._slides.forEach((sl,i)=>{try{sl.addNotes(`5E classroom presentation. Topic: ${topic}. Teacher: ${str(b.teacher)}. Slide ${i+1}. Review and adapt activities before class.`)}catch{}})}
 try{const buffer=await pptx.write({outputType:'nodebuffer'});return new Response(buffer,{headers:{'content-type':'application/vnd.openxmlformats-officedocument.presentationml.presentation','content-disposition':'attachment; filename="5E_Classroom_Presentation.pptx"','cache-control':'no-store'}})}catch(e){console.error('PPTX export:',e);return json({error:'PPTX creation failed'},500)}
};
