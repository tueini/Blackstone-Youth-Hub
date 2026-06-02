import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs, doc, updateDoc, addDoc, deleteDoc, onSnapshot, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('loginContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Bidders Elements
    const biddersTableBody = document.getElementById('biddersTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const refreshBtn = document.getElementById('refreshBtn');
    const addBidderBtn = document.getElementById('addBidderBtn');
    
    // Items Elements
    const addItemForm = document.getElementById('addItemForm');
    const addItemSuccess = document.getElementById('addItemSuccess');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsTableBody = document.getElementById('itemsTableBody');
    const loadingItemsIndicator = document.getElementById('loadingItemsIndicator');
    const refreshItemsBtn = document.getElementById('refreshItemsBtn');

    // Bids Elements
    const addBidForm = document.getElementById('addBidForm');
    const addBidBtn = document.getElementById('addBidBtn');
    const addBidSuccess = document.getElementById('addBidSuccess');
    const highestBidsTableBody = document.getElementById('highestBidsTableBody');
    const loadingBidsIndicator = document.getElementById('loadingBidsIndicator');
    
    // Closeout Elements
    const settlementTableBody = document.getElementById('settlementTableBody');
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    
    // Modal Elements
    const historyModal = document.getElementById('historyModal');
    const historyModalTitle = document.getElementById('historyModalTitle');
    const closeHistoryModal = document.getElementById('closeHistoryModal');
    const historyTableBody = document.getElementById('historyTableBody');
    let allBidsData = []; // Store raw bids for drill-down
    window.itemsMap = {}; // Keyed by itemNum, stores {itemName, itemImage, paid, docId}
    window.biddersMap = {}; // Keyed by bidNumber, stores bidder data

    // Tab Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active styles from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('text-blue-600', 'border-blue-600');
                b.classList.add('text-gray-500', 'border-transparent');
            });
            // Add active styles to clicked button
            btn.classList.remove('text-gray-500', 'border-transparent');
            btn.classList.add('text-blue-600', 'border-blue-600');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));

            // Show selected tab content
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    const itemImageFile = document.getElementById('itemImageFile');
    if (itemImageFile) {
        itemImageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                let previewImg = document.getElementById('itemImagePreview');
                if (!previewImg) {
                    previewImg = document.createElement('img');
                    previewImg.id = 'itemImagePreview';
                    previewImg.className = 'mt-2 w-24 h-24 object-cover rounded shadow-sm';
                    itemImageFile.parentNode.appendChild(previewImg);
                }
                previewImg.src = URL.createObjectURL(file);
            } else {
                const previewImg = document.getElementById('itemImagePreview');
                if (previewImg) previewImg.remove();
            }
        });
    }

    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            addItemBtn.disabled = true;
            addItemBtn.innerText = 'Adding...';
            addItemSuccess.classList.add('hidden');

            const startingBid = parseInt(document.getElementById('newStartingBid').value.trim(), 10);
            const itemName = document.getElementById('newItemName').value.trim();
            const description = document.getElementById('newDescription').value.trim();
            const submitter = document.getElementById('newSubmitter').value.trim();
            const submitterEmail = document.getElementById('newSubmitterEmail').value.trim();
            
            const imageFile = document.getElementById('itemImageFile').files[0];
            let itemImage = '';
            if (imageFile) {
                itemImage = 'images/items/' + imageFile.name;
            }

            try {
                const counterRef = doc(db, "site_settings", "item_counter");
                let itemNum = 1;

                await runTransaction(db, async (transaction) => {
                    const counterDoc = await transaction.get(counterRef);
                    let currentCount = 0;
                    if (counterDoc.exists()) {
                        currentCount = counterDoc.data().count || 0;
                    }
                    itemNum = currentCount + 1;
                    transaction.set(counterRef, { count: itemNum }, { merge: true });
                });

                const itemsRef = collection(db, "auction_items");
                await addDoc(itemsRef, {
                    itemNum,
                    startingBid,
                    itemName,
                    description,
                    submitter,
                    submitterEmail,
                    itemImage,
                    timestamp: new Date().toISOString()
                });

                addItemForm.reset();
                const previewImg = document.getElementById('itemImagePreview');
                if (previewImg) previewImg.remove();
                addItemSuccess.classList.remove('hidden');
                setTimeout(() => addItemSuccess.classList.add('hidden'), 3000);
                loadItems(); // refresh table
            } catch (err) {
                console.error("Error adding item:", err);
                alert("Failed to add auction item. Ensure you have the correct permissions.");
            } finally {
                addItemBtn.disabled = false;
                addItemBtn.innerText = 'Add Item';
            }
        });
    }

    if (refreshItemsBtn) {
        refreshItemsBtn.addEventListener('click', loadItems);
    }

    if (addBidForm) {
        const bidItemNumSelect = document.getElementById('bidItemNum');
        const bidItemPreviewImage = document.getElementById('bidItemPreviewImage');
        
        if (bidItemNumSelect && bidItemPreviewImage) {
            bidItemNumSelect.addEventListener('change', (e) => {
                const itemNum = parseInt(e.target.value, 10);
                if (window.itemsMap && window.itemsMap[itemNum]) {
                    bidItemPreviewImage.src = window.itemsMap[itemNum].itemImage;
                    bidItemPreviewImage.classList.remove('hidden');
                } else {
                    bidItemPreviewImage.classList.add('hidden');
                }
            });
        }

        addBidForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            addBidBtn.disabled = true;
            addBidBtn.innerText = 'Submitting...';
            addBidSuccess.classList.add('hidden');

            const itemNumStr = bidItemNumSelect.value ? bidItemNumSelect.value.trim() : '';
            const bidderNumSelect = document.getElementById('bidderNum');
            const bidNumStr = bidderNumSelect.value ? bidderNumSelect.value.trim() : '';
            const bidAmountInput = document.getElementById('bidAmount');
            const bidAmountStr = bidAmountInput.value ? bidAmountInput.value.trim() : '';

            if (!itemNumStr || !bidNumStr || !bidAmountStr) {
                alert("Please ensure all fields are selected and filled out.");
                addBidBtn.disabled = false;
                addBidBtn.innerText = 'Submit Bid';
                return;
            }

            const itemNum = parseInt(itemNumStr, 10);
            const bidNum = parseInt(bidNumStr, 10);
            const bidAmount = parseFloat(bidAmountStr);

            if (isNaN(itemNum) || isNaN(bidNum) || isNaN(bidAmount)) {
                alert("Invalid numerical input.");
                addBidBtn.disabled = false;
                addBidBtn.innerText = 'Submit Bid';
                return;
            }

            try {
                const bidsRef = collection(db, "auction_bids");
                await addDoc(bidsRef, {
                    itemNum,
                    bidNum,
                    bidAmount,
                    timestamp: new Date().toISOString()
                });

                addBidForm.reset();
                if(bidItemPreviewImage) bidItemPreviewImage.classList.add('hidden');
                bidItemNumSelect.focus();
                addBidSuccess.classList.remove('hidden');
                setTimeout(() => addBidSuccess.classList.add('hidden'), 2000);
            } catch (err) {
                console.error("Error adding bid:", err);
                alert("Failed to submit bid. Ensure you have the correct permissions.");
            } finally {
                addBidBtn.disabled = false;
                addBidBtn.innerText = 'Submit Bid';
            }
        });
    }

    if (closeHistoryModal) {
        closeHistoryModal.addEventListener('click', () => {
            historyModal.classList.add('hidden');
        });
    }

    let unsubscribeBids = null;
    function listenForBids() {
        if (!loadingBidsIndicator) return;
        loadingBidsIndicator.classList.remove('hidden');
        
        const bidsRef = collection(db, "auction_bids");
        const q = query(bidsRef, orderBy("timestamp", "desc"));
        
        unsubscribeBids = onSnapshot(q, (snapshot) => {
            loadingBidsIndicator.classList.add('hidden');
            allBidsData = [];
            snapshot.forEach(docSnap => {
                allBidsData.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderHighestBids();
        }, (error) => {
            console.error("Error listening to bids:", error);
            loadingBidsIndicator.innerText = "Error loading active bids.";
            loadingBidsIndicator.classList.remove('hidden');
        });
    }

    function renderHighestBids() {
        if (!highestBidsTableBody) return;
        highestBidsTableBody.innerHTML = '';
        
        if (allBidsData.length === 0) {
            highestBidsTableBody.innerHTML = '<tr><td colspan="4" class="py-4 px-6 text-center">No bids placed yet.</td></tr>';
            return;
        }

        const highestBids = {};
        allBidsData.forEach(bid => {
            const itemNum = bid.itemNum;
            if (!highestBids[itemNum] || bid.bidAmount > highestBids[itemNum].bidAmount) {
                highestBids[itemNum] = bid;
            }
        });

        const sortedItemNums = Object.keys(highestBids).map(Number).sort((a, b) => a - b);
        
        sortedItemNums.forEach(itemNum => {
            const topBid = highestBids[itemNum];
            const itemData = window.itemsMap[itemNum] || { itemName: 'Unknown', itemImage: 'https://placehold.co/100x100?text=No+Image' };
            
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-200 hover:bg-gray-100";
            tr.innerHTML = `
                <td class="py-3 px-6 whitespace-nowrap font-bold">#${itemNum}</td>
                <td class="py-3 px-6">
                    <img src="${itemData.itemImage}" alt="Item" class="w-12 h-12 object-cover rounded shadow-sm" onerror="this.outerHTML='<div class=\'w-12 h-12 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 text-center\'>Pending Deploy</div>'">
                </td>
                <td class="py-3 px-6">${itemData.itemName}</td>
                <td class="py-3 px-6 font-semibold text-green-700">$${topBid.bidAmount}</td>
                <td class="py-3 px-6">#${topBid.bidNum}</td>
                <td class="py-3 px-6 text-center space-x-1">
                    <button class="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded text-xs view-history-btn" data-item="${itemNum}">View History</button>
                </td>
            `;
            highestBidsTableBody.appendChild(tr);
        });

        document.querySelectorAll('.view-history-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemNum = parseInt(e.target.getAttribute('data-item'), 10);
                showHistoryModal(itemNum);
            });
        });

        renderCloseoutTables(highestBids, sortedItemNums);
    }

    function renderCloseoutTables(highestBids, sortedItemNums) {
        if (!settlementTableBody || !invoicesTableBody) return;
        
        settlementTableBody.innerHTML = '';
        invoicesTableBody.innerHTML = '';
        
        if (sortedItemNums.length === 0) {
            settlementTableBody.innerHTML = '<tr><td colspan="5" class="py-4 px-6 text-center">No settlements yet.</td></tr>';
            invoicesTableBody.innerHTML = '<tr><td colspan="4" class="py-4 px-6 text-center">No invoices yet.</td></tr>';
            return;
        }

        const invoicesMap = {}; // Key: bidNum, Value: { bidNum, bidderName, itemsWon: [], totalOwed: 0 }

        // Render Table A (Settlement)
        sortedItemNums.forEach(itemNum => {
            const topBid = highestBids[itemNum];
            const itemData = window.itemsMap[itemNum] || { itemName: 'Unknown', paid: false, docId: null };
            const bidderData = window.biddersMap[topBid.bidNum] || { fullName: 'Unknown Bidder' };

            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-200 hover:bg-gray-100";
            
            const isChecked = itemData.paid ? 'checked' : '';
            
            tr.innerHTML = `
                <td class="py-3 px-6 whitespace-nowrap font-bold">#${itemNum}</td>
                <td class="py-3 px-6">${itemData.itemName}</td>
                <td class="py-3 px-6">${bidderData.fullName} (#${topBid.bidNum})</td>
                <td class="py-3 px-6 font-semibold text-green-700">$${topBid.bidAmount}</td>
                <td class="py-3 px-6 text-center">
                    <input type="checkbox" class="w-5 h-5 cursor-pointer payment-box" data-item-id="${itemData.docId}" ${isChecked}>
                </td>
            `;
            settlementTableBody.appendChild(tr);

            // Aggregate for Invoices
            if (!invoicesMap[topBid.bidNum]) {
                invoicesMap[topBid.bidNum] = {
                    bidNum: topBid.bidNum,
                    bidderName: bidderData.fullName,
                    itemsWon: [],
                    totalOwed: 0
                };
            }
            invoicesMap[topBid.bidNum].itemsWon.push(`#${itemNum}`);
            invoicesMap[topBid.bidNum].totalOwed += topBid.bidAmount;
        });

        // Add payment status listeners for Table A
        document.querySelectorAll('.payment-box').forEach(box => {
            box.addEventListener('change', async (e) => {
                const docId = e.target.getAttribute('data-item-id');
                if (!docId || docId === 'null') {
                    alert("Error: Item document ID missing. Make sure Auction Items are loaded.");
                    e.target.checked = !e.target.checked;
                    return;
                }
                const paidState = e.target.checked;
                try {
                    await updateDoc(doc(db, "auction_items", docId), { paid: paidState });
                } catch (err) {
                    console.error("Error updating payment status:", err);
                    alert("Failed to update payment status.");
                    e.target.checked = !paidState;
                }
            });
        });

        // Render Table B (Invoices)
        const sortedBidNums = Object.keys(invoicesMap).map(Number).sort((a, b) => a - b);
        sortedBidNums.forEach(bidNum => {
            const invoice = invoicesMap[bidNum];
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-200 hover:bg-gray-100";
            tr.innerHTML = `
                <td class="py-3 px-6 whitespace-nowrap font-bold">#${invoice.bidNum}</td>
                <td class="py-3 px-6">${invoice.bidderName}</td>
                <td class="py-3 px-6 text-sm text-gray-600">${invoice.itemsWon.join(', ')}</td>
                <td class="py-3 px-6 font-semibold text-green-700">$${invoice.totalOwed}</td>
            `;
            invoicesTableBody.appendChild(tr);
        });
    }

    function showHistoryModal(itemNum) {
        historyModalTitle.innerText = `Bid History for Item #${itemNum}`;
        historyTableBody.innerHTML = '';
        
        const itemBids = allBidsData.filter(b => b.itemNum === itemNum);
        if (itemBids.length === 0) {
            historyTableBody.innerHTML = '<tr><td colspan="3" class="py-4 px-4 text-center">No bids.</td></tr>';
        } else {
            itemBids.forEach(bid => {
                const tr = document.createElement('tr');
                tr.className = "border-b border-gray-200 hover:bg-gray-50";
                const timeStr = new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
                tr.innerHTML = `
                    <td class="py-2 px-4 whitespace-nowrap">${timeStr}</td>
                    <td class="py-2 px-4">
                        <span class="view-bid-num">#${bid.bidNum}</span>
                        <input type="number" class="edit-bid-num hidden border p-1 rounded w-full" value="${bid.bidNum}">
                    </td>
                    <td class="py-2 px-4 font-semibold text-green-700">
                        <span class="view-bid-amt">$${bid.bidAmount}</span>
                        <input type="number" class="edit-bid-amt hidden border p-1 rounded w-full" value="${bid.bidAmount}">
                    </td>
                    <td class="py-2 px-4 text-center space-x-1">
                        <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs edit-bid-btn" data-id="${bid.id}">Edit</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs save-bid-btn hidden" data-id="${bid.id}">Save</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs del-bid-btn" data-id="${bid.id}">Delete</button>
                    </td>
                `;
                historyTableBody.appendChild(tr);
            });

            // Event listeners for Edit/Save/Delete Bids
            historyTableBody.querySelectorAll('.edit-bid-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tr = e.target.closest('tr');
                    tr.querySelector('.view-bid-num').classList.add('hidden');
                    tr.querySelector('.edit-bid-num').classList.remove('hidden');
                    tr.querySelector('.view-bid-amt').classList.add('hidden');
                    tr.querySelector('.edit-bid-amt').classList.remove('hidden');
                    e.target.classList.add('hidden');
                    tr.querySelector('.save-bid-btn').classList.remove('hidden');
                });
            });

            historyTableBody.querySelectorAll('.save-bid-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const tr = e.target.closest('tr');
                    const docId = e.target.getAttribute('data-id');
                    
                    const bidNum = parseInt(tr.querySelector('.edit-bid-num').value.trim(), 10);
                    const bidAmount = parseFloat(tr.querySelector('.edit-bid-amt').value.trim());
                    
                    e.target.disabled = true;
                    e.target.innerText = '...';

                    try {
                        await updateDoc(doc(db, "auction_bids", docId), { bidNum, bidAmount });
                        tr.querySelector('.view-bid-num').innerText = `#${bidNum}`;
                        tr.querySelector('.view-bid-amt').innerText = `$${bidAmount}`;
                        
                        tr.querySelector('.view-bid-num').classList.remove('hidden');
                        tr.querySelector('.edit-bid-num').classList.add('hidden');
                        tr.querySelector('.view-bid-amt').classList.remove('hidden');
                        tr.querySelector('.edit-bid-amt').classList.add('hidden');
                        
                        e.target.classList.add('hidden');
                        tr.querySelector('.edit-bid-btn').classList.remove('hidden');
                    } catch (err) {
                        console.error(err);
                        alert('Error updating bid');
                    } finally {
                        e.target.disabled = false;
                        e.target.innerText = 'Save';
                    }
                });
            });

            historyTableBody.querySelectorAll('.del-bid-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm("Are you sure you want to delete this bid?")) {
                        const docId = e.target.getAttribute('data-id');
                        try {
                            await deleteDoc(doc(db, "auction_bids", docId));
                            e.target.closest('tr').remove();
                        } catch (err) {
                            console.error(err);
                            alert("Error deleting bid");
                        }
                    }
                });
            });
        }
        historyModal.classList.remove('hidden');
    }

    // Auth State Listener
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            loginContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            loadBidders();
            await loadItems();
            listenForBids();
        } else {
            loginContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            if (unsubscribeBids) {
                unsubscribeBids();
                unsubscribeBids = null;
            }
        }
    });

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            try {
                loginError.classList.add('hidden');
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                loginError.innerText = "Invalid credentials. Please try again.";
                loginError.classList.remove('hidden');
                console.error("Login Error:", error);
            }
        });
    }

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut(auth);
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadBidders);
    }

    if (addBidderBtn) {
        addBidderBtn.addEventListener('click', () => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-gray-200 bg-blue-50";
            tr.innerHTML = `
                <td class="py-3 px-6 whitespace-nowrap font-bold text-gray-500">Auto</td>
                <td class="py-3 px-6"><input type="text" class="w-full border p-1 rounded new-name" placeholder="Name"></td>
                <td class="py-3 px-6"><input type="email" class="w-full border p-1 rounded new-email" placeholder="Email"></td>
                <td class="py-3 px-6"><input type="tel" class="w-full border p-1 rounded new-phone" placeholder="Phone"></td>
                <td class="py-3 px-6 text-center">-</td>
                <td class="py-3 px-6 text-center">
                    <button class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs mr-1 save-new-btn">Save</button>
                    <button class="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded text-xs cancel-new-btn">Cancel</button>
                </td>
            `;
            biddersTableBody.insertBefore(tr, biddersTableBody.firstChild);

            tr.querySelector('.cancel-new-btn').addEventListener('click', () => tr.remove());

            tr.querySelector('.save-new-btn').addEventListener('click', async (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerText = '...';
                const fullName = tr.querySelector('.new-name').value.trim();
                const email = tr.querySelector('.new-email').value.trim();
                const phone = tr.querySelector('.new-phone').value.trim();

                try {
                    const biddersRef = collection(db, "auction_bidders");
                    const snapshot = await getDocs(biddersRef);
                    const newBidNumber = snapshot.size + 1;

                    await addDoc(biddersRef, {
                        fullName, email, phone, bidNumber: newBidNumber, checkedIn: true, timestamp: new Date().toISOString()
                    });
                    loadBidders(); // Refresh seamlessly
                } catch (err) {
                    console.error("Error saving new bidder", err);
                    alert("Error saving bidder");
                    btn.disabled = false;
                    btn.innerText = 'Save';
                }
            });
        });
    }

    async function loadItems() {
        if (!loadingItemsIndicator) return;
        loadingItemsIndicator.classList.remove('hidden');
        itemsTableBody.innerHTML = '';
        
        try {
            const itemsRef = collection(db, "auction_items");
            const q = query(itemsRef, orderBy("itemNum", "asc"));
            const snapshot = await getDocs(q);
            
            loadingItemsIndicator.classList.add('hidden');
            
            if (snapshot.empty) {
                itemsTableBody.innerHTML = '<tr><td colspan="5" class="py-4 px-6 text-center">No auction items uploaded yet.</td></tr>';
                return;
            }

            window.itemsMap = {};
            const bidItemNumSelect = document.getElementById('bidItemNum');
            if (bidItemNumSelect) {
                bidItemNumSelect.innerHTML = '<option value="" disabled selected>Select an Item</option>';
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                if (data.itemNum) {
                    window.itemsMap[data.itemNum] = { 
                        itemName: data.itemName || 'Unknown Item', 
                        itemImage: data.itemImage || 'https://placehold.co/100x100?text=No+Image',
                        paid: data.paid || false,
                        docId: docSnap.id
                    };
                    if (bidItemNumSelect) {
                        const opt = document.createElement('option');
                        opt.value = data.itemNum;
                        opt.innerText = `#${data.itemNum} - ${data.itemName || 'Unknown'}`;
                        bidItemNumSelect.appendChild(opt);
                    }
                }

                const tr = document.createElement('tr');
                tr.className = "border-b border-gray-200 hover:bg-gray-100";
                
                const imageUrl = data.itemImage ? data.itemImage : 'https://placehold.co/100x100?text=No+Image';

                tr.innerHTML = `
                    <td class="py-3 px-6 whitespace-nowrap font-bold">
                        <span class="view-item-num">#${data.itemNum || '-'}</span>
                        <input type="number" class="edit-item-num hidden border p-1 rounded w-full" value="${data.itemNum || ''}">
                    </td>
                    <td class="py-3 px-6">
                        <img src="${imageUrl}" alt="Item" class="w-16 h-16 object-cover rounded shadow-sm view-item-image" onerror="this.outerHTML='<div class=\'w-16 h-16 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 text-center\'>Pending Deploy</div>'">
                        <input type="file" accept="image/*" class="edit-item-image hidden border p-1 rounded w-full bg-white" data-original-image="${data.itemImage || ''}">
                    </td>
                    <td class="py-3 px-6">
                        <span class="view-item-name">${data.itemName || ''}</span>
                        <input type="text" class="edit-item-name hidden border p-1 rounded w-full" value="${data.itemName || ''}">
                    </td>
                    <td class="py-3 px-6">
                        <span class="view-item-description">${data.description || ''}</span>
                        <textarea class="edit-item-description hidden border p-1 rounded w-full text-xs" rows="2">${data.description || ''}</textarea>
                    </td>
                    <td class="py-3 px-6 font-semibold text-green-700">
                        <span class="view-item-bid">$${data.startingBid || '0'}</span>
                        <input type="number" class="edit-item-bid hidden border p-1 rounded w-full" value="${data.startingBid || '0'}">
                    </td>
                    <td class="py-3 px-6 text-gray-500">
                        <span class="view-item-submitter">${data.submitter || ''}</span>
                        <input type="text" class="edit-item-submitter hidden border p-1 rounded w-full" value="${data.submitter || ''}">
                    </td>
                    <td class="py-3 px-6 text-gray-500">
                        <span class="view-item-submitterEmail">${data.submitterEmail || ''}</span>
                        <input type="email" class="edit-item-submitterEmail hidden border p-1 rounded w-full" value="${data.submitterEmail || ''}">
                    </td>
                    <td class="py-3 px-6 text-center space-x-1">
                        <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs edit-item-btn" data-id="${docSnap.id}">Edit</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs save-item-btn hidden" data-id="${docSnap.id}" data-paid="${data.paid !== undefined ? data.paid : false}">Save</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs del-item-btn" data-id="${docSnap.id}">Delete</button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
            });
            
            // Event listeners for Edit/Save/Delete Items
            document.querySelectorAll('.edit-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tr = e.target.closest('tr');
                    tr.querySelectorAll('[class*="view-item-"]').forEach(el => el.classList.add('hidden'));
                    tr.querySelectorAll('[class*="edit-item-"]').forEach(el => el.classList.remove('hidden'));
                    e.target.classList.add('hidden');
                    tr.querySelector('.save-item-btn').classList.remove('hidden');
                });
            });

            document.querySelectorAll('.save-item-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const tr = e.target.closest('tr');
                    const docId = e.target.getAttribute('data-id');
                    
                    const itemNum = parseInt(tr.querySelector('.edit-item-num').value.trim(), 10);
                    const itemName = tr.querySelector('.edit-item-name').value.trim();
                    const description = tr.querySelector('.edit-item-description').value.trim();
                    const startingBid = parseInt(tr.querySelector('.edit-item-bid').value.trim(), 10);
                    const submitter = tr.querySelector('.edit-item-submitter').value.trim();
                    const submitterEmail = tr.querySelector('.edit-item-submitterEmail').value.trim();
                    
                    const imageInput = tr.querySelector('.edit-item-image');
                    let itemImage = imageInput.getAttribute('data-original-image') || '';
                    if (imageInput.files && imageInput.files.length > 0) {
                        itemImage = 'images/items/' + imageInput.files[0].name;
                    }
                    
                    const paidAttr = e.target.getAttribute('data-paid');
                    const paid = paidAttr === 'true';

                    e.target.disabled = true;
                    e.target.innerText = '...';

                    try {
                        await updateDoc(doc(db, "auction_items", docId), { itemNum, itemName, description, startingBid, submitter, submitterEmail, itemImage, paid });
                        loadItems(); // refresh table
                    } catch (err) {
                        console.error(err);
                        alert('Error updating item');
                    } finally {
                        e.target.disabled = false;
                        e.target.innerText = 'Save';
                    }
                });
            });

            document.querySelectorAll('.del-item-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm("Are you sure you want to delete this auction item?")) {
                        const docId = e.target.getAttribute('data-id');
                        try {
                            await deleteDoc(doc(db, "auction_items", docId));
                            e.target.closest('tr').remove();
                        } catch (err) {
                            console.error(err);
                            alert("Error deleting item");
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error("Error loading items:", error);
            loadingItemsIndicator.innerText = "Error loading data.";
            loadingItemsIndicator.classList.remove('hidden');
        }
    }

    // Load Bidders Data
    async function loadBidders() {
        loadingIndicator.classList.remove('hidden');
        biddersTableBody.innerHTML = '';
        
        try {
            const biddersRef = collection(db, "auction_bidders");
            const q = query(biddersRef, orderBy("bidNumber", "asc"));
            const snapshot = await getDocs(q);
            
            loadingIndicator.classList.add('hidden');
            const bidderNumSelect = document.getElementById('bidderNum');
            if (bidderNumSelect) {
                bidderNumSelect.innerHTML = '<option value="" disabled selected>Select a Bidder</option>';
            }

            window.biddersMap = {};

            if (snapshot.empty) {
                biddersTableBody.innerHTML = '<tr><td colspan="6" class="py-4 px-6 text-center">No bidders registered yet.</td></tr>';
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                if (bidderNumSelect && data.bidNumber) {
                    const opt = document.createElement('option');
                    opt.value = data.bidNumber;
                    opt.innerText = `Bid #${data.bidNumber} - ${data.fullName || 'Unknown'}`;
                    bidderNumSelect.appendChild(opt);
                }
                if (data.bidNumber) {
                    window.biddersMap[data.bidNumber] = data;
                }

                const tr = document.createElement('tr');
                tr.className = "border-b border-gray-200 hover:bg-gray-100";
                
                const isChecked = data.checkedIn ? 'checked' : '';
                
                tr.innerHTML = `
                    <td class="py-3 px-6 whitespace-nowrap font-bold">#${data.bidNumber || '-'}</td>
                    <td class="py-3 px-6"><span class="view-name">${data.fullName || ''}</span><input type="text" class="edit-name hidden border p-1 rounded w-full" value="${data.fullName || ''}"></td>
                    <td class="py-3 px-6"><span class="view-email">${data.email || ''}</span><input type="text" class="edit-email hidden border p-1 rounded w-full" value="${data.email || ''}"></td>
                    <td class="py-3 px-6"><span class="view-phone">${data.phone || ''}</span><input type="text" class="edit-phone hidden border p-1 rounded w-full" value="${data.phone || ''}"></td>
                    <td class="py-3 px-6 text-center">
                        <input type="checkbox" class="w-5 h-5 cursor-pointer checkin-box" data-id="${docSnap.id}" ${isChecked}>
                    </td>
                    <td class="py-3 px-6 text-center space-x-1 flex justify-center">
                        <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs email-btn" data-email="${data.email}" data-name="${data.fullName}" data-bidnum="${data.bidNumber}">Email</button>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs edit-btn" data-id="${docSnap.id}">Edit</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs save-btn hidden" data-id="${docSnap.id}">Save</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs del-btn" data-id="${docSnap.id}">Delete</button>
                    </td>
                `;
                biddersTableBody.appendChild(tr);
            });
            
            // Event listeners for check-ins
            document.querySelectorAll('.checkin-box').forEach(box => {
                box.addEventListener('change', async (e) => {
                    const docId = e.target.getAttribute('data-id');
                    const checkedState = e.target.checked;
                    try {
                        await updateDoc(doc(db, "auction_bidders", docId), { checkedIn: checkedState });
                    } catch (err) {
                        console.error("Error updating check-in status:", err);
                        alert("Failed to update status.");
                        e.target.checked = !checkedState; 
                    }
                });
            });

            // Event listeners for Edit/Save/Delete
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tr = e.target.closest('tr');
                    tr.querySelector('.view-name').classList.add('hidden');
                    tr.querySelector('.edit-name').classList.remove('hidden');
                    tr.querySelector('.view-email').classList.add('hidden');
                    tr.querySelector('.edit-email').classList.remove('hidden');
                    tr.querySelector('.view-phone').classList.add('hidden');
                    tr.querySelector('.edit-phone').classList.remove('hidden');
                    
                    e.target.classList.add('hidden');
                    tr.querySelector('.save-btn').classList.remove('hidden');
                });
            });

            document.querySelectorAll('.save-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const tr = e.target.closest('tr');
                    const docId = e.target.getAttribute('data-id');
                    const fullName = tr.querySelector('.edit-name').value.trim();
                    const email = tr.querySelector('.edit-email').value.trim();
                    const phone = tr.querySelector('.edit-phone').value.trim();
                    
                    e.target.disabled = true;
                    e.target.innerText = '...';

                    try {
                        await updateDoc(doc(db, "auction_bidders", docId), { fullName, email, phone });
                        tr.querySelector('.view-name').innerText = fullName;
                        tr.querySelector('.view-email').innerText = email;
                        tr.querySelector('.view-phone').innerText = phone;
                        
                        tr.querySelector('.view-name').classList.remove('hidden');
                        tr.querySelector('.edit-name').classList.add('hidden');
                        tr.querySelector('.view-email').classList.remove('hidden');
                        tr.querySelector('.edit-email').classList.add('hidden');
                        tr.querySelector('.view-phone').classList.remove('hidden');
                        tr.querySelector('.edit-phone').classList.add('hidden');
                        
                        e.target.classList.add('hidden');
                        tr.querySelector('.edit-btn').classList.remove('hidden');
                    } catch (err) {
                        console.error(err);
                        alert('Error updating bidder');
                    } finally {
                        e.target.disabled = false;
                        e.target.innerText = 'Save';
                    }
                });
            });

            document.querySelectorAll('.del-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm("Are you sure you want to delete this bidder?")) {
                        const docId = e.target.getAttribute('data-id');
                        try {
                            await deleteDoc(doc(db, "auction_bidders", docId));
                            e.target.closest('tr').remove();
                        } catch (err) {
                            console.error(err);
                            alert("Error deleting bidder");
                        }
                    }
                });
            });

            document.querySelectorAll('.email-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const email = e.target.getAttribute('data-email');
                    const fullName = e.target.getAttribute('data-name');
                    const bidNumber = e.target.getAttribute('data-bidnum');
                    
                    if (!email) {
                        alert("No email address provided for this bidder.");
                        return;
                    }

                    e.target.disabled = true;
                    e.target.innerText = 'Sending...';

                    try {
                        const mailRef = collection(db, "mail");
                        await addDoc(mailRef, {
                            to: email,
                            message: {
                                subject: "Your Blackstone Ward Youth Auction Bid Number",
                                html: `Dear ${fullName},<br><br>Thank you for registering as a bidder on the Youth Camp Auction for the Blackstone Ward.<br><br>Here is your Bidder Number: <b><span style="color:red">Bid #${bidNumber}</span></b><br><br>We look forward to seeing you at the Youth Auction on Saturday May 24 between 6PM and 8PM. You can also bid on items remotely by emailing your bids to: bstoneyouth@gmail.com<br><br>You can see the latest Auction Items AND their bidding status at:<br><a href="https://auction.blackstoneward.org/items.html">https://auction.blackstoneward.org/items.html</a><br><br>Thank you!<br><br>Blackstone Ward Youth Auction Team<br>bstoneyouth@gmail.com`
                            }
                        });
                        alert('Email queued!');
                    } catch (err) {
                        console.error("Error queueing email:", err);
                        alert("Failed to queue email.");
                    } finally {
                        e.target.disabled = false;
                        e.target.innerText = 'Email';
                    }
                });
            });

        } catch (error) {
            console.error("Error loading bidders:", error);
            loadingIndicator.innerText = "Error loading data.";
        }
    }
});
