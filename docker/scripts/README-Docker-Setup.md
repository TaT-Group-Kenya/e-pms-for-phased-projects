# Complete Docker Setup for e-PMS Application

This guide explains how to run the e-PMS application using Docker for both the Laravel backend and Next.js frontend.

## Quick Start

### Prerequisites
- Docker Engine 20.0+
- Docker Compose 2.0+
- At least 4GB RAM allocated to Docker
- Ports 3000 and 8000 available

### One Command Setup
```bash
./setup.sh
```

Then open your browser to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MySQL     │     │   Laravel   │     │   Next.js   │
│    (db)     │────▶│  (backend)  │────▶│  (frontend) │
│  :3306      │     │   :9000     │     │   :3000     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Services Explained

### 1. MySQL Database (db)
- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: epms_db
- **User**: laravel_user / secret
- **Root Password**: root_password
- **Volume**: db_data (persists across restarts)

### 2. Laravel Backend (backend)
- **Base**: PHP 8.4 FPM Alpine
- **Extensions**: gd, pdo_mysql, mysqli, mbstring, xml, zip, opcache, redis
- **Internal Port**: 9000
- **Connects to**: MySQL database
- **Volumes**:
  - app code (bind mount)
  - storage (persistent)
  - cache (persistent)

### 3. Next.js Frontend (frontend)
- **Base**: Node.js 24.15.0 Alpine
- **Port**: 3000
- **Build**: Production build
- **Connects to**: Backend API

## Directory Structure

```
e-pms-for-phased-projects/
├── docker-compose.yml                    # Main configuration
├── setup.sh                             # Quick start script
├── validate-docker-setup.sh             # Validation script
├── test-docker-setup.sh                 # Test script
├── README-Docker-Setup.md               # This file
├── backend-for-frontend/                # Laravel backend
│   ├── .docker/
│   │   ├── Dockerfile                   # Backend container
│   │   ├── entrypoint.sh                # Initialization script
│   │   ├── nginx.conf                   # Web server config
│   │   └── php.ini                      # PHP settings
│   └── .env.docker                      # Docker environment
└── front-for-web/                       # Next.js frontend
    └── .docker/
        ├── Dockerfile                   # Frontend container
        └── entrypoint.sh                # Initialization script
```

## Installation Steps

1. **Clone/Download Project**
   ```bash
   cd /path/to/e-pms-for-phased-projects
   ```

2. **Run Validation**
   ```bash
   ./validate-docker-setup.sh
   ```

3. **Start Application**
   ```bash
   ./setup.sh
   ```

4. **Verify Setup**
   ```bash
   docker-compose ps
   ```

## Configuration Files

### Backend (.env.docker)
Key settings for Docker deployment:
```env
APP_ENV=production
APP_DEBUG=false
DB_HOST=db
DB_DATABASE=epms_db
DB_USERNAME=laravel_user
DB_PASSWORD=secret
SESSION_DRIVER=database
```

### Frontend (.env.production)
Environment variables:
```env
NEXT_PUBLIC_EPMS_API_BASE=http://backend:9000
```

## Common Commands

### Start Application
```bash
./setup.sh
# Or
docker-compose up --build -d
```

### Stop Application
```bash
./stop.sh
# Or
docker-compose stop
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Execute Commands

#### Laravel Artisan
```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Run seeders
docker-compose exec backend php artisan db:seed

# Cache clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan cache:clear
```

#### MySQL
```bash
# Access MySQL
docker-compose exec db mysql -u laravel_user -p secret epms_db

# Backup database
docker-compose exec db mysqldump -u laravel_user -p secret epms_db > backup.sql

# Restore database
docker-compose exec db mysql -u laravel_user -p secret epms_db < backup.sql
```

#### Frontend
```bash
# Run npm commands
docker-compose exec frontend npm run dev
docker-compose exec frontend npm run build
docker-compose exec frontend npm update
```

### Restart Services
```bash
docker-compose restart
docker-compose restart backend
docker-compose restart frontend
```

## Data Persistence

### Named Volumes
- `db_data` - MySQL database files
- `backend_storage` - Laravel storage (logs, uploads, etc.)
- `backend_bootstrap_cache` - Laravel cache files

### How to Back Up Data
```bash
# Backup MySQL
docker-compose exec db mysqldump -u laravel_user -p secret epms_db > backup.sql

# Backup Laravel storage
docker cp epms-backend:/var/www/html/storage ./storage-backup
```

### How to Restore Data
```bash
# Restore MySQL
docker-compose exec db mysql -u laravel_user -p secret epms_db < backup.sql

# Restore Laravel storage
docker cp ./storage-backup epms-backend:/var/www/html/storage
```

## Customization

### Change Ports
Edit `docker-compose.yml` ports section:
```yaml
ports:
  - "3000:3000"  # frontend
  - "3306:3306"  # mysql
```

### Add PHP Extensions
Edit `backend-for-frontend/.docker/Dockerfile`:
```dockerfile
RUN docker-php-ext-install [extension_name]
```

### Change MySQL Version
Edit `docker-compose.yml`:
```yaml
image: mysql:8.0  # Change to mysql:5.7, mysql:8.0, etc.
```

### Adjust PHP Settings
Edit `backend-for-frontend/.docker/php.ini`:
```ini
upload_max_filesize = 100M
post_max_size = 100M
memory_limit = 512M
max_execution_time = 300
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 [PID]
```

#### 2. Container Won't Start
```bash
# Check logs
docker-compose logs [container-name]

# Rebuild container
docker-compose up --build [container-name]
```

#### 3. Database Connection Failed
```bash
# Check MySQL is running
docker-compose ps db

# Test connectivity
docker-compose exec backend ping db
```

#### 4. Frontend Can't Connect to Backend
```bash
# Check backend is accessible
docker-compose exec frontend ping backend

# Verify environment variables
docker-compose exec frontend env | grep API
```

### Reset Everything
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes all data!)
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Production Deployment

### Security Considerations
1. **Change Default Passwords**
   - Update `MYSQL_ROOT_PASSWORD`
   - Update `DB_PASSWORD`
   - Generate new `APP_KEY`

2. **Disable Debug Mode**
   - Set `APP_DEBUG=false`
   - Set `LOG_CHANNEL=stderr`

3. **Configure SSL**
   - Add SSL certificates
   - Configure HTTPS redirect

4. **Implement Monitoring**
   - Add health checks
   - Configure logging
   - Set up alerts

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
docker-compose exec db mysqldump -u laravel_user -p secret epms_db | gzip > backup-$(date +%Y%m%d).sql.gz
```

### Performance Tuning
- Increase PHP memory limit
- Optimize MySQL configuration
- Enable OPcache
- Use CDN for static assets

## Development Workflow

### Development Mode
```bash
# For development, use docker-compose with override
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Hot Reloading
For development with file changes:
```bash
# Mount volumes for live reloading
# Use docker-compose.dev.yml for dev-specific settings
```

### Debugging
```bash
# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check PHP extensions
docker-compose exec backend php -m

# Check Node modules
docker-compose exec frontend npm list
```

## Support

For issues or questions:

1. **Check Logs**
   ```bash
   docker-compose logs
   ```

2. **Verify Setup**
   ```bash
   ./test-docker-setup.sh
   ```

3. **Restart Services**
   ```bash
   docker-compose restart
   ```

4. **Reset Environment**
   ```bash
   ./stop.sh
   ./setup.sh
   ```

## File Structure Reference

### Backend Docker Files
- `.docker/Dockerfile` - PHP 8.4 FPM container
- `.docker/entrypoint.sh` - Initialization script
- `.docker/nginx.conf` - Web server config
- `.docker/php.ini` - PHP settings

### Frontend Docker Files
- `.docker/Dockerfile` - Node.js 24 container
- `.docker/entrypoint.sh` - Initialization script

### Main Configuration
- `docker-compose.yml` - Service definitions
- `.env.docker` - Backend environment
- `.env.production` - Frontend environment

## License

Part of the e-PMS suite.