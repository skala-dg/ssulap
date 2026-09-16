from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).parent
paths = sorted((root / "rendered").glob("slide-*.png"))
columns = 3
thumb_width = 360
thumbs = []
for index, path in enumerate(paths, start=1):
    image = Image.open(path).convert("RGB")
    height = round(image.height * thumb_width / image.width)
    image = image.resize((thumb_width, height))
    canvas = Image.new("RGB", (thumb_width + 16, height + 34), "white")
    canvas.paste(image, (8, 26))
    ImageDraw.Draw(canvas).text((9, 8), f"Slide {index}", fill="#25313c")
    thumbs.append(canvas)

rows = (len(thumbs) + columns - 1) // columns
cell_width = max(image.width for image in thumbs)
cell_height = max(image.height for image in thumbs)
sheet = Image.new("RGB", (cell_width * columns, cell_height * rows), "#dfe3e8")
for index, image in enumerate(thumbs):
    sheet.paste(image, ((index % columns) * cell_width, (index // columns) * cell_height))
sheet.save(root / "deck-contact.png")
