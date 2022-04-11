FROM node:17

WORKDIR /transcendance/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "dist/main" ]
