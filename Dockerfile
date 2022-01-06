FROM node:16-slim

RUN apt update && apt install -y wget

RUN wget https://github.com/benbjohnson/litestream/releases/download/v0.3.7/litestream-v0.3.7-linux-amd64.deb

RUN dpkg -i litestream-v0.3.7-linux-amd64.deb

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

COPY litestream.yml /etc/litestream.yml

CMD litestream replicate