import "dotenv/config";
export const config={
 sessionId:process.env.SESSION_ID||"",mongoUri:process.env.MONGODB_URI||"",
 encryptionKey:process.env.SESSION_ENCRYPTION_KEY||"",owner:(process.env.OWNER_NUMBER||"").replace(/\D/g,""),
 prefix:process.env.PREFIX||".",botName:process.env.BOT_NAME||"ROMA MD",logLevel:process.env.LOG_LEVEL||"silent"
};
if(!config.sessionId.startsWith("ROMA~")) throw new Error("SESSION_ID must start with ROMA~");
if(!config.mongoUri) throw new Error("MONGODB_URI is required");
if(!/^[0-9a-fA-F]{64}$/.test(config.encryptionKey)) throw new Error("SESSION_ENCRYPTION_KEY must be 64 hexadecimal characters");