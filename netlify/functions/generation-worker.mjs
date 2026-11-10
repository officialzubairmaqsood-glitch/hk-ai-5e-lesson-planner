import {createHmac,timingSafeEqual} from 'node:crypto';
import generate from './generate.mjs';
import {readJob,writeJob} from './job-store.mjs';
export const config={background:true};
export default async req=>{
 let id,signature;try{({id,signature}=await req.json())}catch{return new Response('Invalid request',{status:400})}
 const secret=process.env.GEMINI_API_KEY||process.env.GROQ_API_KEY||'';
 const expected=createHmac('sha256',secret).update(String(id)).digest('hex');
 if(!signature||!/^([a-f0-9]{64})$/.test(signature)||!timingSafeEqual(Buffer.from(expected),Buffer.from(signature)))return new Response('Forbidden',{status:403});
 const job=await readJob(id);if(!job||!job.payload)return new Response('Not found',{status:404});
 if(job.status==='complete')return new Response('Already complete');
 await writeJob(id,{...job,status:'running',stage:'Generating lesson and worksheets',started:Date.now()});
 try{
  const response=await generate(new Request('https://localhost/.netlify/functions/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(job.payload)}));
  const data=await response.json();
  if(!response.ok)throw Error(data.error||'Generation failed');
  await writeJob(id,{status:'complete',created:job.created,stage:'Ready to download',result:data,completed:Date.now()});
 }catch(e){console.error(JSON.stringify({event:'job_failed',job:id,reason:e.message}));await writeJob(id,{status:'failed',created:job.created,stage:'Generation failed',error:e.message})}
 return new Response('Processed');
};
