const fs = require('fs');

const subpages = ['Combined', 'Deacons', 'Priests', 'Primary', 'Teachers', 'YW'].map(d => `./${d}/index.html`);

const bdayCss = `
<!-- Birthday Protocol -->
<style>
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes confetti-fall {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    .balloon { animation: float 3s ease-in-out infinite; }
    .confetti { position: absolute; width: 10px; height: 10px; animation: confetti-fall 4s linear infinite; }
</style>
`;

const privacyJs = `
<script>
    function formatPrivacyName(fullName) {
        if (!fullName) return "";
        const parts = fullName.trim().split(' ');
        if (parts.length > 1) {
            return \`\${parts[0]} \${parts[parts.length - 1].charAt(0)}.\`;
        }
        return fullName;
    }
</script>
`;

const modalHtml = `
<div id="bdayModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden pointer-events-auto">
    <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
    <div id="confetti-container" class="absolute inset-0 flex justify-center overflow-hidden pointer-events-none"></div>
    <div class="relative bg-slate-900 border-2 border-emerald-500 rounded-3xl w-full max-w-md p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] balloon z-10">
        <div class="text-6xl mb-4">🎈</div>
        <h2 class="text-3xl font-black text-white uppercase tracking-tighter mb-2">Happy Birthday!</h2>
        <p id="bdayNames" class="text-xl text-emerald-400 font-bold mb-8"></p>
        <button id="closeBdayBtn" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg transition active:scale-95 uppercase tracking-widest pointer-events-auto">Enter Hub</button>
    </div>
</div>
`;

// Logic for pulling birthdays and triggering modal
const dbLogic = `
            try {
                if (ORGANIZATION_NAME !== 'Combined') {
                    const bdaySnap = await getDocs(collection(db, "birthdays"));
                    const bdayNames = [];
                    
                    bdaySnap.forEach(d => {
                        const binfo = d.data();
                        if (binfo.org === ORGANIZATION_NAME && binfo.date) {
                            let match = false;
                            let mMonth = "", mDay = "";
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            const mMap = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec", "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun", "7": "Jul", "8": "Aug", "9": "Sep" };
                            if (binfo.date.includes('-')) {
                                const p = binfo.date.split('-');
                                if (p.length === 3) { mMonth = mMap[p[1]]||"Jan"; mDay = parseInt(p[2]).toString(); }
                                else if (p.length === 2) { mMonth = mMap[p[0]]||"Jan"; mDay = parseInt(p[1]).toString(); }
                            } else if (binfo.date.includes('/')) {
                                const p = binfo.date.split('/');
                                mMonth = mMap[p[0]]||"Jan"; mDay = parseInt(p[1]).toString();
                            } else {
                                const p = binfo.date.split(' ');
                                mMonth = p[0]; mDay = parseInt(p[1]||1).toString();
                            }
                            const today = new Date();
                            if (mMonth === monthNames[today.getMonth()] && mDay === today.getDate().toString()) match = true;
                            
                            if (match) {
                                bdayNames.push(formatPrivacyName(binfo.name));
                            }
                        }
                    });
                    
                    if (bdayNames.length > 0 && !sessionStorage.getItem('birthdayShown_' + ORGANIZATION_NAME)) {
                        const m = document.getElementById('bdayModal');
                        if (m) {
                            document.getElementById('bdayNames').innerText = bdayNames.join(' & ');
                            m.classList.remove('hidden');
                            
                            // Generate Confetti
                            const cCont = document.getElementById('confetti-container');
                            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
                            for (let k = 0; k < 50; k++) {
                                const c = document.createElement('div');
                                c.className = 'confetti';
                                c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                                c.style.left = Math.random() * 100 + '%';
                                c.style.animationDelay = Math.random() * 3 + 's';
                                c.style.animationDuration = Math.random() * 2 + 3 + 's';
                                cCont.appendChild(c);
                            }
                        }
                    }
                }
            } catch(e) { console.error("Bday fetch error:", e); }
`;

// Build Admin UI HTML 
const bdayAdminHtml = `
            <div class="mt-8 border-t border-slate-700/50 pt-6 px-6 relative">
                <h3 class="text-sm font-black text-rose-500 uppercase tracking-widest mb-4 flex justify-between items-center">
                    Manage Birthdays (All Orgs)
                    <button id="addNewBdayBtn" class="text-[10px] bg-rose-900/40 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded transition uppercase border border-rose-500/30">+ Add Birthday</button>
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Date/Time</th>
                                <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Name</th>
                                <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Org</th>
                                <th class="action-col hidden p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="data-bdays-list" class="divide-y divide-rose-900/30"></tbody>
                    </table>
                </div>
            </div>
`;

for (const file of subpages) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Insert CSS
    if (!content.includes('confetti-fall')) {
        content = content.replace('</head>', bdayCss + '</head>');
    }
    
    // 2. Insert DOM Logic + Modal into body
    if (!content.includes('bdayModal')) {
        content = content.replace('</body>', privacyJs + modalHtml + `
<script>
    if(document.getElementById('closeBdayBtn')){
        document.getElementById('closeBdayBtn').addEventListener('click', () => {
            const org = window.location.pathname.split('/').filter(p => p && p.toLowerCase() !== 'index.html').pop() || 'Combined';
            sessionStorage.setItem('birthdayShown_' + org, 'true');
            document.getElementById('bdayModal').classList.add('hidden');
        });
    }
</script>
</body>`);
    }

    // 3. Insert Bday init fetch logic in initApp
    const targetInit = 'const lessonSnap = await getDocs(collection(db, `${ORGANIZATION_NAME}_lessons`));';
    if (!content.includes('collection(db, "birthdays")') && content.includes(targetInit)) {
        content = content.replace(targetInit, dbLogic + '\n                ' + targetInit);
    }
    
    // 4. Global Bday Array 
    const varInitTarget = 'let events = [], unscheduled = [], lessons = [], orgTeachers = [];';
    if (!content.includes('bdays = []') && content.includes(varInitTarget)) {
        content = content.replace(varInitTarget, 'let events = [], unscheduled = [], lessons = [], orgTeachers = [], bdays = [];');
    }

    // 5. Insert Bday Data Fetch
    const bdayFetchTarget = 'const orgSnap = await getDocs(collection(db, `${ORGANIZATION_NAME}_events`));';
    if (!content.includes('bdays = bAllData') && content.includes(bdayFetchTarget)) {
        const fetchContent = `
                const bSnap = await getDocs(collection(db, "birthdays"));
                const bAllData = [];
                bSnap.forEach(d => bAllData.push({...d.data(), id: d.id}));
                bdays = bAllData;
        `;
        content = content.replace(bdayFetchTarget, fetchContent + '\n                ' + bdayFetchTarget);
    }

    // 6. Insert Admin HTML
    if (!content.includes('Manage Birthdays')) {
        const repPoint = '</table>\n                </div>\n            </div>\n        </div>';
        if (content.includes(repPoint)) {
             content = content.replace(repPoint, '</table>\n                </div>\n            </div>\n' + bdayAdminHtml + '\n        </div>');
        } else {
             // generic fallback
             content = content.replace('<div id="admin-main-view"', bdayAdminHtml + '\n<div id="admin-main-view"');
        }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log("Patched " + file);
}
