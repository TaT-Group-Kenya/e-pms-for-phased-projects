1. Install PHP 8.4

- First run `php --version` if not found install it using below steps.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https

sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

sudo apt install -y php8.4 php8.4-cli php8.4-common php8.4-mysql php8.4-xml php8.4-curl php8.4-gd php8.4-mbstring php8.4-zip php8.4-bcmath php8.4-intl

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

Step 5: Install Laravel Dependencies

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
