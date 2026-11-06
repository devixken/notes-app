ARG NODE_VERSION=26
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
# TODO: switch to a BuildKit cache mount for npm (see issue #1)
RUN npm ci --omit=dev && npm cache clean --force

COPY src/ ./src/

# 1000 = the "node" user from the official image
USER 1000:1000

EXPOSE 3000

CMD ["node", "src/index.js"]
