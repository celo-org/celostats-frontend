# Builder
FROM node:20-alpine as builder

RUN apk add --no-cache git

ADD . /app
WORKDIR /app

# prepare
RUN yarn

# build
ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build

# clean
RUN rm -rf ./src ./e2e ./node_modules

# Server
FROM node:20-alpine
LABEL org.opencontainers.image.authors="devops@clabs.co"

RUN apk add --no-cache nginx && \
    apk upgrade --no-cache

EXPOSE 80

RUN npm i -g @angular/service-worker
COPY --from=builder /app/dist/ /var/www/app
COPY --from=builder /app/ngsw-config.json /var/www/ngsw-config.json
COPY scripts/ /var/www/scripts
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT \
  /var/www/scripts/set-env-variables.js /var/www/app \
  && ngsw-config /var/www/app/ /var/www/ngsw-config.json / \
  && nginx -g "daemon off;"; \
  /bin/sh
