FROM node:16-alpine as build-step
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
COPY webpack.config.js ./
COPY .babelrc ./
COPY ./src ./src
COPY ./static/frontend/public ./static/frontend/public
RUN npm install
RUN npm run build
