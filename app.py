import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from model_engine import predictor

app = FastAPI(
    title="AgriSmart - Crop Disease Detection API",
    description="SIH Project AI Service for diagnosing plant leaf diseases and recommending organic/chemical cures.",
    version="1.0.0"
)

# Enable CORS for frontend and cross-origin backend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", summary="Health Check")
def health_check():
    """Health check endpoint for cloud monitoring."""
    return {
        "status": "online",
        "service": "AgriSmart Crop Disease Detection ML Engine",
        "supported_diseases_count": len(predictor.class_labels),
        "inference_engine": predictor.predict.__name__
    }

@app.get("/diseases", summary="List All Supported Diseases")
def get_supported_diseases():
    """Returns list of all supported crop diseases and detailed cure catalog."""
    return {
        "total": len(predictor.disease_db),
        "diseases": predictor.disease_db
    }

@app.post("/predict", summary="Predict Crop Disease from Leaf Image")
async def predict_disease(file: UploadFile = File(...)):
    """
    Upload a crop leaf image (JPG/PNG) to receive AI disease diagnosis and cure advice.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG, PNG, WEBP)")

    try:
        contents = await file.read()
        result = predictor.predict(contents)
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/", response_class=HTMLResponse, summary="Interactive Demo UI")
def index_ui():
    """Embedded Web Testing Interface for SIH Evaluators and Team Members."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AgriSmart - Crop Disease Detection</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0b1320;
                --card-bg: #152238;
                --accent: #10b981;
                --accent-hover: #059669;
                --text: #f3f4f6;
                --text-muted: #9ca3af;
                --border: #1f293d;
            }
            body {
                font-family: 'Outfit', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                margin: 0;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                max-width: 750px;
                width: 100%;
                background: var(--card-bg);
                padding: 35px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                border: 1px solid var(--border);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                font-size: 2.2rem;
                color: var(--accent);
                margin-bottom: 8px;
            }
            .header p {
                color: var(--text-muted);
                font-size: 1rem;
            }
            .drop-zone {
                border: 2px dashed var(--accent);
                border-radius: 14px;
                padding: 40px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(16, 185, 129, 0.04);
            }
            .drop-zone:hover {
                background: rgba(16, 185, 129, 0.1);
            }
            .preview-img {
                max-width: 100%;
                max-height: 250px;
                border-radius: 12px;
                margin-top: 15px;
                display: none;
            }
            .btn {
                width: 100%;
                background: var(--accent);
                color: #fff;
                border: none;
                padding: 14px;
                font-size: 1.1rem;
                font-weight: 600;
                border-radius: 10px;
                cursor: pointer;
                margin-top: 20px;
                transition: background 0.2s ease;
            }
            .btn:hover {
                background: var(--accent-hover);
            }
            .result-card {
                margin-top: 30px;
                background: #0f172a;
                border-radius: 14px;
                padding: 25px;
                border: 1px solid var(--border);
                display: none;
            }
            .badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                background: rgba(16, 185, 129, 0.2);
                color: var(--accent);
            }
            .badge.diseased {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }
            .cure-box {
                background: rgba(255,255,255,0.03);
                padding: 15px;
                border-radius: 10px;
                margin-top: 12px;
                border-left: 4px solid var(--accent);
            }
            .cure-box.chem {
                border-left-color: #3b82f6;
            }
            h3 { margin-top: 0; color: #fff; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 AgriSmart AI</h1>
                <p>Crop Disease Detection & Cure Recommendation Engine</p>
            </div>
            
            <div class="drop-zone" onclick="document.getElementById('fileInput').click()">
                <p>📸 Click or Drag & Drop Leaf Image Here</p>
                <input type="file" id="fileInput" accept="image/*" style="display:none;" onchange="handleFileSelect(event)">
                <img id="preview" class="preview-img" alt="Leaf Preview">
            </div>

            <button class="btn" onclick="uploadImage()">🔍 Analyze Leaf Health</button>

            <div id="result" class="result-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 id="resDisease">Disease Name</h3>
                    <span id="resStatus" class="badge">Status</span>
                </div>
                <p><strong>Plant:</strong> <span id="resPlant">-</span> | <strong>Confidence:</strong> <span id="resConf">-</span>%</p>
                
                <h4>🌿 Symptoms</h4>
                <ul id="resSymptoms"></ul>

                <div class="cure-box">
                    <strong>🟢 Organic Cure:</strong>
                    <p id="resOrganic" style="margin:5px 0 0 0; color:#d1d5db;"></p>
                </div>

                <div class="cure-box chem">
                    <strong>🔵 Chemical Cure:</strong>
                    <p id="resChemical" style="margin:5px 0 0 0; color:#d1d5db;"></p>
                </div>
            </div>
        </div>

        <script>
            let selectedFile = null;

            function handleFileSelect(e) {
                const file = e.target.files[0];
                if (file) {
                    selectedFile = file;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.getElementById('preview');
                        img.src = e.target.result;
                        img.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            }

            async function uploadImage() {
                if (!selectedFile) {
                    alert("Please select a leaf image first!");
                    return;
                }
                const formData = new FormData();
                formData.append('file', selectedFile);

                try {
                    const response = await fetch('/predict', {
                        method: 'POST',
                        body: formData
                    });
                    const res = await response.json();
                    if (res.success) {
                        const data = res.data;
                        document.getElementById('result').style.display = 'block';
                        document.getElementById('resDisease').innerText = data.disease;
                        document.getElementById('resPlant').innerText = data.plant;
                        document.getElementById('resConf').innerText = data.confidence_percentage;
                        
                        const statusBadge = document.getElementById('resStatus');
                        statusBadge.innerText = data.status;
                        if (data.status === 'Diseased') {
                            statusBadge.className = 'badge diseased';
                        } else {
                            statusBadge.className = 'badge';
                        }

                        const symptomsUl = document.getElementById('resSymptoms');
                        symptomsUl.innerHTML = data.symptoms.map(s => `<li>${s}</li>`).join('');

                        document.getElementById('resOrganic').innerText = data.organic_cure;
                        document.getElementById('resChemical').innerText = data.chemical_cure;
                    }
                } catch (err) {
                    alert('Error connecting to AgriSmart API server: ' + err);
                }
            }
        </script>
    </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
