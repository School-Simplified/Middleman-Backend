# Middleman Server Backend

This server is a rewrite of the old backend server and uses NestJS to use a REST API instead of GraphQL.

## Running locally

```sh
git clone https://github.com/School-Simplified/Middleman-Backend
cd Middleman-Backend
npm i
npx prisma generate
npm run start:dev # starts dev server on localhost:4000
```

Before running the dev server, make sure to create a `.env` file within the root folder that contains the `$DATABASE_URL` environmental variable that points to the staff db.
