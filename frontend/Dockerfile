FROM node:17

WORKDIR /transcendance/frontend/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200
ENTRYPOINT npm run dev
