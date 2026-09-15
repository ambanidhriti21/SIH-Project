"""
AgriSmart AI - Mandatory SIH Core Evaluation Interface
Signature: predict(image_path: str) -> str
CLI Usage: python predict.py --image path/to/leaf.jpg
"""

import sys
import os
import argparse
import json
from model_engine import predictor

def predict(image_path: str) -> dict:
    """
    Mandatory SIH function signature.
    Accepts path to a leaf image file, runs inference, and returns predicted class and details.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")
        
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    result = predictor.predict(image_bytes)
    return result

def main():
    parser = argparse.ArgumentParser(description="AgriSmart SIH Crop Disease Classifier CLI")
    parser.add_argument("--image", type=str, required=True, help="Path to input crop leaf image")
    args = parser.parse_args()

    try:
        res = predict(args.image)
        print("\n=======================================================")
        print("               AGRISMART AI PREDICTION                 ")
        print("=======================================================")
        print(f"PREDICTED CLASS   : {res['class_id']}")
        print(f"PLANT             : {res['plant']}")
        print(f"DISEASE NAME      : {res['disease']}")
        print(f"HEALTH STATUS     : {res['status']}")
        print(f"CONFIDENCE SCORE  : {res['confidence_percentage']}%")
        print(f"INFERENCE MODE    : {res['inference_mode']}")
        print("-------------------------------------------------------")
        print("ORGANIC CURE      : " + res['organic_cure'])
        print("CHEMICAL CURE     : " + res['chemical_cure'])
        print("=======================================================\n")
    except Exception as e:
        print(f"[ERROR] Evaluation failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
