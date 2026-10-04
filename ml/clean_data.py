"""
AutoMorph AI - Dataset Cleaning Script (Phase 0/1 Preparation)
Cleans auto-mpg.csv, CAR DETAILS FROM CAR DEKHO.csv, and cars_ds_final.csv
Safely uses temporary files and validates outputs before replacing original files.
"""

import os
import re
import shutil
import numpy as np
import pandas as pd

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(DATA_DIR) != "data":
    DATA_DIR = os.path.join(DATA_DIR, "data")


def extract_numeric(val):
    """Helper to extract first floating-point or integer number from a messy string."""
    if pd.isna(val) or not isinstance(val, str):
        return val
    cleaned = str(val).replace('Rs.', '').replace(',', '').strip()
    match = re.search(r'[-+]?\d*\.\d+|\d+', cleaned)
    if match:
        return float(match.group())
    return np.nan


def clean_auto_mpg(filepath):
    print("\n[1/3] Processing auto-mpg.csv...")
    df_raw = pd.read_csv(filepath)
    before_rows, before_cols = df_raw.shape
    df = df_raw.copy()

    # 1. Convert 'horsepower' to numeric (replacing '?' with NaN)
    df['horsepower'] = pd.to_numeric(df['horsepower'].replace('?', np.nan))

    # 2. Impute missing horsepower values using cylinders group median
    cyl_hp_median = df.groupby('cylinders')['horsepower'].transform('median')
    df['horsepower'] = df['horsepower'].fillna(cyl_hp_median)

    # 3. Clean string column whitespace
    df['car name'] = df['car name'].str.strip()

    after_rows, after_cols = df.shape
    print(f"  - Before: {before_rows} rows, {before_cols} cols")
    print(f"  - After:  {after_rows} rows, {after_cols} cols")
    print(f"  - Missing horsepower values imputed: {df_raw['horsepower'].eq('?').sum()}")
    print(f"  - Nulls remaining: {df.isnull().sum().sum()}")
    return df, before_rows, before_cols, after_rows, after_cols


def clean_car_dekho(filepath):
    print("\n[2/3] Processing CAR DETAILS FROM CAR DEKHO.csv...")
    df_raw = pd.read_csv(filepath)
    before_rows, before_cols = df_raw.shape
    df = df_raw.copy()

    # 1. Strip whitespace across string columns
    str_cols = df.select_dtypes(include=['object', 'string']).columns
    for col in str_cols:
        df[col] = df[col].astype(str).str.strip()

    # 2. Remove duplicate rows
    dups_count = df.duplicated().sum()
    df = df.drop_duplicates().reset_index(drop=True)

    after_rows, after_cols = df.shape
    print(f"  - Before: {before_rows} rows, {before_cols} cols")
    print(f"  - After:  {after_rows} rows, {after_cols} cols")
    print(f"  - Duplicate rows removed: {dups_count}")
    print(f"  - Nulls remaining: {df.isnull().sum().sum()}")
    return df, before_rows, before_cols, after_rows, after_cols


def clean_cars_ds_final(filepath):
    print("\n[3/3] Processing cars_ds_final.csv...")
    df_raw = pd.read_csv(filepath)
    before_rows, before_cols = df_raw.shape
    df = df_raw.copy()

    # 1. Drop duplicate index column if present
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])

    # 2. Impute missing Make values based on Model string
    missing_make_mask = df['Make'].isna()
    imputed_count = missing_make_mask.sum()
    for idx in df[missing_make_mask].index:
        model_str = str(df.loc[idx, 'Model'])
        if model_str == 'Go+':
            df.loc[idx, 'Make'] = 'Datsun'
        elif model_str.startswith('Mercedes-Benz'):
            df.loc[idx, 'Make'] = 'Mercedes-Benz'
        elif model_str.startswith('Rolls-Royce'):
            df.loc[idx, 'Make'] = 'Rolls-Royce'
        else:
            df.loc[idx, 'Make'] = model_str.split()[0]

    # 3. Strip whitespace across all string columns
    str_cols = df.select_dtypes(include=['object', 'string']).columns
    for col in str_cols:
        df[col] = df[col].apply(lambda x: x.strip() if isinstance(x, str) else x)

    # 4. Remove duplicate rows after index removal
    dups_count = df.duplicated().sum()
    df = df.drop_duplicates().reset_index(drop=True)

    after_rows, after_cols = df.shape
    print(f"  - Before: {before_rows} rows, {before_cols} cols")
    print(f"  - After:  {after_rows} rows, {after_cols} cols")
    print(f"  - Dropped index column 'Unnamed: 0'")
    print(f"  - Imputed missing Make values: {imputed_count}")
    print(f"  - Duplicate rows removed: {dups_count}")
    print(f"  - Remaining missing Make values: {df['Make'].isna().sum()}")
    return df, before_rows, before_cols, after_rows, after_cols


def validate_df(df, expected_cols_min=5):
    """Validates dataframe before replacing files."""
    if df is None or df.empty:
        raise ValueError("Validation failed: Dataframe is empty or None!")
    if len(df.columns) < expected_cols_min:
        raise ValueError(f"Validation failed: Dataframe has fewer than {expected_cols_min} columns!")
    if df.shape[0] == 0:
        raise ValueError("Validation failed: Dataframe has 0 rows!")
    return True


def run_pipeline():
    files_map = [
        ("auto-mpg.csv", clean_auto_mpg),
        ("CAR DETAILS FROM CAR DEKHO.csv", clean_car_dekho),
        ("cars_ds_final.csv", clean_cars_ds_final)
    ]

    report = []

    for filename, clean_func in files_map:
        original_path = os.path.join(DATA_DIR, filename)
        temp_path = os.path.join(DATA_DIR, f"{filename}.tmp")

        if not os.path.exists(original_path):
            print(f"ERROR: File not found: {original_path}")
            continue

        try:
            # Clean dataframe
            df_cleaned, b_rows, b_cols, a_rows, a_cols = clean_func(original_path)

            # Save to temporary file
            df_cleaned.to_csv(temp_path, index=False)
            print(f"  - Saved temporary file: {temp_path}")

            # Validate temporary file by reading it back
            df_val = pd.read_csv(temp_path)
            validate_df(df_val)
            print(f"  - Validation SUCCESS: Re-read temporary file with shape {df_val.shape}")

            # Safe replacement
            shutil.move(temp_path, original_path)
            print(f"  - Successfully replaced {filename} with cleaned version!")

            report.append({
                "filename": filename,
                "before": (b_rows, b_cols),
                "after": (a_rows, a_cols),
                "status": "Success"
            })

        except Exception as e:
            print(f"  - ERROR during cleaning/validation of {filename}: {str(e)}")
            if os.path.exists(temp_path):
                os.remove(temp_path)
                print(f"  - Cleaned up temp file: {temp_path}")
            print(f"  - ORIGINAL FILE PRESERVED: {original_path}")
            report.append({
                "filename": filename,
                "status": f"Failed: {str(e)}"
            })

    print("\n==========================================")
    print("CLEANING PIPELINE COMPLETE SUMMARY")
    print("==========================================")
    for rep in report:
        print(rep)


if __name__ == "__main__":
    run_pipeline()
