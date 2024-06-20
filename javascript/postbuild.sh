#!/bin/bash
# THIS FILE needs to be overwritten by ansible in order to support multi-tenacy
if [ ! -d "build/metrics" ]; then
  echo "Creating sub-path build/metrics"
  mkdir -p build/egi_devel/metrics
fi

cp -rpi build/static build/metrics/
cp -rpi build/index.html build/metrics/
cp -rpi build/asset-manifest.json build/metrics/