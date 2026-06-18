#!/bin/bash

echo "Testing Docker setup for e-PMS..."

# Check Docker
echo "Checking Docker installation..."
docker --version

# Check Docker Compose
echo "Checking Docker Compose..."
docker-compose --version

# Check if docker-compose.yml exists
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml found"
else
    echo "❌ docker-compose.yml not found"
    exit 1
fi

# Validate docker-compose syntax
echo "Validating docker-compose.yml syntax..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml syntax is valid"
else
    echo "❌ docker-compose.yml has syntax errors"
    exit 1
fi

# Check required directories
echo "Checking required directories..."
if [ -d "docker/backend" ]; then
    echo "✅ Backend docker directory exists"
else
    echo "❌ Backend docker directory missing"
    exit 1
fi

if [ -d "docker/frontend" ]; then
    echo "✅ Frontend docker directory exists"
else
    echo "❌ Frontend docker directory missing"
    exit 1
fi

# Check configuration files
echo "Checking configuration files..."
files_to_check=(
    "docker/backend/Dockerfile"
    "docker/backend/entrypoint.sh"
    "docker/backend/php.ini"
    "docker/backend/nginx.conf"
    "docker/frontend/Dockerfile"
    "docker/frontend/entrypoint.sh"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "================================"
echo "✅ Docker setup test passed!"
echo "================================"
echo "You can now run: ./setup.sh"
echo "Or manually: docker-compose up --build -d"