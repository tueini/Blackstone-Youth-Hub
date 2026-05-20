export const initPrintHandler = (getPrintData) => {
    const handlePrint = async (filter = 'all', selectNode = null) => {
        let html = "";
        const colors = { social: '#3b82f6', physical: '#f97316', spiritual: '#8b5cf6', intellectual: '#eab308', combined: '#10b981' };
        
        const { events, lessons, unscheduled, displayOrg, months } = getPrintData();

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
            if (popWindow) {
                // Fixed multiline string using backticks and escaped scripts to prevent JS bleed
                popWindow.document.write(`
<body style="background:#0f172a;color:white;font-family:sans-serif;text-align:center;padding-top:20vh;">
    <h2>Generating PDF... Please wait...</h2>
    <script>
        function formatPrivacyName(fullName) {
            if (!fullName) return "";
            const parts = fullName.trim().split(' ');
            if (parts.length > 1) {
                return \`\${parts[0]} \${parts[parts.length - 1].charAt(0)}.\`;
            }
            return fullName;
        }
    <\\/script>

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

    <script>
        if(document.getElementById('closeBdayBtn')){
            document.getElementById('closeBdayBtn').addEventListener('click', () => {
                const org = window.location.pathname.split('/').filter(p => p && p.toLowerCase() !== 'index.html').pop() || 'Combined';
                sessionStorage.setItem('birthdayShown_' + org, 'true');
                document.getElementById('bdayModal').classList.add('hidden');
            });
        }
    <\\/script>
</body>
                `);
            }
            
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

    const listBtn = document.getElementById('printBtnList');
    if(listBtn) listBtn.addEventListener('change', onChangePrint);
    
    const gridBtn = document.getElementById('printBtnGrid');
    if(gridBtn) gridBtn.addEventListener('change', onChangePrint);
};
