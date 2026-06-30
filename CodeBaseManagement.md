# CodeBase Management Guide

## Development Workflow

### 1. Clone the Repository
```bash
git clone https://github.com/mwangome254/e-pms.git
cd e-pms
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
```bash
# Edit files as needed
# Test your changes locally
```

### 4. Push Branch and Request Review
```bash
git add .
git commit -m "Describe your changes"
git push origin feature/your-feature-name
```
> Open a pull request on GitHub and wait for code review and merge approval.

### 5. Deploy to Production Server
Login to the Ubuntu VM:
```bash
ssh your-username@41.242.3.93
```

### 6. Update Code on Server
```bash
cd /var/www/
sudo git pull origin main
```

### 7. Reload Services
Follow the deployment documentation to reload:
- **NextJS frontend**: Build and restart the NextJS application
- **Laravel backend**: Clear caches, run migrations if any and restart services
- **Nginx**: Reload the web server
```bash
# Example commands:
cd front-for-web && sudo npm run build && pm2 restart e-pms-app
cd backend-for-frontend && sudo php artisan optimize && sudo php artisan config:clear
sudo systemctl restart nginx
```

---

**Note**: Always ensure your local development is tested before pushing to feature branches.