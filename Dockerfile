FROM mhart/alpine-node:9 as BUILD
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --production --pure-lockfile



FROM mhart/alpine-node:base-9 as PROD
RUN apk add --no-cache tini
WORKDIR /app

COPY . .
COPY --from=BUILD /app/node_modules/ /app/node_modules/

ENTRYPOINT ["/sbin/tini", "--", "node", "index.js"]
CMD ["start"]
