const admin = require('firebase-admin');
admin.initializeApp({ projectId: "blackstoneward-b861c" });
const db = admin.firestore();

const names = ["ames", "cowden", "fuller", "harris", "houston", "hunsaker", "jensen", "mason", "robinson", "truscott", "wild"];

async function run() {
    try {
        await db.collection("site_settings").doc("privacy_config").set({ authorizedNames: names });
        console.log("Seeded privacy_config successfully.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
