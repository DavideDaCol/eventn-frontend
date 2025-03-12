FROM node:lts-alpine AS vite-build
WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS serve-pages
COPY --from=vite-build /build/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
