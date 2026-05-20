import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const fModal = document.getElementById('feedbackModal');
const fClose = document.getElementById('closeFeedbackBtn');
const fClose2 = document.getElementById('feedbackCloseBtn');
const fBtnFooter = document.getElementById('globalFeedbackBtn');
const fBtnSide = document.getElementById('feedbackBtnSidebar');

const openFeedback = () => {
    fModal.classList.remove('hidden');
    document.getElementById('feedbackSuccess').classList.add('hidden');
    document.getElementById('feedbackForm').reset();
};

if(fBtnFooter) fBtnFooter.addEventListener('click', openFeedback);
if(fBtnSide) fBtnSide.addEventListener('click', openFeedback);

const closeM = () => fModal.classList.add('hidden');
if(fClose) fClose.addEventListener('click', closeM);
if(fClose2) fClose2.addEventListener('click', closeM);

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('feedbackSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = 'Sending...';
    try {
        const dbInstance = getFirestore();
        await addDoc(collection(dbInstance, "site_feedback"), {
            Name: document.getElementById('feedbackName').value.trim(),
            Category: document.getElementById('feedbackCategory').value,
            Message: document.getElementById('feedbackMessage').value.trim(),
            timestamp: new Date().toISOString()
        });
        document.getElementById('feedbackForm').reset();
        document.getElementById('feedbackSuccess').classList.remove('hidden');
    } catch(err) {
        alert('Permissions or Network Error: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Send Message';
    }
});
