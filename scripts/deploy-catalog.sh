#!/bin/bash
set -e

echo "Validating apps.yaml..."
# node scripts/validate-yaml.js app-catalog/apps.yaml # Validator script to be created

echo "Optimizing app icons..."
# npx svgo --folder app-catalog/icons --output frontend/public/app-icons/ # svgo is a dev dependency, will be in package.json

echo "Uploading icons to S3..."
aws s3 sync frontend/public/app-icons/ s3://${FRONTEND_BUCKET}/app-icons/ --delete

echo "Parsing apps.yaml to DynamoDB..."
# node scripts/yaml-to-dynamo.js app-catalog/apps.yaml ${DYNAMO_TABLE_APPS} # Parser script to be created

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id ${CLOUDFRONT_DIST_ID} \
  --paths "/app-icons/*"

echo "Catalog deployment complete!"

