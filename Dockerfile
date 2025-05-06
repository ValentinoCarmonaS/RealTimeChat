# Dockerfile

FROM node:16-slim

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
EXPOSE ${PORT}
CMD ["npm", "start"]
