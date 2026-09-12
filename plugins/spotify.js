import {sendMessage,sendVideo} from "../core/pair.js";
import {request} from "../core/http.js";

const APIS=[
  u=>"https://jerrycoder.oggyapi.workers.dev/down/spotify?url="+encodeURIComponent(u),
  u=>"https://api.nexray.eu.cc/downloader/spotify?url="+encodeURIComponent(u)
];

function extract(data){
  if(data?.status==="success" && data?.download_link){
    return {
      title:data.title||"Spotify",
      artist:data.artist||"",
      duration:data.duration||"",
      thumbnail:data.thumbnail||"",
      url:data.download_link
    };
  }
  if(data?.status===true && data?.result?.url){
    return {
      title:data.result.title||"Spotify",
      artist:data.result.artist||"",
      duration:data.result.duration||"",
      thumbnail:data.result.thumbnail||"",
      url:data.result.url
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
      last=new Error("API returned no download URL");
    }catch(e){last=e}
  }
  throw last||new Error("All Spotify APIs failed");
}

function isSpotify(url){
  return /^https?:\\/\\/(?:open\\.)?spotify\\.com\\/(?:track|album|playlist)\\//i.test(url);
}

export const commands=[
  {
    name:"spotify",
    aliases:["sp","spot"],
    async run(ctx){
      const url=String(ctx.arg||"").trim();
      if(!url)
        return ctx.reply("❌ Spotify link kodukkuka.\\n\\nExample: .spotify https://open.spotify.com/track/xxxxx");
      if(!isSpotify(url))
        return ctx.reply("❌ Valid Spotify track/album/playlist link venam.");

      await ctx.reply("⏳ Spotify download cheyyunnu...");
      try{
        const d=await download(url);
        const caption="🎵 "+d.title+(d.artist?"\\n👤 "+d.artist:"")+(d.duration?"\\n⏱️ "+d.duration:"");
        await sendVideo(ctx.message.from,d.url,caption);
      }catch(e){
        console.error("[ROMA] spotify error:",e.message);
        await ctx.reply("❌ Spotify download failed. Vere link try cheyyuka.");
      }
    }
  }
];