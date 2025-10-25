# PDF Splitter +*!¡

A simple, browser-based tool to extract specific page ranges from PDF files and create new PDFs. No installation required, all processing happens locally in your browser.

## Features

- **Extract page ranges**: Select specific start and end pages to extract
- **Privacy-focused**: All processing happens locally in your browser - files never leave your computer
- **No installation**: Just open the HTML file in any modern browser
- **Simple interface**: Upload, select range, download
- **Auto page detection**: Automatically counts total pages in your PDF
- **Fast processing**: Quick extraction powered by PDF.js and jsPDF
- **Responsive desig**: Works on desktop and mobile devices

## Usage

### Run from Web Server

1. Download the repository
2. Open it in your browser

```bash
# Using Python's built-in server
python -m http.server 8000

# Then open in browser
# http://localhost:8000/pdf-splitter.html
```

3. Upload your PDF
4. Select the page range you want to extract
5. Click "Split & Download PDF"

That's it! Your new PDF will download automatically.

## Examples

### Extract a Single Page
- Start Page: `5`
- End Page: `5`
- Result: Creates a PDF with only page 5

### Extract Multiple Pages
- Start Page: `10`
- End Page: `25`
- Result: Creates a PDF with pages 10-25 (16 pages total)

### Extract from Beginning
- Start Page: `1`
- End Page: `10`
- Result: Creates a PDF with the first 10 pages

### Extract to End
- Start Page: `50`
- End Page: `100` (if total is 100)
- Result: Creates a PDF with pages 50-100

## Output

Splitted files are saved in the downloads directory.

## Troubleshooting

### "Error reading PDF file"
- Ensure the file is a valid PDF
- Try with a smaller or less complex PDF
- Check if the PDF is password-protected (not supported)

### "Invalid page range"
- Make sure start page ≤ end page
- Verify page numbers are within the document range
- Check that both fields have valid numbers

### Browser crashes or freezes
- Try with a smaller PDF
- Close other browser tabs to free memory
- Use a desktop browser for large files

### Downloaded PDF is corrupted
- Check available disk space
- Try again with a fresh upload
- Reduce the page range

## Legal Notice

This tool is for personal use. Please respect copyright laws and only split pdf files you have the right to access/modify.

## License

This project is open source and available under the MIT License.

## Credits

Built with:
- [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla - PDF parsing and rendering
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [Tailwind CSS](https://tailwindcss.com/) - UI styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons