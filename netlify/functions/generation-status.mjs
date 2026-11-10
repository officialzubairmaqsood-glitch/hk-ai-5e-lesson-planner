import {readJob} from './job-store.mjs';
export default async req=>{
 const id=new URL(req.url).searchParams.get('id');
 const j=await readJob(id);
 return new Response(JSON.stringify(j?{status:j.status,stage:j.stage,error:j.error,result:j.result}: {error:'Job not found or expired'}),{status:j?200:404,headers:{'content-type':'application/json','cache-control':'no-store'}});
};
