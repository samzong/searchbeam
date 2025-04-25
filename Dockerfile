FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production --ignore-scripts

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"] 