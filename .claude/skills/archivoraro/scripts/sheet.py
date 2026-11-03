# usage: python3 sheet.py out.png img1 img2 ...  -> grid of half... third-size frames with time labels
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
w, h = 360, 640
cols = min(5, len(files)); rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), 'black')
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((w, h))
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    d.text((x + 6, y + 6), f.split('/')[-1], fill='yellow')
sheet.save(out)
