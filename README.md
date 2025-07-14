# Cloud Storage Dashboard

## Run production version

```bash
docker compose up -d
```
Launch http://host.docker.internal:4000

Use these credentials to login: `user:user`

## Run development version

Install dependencies

```bash
yarn
```

### Services

```bash
docker compose up -d postgres s3ninja
```

S3Ninja UI is available at http://localhost:9000/ui
Postgres DB is available at postgres://localhost:5432

### Backend

```bash
cp ./backend/.env.example ./backend/.env
yarn workspace backend start:dev
```

SwaggerUI available at http://localhost:3000/swagger

### Frontend

```bash
cp ./frontend/.env.example ./frontend/.env
yarn workspace frontend start:dev
```

Frontend available at http://localhost:3001
