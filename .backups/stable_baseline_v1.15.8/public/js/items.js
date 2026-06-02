import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async () => {
    const itemsGrid = document.getElementById('items-grid');
    
    try {
        const itemsRef = collection(db, "auction_items");
        const q = query(itemsRef, orderBy("itemNum"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            itemsGrid.innerHTML = '<p class="text-center col-span-full text-gray-500 text-lg">No auction items have been posted yet.</p>';
            return;
        }

        itemsGrid.innerHTML = ''; // clear loading state

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col";
            
            const imageUrl = data.itemImage ? data.itemImage : 'https://placehold.co/500x400?text=No+Image';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${data.itemName || 'Auction Item'}" class="w-full max-w-[500px] h-[400px] object-cover" />
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2 gap-2">
                        <h3 class="text-xl font-bold text-gray-800">${data.itemName || 'Untitled Item'}</h3>
                        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded border border-blue-200 whitespace-nowrap">
                            Item #${data.itemNum || 'N/A'}
                        </span>
                    </div>
                    <p class="text-gray-600 mb-4 flex-grow">${data.description || 'No description available.'}</p>
                    <div class="mb-4 bg-green-50 p-3 rounded border border-green-200 text-center">
                        <div class="text-xs text-green-800 uppercase tracking-wider font-bold mb-1">Current High Bid</div>
                        <div id="high-bid-${data.itemNum}" class="text-3xl font-black text-green-700">$${data.startingBid || 0}</div>
                        <div id="high-bidder-${data.itemNum}" class="text-sm font-semibold text-gray-500 mt-1">Starting Bid</div>
                    </div>
                    <div class="border-t border-gray-100 pt-4 mt-auto">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-500">Donated by: <span class="font-medium text-gray-700">${data.submitter || 'Anonymous'}</span></span>
                        </div>
                    </div>
                </div>
            `;
            
            itemsGrid.appendChild(card);
        });

        // Listen for real-time bid updates
        const bidsRef = collection(db, "auction_bids");
        onSnapshot(bidsRef, (bidsSnap) => {
            const highBids = {};
            
            bidsSnap.forEach(bidDoc => {
                const bid = bidDoc.data();
                if (bid.itemNum && bid.bidAmount) {
                    if (!highBids[bid.itemNum] || bid.bidAmount > highBids[bid.itemNum].amount) {
                        highBids[bid.itemNum] = {
                            amount: bid.bidAmount,
                            bidder: bid.bidNum
                        };
                    }
                }
            });

            Object.keys(highBids).forEach(itemNum => {
                const amountEl = document.getElementById(`high-bid-${itemNum}`);
                const bidderEl = document.getElementById(`high-bidder-${itemNum}`);
                
                if (amountEl) {
                    const currentVal = parseFloat(amountEl.innerText.replace('$', '')) || 0;
                    const newVal = highBids[itemNum].amount;
                    
                    if (newVal > currentVal) {
                        amountEl.innerText = `$${newVal}`;
                        amountEl.classList.add('animate-pulse', 'text-green-500');
                        setTimeout(() => {
                            amountEl.classList.remove('animate-pulse', 'text-green-500');
                        }, 1500);
                    } else {
                        amountEl.innerText = `$${newVal}`;
                    }
                }
                if (bidderEl) {
                    bidderEl.innerText = `Winning Bidder: #${highBids[itemNum].bidder}`;
                    bidderEl.classList.remove('text-gray-500');
                    bidderEl.classList.add('text-blue-700');
                }
            });
        });


    } catch (error) {
        console.error("Error fetching auction items:", error);
        itemsGrid.innerHTML = '<p class="text-center col-span-full text-red-500 text-lg">Error loading auction items. Please try again later.</p>';
    }
});
