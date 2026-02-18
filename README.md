## Project Overview

This application manages client projects, assigns companies to work on those projects, and handles payments to companies. It provides entities for users, companies, customers, projects, quotations, orders, invoices, credit notes, roles, and groups.

## Local Development — Quick Start

Prerequisites:
- PHP 8.2+ (or the version required by your local environment)
- Composer
- MySQL or PostgreSQL (or another supported database)
- Node.js 18+ and npm (or pnpm/yarn)

1. Clone the repo:

```bash
git clone <repo-url>
cd e-pms-for-phased-projects
```

2. Install PHP dependencies:

```bash
composer install
```

3. Copy and configure environment:

```bash
cp .env.example .env
# Edit .env and set DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan key:generate
```

4. Create database and run migrations + seeders:

```bash
php artisan migrate --seed
```

Notes:
- The main Database seeder calls these seeders (in safe order): `SysRoleSeeder`, `SysGroupSeeder`, `GroupRoleSeeder`, `UserSeeder`, `UserGroupSeeder`.
- The seeded admin user email is `admin@example.com` with password `password123` (change after first login).

If you want to run individual seeders:

```bash
php artisan db:seed --class=Database\\Seeders\\SysRoleSeeder
php artisan db:seed --class=Database\\Seeders\\SysGroupSeeder
php artisan db:seed --class=Database\\Seeders\\GroupRoleSeeder
php artisan db:seed --class=Database\\Seeders\\UserSeeder
php artisan db:seed --class=Database\\Seeders\\UserGroupSeeder
```

5. Frontend (Vite):

```bash
# install node deps
npm install

# start Vite dev server
npm run dev

# or build for production
npm run build
```

6. Serve the application (development):

```bash
php artisan serve
```

7. Useful commands:

```bash
# create the storage symlink
php artisan storage:link

# run tests
php artisan test
```

Troubleshooting:
- If migrations fail, check your database credentials in `.env` and ensure the DB exists.
- If you run into permission errors, ensure `storage/` and `bootstrap/cache` are writable by your web user.
- If Composer runs out of memory on macOS, try: `php -d memory_limit=-1 $(which composer) install`.
