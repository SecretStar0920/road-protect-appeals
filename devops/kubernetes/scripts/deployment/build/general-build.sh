#!/usr/bin/env bash
SERVICE=${1:?Must provide a service name}
echo
echo "SERVICE=${SERVICE}"

ENV=${2:-staging}
echo "ENV/NAMESPACE=${ENV}"

TAG=${3:-latest}
echo "TAG=${TAG}"
echo

CURRENT_PATH="$(
    cd "$(dirname "$0")" || exit
    pwd -P
)"

echo
echo "1. Generating secrets"
cd "${CURRENT_PATH}"/../ || exit
./generate-secret.sh -e ./../../"${ENV}"/"${SERVICE}"/.env -s "${SERVICE}" -n "${ENV}"


echo
echo "2. Building"
cd "${CURRENT_PATH}"/../../../../../"${SERVICE}"/ || exit
docker build . --tag "${TAG}"-"${SERVICE}"
#
#echo
#echo "Slimming"
#docker-slim --report=off build --http-probe=false --continue-after=10 ${TAG-"${SERVICE}"

echo
echo "3. Tagging"
docker tag "${TAG}"-"${SERVICE}" eu.gcr.io/appeals-265314/"${SERVICE}":"${TAG}"

echo
echo "4. Pushing: eu.gcr.io/appeals-265314/${SERVICE}:${TAG}"
docker push eu.gcr.io/appeals-265314/"${SERVICE}":"${TAG}"
