FROM node:14

WORKDIR /transcendance/frontend/src/app

COPY . .

RUN npm install -g @vue/cli

RUN npm install

ENTRYPOINT npm run dev

EXPOSE 4200
