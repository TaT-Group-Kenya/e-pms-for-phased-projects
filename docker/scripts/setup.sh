#!/bin/bash

echo "Setting up e-PMS application..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed. Please install Docker Compose."
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "Error: Docker is not running. Please start Docker."
    exit 1
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if containers are running
echo "Checking container status..."
docker-compose ps

echo ""
echo "==================================="
echo "e-PMS Application is now running!"
echo "==================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "MySQL: localhost:3306"
echo ""
echo "To stop the application, run: ./stop.sh"
echo "To view logs, run: docker-compose logs -f"
echo "==================================="