export const commands=[{
  name:"menu",aliases:["help"],
  async run(ctx){
    const c=ctx.config,p=c.prefix,user=ctx.senderNumber||"User";
    const menu=`╭━━━〔 ${c.botName} 〕━━━···▸
┃╭──────────────···▸
✧│ *ᴏᴡɴᴇʀ :* ANSAD
✧│ *ᴜsᴇʀ :* @${user}
✧│ *ᴘʟᴜɢɪɴs :* ${ctx.pluginCount}
✧│ *ᴅᴀᴛᴇ :* ${ctx.date}
✧│ *ᴛɪᴍᴇ :* ${ctx.time}
✧│ *ᴜᴘᴛɪᴍᴇ :* ${ctx.uptime()}
✧│ *ᴠᴇʀsɪᴏɴ :* v4.0.8
┃╰──────────────···▸
╰━━━━━━━━━━━━━━━···▸

╭━━━━━━━━━━━━━━━···▸
┃  *➻ GENERAL*
┃  │ ‣ ${p}ping
┃  │ ‣ ${p}alive
┃  │ ‣ ${p}runtime
┃  │ ‣ ${p}menu
┃  │ ‣ ${p}session
┃
┃  *➻ AI*
┃  │ ‣ ${p}ai <question>
┃
┃  *➻ DOWNLOAD*
┃  │ ‣ ${p}fb <link>
┃  │ ‣ ${p}insta <link>
┃  │ ‣ ${p}twitter <link>
┃  │ ‣ ${p}spotify <link>
┃  │ ‣ ${p}yt <link>
┃  │ ‣ ${p}yta <link>
┃  │ ‣ ${p}yts <query>
┃
┃  *➻ GROUP / SERVER*
┃  │ ‣ ${p}add
┃  │ ‣ ${p}kick
┃  │ ‣ ${p}promote
┃  │ ‣ ${p}demote
┃  │ ‣ ${p}tag
┃  │ ‣ ${p}mode
┃  │ ‣ ${p}owner
┃
┃  *➻ MUSIC*
┃  │ ‣ ${p}lyrics <song>
┃  ╰─────────────···▸
╰━━━━━━━━━━━┈⊷
made with 🤍`;
    return ctx.reply(menu,[user+"@s.whatsapp.net"]);
  }
}];
