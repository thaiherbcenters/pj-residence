#!/bin/bash

echo "Starting Docker Installation..."

# 1. Install Docker using official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Install Docker Compose (Standalone) to ensure compatibility with deploy script
# Using a recent stable version
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Add current user to docker group to avoid using 'sudo' valid for next session
sudo usermod -aG docker $USER

echo "----------------------------------------------------------------"
echo "Installation Complete!"
echo "⚠️  IMPORTANT: You must LOG OUT and LOG BACK IN for permissions to work."
echo "----------------------------------------------------------------"
