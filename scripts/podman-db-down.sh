#!/bin/sh
set -eu

ENV_FILE="podman/postgres.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo $ENV_FILE não encontrado. Nada para parar."
  exit 0
fi

set -a
. "$ENV_FILE"
set +a

if podman container exists "$POSTGRES_CONTAINER_NAME"; then
  podman stop "$POSTGRES_CONTAINER_NAME"
else
  echo "Container $POSTGRES_CONTAINER_NAME não existe."
fi
