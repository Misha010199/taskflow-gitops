FROM node:20 AS build

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy rest of code
COPY . .

# 🔥 Ensure production env is used
ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]