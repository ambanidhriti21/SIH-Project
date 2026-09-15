# AI model artifacts

Place the trained MobileNetV2 Keras model here as:

`crop_disease_model.h5`

The service automatically loads it at startup. Without it, the service reports `fallback_demo` and should not be represented as the trained CNN.
