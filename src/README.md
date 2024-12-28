```
npm install
npm run dev
```

```
// 事前に gcloud CLI をインストールし、gcloud init や gcloud auth login などで Google Cloud プロジェクトと認証
docker build -t gcr.io/<YOUR_PROJECT_ID>/<YOUR_IMAGE_NAME>:v1 .
docker push gcr.io/<YOUR_PROJECT_ID>/<YOUR_IMAGE_NAME>:v1
gcloud run deploy <SERVICE_NAME> \
  --image gcr.io/<YOUR_PROJECT_ID>/<YOUR_IMAGE_NAME>:v1 \
  --platform=managed \
  --region=<YOUR_PREFERRED_REGION> \
  --allow-unauthenticated
```