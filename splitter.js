pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let currentFile = null;
let totalPages = 0;

const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const pageCount = document.getElementById('pageCount');
const rangeInputs = document.getElementById('rangeInputs');
const startPageInput = document.getElementById('startPage');
const endPageInput = document.getElementById('endPage');
const rangeInfo = document.getElementById('rangeInfo');
const splitBtn = document.getElementById('splitBtn');
const errorMsg = document.getElementById('errorMsg');

fileInput.addEventListener('change', handleFileUpload);
startPageInput.addEventListener('input', updateRangeInfo);
endPageInput.addEventListener('input', updateRangeInfo);
splitBtn.addEventListener('click', splitPDF);

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        showError('Please upload a valid PDF file');
        return;
    }

    hideError();
    currentFile = file;
    fileName.textContent = file.name;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        totalPages = pdf.numPages;
                
        pageCount.textContent = `Total pages: ${totalPages}`;
        startPageInput.value = 1;
        startPageInput.max = totalPages;
        endPageInput.value = totalPages;
        endPageInput.max = totalPages;

        fileInfo.classList.remove('hidden');
        rangeInputs.classList.remove('hidden');
        updateRangeInfo();

    } catch (err) {
        showError('Error reading PDF file');
        console.error(err);
    }
}

function updateRangeInfo() {
    const start = parseInt(startPageInput.value) || 1;
    const end = parseInt(endPageInput.value) || totalPages;
    const count = Math.max(0, end - start + 1);
            
    rangeInfo.querySelector('p').innerHTML = `Extracting pages <strong>${start}</strong> to <strong>${end}</strong> (${count} page${count !== 1 ? 's' : ''})`;
}

async function splitPDF() {
    const start = parseInt(startPageInput.value);
    const end = parseInt(endPageInput.value);

    if (!currentFile || start < 1 || end > totalPages || start > end) {
        showError('Invalid page range');
        return;
    }

    splitBtn.disabled = true;
    splitBtn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...';
    hideError();

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                
        const { jsPDF } = window.jspdf;
        const newPdf = new jsPDF();
        let firstPage = true;

        for (let pageNum = start; pageNum <= end; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2 });
                    
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    
                if (!firstPage) {
                    newPdf.addPage();
                }

                firstPage = false;

            const pdfWidth = newPdf.internal.pageSize.getWidth();
            const pdfHeight = newPdf.internal.pageSize.getHeight();
            const imgWidth = viewport.width;
            const imgHeight = viewport.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            newPdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * ratio, imgHeight * ratio);
        }

    newPdf.save(`split-pages-${start}-to-${end}.pdf`);

    } catch (err) {
        showError('Error splitting PDF: ' + err.message);
        console.error(err);

    } finally {
        splitBtn.disabled = false;
        splitBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Split & Download PDF';
    }
}

function showError(message) {
    errorMsg.querySelector('p').textContent = message;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}