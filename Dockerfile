FROM node:10.13.0-alpine

WORKDIR /app

ADD ./config /app/config
COPY ./index.js /app
COPY ./package.json /app

RUN npm install

EXPOSE 3000

ENV NAME sample

CMD ["node", "index.js"]
