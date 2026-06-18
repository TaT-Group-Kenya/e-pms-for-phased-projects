#!/bin/bash

# Get APP_URL_HOST from .env file
APP_URL=$(grep "^APP_URL=" backend-for-frontend/.env | cut -d'=' -f2-)
APP_URL_HOST=$(echo "$APP_URL" | sed 's|http[s]*://||' | sed 's|/.*||')

echo "APP_URL_HOST=$APP_URL_HOST"
