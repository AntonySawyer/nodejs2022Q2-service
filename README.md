# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js v18 - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker [Download & Install Docker](https://docs.docker.com/engine/install/).

## Steps to run app

### 1) Downloading

```
git clone https://github.com/AntonySawyer/nodejs2022Q4-service.git
```

### 2) Checkout correct branch `feat/postgress-and-orm`

### 3) Add settings

1. create `.env` file in root of project and copy `.env.sample` values into this file (replace values, if needed)
2. make sure that you are use correct version of node (`node -v` should return v18.\*\*.\*\*)

### 4) Run app with Docker

#### 4.1) Install Docker

> If you already setup Docker earlier - skip this step.

Go to the official docs for install [Docker](https://docs.docker.com/engine/install/).

#### 4.2) Build and run app

```shell
docker-compose up
```

#### Possible troubles with run:

1. `ERROR: for db  Cannot create container for service postgress: Conflict. The container name "/db" is already in use by container`
   > `db` can be replaced with `app` - error can be resolved in same way.

> We compose under `nodejs2022q4-service` containers with names `app` and `db`. So, if you already have such group and containers names, you have several options for resolve such errors:

- remove or rename own containers
- rename containers used in this repo (make sure you update names in all places of usage)

<br />

#### 4.3) Check

> [Go to `Check if it works` section](#check-if-it-works)

</details>
<br>

## Check if it works

- Check that console incluse success `nestjs` messages after `Starting compilation in watch mode...` log. In case your terminal freeze at previous step - reload app (otherwise - some relations features wouldn't work properly)
- Run `docker exec app npm run test` - all tests should be passed. In case you have some failed tests - check previous point and try to reload app. Replace `app` in command if needed (see `Testing` section).
- After starting the app on port (4000 as default) you can open
  in your browser OpenAPI documentation by typing http://localhost:4000/doc.
  For more information about OpenAPI/Swagger please visit https://swagger.io/.

> Path and port can be configured at `.env` file.

## Testing

> If you or your system use different names - replace `app` in all commands with updated name or target `CONTAINER_ID` (You could see it after run command `docker ps`)

After application running open new terminal and enter:

To run all tests without authorization

```
docker exec app npm run test
```

To run only one of all test suites

```
docker exec app npm run test -- <path to suite>
```

To run all test with authorization

```
docker exec app npm run test:auth
```

To run only specific test suite with authorization

```
docker exec app npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
docker exec app npm run lint
```

```
docker exec app npm run format
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

<br />

### Possible problems with app launch

- If error message say that port for DB already used at your system:

  > 1. Finish process, that used this port (5432 by default, if you do not change related `.env` variable)
  > 2. If you do not want get this port to app - define other port in `.env`
  > 3. relaunch app starting from `docker-compose up`

  <br />

- If some system return any error about missing entity for DB:

  > There is 99% chanses that this error related to wrong previous launch, app build or same names with other apps created from same template. For resolve problem:
  >
  > 1. Stop Docker containers (using cli or UI app/extension)
  > 2. Remove related to app Docker containers, images and **volumes** (using cli or UI app/extension, removing `volumes` are very important part. Related `volumes` named in format `nodejs2022q2-service_db-{TYPE}` (TYPE equals `logs` and `data`)
  > 3. Relaunch app starting from `docker-compose up`

    <br />
