FROM node:20-alpine as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]