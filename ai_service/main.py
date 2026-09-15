import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ai_service.model_engine import predictor

app = FastAPI(title='AgriSmart AI Service', version='2.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.get('/health')
def health():
    return {'status':'online','service':'AI Service','inference_mode':'trained_model' if predictor.model else 'fallback_requires_model','supported_classes':len(predictor.class_labels)}

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(400, 'Uploaded file must be an image')
    data = await file.read()
    if not data:
        raise HTTPException(400, 'Empty image file')
    try:
        result = predictor.predict(data)
        return {'success': True, 'data': result}
    except Exception as exc:
        raise HTTPException(500, f'AI inference error: {exc}')
