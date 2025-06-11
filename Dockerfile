# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
WORKDIR /temp/dev
COPY package.json .
COPY . .
RUN bun install --frozen-lockfile
RUN apt-get update -y && apt-get install -y openssl

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun test
RUN bun run build

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY prisma prisma
COPY --from=install /temp/dev/generated generated
COPY --from=prerelease /usr/src/app/dist ./dist
COPY package.json .
USER bun

COPY start.sh .
ENTRYPOINT [ "sh", "./start.sh" ]



# # use the official Bun image
# # see all versions at https://hub.docker.com/r/oven/bun/tags
# # FROM oven/bun:1 AS base
# FROM node:20-alpine AS base
# WORKDIR /usr/src/app

# # install dependencies into temp directory
# # this will cache them and speed up future builds
# FROM base AS install
# RUN mkdir -p /temp/dev
# WORKDIR /temp/dev
# COPY package.json .
# COPY . .
# RUN npm install
# # RUN apt-get update -y && apt-get install -y openssl

# FROM base AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .
# ENV NODE_ENV=production
# # RUN bun test
# RUN npm run build

# FROM base AS release
# COPY --from=install /temp/dev/node_modules node_modules
# COPY prisma prisma
# COPY --from=install /temp/dev/generated generated
# COPY --from=prerelease /usr/src/app/dist ./dist
# COPY package.json .
# # USER bun
# EXPOSE 3000/tcp

# ENTRYPOINT [ "npm", "run", "start" ]
# # COPY start.sh .
# # ENTRYPOINT [ "sh", "./start.sh" ]