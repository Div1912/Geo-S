import rasterio
import numpy as np
import matplotlib.pyplot as plt
import os

# === Paths ===
MAY_MASK = "input/masks/may_mask.tif"
JUNE_MASK = "predictions/june_mask_pred.png"
OUTPUT_PATH = "predictions/lake_growth_visual.png"

# === Load masks ===
with rasterio.open(MAY_MASK) as src:
    may_mask = src.read(1)

june_mask = plt.imread(JUNE_MASK)
if june_mask.ndim == 3:
    june_mask = june_mask[:, :, 0]

# === Binarize
may_bin = (may_mask > 0.5).astype(np.uint8)
june_bin = (june_mask > 0.5).astype(np.uint8)

# === Lake Growth
growth_mask = (june_bin == 1) & (may_bin == 0)

# === Visualization
growth_rgb = np.zeros((may_mask.shape[0], may_mask.shape[1], 3), dtype=np.uint8)
growth_rgb[:, :, 0] = growth_mask * 255   # Red for growth
growth_rgb[:, :, 1] = may_bin * 180       # Green = May lake
growth_rgb[:, :, 2] = june_bin * 255      # Blue = June lake

plt.imsave(OUTPUT_PATH, growth_rgb)
print(f"📸 Saved lake growth visualization to {OUTPUT_PATH}")
