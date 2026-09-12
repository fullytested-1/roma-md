import {sendVideo} from "../core/pair.js";
import {request} from "../core/http.js";

const APIS=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/twitter?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/twitter?url="+encodeURIComponent(u)
];

function isTwitter(url){
  return /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\//i.test(url);
}

function extract(data){
  if(data?.status==="success" && data?.result?.medias){
    const medias=data.result.medias
      .filter(x=>x?.videoAvailable && x?.url && x.url!=="/")
      .map(x=>({quality:String(x.quality||""),url:x.url}));
    if(medias.length) return {
      title:data.result.title||"Twitter Video",
      duration:data.result.duration||"",
      thumbnail:data.result.thumbnail||"",
      results:medias
    };
  }

  if(data?.status===true && data?.result?.download_url){
    const medias=data.result.download_url
      .filter(x=>x?.type==="mp4" && x?.url && x.url!=="/")
      .map(x=>({quality:String(x.resolusi||x.name||""),url:x.url}));
    if(medias.length) return {
      title:data.result.title||"Twitter Video",
      duration:data.result.duration||"",
      thumbnail:data.result.thumbnail||"",
      results:medias
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
      last=new Error("API returned no Twitter video URL");
    }catch(e){last=e}
  }
  throw last||new Error("All Twitter APIs failed");
}

function pickBest(results){
  const scored=results.map(x=>{
    const m=String(x.quality).match(/(\d+)p/i);
    return {...x,score:m?Number(m[1]):0};
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored[0];
}

export const commands=[
  {
    name:"twitter",
    aliases:["tw","xdl","x"],
    async run(ctx){
      const url=String(ctx.arg||"").trim();
      if(!url)
        return ctx.reply("❌ Twitter/X link kodukkuka.\n\nExample: .twitter https://x.com/user/status/123456789");
      if(!isTwitter(url))
        return ctx.reply("❌ Valid Twitter/X link venam.");

      await ctx.reply("⏳ Twitter/X video download cheyyunnu...");
      try{
        const d=await download(url);
        const best=pickBest(d.results);
        if(!best?.url) throw new Error("No usable video URL");

        const caption="🐦 "+d.title+(d.duration?"\n⏱️ "+d.duration:"")+(best.quality?"\n🎞️ "+best.quality:"");
        await sendVideo(ctx.message.from,best.url,caption);
      }catch(e){
        console.error("[ROMA] twitter error:",e.message);
        await ctx.reply("❌ Twitter/X video download failed. Vere link try cheyyuka.");
      }
    }
  }
];