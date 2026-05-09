import pandas as pd

file_path = "data/raw/bdg2/electricity_cleaned.csv"

df = pd.read_csv(file_path, nrows=5)

print("Column names:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df)

print("\nShape preview:")
print(df.shape)