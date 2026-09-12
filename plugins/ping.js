export const commands=[{
  name:"ping",aliases:[],
  async run(ctx){
    const ms=Date.now()-ctx.receivedAt;
    return ctx.reply("🏓 *Pong! " + ms + " ms*");
  }
}];