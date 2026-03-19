#!/bin/bash

# Define the list of setup scripts
SCRIPTS=(
  "setup_db.js"
  "setup_notifications.js"
  "setup_newsletter.js"
  "setup_viewing_requests.js"
  "setup_history_table.js"
)

echo "Starting Database Initialization..."

# Loop through each script and execute it inside the pj_server container
for script in "${SCRIPTS[@]}"; do
  echo "Running $script..."
  docker exec pj_server node $script
  if [ $? -eq 0 ]; then
    echo "✔ $script completed successfully."
  else
    echo "❌ $script failed."
  fi
done

echo "Database Setup Complete!"
