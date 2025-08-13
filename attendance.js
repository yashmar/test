// attendance.js
// Temporary logic for Attendance page

// Random student names
const randomNames = [
    'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Vihaan Gupta', 'Arjun Reddy', 'Sai Kumar', 'Reyansh Mehta',
    'Ayaan Joshi', 'Krishna Nair', 'Ishaan Das', 'Anaya Shah', 'Diya Jain', 'Myra Kapoor', 'Aadhya Sinha',
    'Siya Agarwal', 'Pari Verma', 'Navya Rao', 'Anika Choudhary', 'Sara Bansal', 'Ira Mishra', 'Riya Yadav',
    'Aarohi Desai', 'Meera Pillai', 'Saanvi Shetty', 'Prisha Menon', 'Aanya Iyer', 'Aarav Singh', 'Ishita Ghosh',
    'Kabir Malhotra', 'Advait Bhatt', 'Yashvi Pandey', 'Aarush Sethi', 'Aarav Nanda', 'Aarav Kapoor', 'Aarav Jain',
    'Aarav Mehta', 'Aarav Shah', 'Aarav Patel', 'Aarav Gupta', 'Aarav Reddy', 'Aarav Kumar', 'Aarav Joshi',
    'Aarav Nair', 'Aarav Das', 'Aarav Shah', 'Aarav Jain', 'Aarav Kapoor', 'Aarav Mehta', 'Aarav Shah',
    'Aarav Patel', 'Aarav Gupta', 'Aarav Reddy', 'Aarav Kumar', 'Aarav Joshi', 'Aarav Nair', 'Aarav Das',
    'Aarav Shah', 'Aarav Jain', 'Aarav Kapoor', 'Aarav Mehta', 'Aarav Shah', 'Aarav Patel', 'Aarav Gupta',
    'Aarav Reddy', 'Aarav Kumar', 'Aarav Joshi', 'Aarav Nair', 'Aarav Das', 'Aarav Shah', 'Aarav Jain',
    'Aarav Kapoor', 'Aarav Mehta', 'Aarav Shah', 'Aarav Patel', 'Aarav Gupta', 'Aarav Reddy', 'Aarav Kumar',
    'Aarav Joshi', 'Aarav Nair', 'Aarav Das'
];
function getRandomName(i) {
    return randomNames[i % randomNames.length] + ' #' + (i+1);
}
const students = Array.from({length: 72}, (_, i) => ({
    id: i + 1,
    name: getRandomName(i),
    attendance: Array.from({length: 31}, () => Math.random() > 0.3), // random attendance
}));

// Mark some demo attendance for summary
for (let i = 0; i < 40; i++) students[i].attendance[0] = true; // 40 present today
for (let i = 0; i < 30; i++) students[i].attendance[1] = true; // 30 present yesterday
for (let i = 0; i < 50; i++) students[i].attendance[2] = true; // 50 present day before

// Detect user type from sessionStorage (set on login)
let userType = sessionStorage.getItem('userType') || 'student'; // Set to 'teacher' to show sheet by default

// Add QRious for QR code generation
if (typeof QRious === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js';
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('attendance-main');
    if (userType === 'student') {
        main.innerHTML = `
            <h2>Scan QR to Mark Attendance</h2>
            <div id="qr-reader" style="width:300px;"></div>
            <div id="qr-result"></div>
        `;
        // Initialize QR scanner
        const qrReader = new Html5Qrcode("qr-reader");
        qrReader.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            qrCodeMessage => {
                document.getElementById('qr-result').innerHTML = `<span style='color:green'>Success! Attendance marked.</span>`;
                setTimeout(() => window.location.href = 'main.html', 1500);
                qrReader.stop();
            }
        );
    } else if (userType === 'teacher') {
        main.innerHTML = `
            <h2>Show this QR to Students</h2>
            <canvas id="qr-canvas"></canvas>
            <button id="check-sheet">Check Sheet</button>
            <div id="summary"></div>
            <div id="sheet-table"></div>
        `;
        // Generate QR code (real)
        setTimeout(() => {
            const qr = new QRious({
                element: document.getElementById('qr-canvas'),
                value: 'ATTENDANCE-' + new Date().toISOString().slice(0,10),
                size: 200
            });
        }, 300);
        showSummary();
        showSheetTable();
        document.getElementById('check-sheet').onclick = () => showSheetTable();
    }
});

function showSummary() {
    // Calculate summary
    const today = 0;
    const presentToday = students.filter(s => s.attendance[today]).length;
    const presentMonth = students.reduce((sum, s) => sum + s.attendance.filter(Boolean).length, 0);
    const presentYear = presentMonth; // Placeholder
    document.getElementById('summary').innerHTML = `
        <div style='margin:10px 0; font-size:1.1em;'>
            <b>Present Today:</b> ${presentToday} / 72<br>
            <b>Present This Month:</b> ${presentMonth} / ${72*31}<br>
            <b>Present This Year:</b> ${presentYear} / ${72*31}
        </div>
    `;
}

function showSheetTable() {
    let html = `<table border='1'><tr><th>Name</th><th>Present Days</th><th>Details</th></tr>`;
    students.forEach(s => {
        const present = s.attendance.filter(Boolean).length;
        html += `<tr><td><a href='#' onclick='showGraph(${s.id})'>${s.name}</a></td><td>${present}</td><td><button onclick='showGraph(${s.id})'>View</button></td></tr>`;
    });
    html += '</table>';
    document.getElementById('sheet-table').innerHTML = html;
}

function showGraph(id) {
    // Show a modal with a chart for the student
    const student = students.find(s => s.id === id);
    let modal = document.createElement('div');
    modal.id = 'sheet-modal';
    modal.innerHTML = `<div style='background:#fff;padding:2rem;border-radius:16px;max-width:90vw;max-height:80vh;overflow:auto;'>
        <h3>${student.name} Attendance</h3>
        <canvas id='chart' width='400' height='200'></canvas>
        <button onclick='document.body.removeChild(document.getElementById("sheet-modal"))'>Close</button>
    </div>`;
    document.body.appendChild(modal);
    // Chart.js
    new Chart(document.getElementById('chart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: Array.from({length: 31}, (_, i) => `Day ${i+1}`),
            datasets: [{
                label: 'Present',
                data: student.attendance.map(x => x ? 1 : 0),
                backgroundColor: student.attendance.map(x => x ? 'green' : 'red'),
            }]
        },
        options: {scales: {y: {beginAtZero: true, max: 1}}}
    });
}

// Password reset logic (for demo, resets to Yash@2007)
function resetPassword(role, id) {
    if (role === 'teacher' && id === '20456') {
        alert('Teacher password reset to Yash@2007');
    } else if (role === 'student' && id === 'tech456') {
        alert('Student password reset to Yash@2007');
    } else {
        alert('ID not found for reset.');
    }
}
window.resetPassword = resetPassword;
window.showGraph = showGraph;

// In login.html, after successful login, set sessionStorage:
// sessionStorage.setItem('userType', role);

// Theme toggle logic for attendance page
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        if (!document.getElementById('theme-toggle')) {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle';
            btn.id = 'theme-toggle';
            btn.title = 'Toggle theme';
            btn.style.position = 'absolute';
            btn.style.top = '1.2rem';
            btn.style.right = '1.2rem';
            btn.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/000000/sun--v1.png" id="theme-icon" alt="Theme">';
            document.body.appendChild(btn);
            let dark = false;
            btn.onclick = () => {
                dark = !dark;
                if (dark) {
                    document.body.style.background = '#181a1b';
                    btn.classList.add('dark');
                    document.getElementById('attendance-main').style.background = '#222';
                    document.getElementById('attendance-main').style.color = '#fff';
                    btn.querySelector('img').src = 'https://img.icons8.com/ios-filled/50/ffffff/moon-symbol.png';
                } else {
                    document.body.style.background = '#fff';
                    btn.classList.remove('dark');
                    document.getElementById('attendance-main').style.background = '#fff';
                    document.getElementById('attendance-main').style.color = '#222';
                    btn.querySelector('img').src = 'https://img.icons8.com/ios-filled/50/000000/sun--v1.png';
                }
            };
        }
    });
}
