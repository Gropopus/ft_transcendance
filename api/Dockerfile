# specifier la version de node et de l'image
# nom de image delelopment
FROM node:16.13.2 AS development

#specifie le directory dans le container
WORKDIR /src/app

# copie les package-lock.json & package.json de l'host au working directory
COPY package*.json ./

# install dans le container
RUN npm install

# Bundle App Sources
COPY . .

RUN npm run build

EXPOSE 3000

#######################################
#              PRODUCTION             #
#######################################

# Build une image production
FROM node:16.13.2 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src/app

COPY --from=development /src/app/ .

EXPOSE 8080

#run app
CMD [ "node", "dist/main" ]