import rasterio
import numpy as np
from skimage.transform import resize
import imageio

# === File Paths ===
MAY_MASK_PATH = "input/masks/may_mask.tif"
JUNE_MASK_PATH = "predictions/june_mask_pred.png"
OUTPUT_GROWTH_PATH = "predictions/lake_growth_mask.tif"

# === Load masks ===
with rasterio.open(MAY_MASK_PATH) as src:
    may_mask = src.read(1)
    profile = src.profile

# Read predicted June mask (PNG)
june_mask = imageio.imread(JUNE_MASK_PATH)
if june_mask.ndim == 3:
    june_mask = june_mask[:, :, 0]  # convert RGB to grayscale

# === Resize June mask to match May ===
june_mask_resized = resize(june_mask, may_mask.shape, preserve_range=True, anti_aliasing=True).astype(np.uint8)

# === Binarize masks ===
may_bin = (may_mask > 0.5).astype(np.uint8)
june_bin = (june_mask_resized > 0.5).astype(np.uint8)

# === Calculate lake growth ===
growth_mask = (june_bin == 1) & (may_bin == 0)

# === Save final binary growth mask ===
profile.update(dtype=rasterio.uint8, count=1)
with rasterio.open(OUTPUT_GROWTH_PATH, "w", **profile) as dst:
    dst.write(growth_mask.astype(np.uint8), 1)

print("✅ Lake growth mask saved at:", OUTPUT_GROWTH_PATH)
