# Run NodusAI


## Docker compose
To run NodusAI with Docker Compose, you need to have Docker and Docker compose installed on your machine. You can install Docker and Docker compose by following the instructions on the [official Docker documentation](https://docs.docker.com/get-docker/).

The docker-compose file uses `latest` tag; it's recommended to pull the latest version of the images before running the docker-compose file.

```bash
docker compose pull
```

To start the NodusAI services, run the following command:

```bash
docker compose up
```

After running the command, you can access the NodusAI services at the following url: http://localhost:80.

Edit the `.env` file to change the port or other configurations.
## Compatibility note

NodusAI is currently built on the Langflow runtime. Internal package names,
CLI commands, `LANGFLOW_*` environment variables, database paths, and service
identifiers are intentionally kept unchanged where compatibility depends on
them. User-facing product branding and container metadata use NodusAI.
