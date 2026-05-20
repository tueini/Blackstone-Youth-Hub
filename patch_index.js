const fs = require('fs');
let html = fs.readFileSync('public/admin/index.html', 'utf8');

// Replace header
html = html.replace(
    /<header class="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">\s*<h1 id="active-org-title"[^>]*>Select Organization<\/h1>\s*<\/header>/,
    `<header class="mb-8 border-b border-slate-800 pb-4">
                <div class="flex justify-between items-center mb-4">
                    <h1 id="active-org-title" class="text-3xl font-black text-white uppercase tracking-widest">Select Organization</h1>
                </div>
                <div id="dashboard-tabs" class="hidden flex gap-4 overflow-x-auto mt-2">
                    <button class="dash-tab active px-4 py-2 text-sm font-bold border-b-2 border-blue-500 text-blue-400 transition" data-target="tab-activities">Activities</button>
                    <button class="dash-tab px-4 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-300 transition" data-target="tab-lessons">Lessons & Teachers</button>
                    <button class="dash-tab px-4 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-300 transition" data-target="tab-birthdays">Birthdays</button>
                </div>
            </header>`
);

// We need to wrap content inside #content-container into #tab-activities, #tab-lessons, and create #tab-birthdays.
// Wait, content-container starts at <div id="content-container" class="space-y-8 hidden">
let contentContainerStart = html.indexOf('<div id="content-container"');
let sysSettingsStart = html.indexOf('<div id="system-settings-container"');

let contentHtml = html.substring(contentContainerStart, sysSettingsStart);

// We will replace contentHtml with the tabbed version.
// First, extract the parts.
let annPart = contentHtml.match(/<h3 class="text-\[10px\] font-black text-blue-400 uppercase.*?<\/div>\s*<\/div>\s*<\/div>/s)[0];
let actPart = contentHtml.match(/<!-- Org specific tools \(Activities, Lessons\) -->.*?<\/div>\s*<\/div>/s)[0];
let lessPart = contentHtml.match(/<div class="flex justify-between items-end mb-1 mt-8 border-b border-slate-800 pb-2 pl-2 pr-2">.*?<\/table>\s*<\/div>/s)[0];
let syncPart = contentHtml.match(/<h3 class="text-xs font-black uppercase tracking-\[0\.2em\] text-emerald-500 mb-4 mt-8">Database Backup & Sync<\/h3>.*?<\/div>\s*<\/div>/s)[0];

let newContentHtml = `<div id="content-container" class="hidden">
                <div id="tab-activities" class="tab-pane active space-y-8">
                    ${annPart}
                    ${actPart}
                    ${syncPart}
                </div>
                <div id="tab-lessons" class="tab-pane hidden space-y-8">
                    ${lessPart}
                </div>
                <div id="tab-birthdays" class="tab-pane hidden space-y-8">
                    <div class="bg-slate-900 border border-pink-500/30 w-full rounded-2xl shadow-xl p-6">
                        <h2 class="text-2xl font-black text-pink-500 uppercase tracking-widest mb-4">Birthdays Manager</h2>
                        <p class="text-slate-400 text-sm italic mb-4">Birthday management features will be integrated here.</p>
                        <!-- Future birthday controls -->
                    </div>
                </div>
            </div>\n\n            `;

html = html.substring(0, contentContainerStart) + newContentHtml + html.substring(sysSettingsStart);

fs.writeFileSync('public/admin/index.html', html);
console.log('index.html patched with tabs!');
