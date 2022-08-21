#!/usr/bin/env bash
cd ../build || exit
./general-build.sh frontend
./patch-deployment.sh frontend staging
