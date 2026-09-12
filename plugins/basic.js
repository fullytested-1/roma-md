export const commands=[
{name:"alive",aliases:["status"],async run(ctx){return ctx.reply("🤖 *"+ctx.config.botName+"*\n🟢 Online\n⏱️ "+ctx.uptime())}},
{name:"runtime",aliases:["uptime"],async run(ctx){return ctx.reply("⏱️ *"+ctx.uptime())}},
{name:"owner",aliases:[],async run(ctx){return ctx.reply("👑 *Owner:* ANSAD")}},
{name:"mode",aliases:[],async run(ctx){return ctx.reply("🔐 *Mode:* "+ctx.config.mode)}}
];