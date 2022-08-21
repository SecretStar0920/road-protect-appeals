#!/usr/bin/env bash
cd ../build || exit
./general-build.sh frontend production stable
./patch-deployment.sh frontend production
