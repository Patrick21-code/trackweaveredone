import sys
sys.stdout.reconfigure(encoding="utf-8")
import os
import re
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
ALBUMS_DIR = "Albums/"
OUTPUT_DIR = "output/"
SIMILARITY_THRESHOLD = 0.60

# Main studio albums only — skips deluxe/remixes/editions/live
MAIN_ALBUMS = {
    "TaylorSwift": "Taylor Swift",
    "Fearless": "Fearless",
    "SpeakNow": "Speak Now",
    "Red": "Red",
    "1989": "1989",
    "Reputation": "Reputation",
    "Lover": "Lover",
    "Folklore": "Folklore",
    "Evermore": "Evermore",
    "Midnights": "Midnights",
    "THETORTUREDPOETSDEPARTMENT": "The Tortured Poets Department",
}
# key   = exact folder name inside Albums/
# value = clean readable album name for your graph


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def clean_lyrics(text):
    # Remove Genius header junk before the first section tag
    text = re.sub(r"^.*?(?=\[)", "", text, flags=re.DOTALL)
    # Remove section labels like [Verse 1], [Chorus], [Bridge]
    text = re.sub(r"\[.*?\]", "", text)
    # Remove Genius artifacts
    text = re.sub(r"You might also like", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\d+Embed$", "", text.strip())
    text = re.sub(r"\d+Contributors.*?Lyrics", "", text, flags=re.DOTALL)
    # Clean whitespace
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_song_title(filename):
    name = filename.replace(".txt", "")
    name = re.sub(r"^\d+_", "", name)  # remove leading "01_" track numbers
    name = name.replace("_", " ").strip()
    return name


# ─────────────────────────────────────────────
# STEP 1 — LOAD & CLEAN
# ─────────────────────────────────────────────
print("=" * 50)
print("STEP 1: Loading and cleaning lyrics...")
print("=" * 50)

songs = []

for folder_name, album_label in MAIN_ALBUMS.items():
    album_path = os.path.join(ALBUMS_DIR, folder_name)

    if not os.path.exists(album_path):
        print(f"    Folder not found, skipping: {folder_name}")
        continue

    txt_files = [f for f in os.listdir(album_path) if f.endswith(".txt")]

    if not txt_files:
        print(f"    No .txt files found in: {folder_name}")
        continue

    for filename in txt_files:
        filepath = os.path.join(album_path, filename)

        with open(filepath, "r", encoding="utf-8") as f:
            raw = f.read()

        cleaned = clean_lyrics(raw)

        # Skip songs that are too short after cleaning (interludes, skits, etc.)
        if len(cleaned.split()) < 30:
            print(f"    Skipping (too short after clean): {filename}")
            continue

        songs.append(
            {
                "title": parse_song_title(filename),
                "album": album_label,
                "lyrics": cleaned,
            }
        )

    print(f"   {folder_name} — loaded {len(txt_files)} songs")

# Build dataframe
df = pd.DataFrame(songs)

# Remove duplicate song titles (same song across Taylor's Version, deluxe, etc.)
before = len(df)
df.drop_duplicates(subset=["title"], keep="first", inplace=True)
df.reset_index(drop=True, inplace=True)
after = len(df)

print(f"\n   Total songs loaded:     {before}")
print(f"   After deduplication:    {after}")
print(f"   Albums represented:     {df['album'].nunique()}")


# ─────────────────────────────────────────────
# STEP 2 — SBERT EMBEDDINGS
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("STEP 2: Generating SBERT embeddings...")
print("=" * 50)

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(df["lyrics"].tolist(), show_progress_bar=True, batch_size=32)

df["embedding"] = list(embeddings)
print("   Embeddings complete!")


# ─────────────────────────────────────────────
# STEP 3 — COSINE SIMILARITY & EDGES
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("STEP 3: Computing similarity scores...")
print("=" * 50)

embedding_matrix = np.vstack(df["embedding"].values)
similarity_matrix = cosine_similarity(embedding_matrix)

edges = []
for i in range(len(df)):
    for j in range(i + 1, len(df)):
        score = similarity_matrix[i][j]
        if score >= SIMILARITY_THRESHOLD:
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

print(f"   {len(edges_df)} edges found at threshold {SIMILARITY_THRESHOLD}")

if len(edges_df) < 50:
    print("    Very few edges — consider lowering SIMILARITY_THRESHOLD to 0.65")
elif len(edges_df) > 800:
    print("    Lots of edges — consider raising SIMILARITY_THRESHOLD to 0.80")


# ─────────────────────────────────────────────
# STEP 4 — EXPORT
# ─────────────────────────────────────────────
print("\n" + "=" * 50)
print("STEP 4: Saving output files...")
print("=" * 50)

nodes_path = os.path.join(OUTPUT_DIR, "songs_nodes.csv")
edges_path = os.path.join(OUTPUT_DIR, "songs_edges.csv")

df[["title", "album", "lyrics"]].to_csv(nodes_path, index=False)
edges_df.to_csv(edges_path, index=False)

print(f"   Nodes saved → {nodes_path}")
print(f"   Edges saved → {edges_path}")
print("\n🎉 Preprocessing complete! Ready for Neo4j.")
print(f"   Songs (nodes): {len(df)}")
print(f"   Connections (edges): {len(edges_df)}")
