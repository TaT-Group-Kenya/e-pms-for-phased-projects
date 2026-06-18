# Use pre-built Node.js image with Next.js already installed
FROM node:24.15.0-alpine AS builder

WORKDIR /app

# Copy frontend files
COPY front-for-web/package*.json ./
RUN npm install --frozen-lockfile || npm install

# Copy application files
COPY front-for-web/ .

# Build the application
RUN npm run build

# Production stage
FROM node:24.15.0-alpine AS production

WORKDIR /app

# Install nginx and gettext for envsubst
RUN apk add --no-cache nginx openssl gettext

# Create self-signed certificate for development (Let's Encrypt for production)
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Copy Next.js production build from builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/next.config.js /app/next.config.js

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Create log directory, client body directory, and run directory for PID file
RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp/client_body /var/run/nginx && \
    chown -R nextjs:nodejs /var/log/nginx /var/lib/nginx /var/run/nginx

# Create cache directories and set permissions for Next.js image optimization
RUN mkdir -p /app/.next/cache/images && \
    chown -R nextjs:nodejs /app/.next

# Copy nginx configuration with Let's Encrypt support
COPY docker/frontend/nginx-site.conf /etc/nginx/http.d/default.conf.template
COPY docker/frontend/entrypoint.sh /entrypoint.sh
COPY docker/frontend/ssl/ /etc/nginx/ssl/

# Copy env files for dynamic configuration
COPY front-for-web/.env.local* /app/.env.local*
COPY front-for-web/.env.production* /app/.env.production*

# Change ownership of nginx config directory to nextjs for dynamic config generation
RUN chown -R nextjs:nodejs /etc/nginx/http.d

# Switch to non-root user
USER nextjs

# Expose ports for HTTP (80) and HTTPS (443)
EXPOSE 80
EXPOSE 443

# Start services
ENTRYPOINT ["/entrypoint.sh"]
