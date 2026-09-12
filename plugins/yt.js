import {sendVideo,sendMessage} from "../core/pair.js";
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

function extract(data){
  const r=data?.result;
  const title=data?.title||data?.data?.title||r?.title||r?.video?.title||"YouTube";
  const url=data?.url||data?.downloadURL||data?.download_url||
    data?.data?.url||data?.data?.downloadURL||
    (Array.isArray(r)?r[0]?.url:null)||r?.url||r?.downloadURL||
    r?.video?.url||r?.audio?.url;
  const thumbnail=data?.thumbnail||data?.data?.thumbnail||r?.thumbnail||r?.video?.thumbnail;
  return url?{title,url,thumbnail}:null;
}

async function callFallback(apis,url){
  let last;
  for(const make of apis){
    try{
      const d=await request(make(url));
      const media=extract(d);
      if(media) return media;
      last=new Error("API returned no download URL");
    }catch(e){last=e}
  }
  throw last||new Error("All YouTube APIs failed");
}

function isYouTube(u){
  return /^https?:\\/\\/(?:www\\.|m\\.)?(?:youtube\\.com|youtu\\.be)\\//i.test(u);
}

async function video(ctx,url){
  const d=await callFallback(VIDEO_APIS,url);
  await sendVideo(ctx.message.from,d.url,d.title);
}

async function audio(ctx,url){
  const d=await callFallback(AUDIO_APIS,url);
  await ctx.reply("🎵 "+d.title+"\\n"+d.url);
}

export const commands=[
  {
    name:"yt",
    aliases:["youtube","ytv"],
    async run(ctx){
      const url=String(ctx.arg||"").trim();
      if(!url) return ctx.reply("❌ YouTube link kodukkuka.\\n\\nExample: .yt https://youtu.be/xxxxx");
      if(!isYouTube(url)) return ctx.reply("❌ Valid YouTube link venam.");
      await ctx.reply("⏳ YouTube video download cheyyunnu...");
      try{await video(ctx,url)}
      catch(e){console.error("[ROMA] yt error:",e.message);await ctx.reply("❌ YouTube video download failed.");}
    }
  },
  {
    name:"yta",
    aliases:["ytmp3","ytaudio"],
    async run(ctx){
      const url=String(ctx.arg||"").trim();
      if(!url) return ctx.reply("❌ YouTube link kodukkuka.\\n\\nExample: .yta https://youtu.be/xxxxx");
      if(!isYouTube(url)) return ctx.reply("❌ Valid YouTube link venam.");
      await ctx.reply("⏳ YouTube audio download cheyyunnu...");
      try{await audio(ctx,url)}
      catch(e){console.error("[ROMA] yta error:",e.message);await ctx.reply("❌ YouTube audio download failed.");}
    }
  },
  {
    name:"yts",
    aliases:["ytsearch"],
    async run(ctx){
      const q=String(ctx.arg||"").trim();
      if(!q) return ctx.reply("❌ Search query kodukkuka.\\n\\nExample: .yts Arijit Singh");
      await ctx.reply("🔎 YouTube search cheyyunnu...");
      try{
        const apis=[
          x=>"https://jerrycoder.oggyapi.workers.dev/search/youtube?q="+encodeURIComponent(x),
          x=>"https://api.nexray.eu.cc/search/youtube?q="+encodeURIComponent(x),
          x=>"https://eliteprotech-apis.zone.id/youtube/search?q="+encodeURIComponent(x)
        ];
        let results=[];
        for(const make of apis){
          try{
            const d=await request(make(q));
            const arr=d?.results||d?.result||d?.data?.results||d?.data||[];
            if(Array.isArray(arr)&&arr.length){results=arr;break}
          }catch{}
        }
        if(!results.length) throw new Error("No search results");
        const list=results.slice(0,10).map((x,i)=>{
          const title=x.title||x.name||"YouTube result";
          const url=x.url||x.link||x.videoUrl||x.video_url||"";
          return (i+1)+". "+title+(url?"\\n   "+url:"");
        }).join("\\n\\n");
        ctx.ytSearch={results};
        await ctx.reply("🎬 YouTube Results\\n\\n"+list+"\\n\\nReply with a number.\\n1 = Video\\n2 = Audio");
      }catch(e){
        console.error("[ROMA] yts error:",e.message);
        await ctx.reply("❌ YouTube search failed.");
      }
    }
  }
];