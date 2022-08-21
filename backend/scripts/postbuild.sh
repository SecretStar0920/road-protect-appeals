#!/bin/bash

echo "Copying any additional files"
node_modules/.bin/copyfiles --verbose --up 1 --exclude="**/*.ts" \
  src/data/*.* \
  src/temp/*.* \
  src/controllers/payments/*.hbs \
  src/services/za/*.hbs \
  dist
