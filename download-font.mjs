// Fetch the open-source Noto Sans font at build time; no font binaries are distributed.
import {mkdir,writeFile} from 'node:fs/promises';
const target=new URL('./netlify/functions/fonts/NotoSans-Regular.ttf',import.meta.url);
const sources=[
 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf',
 'https://github.com/google/fonts/raw/refs/heads/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf'
];
let last;
for(const url of sources){try{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error(`HTTP ${r.status}`);const b=new Uint8Array(await r.arrayBuffer());if(b.length<10000)throw Error('Unexpectedly small font');await mkdir(new URL('./netlify/functions/fonts/',import.meta.url),{recursive:true});await writeFile(target,b);console.log('Unicode font provisioned for deployment');process.exit(0)}catch(e){last=e;console.warn('Font source unavailable:',e.message)}}
throw Error('Unable to provision Unicode font during build: '+(last?.message||'unknown error'));
