# Cloud Storage Dashboard

## Run production version

```bash
docker compose up -d
```
Launch http://localhost:4000/

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

## Troubleshooting


### Linux: host.docker.internal Resolution

On Linux, Docker containers might fail to resolve host.docker.internal when trying to connect to services on the host machine. This is because Docker doesn't automatically add this entry to /etc/hosts.

Symptom: "Name or service not known" or "Could not resolve host" errors from containers.

Solution: Manually add 127.0.0.1 host.docker.internal to your host's /etc/hosts file.

Edit /etc/hosts with superuser privileges:

```bash
sudo nano /etc/hosts
```

Add this line to the end of the file:

```bash
127.0.0.1 host.docker.internal
```