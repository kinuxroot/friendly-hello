FROM node:10.13.0-alpine

WORKDIR /app

COPY ./config /app
COPY ./index.js /app
COPY ./package.json /app

RUN npm install

EXPOSE 3000

ENV NAME sample

CMD ["node", "index.js"]
