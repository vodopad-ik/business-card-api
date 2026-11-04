#!/bin/sh
set -e

echo "Preparing database schema..."
npx prisma db push --accept-data-loss

echo "Running database seed..."
npx prisma db seed

echo "Starting Business Card API..."
exec "$@"