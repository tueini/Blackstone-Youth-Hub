import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.initAdminDashboard = async function(db) {
    console.log("Delegating Admin Dashboard initialization to admin-app.js");
    if (typeof window.refreshUI === 'function') {
        window.refreshUI();
    }
};
