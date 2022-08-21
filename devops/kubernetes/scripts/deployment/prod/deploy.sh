#!/usr/bin/env bash
echo "This script will run a full production deployment"
read -p "Are you sure you want to continue?  " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  read -p "Would you like to checkout master?  " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
  git checkout master
  fi
  ./update-backend.sh
  ./update-frontend.sh
fi
