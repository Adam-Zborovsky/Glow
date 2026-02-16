#!/bin/sh

# Wait for database to be ready (optional but good)
# echo "Waiting for database..."
# until nc -z glow-db 5432; do
#   sleep 1
# done

# Sync database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed database if needed (optional)
echo "Seeding database..."
npx prisma db seed

# Start the application
echo "Starting application..."
node server.js
