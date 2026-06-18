# Docker Configuration for e-PMS

This directory contains Docker configurations for both the Laravel backend and Next.js frontend.

## Directory Structure

```
docker/
├── README.md                         # This file - general Docker information
├── scripts/                          # Docker-related scripts
│   ├── start.sh                      # Build and start containers
│   ├── stop.sh                       # Stop containers
│   ├── setup.sh                      # Full setup script
│   ├── real-start.sh                 # Detailed start with status checks
│   ├── test-docker-setup.sh          # Test Docker configuration
│   ├── validate-docker-setup.sh      # Validate Docker setup
│   └── README-Docker-Setup.md        # Detailed setup guide
├── backend/                          # Backend (Laravel) configuration
│   ├── Dockerfile                    # PHP 8.4 FPM container with Laravel
│   ├── entrypoint.sh                 # Initialization script
│   ├── nginx.conf                    # Nginx configuration
│   └── php.ini                       # PHP configuration
└── frontend/                         # Frontend (Next.js) configuration
    ├── Dockerfile                    # Node.js container with Next.js
    └── entrypoint.sh                 # Initialization script
```

## Backend Configuration (Laravel)

### Files (in `docker/backend/`):
- **Dockerfile** - Builds PHP 8.4 FPM container with Laravel dependencies
- **entrypoint.sh** - Initializes database, runs migrations, starts PHP-FPM
- **nginx.conf** - Nginx web server configuration for Laravel
- **php.ini** - PHP configuration for production

### Key Features:
- PHP 8.4 with extensions (gd, pdo_mysql, mysqli, mbstring, xml, zip, opcache, redis)
- Multi-stage build for optimized images
- Persistent storage for Laravel storage and cache directories
- Automated database migration on startup

## Frontend Configuration (Next.js)

### Files (in `docker/frontend/`):
- **Dockerfile** - Builds Node.js 24 container with Next.js
- **entrypoint.sh** - Waits for backend, sets environment variables, starts Next.js

### Key Features:
- Node.js 24.15.0 Alpine image for minimal size
- Non-root user for security
- Production build optimization
- Automated dependency installation

## Docker Compose Services

The main `docker-compose.yml` defines:

1. **db** (MySQL 8.0)
   - Database server with persistent storage
   - Root password: `root_password`
   - Database: `epms_db`
   - User: `laravel_user` / `secret`

2. **backend** (PHP 8.4 + Laravel)
   - API server for the application
   - Internal port: 9000
   - Connects to MySQL database
   - Uses persistent storage for logs and cache

3. **frontend** (Node.js 24 + Next.js)
   - Web interface
   - Port: 3000
   - Connects to backend API

## Usage

### Quick Start
```bash
cd docker/scripts && ./start.sh
```

### Manual Commands
```bash
# Build and start
docker-compose up --build -d

# Stop
docker-compose stop

# View logs
docker-compose logs -f

# Run Laravel commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed

# Access MySQL
docker-compose exec mysql mysql -u laravel_user -p secret epms_db
```

### Scripts in docker/scripts/
- **start.sh** - Build and start containers
- **stop.sh** - Stop containers
- **setup.sh** - Full setup script
- **real-start.sh** - Detailed start with status checks
- **test-docker-setup.sh** - Test Docker configuration
- **validate-docker-setup.sh** - Validate Docker setup

## Environment Configuration

### Backend (.env.docker)
Copy `.env.docker` to `.env` for Docker deployment:
```bash
cp backend-for-frontend/.env.docker backend-for-frontend/.env
```

### Frontend (.env.production)
Ensure these variables are set:
```env
NEXT_PUBLIC_EPMS_API_BASE=http://backend:9000
```

## Data Persistence

Named volumes ensure data persists across container restarts:
- `db_data` - MySQL database files
- `backend_storage` - Laravel storage (logs, uploads, etc.)
- `backend_bootstrap_cache` - Laravel cache files

## Customization

### Change PHP Settings
Edit `docker/backend/php.ini`:
```ini
upload_max_filesize = 100M
post_max_size = 100M
memory_limit = 512M
max_execution_time = 300
```

### Add PHP Extensions
Edit `docker/backend/Dockerfile`:
```dockerfile
RUN docker-php-ext-install [extension_name]
```

### Change MySQL Version
Edit `docker-compose.yml`:
```yaml
image: mysql:8.0  # Change to your preferred version
```

## Production Deployment

For production use:

1. Update passwords in `.env` and `docker-compose.yml`
2. Set `APP_DEBUG=false` in backend `.env`
3. Configure SSL certificates
4. Implement proper logging
5. Set up health checks
6. Configure backup procedures

## Troubleshooting

### Container won't start
```bash
docker-compose logs [container-name]
```

### Database connection failed
```bash
# Check MySQL is running
docker-compose ps db

# Test connection
docker-compose exec backend ping db
```

### Port conflicts
```bash
# Check what's using the port
lsof -i :3000  # or your port number

# Kill the process
kill -9 [PID]
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```