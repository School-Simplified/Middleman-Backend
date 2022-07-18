FROM node:16.15 as build

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm i

COPY . .

RUN npm run build


FROM node:16.15
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
EXPOSE 80
CMD npm run start:prod
