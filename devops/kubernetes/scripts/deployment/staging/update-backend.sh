#!/usr/bin/env bash
cd ../build || exit
./general-build.sh backend
./patch-deployment.sh backend staging
