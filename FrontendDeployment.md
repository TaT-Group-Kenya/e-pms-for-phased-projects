1. Install Node.js and PM2

```bash
# Install Node.js 24.15.0
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

2. Set Up  Nextjs Application

```bash
# Create application directory
sudo chown -R $USER:$USER /var/www/front-for-web

# Go to root of your app folder
cd /var/www/front-for-web
```

3. Create Environment files
- Create `.env.local` and `.env.production` files in the root folder and paste the following into the files:

```bash
EPMS_API_BASE="https://project.sanctionscreening.africa:8443/e-pms/api/v1"
NEXT_PUBLIC_EPMS_API_BASE="https://project.sanctionscreening.africa:8443/storage/logos/"
```


4. Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

5. Spin up PM2 and save to run on start-up

```bash
pm2 start npm --name "e-pms-app" -- start

pm2 save

# Configure PM2 to start on system boot
pm2 startup
# Run the command that PM2 outputs
```

6. Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/nextjs-ui-app
```
- Now, add the following configs:

```bash
server {
    listen 80;
    server_name project.sanctionscreening.africa www.project.sanctionscreening.africa;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logs
    access_log /var/log/nginx/epms-app-access.log;
    error_log /var/log/nginx/epms-app-error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        alias /var/www/front-for-web/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /var/www/front-for-web/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

- Enable the created configs

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/nextjs-ui-app /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

7. Test the app on HTTP

- navigate to https://project.sanctionscreening.africa and ensure the app works.

8. Configure SSL

- Run certbot to generate SSL certificates - if you already run this, skip it.

```bash
sudo certbot certonly --standalone --preferred-challenges http \
    -d project.sanctionscreening.africa -d www.project.sanctionscreening.africa \
    --non-interactive --agree-tos --email info@infosolkenya.com
```
- Edit the nginx config created earlier to include SSL section below. Add as a new server block

```bash
server {
    listen 443 ssl;
    server_name project.sanctionscreening.africa www.project.sanctionscreening.africa;

    # SSL Certificate Files (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/project.sanctionscreening.africa/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/project.sanctionscreening.africa/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Your application proxy configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```


