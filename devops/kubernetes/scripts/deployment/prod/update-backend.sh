#!/usr/bin/env bash
cd ../build || exit
./general-build.sh backend production stable
./patch-deployment.sh backend production
