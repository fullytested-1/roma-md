import {config} from "./config.js";
import {getMessages,sendMessage,getBotJid,sessionInfo} from "./core/pair.js";
import {loadPlugins} from "./core/plugin.js";
import {sleep} from "./core/http.js";

const started=Date.now();
let cursor=0,busy=false,lastState="";
let plugins=[];

const numberOf=v=>String(v||"").split("@")[0].split(":")[0].replace(/\D/g,"");
const uptime=()=>{let s=Math.floor((Date.now()-started)/1000),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};

async function allowed(sender){
  if(config.mode!=="private") return true;
  const bot=numberOf(await getBotJid());
  const owner=config.owner;
  return !!sender && (sender===bot || (!!owner && sender===owner));
}

async function handle(m){
  const text=String(m?.text||m?.message?.text||"").trim();
  if(!text.startsWith(config.prefix)) return;
  const sender=numberOf(m.from||m.sender||m.participant);
  if(!(await allowed(sender))) return;

  const receivedAt=Date.now();
  const parts=text.slice(config.prefix.length).trim().split(/\s+/);
  const name=(parts.shift()||"").toLowerCase();
  const arg=parts.join(" ");
  const command=plugins.find(p=>p.name===name || (p.aliases||[]).includes(name));
  if(!command) return;

  const date=new Date();
  const ctx={
    message:m,config,senderNumber:sender,arg,args:parts,
    receivedAt,pluginCount:plugins.length,
    date:date.toLocaleDateString("en-GB",{day:"numeric",month:"numeric",year:"numeric"}),
    time:date.toLocaleTimeString("en-US"),
    uptime,
    reply:(text,mentions=[])=>sendMessage(m.from,text,mentions)
  };
  await command.run(ctx);
}

async function checkState(){
  try{
    const d=await sessionInfo();
    const connected=d?.connected===true||d?.status==="connected"||d?.session?.connected===true;
    const state=connected?"CONNECTED":"DISCONNECTED";
    if(state!==lastState){
      lastState=state;
      console.log("[ROMA] Session "+state+" • "+config.sessionId);
    }
  }catch{
    if(lastState!=="ERROR"){lastState="ERROR";console.log("[ROMA] Session status ERROR • "+config.sessionId)}
  }
}

async function poll(){
  if(busy)return;
  busy=true;
  try{
    const d=await getMessages(cursor);
    if(d?.success===false) throw new Error(d.error||"message API error");
    for(const m of d?.messages||[]){
      try{await handle(m)}catch(e){console.error("[ROMA] command error:",e.message)}
    }
    if(Number.isFinite(Number(d?.cursor))) cursor=Math.max(cursor,Number(d.cursor));
  }catch(e){
    console.error("[ROMA] poll error:",e.message);
  }finally{busy=false}
}

async function main(){
  plugins=await loadPlugins();
  console.log("[ROMA] Bot started with session "+config.sessionId);
  console.log("[ROMA] Mode: "+config.mode+" • Plugins: "+plugins.length);
  await checkState();
  await poll();
  setInterval(poll,1500);
  setInterval(checkState,5000);
}
main().catch(e=>{console.error("[ROMA] Fatal:",e);process.exit(1)});
