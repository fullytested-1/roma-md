import {sendVideo,sendAudio,sendMessage} from "../core/pair.js";
import {request} from "../core/http.js";

const VIDEO_APIS=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/yt?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/youtube?url="+encodeURIComponent(u),
  u=>"https://eliteprotech-apis.zone.id/youtube?url="+encodeURIComponent(u),
  u=>"https://eliteprotech-apis.zone.id/ytdl?url="+encodeURIComponent(u)
];
const AUDIO_APIS=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/ytmp3?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/youtube-mp3?url="+encodeURIComponent(u),
  u=>"https://eliteprotech-apis.zone.id/youtube-mp3?url="+encodeURIComponent(u)
];
const SEARCH_APIS=[
  q=>"https://jerrycoder.oggyapi.workers.dev/search/youtube?q="+encodeURIComponent(q),
  q=>"https://api.nexray.eu.cc/search/youtube?q="+encodeURIComponent(q),
  q=>"https://eliteprotech-apis.zone.id/youtube/search?q="+encodeURIComponent(q)
];

const isYouTube=u=>/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\//i.test(u);

function extract(data){
  const r=data?.result||data?.data||{};
  const url=data?.url||data?.downloadURL||data?.download_url||data?.videoUrl||data?.video_url||
    r?.url||r?.downloadURL||r?.download_url||r?.video?.url||r?.audio?.url;
  const title=data?.title||r?.title||r?.video?.title||r?.audio?.title||"YouTube";
  return url?{title,url}:null;
}
async function fallback(apis,input){
  let last;
  for(const make of apis){
    try{
      const d=await request(make(input));
      const x=extract(d);
      if(x)return x;
      last=new Error("API returned no download URL");
    }catch(e){last=e;}
  }
  throw last||new Error("All downloader APIs failed");
}
function resultsFrom(data){
  const arr=data?.results||data?.result||data?.data?.results||data?.data||[];
  return Array.isArray(arr)?arr:[];
}

export const commands=[
  {name:"yt",aliases:["youtube","ytv"],async run(ctx){
    const url=String(ctx.arg||"").trim();
    if(!url)return ctx.reply("❌ YouTube link kodukkuka.\n\nExample: .yt https://youtu.be/xxxxx");
    if(!isYouTube(url))return ctx.reply("❌ Valid YouTube link venam.");
    await ctx.reply("⏳ YouTube video download cheyyunnu...");
    try{
      const d=await fallback(VIDEO_APIS,url);
      await sendVideo(ctx.message.from,d.url,"🎬 "+d.title);
    }catch(e){
      console.error("[ROMA] yt:",e?.message||e);
      await ctx.reply("❌ YouTube video download failed. API available aano check cheyyuka.");
    }
  }},
  {name:"yta",aliases:["ytmp3","ytaudio"],async run(ctx){
    const url=String(ctx.arg||"").trim();
    if(!url)return ctx.reply("❌ YouTube link kodukkuka.\n\nExample: .yta https://youtu.be/xxxxx");
    if(!isYouTube(url))return ctx.reply("❌ Valid YouTube link venam.");
    await ctx.reply("⏳ YouTube audio download cheyyunnu...");
    try{
      const d=await fallback(AUDIO_APIS,url);
      await sendAudio(ctx.message.from,d.url,"🎵 "+d.title);
    }catch(e){
      console.error("[ROMA] yta:",e?.message||e);
      await ctx.reply("❌ YouTube audio download failed.");
    }
  }},
  {name:"yts",aliases:["ytsearch"],async run(ctx){
    const q=String(ctx.arg||"").trim();
    if(!q)return ctx.reply("❌ Search query kodukkuka.\n\nExample: .yts Arijit Singh");
    await ctx.reply("🔎 YouTube search cheyyunnu...");
    try{
      let results=[];
      for(const make of SEARCH_APIS){
        try{
          const d=await request(make(q));
          results=resultsFrom(d);
          if(results.length)break;
        }catch{}
      }
      if(!results.length)throw new Error("No search results");
      const list=results.slice(0,10).map((x,i)=>{
        const title=x.title||x.name||"YouTube result";
        const url=x.url||x.link||x.videoUrl||x.video_url||"";
        return (i+1)+". "+title+(url?"\n   "+url:"");
      }).join("\n\n");
      await sendMessage(ctx.message.from,"🎬 *YouTube Results*\n\n"+list+"\n\nUse .yt <URL> or .yta <URL> to download.");
    }catch(e){
      console.error("[ROMA] yts:",e?.message||e);
      await ctx.reply("❌ YouTube search failed.");
    }
  }}
];