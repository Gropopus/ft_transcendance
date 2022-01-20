# stage 1: build
FROM node:16.13.2 AS development

WORKDIR /frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@13.1.4

COPY . .

RUN npm run build

EXPOSE 4200