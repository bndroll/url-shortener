FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY data-service/package*.json ./
RUN npm install
COPY data-service/. ./
RUN npm run build
CMD ["node", "dist/main.js"]