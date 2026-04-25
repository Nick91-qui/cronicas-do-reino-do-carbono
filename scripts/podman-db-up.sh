#!/bin/sh
set -eu

ENV_FILE="podman/postgres.env"
EXAMPLE_FILE="podman/postgres.env.example"
LOCAL_ENV_FILE=".env.local"
MANAGED_START="# >>> crc local db override >>>"
MANAGED_END="# <<< crc local db override <<<"

if [ ! -f "$ENV_FILE" ]; then
  cp "$EXAMPLE_FILE" "$ENV_FILE"
  echo "Arquivo $ENV_FILE criado a partir do template. Revise os valores antes de continuar se necessário."
fi

set -a
. "$ENV_FILE"
set +a

DATABASE_URL_LOCAL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB?schema=public"

write_local_env_override() {
  TMP_FILE="$(mktemp)"

  if [ -f "$LOCAL_ENV_FILE" ]; then
    awk -v start="$MANAGED_START" -v end="$MANAGED_END" '
      $0 == start { skip = 1; next }
      $0 == end { skip = 0; next }
      skip != 1 && $0 !~ /^DATABASE_URL=/ && $0 !~ /^APP_BASE_URL=/ { print }
    ' "$LOCAL_ENV_FILE" > "$TMP_FILE"
  fi

  {
    cat "$TMP_FILE"
    if [ -s "$TMP_FILE" ]; then
      printf "\n"
    fi
    printf "%s\n" "$MANAGED_START"
    printf "DATABASE_URL=\"%s\"\n" "$DATABASE_URL_LOCAL"
    printf "APP_BASE_URL=\"http://localhost:3000\"\n"
    printf "%s\n" "$MANAGED_END"
  } > "$LOCAL_ENV_FILE"

  rm -f "$TMP_FILE"
}

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

write_local_env_override

echo "PostgreSQL local disponível em $DATABASE_URL_LOCAL"
echo ".env.local atualizado para usar o banco local em desenvolvimento."
