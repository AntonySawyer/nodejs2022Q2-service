# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Steps to run app

### 1) Downloading

```
git clone https://github.com/AntonySawyer/nodejs2022Q4-service.git
```

### 2) Add settings

1. create `.env` file and copy `.env.sample` values into this file (replace values, if needed)
2. make sure that you are use correct version of node (`node -v` should return v18.\*\*.\*\*)

### 3) Run app

> You have two options for run: with or without Docker. Recommended way - run using Docker.

### Without Docker _(not recomended)_

<details>
  <summary>How run app without Docker (click arrow for expand steps)</summary>

#### 3.1) Installing NPM modules

```
npm install
```

#### 3.2) Running application

```
npm start
```

#### 3.3) Check

> [Go to `Check if it works` section](#check-if-it-works)

</details>
<br>

### Run with Docker

> It's recommended way.

#### 3.1) Install Docker

> If you already setup Docker earlier - skip this step.

Go to the official docs for install [Docker](https://docs.docker.com/engine/install/).

#### 3.2) Run app

```shell
docker-compose up
```

#### Common troubles with run:

1. `ERROR: for db  Cannot create container for service postgress: Conflict. The container name "/db" is already in use by container`
   > `db` can be replaced with `app` - error can be resolved in same way.

> We compose under `nodejs2022q4-service` containers with names `app` and `db`. So, if you already have such group and containers names, you have several options for resolve such errors:

- remove or rename own containers
- rename containers used in this repo (make sure you update names in all places of usage)

<br />

#### 3.3) Check

> [Go to `Check if it works` section](#check-if-it-works)

</details>
<br>

## Check if it works

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

> Path and port can be configured at `.env` file.

## Testing

> All commands valid for both options to run. If you use [Run with Docker](#run-with-docker) option, you should run those commands inside container.
> You can simply add `docker exec app` before command. For example, to run **tests** use next command:

```
  docker exec app npm run test
```

> If you or your system use different names - replase `app` with updated name or target `CONTAINER_ID` (You could see it after run command `docker ps`)

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## npm script for vulnerabilities scanning (free solution)

To scan images for security vulnerabilities run next script in the root folder of project (docker images should be builded).

```
npm run scan
```

> For correct work of script you should login with own creds.

<br />

<details>
  <summary>Options to pull/push for owner</summary>

Images pushed into private docker hub repository.

> In case of you have creds from related docker hub private repo, you can use following commands:

For get database image:

```
docker pull antonysawyer/home-library:db
```

For get application image:

```
docker pull antonysawyer/home-library:app
```

For push image to docker hub private repository (replace `tagname` to real one):

```
docker push antonysawyer/home-library:tagname
```

</details>
