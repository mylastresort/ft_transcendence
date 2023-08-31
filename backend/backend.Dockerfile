FROM node:18-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g prisma

RUN npx prisma generate

RUN npm run build

RUN chmod +x setup.sh

ENTRYPOINT [ "bash", "setup.sh" ]