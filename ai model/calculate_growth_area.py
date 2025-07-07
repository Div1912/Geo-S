import rasterio
import matplotlib.pyplot as plt
import numpy as np

# === Load may mask
with rasterio.open("input/masks/may_mask.tif") as may_src:
    may = may_src.read(1)
    transform = may_src.transform
    pixel_area_km2 = abs(transform.a * transform.e) / 1e6

# === Load june mask
june = plt.imread("predictions/june_mask_pred.png")
if june.ndim == 3:
    june = june[:, :, 0]

# === Binarize
may = (may > 0.5).astype(np.uint8)
june = (june > 0.5).astype(np.uint8)
# Resize june mask to match may if shapes differ
if june.shape != may.shape:
    from skimage.transform import resize
    print(f"⚠️ Resizing June mask from {june.shape} to {may.shape}")
    june = resize(june, may.shape, preserve_range=True, anti_aliasing=True).astype(np.uint8)

growth = (june == 1) & (may == 0)
pixels = np.sum(growth)
area = pixels * pixel_area_km2

print(f"✅ Estimated lake growth: {area:.2f} sq. km")
