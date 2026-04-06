document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    mobileToggle.addEventListener('click', () => mainNav.classList.toggle('active'));

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const target = document.querySelector(this.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Category Filter
    const catBtns = document.querySelectorAll('.cat-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const cat = this.dataset.cat;
            toolCards.forEach(card => {
                if(cat === 'all' || card.dataset.category === cat) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // Search
    const searchInput = document.getElementById('toolSearch');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        toolCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });

    // Tool Card Click
    toolCards.forEach(card => {
        const link = card.querySelector('.tool-link');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openTool(card.dataset.id);
        });
    });

    // Modal
    const modal = document.getElementById('toolModal');
    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

    // Back to Top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    window.openTool = function(id) {
        const titleMap = {
            'image-resizer': 'Image Resizer', 'bg-remover': 'Background Remover',
            'bg-transparent': 'Make Background Transparent', 'bg-changer': 'Background Color Changer',
            'passport': 'Passport Photo Maker', 'image-compressor': 'Image Compressor',
            'img-to-pdf': 'Image to PDF', 'multiple-img-pdf': 'Multiple Images to PDF',
            'pdf-to-img': 'PDF to Image', 'pdf-merger': 'PDF Merger',
            'pdf-splitter': 'PDF Splitter', 'pdf-compressor': 'PDF Compressor',
            'doc-to-pdf': 'DOC/DOCX to PDF', 'pdf-to-doc': 'PDF to DOCX',
            'calc-finance': 'Finance Calculator', 'calc-pakistan-tax': 'Pakistan Income Tax Calculator 2024-25',
            'calc-construction': 'Construction Calculator', 'calc-bmi': 'BMI Calculator',
            'calc-age': 'Age Calculator', 'calc-math': 'Math Calculator',
            'calc-stats': 'Statistics Calculator', 'calc-health': 'Health Calculator',
            'calc-routine': 'Routine Calculators', 'calc-salary': 'Salary Calculator',
            'office-excel': 'CSV/Excel Viewer', 'office-unit': 'Unit Converter'
        };
        document.getElementById('modalTitle').textContent = titleMap[id] || 'Tool';
        document.getElementById('modalBody').innerHTML = getToolContent(id);
        initToolScripts(id);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('modalBody').innerHTML = '';
    }
});

// Tool HTML Generators
function getToolContent(id) {
    const templates = {
        'image-resizer': `
            <div class="tool-section">
                <h3><i class="fas fa-expand"></i> Resize Image</h3>
                <div class="upload-area" id="resizeUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Click or drag image here</p>
                    <input type="file" id="resizeFile" accept="image/*" hidden>
                </div>
                <div id="resizeControls" style="display:none;">
                    <div class="form-row">
                        <div class="form-group"><label>Width (px)</label><input type="number" class="form-control" id="resizeWidth"></div>
                        <div class="form-group"><label>Height (px)</label><input type="number" class="form-control" id="resizeHeight"></div>
                        <div class="form-group"><label>Aspect Ratio</label><input type="checkbox" id="keepRatio" checked> <label for="keepRatio" style="display:inline;">Maintain</label></div>
                    </div>
                    <button class="btn btn-primary" onclick="resizeImage()"><i class="fas fa-crop"></i> Resize & Download</button>
                    <canvas id="resizeCanvas" class="canvas-preview" style="display:none;"></canvas>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Upload your image, set desired dimensions, and download. Maintains aspect ratio by default.</p></div>
            </div>`,
        'bg-remover': `
            <div class="tool-section">
                <h3><i class="fas fa-eraser"></i> Remove Background</h3>
                <div class="upload-area" id="bgRemUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload an image to remove background</p>
                    <input type="file" id="bgRemFile" accept="image/*" hidden>
                </div>
                <div class="form-row" id="bgRemControls" style="display:none;">
                    <div class="form-group"><label>Tolerance</label><input type="range" id="bgTolerance" min="1" max="50" value="15"></div>
                    <div class="form-group"><label>Color to Remove</label><input type="color" id="bgColor" value="#ffffff"></div>
                </div>
                <div class="form-group" id="bgRemActions" style="display:none;">
                    <button class="btn btn-primary" onclick="removeBackground()"><i class="fas fa-eraser"></i> Remove Background</button>
                </div>
                <canvas id="bgRemCanvas" class="canvas-preview"></canvas>
                <div id="bgRemDownload" style="display:none;margin-top:15px;">
                    <button class="btn btn-success" onclick="downloadCanvas('bgRemCanvas','transparent-bg.png')"><i class="fas fa-download"></i> Download Transparent PNG</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Click on the image to pick the background color, then adjust tolerance. Best results with solid color backgrounds.</p></div>
            </div>`,
        'bg-transparent': `
            <div class="tool-section">
                <h3><i class="fas fa-border-all"></i> Make Background Transparent</h3>
                <div class="upload-area" id="transUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload image with solid background</p>
                    <input type="file" id="transFile" accept="image/*" hidden>
                </div>
                <div id="transControls" style="display:none;">
                    <div class="form-row">
                        <div class="form-group"><label>Target Color</label><input type="color" id="transColor" value="#ffffff"></div>
                        <div class="form-group"><label>Threshold</label><input type="range" id="transThreshold" min="0" max="100" value="20"></div>
                    </div>
                    <button class="btn btn-primary" onclick="makeTransparent()"><i class="fas fa-magic"></i> Make Transparent</button>
                </div>
                <canvas id="transCanvas" class="canvas-preview"></canvas>
                <div id="transDownload" style="display:none;margin-top:15px;">
                    <button class="btn btn-success" onclick="downloadCanvas('transCanvas','transparent.png')"><i class="fas fa-download"></i> Download PNG</button>
                </div>
            </div>`,
        'bg-changer': `
            <div class="tool-section">
                <h3><i class="fas fa-fill-drip"></i> Change Background Color</h3>
                <div class="upload-area" id="bgChUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload image</p>
                    <input type="file" id="bgChFile" accept="image/*" hidden>
                </div>
                <div id="bgChControls" style="display:none;">
                    <div class="form-row">
                        <div class="form-group"><label>New Color</label><input type="color" id="bgChColor" value="#4f46e5"></div>
                        <div class="form-group"><label>Remove Color</label><input type="color" id="bgChRemove" value="#ffffff"></div>
                        <div class="form-group"><label>Threshold</label><input type="range" id="bgChThresh" min="0" max="100" value="30"></div>
                    </div>
                    <button class="btn btn-primary" onclick="changeBgColor()"><i class="fas fa-fill"></i> Apply New Background</button>
                </div>
                <canvas id="bgChCanvas" class="canvas-preview"></canvas>
                <div id="bgChDownload" style="display:none;margin-top:15px;">
                    <button class="btn btn-success" onclick="downloadCanvas('bgChCanvas','new-bg.png')"><i class="fas fa-download"></i> Download</button>
                </div>
            </div>`,
        'passport': `
            <div class="tool-section">
                <h3><i class="fas fa-id-card"></i> Passport Photo Maker</h3>
                <div class="upload-area" id="passUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload your photo</p>
                    <input type="file" id="passFile" accept="image/*" hidden>
                </div>
                <div id="passControls" style="display:none;">
                    <div class="form-row">
                        <div class="form-group"><label>Size Standard</label>
                            <select class="form-control" id="passSize">
                                <option value="35,45">Pakistan (35×45 mm)</option>
                                <option value="35,45">UK/India (35×45 mm)</option>
                                <option value="35,45">China (35×45 mm)</option>
                                <option value="51,51">USA (2×2 inch)</option>
                                <option value="35,45">Schengen (35×45 mm)</option>
                            </select>
                        </div>
                        <div class="form-group"><label>Background</label>
                            <select class="form-control" id="passBg">
                                <option value="white">White</option>
                                <option value="lightblue">Light Blue</option>
                                <option value="gray">Gray</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="makePassport()"><i class="fas fa-crop"></i> Convert to Passport Size</button>
                </div>
                <canvas id="passCanvas" class="canvas-preview"></canvas>
                <div id="passDownload" style="display:none;margin-top:15px;">
                    <button class="btn btn-success" onclick="downloadCanvas('passCanvas','passport-photo.jpg')"><i class="fas fa-download"></i> Download Passport Photo</button>
                </div>
            </div>`,
        'image-compressor': `
            <div class="tool-section">
                <h3><i class="fas fa-compress"></i> Compress Image</h3>
                <div class="upload-area" id="compUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload image to compress</p>
                    <input type="file" id="compFile" accept="image/*" hidden>
                </div>
                <div id="compControls" style="display:none;">
                    <div class="range-group">
                        <label><span>Quality</span> <span id="compQualityVal">80%</span></label>
                        <input type="range" id="compQuality" min="10" max="100" value="80">
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Max Width</label><input type="number" class="form-control" id="compMaxW" value="1920"></div>
                        <div class="form-group"><label>Format</label>
                            <select class="form-control" id="compFormat"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="compressImage()"><i class="fas fa-compress-arrows-alt"></i> Compress & Download</button>
                    <div id="compResult" class="result-box" style="display:none;"></div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Reduce file size by lowering quality or dimensions. WebP offers best compression. Original quality preserved as much as possible.</p></div>
            </div>`,
        'img-to-pdf': `
            <div class="tool-section">
                <h3><i class="fas fa-file-image"></i> Image to PDF</h3>
                <div class="upload-area" id="imgPdfUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload an image</p>
                    <input type="file" id="imgPdfFile" accept="image/*" hidden>
                </div>
                <div id="imgPdfControls" style="display:none;">
                    <div class="form-row">
                        <div class="form-group"><label>Page Size</label>
                            <select class="form-control" id="imgPdfSize"><option value="a4">A4</option><option value="letter">Letter</option><option value="fit">Fit to Image</option></select>
                        </div>
                        <div class="form-group"><label>Orientation</label>
                            <select class="form-control" id="imgPdfOrient"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="imageToPdf()"><i class="fas fa-file-pdf"></i> Convert to PDF</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Converts your image to a PDF document. Choose A4 for printing or "Fit to Image" for exact size.</p></div>
            </div>`,
        'multiple-img-pdf': `
            <div class="tool-section">
                <h3><i class="fas fa-images"></i> Multiple Images to PDF</h3>
                <div class="upload-area" id="multiUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload multiple images</p>
                    <input type="file" id="multiFile" accept="image/*" multiple hidden>
                </div>
                <div id="multiPreview" class="grid-2" style="display:none;"></div>
                <div id="multiControls" style="display:none;margin-top:15px;">
                    <button class="btn btn-primary" onclick="multipleImagesToPdf()"><i class="fas fa-file-pdf"></i> Combine & Download PDF</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Select multiple images to combine into a single PDF. Each image becomes one page in the order uploaded.</p></div>
            </div>`,
        'pdf-to-img': `
            <div class="tool-section">
                <h3><i class="fas fa-file-export"></i> PDF to Image</h3>
                <div class="upload-area" id="pdfImgUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload PDF file</p>
                    <input type="file" id="pdfImgFile" accept=".pdf" hidden>
                </div>
                <div id="pdfImgControls" style="display:none;">
                    <div class="form-group"><label>Format</label>
                        <select class="form-control" id="pdfImgFormat"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option></select>
                    </div>
                    <button class="btn btn-primary" onclick="pdfToImage()"><i class="fas fa-file-image"></i> Convert to Images</button>
                </div>
                <div id="pdfImgResult" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Converts each page of PDF to an image. Downloads all pages as a ZIP file.</p></div>
            </div>`,
        'pdf-merger': `
            <div class="tool-section">
                <h3><i class="fas fa-object-group"></i> Merge PDF Files</h3>
                <div class="upload-area" id="mergeUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload multiple PDFs</p>
                    <input type="file" id="mergeFile" accept=".pdf" multiple hidden>
                </div>
                <div id="mergeList" style="margin:15px 0;"></div>
                <div id="mergeControls" style="display:none;">
                    <button class="btn btn-primary" onclick="mergePdfs()"><i class="fas fa-object-group"></i> Merge & Download</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Combines multiple PDF files into a single document in the order uploaded.</p></div>
            </div>`,
        'pdf-splitter': `
            <div class="tool-section">
                <h3><i class="fas fa-cut"></i> Split PDF</h3>
                <div class="upload-area" id="splitUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload PDF to split</p>
                    <input type="file" id="splitFile" accept=".pdf" hidden>
                </div>
                <div id="splitControls" style="display:none;">
                    <div class="form-group"><label>Split Mode</label>
                        <select class="form-control" id="splitMode"><option value="each">Each page as separate PDF</option><option value="range">Extract page range</option></select>
                    </div>
                    <div class="form-row" id="splitRange" style="display:none;">
                        <div class="form-group"><label>Start Page</label><input type="number" class="form-control" id="splitStart" min="1" value="1"></div>
                        <div class="form-group"><label>End Page</label><input type="number" class="form-control" id="splitEnd" min="1" value="2"></div>
                    </div>
                    <button class="btn btn-primary" onclick="splitPdf()"><i class="fas fa-cut"></i> Split & Download</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Extract specific pages or split all pages into individual PDF files.</p></div>
            </div>`,
        'pdf-compressor': `
            <div class="tool-section">
                <h3><i class="fas fa-file-archive"></i> Compress PDF</h3>
                <div class="upload-area" id="pdfCompUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload PDF to compress</p>
                    <input type="file" id="pdfCompFile" accept=".pdf" hidden>
                </div>
                <div id="pdfCompControls" style="display:none;">
                    <div class="range-group">
                        <label><span>Compression Level</span> <span id="pdfCompVal">Medium</span></label>
                        <input type="range" id="pdfCompLevel" min="1" max="3" value="2" step="1">
                    </div>
                    <button class="btn btn-primary" onclick="compressPdf()"><i class="fas fa-compress-arrows-alt"></i> Compress & Download</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Reduces PDF file size by optimizing images and content. Higher compression = smaller file but potential quality loss.</p></div>
            </div>`,
        'doc-to-pdf': `
            <div class="tool-section">
                <h3><i class="fas fa-file-word"></i> DOC/DOCX to PDF</h3>
                <div class="upload-area" id="docPdfUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload Word document</p>
                    <input type="file" id="docPdfFile" accept=".doc,.docx" hidden>
                </div>
                <div id="docPdfPreview" style="display:none;background:white;border:1px solid var(--gray-light);border-radius:8px;padding:20px;margin:15px 0;max-height:400px;overflow-y:auto;"></div>
                <div id="docPdfControls" style="display:none;">
                    <button class="btn btn-primary" onclick="docToPdf()"><i class="fas fa-file-pdf"></i> Convert to PDF</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Converts Word documents to PDF while preserving text and basic formatting. Complex layouts may vary.</p></div>
            </div>`,
        'pdf-to-doc': `
            <div class="tool-section">
                <h3><i class="fas fa-file-alt"></i> PDF to DOCX</h3>
                <div class="upload-area" id="pdfDocUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload PDF file</p>
                    <input type="file" id="pdfDocFile" accept=".pdf" hidden>
                </div>
                <div id="pdfDocControls" style="display:none;">
                    <button class="btn btn-primary" onclick="pdfToDoc()"><i class="fas fa-file-word"></i> Convert to DOCX</button>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Extracts text from PDF and creates a Word document. Images and complex formatting are not preserved.</p></div>
            </div>`,
        'calc-finance': `
            <div class="tool-section">
                <h3><i class="fas fa-coins"></i> Finance Calculator</h3>
                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom:10px;"><i class="fas fa-home"></i> Loan EMI Calculator</h4>
                        <div class="form-group"><label>Loan Amount (PKR)</label><input type="number" class="form-control" id="loanAmt" value="1000000"></div>
                        <div class="form-row">
                            <div class="form-group"><label>Interest Rate (% yearly)</label><input type="number" class="form-control" id="loanRate" value="12" step="0.1"></div>
                            <div class="form-group"><label>Tenure (months)</label><input type="number" class="form-control" id="loanTenure" value="12"></div>
                        </div>
                        <button class="btn btn-primary" onclick="calcLoan()"><i class="fas fa-calculator"></i> Calculate EMI</button>
                        <div id="loanResult" class="result-box" style="display:none;"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;"><i class="fas fa-piggy-bank"></i> SIP/Investment Calculator</h4>
                        <div class="form-group"><label>Monthly Investment</label><input type="number" class="form-control" id="sipAmt" value="10000"></div>
                        <div class="form-row">
                            <div class="form-group"><label>Expected Return (% yearly)</label><input type="number" class="form-control" id="sipRate" value="10" step="0.1"></div>
                            <div class="form-group"><label>Duration (years)</label><input type="number" class="form-control" id="sipYears" value="5"></div>
                        </div>
                        <button class="btn btn-success" onclick="calcSip()"><i class="fas fa-chart-line"></i> Calculate Returns</button>
                        <div id="sipResult" class="result-box" style="display:none;"></div>
                    </div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>EMI Result:</strong> Monthly payment amount. <strong>SIP Result:</strong> Shows total invested, gains, and final value for regular investments.</p></div>
            </div>`,
        'calc-pakistan-tax': `
            <div class="tool-section">
                <h3><i class="fas fa-landmark"></i> Pakistan Income Tax Calculator 2024-25</h3>
                <div class="form-group"><label>Annual Taxable Income (PKR)</label><input type="number" class="form-control" id="taxIncome" value="1200000" placeholder="e.g., 1200000"></div>
                <div class="form-group"><label>Taxpayer Status</label>
                    <select class="form-control" id="taxStatus"><option value="salaried">Salaried Individual</option><option value="business">Business/Other</option></select>
                </div>
                <button class="btn btn-primary" onclick="calcPakistanTax()"><i class="fas fa-calculator"></i> Calculate Tax</button>
                <div id="taxResult" class="result-box" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Based on FBR Tax Year 2024-25 rates. Salaried individuals enjoy lower tax brackets. Business income has different slabs. This is an estimate; consult a tax professional for exact filing.</p></div>
            </div>`,
        'calc-construction': `
            <div class="tool-section">
                <h3><i class="fas fa-hard-hat"></i> Construction Calculator</h3>
                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom:10px;">Bricks Calculator</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Wall Length (ft)</label><input type="number" class="form-control" id="brickLen" value="10"></div>
                            <div class="form-group"><label>Wall Height (ft)</label><input type="number" class="form-control" id="brickHt" value="10"></div>
                        </div>
                        <button class="btn btn-primary" onclick="calcBricks()">Calculate Bricks</button>
                        <div id="brickResult" class="result-box" style="display:none;"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;">Cement & Sand for Plaster</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Area (sq ft)</label><input type="number" class="form-control" id="plasterArea" value="100"></div>
                            <div class="form-group"><label>Thickness (inch)</label><input type="number" class="form-control" id="plasterThick" value="0.5"></div>
                        </div>
                        <button class="btn btn-success" onclick="calcPlaster()">Calculate Materials</button>
                        <div id="plasterResult" class="result-box" style="display:none;"></div>
                    </div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>Bricks:</strong> Assumes standard brick size (9×4.5×3 inch) with mortar. <strong>Plaster:</strong> 1:4 cement-sand ratio. Add 10% extra for wastage in actual construction.</p></div>
            </div>`,
        'calc-bmi': `
            <div class="tool-section">
                <h3><i class="fas fa-weight"></i> BMI Calculator</h3>
                <div class="form-row">
                    <div class="form-group"><label>Weight (kg)</label><input type="number" class="form-control" id="bmiWeight" value="70"></div>
                    <div class="form-group"><label>Height (cm)</label><input type="number" class="form-control" id="bmiHeight" value="170"></div>
                </div>
                <button class="btn btn-primary" onclick="calcBMI()"><i class="fas fa-calculator"></i> Calculate BMI</button>
                <div id="bmiResult" class="result-box" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>Under 18.5:</strong> Underweight | <strong>18.5-24.9:</strong> Normal | <strong>25-29.9:</strong> Overweight | <strong>30+:</strong> Obese. BMI is a screening tool, not diagnostic. Consult a doctor for health assessment.</p></div>
            </div>`,
        'calc-age': `
            <div class="tool-section">
                <h3><i class="fas fa-birthday-cake"></i> Age Calculator</h3>
                <div class="form-group"><label>Date of Birth</label><input type="date" class="form-control" id="ageDob" value="2000-01-01"></div>
                <div class="form-group"><label>Age as of</label><input type="date" class="form-control" id="ageNow"></div>
                <button class="btn btn-primary" onclick="calcAge()"><i class="fas fa-calculator"></i> Calculate Age</button>
                <div id="ageResult" class="result-box" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Shows exact age in years, months, days, weeks, hours, and minutes. Useful for eligibility verification, retirement planning, and official documentation.</p></div>
            </div>`,
        'calc-math': `
            <div class="tool-section">
                <h3><i class="fas fa-square-root-alt"></i> Math Calculator</h3>
                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom:10px;">Percentage Calculator</h4>
                        <div class="form-group"><label>What is <input type="number" class="form-control" id="pctVal" value="20" style="display:inline;width:80px;"> % of <input type="number" class="form-control" id="pctOf" value="500" style="display:inline;width:100px;"> ?</label></div>
                        <button class="btn btn-primary" onclick="calcPct()">Calculate</button>
                        <div id="pctResult" class="result-box" style="display:none;"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;">Discount Calculator</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Original Price</label><input type="number" class="form-control" id="discOrig" value="1000"></div>
                            <div class="form-group"><label>Discount (%)</label><input type="number" class="form-control" id="discPct" value="20"></div>
                        </div>
                        <button class="btn btn-success" onclick="calcDiscount()">Calculate Discount</button>
                        <div id="discResult" class="result-box" style="display:none;"></div>
                    </div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Percentage: Finds the value based on percentage. Discount: Calculates final price after discount and savings amount.</p></div>
            </div>`,
        'calc-stats': `
            <div class="tool-section">
                <h3><i class="fas fa-chart-bar"></i> Statistics Calculator</h3>
                <div class="form-group"><label>Enter numbers (comma separated)</label><textarea class="form-control" id="statData" rows="3" placeholder="e.g., 10,20,30,40,50,60,70">10,20,30,40,50,60,70</textarea></div>
                <button class="btn btn-primary" onclick="calcStats()"><i class="fas fa-calculator"></i> Calculate Statistics</button>
                <div id="statResult" class="result-box" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>Mean:</strong> Average value. <strong>Median:</strong> Middle value. <strong>Mode:</strong> Most frequent value. <strong>Std Dev:</strong> How spread out numbers are. <strong>Variance:</strong> Square of std dev. Useful for data analysis and research.</p></div>
            </div>`,
        'calc-health': `
            <div class="tool-section">
                <h3><i class="fas fa-heartbeat"></i> Health Calculator</h3>
                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom:10px;">BMR & Daily Calories</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Weight (kg)</label><input type="number" class="form-control" id="bmrWeight" value="70"></div>
                            <div class="form-group"><label>Height (cm)</label><input type="number" class="form-control" id="bmrHeight" value="170"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Age</label><input type="number" class="form-control" id="bmrAge" value="30"></div>
                            <div class="form-group"><label>Gender</label><select class="form-control" id="bmrGender"><option value="male">Male</option><option value="female">Female</option></select></div>
                        </div>
                        <div class="form-group"><label>Activity Level</label><select class="form-control" id="bmrActivity"><option value="1.2">Sedentary</option><option value="1.375">Light</option><option value="1.55" selected>Moderate</option><option value="1.725">Active</option><option value="1.9">Very Active</option></select></div>
                        <button class="btn btn-primary" onclick="calcBMR()">Calculate Calories</button>
                        <div id="bmrResult" class="result-box" style="display:none;"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;">Daily Water Intake</h4>
                        <div class="form-group"><label>Weight (kg)</label><input type="number" class="form-control" id="waterWeight" value="70"></div>
                        <button class="btn btn-success" onclick="calcWater()">Calculate Water</button>
                        <div id="waterResult" class="result-box" style="display:none;"></div>
                    </div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>BMR:</strong> Basal Metabolic Rate - calories burned at rest. <strong>TDEE:</strong> Total Daily Energy Expenditure. <strong>Water:</strong> Recommended daily intake (30-35ml per kg). Consult doctor for personalized advice.</p></div>
            </div>`,
        'calc-routine': `
            <div class="tool-section">
                <h3><i class="fas fa-clock"></i> Routine Calculators</h3>
                <div class="grid-2">
                    <div>
                        <h4 style="margin-bottom:10px;">Time Difference</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Start Time</label><input type="time" class="form-control" id="timeStart" value="09:00"></div>
                            <div class="form-group"><label>End Time</label><input type="time" class="form-control" id="timeEnd" value="17:00"></div>
                        </div>
                        <button class="btn btn-primary" onclick="calcTimeDiff()">Calculate</button>
                        <div id="timeResult" class="result-box" style="display:none;"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;">Tip Calculator</h4>
                        <div class="form-row">
                            <div class="form-group"><label>Bill Amount</label><input type="number" class="form-control" id="tipBill" value="2000"></div>
                            <div class="form-group"><label>Tip %</label><input type="number" class="form-control" id="tipPct" value="10"></div>
                        </div>
                        <button class="btn btn-success" onclick="calcTip()">Calculate Tip</button>
                        <div id="tipResult" class="result-box" style="display:none;"></div>
                    </div>
                </div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>Time Diff:</strong> Calculates duration between two times. <strong>Tip:</strong> Calculates tip amount and total bill including tip.</p></div>
            </div>`,
        'calc-salary': `
            <div class="tool-section">
                <h3><i class="fas fa-money-bill-wave"></i> Salary Calculator</h3>
                <div class="form-row">
                    <div class="form-group"><label>Gross Salary (PKR)</label><input type="number" class="form-control" id="salGross" value="100000"></div>
                    <div class="form-group"><label>Working Days/Month</label><input type="number" class="form-control" id="salDays" value="26"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Overtime Hours</label><input type="number" class="form-control" id="salOT" value="0"></div>
                    <div class="form-group"><label>OT Rate (1.5x/2x)</label><select class="form-control" id="salOTRate"><option value="1.5">1.5x</option><option value="2">2x</option></select></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Provident Fund (%)</label><input type="number" class="form-control" id="salPF" value="0"></div>
                    <div class="form-group"><label>Other Deductions (PKR)</label><input type="number" class="form-control" id="salDed" value="0"></div>
                </div>
                <button class="btn btn-primary" onclick="calcSalary()"><i class="fas fa-calculator"></i> Calculate Net Salary</button>
                <div id="salResult" class="result-box" style="display:none;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p><strong>Net Salary:</strong> Take-home pay after deductions. <strong>Hourly Rate:</strong> Per hour earning. <strong>OT Earning:</strong> Additional income from overtime.</p></div>
            </div>`,
        'office-excel': `
            <div class="tool-section">
                <h3><i class="fas fa-table"></i> CSV Viewer</h3>
                <div class="upload-area" id="csvUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload CSV file</p>
                    <input type="file" id="csvFile" accept=".csv" hidden>
                </div>
                <div id="csvPreview" style="display:none;overflow-x:auto;margin-top:15px;"></div>
                <div class="info-box"><i class="fas fa-info-circle"></i> <p>Upload and view CSV files in a formatted table. Supports comma and semicolon separators.</p></div>
            </div>`,
        'office-unit': `
            <div class="tool-section">
                <h3><i class="fas fa-ruler-combined"></i> Unit Converter</h3>
                <div class="form-row">
                    <div class="form-group"><label>Category</label>
                        <select class="form-control" id="unitCat"><option value="length">Length</option><option value="weight">Weight</option><option value="temp">Temperature</option><option value="area">Area</option><option value="volume">Volume</option></select>
                    </div>
                    <div class="form-group"><label>Value</label><input type="number" class="form-control" id="unitVal" value="1"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>From</label><select class="form-control" id="unitFrom"></select></div>
                    <div class="form-group"><label>To</label><select class="form-control" id="unitTo"></select></div>
                </div>
                <button class="btn btn-primary" onclick="convertUnit()"><i class="fas fa-exchange-alt"></i> Convert</button>
                <div id="unitResult" class="result-box" style="display:none;"></div>
            </div>`
    };
    return templates[id] || '<p>Tool loading...</p>';
}

// Initialize tool-specific scripts after modal opens
function initToolScripts(id) {
    setTimeout(() => {
        setupToolListeners(id);
        if(id === 'calc-age') {
            document.getElementById('ageNow').value = new Date().toISOString().split('T')[0];
        }
        if(id === 'office-unit') {
            populateUnits();
            document.getElementById('unitCat').addEventListener('change', populateUnits);
        }
    }, 100);
}

function setupToolListeners(id) {
    // File upload listeners
    const uploadMap = {
        'image-resizer': { area: 'resizeUpload', file: 'resizeFile', handler: handleResizeUpload },
        'bg-remover': { area: 'bgRemUpload', file: 'bgRemFile', handler: handleBgRemUpload },
        'bg-transparent': { area: 'transUpload', file: 'transFile', handler: handleTransUpload },
        'bg-changer': { area: 'bgChUpload', file: 'bgChFile', handler: handleBgChUpload },
        'passport': { area: 'passUpload', file: 'passFile', handler: handlePassUpload },
        'image-compressor': { area: 'compUpload', file: 'compFile', handler: handleCompUpload },
        'img-to-pdf': { area: 'imgPdfUpload', file: 'imgPdfFile', handler: handleImgPdfUpload },
        'multiple-img-pdf': { area: 'multiUpload', file: 'multiFile', handler: handleMultiUpload },
        'pdf-to-img': { area: 'pdfImgUpload', file: 'pdfImgFile', handler: handlePdfImgUpload },
        'pdf-merger': { area: 'mergeUpload', file: 'mergeFile', handler: handleMergeUpload },
        'pdf-splitter': { area: 'splitUpload', file: 'splitFile', handler: handleSplitUpload },
        'pdf-compressor': { area: 'pdfCompUpload', file: 'pdfCompFile', handler: handlePdfCompUpload },
        'doc-to-pdf': { area: 'docPdfUpload', file: 'docPdfFile', handler: handleDocPdfUpload },
        'pdf-to-doc': { area: 'pdfDocUpload', file: 'pdfDocFile', handler: handlePdfDocUpload },
        'office-excel': { area: 'csvUpload', file: 'csvFile', handler: handleCsvUpload }
    };

    for(let [key, val] of Object.entries(uploadMap)) {
        if(id === key) {
            const area = document.getElementById(val.area);
            const fileInput = document.getElementById(val.file);
            if(area && fileInput) {
                area.addEventListener('click', () => fileInput.click());
                area.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = 'var(--primary)'; });
                area.addEventListener('dragleave', () => { area.style.borderColor = ''; });
                area.addEventListener('drop', (e) => { e.preventDefault(); fileInput.files = e.dataTransfer.files; fileInput.dispatchEvent(new Event('change')); });
                fileInput.addEventListener('change', () => val.handler(fileInput.files[0]));
            }
        }
    }

    // Range value displays
    const ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach(r => {
        const display = document.getElementById(r.id + 'Val');
        if(display) r.addEventListener('input', () => {
            if(r.id.includes('Comp')) display.textContent = r.value + '%';
            else if(r.id.includes('pdfComp')) display.textContent = ['Low','Medium','High'][r.value-1] || 'Medium';
        });
    });

    // Split mode toggle
    const splitMode = document.getElementById('splitMode');
    if(splitMode) splitMode.addEventListener('change', function() {
        document.getElementById('splitRange').style.display = this.value === 'range' ? 'flex' : 'none';
    });

    // Keep aspect ratio
    const keepRatio = document.getElementById('keepRatio');
    if(keepRatio) {
        const w = document.getElementById('resizeWidth');
        const h = document.getElementById('resizeHeight');
        if(w && h) {
            let origRatio;
            w.addEventListener('input', function() { if(keepRatio.checked && origRatio) h.value = Math.round(this.value / origRatio); });
            h.addEventListener('input', function() { if(keepRatio.checked && origRatio) w.value = Math.round(this.value * origRatio); });
            // Store ratio when first image loads (set in upload handler)
        }
    }
}