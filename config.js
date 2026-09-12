import "dotenv/config";

const raw=String(process.env.SESSION_ID||"").trim();
const match=raw.match(/^ROMA~[A-Za-z0-9_-]{8,}$/);
export const config={
  sessionId:(match?.[0]||"").trim(),
  pairWebUrl:(process.env.PAIR_WEB_URL||"https://modest-sacha-boyscro-50785a59.koyeb.app").replace(/\/$/,""),
  prefix:process.env.PREFIX||".",
  mode:(process.env.MODE||"public").toLowerCase()==="private"?"private":"public",
  owner:(process.env.OWNER_NUMBER||"").replace(/\D/g,""),
  botName:process.env.BOT_NAME||"ROMA MD",
  language:process.env.LANGUAGE||"English"
};
if(!config.sessionId)throw new Error("Invalid SESSION_ID. Use ROMA~xxxxxxxx session ID.");
