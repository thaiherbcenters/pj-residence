import os
import sys
from PIL import Image

# Force UTF-8 output for Windows console
sys.stdout.reconfigure(encoding='utf-8')

def optimize_images(root_directory):
    for root, dirs, files in os.walk(root_directory):
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, filename)
                
                # Skip if already optimized or is a generated webp
                if filename.endswith('.webp'):
                    continue
                    
                # Skip if a webp version already exists to avoid re-processing if run multiple times
                # (unless we want to force re-generation, but for now safe is better)
                webp_filename = os.path.splitext(filename)[0] + '.webp'
                webp_filepath = os.path.join(root, webp_filename)
                
                if os.path.exists(webp_filepath):
                    print(f"Skipping {filename}, .webp already exists.")
                    continue

                try:
                    with Image.open(filepath) as img:
                        # Resize if too large (e.g. > 1920px width)
                        if img.width > 1920:
                            ratio = 1920 / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                            print(f"Resizing {filename} to 1920px width")
                        
                        # Convert to RGB if necessary (e.g. for PNGs with transparency)
                        if img.mode in ('RGBA', 'LA'):
                            # WebP supports transparency, but if we wanted to enforce RGB we'd convert.
                            # Standard WebP save handles RGBA fine for lossless/lossy.
                            pass

                        # Save as WebP
                        # Using quality=90 for high quality as requested
                        img.save(webp_filepath, 'WEBP', quality=90)
                        
                        old_size = os.path.getsize(filepath)
                        new_size = os.path.getsize(webp_filepath)
                        reduction = (old_size - new_size) / old_size * 100
                        
                        print(f"Converted {filename}: {old_size/1024:.1f}KB -> {new_size/1024:.1f}KB (-{reduction:.1f}%)")
                        
                except Exception as e:
                    print(f"Failed to convert {filename}: {e}")

if __name__ == "__main__":
    target_dir = os.path.join(os.getcwd(), 'public', 'images')
    print(f"Optimizing images in {target_dir}...")
    optimize_images(target_dir)
