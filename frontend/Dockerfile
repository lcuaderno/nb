FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3011

ENV PORT=3011

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3011"] 