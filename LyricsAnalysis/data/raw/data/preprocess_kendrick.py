import sys

sys.stdout.reconfigure(encoding="utf-8")

import os
import re
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ── CONFIG ──────────────────────────────────────────────────────
INPUT_CSV = r"..\..\discog_data.csv"  # path to your uploaded file
OUTPUT_DIR = "output/"
THRESHOLD = 0.60
# ────────────────────────────────────────────────────────────────


def clean_lyrics(text):
    text = re.sub(r"\[.*?\]", "", text)  # remove [Verse], [Chorus] if any
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


print("=" * 50)
print("STEP 1: Loading CSV...")
print("=" * 50)

df = pd.read_csv(INPUT_CSV)
df = df.rename(columns={"track_name": "title"})
df["lyrics"] = df["lyrics"].fillna("").apply(clean_lyrics)
df = df[df["lyrics"].str.split().str.len() >= 30]
df.drop_duplicates(subset=["title"], keep="first", inplace=True)
df.reset_index(drop=True, inplace=True)

print(f"  [OK] Loaded {len(df)} songs across {df['album'].nunique()} albums")
for album in df["album"].unique():
    count = len(df[df["album"] == album])
    print(f"       {album} - {count} songs")

print("\n" + "=" * 50)
print("STEP 2: Generating SBERT embeddings...")
print("=" * 50)

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(df["lyrics"].tolist(), show_progress_bar=True, batch_size=32)
df["embedding"] = list(embeddings)
print("  [OK] Embeddings complete!")

print("\n" + "=" * 50)
print("STEP 3: Computing similarity scores...")
print("=" * 50)

matrix = np.vstack(df["embedding"].values)
sim_matrix = cosine_similarity(matrix)

edges = []
for i in range(len(df)):
    for j in range(i + 1, len(df)):
        score = sim_matrix[i][j]
        if score >= THRESHOLD:
            edges.append(
                {
                    "song_a": df.iloc[i]["title"],
                    "album_a": df.iloc[i]["album"],
                    "song_b": df.iloc[j]["title"],
                    "album_b": df.iloc[j]["album"],
                    "similarity": round(float(score), 4),
                }
            )

edges_df = pd.DataFrame(edges)
print(f"  [OK] {len(edges_df)} edges at threshold {THRESHOLD}")

if len(edges_df) < 30:
    print("  [WARN] Very few edges - try lowering THRESHOLD to 0.55")
elif len(edges_df) > 600:
    print("  [WARN] Many edges - try raising THRESHOLD to 0.65")

print("\n" + "=" * 50)
print("STEP 4: Saving output...")
print("=" * 50)

# Save nodes — include the extra metadata columns too!
df[
    ["title", "album", "release_date", "popularity", "tempo", "danceability", "lyrics"]
].to_csv(os.path.join(OUTPUT_DIR, "kendrick_nodes.csv"), index=False)
edges_df.to_csv(os.path.join(OUTPUT_DIR, "kendrick_edges.csv"), index=False)

print(f"  [OK] Nodes saved -> output/kendrick_nodes.csv")
print(f"  [OK] Edges saved -> output/kendrick_edges.csv")
print(f"\n[DONE] Songs: {len(df)} | Connections: {len(edges_df)}")
