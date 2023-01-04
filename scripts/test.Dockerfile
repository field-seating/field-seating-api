FROM --platform=linux/amd64 node:16-alpine3.16
WORKDIR /var/app

COPY . .
RUN npm install
