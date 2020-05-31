FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY .babelrc ./
COPY tsconfig.json ./
COPY webpack.config.js ./

COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

RUN rm -rf public/
RUN rm -rf src/

EXPOSE 80
CMD [ "npm", "run", "serve" ]