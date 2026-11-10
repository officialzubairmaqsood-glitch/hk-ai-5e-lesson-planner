import {getStore} from '@netlify/blobs';
export const store=()=>getStore({name:'ai-ustad-generation-jobs',consistency:'strong'});
export async function readJob(id){if(!/^[a-f0-9]{48}$/.test(id||''))return null;const j=await store().get(id,{type:'json'});if(!j)return null;if(Date.now()-j.created>24*3600*1000)return null;return j;}
export async function writeJob(id,j){await store().setJSON(id,j);}
