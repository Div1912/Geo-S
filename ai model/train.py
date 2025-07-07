import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from PIL import Image
from unet import UNet
from tqdm import tqdm

# === CONFIG ===
IMAGE_DIR = "data/train/images"
MASK_DIR = "data/train/masks"
EPOCHS = 20
BATCH_SIZE = 8
LEARNING_RATE = 1e-4
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# === Dataset Class ===
class GlacierDataset(Dataset):
    def __init__(self, img_dir, mask_dir, transform=None):
        self.img_dir = img_dir
        self.mask_dir = mask_dir
        self.transform = transform
        self.img_names = sorted(os.listdir(img_dir))

    def __len__(self):
        return len(self.img_names)

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_names[idx])
        mask_path = os.path.join(self.mask_dir, self.img_names[idx])

        image = Image.open(img_path).convert("RGB")
        mask = Image.open(mask_path).convert("L")

        if self.transform:
            image = self.transform(image)  # shape: [3, H, W]
            mask = self.transform(mask)    # shape: [1, H, W]

        return image, mask

# === Transform ===
transform = transforms.Compose([
    transforms.ToTensor(),  # [0,255] → [0.0–1.0]
])

# === Dataloader ===
dataset = GlacierDataset(IMAGE_DIR, MASK_DIR, transform=transform)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# === Model, Loss, Optimizer ===
model = UNet(in_c=3, out_c=1).to(DEVICE)
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# === Training Loop ===
print("🚀 Starting training...")
for epoch in range(EPOCHS):
    model.train()
    epoch_loss = 0

    for imgs, masks in tqdm(dataloader, desc=f"Epoch {epoch+1}/{EPOCHS}"):
        imgs = imgs.to(DEVICE)
        masks = masks.to(DEVICE)

        preds = model(imgs)               # shape: [B, 1, H, W]
        loss = criterion(preds, masks)    # same shape: [B, 1, H, W]

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        epoch_loss += loss.item()

    print(f"📉 Epoch {epoch+1}: Loss = {epoch_loss:.4f}")

# === Save Model ===
torch.save(model.state_dict(), "unet_glacier.pth")
print("✅ Model saved as unet_glacier.pth")
