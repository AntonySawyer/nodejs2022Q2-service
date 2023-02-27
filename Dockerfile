# Build for local development
FROM node:18-alpine as development

ARG APP_PORT

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${APP_PORT}
