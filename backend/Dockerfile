FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY prisma ./prisma
COPY tsconfig.json ./

COPY src ./src

RUN npx prisma generate || echo "Prisma not configured yet"
RUN npx tsc || echo "TypeScript build will work after tsconfig setup"

EXPOSE 4000

CMD ["node", "dist/server.js"]
