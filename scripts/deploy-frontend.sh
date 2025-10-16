#!/bin/bash
set -e

cd frontend

echo "Installing dependencies..."
npm ci

echo "Building production bundle..."
VITE_API_BASE_URL=${API_BASE_URL} npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://${FRONTEND_BUCKET}/ --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id ${CLOUDFRONT_DIST_ID} \
  --paths "/*"

echo "Frontend deployment complete!"
echo "Portal URL: https://${CLOUDFRONT_DOMAIN}"
