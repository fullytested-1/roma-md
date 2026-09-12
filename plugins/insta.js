import {sendVideo,sendImage} from "../core/pair.js";
import {request} from "../core/http.js";
const API=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/insta?url="+encodeURIComponent(u),
  u=>"https://jerrycoder.oggyapi.workers.dev/down/insta-v1?url="+encodeURIComponent(u),
  u=>"https://eliteprotech-apis.zone.id/instagram?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/instagram?url="+encodeURIComponent(u)
];
const isInstagram=u=>/^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\//i.test(u);
function extract(data){
  const out=[];const push=(type,url,thumb,title)=>{if(url)out.push({type,url,thumb,title})};
  if(data?.status==="success"&&data?.data){const d=data.data;if(Array.isArray(d.urls)){for(const u of d.urls)push(d.type==="image"?"image":"video",u,d.thumbnail,d.title)}else push(d.type==="image"?"image":"video",d.url,d.thumbnail,d.title)}
  if(data?.success===true&&data?.data?.media){const m=data.data.media;push(m.type==="image"?"image":"video",m.url,m.thumbnail,data.data.caption)}
  if(data?.status===true&&Array.isArray(data?.result)){for(const r of data.result||[])push(r.type==="image"?"image":"video",r.url,r.thumbnail,r.title)}
  if(data?.success===true&&data?.downloadURL)push("video",data.downloadURL,null,data.title);
  return out.filter(x=>x.url);
}
async function downloadInstagram(url){let last;for(const make of API){try{const data=await request(make(url));const media=extract(data);if(media.length)return media;last=new Error("API returned no media")}catch(e){last=e}}throw last||new Error("All Instagram APIs failed")}
export const commands=[{name:"insta",aliases:["instagram","ig"],async run(ctx){const url=String(ctx.arg||"").trim();if(!url)return ctx.reply("❌ Instagram link kodukkuka.\n\nExample: .insta https://www.instagram.com/reel/xxxxx/");if(!isInstagram(url))return ctx.reply("❌ Valid Instagram reel/post link venam.");await ctx.reply("⏳ Instagram media download cheyyunnu...");try{const media=await downloadInstagram(url);for(const item of media){if(item.type==="image")await sendImage(ctx.message.from,item.url,item.title||"");else await sendVideo(ctx.message.from,item.url,item.title||"")}}catch(e){console.error("[ROMA] insta error:",e.message);await ctx.reply("❌ Instagram download failed. Vere link try cheyyuka.")}}}];