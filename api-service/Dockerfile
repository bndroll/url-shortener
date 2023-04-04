FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY api-service/package*.json ./
RUN npm install
COPY api-service/. ./
EXPOSE 3000
RUN npm run build
CMD ["node", "dist/main.js"]