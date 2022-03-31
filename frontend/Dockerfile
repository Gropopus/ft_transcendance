FROM node:14

WORKDIR /transcendance/frontend/src/app

COPY package*.json ./

RUN npm install

ENTRYPOINT npm run dev

EXPOSE 4200
