import torch
import numpy as np
import os
from model import UNet
from tqdm import tqdm
from skimage.io import imsave
from skimage.util import montage

# === CONFIG ===
PATCH_PATH = "inference_patches/patches.npy"
MODEL_PATH = "unet_glacier.pth"
OUT_DIR = "predictions"
PATCH_SIZE = 256
PATCHES_PER_ROW = 32  # for reshaping back into grid

os.makedirs(OUT_DIR, exist_ok=True)

# === Load patches ===
patches = np.load(PATCH_PATH)  # Shape: (N, 3, 256, 256)
print(f"📦 Loaded {len(patches)} patches")

# === Load model ===
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = UNet(in_channels=3, out_channels=1).to(device)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# === Predict ===
preds = []
with torch.no_grad():
    for i in tqdm(range(0, len(patches), 8)):
        batch = torch.tensor(patches[i:i+8]).float().to(device)
        output = model(batch)
        pred = torch.sigmoid(output).cpu().numpy()
        preds.append(pred)

preds = np.concatenate(preds, axis=0)  # (N, 1, 256, 256)
print(f"✅ Predictions done. Shape: {preds.shape}")

# === Flatten and combine into one big mask ===
flat_masks = preds[:, 0] > 0.5  # Thresholded
rows = len(preds) // PATCHES_PER_ROW
big_mask = np.vstack([
    np.hstack(flat_masks[r*PATCHES_PER_ROW:(r+1)*PATCHES_PER_ROW])
    for r in range(rows)
])
imsave(f"{OUT_DIR}/june_mask_pred.png", big_mask.astype("uint8") * 255)
print(f"✅ Saved full predicted mask at {OUT_DIR}/june_mask_pred.png")
