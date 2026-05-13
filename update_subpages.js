const fs = require('fs');
const files = [
    'Combined', 'Deacons', 'Priests', 'Primary', 'Teachers', 'YW'
].map(d => `./public/${d}/index.html`);

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add orgTeachers variable
    const target1 = "let events = [], unscheduled = [], lessons = [];";
    const replace1 = "let events = [], unscheduled = [], lessons = [], orgTeachers = [];";
    if (content.includes(target1)) {
        content = content.replace(target1, replace1);
    }

    // 2. Add teacher fetch logic inside initApp
    const target2 = `            try {
                const allData = [];
                const orgSnap = await getDocs(collection(db, \`\${ORGANIZATION_NAME}_events\`));`;
    const replace2 = `            try {
                const tSnap = await getDocs(query(collection(db, "home_teachers")));
                tSnap.forEach(d => {
                    const t = d.data();
                    if (t.org === 'General' || t.org === ORGANIZATION_NAME || ORGANIZATION_NAME === 'Combined') {
                        orgTeachers.push(t.name);
                    }
                });
                orgTeachers.sort();
            } catch (e) { console.error("Teacher fetch err:", e); }

            try {
                const allData = [];
                const orgSnap = await getDocs(collection(db, \`\${ORGANIZATION_NAME}_events\`));`;
                
    if (content.includes(target2)) {
        content = content.replace(target2, replace2);
    }

    // 3. Replace TEACHER_LIST usage in renderLessonManager
    const target3 = "${TEACHER_LIST.map(t =>";
    const replace3 = "${(orgTeachers.length > 0 ? orgTeachers : (typeof TEACHER_LIST !== 'undefined' ? TEACHER_LIST : [])).map(t =>";
    if (content.includes(target3)) {
        content = content.replace(target3, replace3);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
}
