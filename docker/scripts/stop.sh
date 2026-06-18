#!/bin/bash

echo "Stopping e-PMS application..."
docker-compose down
echo "Application stopped!"

# Optional: Remove volumes to reset database
# docker-compose down -v
echo "To reset database, run: docker-compose down -v"