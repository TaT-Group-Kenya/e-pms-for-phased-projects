1. Install PHP 8.4

- First run `php --version` if not found install it using below steps.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https

sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

sudo apt install -y php8.4 php8.4-cli php8.4-common php8.4-mysql php8.4-xml php8.4-curl php8.4-gd php8.4-mbstring php8.4-zip php8.4-bcmath php8.4-intl

sudo apt install php8.4-fpm

```


2. Install Composer
- Navigate to an empty directory and run:

```bash
# Download and install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
```

3. Install Mysql DB
- use below commands

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

4. Create database, user and password
- Login to the database using `sudo mysql -u root -p` then run below commands

```SQL
CREATE DATABASE laravel_api;
CREATE USER 'laravel_user'@'localhost' IDENTIFIED BY 's%sfe*3dT)-4838d643632';
GRANT ALL PRIVILEGES ON laravel_api.* TO 'laravel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

5. Deploy the app
```bash
# Navigate to web directory
cd /var/www

# Clone or create your Laravel project
# Option 1: Clone from repository
sudo git clone https://github.com/TaT-Group-Kenya/e-pms-for-phased-projects.git .

# error you run into fatal: destination path '.' already exists and is not an empty directory.
# fix: ensure to delete any files or dirs inside /var/www/

# Navigate to project
cd backend-for-frontend

# Set proper permissions
sudo chown -R $USER:www-data /var/www/backend-for-frontend
sudo chmod -R 775 /var/www/backend-for-frontend/storage
sudo chmod -R 775 /var/www/backend-for-frontend/bootstrap/cache

# Configure environment
sudo cp .env.sample .env
sudo nano .env
```

6. Install Laravel Dependencies

```bash
# Install dependencies with Composer
composer install --no-dev --optimize-autoloader

# Generate application key
sudo php artisan key:generate

# Run migrations
sudo php artisan migrate --force

# Run seeders & factories
sudo php artisan db:seed

# Clear and cache configurations
sudo php artisan config:cache
sudo php artisan route:cache
```

7. Install and configure nginx and ufw

```bash
sudo apt update
sudo apt install nginx
```

Run

```bash
sudo ufw allow 'Nginx Full'
```


8. Configure Nginx for Laravel API

```bash
sudo nano /etc/nginx/sites-available/laravel-api
```

nginx config

```bash
#Create .well-known directory inside your Laravel public folder
sudo mkdir -p /var/www/laravel-api/public/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/laravel-api/public/.well-known
```

```bash

server {
    listen 8000;
    server_name 41.242.3.93 project.sanctionscreening.africa;
    root /var/www/backend-for-frontend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

  # Let's Encrypt webroot path - ADD THIS
    location ^~ /.well-known/acme-challenge/ {
        allow all;
        root /var/www/laravel-api/public;  # Use the same root
        default_type "text/plain";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# server {
#     listen 8443 ssl http2;
#     server_name 41.242.3.93 project.sanctionscreening.africa;
#     root /var/www/backend-for-frontend/public;

#     # SSL certificates (will be added by certbot)
#     ssl_certificate /etc/letsencrypt/live/project.sanctionscreening.africa/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/project.sanctionscreening.africa/privkey.pem;

#     add_header X-Frame-Options "SAMEORIGIN";
#     add_header X-Content-Type-Options "nosniff";

#     index index.php index.html index.htm;

#     charset utf-8;

#     location / {
#         try_files $uri $uri/ /index.php?$query_string;
#     }

#     location = /favicon.ico { access_log off; log_not_found off; }
#     location = /robots.txt  { access_log off; log_not_found off; }

#     error_page 404 /index.php;

#     location ~ \.php$ {
#         fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
#         fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
#         include fastcgi_params;
#     }

#     location ~ /\.(?!well-known).* {
#         deny all;
#     }
# }
```

- Link the server configs, Test and restart. 

Note that test will fail since we have not setup Let's encrypt certificates for the domain/ip

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/laravel-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

9. Configure Firewall

```bash
# Allow Nginx ports
sudo ufw allow 8000/tcp
sudo ufw allow 8443/tcp
sudo ufw allow 22/tcp
sudo ufw allow 6329/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

10. Install Certbot and certificates

```bash
#update packages
sudo apt update
sudo apt install snapd -y

#Add snapd
sudo snap install core
sudo snap refresh core

#remove old if any
sudo apt remove certbot -y

#install new
sudo snap install --classic certbot

#Add sym link
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

```

- Run the following to generate certificate for the domain/ip. Do not add scheme such as http or https:

Notes
- ensure the domain project.sanctionscreening.africa exists and has an A record with the linux box IP
- has a cname record with www.project.sanctionscreening.africa
- when you navigate to project.sanctionscreening.africa, the laravel APIs loads

```bash
# Stop Nginx temporarily for standalone authentication
sudo systemctl stop nginx

# Obtain SSL certificate (replace with your actual domain)
sudo certbot certonly --standalone --preferred-challenges http \
    -d project.sanctionscreening.africa \
    --non-interactive --agree-tos --email info@infosolkenya.com

# Update Nginx configuration to use SSL certificates
sudo nano /etc/nginx/sites-available/laravel-api
```

## Troubleshooting

1. Permissions
- Ensure the following permissions are set

```bash
# Navigate to your project root
cd /var/www/backend-for-frontend

# Set the correct ownership (www-data is the web server user)
sudo chown -R www-data:www-data storage
sudo chown -R www-data:www-data bootstrap/cache

# Set directory permissions (755 for directories, 644 for files)
sudo find storage -type d -exec chmod 755 {} \;
sudo find storage -type f -exec chmod 644 {} \;
sudo find bootstrap/cache -type d -exec chmod 755 {} \;
sudo find bootstrap/cache -type f -exec chmod 644 {} \;

# Give write permissions to storage/logs, storage/framework, and bootstrap/cache
sudo chmod -R 775 storage/logs
sudo chmod -R 775 storage/framework
sudo chmod -R 775 bootstrap/cache
```

- Since uploads are symlinked to public folder, add permissions too.

```bash
sudo chown -R www-data:www-data public
```




