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
COPY --from=builder /app/dist/ /var/www/app
COPY scripts/ /var/www/scripts
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT /var/www/scripts/set-env-variables.js /var/www/app && nginx -g "daemon off;"; /bin/bash
