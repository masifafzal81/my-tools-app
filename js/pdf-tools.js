async function pdfToImage() {
    const file = window._pdfImgFile;
    const format = document.getElementById('pdfImgFormat').value;
    const resDiv = document.getElementById('pdfImgResult');
    resDiv.style.display = 'block';
    resDiv.innerHTML = '<div class="spinner"></div><p>Converting...</p>';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
    const zip = new JSZip();

    for(let i=1; i<=pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({scale: 2});
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({canvasContext: canvas.getContext('2d'), viewport: viewport}).promise;
        const blob = await new Promise(r => canvas.toBlob(r, format));
        zip.file(`page-${i}.${format === 'image/png' ? 'png' : 'jpg'}`, blob);
    }

    const zipBlob = await zip.generateAsync({type:'blob'});
    resDiv.innerHTML = `<button class="btn btn-success" onclick="downloadZip()"><i class="fas fa-download"></i> Download ZIP (${pdf.numPages} images)</button>`;
    window._zipBlob = zipBlob;
}

function downloadZip() {
    if(window._zipBlob) {
        const link = document.createElement('a');
        link.download = 'pdf-images.zip';
        link.href = URL.createObjectURL(window._zipBlob);
        link.click();
    }
}

async function mergePdfs() {
    const files = window._mergeFiles;
    const merged = await PDFLib.PDFDocument.create();

    for(const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(page => merged.addPage(page));
    }

    const pdfBytes = await merged.save();
    downloadBytes(pdfBytes, 'merged.pdf');
}

async function splitPdf() {
    const file = window._splitFile;
    const mode = document.getElementById('splitMode').value;
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const zip = new JSZip();

    if(mode === 'each') {
        for(let i=0; i<pdf.getPageCount(); i++) {
            const newDoc = await PDFLib.PDFDocument.create();
            const [page] = await newDoc.copyPages(pdf, [i]);
            newDoc.addPage(page);
            const pdfBytes = await newDoc.save();
            zip.file(`page-${i+1}.pdf`, pdfBytes);
        }
    } else {
        const start = parseInt(document.getElementById('splitStart').value) - 1;
        const end = parseInt(document.getElementById('splitEnd').value);
        const newDoc = await PDFLib.PDFDocument.create();
        const pages = await newDoc.copyPages(pdf, Array.from({length: end-start}, (_,i) => start+i));
        pages.forEach(p => newDoc.addPage(p));
        const pdfBytes = await newDoc.save();
        zip.file(`extracted.pdf`, pdfBytes);
    }

    const zipBlob = await zip.generateAsync({type:'blob'});
    const link = document.createElement('a');
    link.download = 'split-pdf.zip';
    link.href = URL.createObjectURL(zipBlob);
    link.click();
}

async function compressPdf() {
    const file = window._pdfCompFile;
    const level = parseInt(document.getElementById('pdfCompLevel').value);
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const compressed = await pdf.save({ useObjectStreams: true });

    const link = document.createElement('a');
    link.download = 'compressed.pdf';
    link.href = URL.createObjectURL(new Blob([compressed]));
    link.click();
}

async function docToPdf() {
    const file = window._docPdfFile;
    const arrayBuffer = await file.arrayBuffer();

    // Simple text extraction for demo
    const text = await extractDocText(arrayBuffer);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, 180);
    let y = 20;
    lines.forEach(line => {
        if(y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 7;
    });
    doc.save('converted.pdf');
}

async function pdfToDoc() {
    const file = window._pdfDocFile;
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data: bytes}).promise;
    let fullText = '';

    for(let i=1; i<=pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        fullText += text + '\n\n';
    }

    // Create simple DOCX
    const docx = await createSimpleDocx(fullText);
    const link = document.createElement('a');
    link.download = 'converted.docx';
    link.href = URL.createObjectURL(docx);
    link.click();
}

async function extractDocText(arrayBuffer) {
    // Simple approach - treat as text for basic files
    // In production, use mammoth.js for proper .docx parsing
    const decoder = new TextDecoder('utf-8', {fatal: false});
    let text = decoder.decode(arrayBuffer);
    // Remove non-text characters
    text = text.replace(/[\x00-\x08\x0E-\x1F\x7F-\xFF]/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    return text.substring(0, 10000) || 'No text content found. This tool works best with text-based documents.';
}

async function createSimpleDocx(text) {
    // Minimal DOCX creation
    const content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body><w:p><w:r><w:t>${text.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</w:t></w:r></w:p></w:body>
    </w:document>`;

    const zip = new JSZip();
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    zip.file('word/document.xml', content);
    zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`);

    return await zip.generateAsync({type: 'blob'});
}

function downloadBytes(bytes, filename) {
    const blob = new Blob([bytes], {type: 'application/pdf'});
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
}

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';