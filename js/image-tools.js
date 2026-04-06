let currentImage = null;
let origWidth = 0, origHeight = 0;

// Upload Handlers
function handleResizeUpload(file) { loadImg(file, (img) => {
    document.getElementById('resizeControls').style.display = 'block';
    document.getElementById('resizeWidth').value = img.width;
    document.getElementById('resizeHeight').value = img.height;
    origWidth = img.width; origHeight = img.height;
    currentImage = img;
    window._imgRatio = img.width / img.height;
});}

function handleBgRemUpload(file) { loadImg(file, (img) => {
    document.getElementById('bgRemControls').style.display = 'flex';
    document.getElementById('bgRemActions').style.display = 'block';
    drawImgOnCanvas('bgRemCanvas', img);
    currentImage = img;
});}

function handleTransUpload(file) { loadImg(file, (img) => {
    document.getElementById('transControls').style.display = 'block';
    drawImgOnCanvas('transCanvas', img);
    currentImage = img;
});}

function handleBgChUpload(file) { loadImg(file, (img) => {
    document.getElementById('bgChControls').style.display = 'block';
    drawImgOnCanvas('bgChCanvas', img);
    currentImage = img;
});}

function handlePassUpload(file) { loadImg(file, (img) => {
    document.getElementById('passControls').style.display = 'block';
    drawImgOnCanvas('passCanvas', img);
    currentImage = img;
});}

function handleCompUpload(file) { loadImg(file, (img) => {
    document.getElementById('compControls').style.display = 'block';
    currentImage = img;
    window._compFileSize = file.size;
});}

function handleImgPdfUpload(file) { loadImg(file, (img) => {
    document.getElementById('imgPdfControls').style.display = 'block';
    currentImage = img;
});}

function handleMultiUpload(file) {
    const preview = document.getElementById('multiPreview');
    preview.innerHTML = '';
    preview.style.display = 'grid';
    document.getElementById('multiControls').style.display = 'block';
    window._multiFiles = [];
    Array.from(file).forEach(f => {
        window._multiFiles.push(f);
        const div = document.createElement('div');
        div.style.cssText = 'border:1px solid var(--gray-light);border-radius:8px;overflow:hidden;';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(f);
        img.style.cssText = 'width:100%;height:150px;object-fit:cover;';
        div.innerHTML = `<p style="padding:8px;font-size:0.85rem;color:var(--gray-dark);">${f.name}</p>`;
        div.prepend(img);
        preview.appendChild(div);
    });
}

function handlePdfImgUpload(file) { document.getElementById('pdfImgControls').style.display = 'block'; window._pdfImgFile = file; }
function handleMergeUpload(file) { window._mergeFiles = Array.from(file); document.getElementById('mergeList').innerHTML = window._mergeFiles.map(f=>`<div style="padding:8px;background:var(--light);margin:5px 0;border-radius:5px;"><i class="fas fa-file-pdf"></i> ${f.name}</div>`).join(''); document.getElementById('mergeControls').style.display = 'block'; }
function handleSplitUpload(file) { document.getElementById('splitControls').style.display = 'block'; window._splitFile = file; }
function handlePdfCompUpload(file) { document.getElementById('pdfCompControls').style.display = 'block'; window._pdfCompFile = file; }
function handleDocPdfUpload(file) { window._docPdfFile = file; document.getElementById('docPdfControls').style.display = 'block'; }
function handlePdfDocUpload(file) { window._pdfDocFile = file; document.getElementById('pdfDocControls').style.display = 'block'; }
function handleCsvUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(r => r.split(/[,\t;]/));
        let html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;"><thead><tr style="background:var(--primary);color:white;">';
        rows[0].forEach(h => html += `<th style="padding:10px;border:1px solid var(--gray-light);">${h}</th>`);
        html += '</tr></thead><tbody>';
        rows.slice(1,200).forEach(r => { html += '<tr>'; r.forEach(c => html += `<td style="padding:8px;border:1px solid var(--gray-light);">${c}</td>`); html += '</tr>'; });
        html += '</tbody></table>';
        document.getElementById('csvPreview').style.display = 'block';
        document.getElementById('csvPreview').innerHTML = html;
    };
    reader.readAsText(file);
}

// Image Tools
function loadImg(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => callback(img);
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImgOnCanvas(canvasId, img) {
    const c = document.getElementById(canvasId);
    c.width = img.width; c.height = img.height;
    c.style.display = 'block';
    c.getContext('2d').drawImage(img, 0, 0);
}

function resizeImage() {
    const w = parseInt(document.getElementById('resizeWidth').value);
    const h = parseInt(document.getElementById('resizeHeight').value);
    const c = document.getElementById('resizeCanvas');
    c.width = w; c.height = h; c.style.display = 'block';
    c.getContext('2d').drawImage(currentImage, 0, 0, w, h);
    downloadCanvas('resizeCanvas', `resized-${w}x${h}.png`);
}

function removeBackground() {
    const tolerance = parseInt(document.getElementById('bgTolerance').value);
    const bgColor = document.getElementById('bgColor').value;
    const c = document.getElementById('bgRemCanvas');
    const ctx = c.getContext('2d');
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const data = imgData.data;
    const target = hexToRgb(bgColor);

    for(let i=0; i<data.length; i+=4) {
        const r=data[i], g=data[i+1], b=data[i+2];
        if(colorDist(r,g,b,target.r,target.g,target.b) <= tolerance) {
            data[i+3] = 0;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    document.getElementById('bgRemDownload').style.display = 'block';
}

function makeTransparent() {
    const color = document.getElementById('transColor').value;
    const thresh = parseInt(document.getElementById('transThreshold').value);
    const c = document.getElementById('transCanvas');
    const ctx = c.getContext('2d');
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const data = imgData.data;
    const t = hexToRgb(color);

    for(let i=0; i<data.length; i+=4) {
        if(colorDist(data[i],data[i+1],data[i+2],t.r,t.g,t.b) <= thresh) data[i+3] = 0;
    }
    ctx.putImageData(imgData, 0, 0);
    document.getElementById('transDownload').style.display = 'block';
}

function changeBgColor() {
    const newColor = document.getElementById('bgChColor').value;
    const remColor = document.getElementById('bgChRemove').value;
    const thresh = parseInt(document.getElementById('bgChThresh').value);
    const c = document.getElementById('bgChCanvas');
    const ctx = c.getContext('2d');
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const data = imgData.data;
    const rem = hexToRgb(remColor);
    const newC = hexToRgb(newColor);

    for(let i=0; i<data.length; i+=4) {
        if(colorDist(data[i],data[i+1],data[i+2],rem.r,rem.g,rem.b) <= thresh) {
            data[i] = newC.r; data[i+1] = newC.g; data[i+2] = newC.b;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    document.getElementById('bgChDownload').style.display = 'block';
}

function makePassport() {
    const [pw, ph] = document.getElementById('passSize').value.split(',').map(Number);
    const bg = document.getElementById('passBg').value;
    const c = document.getElementById('passCanvas');
    // Standard DPI: 300, mm to px
    const dpi = 300;
    const pxW = Math.round(pw / 25.4 * dpi);
    const pxH = Math.round(ph / 25.4 * dpi);
    c.width = pxW; c.height = pxH;
    const ctx = c.getContext('2d');

    // Background
    ctx.fillStyle = bg === 'white' ? '#ffffff' : bg === 'lightblue' ? '#87CEEB' : '#cccccc';
    ctx.fillRect(0, 0, pxW, pxH);

    // Draw face centered, scaled
    const img = currentImage;
    const scale = Math.max(pxW/img.width, pxH/img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (pxW-w)/2, (pxH-h)/2, w, h);

    document.getElementById('passDownload').style.display = 'block';
}

function compressImage() {
    const quality = parseInt(document.getElementById('compQuality').value) / 100;
    const maxW = parseInt(document.getElementById('compMaxW').value);
    const format = document.getElementById('compFormat').value;

    const c = document.createElement('canvas');
    let w = currentImage.width, h = currentImage.height;
    if(w > maxW) { h = h * (maxW/w); w = maxW; }
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(currentImage, 0, 0, w, h);

    c.toBlob((blob) => {
        const orig = window._compFileSize;
        const saved = ((orig - blob.size) / orig * 100).toFixed(1);
        const res = document.getElementById('compResult');
        res.style.display = 'block';
        res.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Compression Result</h4>
            <div class="result-value">${(blob.size/1024).toFixed(0)} KB</div>
            <p><strong>Original:</strong> ${(orig/1024).toFixed(0)} KB</p>
            <p><strong>Reduced by:</strong> <span style="color:var(--success)">${saved}%</span></p>
            <button class="btn btn-success" style="margin-top:10px;" onclick="downloadBlob(${blob.size})"><i class="fas fa-download"></i> Download Compressed</button>`;
        window._compressedBlob = blob;
    }, format, quality);
}

function imageToPdf() {
    const { jsPDF } = window.jspdf;
    const size = document.getElementById('imgPdfSize').value;
    const orient = document.getElementById('imgPdfOrient').value;

    const pageW = size === 'a4' ? 210 : size === 'letter' ? 215.9 : currentImage.width * 0.264583;
    const pageH = size === 'a4' ? 297 : size === 'letter' ? 279.4 : currentImage.height * 0.264583;

    const doc = new jsPDF({ orientation: orient === 'landscape' && size !== 'fit' ? 'landscape' : 'portrait', unit: 'mm', format: size === 'fit' ? [pageW, pageH] : undefined });
    const imgData = currentImage.src;
    doc.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
    doc.save('converted.pdf');
}

function multipleImagesToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let count = 0;
    const files = window._multiFiles;

    files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if(idx > 0) doc.addPage();
                const pageW = doc.internal.pageSize.getWidth();
                const pageH = doc.internal.pageSize.getHeight();
                const scale = Math.min(pageW/img.width, pageH/img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                doc.addImage(img, 'JPEG', (pageW-w)/2, (pageH-h)/2, w, h);
                count++;
                if(count === files.length) doc.save('combined.pdf');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Download helpers
function downloadCanvas(canvasId, filename) {
    const c = document.getElementById(canvasId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = c.toDataURL();
    link.click();
}

function downloadBlob() {
    if(window._compressedBlob) {
        const link = document.createElement('a');
        link.download = 'compressed.jpg';
        link.href = URL.createObjectURL(window._compressedBlob);
        link.click();
    }
}

// Color helpers
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return {r,g,b};
}

function colorDist(r1,g1,b1,r2,g2,b2) {
    return Math.sqrt(Math.pow(r1-r2,2) + Math.pow(g1-g2,2) + Math.pow(b1-b2,2));
}