import fontkit from '@pdf-lib/fontkit';
import {readFile} from 'node:fs/promises';
const FONT_FILE = new URL('./fonts/NotoSans-Regular.ttf', import.meta.url);
let fontBytes;
export async function unicodeFonts(pdf){
  pdf.registerFontkit(fontkit);
  if(!fontBytes) fontBytes=readFile(FONT_FILE).catch(e=>{fontBytes=null;throw new Error('Bundled Unicode font unavailable: '+e.message)});
  const bytes=await fontBytes;
  const normal=await pdf.embedFont(bytes,{subset:true});
  return {normal,bold:normal};
}
