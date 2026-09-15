# AgriSmart — Complete Architecture Implementation

This package completes the non-ML architecture around the supplied ML portion.

## Architecture
React Frontend → FastAPI Backend → AI REST Service (MobileNetV2 when weights are present) → PostgreSQL

The backend now provides:
- Registration/login with JWT authentication
- User profile endpoint
- Image upload and prediction orchestration
- PostgreSQL disease/cure catalog seeded from `disease_info.json`
- PostgreSQL prediction history
- Dashboard statistics
- History retrieval/deletion
- Separate AI service on port 8001

The frontend provides:
- Farmer registration/login
- Leaf upload and preview
- Prediction result with disease, confidence, symptoms, organic/chemical cure and prevention
- User dashboard
- Prediction history

## Quickest setup with Docker

1. Install Docker Desktop.
2. From this folder run:

```bash
docker compose up --build
```

3. Start the React frontend separately:

```bash
cd frontend
npm install
npm run dev
```

4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

Backend API: `http://localhost:8000`
AI service: `http://localhost:8001`
PostgreSQL: `localhost:5432`

## Local Python setup (without Docker)

Start PostgreSQL first and set:

```text
DATABASE_URL=postgresql+psycopg://agrismart:agrismart@localhost:5432/agrismart
AI_SERVICE_URL=http://localhost:8001
```

AI service:

```bash
pip install -r ai_service/requirements.txt
uvicorn ai_service.main:app --reload --port 8001
```

Backend:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Important ML note

The supplied original ZIP did not contain `model/crop_disease_model.h5`. The completed project therefore keeps a clearly labelled `fallback_demo` mode so the application can still be demonstrated. For genuine MobileNetV2 inference, place the trained model at:

```text
ai_service/model/crop_disease_model.h5
```

Also keep `ai_service/model/class_labels.json` synchronized with the exact class-index order used during training. The project already includes a 12-class mapping generated from the supplied disease catalog.

Do not present fallback predictions as trained-model accuracy. The original reported metrics should only be claimed after the actual trained weights and evaluation artifacts are included and reproducible.

## API flow

`POST /auth/register` → token → `POST /predict` with bearer token + image → backend calls AI `/predict` → backend maps `class_id` to PostgreSQL disease information → prediction is saved to PostgreSQL → frontend displays result.

`GET /history` and `GET /dashboard` read the user's stored records from PostgreSQL.
