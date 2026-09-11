import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import P from "pino";
import qrcode from "qrcode-terminal";
import fs from "node:fs";
import { config } from "./config.js";
import { menuText } from "./commands.js";

const startedAt = Date.now();
const sessionDir = "./session";
function runtime() {
  const sec = Math.floor((Date.now() - startedAt) / 1000);
  return Math.floor(sec/3600) + "h " + Math.floor((sec%3600)/60) + "m " + (sec%60) + "s";
}

async function start() {
  fs.mkdirSync(sessionDir, { recursive: true });
  // ROMA~... is the Session Web identifier. The Session Web adapter will be
  // connected here after its API/format is supplied.
  const auth = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({
    auth: auth.state,
    logger: P({ level: config.logLevel }),
    browser: [config.botName, "Chrome", "1.0.0"],
    printQRInTerminal: false
  });
  sock.ev.on("creds.update", auth.saveCreds);
  sock.ev.on("connection.update", function(u) {
    if (u.qr) qrcode.generate(u.qr, { small: true });
    if (u.connection === "open") console.log("[ROMA] Connected | session: " + config.sessionId);
    if (u.connection === "close") {
      const code = u.lastDisconnect && u.lastDisconnect.error && u.lastDisconnect.error.output && u.lastDisconnect.error.output.statusCode;
      if (code !== DisconnectReason.loggedOut) setTimeout(start, 3000);
    }
  });
  sock.ev.on("messages.upsert", async function(ev) {
    const msg = ev.messages && ev.messages[0];
    if (!msg || !msg.message || msg.key.fromMe) return;
    const text = msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || "";
    if (!text.startsWith(config.prefix)) return;
    const parts = text.slice(config.prefix.length).trim().split(/\\s+/);
    const command = (parts.shift() || "").toLowerCase();
    const jid = msg.key.remoteJid;
    if (command === "ping") return sock.sendMessage(jid, { text: "╭──〔 🏓 PING 〕──╮\n│ Uptime: " + runtime() + "\n╰────────────────╯" });
    if (command === "menu" || command === "help") return sock.sendMessage(jid, { text: menuText(config.prefix) });
    if (command === "alive" || command === "status") return sock.sendMessage(jid, { text: "🤖 " + config.botName + "\nStatus: Online 🟢\nRuntime: " + runtime() });
    if (command === "runtime") return sock.sendMessage(jid, { text: "⏱️ " + runtime() });
    if (command === "owner") return sock.sendMessage(jid, { text: config.owner ? "👑 Owner: +" + config.owner : "Owner number is not configured." });
  });
}
start().catch(function(e) { console.error(e); process.exit(1); });
