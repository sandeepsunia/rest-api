FROM node:latest
MAINTAINER Sandeep Sunia <sandy.iiita@gmail.com>

ENV NODE_ENV production
EXPOSE 3001

RUN apt-get update \
	&& apt-get install -y python-software-properties git build-essential

RUN npm install -g pg pg-hstore sequelize sequelize-cli node-gyp yarn webpack rimraf cross-env babel-cli
RUN yarn add sequelize-log-syntax-colors webpack rimraf cross-env
RUN yarn add global  webpack rimraf cross-env

ADD package.json /tmp/package.json
RUN cd /tmp && yarn


RUN mkdir -p /app && cp -a /tmp/node_modules /app

WORKDIR /app
ADD . /app
ENTRYPOINT ["bash", "-c"]
CMD ["yarn start"]
