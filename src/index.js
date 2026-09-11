import "dotenv/config";
import P from "pino";

const SESSION_ID=process.env.SESSION_ID||"";
const PAIR_WEB_URL=(process.env.PAIR_WEB_URL||"").replace(/\/$/,"");
const PREFIX=process.env.PREFIX||".";
const BOT_NAME=process.env.BOT_NAME||"ROMA MD";
const OWNER=(process.env.OWNER_NUMBER||"").replace(/\D/g,"");
const log=P({level:process.env.LOG_LEVEL||"silent"});
if(!/^ROMA~[A-Za-z0-9_-]{8,}$/.test(SESSION_ID)) throw new Error("Invalid ROMA session ID");
if(!PAIR_WEB_URL) throw new Error("PAIR_WEB_URL is required (your deployed Pair-web URL)");

const J="https://jerrycoder.oggyapi.workers.dev",N="https://api.nexray.eu.cc",E="https://eliteprotech-apis.zone.id";
const started=Date.now();
const runtime=()=>{let s=Math.floor((Date.now()-started)/1000),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);return h+"h "+m+"m "+(s%60)+"s"};
async function req(url,opts={}){const c=new AbortController(),t=setTimeout(()=>c.abort(),20000);try{const r=await fetch(url,{...opts,signal:c.signal,headers:{"content-type":"application/json",accept:"application/json",...(opts.headers||{})}});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}
async function api(urls,valid){for(const u of urls){try{const d=await req(u);if(valid(d))return d}catch{}}return null}
async function send(to,text){return req(PAIR_WEB_URL+"/api/bot/send/"+encodeURIComponent(SESSION_ID),{method:"POST",body:JSON.stringify({to,text})})}
async function sendVideo(to,url,caption){return req(PAIR_WEB_URL+"/api/bot/send-video/"+encodeURIComponent(SESSION_ID),{method:"POST",body:JSON.stringify({to,url,caption})})}
async function sendImage(to,url,caption){return req(PAIR_WEB_URL+"/api/bot/send-image/"+encodeURIComponent(SESSION_ID),{method:"POST",body:JSON.stringify({to,url,caption})})}
const textOf=m=>m?.text||"";
const urlOf=s=>(s.match(/https?:\/\/[^\s]+/i)||[])[0];

async function handle(m){
 const raw=textOf(m).trim(),to=m.from;if(!raw.startsWith(PREFIX))return;
 const a=raw.slice(PREFIX.length).trim().split(/\s+/),cmd=(a.shift()||"").toLowerCase(),arg=a.join(" ");
 if(cmd==="ping")return send(to,"🏓 Pong!\\n⏱️ "+runtime());
 if(cmd==="alive"||cmd==="status")return send(to,"🤖 "+BOT_NAME+"\\n🟢 Online\\n⏱️ "+runtime());
 if(cmd==="runtime")return send(to,"⏱️ "+runtime());
 if(cmd==="owner")return send(to,OWNER?"👑 Owner: +"+OWNER:"Owner not configured.");
 if(cmd==="menu"||cmd==="help")return send(to,"╭──〔 🤖 "+BOT_NAME+" 〕──╮\\n│ GENERAL\\n│ • "+PREFIX+"ping\\n│ • "+PREFIX+"alive\\n│ • "+PREFIX+"menu\\n│ • "+PREFIX+"runtime\\n│ • "+PREFIX+"owner\\n│\\n│ DOWNLOAD\\n│ • "+PREFIX+"fb <facebook url>\\n│ • "+PREFIX+"twitter <x/twitter url>\\n│ • "+PREFIX+"lyrics <song name>\\n│\\n│ AI\\n│ • "+PREFIX+"ai <question>\\n│ • "+PREFIX+"imagine <prompt>\\n╰──────────────────╯");
 if(cmd==="fb"||cmd==="facebook"){
  const u=urlOf(arg)||arg;if(!u)return send(to,"Usage: "+PREFIX+"fb <Facebook URL>");
  await send(to,"⏳ Downloading Facebook video...");
  const d=await api([J+"/down/fb?url="+encodeURIComponent(u),N+"/downloader/facebook?url="+encodeURIComponent(u),E+"/facebook1?url="+encodeURIComponent(u)],x=>x?.status==="success"||x?.status===true||x?.success===true);
  if(!d)return send(to,"❌ Facebook downloader failed.");
  const items=[]; if(Array.isArray(d.results))items.push(...d.results); if(d.result?.video_hd)items.unshift({quality:"HD",url:d.result.video_hd}); if(d.result?.video_sd)items.push({quality:"SD",url:d.result.video_sd}); if(Array.isArray(d.result?.medias))items.push(...d.result.medias);
  const p=items.find(x=>x.url&&/1440|1080|720/i.test(x.quality||""))||items.find(x=>x.url&&x.url!="/");
  return p?sendVideo(to,p.url,"📥 Facebook • "+(p.quality||"Video")):send(to,"❌ No downloadable video found.");
 }
 if(cmd==="twitter"||cmd==="x"){
  const u=urlOf(arg)||arg;if(!u)return send(to,"Usage: "+PREFIX+"twitter <X URL>");
  await send(to,"⏳ Downloading X video...");
  const d=await api([N+"/downloader/twitter?url="+encodeURIComponent(u),J+"/down/twitter?url="+encodeURIComponent(u)],x=>x?.status==="success"||x?.status===true);
  if(!d)return send(to,"❌ Twitter/X downloader failed.");
  const items=[...(d.result?.download_url||[]),...(d.result?.medias||[])]; const p=items.find(x=>x.url&&/1280|1080|720/i.test((x.name||x.quality||"")) )||items.find(x=>x.url);
  return p?sendVideo(to,p.url,"📥 X/Twitter • "+(p.name||p.quality||"Video")):send(to,"❌ No downloadable video found.");
 }
 if(cmd==="lyrics"||cmd==="lyric"){
  if(!arg)return send(to,"Usage: "+PREFIX+"lyrics <song name>");
  const d=await api([J+"/search/lyrics-v1?q="+encodeURIComponent(arg)],x=>x?.status==="success"),x=d?.result,l=x?.lyrics;
  if(!l)return send(to,"❌ Lyrics not found.");
  return send(to,"🎵 *"+(x.title||l.name||arg)+"*\\n👤 "+(x.artist||l.artist_name||"")+"\\n\\n"+(l.plain_lyrics||l.synced_lyrics||"").slice(0,60000));
 }
 if(cmd==="ai"||cmd==="chat"){
  if(!arg)return send(to,"Usage: "+PREFIX+"ai <question>");
  const d=await api([J+"/ai/gpt?q="+encodeURIComponent(arg)],x=>typeof x?.reply==="string");
  return send(to,d?"🤖 "+d.reply:"❌ AI unavailable right now.");
 }
 if(cmd==="imagine"||cmd==="imageai"){
  if(!arg)return send(to,"Usage: "+PREFIX+"imagine <prompt>");
  const d=await api([J+"/ai/poll?prompt="+encodeURIComponent(arg)],x=>x?.status==="success"&&typeof x?.image==="string");
  return d?sendImage(to,d.image,"🎨 "+arg):send(to,"❌ Image generation failed.");
 }
 return send(to,"❓ Unknown command. Type "+PREFIX+"menu");
}

let cursor=0, busy=false;
async function poll(){
 if(busy)return; busy=true;
 try{
  const d=await req(PAIR_WEB_URL+"/api/bot/messages/"+encodeURIComponent(SESSION_ID)+"?after="+cursor);
  if(!d.success)throw new Error(d.error||"Pair-web rejected session");
  for(const m of d.messages||[]){cursor=Math.max(cursor,Number(m.cursor)||cursor);try{await handle(m)}catch(e){log.error({err:e},"command failed")}}
 }catch(e){log.error({err:e},"poll failed")}
 finally{busy=false}
}
console.log("[ROMA] Bot started with session "+SESSION_ID);
setInterval(poll,2000);poll();
