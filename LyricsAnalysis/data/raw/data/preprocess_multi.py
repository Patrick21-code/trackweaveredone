import sys

sys.stdout.reconfigure(encoding="utf-8")

import os
import re
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


def process_artist(filename_key, display_name, model):
    # Skip if already processed
    key = filename_key.lower()
    nodes_path = os.path.join(OUTPUT_DIR, f"{key}_nodes.csv")
    edges_path = os.path.join(OUTPUT_DIR, f"{key}_edges.csv")
    if os.path.exists(nodes_path) and os.path.exists(edges_path):
        print(f"  [SKIP] Already processed: {display_name}")
        return None, None   # signals to skip saving too

# ── CONFIG ──────────────────────────────────────────────────────────────
DATA_DIR = r"..\.."  # folder containing all the artist CSVs
OUTPUT_DIR = r"..\..\..\output\graph_data"  # where nodes/edges CSVs go
THRESHOLD = 0.60

# Map filename -> display name (add/remove as needed)
ARTISTS = {
    "ArianaGrande": "Ariana Grande",
    "Beyonce": "Beyoncé",
    "BillieEilish": "Billie Eilish",
    "BTS": "BTS",
    "CardiB": "Cardi B",
    "CharliePuth": "Charlie Puth",
    "ColdPlay": "Coldplay",
    "Drake": "Drake",
    "DuaLipa": "Dua Lipa",
    "EdSheeran": "Ed Sheeran",
    "Eminem": "Eminem",
    "JustinBieber": "Justin Bieber",
    "KatyPerry": "Katy Perry",
    "Khalid": "Khalid",
    "LadyGaga": "Lady Gaga",
    "Maroon5": "Maroon 5",
    "NickiMinaj": "Nicki Minaj",
    "PostMalone": "Post Malone",
    "Rihanna": "Rihanna",
    "SelenaGomez": "Selena Gomez",
    "TaylorSwift": "Taylor Swift",
}
# ────────────────────────────────────────────────────────────────────────


def clean_lyrics(text):
    text = re.sub(r"\[.*?\]", "", str(text))  # remove [Verse], [Chorus] if any
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def process_artist(filename_key, display_name, model):
    csv_path = os.path.join(DATA_DIR, f"{filename_key}.csv")

    if not os.path.exists(csv_path):
        print(f"  [SKIP] File not found: {csv_path}")
        return None, None

    df = pd.read_csv(csv_path)

    # Normalize column names to lowercase for safety
    df.columns = [c.strip().lower() for c in df.columns]

    # Map column names — handles both dataset formats
    col_map = {
        "title": ["title", "track_name", "song", "name"],
        "album": ["album", "album_name"],
        "lyrics": ["lyric", "lyrics", "text"],
        "year": ["year", "release_date", "date"],
    }

    for target, candidates in col_map.items():
        for c in candidates:
            if c in df.columns:
                df.rename(columns={c: target}, inplace=True)
                break

    # Check required columns exist
    for required in ["title", "album", "lyrics"]:
        if required not in df.columns:
            print(f"  [SKIP] Missing column '{required}' in {filename_key}.csv")
            print(f"         Available columns: {list(df.columns)}")
            return None, None

    df["lyrics"] = df["lyrics"].fillna("").apply(clean_lyrics)
    df = df[df["lyrics"].str.split().str.len() >= 30]
    df.drop_duplicates(subset=["title"], keep="first", inplace=True)
    df.reset_index(drop=True, inplace=True)

    if len(df) == 0:
        print(f"  [SKIP] No valid songs found in {filename_key}.csv")
        return None, None

    print(f"  [OK] {display_name} — {len(df)} songs, {df['album'].nunique()} albums")

    # SBERT embeddings
    embeddings = model.encode(
        df["lyrics"].tolist(), show_progress_bar=False, batch_size=32
    )

    # Cosine similarity + edge building
    matrix = np.vstack(embeddings)
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

    nodes_df = df[["title", "album"]].copy()
    if "year" in df.columns:
        nodes_df["year"] = df["year"]

    edges_df = pd.DataFrame(edges)

    return nodes_df, edges_df


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 55)
    print("Loading SBERT model...")
    print("=" * 55)
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("[OK] Model loaded\n")

    results = []

    for filename_key, display_name in ARTISTS.items():
        print(f"Processing: {display_name}")
        nodes_df, edges_df = process_artist(filename_key, display_name, model)

        if nodes_df is None:
            continue

        # Save using the filename key (lowercase) so graph.html can find it
        key = filename_key.lower()
        nodes_path = os.path.join(OUTPUT_DIR, f"{key}_nodes.csv")
        edges_path = os.path.join(OUTPUT_DIR, f"{key}_edges.csv")

        nodes_df.to_csv(nodes_path, index=False)
        edges_df.to_csv(edges_path, index=False)

        results.append(
            {
                "key": key,
                "name": display_name,
                "songs": len(nodes_df),
                "edges": len(edges_df),
                "albums": nodes_df["album"].nunique(),
            }
        )

        print(f"         {len(edges_df)} edges at threshold {THRESHOLD}")
        print(f"         Saved -> {key}_nodes.csv, {key}_edges.csv\n")

    print("=" * 55)
    print("DONE — Summary")
    print("=" * 55)
    for r in results:
        print(
            f"  {r['name']:<25} {r['songs']:>4} songs  {r['edges']:>5} edges  {r['albums']:>3} albums"
        )

    print(f"\n[OK] All files saved to: {OUTPUT_DIR}")
    print("\nAdd these keys to ARTISTS in graph.html:")
    for r in results:
        print(
            f'  {r["key"]}: {{ name: "{r["name"]}", nodesFile: "graph_data/{r["key"]}_nodes.csv", ... }}'
        )


if __name__ == "__main__":
    main()
