from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).parent
paths = sorted(root.glob("ui-*.png"))
thumbs = []
for path in paths:
    image = Image.open(path).convert("RGB")
    width = 480
    height = round(image.height * width / image.width)
    image = image.resize((width, height))
    canvas = Image.new("RGB", (width + 24, height + 46), "white")
    canvas.paste(image, (12, 32))
    ImageDraw.Draw(canvas).text((12, 10), path.stem, fill="#25313c")
    thumbs.append(canvas)

columns = 2
rows = (len(thumbs) + columns - 1) // columns
cell_width = max(image.width for image in thumbs)
cell_height = max(image.height for image in thumbs)
sheet = Image.new("RGB", (cell_width * columns, cell_height * rows), "#dfe3e8")
for index, image in enumerate(thumbs):
    sheet.paste(image, ((index % columns) * cell_width, (index // columns) * cell_height))
sheet.save(root / "ui-contact.png")
