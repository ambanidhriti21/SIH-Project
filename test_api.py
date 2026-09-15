"""
AgriSmart API & Model Test Script
Generates a dummy synthetic leaf image and sends it to the predictor engine to verify execution.
"""

import os
import io
import json
from PIL import Image
from model_engine import predictor

def run_test():
    print("[TEST] Creating synthetic leaf test image...")
    # Create a 224x224 green image simulating a leaf
    img = Image.new('RGB', (224, 224), color=(34, 139, 34))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    image_bytes = img_byte_arr.getvalue()

    print("[TEST] Running predictor on test image...")
    result = predictor.predict(image_bytes)

    print("\n================ PREDICTION OUTPUT ================")
    print(json.dumps(result, indent=2))
    print("====================================================\n")
    print("[SUCCESS] Crop Disease Detection pipeline verified successfully!")

if __name__ == "__main__":
    run_test()
