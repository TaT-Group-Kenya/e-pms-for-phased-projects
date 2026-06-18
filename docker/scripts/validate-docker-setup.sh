#!/bin/bash

echo "Checking Docker setup for e-PMS..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi
echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi
echo "✅ Docker Compose is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi
echo "✅ Docker is running"

# Check required files
echo "Checking required files..."

files=(
    "docker-compose.yml"
    "docker/backend/Dockerfile"
    "docker/backend/entrypoint.sh"
    "docker/backend/php.ini"
    "docker/frontend/Dockerfile"
    "docker/frontend/entrypoint.sh"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done

# Check if scripts are executable
echo "Checking script permissions..."
if [ -x "docker/scripts/start.sh" ] && [ -x "docker/scripts/stop.sh" ]; then
    echo "✅ Scripts are executable"
else
    echo "⚠️  Scripts may not be executable. Running chmod +x..."
    chmod +x docker/scripts/start.sh docker/scripts/stop.sh
    echo "✅ Scripts are now executable"
fi

# Check if .env files exist
echo "Checking environment files..."
if [ -f "backend-for-frontend/.env.docker" ]; then
    echo "✅ Backend .env.docker exists"
else
    echo "⚠️  Backend .env.docker not found. Using existing .env if available."
fi

# Check network ports
echo "Checking network ports..."
if lsof -i :3000 &> /dev/null; then
    echo "⚠️  Port 3000 is already in use"
fi
if lsof -i :8000 &> /dev/null; then
    echo "⚠️  Port 8000 is already in use"
fi
echo "✅ Port check completed"

echo ""
echo "================================"
echo "✅ Docker setup validation passed!"
echo "================================"
echo "You can now run ./setup.sh to start the application"
echo "Or run: docker-compose up --build -d"