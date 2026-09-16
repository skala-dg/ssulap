from pathlib import Path
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
FILES = {
    "rubric": ROOT / "웹 서비스 개발 미니프로젝트-9반, 평가기준.pdf",
    "brief": ROOT / "AI캠퍼스_Full-stack Engineering_7. AI 웹 서비스 설계 Mini-project.pdf",
    "reference": ROOT / "AI캠퍼스_Full-stack Engineering_7. AI 웹 서비스 설계 Mini-project_참고자료.pdf",
}

for name, source in FILES.items():
    reader = PdfReader(source)
    chunks = []
    for index, page in enumerate(reader.pages, start=1):
        chunks.append(f"\n===== PAGE {index} =====\n")
        chunks.append(page.extract_text() or "")
    (Path(__file__).parent / f"{name}.txt").write_text("\n".join(chunks), encoding="utf-8")
