#!/bin/bash

# === 設定部分 ===
PROJECT_ID="your-gcp-project-id" # GCP プロジェクトIDを指定
REGION="us-central1" # Cloud Run のリージョン
BACKEND_SERVICE_NAME="hono-backend"
FRONTEND_SERVICE_NAME="next-frontend"

# Docker イメージ名
BACKEND_IMAGE="gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME"
FRONTEND_IMAGE="gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME"

# === 関数部分 ===
build_and_push() {
  local SERVICE_DIR=$1
  local IMAGE_NAME=$2

  echo "Building and pushing Docker image for $SERVICE_DIR..."
  gcloud builds submit --tag $IMAGE_NAME $SERVICE_DIR
}

deploy_to_cloud_run() {
  local SERVICE_NAME=$1
  local IMAGE_NAME=$2
  local PORT=$3

  echo "Deploying $SERVICE_NAME to Cloud Run..."
  gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars PORT=$PORT
}

# === バックエンドのビルド & デプロイ ===
echo "Starting backend deployment..."
build_and_push "./src/backend" $BACKEND_IMAGE
deploy_to_cloud_run $BACKEND_SERVICE_NAME $BACKEND_IMAGE 8080

# === フロントエンドのビルド & デプロイ ===
echo "Starting frontend deployment..."
build_and_push "./src/frontend" $FRONTEND_IMAGE
deploy_to_cloud_run $FRONTEND_SERVICE_NAME $FRONTEND_IMAGE 3000

# === URL取得と表示 ===
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE_NAME --region $REGION --format="value(status.url)")
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE_NAME --region $REGION --format="value(status.url)")

echo "Deployment complete!"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"

