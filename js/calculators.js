// Finance Calculator
function calcLoan() {
    const P = parseFloat(document.getElementById('loanAmt').value);
    const r = parseFloat(document.getElementById('loanRate').value) / 12 / 100;
    const n = parseInt(document.getElementById('loanTenure').value);
    const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const total = emi * n;
    const interest = total - P;
    document.getElementById('loanResult').style.display = 'block';
    document.getElementById('loanResult').innerHTML = `
        <h4><i class="fas fa-chart-pie"></i> Loan EMI Result</h4>
        <div class="result-value">PKR ${formatNum(emi)}/month</div>
        <p><strong>Total Payment:</strong> PKR ${formatNum(total)}</p>
        <p><strong>Total Interest:</strong> PKR ${formatNum(interest)}</p>
        <p><strong>Principal:</strong> PKR ${formatNum(P)}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${(P/total*100).toFixed(1)}%"></div></div>
        <p style="font-size:0.85rem;color:var(--gray-dark);">EMI is fixed monthly payment. Total includes principal + interest. Higher tenure = lower EMI but more interest.</p>`;
}

function calcSip() {
    const P = parseFloat(document.getElementById('sipAmt').value);
    const r = parseFloat(document.getElementById('sipRate').value) / 100 / 12;
    const n = parseInt(document.getElementById('sipYears').value) * 12;
    const M = P * ((Math.pow(1+r, n) - 1) / r) * (1+r);
    const invested = P * n;
    const gains = M - invested;
    document.getElementById('sipResult').style.display = 'block';
    document.getElementById('sipResult').innerHTML = `
        <h4><i class="fas fa-chart-line"></i> Investment Returns</h4>
        <div class="result-value">PKR ${formatNum(M)}</div>
        <p><strong>Total Invested:</strong> PKR ${formatNum(invested)}</p>
        <p><strong>Estimated Returns:</strong> PKR ${formatNum(gains)}</p>
        <p><strong>Return %:</strong> ${((gains/invested)*100).toFixed(1)}%</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${(invested/M*100).toFixed(1)}%"></div></div>
        <p style="font-size:0.85rem;color:var(--gray-dark);">Compounded monthly. Past performance doesn't guarantee future returns.</p>`;
}

// Pakistan Income Tax
function calcPakistanTax() {
    const income = parseFloat(document.getElementById('taxIncome').value);
    const status = document.getElementById('taxStatus').value;
    let tax = 0, slab = '';

    if(status === 'salaried') {
        if(income <= 600000) { tax = 0; slab = 'No tax (below threshold)'; }
        else if(income <= 1200000) { tax = (income - 600000) * 0.025; slab = '2.5% of amount exceeding 600,000'; }
        else if(income <= 2200000) { tax = 15000 + (income - 1200000) * 0.125; slab = '15,000 + 12.5% above 1.2M'; }
        else if(income <= 3200000) { tax = 140000 + (income - 2200000) * 0.225; slab = '140,000 + 22.5% above 2.2M'; }
        else if(income <= 4100000) { tax = 365000 + (income - 3200000) * 0.275; slab = '365,000 + 27.5% above 3.2M'; }
        else { tax = 612500 + (income - 4100000) * 0.35; slab = '612,500 + 35% above 4.1M'; }
    } else {
        if(income <= 600000) { tax = 0; slab = 'No tax'; }
        else if(income <= 1200000) { tax = (income - 600000) * 0.15; slab = '15% of amount exceeding 600,000'; }
        else if(income <= 2200000) { tax = 90000 + (income - 1200000) * 0.25; slab = '90,000 + 25% above 1.2M'; }
        else if(income <= 3200000) { tax = 340000 + (income - 2200000) * 0.30; slab = '340,000 + 30% above 2.2M'; }
        else { tax = 640000 + (income - 3200000) * 0.35; slab = '640,000 + 35% above 3.2M'; }
    }

    const monthly = tax / 12;
    const effectiveRate = income > 0 ? (tax/income*100).toFixed(2) : 0;

    document.getElementById('taxResult').style.display = 'block';
    document.getElementById('taxResult').innerHTML = `
        <h4><i class="fas fa-landmark"></i> Tax Calculation Result</h4>
        <div class="result-value">Annual Tax: PKR ${formatNum(tax)}</div>
        <p><strong>Monthly Tax:</strong> PKR ${formatNum(monthly)}</p>
        <p><strong>Effective Rate:</strong> ${effectiveRate}%</p>
        <p><strong>Slab Applied:</strong> ${slab}</p>
        <p><strong>Net Income:</strong> PKR ${formatNum(income - tax)}</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">Based on FBR Tax Year 2024-25 rates. Salaried individuals get higher exemptions. This is an estimate. Actual tax may vary with deductions, investments & exemptions.</p>`;
}

// Construction
function calcBricks() {
    const len = parseFloat(document.getElementById('brickLen').value);
    const ht = parseFloat(document.getElementById('brickHt').value);
    const area = len * ht;
    const bricksPerSqft = 12.5;
    const bricks = Math.ceil(area * bricksPerSqft);
    const mortar = (bricks * 0.3).toFixed(0);
    const cost = bricks * 15;
    document.getElementById('brickResult').style.display = 'block';
    document.getElementById('brickResult').innerHTML = `
        <h4>Brick Estimation</h4>
        <div class="result-value">${bricks.toLocaleString()} Bricks</div>
        <p><strong>Wall Area:</strong> ${area.toFixed(2)} sq ft</p>
        <p><strong>Est. Mortar:</strong> ${mortar} cu ft</p>
        <p><strong>Approx Cost:</strong> PKR ${formatNum(cost)} (@PKR 15/brick)</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);">Standard brick size with mortar. Add 10% for breakage & cutting wastage.</p>`;
}

function calcPlaster() {
    const area = parseFloat(document.getElementById('plasterArea').value);
    const thick = parseFloat(document.getElementById('plasterThick').value) / 12;
    const wetVol = area * thick;
    const dryVol = wetVol * 1.55;
    const cement = (dryVol / 5 * 1440 / 50).toFixed(0);
    const sand = (dryVol * 35.31).toFixed(1);
    document.getElementById('plasterResult').style.display = 'block';
    document.getElementById('plasterResult').innerHTML = `
        <h4>Plaster Materials</h4>
        <div class="result-value">${cement} Bags Cement</div>
        <p><strong>Sand Required:</strong> ${sand} cu ft</p>
        <p><strong>Wet Volume:</strong> ${wetVol.toFixed(2)} cu ft</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);">1:4 cement-sand ratio. Add 10% extra for wastage. Thickness: ${thick*12} inches.</p>`;
}

// BMI
function calcBMI() {
    const w = parseFloat(document.getElementById('bmiWeight').value);
    const h = parseFloat(document.getElementById('bmiHeight').value) / 100;
    const bmi = w / (h * h);
    let cat = '', color = '', advice = '';
    if(bmi < 18.5) { cat = 'Underweight'; color = '#3b82f6'; advice = 'Consider increasing calorie intake with nutritious foods. Consult a dietitian.'; }
    else if(bmi < 25) { cat = 'Normal Weight'; color = '#10b981'; advice = 'Great! Maintain a balanced diet and regular exercise.'; }
    else if(bmi < 30) { cat = 'Overweight'; color = '#f59e0b'; advice = 'Consider diet modifications and increased physical activity.'; }
    else { cat = 'Obese'; color = '#ef4444'; advice = 'Consult a healthcare provider. Lifestyle changes recommended.'; }

    document.getElementById('bmiResult').style.display = 'block';
    document.getElementById('bmiResult').innerHTML = `
        <h4><i class="fas fa-weight"></i> BMI Result</h4>
        <div class="result-value" style="color:${color}">${bmi.toFixed(1)} - ${cat}</div>
        <div class="progress-bar" style="background:linear-gradient(90deg,#3b82f6,#10b981,#f59e0b,#ef4444);"><div class="progress-fill" style="width:${Math.min(bmi*2,100)}%;background:white;"></div></div>
        <p><strong>Healthy Range:</strong> 18.5 - 24.9</p>
        <p><strong>Healthy Weight for Your Height:</strong> ${(18.5*h*h).toFixed(1)} - ${(24.9*h*h).toFixed(1)} kg</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">${advice}</p>`;
}

// Age
function calcAge() {
    const dob = new Date(document.getElementById('ageDob').value);
    const now = new Date(document.getElementById('ageNow').value);
    if(dob > now) return alert('DOB cannot be in the future');

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    if(days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if(months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now - dob) / (1000*60*60*24));
    const weeks = Math.floor(totalDays / 7);
    const hours = totalDays * 24;
    const minutes = hours * 60;

    document.getElementById('ageResult').style.display = 'block';
    document.getElementById('ageResult').innerHTML = `
        <h4><i class="fas fa-birthday-cake"></i> Exact Age</h4>
        <div class="result-value">${years} Years, ${months} Months, ${days} Days</div>
        <p><strong>Total Days:</strong> ${totalDays.toLocaleString()}</p>
        <p><strong>Total Weeks:</strong> ${weeks.toLocaleString()}</p>
        <p><strong>Total Hours:</strong> ${hours.toLocaleString()}</p>
        <p><strong>Total Minutes:</strong> ${minutes.toLocaleString()}</p>
        <p><strong>Next Birthday:</strong> ${nextBirthday(dob, now)}</p>`;
}

function nextBirthday(dob, now) {
    const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if(next < now) next.setFullYear(next.getFullYear() + 1);
    const diff = Math.ceil((next - now) / (1000*60*60*24));
    return `${diff} days away (${next.toDateString()})`;
}

// Math
function calcPct() {
    const val = parseFloat(document.getElementById('pctVal').value);
    const of = parseFloat(document.getElementById('pctOf').value);
    const result = (val / 100) * of;
    document.getElementById('pctResult').style.display = 'block';
    document.getElementById('pctResult').innerHTML = `<div class="result-value">${result}</div><p>${val}% of ${of} = ${result}</p>`;
}

function calcDiscount() {
    const orig = parseFloat(document.getElementById('discOrig').value);
    const pct = parseFloat(document.getElementById('discPct').value);
    const saved = orig * (pct/100);
    const final = orig - saved;
    document.getElementById('discResult').style.display = 'block';
    document.getElementById('discResult').innerHTML = `
        <div class="result-value">PKR ${formatNum(final)}</div>
        <p><strong>You Save:</strong> PKR ${formatNum(saved)}</p>
        <p><strong>Original Price:</strong> PKR ${formatNum(orig)}</p>`;
}

// Statistics
function calcStats() {
    const data = document.getElementById('statData').value.split(',').map(Number).filter(n => !isNaN(n));
    if(data.length < 2) return alert('Enter at least 2 numbers');
    const n = data.length;
    const mean = data.reduce((a,b)=>a+b,0) / n;
    const sorted = [...data].sort((a,b)=>a-b);
    const median = n%2===0 ? (sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)];
    const freq = {};
    data.forEach(v => freq[v] = (freq[v]||0)+1);
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.keys(freq).filter(k => freq[k]===maxFreq).join(', ');
    const variance = data.reduce((sum,v) => sum + Math.pow(v-mean,2), 0) / n;
    const sd = Math.sqrt(variance);
    const min = sorted[0], max = sorted[n-1];
    const range = max - min;
    const sum = data.reduce((a,b)=>a+b,0);

    document.getElementById('statResult').style.display = 'block';
    document.getElementById('statResult').innerHTML = `
        <h4><i class="fas fa-chart-bar"></i> Statistics Result</h4>
        <div class="grid-2" style="margin-top:10px;">
            <div><p><strong>Count:</strong> ${n}</p><p><strong>Sum:</strong> ${formatNum(sum)}</p><p><strong>Mean:</strong> ${mean.toFixed(2)}</p><p><strong>Median:</strong> ${median.toFixed(2)}</p></div>
            <div><p><strong>Mode:</strong> ${mode}</p><p><strong>Std Dev:</strong> ${sd.toFixed(2)}</p><p><strong>Variance:</strong> ${variance.toFixed(2)}</p><p><strong>Range:</strong> ${min} - ${max} (${range})</p></div>
        </div>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">Population standard deviation used. Mode can have multiple values if tied.</p>`;
}

// Health
function calcBMR() {
    const w = parseFloat(document.getElementById('bmrWeight').value);
    const h = parseFloat(document.getElementById('bmrHeight').value);
    const age = parseInt(document.getElementById('bmrAge').value);
    const gender = document.getElementById('bmrGender').value;
    const activity = parseFloat(document.getElementById('bmrActivity').value);

    let bmr = gender === 'male' ? (10*w + 6.25*h - 5*age + 5) : (10*w + 6.25*h - 5*age - 161);
    const tdee = bmr * activity;

    document.getElementById('bmrResult').style.display = 'block';
    document.getElementById('bmrResult').innerHTML = `
        <h4><i class="fas fa-fire"></i> Calorie Needs</h4>
        <div class="result-value">${Math.round(tdee)} kcal/day</div>
        <p><strong>BMR (Resting):</strong> ${Math.round(bmr)} kcal</p>
        <p><strong>Weight Loss:</strong> ~${Math.round(tdee-500)} kcal/day</p>
        <p><strong>Weight Gain:</strong> ~${Math.round(tdee+500)} kcal/day</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">Mifflin-St Jeor equation. TDEE = BMR × activity factor. ±500 kcal for ~0.5kg/week change.</p>`;
}

function calcWater() {
    const w = parseFloat(document.getElementById('waterWeight').value);
    const min = (w * 0.03).toFixed(1);
    const max = (w * 0.035).toFixed(1);
    const glasses = Math.round(min * 4);
    document.getElementById('waterResult').style.display = 'block';
    document.getElementById('waterResult').innerHTML = `
        <div class="result-value">${min} - ${max} Liters/day</div>
        <p><strong>Approx Glasses (250ml):</strong> ${glasses} glasses</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">Increase in hot weather, exercise, or illness. Individual needs vary.</p>`;
}

// Routine
function calcTimeDiff() {
    const [sh,sm] = document.getElementById('timeStart').value.split(':').map(Number);
    const [eh,em] = document.getElementById('timeEnd').value.split(':').map(Number);
    let diff = (eh*60+em) - (sh*60+sm);
    if(diff < 0) diff += 24*60;
    const hours = Math.floor(diff/60);
    const mins = diff%60;
    document.getElementById('timeResult').style.display = 'block';
    document.getElementById('timeResult').innerHTML = `<div class="result-value">${hours}h ${mins}m</div><p>Total: ${diff} minutes</p>`;
}

function calcTip() {
    const bill = parseFloat(document.getElementById('tipBill').value);
    const pct = parseFloat(document.getElementById('tipPct').value);
    const tip = bill * pct/100;
    const total = bill + tip;
    document.getElementById('tipResult').style.display = 'block';
    document.getElementById('tipResult').innerHTML = `
        <div class="result-value">Total: PKR ${formatNum(total)}</div>
        <p><strong>Tip Amount:</strong> PKR ${formatNum(tip)}</p>
        <p><strong>Bill:</strong> PKR ${formatNum(bill)}</p>`;
}

// Salary
function calcSalary() {
    const gross = parseFloat(document.getElementById('salGross').value);
    const days = parseInt(document.getElementById('salDays').value);
    const ot = parseFloat(document.getElementById('salOT').value);
    const otRate = parseFloat(document.getElementById('salOTRate').value);
    const pfPct = parseFloat(document.getElementById('salPF').value);
    const ded = parseFloat(document.getElementById('salDed').value);

    const hourly = gross / (days * 8);
    const otEarning = ot * hourly * otRate;
    const pf = gross * pfPct / 100;
    const net = gross + otEarning - pf - ded;

    document.getElementById('salResult').style.display = 'block';
    document.getElementById('salResult').innerHTML = `
        <h4><i class="fas fa-money-bill-wave"></i> Salary Breakdown</h4>
        <div class="result-value">PKR ${formatNum(net)}</div>
        <div class="grid-2">
            <div><p><strong>Gross Salary:</strong> PKR ${formatNum(gross)}</p><p><strong>Overtime:</strong> PKR ${formatNum(otEarning)}</p></div>
            <div><p><strong>Hourly Rate:</strong> PKR ${formatNum(hourly)}</p><p><strong>Provident Fund:</strong> -PKR ${formatNum(pf)}</p></div>
        </div>
        <p><strong>Other Deductions:</strong> -PKR ${formatNum(ded)}</p>
        <p style="font-size:0.85rem;color:var(--gray-dark);margin-top:10px;">Based on 8 hours/day. PF is employee contribution. Tax not included.</p>`;
}

// Unit Converter
const units = {
    length: { m:1, km:0.001, cm:100, mm:1000, mi:0.000621371, yd:1.09361, ft:3.28084, in:39.3701 },
    weight: { kg:1, g:1000, mg:1000000, lb:2.20462, oz:35.274, ton:0.001 },
    area: { sqm:1, sqkm:0.000001, sqft:10.7639, acre:0.000247105, hectare:0.0001, marla:0.0395369 },
    volume: { liter:1, ml:1000, gal:0.264172, cuM:0.001, cuFt:0.0353147 },
    temp: { c:'c', f:'f', k:'k' }
};

function populateUnits() {
    const cat = document.getElementById('unitCat').value;
    const from = document.getElementById('unitFrom');
    const to = document.getElementById('unitTo');
    const keys = Object.keys(units[cat]);
    from.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
    to.innerHTML = keys.map((k,i) => `<option value="${k}" ${i===1?'selected':''}>${k}</option>`).join('');
}

function convertUnit() {
    const cat = document.getElementById('unitCat').value;
    const val = parseFloat(document.getElementById('unitVal').value);
    const from = document.getElementById('unitFrom').value;
    const to = document.getElementById('unitTo').value;

    let result;
    if(cat === 'temp') {
        let celsius;
        if(from==='c') celsius=val;
        else if(from==='f') celsius=(val-32)*5/9;
        else celsius=val-273.15;

        if(to==='c') result=celsius;
        else if(to==='f') result=celsius*9/5+32;
        else result=celsius+273.15;
    } else {
        const base = val / units[cat][from];
        result = base * units[cat][to];
    }

    document.getElementById('unitResult').style.display = 'block';
    document.getElementById('unitResult').innerHTML = `
        <div class="result-value">${val} ${from} = ${parseFloat(result.toFixed(6))} ${to}</div>
        <p style="font-size:0.85rem;color:var(--gray-dark);">Conversion based on standard SI units.</p>`;
}

function formatNum(n) {
    return Number(n).toLocaleString('en-PK', {minimumFractionDigits:2, maximumFractionDigits:2});
}