import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
    const container = document.getElementById('print-container');
    const printMode = document.getElementById('printMode');
    const rangeInputs = document.getElementById('rangeInputs');
    const generateBtn = document.getElementById('generateBtn');
    const startItemInput = document.getElementById('startItem');
    const endItemInput = document.getElementById('endItem');
    
    // Toggle range inputs visibility
    printMode.addEventListener('change', () => {
        if (printMode.value === 'range') {
            rangeInputs.classList.remove('hidden');
        } else {
            rangeInputs.classList.add('hidden');
        }
    });

    let allItemsSnapshot = null;

    try {
        const itemsRef = collection(db, "auction_items");
        const q = query(itemsRef, orderBy("itemNum", "asc"));
        allItemsSnapshot = await getDocs(q);
        container.innerHTML = '<p class="p-8 text-xl text-green-700">Data loaded. Ready to generate print sheets.</p>';
    } catch (err) {
        console.error("Error loading items", err);
        container.innerHTML = '<p class="text-red-500 font-bold p-8">Error loading items from database.</p>';
        generateBtn.disabled = true;
        return;
    }

    generateBtn.addEventListener('click', () => {
        if (!allItemsSnapshot || allItemsSnapshot.empty) {
            container.innerHTML = '<p class="p-8 text-xl">No items found.</p>';
            return;
        }

        container.innerHTML = '<p class="p-8 text-xl text-blue-600">Generating print sheets...</p>';

        const mode = printMode.value;
        const startNum = parseInt(startItemInput.value, 10);
        const endNum = parseInt(endItemInput.value, 10);

        let itemsToPrint = [];

        allItemsSnapshot.forEach(docSnap => {
            const data = docSnap.data();
            let num = parseInt(data.itemNum, 10);
            
            if (mode === 'all') {
                itemsToPrint.push(data);
            } else if (mode === 'range') {
                if (!isNaN(num) && !isNaN(startNum) && !isNaN(endNum) && num >= startNum && num <= endNum) {
                    itemsToPrint.push(data);
                }
            }
        });

        if (itemsToPrint.length === 0) {
            container.innerHTML = '<p class="p-8 text-xl text-red-600">No items matched the selected range.</p>';
            return;
        }

        container.innerHTML = ''; // clear status msg
        
        itemsToPrint.forEach(data => {
            let description = data.description || '';
            if (description.length > 600) {
                description = description.substring(0, 600) + '...';
            }
            
            // Generate rows for the bid table
            let tableRows = '';
            for(let i = 0; i < 20; i++) {
                tableRows += `
                    <tr>
                        <td class="border-b border-gray-400 py-4 px-4 w-1/3"></td>
                        <td class="border-b border-gray-400 py-4 px-4 w-2/3"></td>
                    </tr>
                `;
            }

            const itemHtml = `
                <div class="print-item flex flex-col h-[10in]">
                    <!-- Top section -->
                    <div class="mb-6 flex gap-6">
                        <img src="${data.itemImage || 'https://placehold.co/400x400?text=No+Image'}" alt="Item" class="h-64 w-64 object-contain border border-gray-200 shadow-sm p-2 bg-white">
                        <div class="flex-1 flex flex-col justify-center">
                            <h1 class="text-5xl font-bold mb-2">Item #${data.itemNum || '-'}</h1>
                            <h2 class="text-3xl font-semibold mb-4 text-gray-800">${data.itemName || 'Unknown Item'}</h2>
                            <p class="text-lg text-gray-700 mb-4">${description}</p>
                            <p class="text-xl font-medium mb-1"><strong>Donor:</strong> ${data.submitter || 'Anonymous'}</p>
                            <p class="text-3xl font-bold text-green-700 mt-4">Starting Bid: $${data.startingBid || '0'}</p>
                        </div>
                    </div>
                    
                    <!-- Bottom section: Bid Table -->
                    <div class="flex-1 mt-4">
                        <table class="w-full text-left border-collapse border border-gray-400">
                            <thead>
                                <tr class="bg-gray-100 text-gray-800 uppercase text-xl border-b-4 border-gray-600">
                                    <th class="py-4 px-4 border-r border-gray-400 w-1/3">Bidder Number</th>
                                    <th class="py-4 px-4 w-2/3">Bid Amount ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = itemHtml;
            container.appendChild(itemDiv);
        });
        
        // Let images load before popping up print dialog
        setTimeout(() => {
            window.print();
        }, 500);
    });
});
