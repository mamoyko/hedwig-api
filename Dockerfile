ARG dproxy_url

# Create build image (multi-stage)
FROM $dproxy_url/node:20.0-bullseye-slim AS build
# FROM $dproxy_url/node:18.12.0-alpine AS build

RUN apt-get update && apt-get upgrade -y

RUN node -v
RUN pwd

WORKDIR /hedwig_console_api

# Bundle app sources
COPY . .

RUN npm install --omit=dev --force

ARG env=test
ENV NODE_ENV=${env}

ARG port=8081
ENV PORT=${port}

RUN echo ls -la

EXPOSE ${port}

RUN cp .env.sample .env

RUN chmod +x run.sh
ENTRYPOINT [ "sh", "run.sh" ]
