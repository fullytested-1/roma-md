import "dotenv/config";

export const config = {
  sessionId: process.env.SESSION_ID || "",
  owner: (process.env.OWNER_NUMBER || "").replace(/\\D/g, ""),
  prefix: process.env.PREFIX || ".",
  botName: process.env.BOT_NAME || "ROMA MD",
  logLevel: process.env.LOG_LEVEL || "silent"
};

if (!config.sessionId) throw new Error("SESSION_ID is required.");
