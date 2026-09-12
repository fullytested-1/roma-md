import {sessionInfo} from "../core/pair.js";

export const commands=[{
  name:"session",
  aliases:["sess","sessioninfo"],
  async run(ctx){
    try{
      const d=await sessionInfo();
      const connected=d?.connected===true||d?.status==="connected"||d?.session?.connected===true;
      const jid=d?.userJid||d?.session?.userJid||d?.jid||"Unknown";
      return ctx.reply(
        "╭━━〔 *SESSION* 〕━━╮\n"+
        "┃ Status : "+(connected?"🟢 Connected":"🔴 Disconnected")+"\n"+
        "┃ ID     : "+ctx.config.sessionId+"\n"+
        "┃ JID    : "+jid+"\n"+
        "╰━━━━━━━━━━━━━━╯"
      );
    }catch(e){
      console.error("[ROMA] session command:",e?.message||e);
      return ctx.reply("❌ Session status fetch failed.");
    }
  }
}];