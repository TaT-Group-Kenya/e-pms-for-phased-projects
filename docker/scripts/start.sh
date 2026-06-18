#!/bin/bash

echo "Starting e-PMS application..."

# Stop any existing containers
docker-compose down

# Build and start containers
docker-compose up --build -d

echo "Application started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Database: localhost:3306"