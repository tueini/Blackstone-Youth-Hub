import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = window._firebaseDb;

const bdayCss = `
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
    .confetti { position: absolute; width: 10px; height: 10px; opacity: 1; border-radius: 2px; }
</style>
`;
document.head.insertAdjacentHTML('beforeend', bdayCss);

// Modal HTML
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
document.body.insertAdjacentHTML('beforeend', modalHtml);

function formatPrivacyName(fullName) {
    if (!fullName) return "";
    const parts = fullName.trim().split(' ');
    if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    }
    return fullName;
}

const pathSegments = window.location.pathname.split('/').filter(p => p && p.toLowerCase() !== 'index.html');
const ORG_NAME = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "Combined";
let isCombined = ORG_NAME.toLowerCase() === "combined";

let allBdays = [];

async function fetchAndCheckBirthdays() {
    try {
        const snap = await getDocs(collection(db, "birthdays"));
        allBdays = [];
        const todayMMDD = new Date().toISOString().split('T')[0].substring(5);
        const modalNames = [];
        
        let properOrgMatch = ORG_NAME;
        if (properOrgMatch === 'YW') properOrgMatch = 'Young Women';

        snap.forEach(d => {
            const b = { ...d.data(), id: d.id };
            allBdays.push(b);
            
            let storedOrg = b.org || '';
            if (storedOrg === 'YW') storedOrg = 'Young Women';

            // Check for modal trigger if not combined
            if (!isCombined && storedOrg === properOrgMatch && b.date) {
                let match = false;
                let mMonth = "", mDay = "";
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const mMap = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec", "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun", "7": "Jul", "8": "Aug", "9": "Sep" };
                if (b.date.includes('-')) {
                    const p = b.date.split('-');
                    if (p.length === 3) { mMonth = mMap[p[1]]||"Jan"; mDay = parseInt(p[2]).toString(); }
                    else if (p.length === 2) { mMonth = mMap[p[0]]||"Jan"; mDay = parseInt(p[1]).toString(); }
                } else if (b.date.includes('/')) {
                    const p = b.date.split('/');
                    mMonth = mMap[p[0]]||"Jan"; mDay = parseInt(p[1]).toString();
                } else {
                    const p = b.date.split(' ');
                    mMonth = p[0]; mDay = parseInt(p[1]||1).toString();
                }
                const today = new Date();
                if (mMonth === monthNames[today.getMonth()] && mDay === today.getDate().toString()) match = true;
                
                if (match) {
                    modalNames.push(formatPrivacyName(b.name));
                }
            }
        });
        
        if (modalNames.length > 0 && !sessionStorage.getItem('birthdayShown_' + ORG_NAME)) {
            document.getElementById('bdayNames').innerText = modalNames.join(' & ');
            document.getElementById('bdayModal').classList.remove('hidden');
            
            // Confetti
            const cCont = document.getElementById('confetti-container');
            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
            for (let k = 0; k < 50; k++) {
                const c = document.createElement('div');
                c.className = 'confetti';
                c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                c.style.left = Math.random() * 100 + '%';
                c.style.animation = `confetti-fall ${Math.random() * 2 + 3}s linear infinite`;
                c.style.animationDelay = Math.random() * 3 + 's';
                cCont.appendChild(c);
            }
        }
        if (document.getElementById('data-bdays-list')) {
            renderBdaysAdmin();
        }
    } catch(e) {
        console.error("Birthday Fetch Error", e);
    }
}

document.getElementById('closeBdayBtn')?.addEventListener('click', () => {
    sessionStorage.setItem('birthdayShown_' + ORG_NAME, 'true');
    document.getElementById('bdayModal').classList.add('hidden');
});

// Admin Inject (Check if the import-controls gate exists - indicating Admin UI is available)
if (document.getElementById('import-controls')) {
    const bdayAdminHtml = `
    <div class="mt-8 border-t border-slate-700/50 pt-6 relative px-1 lg:px-6">
        <h3 class="text-sm font-black text-rose-500 uppercase tracking-widest mb-4 flex justify-between items-center">
            Manage Birthdays (All Orgs)
            <button id="addNewBdayBtn" class="text-[10px] bg-rose-900/40 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded transition uppercase border border-rose-500/30">+ Add Birthday</button>
        </h3>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Date</th>
                        <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Name</th>
                        <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700">Org</th>
                        <th class="p-3 font-black text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-700 text-center action-col-bday hidden">Actions</th>
                    </tr>
                </thead>
                <tbody id="data-bdays-list" class="divide-y divide-rose-900/30"></tbody>
            </table>
        </div>
    </div>
    `;
    const controls = document.getElementById('admin-main-view') || document.getElementById('import-controls');
    controls.insertAdjacentHTML('beforeend', bdayAdminHtml);

    let activeBdayEdit = null;

    window.renderBdaysAdmin = () => {
        const list = document.getElementById('data-bdays-list');
        if (!list) return;
        list.innerHTML = '';
        
        const parseBdayProtocol = (dStr) => {
            if (!dStr) return { m: "Jan", d: "1", val: 9999 };
            const mMap = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec", "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun", "7": "Jul", "8": "Aug", "9": "Sep" };
            const mOrd = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12};
            let pm = "Jan", pd = "1";
            if (dStr.includes('-')) {
                let p = dStr.split('-');
                if(p.length===3) { pm = mMap[p[1]]||"Jan"; pd = parseInt(p[2])||1; }
                else if(p.length===2) { pm = mMap[p[0]]||"Jan"; pd = parseInt(p[1])||1; }
            } else if (dStr.includes('/')) {
                let p = dStr.split('/');
                pm = mMap[p[0]]||"Jan"; pd = parseInt(p[1])||1;
            } else if (dStr.includes(' ')) {
                let p = dStr.split(' ');
                pm = p[0]; pd = parseInt(p[1])||1;
            }
            return { m: pm, d: pd.toString(), val: (mOrd[pm]||12)*100 + parseInt(pd) };
        };

        allBdays.sort((a,b) => {
            return parseBdayProtocol(a.date).val - parseBdayProtocol(b.date).val;
        }).forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-rose-900/10 transition group";
            
            const parsedDateInfo = parseBdayProtocol(item.date);
            
            if (activeBdayEdit === item.id) {
                const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const mOptions = mNames.map(m => `<option value="${m}" ${parsedDateInfo.m===m?'selected':''}>${m}</option>`).join('');

                tr.classList.add('bg-slate-800/80');
                tr.innerHTML = `
                    <td colspan="4" class="p-4 border-b border-rose-900/50">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <div class="flex gap-1">
                                <select class="b-month-select bg-slate-900 text-slate-300 rounded-lg px-2 py-2 border border-rose-500/50 focus:ring-rose-500 outline-none text-xs font-mono w-full">${mOptions}</select>
                                <select class="b-day-select bg-slate-900 text-slate-300 rounded-lg px-2 py-2 border border-rose-500/50 focus:ring-rose-500 outline-none text-xs font-mono w-[60px]"></select>
                            </div>
                            <input type="text" class="bg-slate-900 text-white rounded-lg px-3 py-2 border border-rose-500/50 focus:ring-rose-500 outline-none text-xs font-bold b-name-inp" placeholder="Full Name" value="${item.name||''}">
                            <select class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 border border-rose-500/50 focus:ring-rose-500 outline-none text-xs b-org-inp">
                                <option value="Deacons" ${item.org==='Deacons'?'selected':''}>Deacons</option>
                                <option value="Teachers" ${item.org==='Teachers'?'selected':''}>Teachers</option>
                                <option value="Priests" ${item.org==='Priests'?'selected':''}>Priests</option>
                                <option value="Young Women" ${item.org==='Young Women'||item.org==='YW'?'selected':''}>Young Women</option>
                                <option value="Primary" ${item.org==='Primary'?'selected':''}>Primary</option>
                            </select>
                        </div>
                        <div class="flex gap-2 justify-end">
                            <button class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg px-3 flex items-center justify-center transition-all b-save text-xs font-bold h-8">Save</button>
                            <button class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all b-cancel text-xs">✕</button>
                        </div>
                    </td>
                `;
                
                const mSel = tr.querySelector('.b-month-select');
                const dSel = tr.querySelector('.b-day-select');
                const updateDays = () => {
                    const m = mSel.value;
                    const maxDays = { "Jan": 31, "Feb": 29, "Mar": 31, "Apr": 30, "May": 31, "Jun": 30, "Jul": 31, "Aug": 31, "Sep": 30, "Oct": 31, "Nov": 30, "Dec": 31 }[m] || 31;
                    let dHtml = '';
                    for(let i=1; i<=maxDays; i++) dHtml += `<option value="${i}" ${parsedDateInfo.d==i?'selected':''}>${i}</option>`;
                    dSel.innerHTML = dHtml;
                };
                updateDays();
                mSel.addEventListener('change', updateDays);

                tr.querySelector('.b-save').addEventListener('click', async () => {
                    const nd = mSel.value + " " + dSel.value;
                    const nn = tr.querySelector('.b-name-inp').value.trim();
                    const no = tr.querySelector('.b-org-inp').value;
                    if (!nn) return alert("Warning: Name cannot be empty.");
                    try {
                        if (item.id.startsWith('temp_')) {
                            const dRef = await addDoc(collection(db, "birthdays"), { date: nd, name: nn, org: no });
                            item.id = dRef.id;
                        } else {
                            await updateDoc(doc(db, "birthdays", item.id), { date: nd, name: nn, org: no });
                        }
                        item.date = nd; item.name = nn; item.org = no;
                        activeBdayEdit = null;
                        renderBdaysAdmin();
                    } catch(e) { alert("Save Error: " + e.message); }
                });
                tr.querySelector('.b-cancel').addEventListener('click', () => { 
                    if(item.id.startsWith('temp_')) { allBdays = allBdays.filter(x => x.id !== item.id); }
                    activeBdayEdit = null; renderBdaysAdmin(); 
                });
            } else {
                tr.innerHTML = `
                    <td class="p-4 border-b border-rose-900/30 text-rose-300 text-xs font-mono">${item.date ? `${parsedDateInfo.m} ${parsedDateInfo.d}` : 'N/A'}</td>
                    <td class="p-4 border-b border-rose-900/30 text-sm font-bold text-white">${item.name}</td>
                    <td class="p-4 border-b border-rose-900/30"><span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-black bg-rose-900/40 text-rose-300 border border-rose-700/50">${item.org || 'Unset'}</span></td>
                    <td class="p-4 border-b border-rose-900/30 text-center action-col-bday hidden">
                        <div class="flex justify-center gap-2">
                            <button class="text-rose-400 hover:text-white bg-rose-900/30 hover:bg-rose-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors b-edit text-sm" title="Edit">✎</button>
                            <button class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors b-del text-sm" title="Delete">🗑</button>
                        </div>
                    </td>
                `;
                tr.querySelector('.b-edit')?.addEventListener('click', () => { activeBdayEdit = item.id; renderBdaysAdmin(); });
                tr.querySelector('.b-del')?.addEventListener('click', async () => {
                    if (confirm("Delete this birthday?")) {
                        try {
                            await deleteDoc(doc(db, "birthdays", item.id));
                            allBdays = allBdays.filter(x => x.id !== item.id);
                            renderBdaysAdmin();
                        } catch(e) { alert("Delete Error: " + e.message); }
                    }
                });
            }
            list.appendChild(tr);
        });
        
        // Sync Admin Toggle with the rest of the page logic. We listen to changes on action-col and copy visibility.
        const pageEditMode = !document.querySelector('.action-col')?.classList.contains('hidden');
        document.querySelectorAll('.action-col-bday').forEach(e => e.classList.toggle('hidden', !pageEditMode));
    };

    document.getElementById('addNewBdayBtn').addEventListener('click', () => {
        const tid = "temp_" + Math.random().toString(36).substr(2, 9);
        allBdays.unshift({ id: tid, date: "", name: "", org: "Deacons" });
        activeBdayEdit = tid;
        renderBdaysAdmin();
    });

    document.getElementById('adminToggleViewBtn')?.addEventListener('click', () => {
        setTimeout(() => {
            const mEdit = !document.querySelector('.action-col')?.classList.contains('hidden');
            document.querySelectorAll('.action-col-bday').forEach(e => e.classList.toggle('hidden', !mEdit));
        }, 50);
    });
}
// Delay slightly to ensure _firebaseDb and DOM are ready
setTimeout(() => { fetchAndCheckBirthdays(); }, 1200);
