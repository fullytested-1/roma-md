import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";

const root=path.dirname(fileURLToPath(import.meta.url));
const dir=path.join(root,"..","plugins");

export async function loadPlugins(){
  await fs.mkdir(dir,{recursive:true});
  const files=(await fs.readdir(dir)).filter(x=>x.endsWith(".js")).sort();
  const plugins=[];
  for(const file of files){
    const mod=await import(pathToFileURL(path.join(dir,file)).href+"?v="+Date.now());
    if(Array.isArray(mod.commands)) plugins.push(...mod.commands);
    else if(mod.default) plugins.push(...(Array.isArray(mod.default)?mod.default:[mod.default]));
  }
  return plugins;
}
