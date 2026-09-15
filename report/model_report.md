# 📄 Model Evaluation Report: AgriSmart Crop Disease Detection System

**SIH Problem Statement**: C-433 — AI-Powered Crop Disease Detection Tool & Smart Agriculture Advisory Platform

**Institution**: L. J. Institute of Engineering and Technology

**Primary Evaluation Metric**: Macro-averaged F1 Score on the held-out field-condition test set

---

## 1. Task Description

AgriSmart AI provides an image-based crop disease detection system designed to identify crop and leaf disease conditions from an uploaded image.

The system accepts a crop/leaf image and processes it through the AI inference service. The resulting disease class is mapped to structured agricultural information including severity, symptoms, organic treatment, chemical treatment, and preventive measures.

The application is designed as an end-to-end farmer-oriented platform combining crop disease detection with weather intelligence, multilingual support, and actionable agricultural guidance.

---

## 2. Dataset & Evaluation Specification

The project architecture is designed around publicly available agricultural image datasets, including the PlantVillage dataset and real-world field-condition images.

| Dataset Role | Source | Environment |
| :--- | :--- | :--- |
| Training / Reference Dataset | PlantVillage Dataset | Controlled / laboratory-style conditions |
| Field-Condition Evaluation | Real-world agricultural leaf images | Natural lighting, background variation, clutter and occlusion |

The challenge specification requires evaluation on a held-out field-condition test set in order to measure generalization from controlled images to real-world agricultural conditions.

The current repository contains the application, inference pipeline, disease information catalogue, and evaluation interface required to process a new image.

---

## 3. Model Architecture & Inference Pipeline

The AgriSmart system uses a modular AI-service architecture for image processing and disease detection.

### Inference Flow

Leaf Image → Image Processing → AI Disease Detection → Disease Class + Confidence → Disease Information Mapping → Agricultural Guidance

### Input

- Crop/leaf image
- RGB image input
- Image preprocessing before inference

### Output

The system returns:

- Predicted disease class
- Confidence score
- Crop information
- Disease severity
- Symptoms
- Organic cure
- Chemical cure
- Prevention recommendations

The disease information is maintained through the project's disease catalogue and PostgreSQL database.

---

## 4. Evaluation Metrics

The SIH challenge specifies the following evaluation requirements for the mandatory crop disease detection task:

- Macro-averaged F1 score on the held-out field-condition test set
- Overall accuracy
- Confusion matrix
- Per-class precision
- Per-class recall
- Per-class F1 score

These metrics are intended to measure the system's ability to generalize from controlled agricultural images to real-world field conditions.

No unverified numerical performance values are reported in this document.

The project does not claim a specific Macro-F1 or accuracy value unless it has been generated through a reproducible evaluation on the required held-out test set.

---

## 5. Prediction Interface

The project provides a prediction interface intended to accept a new leaf image and return the predicted disease class.

Example command:

python predict.py --image path/to/leaf_sample.jpg

The prediction pipeline is designed for single-image inference without requiring manual modification of the input image.

---

## 6. Disease Information & Farmer Guidance

After disease detection, the system maps the detected class to structured agricultural information.

The result can include:

- Disease name
- Crop name
- Confidence score
- Severity level
- Symptoms
- Organic treatment
- Chemical treatment
- Prevention measures

This approach converts an image-classification result into practical information that can be understood and acted upon by farmers.

---

## 7. Additional Intelligence Modules

The system extends the disease detection workflow with additional farmer-oriented capabilities.

### Weather-Based Risk Advisor

The application integrates weather information to provide:

- Current temperature
- Humidity
- Rainfall probability
- Weather condition
- Disease-risk indication
- Irrigation guidance
- Spraying guidance

Weather information is obtained through an external weather API.

### Multilingual Farmer Support

The user interface supports:

- English
- Hindi
- Gujarati

This feature is intended to improve accessibility for farmers and users who may prefer regional-language interaction.

---

## 8. Known Limitations & Failure Cases

1. **Field-condition variation**: Natural lighting, background clutter, occlusion, and image quality can affect prediction confidence.

2. **Low-light images**: Extremely dark images may reduce the quality of image-based disease detection.

3. **Mud and occlusion**: Soil splashes, damaged leaves, or heavily obstructed leaf surfaces may make disease characteristics difficult to identify.

4. **Domain shift**: Controlled agricultural images and real-world field images can differ substantially in appearance.

5. **Weather dependency**: Weather-based recommendations depend on the availability and accuracy of external weather information.

6. **Decision-support limitation**: The system provides agricultural decision support and should not be considered a replacement for professional agricultural advice.

---

## 9. Reproducibility

The project is organized as a modular application consisting of:

- React frontend
- FastAPI backend
- AI inference service
- PostgreSQL database
- Disease information catalogue
- Weather API integration

The repository contains the application source code, dependency information, prediction interface, architecture documentation, and supporting project files required to reproduce the application workflow.

---

## 10. Evaluation Status

The current submission emphasizes a complete end-to-end agricultural assistance platform consisting of crop disease detection, farmer guidance, weather intelligence, multilingual support, prediction history, and database-backed application functionality.

Numerical model-performance claims are intentionally omitted unless they can be reproduced from the required held-out evaluation dataset.

This report therefore maintains an honest distinction between the implemented application functionality and formally validated model-performance metrics.

---