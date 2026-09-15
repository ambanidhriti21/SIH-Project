"""
AgriSmart - Crop Disease Classification Model Training Pipeline
Uses Transfer Learning (MobileNetV2) trained on the PlantVillage Dataset.
"""

import os
import json
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_SAVE_DIR = os.path.join(BASE_DIR, "model")

def train(dataset_dir: str):
    """
    Trains a MobileNetV2 CNN classifier on leaf dataset directory.
    Expected Directory Structure:
    dataset_dir/
       ├── Tomato___Early_blight/
       ├── Tomato___Healthy/
       └── Potato___Early_blight/
    """
    os.makedirs(MODEL_SAVE_DIR, exist_ok=True)
    
    print(f"[INFO] Preparing Data Generators from {dataset_dir}...")
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = train_datagen.flow_from_directory(
        dataset_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    num_classes = len(train_generator.class_indices)
    print(f"[INFO] Detected {num_classes} classes: {list(train_generator.class_indices.keys())}")

    # Build Transfer Learning Model
    base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False  # Freeze base layers for fast initial training

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("[INFO] Starting Model Training...")
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_SAVE_DIR, "crop_disease_model.h5"),
            save_best_only=True
        )
    ]

    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=callbacks
    )

    print(f"[SUCCESS] Model successfully saved to {os.path.join(MODEL_SAVE_DIR, 'crop_disease_model.h5')}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AgriSmart Crop Disease Model Trainer")
    parser.add_argument("--dataset", type=str, required=True, help="Path to raw dataset folder")
    args = parser.parse_args()
    
    train(args.dataset)
