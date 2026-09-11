# ROMA-MD

## API fallback module

Configured providers:

- Facebook downloader: JerryCoder → NexRay → EliteProTech
- Twitter/X downloader: JerryCoder → NexRay
- Lyrics: JerryCoder
- AI Chat: JerryCoder
- AI Image: JerryCoder

The module is at `src/api.js`. Each request automatically tries the next provider when the previous provider fails or returns an invalid response.

Inputs are URL-encoded before being sent to providers.

Example:

```js
import { api } from "./api.js";

const result = await api.facebook("https://www.facebook.com/reel/...");
if (result.ok) console.log(result.data);
```
