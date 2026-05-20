import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Read from config.js and security-config.js
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_APP_ID } from "./public/js/config.js";
import { SECURE_AUTH_HASHES, SPOTLIGHT_APPROVED_HASHES } from "./public/security-config.js";

const firebaseConfig = {
    apiKey: GOOGLE_API_KEY,
    authDomain: "blackstoneward-b861c.firebaseapp.com",
    projectId: "blackstoneward-b861c",
    storageBucket: "blackstoneward-b861c.appspot.com",
    messagingSenderId: "956450429708",
    appId: GOOGLE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
    try {
        await setDoc(doc(db, "site_settings", "privacy_config"), {
            SECURE_AUTH_HASHES: SECURE_AUTH_HASHES,
            SPOTLIGHT_APPROVED_HASHES: SPOTLIGHT_APPROVED_HASHES
        }, { merge: true });
        console.log("Privacy config successfully seeded to Firestore.");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding privacy config: ", e);
        process.exit(1);
    }
}
seed();
