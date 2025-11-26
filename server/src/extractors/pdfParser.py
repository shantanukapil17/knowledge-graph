import sys
import fitz  

def extract_text(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    print(text)

if __name__ == "__main__":
    extract_text(sys.argv[1])
