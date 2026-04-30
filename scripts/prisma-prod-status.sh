#!/bin/sh
set -eu

if [ -z "${DATABASE_URL_PROD:-}" ]; then
  echo "DATABASE_URL_PROD nao definido."
  echo "Exemplo:"
  echo "  export DATABASE_URL_PROD='postgresql://usuario:senha@host/database?sslmode=require&channel_binding=require'"
  exit 1
fi

DATABASE_URL="$DATABASE_URL_PROD" npx prisma migrate status
