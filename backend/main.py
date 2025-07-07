import rasterio
import numpy as np
import matplotlib.pyplot as plt
from skimage.transform import resize

# ==== File Paths ====
may_green = 'may_band2.tif'   # Green band (May)
may_nir   = 'may_band3.tif'   # NIR band (May)
june_green = 'june_band2.tif' # Green band (June)
june_nir   = 'june_band3.tif' # NIR band (June)

# ==== NDWI Calculation ====
def calculate_ndwi(green_path, nir_path):
    with rasterio.open(green_path) as g, rasterio.open(nir_path) as n:
        green = g.read(1).astype('float32')
        nir = n.read(1).astype('float32')

    # Resize NIR to match green shape if needed
    if green.shape != nir.shape:
        print("⚠️ Resizing NIR to match Green shape...")
        nir = resize(nir, green.shape, preserve_range=True, anti_aliasing=True).astype('float32')

    ndwi = (green - nir) / (green + nir + 1e-10)
    return ndwi

# ==== Water Mask Generator ====
def generate_water_mask(ndwi, threshold):
    return (ndwi > threshold).astype('uint8')

# ==== Growth Mask ====
def compute_growth_mask(mask_june, mask_may):
    diff = mask_june - mask_may
    diff[diff < 0] = 0
    return diff

# ==== Save Mask as TIF ====
def save_mask(mask, reference_path, output_tif):
    with rasterio.open(reference_path) as ref:
        meta = ref.meta.copy()
        meta.update(dtype=rasterio.uint8, count=1)
        with rasterio.open(output_tif, 'w', **meta) as dst:
            dst.write(mask.astype('uint8'), 1)

# ==== Load Pixel Size from Image ====
def get_pixel_area_km2(image_path):
    with rasterio.open(image_path) as src:
        pixel_size_x, pixel_size_y = src.res
        pixel_area_km2 = (pixel_size_x * pixel_size_y) / 1e6
        print(f"ℹ️ Pixel resolution: {pixel_size_x}m x {pixel_size_y}m | Area: {pixel_area_km2:.6f} km²")
        return pixel_area_km2

# ==== Main Workflow ====
ndwi_may = calculate_ndwi(may_green, may_nir)
ndwi_june = calculate_ndwi(june_green, june_nir)

PIXEL_AREA_KM2 = get_pixel_area_km2(may_green)

# === Preview NDWI Images ===
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.imshow(ndwi_may, cmap='BrBG', vmin=-0.3, vmax=0.3)
plt.title('NDWI - May')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(ndwi_june, cmap='BrBG', vmin=-0.3, vmax=0.3)
plt.title('NDWI - June')
plt.axis('off')
plt.tight_layout()
plt.show()

# === NDWI Difference Map ===
ndwi_diff = ndwi_june - ndwi_may
plt.figure(figsize=(6, 5))
plt.imshow(ndwi_diff, cmap='coolwarm', vmin=-0.5, vmax=0.5)
plt.colorbar(label='NDWI Change (June - May)')
plt.title("NDWI Difference Map")
plt.axis('off')
plt.tight_layout()
plt.savefig("ndwi_diff_map.png", dpi=300)
plt.show()

# === Threshold Scan ===
print("\n📊 Threshold scan summary:")
best_thresh = None
max_growth = 0
best_mask = None

for thresh in np.arange(-0.05, 0.05, 0.005):
    mask_may = generate_water_mask(ndwi_may, thresh)
    mask_june = generate_water_mask(ndwi_june, thresh)
    growth_mask = compute_growth_mask(mask_june, mask_may)
    changed_pixels = np.sum(growth_mask)
    area = changed_pixels * PIXEL_AREA_KM2
    print(f"  Threshold {thresh:.3f} → Pixels: {changed_pixels}, Area: {area:.4f} km²")
    
    if area > max_growth:
        max_growth = area
        best_thresh = thresh
        best_mask = growth_mask

# === Final Output ===
if max_growth > 0 and best_mask is not None:
    print(f"\n✅ Best NDWI Threshold: {best_thresh:.3f}")
    print(f"✅ Estimated lake growth: {max_growth:.4f} sq km")
    
    # Save raster mask
    save_mask(best_mask, may_green, 'lake_growth_mask.tif')

    # Visualize lake growth
    plt.imshow(best_mask, cmap='Reds')
    plt.title("Lake Growth (New Water)")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig("lake_growth_visual.png", dpi=300)
    plt.show()
    print("📸 Saved: lake_growth_visual.png")
    print("📁 Saved: lake_growth_mask.tif")
else:
    print("\n⚠️ No lake growth detected for any threshold in range.")
