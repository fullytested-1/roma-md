# ROMA MD WhatsApp Bot

This is the separate bot service for the ROMA Pairing Web.

Flow: Pair/QR Web -> ROMA~ Session ID -> this bot -> WhatsApp commands -> APIs.

The bot reads the encrypted Baileys auth state from the same MongoDB used by Pair-web. Pair-web remains the credential writer.

Fallback order:
- Facebook: JerryCoder -> NexRay -> EliteProTech
- Twitter/X: NexRay -> JerryCoder
- Lyrics: JerryCoder
- AI chat: JerryCoder
- AI image: JerryCoder

Commands:
.ping
.menu
.alive
.runtime
.owner
.fb <url>
.twitter <url>
.lyrics <song>
.ai <question>
.imagine <prompt>

Set the same MONGODB_URI and SESSION_ENCRYPTION_KEY as Pair-web and set SESSION_ID to the generated ROMA~ value. Never commit .env or secrets.
