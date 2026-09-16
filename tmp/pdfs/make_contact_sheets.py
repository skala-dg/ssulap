from pathlib import Path
from PIL import Image, ImageOps, ImageDraw


def make_sheet(folder: Path, output: Path, columns: int = 4, thumb_width: int = 320):
    paths = sorted(folder.glob("*.png"))
    thumbs = []
    for index, path in enumerate(paths, start=1):
        image = Image.open(path).convert("RGB")
        height = round(image.height * thumb_width / image.width)
        image = image.resize((thumb_width, height))
        canvas = Image.new("RGB", (thumb_width + 20, height + 48), "white")
        canvas.paste(image, (10, 28))
        ImageDraw.Draw(canvas).text((12, 8), f"Page {index}", fill="#25313c")
        thumbs.append(canvas)

    rows = (len(thumbs) + columns - 1) // columns
    cell_width = max(item.width for item in thumbs)
    cell_height = max(item.height for item in thumbs)
    sheet = Image.new("RGB", (cell_width * columns, cell_height * rows), "#dfe3e8")
    for index, image in enumerate(thumbs):
        x = (index % columns) * cell_width
        y = (index // columns) * cell_height
        sheet.paste(image, (x, y))
    sheet.save(output)


root = Path(__file__).parent
make_sheet(root / "rubric", root / "rubric-contact.png", columns=2, thumb_width=500)
make_sheet(root / "brief", root / "brief-contact.png")
make_sheet(root / "reference", root / "reference-contact.png")
