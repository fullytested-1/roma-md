import mongoose from "mongoose";
import makeWASocket,{DisconnectReason} from "@whiskeysockets/baileys";
import P from "pino";
import crypto from "node:crypto";
import {config} from "./config.js";
import {createAuthState} from "./auth.js";
import {api} from "./api.js";
import {menuText} from "./commands.js";

const started=Date.now();
const runtime=()=>{let s=Math.floor((Date.now()-started)/1000),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);return h+"h "+m+"m "+(s%60)+"s"};
const textOf=m=>m?.conversation||m?.extendedTextMessage?.text||m?.imageMessage?.caption||m?.videoMessage?.caption||"";
const urlOf=s=>(s.match(/https?:\\/\\/[^\\s]+/i)||[])[0];

async function handle(sock,msg){
 const jid=msg.key.remoteJid,raw=textOf(msg).trim();
 if(!raw.startsWith(config.prefix))return;
 const a=raw.slice(config.prefix.length).trim().split(/\\s+/),cmd=(a.shift()||"").toLowerCase(),arg=a.join(" ");
 if(cmd==="ping")return sock.sendMessage(jid,{text:"🏓 Pong!\\n⏱️ "+runtime()});
 if(cmd==="alive"||cmd==="status")return sock.sendMessage(jid,{text:"🤖 "+config.botName+"\\n🟢 Online\\n⏱️ "+runtime()});
 if(cmd==="runtime")return sock.sendMessage(jid,{text:"⏱️ "+runtime()});
 if(cmd==="owner")return sock.sendMessage(jid,{text:config.owner?"👑 Owner: +"+config.owner:"Owner not configured."});
 if(cmd==="menu"||cmd==="help")return sock.sendMessage(jid,{text:menuText(config.prefix)});

 if(cmd==="fb"||cmd==="facebook"){
  const u=urlOf(arg)||arg;if(!u)return sock.sendMessage(jid,{text:"Usage: "+config.prefix+"fb <Facebook URL>"});
  await sock.sendMessage(jid,{text:"⏳ Downloading Facebook video..."});
  const r=await api.facebook(u);if(!r.ok)return sock.sendMessage(jid,{text:"❌ Facebook downloader failed."});
  const d=r.data,items=[];
  if(Array.isArray(d.results))for(const x of d.results)if(x.url&&x.url!=="/")items.push(x);
  if(d.result?.video_hd)items.unshift({quality:"HD",url:d.result.video_hd});
  if(d.result?.video_sd)items.push({quality:"SD",url:d.result.video_sd});
  if(Array.isArray(d.result?.medias))items.push(...d.result.medias);
  const pick=items.find(x=>/1440|1080|720/i.test(x.quality||""))||items.find(x=>x.url);
  if(!pick)return sock.sendMessage(jid,{text:"❌ No downloadable video found."});
  return sock.sendMessage(jid,{video:{url:pick.url},caption:"📥 Facebook • "+(pick.quality||"Video")});
 }

 if(cmd==="twitter"||cmd==="x"){
  const u=urlOf(arg)||arg;if(!u)return sock.sendMessage(jid,{text:"Usage: "+config.prefix+"twitter <X URL>"});
  await sock.sendMessage(jid,{text:"⏳ Downloading X video..."});
  const r=await api.twitter(u);if(!r.ok)return sock.sendMessage(jid,{text:"❌ Twitter/X downloader failed."});
  const d=r.data,items=[];
  if(Array.isArray(d.result?.download_url))items.push(...d.result.download_url);
  if(Array.isArray(d.result?.medias))items.push(...d.result.medias);
  if(d.result?.video_hd)items.unshift({name:"HD",url:d.result.video_hd});
  if(d.result?.video_sd)items.push({name:"SD",url:d.result.video_sd});
  const pick=items.find(x=>x.url&&/1280|1080|720/i.test((x.name||x.quality||"")+""))||items.find(x=>x.url);
  if(!pick)return sock.sendMessage(jid,{text:"❌ No downloadable media found."});
  return sock.sendMessage(jid,{video:{url:pick.url},caption:"📥 X/Twitter • "+(pick.name||pick.quality||"Video")});
 }

 if(cmd==="lyrics"||cmd==="lyric"){
  if(!arg)return sock.sendMessage(jid,{text:"Usage: "+config.prefix+"lyrics <song name>"});
  const r=await api.lyrics(arg),x=r.data?.result,l=x?.lyrics;if(!r.ok||!l)return sock.sendMessage(jid,{text:"❌ Lyrics not found."});
  const body=l.plain_lyrics||l.synced_lyrics||"";
  return sock.sendMessage(jid,{text:"🎵 *"+(x.title||l.name||arg)+"*\\n👤 "+(x.artist||l.artist_name||"")+"\\n\\n"+body.slice(0,60000)});
 }

 if(cmd==="ai"||cmd==="chat"){
  if(!arg)return sock.sendMessage(jid,{text:"Usage: "+config.prefix+"ai <question>"});
  const r=await api.ai(arg);return sock.sendMessage(jid,{text:r.ok?"🤖 "+r.data.reply:"❌ AI unavailable right now."});
 }
 if(cmd==="imagine"||cmd==="imageai"){
  if(!arg)return sock.sendMessage(jid,{text:"Usage: "+config.prefix+"imagine <prompt>"});
  const r=await api.image(arg);if(!r.ok)return sock.sendMessage(jid,{text:"❌ Image generation failed."});
  return sock.sendMessage(jid,{image:{url:r.data.image},caption:"🎨 "+arg});
 }
 return sock.sendMessage(jid,{text:"❓ Unknown command. Type "+config.prefix+"menu"});
}

async function start(){
 await mongoose.connect(config.mongoUri);
 const {state}=await createAuthState();
 if(!state.creds.registered)throw new Error("Session is not paired. Pair it first in Pair-web.");
 const sock=makeWASocket({auth:state,logger:P({level:config.logLevel}),browser:["ROMA MD","Chrome","1.0.0"],markOnlineOnConnect:false,syncFullHistory:false});
 sock.ev.on("connection.update",u=>{
  if(u.connection==="open")console.log("[ROMA] Connected: "+config.sessionId);
  if(u.connection==="close"){
   const code=u.lastDisconnect?.error?.output?.statusCode;
   if(code===DisconnectReason.loggedOut){console.error("[ROMA] Logged out. Re-pair in Pair-web.");process.exit(1)}
   console.log("[ROMA] Disconnected; reconnecting...");
   setTimeout(()=>start().catch(e=>{console.error(e);process.exit(1)}),3000);
  }
 });
 sock.ev.on("messages.upsert",async ev=>{
  for(const msg of ev.messages||[]){if(!msg?.message||msg.key.fromMe)continue;try{await handle(sock,msg)}catch(e){console.error(e);await sock.sendMessage(msg.key.remoteJid,{text:"❌ Error: "+(e.message||"Request failed")}).catch(()=>{})}}
 });
}
start().catch(e=>{console.error("[ROMA] Fatal:",e);process.exit(1)});