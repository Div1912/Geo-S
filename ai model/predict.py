import argparse
import torch
import rasterio
import numpy as np
import os
from model import UNet
from torchvision import transforms

# ==== Argument parser ====
parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str, required=True, help='Path to stacked image (e.g., june_345.tif)')
parser.add_argument('--model', type=str, required=True, help='Path to trained model (e.g., unet_glacier.pth)')
parser.add_argument('--output', type=str, required=True, help='Path to save predicted mask (tif)')

args = parser.parse_args()

# ==== Load image ====
with rasterio.open(args.image) as src:
    img = src.read().astype(np.float32)
    profile = src.profile

# ==== Normalize image ====
img = img / 255.0
img_tensor = torch.tensor(img).unsqueeze(0)  # Shape: (1, 3, H, W)

# ==== Load model ====
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = UNet()
model.load_state_dict(torch.load(args.model, map_location=device))
model.to(device)
model.eval()

# ==== Predict ====
with torch.no_grad():
    pred = model(img_tensor.to(device))
    pred_mask = (pred.squeeze().cpu().numpy() > 0.5).astype(np.uint8)

# ==== Save output ====
os.makedirs(os.path.dirname(args.output), exist_ok=True)
profile.update(count=1, dtype=rasterio.uint8)

with rasterio.open(args.output, 'w', **profile) as dst:
    dst.write(pred_mask, 1)

print(f"✅ Saved predicted mask to: {args.output}")
