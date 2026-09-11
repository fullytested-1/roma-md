# ROMA MD Bot

Session-ID-only WhatsApp bot.

Pair/QR Web owns the WhatsApp/Baileys connection and auth state. This bot does **not** need MongoDB credentials, an encryption key, or Baileys auth files.

Set:
- SESSION_ID=ROMA~...
- PAIR_WEB_URL=your deployed Pair-web URL

The bot polls Pair-web for incoming messages and sends replies/media back through Pair-web.

APIs:
- Facebook: JerryCoder -> NexRay -> EliteProTech
- Twitter/X: NexRay -> JerryCoder
- Lyrics: JerryCoder
- AI chat: JerryCoder
- AI image: JerryCoder

Commands: .ping .menu .alive .runtime .owner .fb .twitter .lyrics .ai .imagine
