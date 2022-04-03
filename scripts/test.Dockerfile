FROM node:16-alpine
WORKDIR /var/app

COPY . .
RUN npm install
