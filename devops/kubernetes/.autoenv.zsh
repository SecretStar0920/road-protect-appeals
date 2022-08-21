autostash COMPOSE_PROJECT_NAME=rp-appeals

NC='\033[0m'
GREEN='\033[0;32m'

echo "Entering the ${PROJECT_NAME} staging/prod environment..."
echo ""
echo "${GREEN}Setting staging/prod context for ${COMPOSE_PROJECT_NAME}"
echo "${NC}"

#gcloud config set project appeals-265314
#kubectl config use-context gke_appeals-265314_europe-west1-b_rp-appeals
alias kubectl="kubectl --namespace production"
