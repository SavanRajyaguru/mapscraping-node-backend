FROM node:21

COPY package*.json ./

WORKDIR /opt/server/backend-scap

COPY . .

RUN npm install
EXPOSE 5000
CMD [ "node", "index.js" ]