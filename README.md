# Middleman Server API

This repository contains the source code for the middleman server. Throughout this README, the terms "middleman server", "staff webapp", or related phrases refer to the same application. I want this server to eventually expand and host a variety of services related to SS staff internals; as such, it is important to build a backend that is scalable, secure, and extensible. All developers should keep this in mind when contributing to that backend API.

## Entities

The staff server will ultimately be accessibly by the entire SS staff and will serve a variety of purposes. As such, access to services are based on the status of staff members and whether or not they are authorized. It is difficult to determine which staff members should be able to access which services, but for now we distinguish them between associates and management members.

### Associates

An associate generally does **not** have access to administrative APIs and services like managing users through the staff server. As such, they do not require a strict level of authentication and will be able to login through a basic username/password combination.

### Management

A user with the scope of management or higher **does** have access to administrative APIs. Most notably is the access to Google administrative services such as creating GSuite accounts, contract assignment, etc. Because of this, they must authorize through Google to prove their identity and permission scopes.

## Hosting

The backend itself is hosted on AWS' Elastic Beanstalk using a single EC2 cloud instance. As of right now, the staff database is hosted on Airtable. If resource availability becomes an issue, then migrating it to GCP or AWS might be considered. The frontend itself is hosted on Vercel.

## Google

Automation regarding GSuite accounts is one of the administrative services provided in the staff server. In this context, a 'task' can be thought of any of the following:

- Creating email accounts
- Deleting email accounts
- Assigning contracts
- Scheduling Meets
- ...

Each 'task' should be assigned a 'function' that accomplishes that sole purpose. These functions are hosted on Google Cloud, through the App Script Platform. If an authorized user wants to 'execute' a function to achieve a task, they do so by calling the App Script API by sending an HTTP request, and within that request, specifying the name of the function they would like to execute and the parameters to pass to it. Ultimately, this means that such functions are executed in the permission scope of the requesting user; that is to say, the App Script API does actions on behalf of the user.

## Libraries Used

The primary language used in the backend is TypeScript. The following libraries are used:

- Nest.js - Backend server-side framework. It extends off of Express.js and uses a modular design, heavily inspired by Angular.
- Prisma - The ORM used for this server. Prisma communicates with the staff database and leverages TypeScript to provide a type-safe client/
- Passport - The authentication library used to restrict API routes based on a 'strategy' - in this case, our strategy revolves around a JWT token.

## Authentication / API Route Documentation.

\*_As of right now, only management level authentication is supported._

Acquire a JWT token by visiting `/google`. This will prompt you for Google authorization and redirect you to the app homepage with the `token` query parameter in the URL. This is the JSON web token used to give you access to restricted routes. Use this token in **all** API requests as a Bearer token. For example,

```js
import axios from 'axios';
const token = '...'; // ideally the JWT is stored somewhere in cache or LocalStorage
const response = await axios.get(
  'https://api.schoolsimplified.org/auth/hello',
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
```

For the rest of this documentation, a `User` refers to both associates and management-level users. A `User` can be one or the other. To view the schema of a `User`, visit `prisma/schema.prisma`

### `GET /api/volunteers/`

Returns `User[]`

### `POST /api/volunteers/`

- Body: `User`

If successful in creating a user, returns an array of length 2. The first item in the array is the newly created `User`, while the second item is the corresponding user's GSuite account information. Else, returns either HTTP 401 (unauthorized) or HTTP 400 (bad request)

### `GET /api/volunteers/:id`

Returns `User`, given a valid `id`

### `POST /api/volunteers/many`

- Body: `User[]`
- Returns: `int`

Creates many users in batch format. **Does not create any GSuite accounts**. Returns the amount of users successfully created.

### `PUT /api/volunteers/:id`

- Body: `User`
- Returns: `User`

Updates a user based on the given ID.

### `DELETE /api/volunteers/:id`

Do I really need to explain this?

### `GET /auth/hello`

- Returns:

```js
{
    "name": string,
    "email": string,
    "picture": string,
}
```

## Setting Up for Development

```sh
$ git clone https://github.com/School-Simplified/Middleman-Backend backend
$ cd backend
$ npm I
$ npx prisma generate
$ npm run start:dev # starts dev server on localhost:8000
```

Message Josef (pancakes#1412) for proper environmental variables before working.
