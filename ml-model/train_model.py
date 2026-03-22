import pandas as pd
import numpy as np
import os
import joblib
import logging
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_PATH = os.path.join(BASE_DIR, "cleaned_merged_heart_dataset.csv")
    MODEL_PATH = os.path.join(BASE_DIR, "ml-model", "heart_model.pkl")

    logger.info(f"Loading dataset from {DATA_PATH}")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        logger.error(f"Dataset not found at {DATA_PATH}")
        return

    # Check for missing values and handle them (if any)
    if df.isnull().sum().any():
        logger.warning("Missing values detected. Dropping missing values.")
        df = df.dropna()

    logger.info(f"Dataset Shape: {df.shape}")

    # Features and Target
    X = df.drop("target", axis=1)
    y = df["target"]

    # Train-test split (80-20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    logger.info("Initializing Machine Learning Pipeline...")
    # Create a pipeline with a scaler and a classifier
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    # Define hyperparameter grid for GridSearchCV
    param_grid = {
        'classifier__n_estimators': [50, 100, 200],
        'classifier__max_depth': [None, 10, 20],
        'classifier__min_samples_split': [2, 5, 10],
        'classifier__min_samples_leaf': [1, 2, 4]
    }

    logger.info("Starting Hyperparameter Tuning with GridSearchCV (5-Fold CV)...")
    grid_search = GridSearchCV(
        pipeline, param_grid, cv=5, scoring='f1', n_jobs=-1, verbose=1
    )

    # Fit the grid search to the data
    grid_search.fit(X_train, y_train)

    logger.info(f"Best Hyperparameters: {grid_search.best_params_}")
    
    # Get the best estimator
    best_model = grid_search.best_estimator_

    logger.info("Evaluating the best model on the TEST set...")
    y_pred = best_model.predict(X_test)
    y_prob = best_model.predict_proba(X_test)[:, 1]

    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)

    logger.info("-" * 40)
    logger.info("TEST SET METRICS:")
    logger.info(f"Accuracy:  {accuracy:.4f}")
    logger.info(f"Precision: {precision:.4f}")
    logger.info(f"Recall:    {recall:.4f}")
    logger.info(f"F1 Score:  {f1:.4f}")
    logger.info(f"ROC AUC:   {roc_auc:.4f}")
    logger.info("-" * 40)

    logger.info("\nClassification Report:\n" + classification_report(y_test, y_pred))
    
    cm = confusion_matrix(y_test, y_pred)
    logger.info(f"\nConfusion Matrix:\n{cm}")

    # Cross-validation score on whole dataset for robustness check
    logger.info("Performing 5-Fold Cross Validation on the entire dataset for robustness...")
    cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='accuracy')
    logger.info(f"CV Accuracy Scores: {cv_scores}")
    logger.info(f"Mean CV Accuracy: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores) * 2:.4f})")

    # Save the model
    logger.info(f"Saving the production-ready model to {MODEL_PATH}")
    joblib.dump(best_model, MODEL_PATH)
    logger.info("Pipeline successfully generated and saved. Ready for deployment!")

if __name__ == "__main__":
    main()
