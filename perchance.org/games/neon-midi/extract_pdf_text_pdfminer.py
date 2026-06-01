from pathlib import Path
from pdfminer.high_level import extract_text

path = Path('d:/perchance/neon-midi/download_607045.pdf')
if not path.exists():
    raise SystemExit('PDF not found: ' + str(path))
text = extract_text(str(path))
print(text[:2000])
print('--- length', len(text))
