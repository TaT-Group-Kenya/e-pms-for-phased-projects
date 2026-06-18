#!/bin/bash

echo "=================================="
echo "  e-PMS Docker Application Start"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    echo ""
    echo "If Docker is not installed:"
    echo "  - macOS: https://docs.docker.com/desktop/install/mac-install/"
    echo "  - Windows: https://docs.docker.com/desktop/install/windows-install/"
    echo "  - Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found!"
    exit 1
fi

echo "✅ docker-compose.yml found"
echo ""

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true
echo ""

# Build and start containers
echo "Building and starting containers..."
echo "This may take a few minutes for the first build..."
echo ""

docker-compose up --build -d

echo ""
echo "Waiting for services to initialize (15 seconds)..."
sleep 15

echo ""
echo "=================================="
echo "  Application Status"
echo "=================================="
echo ""

# Check if containers are running
if docker-compose ps --format "table {{.Name}}\t{{.Status}}" | grep -q "Up"; then
    echo "✅ All containers are running!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   Database: localhost:3306"
    echo ""
    echo "📊 Database Credentials:"
    echo "   Host:     localhost"
    echo "   Database: epms_db"
    echo "   User:     laravel_user"
    echo "   Password: secret"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   docker-compose logs -f          # View logs"
    echo "   docker-compose stop             # Stop application"
    echo "   docker-compose ps               # Check status"
    echo "   docker-compose exec backend php artisan migrate # Run migrations"
    echo ""
    echo "📝 Logs:"
    docker-compose logs --tail=10
    echo ""
    echo "=================================="
else
    echo "❌ Some containers failed to start"
    echo ""
    echo "Check the logs for details:"
    echo "   docker-compose logs"
    echo ""
    exit 1
fi