import json, os, uuid
from datetime import datetime, timezone
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import httpx
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import Base, engine, get_db
from .models import User, DiseaseInfo, PredictionHistory
from .schemas import RegisterRequest, LoginRequest, TokenResponse
from .security import hash_password, verify_password, create_token, decode_token

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DISEASE_JSON = os.path.join(BASE_DIR, 'disease_info.json')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
AI_SERVICE_URL = os.getenv('AI_SERVICE_URL', 'http://localhost:8001')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title='AgriSmart Backend API', description='Backend API connecting React, AI service and PostgreSQL.', version='2.0.0')
app.add_middleware(CORSMiddleware, allow_origins=os.getenv('CORS_ORIGINS','http://localhost:5173').split(','), allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.on_event('startup')
def startup():
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        if os.path.exists(DISEASE_JSON) and db.query(DiseaseInfo).count() == 0:
            with open(DISEASE_JSON, encoding='utf-8') as f: data = json.load(f)
            for class_id, item in data.items():
                db.add(DiseaseInfo(class_id=class_id, plant=item['plant'], disease=item['disease'], status=item['status'], severity=item['severity'], symptoms=json.dumps(item.get('symptoms',[])), organic_cure=item.get('organic_cure',''), chemical_cure=item.get('chemical_cure',''), prevention=json.dumps(item.get('prevention',[]))))
            db.commit()
    finally:
        db.close()

def current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(401, 'Authentication required')
    try: user_id = decode_token(authorization.split(' ',1)[1])
    except Exception: raise HTTPException(401, 'Invalid or expired token')
    user = db.get(User, user_id)
    if not user: raise HTTPException(401, 'User not found')
    return user

def serialize_history(row, info):
    return {'id':row.id,'class_id':row.class_id,'plant':row.plant,'disease':row.disease,'status':row.status,'severity':row.severity,'confidence_percentage':row.confidence,'symptoms':json.loads(info.symptoms) if info else [],'organic_cure':info.organic_cure if info else '','chemical_cure':info.chemical_cure if info else '','prevention':json.loads(info.prevention) if info else [],'created_at':row.created_at.isoformat()}

@app.get('/health')
def health(db: Session = Depends(get_db)):
    try: db.execute(__import__('sqlalchemy').text('SELECT 1'))
    except Exception as exc: return {'status':'degraded','database':'offline','error':str(exc)}
    return {'status':'online','service':'AgriSmart Backend','database':'online','ai_service':AI_SERVICE_URL}

@app.post('/auth/register', response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first(): raise HTTPException(409,'Email already registered')
    user = User(name=payload.name.strip(), email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return {'access_token':create_token(user.id),'token_type':'bearer'}

@app.post('/auth/login', response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash): raise HTTPException(401,'Invalid email or password')
    return {'access_token':create_token(user.id),'token_type':'bearer'}

@app.get('/auth/me')
def me(user: User = Depends(current_user)):
    return {'id':user.id,'name':user.name,'email':user.email}

@app.get('/diseases')
def diseases(db: Session = Depends(get_db)):
    rows = db.query(DiseaseInfo).order_by(DiseaseInfo.plant, DiseaseInfo.disease).all()
    return {'total':len(rows),'diseases':[{'class_id':r.class_id,'plant':r.plant,'disease':r.disease,'status':r.status,'severity':r.severity,'symptoms':json.loads(r.symptoms),'organic_cure':r.organic_cure,'chemical_cure':r.chemical_cure,'prevention':json.loads(r.prevention)} for r in rows]}

@app.post('/predict')
async def predict(file: UploadFile = File(...), user: User = Depends(current_user), db: Session = Depends(get_db)):
    if not file.content_type or not file.content_type.startswith('image/'): raise HTTPException(400,'Uploaded file must be an image')
    contents = await file.read()
    if not contents: raise HTTPException(400,'Empty image file')
    ext = os.path.splitext(file.filename or '')[1].lower() or '.jpg'
    safe_name = f'{user.id}_{uuid.uuid4().hex}{ext}'
    with open(os.path.join(UPLOAD_DIR, safe_name), 'wb') as out: out.write(contents)
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            resp = await client.post(f'{AI_SERVICE_URL}/predict', files={'file':(file.filename or safe_name, contents, file.content_type)})
        if resp.status_code != 200: raise HTTPException(502, f'AI service returned {resp.status_code}: {resp.text}')
        ai = resp.json().get('data',{})
    except httpx.HTTPError as exc:
        raise HTTPException(503, f'AI service unavailable: {exc}')
    class_id = ai.get('class_id')
    info = db.query(DiseaseInfo).filter(DiseaseInfo.class_id == class_id).first()
    if not info: raise HTTPException(500, f'Disease information not found in PostgreSQL for {class_id}')
    row = PredictionHistory(user_id=user.id,class_id=class_id,plant=info.plant,disease=info.disease,status=info.status,severity=info.severity,confidence=float(ai.get('confidence_percentage',0)),image_filename=safe_name)
    db.add(row); db.commit(); db.refresh(row)
    return {'success':True,'data':serialize_history(row,info),'source':'PostgreSQL'}

@app.get('/history')
def history(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(PredictionHistory).filter(PredictionHistory.user_id == user.id).order_by(PredictionHistory.created_at.desc()).all()
    result=[]
    for row in rows:
        info=db.query(DiseaseInfo).filter(DiseaseInfo.class_id==row.class_id).first()
        result.append(serialize_history(row,info))
    return {'total':len(result),'history':result}

@app.delete('/history/{prediction_id}')
def delete_history(prediction_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    row=db.query(PredictionHistory).filter(PredictionHistory.id==prediction_id,PredictionHistory.user_id==user.id).first()
    if not row: raise HTTPException(404,'Prediction not found')
    if row.image_filename:
        try: os.remove(os.path.join(UPLOAD_DIR,row.image_filename))
        except OSError: pass
    db.delete(row); db.commit(); return {'success':True}

@app.get('/dashboard')
def dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows=db.query(PredictionHistory).filter(PredictionHistory.user_id==user.id).all()
    diseased=sum(1 for r in rows if r.status.lower()=='diseased')
    healthy=len(rows)-diseased
    return {'user':{'id':user.id,'name':user.name,'email':user.email},'total_predictions':len(rows),'diseased_predictions':diseased,'healthy_predictions':healthy,'average_confidence':round(sum(r.confidence for r in rows)/len(rows),2) if rows else 0}
