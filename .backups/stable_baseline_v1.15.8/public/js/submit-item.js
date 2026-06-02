import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    const form = document.getElementById('submitItemForm');
    const formContainer = document.getElementById('formContainer');
    const successContainer = document.getElementById('successContainer');
    const emailPhotoLink = document.getElementById('emailPhotoLink');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting...';

            const submitterName = document.getElementById('submitterName').value.trim();
            const submitterEmail = document.getElementById('submitterEmail').value.trim();
            const itemName = document.getElementById('itemName').value.trim();
            const itemDescription = document.getElementById('itemDescription').value.trim();
            const startingBid = document.getElementById('startingBid').value.trim();

            try {
                // We use the Trigger Email extension to send the data as an email
                const mailRef = collection(db, "mail");
                
                // Email to Admin
                await addDoc(mailRef, {
                    to: "bstoneyouth@gmail.com",
                    replyTo: submitterEmail,
                    message: {
                        subject: `New Auction Item Submission: ${itemName}`,
                        html: `
                            <h3>New Auction Item Submission</h3>
                            <p><strong>Submitter:</strong> ${submitterName}</p>
                            <p><strong>Email:</strong> ${submitterEmail}</p>
                            <p><strong>Item Name:</strong> ${itemName}</p>
                            <p><strong>Description:</strong><br>${itemDescription}</p>
                            <p><strong>Starting Bid:</strong> $${startingBid}</p>
                        `
                    }
                });

                // Auto-responder to Donor
                await addDoc(mailRef, {
                    to: submitterEmail,
                    message: {
                        subject: `Item Submitted: ${itemName}`,
                        html: `Dear ${submitterName},<br><br>Thank you so much for donating <b>${itemName}</b> to the Blackstone Ward Youth Camp Auction!<br><br>Your item details have been recorded. You can view the live auction catalog at any time to see your item and track active bids here:<br><a href="https://auction.blackstoneward.org/items.html">https://auction.blackstoneward.org/items.html</a><br><br>Thank you for supporting our youth!<br><br>Blackstone Ward Youth Auction Team`
                    }
                });

                // Update UI on success
                formContainer.classList.add('hidden');
                successContainer.classList.remove('hidden');
                
                // Set the dynamic mailto link
                emailPhotoLink.href = `mailto:bstoneyouth@gmail.com?subject=Attaching photo for: Auction Item: ${encodeURIComponent(itemName)}`;

            } catch (error) {
                console.error("Error submitting item:", error);
                alert("There was an error processing your submission. Please try again.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Item';
            }
        });
    }
});
