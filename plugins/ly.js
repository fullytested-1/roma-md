import {sendMessage} from "../core/pair.js";
import {request} from "../core/http.js";

const APIS=[
  q=>"https://jerrycoder.oggyapi.workers.dev/search/lyrics-v1?q="+encodeURIComponent(q)
];

function extract(data){
  const r=data?.result;
  const l=r?.lyrics;
  if(data?.status==="success" && r && l){
    return {
      title:r.title||l.name||"Unknown",
      artist:r.artist||l.artist_name||"Unknown",
      album:l.album_name||"",
      duration:l.duration||"",
      thumbnail:r.thumbnail||"",
      plain:l.plain_lyrics||"",
      synced:l.synced_lyrics||""
    };
  }
  return null;
}

async function searchLyrics(query){
  let last;
  for(const make of APIS){
    try{
      const data=await request(make(query));
      const result=extract(data);
      if(result) return result;
      last=new Error("API returned no lyrics");
    }catch(e){last=e}
  }
  throw last||new Error("Lyrics API failed");
}

function formatDuration(seconds){
  const n=Number(seconds);
  if(!Number.isFinite(n)||n<=0)return "";
  return Math.floor(n/60)+":"+String(Math.floor(n%60)).padStart(2,"0");
}

export const commands=[
  {
    name:"lyrics",
    aliases:["ly","lyric","l"],
    async run(ctx){
      const query=String(ctx.arg||"").trim();
      if(!query)
        return ctx.reply("❌ Song name kodukkuka.\n\nExample: .lyrics jhol maanu");

      await ctx.reply("🔎 Lyrics search cheyyunnu...");
      try{
        const d=await searchLyrics(query);
        const lyrics=d.plain||d.synced;
        if(!lyrics) return ctx.reply("❌ Lyrics kittiyilla.");

        const header="🎵 *"+d.title+"*\n👤 "+d.artist+
          (d.album?"\n💿 "+d.album:"")+
          (d.duration?"\n⏱️ "+formatDuration(d.duration):"")+
          "\n\n";
        const body=header+lyrics;

        const max=60000;
        if(body.length<=max){
          await sendMessage(ctx.message.from,body);
        }else{
          for(let i=0;i<body.length;i+=max)
            await sendMessage(ctx.message.from,body.slice(i,i+max));
        }
      }catch(e){
        console.error("[ROMA] lyrics error:",e.message);
        await ctx.reply("❌ Lyrics search failed. Song name correct aano enn check cheyyuka.");
      }
    }
  }
];