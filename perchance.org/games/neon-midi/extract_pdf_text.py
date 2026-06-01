from pathlib import Path
try:
    import PyPDF2
except ImportError:
    raise SystemExit('PyPDF2 not installed')

path = Path('d:/perchance/neon-midi/download_607045.pdf')
if not path.exists():
    raise SystemExit('PDF not found: ' + str(path))
reader = PyPDF2.PdfReader(str(path))
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ''
    print(f'--- PAGE {i+1} ---')
    print(text)
    print('\n')
