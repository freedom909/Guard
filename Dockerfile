# -------- build stage --------
FROM node:20-alpine AS build

WORKDIR /app

# install deps (cached layer)
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# build + test (CI 一致性关键)
RUN npm test
RUN npm run build

# -------- runtime stage --------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# only compiled output
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
