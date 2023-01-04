FROM node:16-alpine3.16
WORKDIR /app

COPY . .
RUN npm install --production

EXPOSE 3000
ENV NODE_ENV production

ARG BUILD_VERSION
ENV BUILD_VERSION ${BUILD_VERSION}
CMD [ "npm", "run",  "--silent", "start" ]

