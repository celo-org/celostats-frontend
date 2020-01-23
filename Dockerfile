FROM node:13

ADD . /celostats-frontend
WORKDIR /celostats-frontend

# prepare
RUN yarn
RUN yarn global add serve @angular/cli@^9.0.0-rc.10

# build
ENV NODE_ENV=production
RUN yarn build --prod

# clean
RUN rm -rf ./src ./e2e ./node_modules

EXPOSE 5000
CMD ["serve", "-s", "./dist/ethstats-frontend"]
