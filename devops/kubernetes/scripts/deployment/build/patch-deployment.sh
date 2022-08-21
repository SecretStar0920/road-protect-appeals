#!/usr/bin/env bash
NAMESPACE=$2
kubectl patch deployment "$1" --namespace=${NAMESPACE:-default} -p \
    "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
