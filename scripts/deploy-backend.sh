#!/bin/bash
set -e

cd backend

echo "Installing dependencies..."
npm ci --production

echo "Building Lambda packages..."
# This is a simplified packaging script. A real project might use esbuild or similar.
for func in functions/*; do
  func_name=$(basename $func)
  echo "Packaging $func_name..."
  
  # Create a temporary directory to avoid including unwanted files
  rm -rf dist
  mkdir -p dist/$func_name
  
  # Copy function code, shared code, and node_modules
  cp -r $func/* dist/$func_name/
  cp -r shared dist/$func_name/
  cp -r node_modules dist/$func_name/

  # Zip from the temp directory
  cd dist
  zip -r ${func_name}.zip $func_name
  mv ${func_name}.zip ../
  cd ..
  rm -rf dist
done

cd ..

echo "Deploying via Terraform..."
cd infrastructure
terraform apply -auto-approve

echo "Backend deployment complete!"
