# 🌌 ROMA MD

<p align="center">
  <b>ROMA MD — Session-ID-only WhatsApp Bot</b><br>
  Fast download tools, lyrics, AI chat and AI image generation.
</p>

<p align="center">

[![Open Session Web](https://img.shields.io/badge/🔗%20Session%20Web-Medium-blue?style=for-the-badge)](https://modest-sacha-boyscro-50785a59.koyeb.app/)

</p>

## 🔐 Connection

ROMA MD is designed around **Session ID only**.

You only need:

~~~env
SESSION_ID=ROMA~YOUR_SESSION_ID
~~~

The session ID must start with `ROMA~`. The Pair/QR web handles the WhatsApp connection and session state.

> **Session Web:** [Open ROMA Session Web](https://modest-sacha-boyscro-50785a59.koyeb.app/)

No MongoDB URI, connection key, Baileys auth files, or separate connection URI is required by the bot.

## ✨ Features

- 📥 Facebook video downloader with fallback APIs
- 🐦 X/Twitter video downloader with fallback APIs
- 🎵 Lyrics search
- 🤖 AI chat
- 🎨 AI image generation
- 🏓 Ping / alive / runtime commands
- 🪪 ROMA~ session validation
- 🐳 Docker support
- ☁️ Koyeb / Render / Railway deployment
- 🖥️ VPS deployment with Docker Compose

## 📦 Commands

| Command | Usage |
|---|---|
| `.ping` | Check bot response |
| `.alive` | Bot status |
| `.menu` | Show commands |
| `.runtime` | Show uptime |
| `.owner` | Show owner |
| `.fb <url>` | Download Facebook video |
| `.twitter <url>` | Download X/Twitter video |
| `.lyrics <song>` | Search lyrics |
| `.ai <question>` | AI chat |
| `.imagine <prompt>` | Generate an AI image |

## 🚀 Deploy

### ☁️ Koyeb

<p align="center">

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&builder=docker&repository=github.com/fullytested-1/roma-md&branch=main&name=roma-md)

</p>

Create the service and set only the required `SESSION_ID` environment variable.

### 🚀 Render

This repository includes `render.yaml` for a Background Worker deployment.

<p align="center">

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/fullytested-1/roma-md)

</p>

Set `SESSION_ID` when Render asks for the environment variable.

### 🚂 Railway

Railway can deploy this repository directly from GitHub and will detect the included Dockerfile.

<p align="center">

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new)

</p>

1. Open Railway.
2. Choose **Deploy from GitHub repo**.
3. Select `fullytested-1/roma-md`.
4. Add `SESSION_ID=ROMA~YOUR_SESSION_ID`.
5. Deploy.

## 🖥️ VPS Host

The repository includes `docker-compose.yml` for VPS deployment.

### 1. Install Docker

Install Docker and Docker Compose on your VPS.

### 2. Clone

~~~bash
git clone https://github.com/fullytested-1/roma-md.git
cd roma-md
~~~

### 3. Create `.env`

~~~env
SESSION_ID=ROMA~YOUR_SESSION_ID
OWNER_NUMBER=91XXXXXXXXXX
PREFIX=.
BOT_NAME=ROMA MD
LOG_LEVEL=silent
~~~

### 4. Start

~~~bash
docker compose up -d --build
~~~

### 5. View logs

~~~bash
docker compose logs -f roma-md
~~~

### 6. Update

~~~bash
git pull
docker compose up -d --build
~~~

The Compose service uses `restart: unless-stopped`, so the bot comes back after a VPS reboot.

## 🔒 Security

- Never post your **ROMA~ session ID** publicly.
- Do not put session IDs directly into Git commits.
- Use platform environment variables or the VPS `.env` file.
- If a session is disconnected/revoked, generate a new session and replace the old value.

## 🧩 API Fallbacks

### Facebook
1. JerryCoder
2. NexRay
3. EliteProTech

### X/Twitter
1. NexRay
2. JerryCoder

### Lyrics
- JerryCoder

### AI Chat
- JerryCoder

### AI Image
- JerryCoder

## 📁 Project

~~~text
roma-md/
├── src/
│   └── index.js
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── package.json
├── .env.example
└── README.md
~~~

## 💙 ROMA MD

**Bot Name:** ROMA MD  
**Session format:** `ROMA~...`  
**Connection:** Session ID only