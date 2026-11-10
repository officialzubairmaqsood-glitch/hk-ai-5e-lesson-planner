import {randomBytes,createHmac} from 'node:crypto';
import {writeJob} from './job-store.mjs';
const respond=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export default async req=>{
 if(req.method!=='POST')return respond({error:'Method not allowed'},405);
 let p;try{p=await req.json()}catch{return respond({error:'Invalid JSON'},400)}
 if(!p||!String(p.topic||'').trim()||!String(p.subject||'').trim()||JSON.stringify(p).length>12000)return respond({error:'Invalid lesson request'},400);
 if(!process.env.GEMINI_API_KEY&&!process.env.GROQ_API_KEY)return respond({error:'AI keys not configured'},503);
 const secret=process.env.GEMINI_API_KEY||process.env.GROQ_API_KEY;
 const id=randomBytes(24).toString('hex'),signature=createHmac('sha256',secret).update(id).digest('hex');
 await writeJob(id,{status:'queued',stage:'Preparing generation',created:Date.now(),payload:p});
 try{
  const url=new URL('/.netlify/functions/generation-worker',req.url);
  const response=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,signature})});
  if(response.status!==202){await writeJob(id,{status:'failed',created:Date.now(),error:'Background worker could not be started'});return respond({error:'Background worker unavailable',code:response.status},502)}
  return respond({id,status:'queued'},202);
 }catch(e){await writeJob(id,{status:'failed',created:Date.now(),error:'Background worker could not be started'});return respond({error:'Background worker unavailable'},502)}
};
