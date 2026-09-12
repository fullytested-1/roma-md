FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY index.js ./
COPY config.js ./
COPY core ./core
COPY plugins ./plugins
CMD ["npm","start"]
