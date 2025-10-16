#!/bin/bash
set -e

echo "=== Deploying Infrastructure ==="
cd infrastructure
terraform init
terraform apply -auto-approve
cd ..

# Source environment variables for the scripts
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "=== Deploying Application Catalog ==="
./scripts/deploy-catalog.sh

echo "=== Deploying Backend ==="
./scripts/deploy-backend.sh

echo "=== Deploying Frontend ==="
./scripts/deploy-frontend.sh

echo ""
echo "✓ Full deployment complete!"
echo "Portal: https://${CLOUDFRONT_DOMAIN}"
echo "API: https://${API_DOMAIN}"
