#!/bin/bash

# Stop existing containers
echo "Stopping containers..."
docker-compose down

# Pull latest images (if using image registry) or just build
echo "Building and starting containers..."
docker-compose up -d --build

# Remove unused images to save space
echo "Cleaning up..."
docker image prune -f

echo "Deployment finished!"
