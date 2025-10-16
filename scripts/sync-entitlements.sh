#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

FUNCTION_NAME="${PROJECT_NAME}-sync-entitlements-${ENVIRONMENT}"

echo "Triggering entitlement sync Lambda: ${FUNCTION_NAME}"
aws lambda invoke \
  --function-name ${FUNCTION_NAME} \
  --invocation-type Event \
  --payload '{"source": "manual"}' \
  /dev/null

echo "Sync triggered. Check CloudWatch logs for results."
