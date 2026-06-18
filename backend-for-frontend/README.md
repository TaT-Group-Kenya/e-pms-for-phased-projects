# Reports API

The application provides a suite of reporting endpoints for financial and project analytics. All endpoints require appropriate filters and authorization.

### Available Reports

- Orders Summary: `/api/reports/orders-summary` — Filter by status, project, customer, date, currency.
- Projects Summary: `/api/reports/projects-summary` — Filter by status, customer, category, origin, location, job reference, date, currency.
- Customer History: `/api/reports/customer-history` — Filter by date.
- Revenue Snapshot: `/api/reports/revenue-snapshot` — Filter by currency, date.
- Invoices Report: `/api/reports/invoices-report` — Filter by type (customer/company), status, currency, date.
- Payments to Companies: `/api/reports/payments-to-companies` — Filter by company, currency, date.
- Margin Per Project: `/api/reports/margin-per-project` — Filter by currency, forex rate, date.
- General Ledger: `/api/reports/general-ledger` — Filter by currency, forex, project, company, customer, date.
- Invoice Payments: `/api/reports/invoice-payments` — Filter by type, currency, forex, project, company, customer, date.
- Tax Payments Customer: `/api/reports/tax-payments-customer` — Filter by currency, customer, date.
- Tax Payments Company: `/api/reports/tax-payments-company` — Filter by currency, company, date.
- Expense Report: `/api/reports/expense-report` — Filter by currency, date.
- PDF Export: `/api/reports/export-pdf` — Provide `report_type` and filters to generate a PDF for any report.

### Request Filters

Each endpoint accepts filters via query parameters or request body. Common filters include:

- `currency_code`: Currency code (required for most reports)
- `status`: Order or invoice status
- `project_id`, `company_id`, `customer_id`: Entity IDs
- `from`, `to`, `from_date`, `to_date`: Date range
- `type`: Report type (customer/company)
- `forex`, `forex_to_kes`: Exchange rate
- `job_reference_id`, `project_category_id`, `project_source_origin_id`, `project_location_id`: Project attributes

### Example Request

```
POST /api/reports/invoice-payments
{
	"type": "customer",
	"currency_code": "KES",
	"forex": 1.0,
	"from": "2024-01-01",
	"to": "2024-12-31"
}
```

### Response

All responses are formatted using API Resources. Errors return HTTP 400 with an error message. PDF export returns a PDF stream.
## Project Overview

This application manages client projects, assigns companies to work on those projects, and handles payments to companies. It provides entities for users, companies, customers, projects, quotations, orders, invoices, credit notes, roles, and groups.
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
```bash
Troubleshooting:
- If migrations fail, check your database credentials in `.env` and ensure the DB exists.
- If you run into permission errors, ensure `storage/` and `bootstrap/cache` are writable by your web user.
- If Composer runs out of memory on macOS, try: `php -d memory_limit=-1 $(which composer) install`.
```

8. Docker
- Run the command below to start docker services

```bash
docker-compose -f docker-compose.backend.yml down && docker-compose -f docker-compose.backend.yml build backend && docker-compose -f docker-compose.backend.yml up -d backend
```

