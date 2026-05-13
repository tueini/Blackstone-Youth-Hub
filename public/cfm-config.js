const TEACHER_LIST = [
    "Caden Mullis", "Colton Laverty", "Duane Harris", "Henry Ames", "Joseph Walther",
    "Logan Wild", "Luke Sofoul", "Max Ames", "Micah White", "Michael Zahner",
    "Nate Mason", "Rohnan Mason", "Sam Carlson", "Vance Wild", "Zach Howell"
];

const CFM_LOOKUP = {
    "2026-01-04": "CFM: Introduction to the Old Testament",
    "2026-01-11": "CFM: Moses 1; Abraham 3",
    "2026-01-18": "CFM: Genesis 1-2; Moses 2-3; Abraham 4-5",
    "2026-01-25": "CFM: Genesis 3-4; Moses 4-5",
    "2026-02-01": "CFM: Genesis 5; Moses 6",
    "2026-02-08": "CFM: Moses 7",
    "2026-02-15": "CFM: Genesis 6-11; Moses 8",
    "2026-02-22": "CFM: Genesis 12-17; Abraham 1-2",
    "2026-03-01": "CFM: Genesis 18-23",
    "2026-03-08": "CFM: Genesis 24-33",
    "2026-03-15": "CFM: Genesis 37-41",
    "2026-03-22": "CFM: Genesis 42-50",
    "2026-03-29": "CFM: Exodus 1-6",
    "2026-04-05": "CFM: Easter",
    "2026-04-12": "CFM: Exodus 7-13",
    "2026-04-19": "CFM: Exodus 14-18",
    "2026-04-26": "CFM: Exodus 19-20; 24; 31-34",
    "2026-05-03": "CFM: Exodus 35-40; Leviticus 1; 4; 16; 19",
    "2026-05-10": "CFM: Numbers 11-14; 20-24; 27",
    "2026-05-17": "CFM: Deuteronomy 6-8; 15; 18; 29-30; 34",
    "2026-05-24": "CFM: Joshua 1-8; 23-24",
    "2026-05-31": "CFM: Judges 2-4; 6-8; 13-16",
    "2026-06-07": "CFM: Ruth; 1 Samuel 1-7",
    "2026-06-14": "CFM: 1 Samuel 8-10; 13; 15-16",
    "2026-06-21": "CFM: 1 Samuel 17-18; 24-26; 2 Samuel 5-7",
    "2026-06-28": "CFM: 2 Samuel 11-12; 1 Kings 3; 6-9; 11",
    "2026-07-05": "CFM: 1 Kings 12-13; 17-22",
    "2026-07-12": "CFM: 2 Kings 2-7",
    "2026-07-19": "CFM: 2 Kings 16-25",
    "2026-07-26": "CFM: 2 Chronicles 14-20; 26; 30",
    "2026-08-02": "CFM: Ezra 1; 3-7; Nehemiah 2; 4-6; 8",
    "2026-08-09": "CFM: Esther",
    "2026-08-16": "CFM: Job 1-3; 12-14; 19; 21-24; 38-40; 42",
    "2026-08-23": "CFM: Psalms 1-2; 8; 19-33; 40; 46",
    "2026-08-30": "CFM: Psalms 49-51; 61-66; 69-72; 77-78; 85-86",
    "2026-09-06": "CFM: Psalms 102-103; 110; 116-119; 127-128; 135-139; 146-150",
    "2026-09-13": "CFM: Proverbs 1-4; 15-16; 22; 31; Ecclesiastes 1-3; 11-12",
    "2026-09-20": "CFM: Isaiah 1-12",
    "2026-09-27": "CFM: Isaiah 13-14; 22; 24-30; 35",
    "2026-10-04": "CFM: Isaiah 40-49",
    "2026-10-11": "CFM: Isaiah 50-57",
    "2026-10-18": "CFM: Isaiah 58-66",
    "2026-10-25": "CFM: Jeremiah 1-3; 7; 16-18; 20",
    "2026-11-01": "CFM: Jeremiah 31-33; 36-38; Lamentations 1; 3",
    "2026-11-08": "CFM: Ezekiel 1-3; 33-34; 36-37; 47",
    "2026-11-15": "CFM: Daniel 1-7",
    "2026-11-22": "CFM: Hosea 1-6; 10-14; Joel",
    "2026-11-29": "CFM: Amos; Obadiah; Jonah",
    "2026-12-06": "CFM: Micah; Nahum; Habakkuk; Zephaniah",
    "2026-12-13": "CFM: Haggai 1-2; Zechariah 1-4; 7-14",
    "2026-12-20": "CFM: Malachi",
    "2026-12-27": "CFM: Christmas"
};

window.APP_VERSION_GLOBAL = "7.11.1";
window.renderGlobalFooter = function() {
    try {
        const footers = document.querySelectorAll('.app-version-display');
        footers.forEach(el => el.innerText = 'Blackstone Ward Youth Hub V' + window.APP_VERSION_GLOBAL);
        
        document.querySelectorAll('.globalFeedbackBtn, #globalFeedbackBtn').forEach(btn => {
            btn.addEventListener('click', () => {
                const m = document.getElementById('feedbackModal');
                if(m) {
                    m.classList.remove('hidden');
                    document.getElementById('feedbackSuccess').classList.add('hidden');
                    document.getElementById('feedbackForm').reset();
                }
            });
        });
    } catch (e) {
        console.error('Footer render error:', e);
    }
};
document.addEventListener('DOMContentLoaded', window.renderGlobalFooter);
