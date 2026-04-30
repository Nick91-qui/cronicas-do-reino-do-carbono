#!/bin/sh
set -eu

if [ -z "${DATABASE_URL_PROD:-}" ]; then
  echo "DATABASE_URL_PROD nao definido."
  echo "Exemplo:"
  echo "  export DATABASE_URL_PROD='postgresql://usuario:senha@host/database?sslmode=require&channel_binding=require'"
  exit 1
fi

echo "Este comando aplicara migrations no banco de PRODUCAO."
echo "Para continuar, digite exatamente: PRODUCAO"
printf "> "
read -r confirmation

if [ "$confirmation" != "PRODUCAO" ]; then
  echo "Operacao cancelada."
  exit 1
fi

echo "Aplicando migrations pendentes em producao..."
DATABASE_URL="$DATABASE_URL_PROD" npx prisma migrate deploy
