import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Registering...';

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            try {
                // Get the sequential bid number via a secure transaction on the public counter
                const counterRef = doc(db, "site_settings", "bid_counter");
                let newBidNumber = 1;

                await runTransaction(db, async (transaction) => {
                    const counterDoc = await transaction.get(counterRef);
                    let currentCount = 0;
                    if (counterDoc.exists()) {
                        currentCount = counterDoc.data().count || 0;
                    }
                    newBidNumber = currentCount + 1;
                    transaction.set(counterRef, { count: newBidNumber }, { merge: true });
                });

                const biddersRef = collection(db, "auction_bidders");

                // Save to Firestore
                await addDoc(biddersRef, {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    bidNumber: newBidNumber,
                    timestamp: new Date().toISOString()
                });

                // Send Trigger Email
                const mailRef = collection(db, "mail");
                await addDoc(mailRef, {
                    to: email,
                    message: {
                        subject: "Your Blackstone Ward Youth Auction Bid Number",
                        html: `Dear ${fullName},<br><br>Thank you for registering as a bidder on the Youth Camp Auction for the Blackstone Ward.<br><br>Here is your Bidder Number: <b><span style="color:red">Bid #${newBidNumber}</span></b><br><br>We look forward to seeing you at the Youth Auction on Saturday May 24 between 6PM and 8PM. You can also bid on items remotely by emailing your bids to: bstoneyouth@gmail.com<br><br>You can see the latest Auction Items AND their bidding status at:<br><a href="https://auction.blackstoneward.org/items.html">https://auction.blackstoneward.org/items.html</a><br><br>Thank you!<br><br>Blackstone Ward Youth Auction Team<br>bstoneyouth@gmail.com`
                    }
                });

                // Hide form, show result
                form.classList.add('hidden');
                document.getElementById('bidResult').classList.remove('hidden');
                document.getElementById('bidNumberDisplay').innerText = newBidNumber;

            } catch (error) {
                console.error("Error saving registration:", error);
                alert("There was an error processing your registration. Please try again.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register as a Bidder';
            }
        });
    }
});
