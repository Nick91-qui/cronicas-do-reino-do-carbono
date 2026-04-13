#!/bin/sh
set -eu

ENV_FILE="podman/postgres.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Arquivo $ENV_FILE não encontrado."
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

podman logs -f "$POSTGRES_CONTAINER_NAME"
