import {sendVideo} from "../core/pair.js";
import {request} from "../core/http.js";

const APIS=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/fb?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/facebook?url="+encodeURIComponent(u),
  u=>"https://eliteprotech-apis.zone.id/facebook1?url="+encodeURIComponent(u)
];

function isFacebook(url){
  return /^https?:\/\/(?:www\.|m\.)?facebook\.com\//i.test(url);
}

function extract(data){
  if(data?.status==="success" && Array.isArray(data.results)){
    const results=data.results
      .filter(x=>x?.url && x.url!=="/")
      .map(x=>({quality:String(x.quality||""),url:x.url}));
    if(results.length) return {
      title:data.title||data?.result?.title||"Facebook Video",
      results
    };
  }

  if(data?.status===true && data?.result){
    const r=data.result;
    const results=[];
    if(r.video_hd) results.push({quality:"HD",url:r.video_hd});
    if(r.video_sd) results.push({quality:"SD",url:r.video_sd});
    if(results.length) return {title:r.title||"Facebook Video",results};
  }

  if(data?.success===true && Array.isArray(data.results)){
    const results=data.results
      .filter(x=>x?.url && x.url!=="/")
      .map(x=>({quality:String(x.quality||""),url:x.url}));
    if(results.length) return {
      title:data.title||"Facebook Video",
      results
    };
  }

  return null;
}

async function download(url){
  let last;
  for(const make of APIS){
    try{
      const data=await request(make(url));
      const result=extract(data);
      if(result) return result;
      last=new Error("API returned no Facebook video URL");
    }catch(e){last=e}
  }
  throw last||new Error("All Facebook APIs failed");
}

function pickBest(results){
  const scored=results.map(x=>{
    const m=String(x.quality).match(/(\\d+)p/i);
    return {...x,score:m?Number(m[1]):0};
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored[0];
}

export const commands=[
  {
    name:"fb",
    aliases:["facebook","fbdl"],
    async run(ctx){
      const url=String(ctx.arg||"").trim();
      if(!url)
        return ctx.reply("❌ Facebook link kodukkuka.\n\nExample: .fb https://www.facebook.com/reel/xxxxx");
      if(!isFacebook(url))
        return ctx.reply("❌ Valid Facebook link venam.");

      await ctx.reply("⏳ Facebook video download cheyyunnu...");
      try{
        const d=await download(url);
        const best=pickBest(d.results);
        if(!best?.url) throw new Error("No usable video URL");

        const caption="📥 "+d.title+(best.quality?"\n🎞️ "+best.quality:"");
        await sendVideo(ctx.message.from,best.url,caption);
      }catch(e){
        console.error("[ROMA] fb error:",e.message);
        await ctx.reply("❌ Facebook video download failed. Vere link try cheyyuka.");
      }
    }
  }
];