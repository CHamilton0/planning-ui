FROM node:20-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/planning-ui/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/
COPY nginx.conf /etc/nginx/
EXPOSE 80
