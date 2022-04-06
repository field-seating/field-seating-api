FROM --platform=linux/amd64 node:16-alpine
WORKDIR /var/app

COPY . .
RUN npm install
