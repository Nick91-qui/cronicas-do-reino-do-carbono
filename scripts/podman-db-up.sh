#!/bin/sh
set -eu

ENV_FILE="podman/postgres.env"
EXAMPLE_FILE="podman/postgres.env.example"

if [ ! -f "$ENV_FILE" ]; then
  cp "$EXAMPLE_FILE" "$ENV_FILE"
  echo "Arquivo $ENV_FILE criado a partir do template. Revise os valores antes de continuar se necessário."
fi

set -a
. "$ENV_FILE"
set +a

if podman container exists "$POSTGRES_CONTAINER_NAME"; then
  podman start "$POSTGRES_CONTAINER_NAME"
else
  podman run -d \
    --name "$POSTGRES_CONTAINER_NAME" \
    -e POSTGRES_DB="$POSTGRES_DB" \
    -e POSTGRES_USER="$POSTGRES_USER" \
    -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    -p "$POSTGRES_PORT":5432 \
    -v "$POSTGRES_VOLUME_NAME":/var/lib/postgresql/data \
    "$POSTGRES_IMAGE"
fi

echo "PostgreSQL local disponível em postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB?schema=public"
