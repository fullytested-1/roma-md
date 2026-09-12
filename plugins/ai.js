import {sendMessage} from "../core/pair.js";
import {request} from "../core/http.js";

const API=q=>"https://jerrycoder.oggyapi.workers.dev/ai/gpt?q="+encodeURIComponent(q);

export const commands=[
  {
    name:"ai",
    aliases:[],
    async run(ctx){
      const q=String(ctx.arg||"").trim();
      if(!q)
        return ctx.reply("❌ Question kodukkuka.\n\nExample: .ai Hii");

      try{
        const data=await request(API(q));
        const reply=data?.reply;
        if(!reply) throw new Error("API returned no reply");
        await sendMessage(ctx.message.from,reply);
      }catch(e){
        console.error("[ROMA] ai error:",e.message);
        await ctx.reply("❌ AI reply failed. Pinne try cheyyuka.");
      }
    }
  }
];