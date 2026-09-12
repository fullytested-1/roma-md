export const commands=[{
  name:"menu",aliases:["help"],
  async run(ctx){
    const c=ctx.config, p=c.prefix, user=ctx.senderNumber||"User";
    const menu=`╭━━━〔 ${c.botName} 〕━━━···▸
┃╭──────────────···▸
✧│ *ᴏᴡɴᴇʀ :* ANSAD
✧│ *ᴜsᴇʀ :* @${user}
✧│ *ᴘʟᴜɢɪɴs :* ${ctx.pluginCount}
✧│ *ᴅᴀᴛᴇ :* ${ctx.date}
✧│ *ᴛɪᴍᴇ :* ${ctx.time}
✧│ *ᴜᴘᴛɪᴍᴇ :* ${ctx.uptime}
✧│ *ᴠᴇʀsɪᴏɴ :* v4.0.8
┃╰──────────────···▸
╰━━━━━━━━━━━━━━━···▸

╭━━━━━━━━━━━━━━━···▸
╽
┃  ╭─────────────┅┄▻
┃  │  *➻ GENERAL*
┃  ╰┬────────────┅┄▻
┃  ┌┤
┃  │ ‣ ${p}ping
┃  │ ‣ ${p}alive
┃  │ ‣ ${p}runtime
┃  │ ‣ ${p}menu
┃  ╰─────────────···▸
┃  ╭─────────────┅┄▻
┃  │  *➻ AI*
┃  ╰┬────────────┅┄▻
┃  ┌┤
┃  │ ‣ ${p}ai
┃  │ ‣ ${p}imagine
┃  ╰─────────────···▸
┃  ╭─────────────┅┄▻
┃  │  *➻ DOWNLOAD*
┃  ╰┬────────────┅┄▻
┃  ┌┤
┃  │ ‣ ${p}fb
┃  │ ‣ ${p}twitter
┃  │ ‣ ${p}tiktok
┃  │ ‣ ${p}spotify
┃  ╰─────────────···▸
┃  ╭─────────────┅┄▻
┃  │  *➻ GROUP*
┃  ╰┬────────────┅┄▻
┃  ┌┤
┃  │ ‣ ${p}add
┃  │ ‣ ${p}kick
┃  │ ‣ ${p}promote
┃  │ ‣ ${p}demote
┃  │ ‣ ${p}tag
┃  ╰─────────────···▸
┃  ╭─────────────┅┄▻
┃  │  *➻ SERVER*
┃  ╰┬────────────┅┄▻
┃  ┌┤
┃  │ ‣ ${p}mode
┃  │ ‣ ${p}uptime
┃  │ ‣ ${p}runtime
┃  ╰─────────────···▸
┃  ╭─────────────┅┄▻
┃  │  *➻ SUPPORT*
┃  ╰┬────────────┅┄▻
┃  │ ‣ ${p}help
┃  │ ‣ ${p}repo
┃  ╰─────────────···▸
╰━━━━━━━━━━━┈⊷
made with 🤍`;
    return ctx.reply(menu,[user+"@s.whatsapp.net"]);
  }
}];