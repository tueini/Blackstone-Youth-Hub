
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, getDoc, writeBatch, query, where, onSnapshot, orderBy, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_APP_ID } from "/js/config.js";

        let ORGANIZATION_NAME = 'Combined';
        let isCombinedPage = ORGANIZATION_NAME.toLowerCase() === 'combined';
        let displayOrg = 'Combined';

        const firebaseConfig = {
            apiKey: "AIzaSyDrWB07WNqObtjiZb_NntJQZ0dhHyLRBas",
            authDomain: "blackstoneward-b861c.firebaseapp.com",
            projectId: "blackstoneward-b861c",
            storageBucket: "blackstoneward-b861c.firebasestorage.app",
            messagingSenderId: "609425206588",
            appId: "1:609425206588:web:99ae3cb602c82e212dc239",
            measurementId: "G-0T68YN4Y2P"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        window._firebaseDb = db;
        window.db = db;
        window.auth = auth;
        
        let events = [], unscheduled = [], lessons = [], orgTeachers = [], fullOrgTeachers = [], birthdays = [];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const today = new Date();

        async function initApp() {
            try {
                let currentOrg = ORGANIZATION_NAME;
                if (currentOrg === 'YW') currentOrg = 'Young Women';
                
                let q = ORGANIZATION_NAME === 'Combined' 
                    ? query(collection(db, "home_teachers"))
                    : query(collection(db, "home_teachers"), where("org", "in", [currentOrg, "General", "Universal"]));
                    
                onSnapshot(q, (snapshot) => {
                    orgTeachers.length = 0;
                    fullOrgTeachers.length = 0;
                    snapshot.forEach(d => {
                        orgTeachers.push(d.data().name);
                        fullOrgTeachers.push({id: d.id, ...d.data()});
                    });
                    orgTeachers.sort();
                    fullOrgTeachers.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
                    window.fullOrgTeachers = fullOrgTeachers;
                    if (typeof renderTeacherList === 'function') renderTeacherList();
                    try { if (typeof window.renderLessonManager === 'function') window.renderLessonManager(); } catch(e) {}
                });
            } catch (e) { console.error("Teacher fetch err:", e); }

            try {
                const allData = [];
                const dbOrg = ORGANIZATION_NAME === 'Young Women' ? 'YW' : ORGANIZATION_NAME;
                const orgSnap = await getDocs(collection(db, `${dbOrg}_events`));
                orgSnap.forEach(d => allData.push({...d.data(), id: d.id, sourceOrg: ORGANIZATION_NAME}));
                if (!isCombinedPage) {
                    const combinedSnap = await getDocs(collection(db, "Combined_events"));
                    combinedSnap.forEach(d => allData.push({...d.data(), id: d.id, cat: 'combined', sourceOrg: 'Combined'}));
                }
                events = allData.filter(d => d.type === 'scheduled');
                unscheduled = allData.filter(d => d.type === 'unscheduled');
                
                const lessonSnap = await getDocs(collection(db, `${dbOrg}_lessons`));
                lessonSnap.forEach(d => lessons.push({...d.data(), id: d.id, sourceOrg: ORGANIZATION_NAME}));
                if (!isCombinedPage) {
                    const combinedL = await getDocs(collection(db, "Combined_lessons"));
                    combinedL.forEach(d => lessons.push({...d.data(), id: d.id, sourceOrg: 'Combined'}));
                }
                
                const bdaySnap = await getDocs(collection(db, "birthdays"));
                bdaySnap.forEach(d => birthdays.push({...d.data(), id: d.id}));
                
                refreshUI();
            } catch (e) { console.error("Initial load failed:", e); }
        }

        function refreshUI() {    renderDataManager(); renderLessonManager(); if(typeof renderBirthdayManager === 'function') renderBirthdayManager(); }
        window.refreshUI = refreshUI;

        function renderCalendar() {
            const active = document.getElementById('active-months'), past = document.getElementById('past-months');
            active.innerHTML = ''; past.innerHTML = '';
            for (let m = 0; m < 12; m++) {
                const card = document.createElement('div');
                card.className = `month-card ${m === today.getMonth() ? 'border-blue-500/50 ring-1 ring-blue-500/20' : ''}`;
                card.innerHTML = `<h3 class="month-header font-bold text-slate-300 text-sm">${months[m]} 2026</h3>`;
                const grid = document.createElement('div');
                grid.className = 'days-grid';
                ['S','M','T','W','T','F','S'].forEach(d => { grid.innerHTML += `<div class="opacity-30 font-bold text-[10px]">${d}</div>`; });
                const firstDay = new Date(2026, m, 1).getDay(), daysInMonth = new Date(2026, m + 1, 0).getDate();
                for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;
                for (let d = 1; d <= daysInMonth; d++) {
                    const dateStr = `2026-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const evData = events.filter(e => e.date === dateStr);
                    const dL = lessons.filter(l => l.date === dateStr);
                    const dayEl = document.createElement('div');
                    
                    if (evData.length > 0 || dL.length > 0) {
                        dayEl.className = `day flex-col justify-end items-stretch p-1 ${today.getDate() === d && today.getMonth() === m ? 'today' : ''} border border-slate-700/30 overflow-visible cursor-pointer relative has-event`;
                        let html = `<span class="absolute top-[2px] right-[4px] z-10 text-[10px] font-black text-slate-400">${d}</span>`;
                        if (dL.length > 0) html += `<span class="absolute top-[2px] left-[2px] z-20 text-[12px] bg-violet-500/40 w-5 h-5 rounded flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-110 active:scale-95" title="Lesson: ${dL[0].topic || 'Scheduled'}">📖</span>`;
                        
                        html += `<div class="flex flex-col gap-[2px] w-full h-full justify-end mt-4">`;
                        
                        const displayCount = evData.length >= 4 ? 3 : evData.length;
                        for(let k=0; k<displayCount; k++) {
                            const e = evData[k];
                            html += `<div class="event-pill event-${e.cat} rounded-sm w-full h-[8px] sm:h-[12px] opacity-80 backdrop-blur-sm"></div>`;
                        }
                        
                        if (evData.length >= 4) {
                            html += `<div class="text-[8px] text-blue-400 font-black text-center w-full bg-blue-900/20 rounded-sm leading-tight inline-block">+${evData.length - 3}</div>`;
                        }
                        if (evData.some(e => e.isService)) html += `<span class="absolute top-[2px] right-[18px] z-20 text-[10px] text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" title="Service Project">★</span>`;
                        html += `</div>`;
                        dayEl.innerHTML = html;
                        
                        // Bind unified Day Detail Popover 
                        dayEl.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openDayDetailPopover(dateStr, evData, dL);
                        });
                    } else {
                        dayEl.className = `day ${today.getDate() === d && today.getMonth() === m ? 'today' : ''}`;
                        dayEl.innerHTML = `<span>${d}</span>`;
                    }
                    grid.appendChild(dayEl);
                }
                card.appendChild(grid);
                (m < today.getMonth()) ? past.appendChild(card) : active.appendChild(card);
            }
            if (document.getElementById('pastMonthsBtn')) {
                const togglerText = document.querySelector('#pastMonthsBtn span');
                document.getElementById('pastMonthsBtn').onclick = () => {
                    const isHidden = past.classList.toggle('hidden');
                    if (togglerText) togglerText.innerText = isHidden ? "See Previous Months" : "Hide Previous Months";
                };
            }
        }

        function showEvent(ev) {
            document.getElementById('pane-title').innerHTML = ev.name + (ev.isService ? '<span class="text-yellow-400 ml-2 drop-shadow" title="Service Project">★</span>' : '');
            const d = new Date(ev.date + "T00:00:00");
            document.getElementById('pane-date').innerText = `${months[d.getMonth()]} ${d.getDate()} • ${d.toLocaleDateString('en-US', { weekday: 'short' })}`;
            document.getElementById('pane-details').innerHTML = `<div class="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl"><div class="flex items-center gap-2 mb-4"><span class="w-3 h-3 rounded-full dot-${ev.cat}"></span><span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${ev.cat}</span></div><p class="text-slate-300 leading-relaxed text-sm">${ev.details || 'No details.'}</p><button id="backBtn" class="mt-8 text-xs text-blue-400 font-bold hover:underline">← Back</button></div>`;
            document.getElementById('backBtn').onclick = renderDefaultPane;
        }

        function renderDefaultPane() {
            document.getElementById('pane-title').innerText = "Upcoming";
            document.getElementById('pane-date').innerText = "Next Activities";
            const upcoming = events.filter(e => new Date(e.date + "T23:59:59") >= today).sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0,3);
            document.getElementById('pane-details').innerHTML = upcoming.map(e => {
                const d = new Date(e.date + "T00:00:00");
                return `<div id="up-${e.id}" class="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 p-4 rounded-lg border border-slate-700/50 mb-2 transition"><div class="flex items-center justify-between mb-1"><p class="text-[10px] font-bold text-slate-500 uppercase">${months[d.getMonth()]} ${d.getDate()}</p><span class="w-2 h-2 rounded-full dot-${e.cat}"></span></div><p class="font-bold text-white group-hover:text-blue-400 transition text-sm">${e.name}${e.isService ? '<span class="text-yellow-400 ml-2 drop-shadow" title="Service Project">★</span>' : ''}</p></div>`;
            }).join('');
            upcoming.forEach(e => {
                const el = document.getElementById(`up-${e.id}`);
                if(el) el.onclick = () => showEvent(e);
            });
            const dashboard = document.getElementById('admin-dashboard');
            if (dashboard) { dashboard.classList.remove('hidden'); }
            if (typeof isListView !== 'undefined' && isListView && window.innerWidth < 1024) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        function renderUnscheduled() {
            document.getElementById('idea-count').innerText = unscheduled.length;
            document.getElementById('unscheduled-ideas').innerHTML = unscheduled.map(i => `<div class="text-[11px] p-3 bg-slate-800/30 rounded border-l-2 border-slate-700 mb-2 flex items-center gap-3"><span class="w-2 h-2 shrink-0 rounded-full dot-${i.cat}"></span><div class="flex flex-col"><span class="font-bold text-slate-300 leading-tight">${i.name}</span>${i.isService ? '<span class="text-yellow-400 ml-1 text-[10px] drop-shadow-sm inline-block" title="Service Project">★</span>' : ''}${i.details ? `<span class="text-slate-500 italic text-[9px] mt-1">${i.details}</span>` : ''}</div></div>`).join('');
        }

        // --- v4.9 UPGRADES: LIST VIEW & PRINT ---
        let isListView = false;
        
        function formatListDate(dateStr) {
            const d = new Date(dateStr + "T00:00:00");
            return `${months[d.getMonth()]} ${d.getDate()}`;
        }

        function openDayDetailPopover(dateStr, dayEvents, dayLessons = []) {
            const modal = document.getElementById('dayDetailModal');
            if(!modal) return;
            const list = document.getElementById('dayDetailList');
            list.innerHTML = '';
            
            const dateObj = new Date(dateStr + "T12:00:00");
            const dayName = dateObj.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase();
            document.getElementById('dayDetailDate').innerText = `${formatListDate(dateStr)} • ${dayName}`;
            
            dayLessons.forEach(l => {
                const el = document.createElement('div');
                el.className = `p-3 rounded-lg border border-violet-500/40 bg-slate-800 mb-2 text-left shadow-lg cursor-pointer transition-transform active:scale-95 group`;
                el.innerHTML = `<div class="flex items-center mb-1"><span class="flex items-center justify-center w-6 h-6 rounded bg-violet-500/40 text-sm mr-2 leading-none shadow-sm transition-transform group-hover:scale-110">📖</span><span class="font-bold text-sm text-violet-400 truncate">Sunday Lesson</span></div><p class="text-xs text-white font-bold leading-tight pl-8">${l.topic || 'No Topic Set'}</p><p class="text-[10px] text-slate-400 pl-8 mt-1 uppercase tracking-widest">Teacher: ${l.teacher || 'TBD'}</p>${l.notes ? `<p class="text-[10px] text-slate-500 pl-8 mt-2 italic leading-tight">Note: ${l.notes}</p>` : ''}`;
                el.onclick = () => { modal.classList.add('hidden'); if(window.innerWidth < 1024) document.getElementById('info-pane').scrollIntoView({ behavior: 'smooth' }); };
                list.appendChild(el);
            });

            dayEvents.forEach(ev => {
                const colors = { 'social': 'pink', 'physical': 'emerald', 'spiritual': 'violet', 'intellectual': 'amber', 'combined': 'blue' };
                const c = colors[ev.cat] || 'slate';
                const el = document.createElement('div');
                el.className = `p-3 rounded-lg border border-${c}-500/30 bg-slate-800/80 mb-2 cursor-pointer transition active:scale-95 text-left`;
                el.innerHTML = `<div class="flex items-center mb-1"><span class="w-2 h-2 rounded-full bg-${c}-500 mr-2 shrink-0"></span><span class="font-bold text-sm text-white">${ev.name}</span>${ev.isService ? '<span class="text-yellow-400 ml-2 text-[10px] drop-shadow-sm" title="Service Project">★</span>' : ''}</div>${ev.details ? `<p class="text-[10px] text-slate-400 pl-4 leading-tight">${ev.details}</p>` : ''}`;
                el.onclick = () => { 
                    modal.classList.add('hidden'); 
                    showEvent(ev); 
                    if (window.innerWidth < 1024) document.getElementById('info-pane').scrollIntoView({ behavior: 'smooth' }); 
                };
                list.appendChild(el);
            });
            modal.classList.remove('hidden');
        }

        // Close Popover Bindings 
        const dayDetailModal = document.getElementById('dayDetailModal');
        if (dayDetailModal) {
            dayDetailModal.addEventListener('click', (e) => {
                if(e.target.id === 'dayDetailModal') { e.target.classList.add('hidden'); }
            });
        }
        const closeDayDetailBtn = document.getElementById('closeDayDetailBtn');
        if (closeDayDetailBtn && dayDetailModal) {
            closeDayDetailBtn.addEventListener('click', () => {
                dayDetailModal.classList.add('hidden');
            });
        }

        const handlePrint = async (filter = 'all', selectNode = null) => {
            let html = "";
            const colors = { social: '#3b82f6', physical: '#f97316', spiritual: '#8b5cf6', intellectual: '#eab308', combined: '#10b981' };

            if (filter === 'all' || filter === 'activities') {
                html += `<h1 style="font-size:24px; font-weight:bold; margin-bottom:20px;">2026 ${displayOrg} Activities</h1>`;
                html += `<h2 style="font-size:18px; font-weight:bold; margin-top:20px; border-bottom:1px solid #ccc; padding-bottom:5px;">Scheduled Events</h2>`;
                const sortedEvents = events.sort((a,b) => new Date(a.date) - new Date(b.date));
                sortedEvents.forEach(e => {
                    const d = new Date(e.date + "T00:00:00");
                    html += `<div style="margin-bottom:8px;"><strong style="color: ${colors[e.cat] || '#000'}">${e.isService ? '⭐' : '•'}</strong> <strong>${months[d.getMonth()]} ${d.getDate()}:</strong> ${e.name} ${e.details ? '— <i>'+e.details+'</i>' : ''}</div>`;
                });
                if (unscheduled.length > 0) {
                    html += `<h2 style="font-size:18px; font-weight:bold; margin-top:20px; border-bottom:1px solid #ccc; padding-bottom:5px;">Ideas (Unscheduled)</h2>`;
                    unscheduled.forEach(i => {
                        html += `<div style="margin-bottom:8px;"><strong style="color: ${colors[i.cat] || '#000'}">${i.isService ? '⭐' : '•'}</strong> ${i.name} ${i.details ? '— <i>'+i.details+'</i>' : ''}</div>`;
                    });
                }
            }

            if (filter === 'all' || filter === 'lessons') {
                html += `<h1 style="font-size:24px; font-weight:bold; margin-bottom:20px; ${filter==='all' ? 'margin-top:40px;' : ''}">2026 ${displayOrg} Sunday Lessons</h1>`;
                const sortedLessons = lessons.sort((a,b) => new Date(a.date) - new Date(b.date));
                sortedLessons.forEach(l => {
                    if(!l.date) return;
                    const d = new Date(l.date + "T00:00:00");
                    html += `<div style="margin-bottom:8px;"><strong style="color: #8b5cf6;">•</strong> <strong>${months[d.getMonth()]} ${d.getDate()}:</strong> ${l.topic} <strong>[${l.teacher || 'Unassigned'}]</strong> ${l.notes ? '<br><i style="font-size: 11px; margin-left: 20px;">Notes: '+l.notes+'</i>' : ''}</div>`;
                });
            }

            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const printContent = `<div style="padding: 20px; font-family: sans-serif; background: #ffffff; color: #000000; width: 800px; display: block;">${html}</div>`;

            let exportName = 'YHub_All_Sched.pdf';
            if (filter === 'activities') exportName = 'YHub_Activities_Sched.pdf';
            if (filter === 'lessons') exportName = 'YHub_Lessons_Sched.pdf';

            const opt = {
                margin: 10,
                filename: exportName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await new Promise(resolve => setTimeout(resolve, 500));

            if (isMobile) {
                let popWindow = window.open('', '_blank');
                if (popWindow) popWindow.document.write('<body style="background:#0f172a;color:white;font-family:sans-serif;text-align:center;padding-top:20vh;"><h2>Generating PDF... Please wait...</h2></body>');
                
                html2pdf().from(printContent).set(opt).outputPdf('bloburl').then((res) => {
                    if (popWindow) popWindow.location.href = res;
                    else window.location.href = res;
                    if (selectNode) {
                        selectNode.options[0].text = "Download Schedule (PDF) ▾";
                        selectNode.disabled = false;
                        selectNode.value = "";
                    }
                });
            } else {
                html2pdf().from(printContent).set(opt).save().then(() => {
                    if (selectNode) {
                        selectNode.options[0].text = "Download Schedule (PDF) ▾";
                        selectNode.disabled = false;
                        selectNode.value = "";
                    }
                });
            }
        };

        const onChangePrint = (e) => { 
            if(e.target.value) { 
                e.target.options[0].text = "Generating PDF...";
                e.target.disabled = true;
                handlePrint(e.target.value, e.target); 
            } 
        };
        if(document.getElementById('printBtnList')) document.getElementById('printBtnList').addEventListener('change', onChangePrint);
        if(document.getElementById('printBtnGrid')) document.getElementById('printBtnGrid').addEventListener('change', onChangePrint);

        function parseCSVRow(t) { const re = /(?!\s*$)\s*(?:'([^']*)'|"([^"]*)"|([^,]*))\s*(?:,|$)/g; const res = []; t.replace(re, (m, p1, p2, p3) => { res.push(p1 || p2 || p3 || ""); return ""; }); return res; }
        function parseCSVDate(s) { if (!s || !s.trim()) return null; const p = s.split('/'); if (p.length !== 3) return null; let y = p[2]; if(y.length===2) y="20"+y; return `${y}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`; }
        function sanitizeId(t) { return t.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').toLowerCase(); }

        // --- CUSTOM MODAL & SYNC LOGIC ---
        const modal = document.getElementById('customModal');
        const modalYes = document.getElementById('modalYes');
        const modalNo = document.getElementById('modalNo');
        const modalCancel = document.getElementById('modalCancel');
        const fileInput = document.getElementById('csvFileInput');

        let currentFile = null;
        let currentCSVText = null;
        let currentUploadTarget = 'activities';

        const processCSV = async (csvText, shouldWipe) => {
            const rows = csvText.split(/\r?\n/).slice(1);
            let count = 0;
            
            if (currentUploadTarget === 'activities') {
                if (shouldWipe) {
                    events = events.filter(e => e.sourceOrg !== ORGANIZATION_NAME);
                    unscheduled = unscheduled.filter(e => e.sourceOrg !== ORGANIZATION_NAME);
                }
                for (const row of rows) {
                    if (!row.trim()) continue;
                    try {
                        const cols = parseCSVRow(row);
                        const dD = parseCSVDate(cols[0]);
                        const newId = (dD ? dD + '_' : 'idea_') + sanitizeId(cols[1]||'u') + "_" + Math.floor(Math.random()*1000);
                        const newItem = {
                            id: newId, date: dD || '', name: (cols[1] || 'Unnamed').trim(),
                            cat: (cols[2] || 'social').trim().toLowerCase(), details: (cols[3] || '').trim(),
                            type: dD ? 'scheduled' : 'unscheduled', sourceOrg: ORGANIZATION_NAME
                        };
                        if (dD) events.push(newItem); else unscheduled.push(newItem);
                        count++;
                    } catch (err) { console.error(err); }
                }
            } else if (currentUploadTarget === 'lessons') {
                if (shouldWipe) {
                    lessons = lessons.filter(l => l.sourceOrg !== ORGANIZATION_NAME);
                }
                for (const row of rows) {
                    if (!row.trim()) continue;
                    try {
                        const cols = parseCSVRow(row);
                        const dD = parseCSVDate(cols[0]);
                        const newId = 'lesson_' + sanitizeId(cols[1]||'t') + "_" + Math.floor(Math.random()*1000);
                        lessons.push({
                            id: newId, date: dD || '', topic: (cols[1] || 'Sunday Lesson').trim(),
                            teacher: (cols[2] || '').trim(), notes: (cols[3] || '').trim(), sourceOrg: ORGANIZATION_NAME
                        });
                        count++;
                    } catch (err) { console.error(err); }
                }
            } else if (currentUploadTarget === 'birthdays') {
                if (shouldWipe) {
                    birthdays = birthdays.filter(b => b.org !== ORGANIZATION_NAME);
                }
                for (const row of rows) {
                    if (!row.trim()) continue;
                    try {
                        const cols = parseCSVRow(row);
                        const newId = 'bday_' + sanitizeId(cols[1]||'n') + "_" + Math.floor(Math.random()*1000);
                        
                        const bMonth = (cols[0] || 'Jan').trim();
                        const bDay = (cols[1] || '1').trim();
                        const bName = (cols[2] || 'Unnamed').trim();
                        const finalDate = bMonth + " " + bDay;
                        birthdays.push({
                            id: newId, date: finalDate, name: bName, org: ORGANIZATION_NAME
                        });
                        count++;
                    } catch (err) { console.error(err); }
                }
            } else if (currentUploadTarget === 'teachers') {
                const tBatch = writeBatch(db);
                if (shouldWipe) {
                    let currentOrg = ORGANIZATION_NAME;
                    if (currentOrg === 'YW') currentOrg = 'Young Women';
                    const q = ORGANIZATION_NAME === 'Combined' 
                        ? query(collection(db, "home_teachers"))
                        : query(collection(db, "home_teachers"), where("org", "==", currentOrg));
                    const snap = await getDocs(q);
                    snap.forEach(x => tBatch.delete(doc(db, "home_teachers", x.id)));
                }
                for (const row of rows) {
                    if (!row.trim()) continue;
                    try {
                        const cols = parseCSVRow(row);
                        const tName = (cols[0] || 'Unnamed').trim();
                        const tOrg = (cols[1] || ORGANIZATION_NAME).trim();
                        const newId = 'teacher_' + sanitizeId(tName) + "_" + Math.floor(Math.random()*10000);
                        tBatch.set(doc(db, "home_teachers", newId), { name: tName, org: tOrg });
                        count++;
                    } catch (err) { console.error(err); }
                }
                await tBatch.commit();
            }

            if (currentUploadTarget === 'teachers') {
                alert(`Loaded ${count} teachers directly into the database!`);
            } else {
                alert(`Loaded ${count} items. Review and click 'Save Changes to Database' to permanently save!`);
            }
            currentFile = null;
            if (fileInput) fileInput.value = '';
            const fl = document.getElementById('csvLessonsInput'); if(fl) fl.value = '';
            const fb = document.getElementById('csvBirthdaysInput'); if(fb) fb.value = '';
            const ft = document.getElementById('importTeachersCsvBtn'); if(ft) ft.value = '';
            
            markPending();
            refreshUI();
            
            const adminView = document.getElementById('admin-main-view');
            if (adminView && !adminView.classList.contains('hidden')) {
                adminView.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const performSync = (shouldWipe) => {
            if (currentCSVText) {
                processCSV(currentCSVText, shouldWipe);
            } else if (currentFile) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    processCSV(ev.target.result, shouldWipe);
                };
                reader.readAsText(currentFile);
            }
        };

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                currentFile = e.target.files[0];
                currentUploadTarget = 'activities';
                currentCSVText = null;
                if (currentFile) modal.classList.remove('hidden');
            });
        }
        const fileInputLessons = document.getElementById('csvLessonsInput');
        if (fileInputLessons) {
            fileInputLessons.addEventListener('change', (e) => {
                currentFile = e.target.files[0];
                currentUploadTarget = 'lessons';
                currentCSVText = null;
                if (currentFile) modal.classList.remove('hidden');
            });
        }
        const fileInputBirthdays = document.getElementById('csvBirthdaysInput');
        if (fileInputBirthdays) {
            fileInputBirthdays.addEventListener('change', (e) => {
                currentFile = e.target.files[0];
                currentUploadTarget = 'birthdays';
                currentCSVText = null;
                if (currentFile) modal.classList.remove('hidden');
            });
        }
        const fileInputTeachers = document.getElementById('importTeachersCsvBtn');
        if (fileInputTeachers) {
            fileInputTeachers.addEventListener('change', (e) => {
                currentFile = e.target.files[0];
                currentUploadTarget = 'teachers';
                currentCSVText = null;
                if (currentFile) modal.classList.remove('hidden');
            });
        }

        // --- GOOGLE DRIVE PICKER INTEGRATION ---
        let tokenClient;
        let accessToken = null;
        let apisEnabled = false;

        const googleDriveBtn = document.getElementById('googleDriveBtn');
        const driveLoading = document.getElementById('driveLoading');

        if (googleDriveBtn) {
            googleDriveBtn.classList.add('opacity-50', 'cursor-not-allowed');
            googleDriveBtn.innerText = "LOADING APIS...";
        }

        function checkApisReady() {
            googleDriveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            googleDriveBtn.innerText = "SELECT FROM GOOGLE DRIVE";
            apisEnabled = true;
        }

        function initGoogleApis() {
            if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "YOUR_API_KEY") {
                googleDriveBtn.innerText = "MISSING JS/CONFIG.JS KEYS";
                return;
            }
            gapi.load('client:picker', () => {
                gapi.client.init({ apiKey: GOOGLE_API_KEY, discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'] })
                .then(checkApisReady)
                .catch(e => { console.error("GAPI Error", e); googleDriveBtn.innerText = "API ERROR"; });
            });

            try {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/drive.readonly',
                    callback: (response) => {
                        if (response.error !== undefined) {
                            googleDriveBtn.innerText = "SELECT FROM GOOGLE DRIVE";
                            driveLoading.classList.add('hidden');
                            throw (response);
                        }
                        accessToken = response.access_token;
                        buildPicker();
                    },
                });
            } catch(e) { console.error("GIS Error", e); }
        }

        const apiCheckTimer = setInterval(() => {
            if (window.gapi && window.google) {
                clearInterval(apiCheckTimer);
                initGoogleApis();
            }
        }, 100);

        if (googleDriveBtn) {
            googleDriveBtn.addEventListener('click', () => {
                if (!apisEnabled) return;
                
                driveLoading.classList.remove('hidden');
                driveLoading.innerText = "Connecting to Google...";
                googleDriveBtn.innerText = "AUTHENTICATING...";

                if (!accessToken) {
                    tokenClient.requestAccessToken({prompt: 'consent'});
                } else {
                    buildPicker();
                }
            });
        }

        function buildPicker() {
            driveLoading.classList.add('hidden');
            googleDriveBtn.innerText = "SELECT FROM GOOGLE DRIVE";

            const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
            view.setMimeTypes('text/csv');
            view.setQuery(ORGANIZATION_NAME);

            const picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setDeveloperKey(GOOGLE_API_KEY)
                .setAppId(GOOGLE_APP_ID)
                .setOAuthToken(accessToken)
                .addView(view)
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
        }

        async function pickerCallback(data) {
            if (data.action === google.picker.Action.PICKED) {
                const docId = data.docs[0].id;
                try {
                    driveLoading.classList.remove('hidden');
                    driveLoading.innerText = "Downloading CSV...";
                    const response = await gapi.client.drive.files.get({
                        fileId: docId,
                        alt: 'media'
                    });
                    currentCSVText = response.body;
                    currentFile = null;
                    driveLoading.classList.add('hidden');
                    driveLoading.innerText = "Connecting to Google Drive...";
                    modal.classList.remove('hidden');
                } catch(e) {
                    console.error('Error fetching file', e);
                    alert("Failed to download CSV from Google Drive.");
                    driveLoading.classList.add('hidden');
                    driveLoading.innerText = "Connecting to Google Drive...";
                }
            } else if (data.action === google.picker.Action.CANCEL) {
                driveLoading.classList.add('hidden');
            }
        }

        modalYes.onclick = () => { modal.classList.add('hidden'); performSync(true); };
        modalNo.onclick = () => { modal.classList.add('hidden'); performSync(false); };
        modalCancel.onclick = () => { modal.classList.add('hidden'); fileInput.value = ''; };

        // --- ADMIN DATA EDITOR & EXPORT ---
        let pendingEdits = false;
        let isEditMode = true;
        let currentlyEditingId = null;
        let currentlyEditingLessonId = null;

        const adminToggleViewBtn = document.getElementById('adminToggleViewBtn');
        if (adminToggleViewBtn) {
            adminToggleViewBtn.addEventListener('click', () => {
                isEditMode = !isEditMode;
                adminToggleViewBtn.innerText = isEditMode ? "Preview Mode" : "Edit Mode";
                const actionCols = document.querySelectorAll('.action-col');
                actionCols.forEach(col => col.classList.toggle('hidden', !isEditMode));
                renderDataManager();
            });
        }

        function renderDataManager() {
            const list = document.getElementById('data-editor-list');
            if (!list) return;
            list.innerHTML = '';
            
            const showPast = document.getElementById('togglePastActivities') ? document.getElementById('togglePastActivities').checked : false;
            const _t = new Date();
            let nowStr = `${_t.getFullYear()}-${String(_t.getMonth() + 1).padStart(2, '0')}-${String(_t.getDate()).padStart(2, '0')}`;

            let orgData = [...events, ...unscheduled].filter(e => e.sourceOrg === ORGANIZATION_NAME);
            
            if (!showPast) {
                orgData = orgData.filter(e => e.type !== 'scheduled' || !e.date || e.date >= nowStr);
            }

            orgData.sort((a,b) => {
                if(a.type==='scheduled'&&b.type==='scheduled') return new Date(a.date)-new Date(b.date);
                if(a.type==='scheduled') return -1;
                return b.type==='scheduled' ? 1 : 0;
            });
            if (orgData.length === 0) { list.innerHTML = `<div class="p-8 text-[11px] text-slate-500 italic text-center w-full bg-slate-800/30 rounded-xl border border-slate-800/50">No data natively tracked on ${ORGANIZATION_NAME} yet. Add a row or import CSV to begin.</div>`; return; }
            
            orgData.forEach((item) => {
                const tr = document.createElement('div');
                tr.className = "flex flex-col md:flex-row items-start md:items-center gap-2 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:bg-slate-800/50 transition group w-full";
                
                let displayDate = '';
                let formInputDate = '';
                if (item.type === 'scheduled' && item.date) {
                    const [y, m, d] = item.date.split('-');
                    displayDate = `${m}/${d}/${y.substring(2)}`;
                    formInputDate = item.date;
                }
                
                const isWriting = currentlyEditingId === item.id;
                
                if (isWriting) {
                    tr.classList.add('bg-slate-800/80');
                    tr.classList.remove('hover:bg-slate-800/50');
                    tr.innerHTML = `
                        <div class="w-full md:w-auto shrink-0"><input type="date" class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-full md:w-[140px] border border-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none h-[45px] max-h-[45px] date-input text-xs font-mono [color-scheme:dark]" value="${formInputDate}"></div>
                        <div class="flex-1 w-full">
                            <input type="text" class="bg-slate-900 text-white rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] name-input text-xs font-bold mb-2" placeholder="Activity" value="${String(item.name||'').replace(/"/g, '&quot;')}">
                            <label class="flex items-center gap-2 cursor-pointer text-[10px] uppercase font-bold text-slate-400"><input type="checkbox" class="service-input w-3 h-3 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500" ${item.isService ? 'checked' : ''}> Is Service Project?</label>
                        </div>
                        <div class="w-full md:w-auto shrink-0"><select class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-full md:w-[120px] border border-blue-500 outline-none h-[45px] max-h-[45px] cat-input text-[10px] uppercase font-bold tracking-wider cursor-pointer">
                            <option value="social" ${item.cat==='social'?'selected':''}>Social</option>
                            <option value="physical" ${item.cat==='physical'?'selected':''}>Physical</option>
                            <option value="spiritual" ${item.cat==='spiritual'?'selected':''}>Spiritual</option>
                            <option value="intellectual" ${item.cat==='intellectual'?'selected':''}>Intellectual</option>
                            <option value="combined" ${item.cat==='combined'?'selected':''}>Combined</option>
                        </select></div>
                        <div class="flex-1 w-full md:w-auto"><input type="text" class="bg-slate-900 text-slate-400 rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] details-input text-[11px]" placeholder="Details" value="${String(item.details||'').replace(/"/g, '&quot;')}"></div>
                        <div class="w-full md:w-auto flex justify-end shrink-0 action-col ${!isEditMode?'hidden':''}">
                            <div class="flex gap-2">
                                <button class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all save-btn shadow-lg" title="Save Row">✓</button>
                                <button class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all cancel-btn" title="Cancel">✕</button>
                            </div>
                        </div>
                    `;
                    
                    const performSave = () => {
                        const newDate = tr.querySelector('.date-input').value.trim();
                        item.name = tr.querySelector('.name-input').value.trim() || 'Unnamed';
                        item.isService = tr.querySelector('.service-input').checked;
                        item.cat = tr.querySelector('.cat-input').value.toLowerCase();
                        item.details = tr.querySelector('.details-input').value.trim();
                        
                        events = events.filter(e => e.id !== item.id);
                        unscheduled = unscheduled.filter(e => e.id !== item.id);
                        
                        if (newDate) {
                            item.date = newDate; item.type = 'scheduled'; events.push(item);
                        } else {
                            item.date = ''; item.type = 'unscheduled'; unscheduled.push(item);
                        }
                        
                        currentlyEditingId = null;
                           renderDataManager(); 
                        markPending(); 
                    };

                    tr.querySelector('.save-btn').addEventListener('click', performSave);
                    tr.querySelectorAll('input, select').forEach(inp => inp.addEventListener('keydown', (ek) => {
                        if(ek.key === 'Enter') performSave();
                        if(ek.key === 'Escape') { currentlyEditingId = null; renderDataManager(); }
                    }));
                    tr.querySelector('.cancel-btn').addEventListener('click', () => { currentlyEditingId = null; renderDataManager(); });
                } else {
                    tr.innerHTML = `
                        <div class="w-full md:w-[120px] shrink-0 text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition">${displayDate||'<span class="opacity-30">N/A</span>'}</div>
                        <div class="flex-1 w-full text-sm font-bold text-white group-hover:text-blue-400 transition truncate"><span class="truncate max-w-[200px] lg:max-w-none inline-block align-middle" title="${String(item.name||'').replace(/"/g,'&quot;')}">${item.name}</span>${item.isService ? '<span class="text-yellow-400 ml-2 text-[10px] inline-block align-middle drop-shadow-sm" title="Service Project">★</span>' : ''}</div>
                        <div class="w-full md:w-auto shrink-0">
                            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest bg-slate-800 text-slate-300 border border-slate-700">
                                <span class="w-1.5 h-1.5 rounded-full dot-${item.cat}"></span>${item.cat}
                            </span>
                        </div>
                        <div class="flex-1 w-full text-[11px] text-slate-400 group-hover:text-slate-200 transition truncate"><span class="truncate block max-w-[200px] lg:max-w-xs" title="${String(item.details||'').replace(/"/g,'&quot;')}">${item.details||'<span class="opacity-30">None</span>'}</span></div>
                        <div class="w-full md:w-auto flex justify-end shrink-0 action-col ${!isEditMode?'hidden':''}">
                            <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors edit-btn text-sm" title="Edit Row">✎</button>
                                <button class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors del-btn text-sm" title="Delete Row">🗑</button>
                            </div>
                        </div>
                    `;
                    tr.querySelector('.edit-btn')?.addEventListener('click', () => {
                        currentlyEditingId = item.id; renderDataManager();
                        setTimeout(() => { const activeInp = document.querySelector('.name-input'); if(activeInp) activeInp.focus(); }, 50);
                    });
                    tr.querySelector('.del-btn')?.addEventListener('click', () => {
                        events = events.filter(e => e.id !== item.id);
                        unscheduled = unscheduled.filter(e => e.id !== item.id);
                           renderDataManager(); markPending();
                    });
                    tr.addEventListener('dblclick', (e) => {
                        if(isEditMode && !e.target.closest('button')) { currentlyEditingId = item.id; renderDataManager(); }
                    });
                }
                list.appendChild(tr);
            });
        }

        function renderLessonManager() {
            const list = document.getElementById('lesson-schedule-data');
            if (!list) return;
            try {
                list.innerHTML = '';
                
                const showPast = document.getElementById('togglePastLessons') ? document.getElementById('togglePastLessons').checked : false;
                const _t = new Date();
                let nowStr = `${_t.getFullYear()}-${String(_t.getMonth() + 1).padStart(2, '0')}-${String(_t.getDate()).padStart(2, '0')}`;
    
                let orgLessons = lessons.filter(e => e.sourceOrg === ORGANIZATION_NAME);
                if (!showPast) {
                    orgLessons = orgLessons.filter(e => !e.date || e.date >= nowStr);
                }
    
                orgLessons.sort((a,b) => new Date(a.date) - new Date(b.date));
                if (orgLessons.length === 0) { list.innerHTML = `<p class="p-8 text-[11px] text-slate-500 italic text-center">No lessons configured. Add a lesson row to begin tracking curriculum.</p>`; return; }
            
            orgLessons.forEach((item) => {
                const tr = document.createElement('div');
                tr.className = "hover:bg-slate-50 transition group";
                
                let displayDate = '';
                let formInputDate = '';
                if (item.date) {
                    const [y, m, d] = item.date.split('-');
                    displayDate = `${m}/${d}/${y.substring(2)}`;
                    formInputDate = item.date;
                }
                
                const isWriting = currentlyEditingLessonId === item.id;
                
                if (isWriting) {
                    tr.className = "bg-slate-800/80 p-4 border-b border-slate-800/50 w-full";
                    tr.innerHTML = `
                        <div class="w-full">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                                <input type="date" class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-[140px] shrink-0 border border-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] l-date-input text-xs font-mono [color-scheme:dark]" value="${formInputDate}">
                                <input type="text" class="bg-slate-900 text-white rounded-lg px-3 py-2 border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] l-topic-input text-xs font-bold md:col-span-2" placeholder="Lesson Topic" value="${String(item.topic||'').replace(/"/g, '&quot;')}">
                                <select class="bg-slate-900 text-slate-300 rounded-lg px-3 py-2 border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] l-teacher-input text-[10px] uppercase font-bold tracking-wider cursor-pointer">
                                    <option value="">Teacher Name</option>
                                    ${fullOrgTeachers.map(t => `<option value="${t.name}" ${item.teacher === t.name ? 'selected' : ''}>${t.name} (${t.org})</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex gap-3 items-start">
                                <textarea class="bg-slate-900 text-slate-400 rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none l-notes-input text-[11px] min-h-[60px]" placeholder="Notes (Links, Reminders)">${String(item.notes||'').replace(/</g, '&lt;')}</textarea>
                                <div class="flex flex-col gap-2 shrink-0 action-col ${!isEditMode?'hidden':''}">
                                    <button class="text-emerald-400 hover:text-white hover:bg-emerald-600 bg-emerald-900/40 rounded-lg w-8 h-8 flex items-center justify-center transition-all l-save-btn shadow-sm" title="Save Row">✓</button>
                                    <button class="text-slate-400 hover:text-white hover:bg-slate-600 bg-slate-700/50 rounded-lg w-8 h-8 flex items-center justify-center transition-all l-cancel-btn" title="Cancel">✕</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    setTimeout(() => {
                        const dateInput = tr.querySelector('.l-date-input');
                        const topicInput = tr.querySelector('.l-topic-input');
                        if (dateInput && topicInput) {
                            dateInput.addEventListener('change', (e) => {
                                const matched = CFM_LOOKUP[e.target.value];
                                if (matched) topicInput.value = matched;
                            });
                        }
                    }, 0);
                    
                    const performSave = () => {
                        const newDate = tr.querySelector('.l-date-input').value.trim();
                        item.topic = tr.querySelector('.l-topic-input').value.trim() || 'Sunday Lesson';
                        item.teacher = tr.querySelector('.l-teacher-input').value.trim() || '';
                        item.notes = tr.querySelector('.l-notes-input').value.trim() || '';
                        
                        lessons = lessons.filter(e => e.id !== item.id);
                        item.date = newDate; lessons.push(item);
                        
                        currentlyEditingLessonId = null;
                          renderLessonManager(); 
                        markPending(); 
                    };

                    tr.querySelector('.l-save-btn').addEventListener('click', performSave);
                    tr.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', (ek) => {
                        if(ek.key === 'Enter') performSave();
                        if(ek.key === 'Escape') { currentlyEditingLessonId = null; renderLessonManager(); }
                    }));
                    tr.querySelector('.l-cancel-btn').addEventListener('click', () => { currentlyEditingLessonId = null; renderLessonManager(); });
                } else {
                    tr.className = "flex justify-between items-center p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition group w-full";
                    tr.innerHTML = `
                        <div class="flex items-center gap-4 flex-1">
                            <span class="w-[100px] md:w-[120px] shrink-0 text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition">${displayDate||'<span class="opacity-30">N/A</span>'}</span>
                            <div class="flex flex-col flex-1 truncate">
                                <span class="font-bold text-sm text-white group-hover:text-blue-400 transition truncate" title="${String(item.topic||'').replace(/"/g,'&quot;')}">${item.topic || 'Sunday Lesson'}</span>
                                <span class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">${item.teacher || 'Unassigned'}</span>
                                ${item.notes ? `<span class="text-[11px] text-slate-400 group-hover:text-slate-200 transition truncate max-w-full mt-1 block" title="${String(item.notes||'').replace(/"/g,'&quot;')}">${item.notes}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="flex gap-2 action-col ${!isEditMode?'hidden':''}">
                                <button class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors l-edit-btn text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Edit Row">✎</button>
                                <button class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors l-del-btn text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Delete Row">🗑</button>
                            </div>
                        </div>
                    `;
                    tr.querySelector('.l-edit-btn')?.addEventListener('click', () => {
                        currentlyEditingLessonId = item.id; renderLessonManager();
                        setTimeout(() => { const activeInp = document.querySelector('.l-topic-input'); if(activeInp) activeInp.focus(); }, 50);
                    });
                    tr.querySelector('.l-del-btn')?.addEventListener('click', () => {
                        lessons = lessons.filter(e => e.id !== item.id);
                          renderLessonManager(); markPending();
                    });
                    tr.addEventListener('dblclick', (e) => {
                        if(isEditMode && !e.target.closest('button')) { currentlyEditingLessonId = item.id; renderLessonManager(); }
                    });
                }
                list.appendChild(tr);
            });
            } catch (err) {
                list.innerHTML = `<p class="p-8 text-red-500 font-bold text-center">Diagnostic Error (Lessons): ${err.message}<br><span class="text-xs font-mono">${err.stack}</span></p>`;
                console.error("Diagnostic Error in renderLessonManager:", err);
            }
        }

        function markPending() {
            pendingEdits = true;
            const btns = document.querySelectorAll('.sync-firebase-btn');
            btns.forEach(btn => {
                btn.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-slate-900');
                btn.innerHTML = `<svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> <span>Save Changes*</span>`;
            });
        }

        const addNewRowBtn = document.getElementById('addNewRowBtn');
        if (addNewRowBtn) {
            addNewRowBtn.addEventListener('click', () => {
                const newId = 'idealoc_' + Math.random().toString(36).substr(2, 9);
                unscheduled.push({ id: newId, date: '', name: '', cat: 'social', details: '', type: 'unscheduled', sourceOrg: ORGANIZATION_NAME, isService: false });
                currentlyEditingId = newId;
                markPending(); refreshUI();
                setTimeout(() => {
                    const newRowInp = document.querySelector('input.name-input');
                    if(newRowInp) { newRowInp.scrollIntoView({behavior:'smooth', block: 'center'}); newRowInp.focus(); }
                }, 50);
            });
        }

        const spawnNewLesson = () => {
            const newId = 'lessonloc_' + Math.random().toString(36).substr(2, 9);
            lessons.push({ id: newId, date: '', topic: '', teacher: '', sourceOrg: ORGANIZATION_NAME });
            currentlyEditingLessonId = newId;
            markPending(); refreshUI();
            setTimeout(() => {
                const newRowInp = document.querySelector('input.l-date-input');
                if(newRowInp) { newRowInp.scrollIntoView({behavior:'smooth', block: 'center'}); newRowInp.focus(); }
            }, 50);
        };
        const btn1 = document.getElementById('addLessonBtn');
        if(btn1) btn1.addEventListener('click', spawnNewLesson);
        const btn2 = document.getElementById('addNewLessonHeaderBtn');
        if(btn2) btn2.addEventListener('click', spawnNewLesson);

        let currentlyEditingBirthdayId = null;

        function renderBirthdayManager() {
            const list = document.getElementById('admin-birthdays-list');
            if (!list) return;
            try {
                list.innerHTML = '';
                
                const parseBday = (dStr) => {
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

                const orgBirthdays = birthdays.filter(b => b.org === ORGANIZATION_NAME).sort((a,b) => {
                    return parseBday(a.date).val - parseBday(b.date).val;
                });
                
                if (orgBirthdays.length === 0) { list.innerHTML = `<p class="p-8 text-[11px] text-slate-500 italic text-center">No birthdays tracked for ${ORGANIZATION_NAME} yet.</p>`; return; }
            
            orgBirthdays.forEach((item) => {
                const tr = document.createElement('div');
                tr.className = "hover:bg-slate-800/30 transition group rounded-lg mb-2";
                
                const parsedDateInfo = parseBday(item.date);
                let displayDate = item.date ? `${parsedDateInfo.m} ${parsedDateInfo.d}` : '';
                
                const isWriting = currentlyEditingBirthdayId === item.id;
                
                if (isWriting) {
                    const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const mOptions = mNames.map(m => `<option value="${m}" ${parsedDateInfo.m===m?'selected':''}>${m}</option>`).join('');

                    tr.className = "bg-slate-800/80 p-4 border-b border-slate-800/50 w-full";
                    tr.innerHTML = `
                        <div class="flex gap-4 items-center">
                            <div class="flex gap-1 shrink-0">
                                <select class="b-month-select bg-slate-900 text-slate-300 rounded-lg px-2 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-mono">${mOptions}</select>
                                <select class="b-day-select bg-slate-900 text-slate-300 rounded-lg px-2 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-mono w-[60px]"></select>
                            </div>
                            <input type="text" class="bg-slate-900 text-white rounded-lg px-3 py-2 flex-1 border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-bold" placeholder="Name" value="${String(item.name||'').replace(/"/g, '&quot;')}">
                            <div class="flex gap-2 shrink-0 action-col">
                                <button class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all b-save-btn shadow-lg" title="Save Row">✓</button>
                                <button class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all b-cancel-btn" title="Cancel">✕</button>
                            </div>
                        </div>
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
                    
                    const performSave = () => {
                        item.date = mSel.value + " " + dSel.value;
                        item.name = tr.querySelector('input[type="text"]').value.trim() || 'Unnamed';
                        item.org = ORGANIZATION_NAME;
                        
                        birthdays = birthdays.filter(b => b.id !== item.id);
                        birthdays.push(item);
                        
                        currentlyEditingBirthdayId = null;
                        renderBirthdayManager(); 
                        markPending(); 
                    };

                    tr.querySelector('.b-save-btn').addEventListener('click', performSave);
                    tr.querySelectorAll('input, select').forEach(inp => inp.addEventListener('keydown', (ek) => {
                        if(ek.key === 'Enter') performSave();
                        if(ek.key === 'Escape') { currentlyEditingBirthdayId = null; renderBirthdayManager(); }
                    }));
                    tr.querySelector('.b-cancel-btn').addEventListener('click', () => { currentlyEditingBirthdayId = null; renderBirthdayManager(); });
                } else {
                    tr.className = "flex justify-between items-center p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition group w-full";
                    tr.innerHTML = `
                        <div class="flex items-center gap-4 flex-1">
                            <span class="w-[100px] md:w-[120px] shrink-0 text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition">${displayDate||'<span class="opacity-30">N/A</span>'}</span>
                            <span class="font-bold text-sm text-white group-hover:text-blue-400 transition truncate flex-1" title="${String(item.name||'').replace(/"/g,'&quot;')}">${item.name || 'Unnamed'}</span>
                        </div>
                        <div class="flex items-center">
                            <div class="flex gap-2 action-col ${!isEditMode?'hidden':''}">
                                <button class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors b-edit-btn text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Edit Row">✎</button>
                                <button class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors b-del-btn text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Delete Row">🗑</button>
                            </div>
                        </div>
                    `;
                    tr.querySelector('.b-edit-btn')?.addEventListener('click', () => {
                        currentlyEditingBirthdayId = item.id; renderBirthdayManager();
                        setTimeout(() => { const activeInp = document.querySelector('.b-save-btn').parentElement.parentElement.querySelector('input'); if(activeInp) activeInp.focus(); }, 50);
                    });
                    tr.querySelector('.b-del-btn')?.addEventListener('click', () => {
                        birthdays = birthdays.filter(b => b.id !== item.id);
                        renderBirthdayManager(); markPending();
                    });
                    tr.addEventListener('dblclick', (e) => {
                        if(isEditMode && !e.target.closest('button')) { currentlyEditingBirthdayId = item.id; renderBirthdayManager(); }
                    });
                }
                list.appendChild(tr);
            });
            } catch (err) {
                list.innerHTML = `<p class="p-8 text-red-500 font-bold text-center">Diagnostic Error (Birthdays): ${err.message}<br><span class="text-xs font-mono">${err.stack}</span></p>`;
                console.error("Diagnostic Error in renderBirthdayManager:", err);
            }
        }
        window.renderBirthdayManager = renderBirthdayManager;

        const spawnNewBirthday = () => {
            const newId = 'bdayloc_' + Math.random().toString(36).substr(2, 9);
            birthdays.push({ id: newId, date: '', name: '', org: ORGANIZATION_NAME });
            currentlyEditingBirthdayId = newId;
            markPending(); refreshUI();
            setTimeout(() => {
                const newRowInp = document.querySelector('#admin-birthdays-list input[type="text"]');
                if(newRowInp) { newRowInp.scrollIntoView({behavior:'smooth', block: 'center'}); newRowInp.focus(); }
            }, 50);
        };
        const addBirthdayBtn = document.getElementById('addBirthdayBtn');
        if(addBirthdayBtn) addBirthdayBtn.addEventListener('click', spawnNewBirthday);

        const togglePastAct = document.getElementById('togglePastActivities');
        if (togglePastAct) togglePastAct.addEventListener('change', renderDataManager);
        const togglePastLes = document.getElementById('togglePastLessons');
        if (togglePastLes) togglePastLes.addEventListener('change', renderLessonManager);

        const syncFirebaseBtns = document.querySelectorAll('.sync-firebase-btn');
        syncFirebaseBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!window.currentUserRole) return;
                if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !window.DEBUG_MODE) {
                    alert('Production Data Integrity Guard: Firestore Sync is disabled on localhost.\n\nPlease use the Firebase Emulator for local data testing, or explicitly set window.DEBUG_MODE = true in the developer console to override.');
                    return;
                }
                syncFirebaseBtns.forEach(b => {
                    b.innerHTML = `<span class="animate-pulse flex items-center gap-2"><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</span>`; 
                    b.disabled = true;
                });
                try {
                    const batch = writeBatch(db);
                    const dbOrg = ORGANIZATION_NAME === 'Young Women' ? 'YW' : ORGANIZATION_NAME;
                    const s = await getDocs(collection(db, `${dbOrg}_events`));
                    s.forEach(x => batch.delete(doc(db, `${dbOrg}_events`, x.id)));
                    
                    const orgData = [...events, ...unscheduled].filter(e => e.sourceOrg === ORGANIZATION_NAME);
                    orgData.forEach(item => {
                        let safeId = item.id;
                        if (!safeId || safeId.includes('idealoc_')) safeId = (item.date ? item.date + '_' : 'idea_') + sanitizeId(item.name || 'unknown') + "_" + Math.floor(Math.random()*1000);
                        batch.set(doc(db, `${dbOrg}_events`, safeId), { date: item.date || '', name: item.name || '', cat: item.cat || 'social', details: item.details || '', type: item.type || 'scheduled', isService: item.isService || false });
                    });
                    
                    const lSnap = await getDocs(collection(db, `${dbOrg}_lessons`));
                    lSnap.forEach(x => batch.delete(doc(db, `${dbOrg}_lessons`, x.id)));
                    
                    const orgLessons = lessons.filter(l => l.sourceOrg === ORGANIZATION_NAME);
                    orgLessons.forEach(item => {
                        let safeId = item.id;
                        if (!safeId || safeId.includes('lessonloc_')) safeId = 'lesson_' + sanitizeId(item.topic || 'unknown') + "_" + Math.floor(Math.random()*1000);
                        batch.set(doc(db, `${dbOrg}_lessons`, safeId), { date: item.date || '', topic: item.topic || '', teacher: item.teacher || '', notes: item.notes || '' });
                    });

                    const bSnap = await getDocs(query(collection(db, "birthdays"), where("org", "==", ORGANIZATION_NAME)));
                    bSnap.forEach(x => batch.delete(doc(db, "birthdays", x.id)));

                    const orgBirthdays = birthdays.filter(b => b.org === ORGANIZATION_NAME);
                    orgBirthdays.forEach(item => {
                        let safeId = item.id;
                        if (!safeId || safeId.includes('bdayloc_')) safeId = 'bday_' + sanitizeId(item.name || 'unknown') + "_" + Math.floor(Math.random()*1000);
                        batch.set(doc(db, "birthdays", safeId), { date: item.date || '', name: item.name || '', org: item.org || '' });
                    });
                    
                    await batch.commit();
                    
                    syncFirebaseBtns.forEach(b => {
                        b.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2', 'ring-offset-slate-900', 'bg-blue-600', 'hover:bg-blue-500');
                        b.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
                        b.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <span>Saved!</span>`;
                    });
                    
                    const toast = document.getElementById('toast');
                    if (toast) toast.classList.remove('hidden');
                    
                    setTimeout(() => { 
                        syncFirebaseBtns.forEach(b => {
                            b.classList.add('bg-blue-600', 'hover:bg-blue-500');
                            b.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
                            b.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> <span>Save Changes</span>`; 
                            b.disabled = false; 
                        });
                        pendingEdits = false; 
                        if (toast) toast.classList.add('hidden');
                    }, 3000);
                } catch(e) { 
                    console.error("Batch error", e); 
                    syncFirebaseBtns.forEach(b => {
                        b.innerText = "ERROR"; 
                        b.disabled = false; 
                    });
                }
            });
        });

        function generateSymmetricCSV(type = 'activities') {
            let csvContent = "";
            let filename = `2026_${ORGANIZATION_NAME}_Backup.csv`;
            
            if (type === 'activities') {
                csvContent = "Date,Name,Category,Details\n";
                const orgData = [...events, ...unscheduled].filter(e => e.sourceOrg === ORGANIZATION_NAME).sort((a,b) => {
                    if(a.type==='scheduled'&&b.type==='scheduled') return new Date(a.date)-new Date(b.date);
                    if(a.type==='scheduled') return -1;
                    return b.type==='scheduled' ? 1 : 0;
                });
                orgData.forEach(e => {
                    let formattedDate = '';
                    if (e.type === 'scheduled' && e.date) {
                        const [y, m, d] = e.date.split('-');
                        formattedDate = `${m}/${d}/${y.substring(2)}`;
                    }
                    const safeName = `"${(e.name||'').replace(/"/g, '""')}"`;
                    const safeCat = `"${(e.cat||'').replace(/"/g, '""')}"`;
                    const safeDetails = `"${(e.details||'').replace(/"/g, '""')}"`;
                    csvContent += `${formattedDate},${safeName},${safeCat},${safeDetails}\n`;
                });
            } else if (type === 'lessons') {
                csvContent = "Date,Topic,Teacher,Notes\n";
                filename = `2026_${ORGANIZATION_NAME}_Lessons.csv`;
                const orgLessons = lessons.filter(l => l.sourceOrg === ORGANIZATION_NAME).sort((a,b) => new Date(a.date) - new Date(b.date));
                orgLessons.forEach(l => {
                    let formattedDate = '';
                    if (l.date) {
                        const [y, m, d] = l.date.split('-');
                        formattedDate = `${m}/${d}/${y.substring(2)}`;
                    }
                    const safeTopic = `"${(l.topic||'').replace(/"/g, '""')}"`;
                    const safeTeacher = `"${(l.teacher||'').replace(/"/g, '""')}"`;
                    const safeNotes = `"${(l.notes||'').replace(/"/g, '""')}"`;
                    csvContent += `${formattedDate},${safeTopic},${safeTeacher},${safeNotes}\n`;
                });
            } else if (type === 'birthdays') {
                csvContent = "Month,Day,Name\n";
                filename = `2026_${ORGANIZATION_NAME}_Birthdays.csv`;
                
                const parseBdayExport = (dStr) => {
                    if (!dStr) return { val: 9999 };
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
                    return { val: (mOrd[pm]||12)*100 + parseInt(pd) };
                };

                const orgBirthdays = birthdays.filter(b => b.org === ORGANIZATION_NAME).sort((a,b) => {
                    return parseBdayExport(a.date).val - parseBdayExport(b.date).val;
                });
                orgBirthdays.forEach(b => {
                    let bMonth = "Jan", bDay = "1";
                    if (b.date && b.date.includes(' ')) {
                        const parts = b.date.split(' ');
                        bMonth = parts[0];
                        bDay = parts[1];
                    }
                    const safeName = `"${(b.name||'').replace(/"/g, '""')}"`;
                    csvContent += `${bMonth},${bDay},${safeName}\n`;
                });
            } else if (type === 'teachers') {
                csvContent = "Name,Organization\n";
                filename = `2026_${ORGANIZATION_NAME}_Teachers.csv`;
                fullOrgTeachers.forEach(t => {
                    const safeName = `"${(t.name||'').replace(/"/g, '""')}"`;
                    const safeOrg = `"${(t.org||'').replace(/"/g, '""')}"`;
                    csvContent += `${safeName},${safeOrg}\n`;
                });
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }
        if(document.getElementById('exportCsvBtn')) document.getElementById('exportCsvBtn').addEventListener('click', () => generateSymmetricCSV('activities'));
        if(document.getElementById('exportLessonsCsvBtn')) document.getElementById('exportLessonsCsvBtn').addEventListener('click', () => generateSymmetricCSV('lessons'));
        if(document.getElementById('exportBirthdaysCsvBtn')) document.getElementById('exportBirthdaysCsvBtn').addEventListener('click', () => generateSymmetricCSV('birthdays'));
        if(document.getElementById('exportTeachersCsvBtn')) document.getElementById('exportTeachersCsvBtn').addEventListener('click', () => generateSymmetricCSV('teachers'));

        // ADMIN BUTTONS
        let isAdminMode = false;
        const unlockBtn = document.getElementById('unlockBtn');
        if (unlockBtn) {
            unlockBtn.onclick = () => {
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordModal').classList.remove('hidden');
                setTimeout(() => document.getElementById('passwordInput').focus(), 50);
            };
        }
        
        const passwordCancelBtn = document.getElementById('passwordCancelBtn');
        if (passwordCancelBtn) {
            passwordCancelBtn.onclick = () => {
                document.getElementById('passwordModal').classList.add('hidden');
                document.getElementById('passwordInput').value = '';
            };
        }
        
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') document.getElementById('passwordSubmitBtn').click();
                if(e.key === 'Escape') document.getElementById('passwordCancelBtn').click();
            });
        }

        const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
        if (passwordSubmitBtn) {
            passwordSubmitBtn.onclick = async () => {
                const p = document.getElementById('passwordInput').value;
                if (!p) return;
                
                const btn = document.getElementById('passwordSubmitBtn');
                const originalText = btn.innerText;
                btn.innerText = 'VERIFYING...';
                btn.disabled = true;
                
                const passwordModal = document.getElementById('passwordModal');
                if (passwordModal) passwordModal.classList.add('hidden');
                btn.innerText = originalText;
                btn.disabled = false;
                
                const suppliedPass = await hashInput(p);
                const pageKey = ORGANIZATION_NAME.toUpperCase();
                if (suppliedPass === SECURE_AUTH_HASHES.MASTER || suppliedPass === SECURE_AUTH_HASHES[pageKey]) {
                    isAdminMode = true;
                    const importGate = document.getElementById('import-gate');
                    if (importGate) importGate.classList.add('hidden');
                    const importControls = document.getElementById('import-controls');
                    if (importControls) importControls.classList.remove('hidden');
                    
                    const gridControls = document.getElementById('grid-controls-wrapper');
                    if (gridControls) gridControls.classList.add('hidden');
                    const activeMonths = document.getElementById('active-months');
                    if (activeMonths) activeMonths.classList.add('hidden');
                    const listView = document.getElementById('list-view');
                    if (listView) listView.classList.add('hidden');
                    if(document.getElementById('viewToggleBtn')) document.getElementById('viewToggleBtn').parentElement.classList.add('hidden');
                    
                    const adminMainView = document.getElementById('admin-main-view');
                    if (adminMainView) {
                        adminMainView.classList.remove('hidden');
                        adminMainView.classList.add('flex');
                    }
                    
                    renderDataManager();
                    renderLessonManager();
                } else if (p) {
                    renderDataManager();
                }
            };
        }
        const lockBtn = document.getElementById('lockBtn');
        if (lockBtn) {
            lockBtn.onclick = () => {
                isAdminMode = false;
                const importGate = document.getElementById('import-gate');
                if (importGate) importGate.classList.remove('hidden');
                const importControls = document.getElementById('import-controls');
                if (importControls) importControls.classList.add('hidden');
                
                const adminMainView = document.getElementById('admin-main-view');
                if (adminMainView) {
                    adminMainView.classList.add('hidden');
                    adminMainView.classList.remove('flex');
                }
                
                if(document.getElementById('viewToggleBtn')) document.getElementById('viewToggleBtn').parentElement.classList.remove('hidden');
                const gridControls = document.getElementById('grid-controls-wrapper');
                if (gridControls) gridControls.classList.toggle('hidden', isListView);
                const activeMonths = document.getElementById('active-months');
                if (activeMonths) activeMonths.classList.toggle('hidden', isListView);
                const listView = document.getElementById('list-view');
                if (listView) listView.classList.toggle('hidden', !isListView);
            };
        }
        // Danger Zone wiped        initApp();
    

window.setupRBAC = function() {
    const tabs = document.querySelectorAll('.nav-tab');
    const userRole = window.currentUserRole || 'Admin';

    const navAnn = document.getElementById('nav-announcements');
    const navSpot = document.getElementById('nav-spotlights');
    const navTeach = document.getElementById('nav-teachers');
    const navLead = document.getElementById('nav-leaders');
    const navTheme = document.getElementById('nav-theme');
    const teachersCsvGroup = document.getElementById('teachersCsvGroup');

    if (userRole === 'Admin') {
        tabs.forEach(t => t.classList.remove('hidden'));
        const activitiesTab = document.querySelector('[data-target="activities-section"]');
        if (activitiesTab) activitiesTab.classList.remove('hidden');
        const birthdaysTab = document.querySelector('[data-target="birthdays-section"]');
        if (birthdaysTab) birthdaysTab.classList.remove('hidden');
        const lessonsTab = document.querySelector('[data-target="lessons-manager"]');
        if (lessonsTab) lessonsTab.classList.remove('hidden');

        if (navAnn) navAnn.classList.remove('hidden');
        if (navSpot) navSpot.classList.remove('hidden');
        if (navTeach) navTeach.classList.remove('hidden');
        if (navLead) navLead.classList.remove('hidden');
        if (navTheme) navTheme.classList.remove('hidden');
        if (teachersCsvGroup) teachersCsvGroup.classList.remove('hidden');
    } else {
        if (navAnn) navAnn.classList.add('hidden');
        if (navLead) navLead.classList.add('hidden');
        if (navTheme) navTheme.classList.add('hidden');
        if (navSpot) navSpot.classList.remove('hidden');
        if (navTeach) navTeach.classList.remove('hidden');
        if (teachersCsvGroup) teachersCsvGroup.classList.add('hidden');
        if (navSpot) navSpot.click();
    }

    if (userRole !== 'Admin') {
        // Hide all tabs except the user's role
        tabs.forEach(t => {
            if (t.dataset.org !== userRole && !(userRole === 'Combined' && t.dataset.org === 'Combined')) {
                t.classList.add('hidden');
            } else {
                t.classList.remove('hidden');
            }
        });
        const st = document.getElementById('settings-tab');
        if (st) st.classList.remove('hidden');
        
        // Enforce Teachers RBAC Filter
        if (userRole === 'Teachers') {
            const activitiesTab = document.querySelector('[data-target="activities-section"]');
            if (activitiesTab) activitiesTab.classList.add('hidden');
            const birthdaysTab = document.querySelector('[data-target="birthdays-section"]');
            if (birthdaysTab) birthdaysTab.classList.add('hidden');
            const lessonsTab = document.querySelector('[data-target="lessons-manager"]');
            if (lessonsTab) lessonsTab.click();
        }
        
        switchOrg(userRole);
    } else {
        const st = document.getElementById('settings-tab');
        if (st) st.classList.remove('hidden');
        switchOrg('Combined');
    }
};

if (window.currentUserRole) {
    window.setupRBAC();
}

document.querySelectorAll('.nav-tab').forEach(t => {
    t.addEventListener('click', () => {
        switchOrg(t.dataset.org);
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('text-white', 'bg-slate-800/50'));
        t.classList.add('text-white', 'bg-slate-800/50');
        
        // Auto-close mobile sidebar
        const sidebar = document.getElementById('admin-sidebar');
        if (sidebar) sidebar.classList.add('-translate-x-full');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Setup Mobile Sidebar Toggles
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('admin-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
        });
    }
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }

    document.querySelectorAll('.dash-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.dash-tab').forEach(t => {
                t.classList.remove('active', 'border-blue-500', 'text-blue-400');
                t.classList.add('border-transparent', 'text-slate-500');
            });
            e.currentTarget.classList.remove('border-transparent', 'text-slate-500');
            e.currentTarget.classList.add('active', 'border-blue-500', 'text-blue-400');
            
            const targetId = e.currentTarget.getAttribute('data-target');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.add('hidden');
                pane.classList.remove('active');
            });
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                targetPane.classList.add('active');
            }
        });
    });
});

const settingsTab = document.getElementById('settings-tab');
if (settingsTab) {
    settingsTab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        settingsTab.classList.add('active');
        
        const titleEl = document.getElementById('active-org-title');
        if (titleEl) titleEl.innerText = 'System Settings';
        
        const dashboard = document.getElementById('admin-dashboard');
        if (dashboard) dashboard.classList.add('hidden');
        
        const sysSettings = document.getElementById('system-settings-container');
        if (sysSettings) sysSettings.classList.remove('hidden');
        
        const dashTabs = document.getElementById('dashboard-tabs');
        if (dashTabs) dashTabs.classList.add('hidden');
        
        loadAnnouncements();
        loadSpotlights();
        loadLeaders();
        loadTheme();
    });
}

// Centralized handleLogout handles logoutBtn below

function switchOrg(org) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const st = document.getElementById('settings-tab');
    if (st) st.classList.remove('active');
    
    const activeTab = Array.from(document.querySelectorAll('.nav-tab')).find(t => t.dataset.org === org);
    if (activeTab) activeTab.classList.add('active');
    
    const lessonsTab = document.querySelector('.dash-tab[data-target="lessons-manager"]');
    const birthdaysTab = document.querySelector('.dash-tab[data-target="birthdays-section"]');
    const activitiesTab = document.querySelector('.dash-tab[data-target="activities-section"]');
    if (org === 'Combined') {
        if (lessonsTab) lessonsTab.classList.add('hidden');
        if (birthdaysTab) birthdaysTab.classList.add('hidden');
        if (activitiesTab) activitiesTab.click();
    } else {
        if (lessonsTab) lessonsTab.classList.remove('hidden');
        if (birthdaysTab) birthdaysTab.classList.remove('hidden');
    }
    
    ORGANIZATION_NAME = org;
    isCombinedPage = org.toLowerCase() === 'combined';
    displayOrg = org;
    
    const titleEl = document.getElementById('active-org-title');
    if (titleEl) titleEl.innerText = org + ' Management';
    
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) dashboard.classList.remove('hidden');
    
    const sysSettings = document.getElementById('system-settings-container');
    if (sysSettings) sysSettings.classList.add('hidden');
    
    const dashTabs = document.getElementById('dashboard-tabs');
    if (dashTabs) dashTabs.classList.remove('hidden');
    
    events = []; unscheduled = []; lessons = []; orgTeachers = []; fullOrgTeachers = []; birthdays = [];
    
    const editorList = document.getElementById('data-editor-list');
    if (editorList) editorList.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500 italic">Loading Data...</td></tr>';
    
    const lessonsList = document.getElementById('lesson-schedule-data');
    if (lessonsList) lessonsList.innerHTML = '<p class="p-8 text-center text-slate-500 italic">Loading Data...</p>';
    
    const birthdaysList = document.getElementById('admin-birthdays-list');
    if (birthdaysList) birthdaysList.innerHTML = '<p class="p-8 text-center text-slate-500 italic">Loading Data...</p>';
    
    initApp();
}

// Settings Routing Logic
document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const defaultText = document.getElementById('settings-default-text');
        if (defaultText) defaultText.classList.add('hidden');
        
        document.querySelectorAll('.settings-module').forEach(mod => {
            mod.classList.add('hidden');
            mod.classList.remove('active');
        });
        
        document.querySelectorAll('.settings-tab').forEach(t => {
            t.classList.remove('active', 'border-blue-500', 'text-blue-400');
            t.classList.add('border-transparent', 'text-slate-500');
        });
        e.currentTarget.classList.remove('border-transparent', 'text-slate-500');
        e.currentTarget.classList.add('active', 'border-blue-500', 'text-blue-400');
        
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetSec = document.getElementById(targetId);
        if (targetSec) {
            targetSec.classList.remove('hidden');
            targetSec.classList.add('active');
        }
    });
});

// Dynamic Privacy Gate Sync
async function syncPrivacyGate() {
    try {
        const snap = await getDocs(collection(db, "home_leaders"));
        const names = [];
        snap.forEach(d => {
            const data = d.data();
            if (data.lastName) {
                names.push(data.lastName.trim().toLowerCase());
            }
        });
        const uniqueNames = [...new Set(names)].sort();
        await setDoc(doc(db, "site_settings", "privacy_config"), { authorizedNames: uniqueNames }, {merge: true});
        console.log("Privacy Gate synced with leaders");
    } catch(e) { console.error("Sync error:", e); }
}

let currentlyEditingLeaderId = null;

async function loadLeaders() {
    const list = document.getElementById('leaders-roster-data');
    if (!list) return;
    try {
        const snap = await getDocs(collection(db, "home_leaders"));
        let docs = [];
        snap.forEach(d => docs.push({...d.data(), id: d.id}));
        
        window.currentLeadersData = docs;
        renderLeadersList(docs, list);
    } catch(e) { console.error("Load leaders err", e); }
}

function renderLeadersList(docs, list) {
    if (docs.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm italic text-center p-4">No leaders configured.</p>';
        return;
    }
    
    list.innerHTML = docs.map(data => {
        const isWriting = currentlyEditingLeaderId === data.id;
        if (isWriting) {
            return `<div class="grid grid-cols-4 gap-4 items-center p-3 bg-slate-800/80 rounded-xl border border-slate-800/50 w-full mb-2">
                <div>
                    <input type="text" id="edit-l-fname-${data.id}" class="bg-slate-900 text-white rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-bold" placeholder="First Name" value="${String(data.firstName||'').replace(/"/g, '&quot;')}">
                </div>
                <div>
                    <input type="text" id="edit-l-lname-${data.id}" class="bg-slate-900 text-white rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-bold" placeholder="Last Name" value="${String(data.lastName||'').replace(/"/g, '&quot;')}">
                </div>
                <div>
                    <select id="edit-l-org-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-full border border-blue-500 outline-none h-[45px] max-h-[45px] text-[10px] uppercase font-bold tracking-wider cursor-pointer">
                        <option value="Priests" ${data.org==='Priests'?'selected':''}>Priests</option>
                        <option value="Teachers" ${data.org==='Teachers'?'selected':''}>Teachers</option>
                        <option value="Deacons" ${data.org==='Deacons'?'selected':''}>Deacons</option>
                        <option value="Young Women" ${data.org==='Young Women'?'selected':''}>Young Women</option>
                        <option value="Primary" ${data.org==='Primary'?'selected':''}>Primary</option>
                    </select>
                </div>
                <div class="flex items-center justify-between gap-2">
                    <input type="text" id="edit-l-calling-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-3 py-2 w-full border border-blue-500 outline-none h-[45px] max-h-[45px] text-xs" placeholder="Calling" value="${String(data.calling||'').replace(/"/g, '&quot;')}">
                    <div class="flex gap-2 action-col shrink-0">
                        <button onclick="window.saveEditedLeader('${data.id}')" class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all shadow-lg" title="Save Row">✓</button>
                        <button onclick="window.cancelEditLeader()" class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all" title="Cancel">✕</button>
                    </div>
                </div>
            </div>`;
        } else {
            return `<div class="grid grid-cols-4 gap-4 items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:bg-slate-800/50 transition group w-full mb-2">
                <div class="text-sm font-bold text-white group-hover:text-blue-400 transition truncate">
                    ${data.firstName || ''}
                </div>
                <div class="text-sm font-normal text-white truncate">
                    ${data.lastName || ''}
                </div>
                <div>
                    <span class="text-[10px] text-emerald-400 font-black uppercase tracking-widest px-2">${data.org || ''}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                    <span class="text-[11px] text-slate-300 group-hover:text-white transition truncate">${data.calling || ''}</span>
                    <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity action-col ${!(typeof isEditMode !== 'undefined' ? isEditMode : true)?'hidden':''}">
                        <button onclick="window.editLeader('${data.id}')" class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Edit">✎</button>
                        <button onclick="window.delLeader('${data.id}')" class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Delete">🗑</button>
                    </div>
                </div>
            </div>`;
        }
    }).join('');

    // Attach keydown listeners for Leaders
    document.querySelectorAll('input[id^="edit-l-fname-"], input[id^="edit-l-lname-"], input[id^="edit-l-org-"], input[id^="edit-l-calling-"]').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const id = inp.id.split('-').pop();
                window.saveEditedLeader(id);
            }
            if (e.key === 'Escape') {
                window.cancelEditLeader();
            }
        });
    });
}

window.editLeader = (id) => {
    currentlyEditingLeaderId = id;
    if (window.currentLeadersData) renderLeadersList(window.currentLeadersData, document.getElementById('leaders-roster-data'));
    setTimeout(() => { const inp = document.getElementById('edit-l-fname-' + id); if(inp) inp.focus(); }, 50);
};

window.cancelEditLeader = () => {
    currentlyEditingLeaderId = null;
    if (window.currentLeadersData) renderLeadersList(window.currentLeadersData, document.getElementById('leaders-roster-data'));
};

window.saveEditedLeader = async (id) => {
    const fnameInp = document.getElementById('edit-l-fname-' + id);
    const lnameInp = document.getElementById('edit-l-lname-' + id);
    const orgInp = document.getElementById('edit-l-org-' + id);
    const callingInp = document.getElementById('edit-l-calling-' + id);
    
    if (!fnameInp || !lnameInp || !orgInp || !callingInp) return;
    
    const newFname = fnameInp.value.trim();
    const newLname = lnameInp.value.trim();
    const newOrg = orgInp.value.trim();
    const newCalling = callingInp.value.trim();
    
    try {
        if (id.startsWith('temp_')) {
            await addDoc(collection(db, "home_leaders"), { firstName: newFname, lastName: newLname, org: newOrg, calling: newCalling });
        } else {
            await setDoc(doc(db, "home_leaders", id), { 
                firstName: newFname, lastName: newLname, org: newOrg, calling: newCalling 
            }, { merge: true });
        }
        currentlyEditingLeaderId = null;
        loadLeaders();
        syncPrivacyGate();
    } catch(e) {
        alert("Error updating leader: " + e.message);
    }
};

const addLeaderBtn = document.getElementById('addLeaderBtn');
if (addLeaderBtn) {
    addLeaderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newId = 'temp_' + Date.now();
        currentlyEditingLeaderId = newId;
        if (!window.currentLeadersData) window.currentLeadersData = [];
        window.currentLeadersData.unshift({
            id: newId, 
            firstName: '', 
            lastName: '', 
            org: window.ORGANIZATION_NAME || '',
            calling: ''
        });
        
        renderLeadersList(window.currentLeadersData, document.getElementById('leaders-roster-data'));
        setTimeout(() => { const inp = document.getElementById('edit-l-fname-' + newId); if(inp) inp.focus(); }, 50);
    });
}

window.delLeader = async (id) => {
    if (confirm("Remove this leader?")) {
        try {
            await deleteDoc(doc(db, "home_leaders", id));
            loadLeaders();
            syncPrivacyGate();
        } catch(e) { alert("Error: " + e.message); }
    }
};

let currentlyEditingSpotlightId = null;

async function loadSpotlights() {
    const list = document.getElementById('spotlights-data');
    if (!list) return;
    try {
        let q = query(collection(db, "home_spotlights"), orderBy("sortOrder", "asc"));
        const snap = await getDocs(q);
        let docs = [];
        snap.forEach(d => docs.push({...d.data(), id: d.id}));
        
        window.currentSpotlightsData = docs;
        renderSpotlightsList(docs, list);
    } catch (e) { console.error("Load spot err", e); }
}

function renderSpotlightsList(docs, list) {
    if (docs.length === 0) {
        list.innerHTML = '<p class="italic opacity-50 text-slate-500 text-center p-8">No spotlights configured.</p>';
        return;
    }
    
    list.innerHTML = docs.map(data => {
        const isWriting = currentlyEditingSpotlightId === data.id;
        if (isWriting) {
            return `<div class="p-4 bg-slate-800/80 rounded-xl border border-slate-800/50 w-full mb-2">
                <div class="flex flex-col gap-3 w-full">
                    <!-- Line 1: Top Row -->
                    <div class="flex flex-col md:flex-row gap-2 items-start w-full">
                        <textarea id="edit-s-desc-${data.id}" rows="2" class="flex-1 w-full bg-slate-800 border border-slate-700 rounded p-2 text-white placeholder-slate-400 text-xs font-bold" placeholder="Description">${String(data.desc||'').replace(/"/g, '&quot;')}</textarea>
                        <input type="date" id="edit-s-date-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-3 py-2 w-full md:w-[140px] border border-blue-500 outline-none h-[45px] max-h-[45px] text-xs font-mono [color-scheme:dark] shrink-0" value="${data.spotDate||''}">
                        <select id="edit-s-org-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-full md:w-[120px] border border-blue-500 outline-none h-[45px] max-h-[45px] text-[10px] uppercase font-bold tracking-wider cursor-pointer shrink-0">
                            <option value="Priests" ${data.org==='Priests'?'selected':''}>Priests</option>
                            <option value="Teachers" ${data.org==='Teachers'?'selected':''}>Teachers</option>
                            <option value="Deacons" ${data.org==='Deacons'?'selected':''}>Deacons</option>
                            <option value="Young Women" ${data.org==='Young Women'?'selected':''}>Young Women</option>
                            <option value="Primary" ${data.org==='Primary'?'selected':''}>Primary</option>
                            <option value="Combined" ${data.org==='Combined'?'selected':''}>Combined</option>
                        </select>
                        <div class="w-full md:w-auto flex justify-end shrink-0 action-col">
                            <div class="flex gap-2 items-center h-[45px]">
                                <button onclick="window.saveEditedSpotlight('${data.id}')" class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all shadow-lg" title="Save Row">✓</button>
                                <button onclick="window.cancelEditSpotlight()" class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all" title="Cancel">✕</button>
                            </div>
                        </div>
                    </div>
                    <!-- Line 2: Bottom Row -->
                    <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                        <input type="text" id="edit-s-video-${data.id}" class="flex-1 w-full bg-slate-900 text-slate-300 rounded-lg px-3 py-2 border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-bold" placeholder="Video URL (optional)" value="${String(data.video_url||'').replace(/"/g, '&quot;')}">
                        <div class="w-full md:w-auto shrink-0 flex items-center gap-2 h-[45px]">
                            ${data.image_url ? `<img src="${data.image_url}" class="w-10 h-10 object-cover rounded shrink-0 border border-slate-700" alt="Saved Image">` : ''}
                            <div class="w-full md:w-[260px] flex items-center h-[45px]">
                                <input type="file" accept="image/*" id="edit-s-img-file-${data.id}" class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer overflow-hidden" onchange="window.handleSpotlightImage(this, '${data.id}')">
                            </div>
                            <input type="hidden" id="edit-s-img-b64-${data.id}" value="${String(data.image_url||'').replace(/"/g, '&quot;')}">
                        </div>
                    </div>
                </div>
            </div>`;
        } else {
            return `<div class="flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 p-4 rounded-xl transition-all shadow-sm hover:shadow-md group relative overflow-hidden mb-2">
                <div class="flex items-center gap-2 shrink-0">
                    ${data.video_url ? `<a href="${data.video_url}" target="_blank" class="flex flex-col items-center justify-center w-16 h-16 bg-slate-900 border border-slate-700 rounded-lg shrink-0 text-blue-400 hover:bg-slate-800 transition" title="${data.video_url}"><span class="text-xl">▶️</span></a>` : ''}
                    ${data.image_url ? `<img src="${data.image_url}" class="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-700 shrink-0" alt="Spotlight">` : ''}
                </div>
                <div class="flex-1 w-full text-sm font-normal text-slate-200 group-hover:text-amber-400 transition truncate"><span class="truncate block max-w-full" title="${String(data.desc||'').replace(/"/g,'&quot;')}">${data.desc || 'No Description'}</span></div>
                <div class="w-full md:w-auto shrink-0 flex items-center gap-3">
                    ${data.video_url ? `<a href="${data.video_url}" target="_blank" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-600 hover:text-white transition">Watch Video</a>` : ''}
                    ${data.spotDate ? `<span class="text-xs text-slate-400 font-medium">${data.spotDate}</span>` : ''}
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest bg-slate-800 text-slate-300 border border-slate-700">
                        ${data.org || 'Unspecified'}
                    </span>
                </div>
                <div class="w-full md:w-auto flex justify-end shrink-0 action-col ${!(typeof isEditMode !== 'undefined' ? isEditMode : true)?'hidden':''}">
                    <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onclick="window.moveSpotlightUp('${data.id}')" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Move Up">↑</button>
                        <button onclick="window.moveSpotlightDown('${data.id}')" class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Move Down">↓</button>
                        <button onclick="window.editSpotlight('${data.id}')" class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Edit">✎</button>
                        <button onclick="window.delSpotlight('${data.id}')" class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Delete">🗑</button>
                    </div>
                </div>
            </div>`;
        }
    }).join('');

    document.querySelectorAll('input[id^="edit-s-desc-"], input[id^="edit-s-video-"], input[id^="edit-s-date-"], select[id^="edit-s-org-"], input[id^="edit-s-img-"]').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const id = inp.id.split('-').pop();
                window.saveEditedSpotlight(id);
            }
            if (e.key === 'Escape') {
                window.cancelEditSpotlight();
            }
        });
    });
}

window.editSpotlight = (id) => {
    currentlyEditingSpotlightId = id;
    if (window.currentSpotlightsData) renderSpotlightsList(window.currentSpotlightsData, document.getElementById('spotlights-data'));
    setTimeout(() => { const inp = document.getElementById('edit-s-desc-' + id); if(inp) inp.focus(); }, 50);
};

window.cancelEditSpotlight = () => {
    currentlyEditingSpotlightId = null;
    if (window.currentSpotlightsData) renderSpotlightsList(window.currentSpotlightsData, document.getElementById('spotlights-data'));
};

window.handleSpotlightImage = (inputEl, id) => {
    const file = inputEl.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > 800) {
                height = Math.round((height * 800) / width);
                width = 800;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const b64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('edit-s-img-b64-' + id).value = b64;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.saveEditedSpotlight = async (id) => {
    const descInp = document.getElementById('edit-s-desc-' + id);
    const videoInp = document.getElementById('edit-s-video-' + id);
    const dateInp = document.getElementById('edit-s-date-' + id);
    const orgInp = document.getElementById('edit-s-org-' + id);
    const imgB64Inp = document.getElementById('edit-s-img-b64-' + id);
    
    if (!descInp || !orgInp) return;
    
    const newDesc = descInp.value.trim();
    const newVideo = videoInp ? videoInp.value.trim() : '';
    const newDate = dateInp ? dateInp.value.trim() : new Date().toISOString().split('T')[0];
    const newOrg = orgInp.value.trim();
    const newImg = imgB64Inp ? imgB64Inp.value.trim() : '';
    
    try {
        if (id.startsWith('temp_')) {
            const tempObj = (window.currentSpotlightsData || []).find(s => s.id === id);
            const saveOrder = tempObj && typeof tempObj.sortOrder === 'number' ? tempObj.sortOrder : (0 - Date.now());
            await addDoc(collection(db, "home_spotlights"), { desc: newDesc, org: newOrg, image_url: newImg, video_url: newVideo, spotDate: newDate, sortOrder: saveOrder });
        } else {
            await setDoc(doc(db, "home_spotlights", id), { 
                desc: newDesc, org: newOrg, image_url: newImg, video_url: newVideo, spotDate: newDate 
            }, { merge: true });
        }
        currentlyEditingSpotlightId = null;
        loadSpotlights();
    } catch(e) {
        alert("Error updating spotlight: " + e.message);
    }
};

const addSpotlightBtn = document.getElementById('addSpotlightBtn');
if (addSpotlightBtn) {
    addSpotlightBtn.addEventListener('click', async () => {
        const newId = 'temp_' + Date.now();
        currentlyEditingSpotlightId = newId;
        if (!window.currentSpotlightsData) window.currentSpotlightsData = [];
        let lowestOrder = 0;
        if (window.currentSpotlightsData.length > 0) {
            lowestOrder = Math.min(...window.currentSpotlightsData.map(s => s.sortOrder || 0));
        }
        window.currentSpotlightsData.unshift({
            id: newId, desc: '', org: 'Priests', image_url: '', video_url: '', spotDate: new Date().toISOString().split('T')[0], sortOrder: lowestOrder - 10
        });
        renderSpotlightsList(window.currentSpotlightsData, document.getElementById('spotlights-data'));
        setTimeout(() => { const inp = document.getElementById('edit-s-desc-' + newId); if(inp) inp.focus(); }, 50);
    });
}

window.delSpotlight = async (id) => {
    if (confirm("Delete this spotlight?")) {
        try {
            await deleteDoc(doc(db, "home_spotlights", id));
            loadSpotlights();
        } catch(e) { alert("Error: " + e.message); }
    }
};

window.moveSpotlightUp = async (id) => {
    if (!window.currentSpotlightsData) return;
    const idx = window.currentSpotlightsData.findIndex(s => s.id === id);
    if (idx <= 0) return;
    
    const curr = window.currentSpotlightsData[idx];
    const prev = window.currentSpotlightsData[idx - 1];
    
    const tempOrder = curr.sortOrder || 0;
    curr.sortOrder = prev.sortOrder || 0;
    prev.sortOrder = tempOrder;
    
    if (curr.sortOrder === prev.sortOrder) {
        curr.sortOrder -= 10;
    }
    
    window.currentSpotlightsData[idx] = prev;
    window.currentSpotlightsData[idx - 1] = curr;
    
    renderSpotlightsList(window.currentSpotlightsData, document.getElementById('spotlights-data'));
    
    try {
        await updateDoc(doc(db, "home_spotlights", curr.id), { sortOrder: curr.sortOrder });
        await updateDoc(doc(db, "home_spotlights", prev.id), { sortOrder: prev.sortOrder });
    } catch(e) { alert("Error updating order: " + e.message); }
};

window.moveSpotlightDown = async (id) => {
    if (!window.currentSpotlightsData) return;
    const idx = window.currentSpotlightsData.findIndex(s => s.id === id);
    if (idx < 0 || idx >= window.currentSpotlightsData.length - 1) return;
    
    const curr = window.currentSpotlightsData[idx];
    const next = window.currentSpotlightsData[idx + 1];
    
    const tempOrder = curr.sortOrder || 0;
    curr.sortOrder = next.sortOrder || 0;
    next.sortOrder = tempOrder;
    
    if (curr.sortOrder === next.sortOrder) {
        curr.sortOrder += 10;
    }
    
    window.currentSpotlightsData[idx] = next;
    window.currentSpotlightsData[idx + 1] = curr;
    
    renderSpotlightsList(window.currentSpotlightsData, document.getElementById('spotlights-data'));
    
    try {
        await updateDoc(doc(db, "home_spotlights", curr.id), { sortOrder: curr.sortOrder });
        await updateDoc(doc(db, "home_spotlights", next.id), { sortOrder: next.sortOrder });
    } catch(e) { alert("Error updating order: " + e.message); }
};

// Announcements Logic
let currentlyEditingAnnId = null;

function getTimestampMs(item) {
    if (!item || !item.timestamp) return Date.now();
    const t = item.timestamp;
    if (typeof t.toMillis === 'function') return t.toMillis();
    if (typeof t.seconds === 'number') return t.seconds * 1000 + Math.floor((t.nanoseconds || 0) / 1000000);
    if (t instanceof Date) return t.getTime();
    if (typeof t === 'number') return t;
    const parsed = new Date(t).getTime();
    return isNaN(parsed) ? Date.now() : parsed;
}

async function loadAnnouncements() {
    const list = document.getElementById('announcements-data');
    if (!list) return;
    try {
        let q = query(collection(db, "home_announcements"));
        const snap = await getDocs(q);
        
        let docs = [];
        snap.forEach(d => docs.push({...d.data(), id: d.id}));
        docs.sort((a,b) => getTimestampMs(b) - getTimestampMs(a));

        window.currentAnnData = docs;
        renderAnnouncementsList(docs, list);
    } catch(e) { console.error("Load ann err", e); }
}

function renderAnnouncementsList(docs, list) {
    if (docs.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm italic text-center p-8">No announcements configured.</p>';
        return;
    }

    list.innerHTML = docs.map((data, idx) => {
        const isWriting = currentlyEditingAnnId === data.id;
        const isFirst = idx === 0;
        const isLast = idx === docs.length - 1;
        if (isWriting) {
            return `<div class="flex flex-col md:flex-row items-start md:items-center gap-2 p-4 bg-slate-800/80 rounded-xl border border-slate-800/50 w-full mb-2">
                <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
                    <textarea id="edit-a-text-${data.id}" rows="2" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white placeholder-slate-400 text-xs font-bold md:col-span-2" placeholder="Announcement Text">${String(data.text||'').replace(/"/g, '&quot;')}</textarea>
                    <div class="flex flex-col gap-2">
                        <input type="text" id="edit-a-link-text-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-3 py-2 w-full border border-blue-500 outline-none h-[35px] text-xs font-bold" placeholder="Link Text (optional)" value="${String(data.linkText||'').replace(/"/g, '&quot;')}">
                        <input type="text" id="edit-a-link-url-${data.id}" class="bg-slate-900 text-slate-300 rounded-lg px-3 py-2 w-full border border-blue-500 outline-none h-[35px] text-xs font-bold" placeholder="Link URL (optional)" value="${String(data.linkUrl||'').replace(/"/g, '&quot;')}">
                    </div>
                </div>
                <div class="w-full md:w-auto flex justify-end shrink-0 action-col">
                    <div class="flex gap-2">
                        <button onclick="window.saveEditedAnn('${data.id}')" class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all shadow-lg" title="Save Row">✓</button>
                        <button onclick="window.cancelEditAnn()" class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-8 h-8 flex items-center justify-center transition-all" title="Cancel">✕</button>
                    </div>
                </div>
            </div>`;
        } else {
            return `<div class="flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 p-4 rounded-xl transition-all shadow-sm hover:shadow-md group relative overflow-hidden mb-2">
                <div class="flex-1 w-full text-sm font-bold text-white group-hover:text-blue-400 transition truncate"><span class="truncate block max-w-full" title="${String(data.text||'').replace(/"/g,'&quot;')}">${data.text}</span></div>
                ${data.linkUrl ? `
                <div class="w-full md:w-auto shrink-0">
                    <a href="${data.linkUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-600 hover:text-white transition">${data.linkText || 'View More'}</a>
                </div>` : ''}
                <div class="w-full md:w-auto flex justify-end shrink-0 action-col">
                    <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        ${(window.currentUserRole === 'Admin' || !window.currentUserRole) ? `
                        <button onclick="window.moveAnnouncementUp('${data.id}')" class="${isFirst ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-slate-400 hover:text-white hover:bg-slate-600'} bg-slate-800 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Move Up" ${isFirst ? 'disabled' : ''}>↑</button>
                        <button onclick="window.moveAnnouncementDown('${data.id}')" class="${isLast ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-slate-400 hover:text-white hover:bg-slate-600'} bg-slate-800 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Move Down" ${isLast ? 'disabled' : ''}>↓</button>
                        <button onclick="window.editAnn('${data.id}')" class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Edit">✎</button>
                        <button onclick="window.delAnn('${data.id}')" class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Delete">🗑</button>
                        ` : ''}
                    </div>
                </div>
            </div>`;
        }
    }).join('');

    document.querySelectorAll('textarea[id^="edit-a-text-"], input[id^="edit-a-link-"]').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                let docId = '';
                if(inp.id.startsWith('edit-a-text-')) docId = inp.id.substring(12);
                else if(inp.id.startsWith('edit-a-link-text-')) docId = inp.id.substring(17);
                else if(inp.id.startsWith('edit-a-link-url-')) docId = inp.id.substring(16);
                window.saveEditedAnn(docId);
            }
            if (e.key === 'Escape') {
                window.cancelEditAnn();
            }
        });
    });
}

window.moveAnnouncementUp = async (id) => {
    if (!window.currentAnnData) return;
    const idx = window.currentAnnData.findIndex(a => a.id === id);
    if (idx <= 0) return;

    const curr = window.currentAnnData[idx];
    const prev = window.currentAnnData[idx - 1];

    window.currentAnnData[idx] = prev;
    window.currentAnnData[idx - 1] = curr;
    renderAnnouncementsList(window.currentAnnData, document.getElementById('announcements-data'));

    try {
        let tCurr = getTimestampMs(curr);
        let tPrev = getTimestampMs(prev);

        if (tPrev === tCurr) {
            const baseTime = Date.now();
            const batch = writeBatch(db);
            window.currentAnnData.forEach((item, i) => {
                const newDate = new Date(baseTime - (i * 60000));
                item.timestamp = { seconds: Math.floor(newDate.getTime() / 1000) };
                batch.update(doc(db, "home_announcements", item.id), { timestamp: newDate });
            });
            await batch.commit();
        } else {
            const dateCurr = new Date(Math.max(tCurr, tPrev));
            const datePrev = new Date(Math.min(tCurr, tPrev));
            curr.timestamp = { seconds: Math.floor(dateCurr.getTime() / 1000) };
            prev.timestamp = { seconds: Math.floor(datePrev.getTime() / 1000) };

            const batch = writeBatch(db);
            batch.update(doc(db, "home_announcements", curr.id), { timestamp: dateCurr });
            batch.update(doc(db, "home_announcements", prev.id), { timestamp: datePrev });
            await batch.commit();
        }
    } catch(e) {
        alert("Error updating order: " + e.message);
        loadAnnouncements();
    }
};

window.moveAnnouncementDown = async (id) => {
    if (!window.currentAnnData) return;
    const idx = window.currentAnnData.findIndex(a => a.id === id);
    if (idx < 0 || idx >= window.currentAnnData.length - 1) return;

    const curr = window.currentAnnData[idx];
    const next = window.currentAnnData[idx + 1];

    window.currentAnnData[idx] = next;
    window.currentAnnData[idx + 1] = curr;
    renderAnnouncementsList(window.currentAnnData, document.getElementById('announcements-data'));

    try {
        let tCurr = getTimestampMs(curr);
        let tNext = getTimestampMs(next);

        if (tNext === tCurr) {
            const baseTime = Date.now();
            const batch = writeBatch(db);
            window.currentAnnData.forEach((item, i) => {
                const newDate = new Date(baseTime - (i * 60000));
                item.timestamp = { seconds: Math.floor(newDate.getTime() / 1000) };
                batch.update(doc(db, "home_announcements", item.id), { timestamp: newDate });
            });
            await batch.commit();
        } else {
            const dateCurr = new Date(Math.min(tCurr, tNext));
            const dateNext = new Date(Math.max(tCurr, tNext));
            curr.timestamp = { seconds: Math.floor(dateCurr.getTime() / 1000) };
            next.timestamp = { seconds: Math.floor(dateNext.getTime() / 1000) };

            const batch = writeBatch(db);
            batch.update(doc(db, "home_announcements", curr.id), { timestamp: dateCurr });
            batch.update(doc(db, "home_announcements", next.id), { timestamp: dateNext });
            await batch.commit();
        }
    } catch(e) {
        alert("Error updating order: " + e.message);
        loadAnnouncements();
    }
};

window.editAnn = (id) => {
    currentlyEditingAnnId = id;
    if (window.currentAnnData) renderAnnouncementsList(window.currentAnnData, document.getElementById('announcements-data'));
    setTimeout(() => { const inp = document.getElementById('edit-a-text-' + id); if(inp) inp.focus(); }, 50);
};

window.cancelEditAnn = () => {
    currentlyEditingAnnId = null;
    if (window.currentAnnData) renderAnnouncementsList(window.currentAnnData, document.getElementById('announcements-data'));
};

window.saveEditedAnn = async (id) => {
    const textInp = document.getElementById('edit-a-text-' + id);
    const linkTextInp = document.getElementById('edit-a-link-text-' + id);
    const linkUrlInp = document.getElementById('edit-a-link-url-' + id);
    
    if (!textInp) return;
    const newText = textInp.value.trim();
    const newLinkText = linkTextInp ? linkTextInp.value.trim() : '';
    const newLinkUrl = linkUrlInp ? linkUrlInp.value.trim() : '';
    
    if (!newText) return alert("Text required.");
    
    try {
        if (id.startsWith('temp_')) {
            let topTimestamp = Date.now();
            if (window.currentAnnData && window.currentAnnData.length > 0) {
                const nonTemp = window.currentAnnData.find(a => !a.id.startsWith('temp_') && a.timestamp);
                if (nonTemp) {
                    const topMs = getTimestampMs(nonTemp);
                    if (topMs >= topTimestamp) {
                        topTimestamp = topMs + 1000;
                    }
                }
            }
            await addDoc(collection(db, "home_announcements"), { 
                text: newText, 
                linkText: newLinkText, 
                linkUrl: newLinkUrl, 
                timestamp: new Date(topTimestamp)
            });
        } else {
            await setDoc(doc(db, "home_announcements", id), { 
                text: newText, 
                linkText: newLinkText, 
                linkUrl: newLinkUrl
            }, { merge: true });
        }
        currentlyEditingAnnId = null;
        loadAnnouncements();
    } catch(e) {
        alert("Error saving announcement: " + e.message);
    }
};

window.delAnn = async (id) => {
    if (confirm("Delete this announcement?")) {
        try {
            await deleteDoc(doc(db, "home_announcements", id));
            loadAnnouncements();
        } catch(e) { alert("Error deleting: " + e.message); }
    }
};

const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
if (addAnnouncementBtn) {
    addAnnouncementBtn.addEventListener('click', () => {
        const newId = 'temp_' + Date.now();
        currentlyEditingAnnId = newId;
        if (!window.currentAnnData) window.currentAnnData = [];
        window.currentAnnData.unshift({
            id: newId, text: '', linkText: '', linkUrl: ''
        });
        renderAnnouncementsList(window.currentAnnData, document.getElementById('announcements-data'));
        setTimeout(() => { const inp = document.getElementById('edit-a-text-' + newId); if(inp) inp.focus(); }, 50);
    });
}

// --- Teacher Management ---
let currentlyEditingTeacherId = null;

function renderTeacherList() {
    const list = document.getElementById('teacher-roster-data');
    if (!list) return;
    
    const orgTeachers = window.fullOrgTeachers;
    
    if (!orgTeachers || orgTeachers.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-sm italic text-center p-4">No teachers found.</p>';
        return;
    }
    
    let html = '';
    const userRole = window.currentUserRole || 'Admin';
    orgTeachers.forEach(t => {
        const isUniversal = t.org === 'General';
        const isReadOnly = userRole !== 'Admin' && isUniversal;
        const isWriting = currentlyEditingTeacherId === t.id;
        
        if (isWriting) {
            html += `<div class="flex flex-col md:flex-row items-start md:items-center gap-2 p-4 bg-slate-800/80 rounded-xl border border-slate-800/50 w-full mb-2">
                <div class="flex-1 w-full md:w-auto">
                    <input type="text" id="edit-t-name-${t.id}" class="bg-slate-900 text-white rounded-lg px-3 py-2 w-full border border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none h-[45px] max-h-[45px] text-xs font-bold" value="${String(t.name||'').replace(/"/g, '&quot;')}">
                </div>
                <div class="w-full md:w-auto shrink-0">
                    <select id="edit-t-org-${t.id}" class="bg-slate-900 text-slate-300 rounded-lg px-2 py-2 w-full md:w-[140px] border border-blue-500 outline-none h-[45px] max-h-[45px] text-[10px] uppercase font-bold tracking-wider cursor-pointer">
                        <option value="Priests" ${t.org==='Priests'?'selected':''}>Priests</option>
                        <option value="Teachers" ${t.org==='Teachers'?'selected':''}>Teachers</option>
                        <option value="Deacons" ${t.org==='Deacons'?'selected':''}>Deacons</option>
                        <option value="Young Women" ${t.org==='Young Women'?'selected':''}>Young Women</option>
                        <option value="Primary" ${t.org==='Primary'?'selected':''}>Primary</option>
                        <option value="General" ${t.org==='General'?'selected':''}>General</option>
                    </select>
                </div>
                <div class="flex items-center justify-end gap-2 w-full md:w-auto mt-3 md:mt-0">
                    <button onclick="window.saveEditedTeacher('${t.id}')" class="text-emerald-400 hover:text-white bg-emerald-900/40 hover:bg-emerald-600 rounded-lg w-10 h-[45px] flex items-center justify-center transition-all shadow-lg text-lg" title="Save Row">✓</button>
                    <button onclick="window.cancelEditTeacher()" class="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg w-10 h-[45px] flex items-center justify-center transition-all" title="Cancel">✕</button>
                </div>
            </div>`;
        } else {
            html += `<div class="flex flex-col md:flex-row items-start md:items-center gap-2 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:bg-slate-800/50 transition group w-full mb-2">
                <div class="flex-1 w-full text-sm font-bold text-white group-hover:text-blue-400 transition truncate">
                    ${t.name}
                </div>
                <div class="w-full md:w-auto shrink-0">
                    <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-300">${t.org || 'Unknown'}</span>
                </div>
                <div class="w-full md:w-auto flex justify-end shrink-0 action-col ${!(typeof isEditMode !== 'undefined' ? isEditMode : true)?'hidden':''}">
                    <div class="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        ${!isReadOnly ? `
                        <button onclick="window.editTeacher('${t.id}')" class="text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Edit">✎</button>
                        <button onclick="window.deleteTeacher('${t.id}')" class="text-red-400 hover:text-white bg-red-900/20 hover:bg-red-600 rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-sm" title="Delete">🗑</button>
                        ` : `<span class="text-[9px] text-slate-500 uppercase font-black tracking-widest px-2">Locked</span>`}
                    </div>
                </div>
            </div>`;
        }
    });
    list.innerHTML = html;

    // Attach keydown listeners for Teachers
    document.querySelectorAll('input[id^="edit-t-name-"], select[id^="edit-t-org-"]').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const id = inp.id.split('-').pop();
                window.saveEditedTeacher(id);
            }
            if (e.key === 'Escape') {
                window.cancelEditTeacher();
            }
        });
    });
}
window.renderTeacherList = renderTeacherList;

window.editTeacher = (id) => {
    currentlyEditingTeacherId = id;
    renderTeacherList();
    setTimeout(() => { const inp = document.getElementById('edit-t-name-' + id); if(inp) inp.focus(); }, 50);
};

window.cancelEditTeacher = () => {
    currentlyEditingTeacherId = null;
    renderTeacherList();
};

window.saveEditedTeacher = async (id) => {
    const nameInp = document.getElementById('edit-t-name-' + id);
    const orgInp = document.getElementById('edit-t-org-' + id);
    if (!nameInp || !orgInp) return;
    
    const newName = nameInp.value.trim();
    const newOrg = orgInp.value;
    if (!newName) return;
    
    const parentContainer = nameInp.parentElement.parentElement;
    const saveBtn = parentContainer ? parentContainer.querySelector('button[title="Save Row"]') : null;
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.5';
        saveBtn.style.cursor = 'not-allowed';
    }
    
    try {
        if (id.startsWith('temp_')) {
            const dupQuery = query(collection(db, "home_teachers"), where("name", "==", newName), where("org", "==", newOrg));
            const dupSnap = await getDocs(dupQuery);
            if (!dupSnap.empty) {
                alert("A teacher with this name already exists in this organization.");
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.style.opacity = '1';
                    saveBtn.style.cursor = 'pointer';
                }
                return;
            }
            await addDoc(collection(db, "home_teachers"), { name: newName, org: newOrg });
        } else {
            await setDoc(doc(db, "home_teachers", id), { name: newName, org: newOrg }, { merge: true });
        }
        currentlyEditingTeacherId = null;
        renderTeacherList();
    } catch(e) {
        alert("Error updating teacher: " + e.message);
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.style.opacity = '1';
            saveBtn.style.cursor = 'pointer';
        }
    }
};

const addTeacherBtn = document.getElementById('addTeacherBtn');
if (addTeacherBtn) {
    addTeacherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newId = 'temp_' + Date.now();
        currentlyEditingTeacherId = newId;
        if (!window.fullOrgTeachers) window.fullOrgTeachers = [];
        window.fullOrgTeachers.unshift({
            id: newId, name: '', org: window.ORGANIZATION_NAME || ''
        });
        renderTeacherList();
        setTimeout(() => { const inp = document.getElementById('edit-t-name-' + newId); if(inp) inp.focus(); }, 50);
    });
}

window.deleteTeacher = async (id) => {
    if (confirm("Remove this teacher? This will not delete their past lessons.")) {
        try {
            await deleteDoc(doc(db, "home_teachers", id));
        } catch(e) { console.error("Del err", e); }
    }
};

async function loadTheme() {
    try {
        const themeDoc = await getDoc(doc(db, "home_content", "general_info"));
        if (themeDoc.exists()) {
            const data = themeDoc.data() || {};
            const titleInput = document.getElementById('admin-theme-title');
            const scriptureInput = document.getElementById('admin-theme-scripture');
            if (titleInput) titleInput.value = data.theme || '';
            if (scriptureInput) scriptureInput.value = data.scripture || '';
        }
    } catch (e) {
        console.error("Error loading theme:", e);
    }
}

const saveThemeBtn = document.getElementById('saveThemeBtn');
if (saveThemeBtn) {
    saveThemeBtn.addEventListener('click', async () => {
        saveThemeBtn.disabled = true;
        saveThemeBtn.innerText = 'Saving...';
        try {
            const theme = document.getElementById('admin-theme-title').value.trim();
            const scripture = document.getElementById('admin-theme-scripture').value.trim();
            await setDoc(doc(db, "home_content", "general_info"), { theme, scripture }, { merge: true });
            
            const statusEl = document.getElementById('theme-save-status');
            if (statusEl) {
                statusEl.classList.remove('hidden');
                setTimeout(() => statusEl.classList.add('hidden'), 4000);
            }
        } catch (err) {
            alert('Failed to save theme: ' + err.message);
        } finally {
            saveThemeBtn.disabled = false;
            saveThemeBtn.innerText = 'Save Theme to Database';
        }
    });
}

// =========================================================================
// UNIFIED AUTHENTICATION, CROSS-SUBDOMAIN SSO & RBAC ENGINE
// =========================================================================

let currentLeaderProfile = null;
let leadersCache = [];
let appConfirmationResult = null;

const AUTHORIZED_MASTER_HASHES = [
    "103a9f4c69d7331576e1a7b7f96ce781e3336f7b304424373aea1f263c581a3d", // yutehub!1830 (Youth Hub master)
    "7ca8ae40ffb835bcc16f1de3fc4f27e3e6b3c709bc5d300f932cd019f86e488b", // YuteHub!1830 (exact)
    "4b465598d5fd124a3856acff035f025315f798faf08049ee57409e3045c72e37", // YuteHub!830 (exact)
    "7f39e9e47d673293ede2907b955e989ab9188e35c39684c95eff536bb5b3e542"  // yutehub!830 (lower)
];

const YOUTH_ROLE_DEFINITIONS = {
    admin: { label: "Ward Administrator", org: "All Ward", fullAccess: true },
    bishopric: { label: "Bishopric", org: "All Ward", fullAccess: true },
    combined: { label: "Combined Youth Leader", org: "Combined", fullAccess: false },
    priests: { label: "Priests Quorum Leader", org: "Priests", fullAccess: false },
    teachers: { label: "Teachers Quorum Leader", org: "Teachers", fullAccess: false },
    deacons: { label: "Deacons Quorum Leader", org: "Deacons", fullAccess: false },
    young_women: { label: "Young Women Leader", org: "Young Women", fullAccess: false },
    yw: { label: "Young Women Leader", org: "Young Women", fullAccess: false },
    primary: { label: "Primary Leader", org: "Primary", fullAccess: false },
    relief_society: { label: "Relief Society Leader", org: "Relief Society", fullAccess: false },
    elders_quorum: { label: "Elders Quorum Leader", org: "Elders Quorum", fullAccess: false },
    sunday_school: { label: "Sunday School Leader", org: "Sunday School", fullAccess: false }
};

function normalizePhone(phoneStr) {
    if (!phoneStr) return '';
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return phoneStr.startsWith('+') ? phoneStr : `+${digits}`;
}

async function computeSha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function mapProfileToYouthRole(roleKey) {
    const r = (roleKey || '').toLowerCase().trim();
    if (r === 'admin' || r === 'bishopric') return 'Admin';
    if (r === 'combined') return 'Combined';
    if (r === 'priests') return 'Priests';
    if (r === 'teachers') return 'Teachers';
    if (r === 'deacons') return 'Deacons';
    if (r === 'young_women' || r === 'yw') return 'Young Women';
    if (r === 'primary') return 'Primary';
    return 'Combined';
}

function setSharedSession(profile) {
    if (!profile) return;
    try {
        sessionStorage.setItem('wardAdminAuth', 'true');
        sessionStorage.setItem('wardLeaderProfile', JSON.stringify(profile));
    } catch (_) {}
    try {
        const payload = encodeURIComponent(JSON.stringify({
            uid: profile.phoneNumber || profile.email || 'leader',
            name: profile.displayName || 'Leader',
            role: profile.role || 'admin',
            ts: Date.now()
        }));
        const isWardDomain = window.location.hostname.endsWith('blackstoneward.org');
        const domainPart = isWardDomain ? '; domain=.blackstoneward.org' : '';
        document.cookie = `ward_auth_session=${payload}; path=/${domainPart}; max-age=604800; SameSite=Lax; Secure`;
    } catch (e) {
        console.warn("Shared cookie set error:", e);
    }
}

function getSharedSession() {
    try {
        if (sessionStorage.getItem('wardAdminAuth') === 'true') {
            const p = JSON.parse(sessionStorage.getItem('wardLeaderProfile') || 'null');
            if (p) return p;
        }
    } catch (_) {}

    try {
        const match = document.cookie.match(/(?:^|;\s*)ward_auth_session=([^;]+)/);
        if (match && match[1]) {
            const parsed = JSON.parse(decodeURIComponent(match[1]));
            if (parsed && parsed.name) {
                const profile = {
                    displayName: parsed.name,
                    role: parsed.role || 'admin',
                    phoneNumber: parsed.uid || ''
                };
                sessionStorage.setItem('wardAdminAuth', 'true');
                sessionStorage.setItem('wardLeaderProfile', JSON.stringify(profile));
                return profile;
            }
        }
    } catch (e) {
        console.warn("Shared cookie read error:", e);
    }
    return null;
}

function clearSharedSession() {
    try {
        sessionStorage.removeItem('wardAdminAuth');
        sessionStorage.removeItem('wardLeaderProfile');
    } catch (_) {}
    try {
        const isWardDomain = window.location.hostname.endsWith('blackstoneward.org');
        const domainPart = isWardDomain ? '; domain=.blackstoneward.org' : '';
        document.cookie = `ward_auth_session=; path=/${domainPart}; max-age=0; SameSite=Lax; Secure`;
    } catch (_) {}
}

function checkAuth() {
    const profile = getSharedSession();
    const loginView = document.getElementById('login-view');
    const dashView = document.getElementById('dashboard-view');

    if (profile) {
        currentLeaderProfile = profile;
        const mappedRole = mapProfileToYouthRole(profile.role);
        window.currentUserRole = mappedRole;

        if (loginView) loginView.classList.add('hidden');
        if (dashView) {
            dashView.classList.remove('hidden');
            dashView.classList.add('flex');
        }

        // Leader Identity Badge in Sidebar
        const badge = document.getElementById('leader-identity-badge');
        const nameEl = document.getElementById('leader-display-name');
        const roleEl = document.getElementById('leader-role-label');
        const initialsEl = document.getElementById('leader-avatar-initials');

        if (badge && nameEl) {
            nameEl.textContent = profile.displayName || 'Leader';
            if (roleEl) {
                const roleDef = YOUTH_ROLE_DEFINITIONS[profile.role] || { label: profile.role || 'Leader' };
                roleEl.textContent = roleDef.label;
            }
            if (initialsEl) {
                const parts = (profile.displayName || 'Leader').trim().split(/\s+/);
                const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
                initialsEl.textContent = initials;
            }
            badge.classList.remove('hidden');
            badge.classList.add('flex');
        }

        if (typeof window.setupRBAC === 'function') {
            window.setupRBAC();
        }
        if (typeof window.initAdminParallax === 'function') {
            window.initAdminParallax();
        }
    } else {
        if (loginView) loginView.classList.remove('hidden');
        if (dashView) {
            dashView.classList.add('hidden');
            dashView.classList.remove('flex');
        }
        const badge = document.getElementById('leader-identity-badge');
        if (badge) {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }
    }
}
window.checkAuth = checkAuth;

function initRecaptcha() {
    if (window.recaptchaVerifier) return;
    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {}
        });
    } catch (e) {
        console.warn("Recaptcha verifier error:", e);
    }
}

async function handleSendPhoneCode(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const phoneInput = document.getElementById('admin-phone');
    const err = document.getElementById('phone-login-error');
    const btn = document.getElementById('phone-send-btn');
    const nameInput = document.getElementById('admin-name-lookup');
    const enteredName = (nameInput?.value || '').trim();

    if (!enteredName) {
        if (err) {
            err.textContent = "Please type your first and last name.";
            err.classList.remove('hidden');
        }
        nameInput?.focus();
        return;
    }

    const nameParts = enteredName.split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
        if (err) {
            err.textContent = "Please type both your first and last name (e.g. Duane Harris).";
            err.classList.remove('hidden');
        }
        nameInput?.focus();
        return;
    }

    const rawPhone = (phoneInput?.value || '').trim();
    if (!rawPhone) {
        if (err) {
            err.textContent = "Please enter your mobile phone number.";
            err.classList.remove('hidden');
        }
        phoneInput?.focus();
        return;
    }
    const phone = normalizePhone(rawPhone);
    if (phone.length < 11) {
        if (err) {
            err.textContent = "Please enter a valid 10-digit mobile phone number.";
            err.classList.remove('hidden');
        }
        phoneInput?.focus();
        return;
    }

    const pool = [...leadersCache];
    if (!pool.some(l => l.displayName === 'Duane Harris')) {
        pool.unshift({
            displayName: "Duane Harris",
            phoneNumber: "+15084940905",
            role: "admin",
            active: true
        });
    }

    const cleanName = enteredName.toLowerCase();
    const leaderMatch = pool.find(l => (l.displayName || '').toLowerCase() === cleanName) ||
        pool.find(l => (l.displayName || '').toLowerCase().includes(cleanName));

    if (!leaderMatch) {
        if (err) {
            err.textContent = `Leader "${enteredName}" was not found among authorized ward leaders. Please verify your first and last name.`;
            err.classList.remove('hidden');
        }
        nameInput?.focus();
        return;
    }

    if (leaderMatch.phoneNumber) {
        const regPhone = normalizePhone(leaderMatch.phoneNumber);
        if (regPhone && regPhone !== phone) {
            if (err) {
                err.textContent = `The phone number entered does not match the registered phone on file for ${leaderMatch.displayName}. Please verify your phone number.`;
                err.classList.remove('hidden');
            }
            phoneInput?.focus();
            return;
        }
    }

    if (err) err.classList.add('hidden');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending SMS text...`;
    }

    try {
        initRecaptcha();
        appConfirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
        document.getElementById('phone-step-1')?.classList.add('hidden');
        document.getElementById('phone-step-2')?.classList.remove('hidden');
        const sentEl = document.getElementById('phone-sent-target');
        if (sentEl) sentEl.textContent = `Text message sent to ${phone}`;
        const codeInput = document.getElementById('admin-sms-code');
        if (codeInput) {
            codeInput.value = '';
            codeInput.focus();
        }
    } catch (errCatch) {
        console.error("SMS send error:", errCatch);
        if (err) {
            if (errCatch.code === 'auth/operation-not-allowed') {
                err.textContent = "Phone SMS sign-in is not enabled in Firebase Console yet. Please click 'Or sign in with password' below.";
            } else if (errCatch.code === 'auth/invalid-phone-number') {
                err.textContent = "Invalid phone number format. Please enter a valid 10-digit mobile number.";
            } else if (errCatch.code === 'auth/too-many-requests') {
                err.innerHTML = "Too many SMS requests sent recently. Please wait a few minutes, or click <strong>'Or sign in with password'</strong> below to sign in immediately.";
            } else if (errCatch.code === 'auth/quota-exceeded') {
                err.textContent = "SMS quota exceeded for this project. Please sign in with password.";
            } else if (errCatch.code === 'auth/captcha-check-failed' || (errCatch.message && errCatch.message.toLowerCase().includes('hostname match not found'))) {
                err.textContent = `Domain not authorized for SMS: Please add '${window.location.hostname}' under Firebase Console > Authentication > Settings > Authorized domains. You can also sign in below with password.`;
            } else {
                err.textContent = errCatch.message || "Failed to send verification text. Please check number or try again.";
            }
            err.classList.remove('hidden');
        }
        if (window.recaptchaVerifier) {
            try { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; } catch (_) {}
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>Send Text Code</span><span aria-hidden="true">&rarr;</span>`;
        }
    }
}

async function handleVerifyPhoneCode(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const codeInput = document.getElementById('admin-sms-code');
    const err = document.getElementById('phone-login-error');
    const btn = document.getElementById('phone-verify-btn');
    const code = (codeInput?.value || '').trim();

    if (!code || code.length < 6) {
        if (err) {
            err.textContent = "Please enter the complete 6-digit code sent to your phone.";
            err.classList.remove('hidden');
        }
        codeInput?.focus();
        return;
    }

    if (!appConfirmationResult) {
        if (err) {
            err.textContent = "Session expired. Please request a new text code.";
            err.classList.remove('hidden');
        }
        return;
    }

    if (err) err.classList.add('hidden');
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Verifying...";
    }

    try {
        const userCredential = await appConfirmationResult.confirm(code);
        const user = userCredential.user;
        const phone = user.phoneNumber;

        const leadersSnap = await getDocs(collection(db, "ward_leaders"));

        let matchedLeader = null;
        leadersSnap.forEach(d => {
            const data = d.data();
            const p = data.phoneNumber ? normalizePhone(data.phoneNumber) : '';
            if ((p === phone || data.phoneNumber === phone) && data.active !== false) {
                matchedLeader = { id: d.id, ...data };
            }
        });

        // Primary Ward Administrator guarantee
        if (phone === '+15084940905') {
            matchedLeader = matchedLeader || {
                id: "leader_duane_harris",
                displayName: "Duane Harris",
                email: "tueini@gmail.com",
                phoneNumber: "+15084940905",
                role: "admin",
                active: true
            };
        }

        if (matchedLeader) {
            setSharedSession(matchedLeader);
            checkAuth();
        } else {
            if (err) {
                err.textContent = `Phone ${phone} verified, but not found in registered ward leaders. Please contact an administrator.`;
                err.classList.remove('hidden');
            }
            await signOut(auth);
        }
    } catch (errCatch) {
        console.error("Code verification error:", errCatch);
        if (err) {
            err.textContent = "Incorrect or expired verification code. Please try again.";
            err.classList.remove('hidden');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Verify & Enter Portal";
        }
    }
}

async function handlePasswordLogin(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const input = document.getElementById('admin-passcode');
    const nameLookup = document.getElementById('password-leader-lookup');
    const err = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');
    const val = (input?.value || '').trim();
    const leaderName = (nameLookup?.value || document.getElementById('admin-name-lookup')?.value || '').trim();

    if (!leaderName) {
        if (err) {
            err.textContent = "Please type your first and last name.";
            err.classList.remove('hidden');
        }
        nameLookup?.focus();
        return;
    }

    const nameParts = leaderName.split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
        if (err) {
            err.textContent = "Please type both your first and last name (e.g. Duane Harris).";
            err.classList.remove('hidden');
        }
        nameLookup?.focus();
        return;
    }

    if (!val) {
        if (err) {
            err.textContent = "Please enter your password.";
            err.classList.remove('hidden');
        }
        if (input) input.focus();
        return;
    }
    if (err) err.classList.add('hidden');
    if (btn) btn.textContent = 'Verifying...';

    try {
        const rawHash = await computeSha256(val);
        const lowerHash = await computeSha256(val.toLowerCase());

        const validHashes = new Set([
            window.SECURE_AUTH_HASHES?.MASTER,
            window.SECURE_AUTH_HASHES?.WARD,
            ...(window.MASTER_APPROVED_HASHES || []),
            ...AUTHORIZED_MASTER_HASHES
        ]);

        // 1. Master Passwords
        if (validHashes.has(rawHash) || validHashes.has(lowerHash)) {
            let profile = {
                displayName: "Duane Harris",
                email: "tueini@gmail.com",
                phoneNumber: "+15084940905",
                role: "admin"
            };
            if (leaderName) {
                const match = leadersCache.find(l => (l.displayName || '').toLowerCase().includes(leaderName.toLowerCase()));
                if (match) profile = { ...match };
            }
            setSharedSession(profile);
            if (input) input.value = '';
            if (btn) btn.textContent = 'Sign In with Password';
            checkAuth();
            return;
        }

        // 2. Personal Leader Passwords
        let matchedLeader = null;
        if (leaderName) {
            const cleanName = leaderName.toLowerCase();
            matchedLeader = leadersCache.find(l => (l.displayName || '').toLowerCase() === cleanName) ||
                leadersCache.find(l => (l.displayName || '').toLowerCase().includes(cleanName));
        }

        if (matchedLeader) {
            if (!matchedLeader.passwordHash) {
                if (err) {
                    err.textContent = `No personal password has been set for ${matchedLeader.displayName} yet. Please sign in via phone text code.`;
                    err.classList.remove('hidden');
                }
                if (btn) btn.textContent = 'Sign In with Password';
                return;
            }
            if (matchedLeader.passwordHash === rawHash || matchedLeader.passwordHash === lowerHash) {
                if (matchedLeader.active === false) {
                    if (err) {
                        err.textContent = "This leader account is currently deactivated. Please contact an administrator.";
                        err.classList.remove('hidden');
                    }
                    if (btn) btn.textContent = 'Sign In with Password';
                    return;
                }
                setSharedSession(matchedLeader);
                if (input) input.value = '';
                if (btn) btn.textContent = 'Sign In with Password';
                checkAuth();
                return;
            } else {
                if (err) {
                    err.textContent = `Incorrect password for ${matchedLeader.displayName}. Please try again.`;
                    err.classList.remove('hidden');
                }
                if (btn) btn.textContent = 'Sign In with Password';
                if (input) { input.select(); input.focus(); }
                return;
            }
        }

        // 3. Fallback: match any active leader with this hash
        const matchingLeader = leadersCache.find(l => l.active !== false && (l.passwordHash === rawHash || l.passwordHash === lowerHash));
        if (matchingLeader) {
            setSharedSession(matchingLeader);
            if (input) input.value = '';
            if (btn) btn.textContent = 'Sign In with Password';
            checkAuth();
            return;
        }

        if (err) {
            err.textContent = "Incorrect password. If you haven't set a personal password, sign in via phone text.";
            err.classList.remove('hidden');
        }
        if (btn) btn.textContent = 'Sign In with Password';
        if (input) { input.select(); input.focus(); }
    } catch (errCatch) {
        console.error("Auth error", errCatch);
        if (err) {
            err.textContent = "An error occurred while verifying password. Please try again.";
            err.classList.remove('hidden');
        }
        if (btn) btn.textContent = 'Sign In with Password';
    }
}

async function handleLogout() {
    clearSharedSession();
    currentLeaderProfile = null;
    try {
        await signOut(auth);
    } catch (_) {}

    const nameLookup = document.getElementById('admin-name-lookup');
    if (nameLookup) nameLookup.value = '';
    const pwLeaderLookup = document.getElementById('password-leader-lookup');
    if (pwLeaderLookup) pwLeaderLookup.value = '';
    const phoneInput = document.getElementById('admin-phone');
    if (phoneInput) phoneInput.value = '';
    const smsInput = document.getElementById('admin-sms-code');
    if (smsInput) smsInput.value = '';
    const pwInput = document.getElementById('admin-passcode');
    if (pwInput) pwInput.value = '';

    const matchIndicator = document.getElementById('leader-match-indicator');
    if (matchIndicator) {
        matchIndicator.classList.add('hidden');
        matchIndicator.classList.remove('flex');
    }

    const phoneErr = document.getElementById('phone-login-error');
    if (phoneErr) phoneErr.classList.add('hidden');
    const pwErr = document.getElementById('login-error');
    if (pwErr) pwErr.classList.add('hidden');

    const step1 = document.getElementById('phone-step-1');
    const step2 = document.getElementById('phone-step-2');
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');

    const phoneForm = document.getElementById('phone-login-form');
    const loginForm = document.getElementById('login-form');
    const togglePasscodeContainer = document.getElementById('toggle-passcode-view-container');
    if (phoneForm) phoneForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    if (togglePasscodeContainer) togglePasscodeContainer.classList.remove('hidden');

    checkAuth();
}
window.handleLogout = handleLogout;

async function handlePasskeyLogin() {
    if (!window.PublicKeyCredential) {
        alert("TouchID / FaceID is not supported on this browser.");
        return;
    }
    try {
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);
        const assertion = await navigator.credentials.get({
            publicKey: { challenge: challenge, timeout: 60000, userVerification: "preferred" }
        });
        if (assertion) {
            let profile = null;
            const saved = localStorage.getItem('wardPasskeyRegistered');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data && data.profile) profile = data.profile;
                } catch (_) {}
            }
            if (!profile) {
                profile = { displayName: "Duane Harris", email: "tueini@gmail.com", phoneNumber: "(508) 494-0905", role: "admin" };
            }
            setSharedSession(profile);
            checkAuth();
        }
    } catch (e) {
        if (e.name !== 'NotAllowedError') {
            console.warn("Passkey login error:", e);
            alert("TouchID / FaceID verification failed. Please sign in with phone text or password.");
        }
    }
}

function initLoginLeaderLookup() {
    const nameInput = document.getElementById('admin-name-lookup');
    const matchIndicator = document.getElementById('leader-match-indicator');
    const matchText = document.getElementById('leader-match-text');
    const phoneInput = document.getElementById('admin-phone');

    function handleNameMatch(val) {
        if (!val) {
            if (matchIndicator) {
                matchIndicator.classList.add('hidden');
                matchIndicator.classList.remove('flex');
            }
            return;
        }
        const pool = [...leadersCache];
        if (!pool.some(l => l.displayName === 'Duane Harris')) {
            pool.unshift({
                displayName: "Duane Harris",
                phoneNumber: "(508) 494-0905",
                role: "admin",
                active: true
            });
        }
        const cleanVal = val.trim().toLowerCase();
        const match = pool.find(l => (l.displayName || '').toLowerCase() === cleanVal) ||
            pool.find(l => (l.displayName || '').toLowerCase().includes(cleanVal));

        if (match) {
            const roleInfo = YOUTH_ROLE_DEFINITIONS[match.role] || { label: 'Leader' };
            if (matchText) matchText.textContent = `${match.displayName} (${roleInfo.label})`;
            if (matchIndicator) {
                matchIndicator.classList.remove('hidden');
                matchIndicator.classList.add('flex');
            }
            if (phoneInput && match.phoneNumber && !phoneInput.value) {
                phoneInput.value = match.phoneNumber;
            }
        } else {
            if (matchIndicator) {
                matchIndicator.classList.add('hidden');
                matchIndicator.classList.remove('flex');
            }
        }
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => handleNameMatch(nameInput.value));
        nameInput.addEventListener('change', () => handleNameMatch(nameInput.value));
    }

    const pwLookup = document.getElementById('password-leader-lookup');
    if (pwLookup) {
        pwLookup.addEventListener('input', () => handleNameMatch(pwLookup.value));
        pwLookup.addEventListener('change', () => handleNameMatch(pwLookup.value));
    }

    try {
        const saved = JSON.parse(localStorage.getItem('local_ward_leaders') || '[]');
        if (saved.length > 0 && leadersCache.length === 0) {
            leadersCache = saved;
        }
    } catch (_) {}

    getDocs(collection(db, "ward_leaders")).then(snap => {
        if (!snap.empty) {
            leadersCache = [];
            snap.forEach(d => leadersCache.push({ id: d.id, ...d.data() }));
            if (!leadersCache.some(l => l.displayName === 'Duane Harris')) {
                leadersCache.unshift({
                    id: 'leader_duane_harris',
                    displayName: "Duane Harris",
                    email: "tueini@gmail.com",
                    phoneNumber: "(508) 494-0905",
                    role: "admin",
                    active: true
                });
            }
            try { localStorage.setItem('local_ward_leaders', JSON.stringify(leadersCache)); } catch (_) {}
        }
    }).catch(e => console.warn("Failed to fetch ward_leaders:", e));
}

function initLoginEventListeners() {
    const phoneForm = document.getElementById('phone-login-form');
    if (phoneForm) {
        phoneForm.addEventListener('submit', handleSendPhoneCode);
    }

    const phoneVerifyBtn = document.getElementById('phone-verify-btn');
    if (phoneVerifyBtn) {
        phoneVerifyBtn.addEventListener('click', handleVerifyPhoneCode);
    }

    const phoneResendBtn = document.getElementById('phone-resend-btn');
    if (phoneResendBtn) {
        phoneResendBtn.addEventListener('click', handleSendPhoneCode);
    }

    const phoneChangeBtn = document.getElementById('phone-change-btn');
    if (phoneChangeBtn) {
        phoneChangeBtn.addEventListener('click', () => {
            document.getElementById('phone-step-2')?.classList.add('hidden');
            document.getElementById('phone-step-1')?.classList.remove('hidden');
            document.getElementById('admin-phone')?.focus();
        });
    }

    const pasteBtn = document.getElementById('btn-paste-sms');
    if (pasteBtn) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                const cleaned = (text || '').replace(/\D/g, '').slice(0, 6);
                const codeInput = document.getElementById('admin-sms-code');
                if (codeInput && cleaned) {
                    codeInput.value = cleaned;
                    codeInput.focus();
                }
            } catch (err) {
                console.warn("Clipboard paste error:", err);
            }
        });
    }

    const togglePasscodeBtn = document.getElementById('toggle-passcode-view-btn');
    const togglePhoneBtn = document.getElementById('toggle-phone-view-btn');
    const togglePasscodeContainer = document.getElementById('toggle-passcode-view-container');
    const passcodeForm = document.getElementById('login-form');

    if (togglePasscodeBtn && passcodeForm && phoneForm) {
        togglePasscodeBtn.addEventListener('click', () => {
            phoneForm.classList.add('hidden');
            if (togglePasscodeContainer) togglePasscodeContainer.classList.add('hidden');
            passcodeForm.classList.remove('hidden');

            const phoneName = document.getElementById('admin-name-lookup')?.value || '';
            const pwName = document.getElementById('password-leader-lookup');
            if (pwName && phoneName && !pwName.value) pwName.value = phoneName;

            const input = document.getElementById('admin-passcode');
            if (input) input.focus();
        });
    }

    if (togglePhoneBtn && passcodeForm && phoneForm) {
        togglePhoneBtn.addEventListener('click', () => {
            passcodeForm.classList.add('hidden');
            phoneForm.classList.remove('hidden');
            if (togglePasscodeContainer) togglePasscodeContainer.classList.remove('hidden');

            const pwName = document.getElementById('password-leader-lookup')?.value || '';
            const phoneName = document.getElementById('admin-name-lookup');
            if (phoneName && pwName && !phoneName.value) phoneName.value = pwName;

            const input = document.getElementById('admin-phone');
            if (input) input.focus();
        });
    }

    const adminNameInput = document.getElementById('admin-name-lookup');
    const pwLeaderInput = document.getElementById('password-leader-lookup');
    if (adminNameInput && pwLeaderInput) {
        adminNameInput.addEventListener('input', () => {
            if (!pwLeaderInput.value || pwLeaderInput.dataset.synced === 'true') {
                pwLeaderInput.value = adminNameInput.value;
                pwLeaderInput.dataset.synced = 'true';
            }
        });
        pwLeaderInput.addEventListener('input', () => {
            pwLeaderInput.dataset.synced = 'false';
        });
    }

    if (passcodeForm) {
        passcodeForm.addEventListener('submit', handlePasswordLogin);
    }

    const passkeyBtn = document.getElementById('passkey-login-btn');
    const passkeyContainer = document.getElementById('passkey-login-container');
    if (passkeyBtn && window.PublicKeyCredential) {
        if (localStorage.getItem('wardPasskeyRegistered')) {
            if (passkeyContainer) passkeyContainer.classList.remove('hidden');
        }
        passkeyBtn.addEventListener('click', handlePasskeyLogin);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Auto-sync Firebase Auth state
onAuthStateChanged(auth, (user) => {
    if (user && !getSharedSession()) {
        const phone = user.phoneNumber;
        if (phone === '+15084940905') {
            const adminProfile = {
                id: "leader_duane_harris",
                displayName: "Duane Harris",
                email: "tueini@gmail.com",
                phoneNumber: "+15084940905",
                role: "admin",
                active: true
            };
            setSharedSession(adminProfile);
            checkAuth();
        } else {
            getDocs(collection(db, "ward_leaders")).then(snap => {
                let matched = null;
                snap.forEach(d => {
                    const data = d.data();
                    const p = data.phoneNumber ? normalizePhone(data.phoneNumber) : '';
                    if ((p === phone || data.phoneNumber === phone) && data.active !== false) {
                        matched = { id: d.id, ...data };
                    }
                });
                if (matched) {
                    setSharedSession(matched);
                    checkAuth();
                }
            }).catch(() => {});
        }
    }
});

// Initialize on script load
initLoginLeaderLookup();
initLoginEventListeners();
checkAuth();


