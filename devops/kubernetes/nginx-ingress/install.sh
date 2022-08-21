#!/bin/bash
IP_ADDRESS=$1
echo "IP = ${IP_ADDRESS}"

helm repo add stable https://kubernetes-charts.storage.googleapis.com

# Install nginx-ingress controller
# With role based authentication
# In kube-system namespace
# Set IP to given ip (corresponding to static IP ideally
# Enforce single replica
# Set external traffic policy to local so that client IP gets forwarded correctly
# Do not try to create a cluster IP
# Service type is load balancer
helm install nginx-ingress stable/nginx-ingress \
    --set rbac.create=true \
    --namespace kube-system \
    --set controller.service.loadBalancerIP="$IP_ADDRESS" \
    --set controller.service.externalIPs="{$IP_ADDRESS}" \
    --set controller.replicaCount=1 \
    --set controller.service.externalTrafficPolicy=Local \
    --set controller.service.omitClusterIP=true \
    --set controller.service.type=LoadBalancer
