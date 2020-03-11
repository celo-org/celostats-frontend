# Builder
FROM node:13 as builder

ADD . /app
WORKDIR /app

# prepare
RUN yarn

# build
ENV NODE_ENV=production
RUN yarn build

# clean
RUN rm -rf ./src ./e2e ./node_modules

# Server
FROM nginx:latest
EXPOSE 80
RUN apt-get update -y \
  && apt-get install curl -y \
  && curl -sL https://deb.nodesource.com/setup_12.x | /bin/bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*
RUN npm i -g @angular/service-worker
COPY --from=builder /app/dist/ /var/www/app
COPY --from=builder /app/ngsw-config.json /var/www/ngsw-config.json
COPY scripts/ /var/www/scripts
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT \
  /var/www/scripts/set-env-variables.js /var/www/app \
  && ngsw-config /var/www/app/ /var/www/ngsw-config.json / \
  && nginx -g "daemon off;"; \
  /bin/bash
