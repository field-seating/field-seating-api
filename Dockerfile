FROM node:16-alpine
WORKDIR /app

COPY . .
RUN npm install --production

EXPOSE 3000
ENV NODE_ENV production
CMD [ "npm", "run",  "--silent", "start" ]

