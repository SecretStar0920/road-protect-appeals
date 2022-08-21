#!/usr/bin/env bash
echo "This script will run a full staging deployment"
read -p "Are you sure you want to continue?  " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  read -p "Would you like to checkout develop?  " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
  git checkout develop
  fi
  ./update-backend.sh
  ./update-frontend.sh
fi
