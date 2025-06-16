FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3010

ENV NODE_ENV=development
ENV PORT=3010

CMD ["node", "dist/index.js"] 