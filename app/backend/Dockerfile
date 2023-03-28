FROM node:16.14-alpine
WORKDIR /app-backend

COPY package*.json ./
EXPOSE 3001
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]