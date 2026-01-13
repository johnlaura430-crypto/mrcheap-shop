// Supabase configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Translation dictionary
const translations = {
    en: {
        // Login
        login: "Login",
        username: "Username",
        password: "Password",
        logout: "Logout",
        
        // Navigation
        dashboard: "Dashboard",
        items: "Items",
        purchases: "Purchases",
        sales: "Sales",
        expenses: "Expenses",
        reports: "Reports",
        
        // Common
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        search: "Search",
        total: "Total",
        date: "Date",
        actions: "Actions",
        
        // Items
        itemName: "Item Name",
        buyingPrice: "Buying Price",
        sellingPrice: "Selling Price",
        stock: "Stock",
        addItem: "Add Item",
        
        // Purchases
        purchaseDate: "Purchase Date",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        totalAmount: "Total Amount",
        addPurchase: "Add Purchase",
        selectItem: "Select Item",
        
        // Sales
        saleDate: "Sale Date",
        addSale: "Add Sale",
        
        // Expenses
        description: "Description",
        amount: "Amount",
        addExpense: "Add Expense",
        
        // Reports
        purchaseReport: "Purchase Report",
        salesReport: "Sales Report",
        stockValuation: "Stock Valuation",
        profitLoss: "Profit & Loss",
        fromDate: "From Date",
        toDate: "To Date",
        generate: "Generate",
        revenue: "Revenue",
        costOfGoods: "Cost of Goods",
        grossProfit: "Gross Profit",
        totalExpenses: "Total Expenses",
        netProfit: "Net Profit",
        
        // Dashboard
        todaysSales: "Today's Sales",
        currentStockValue: "Current Stock Value",
        lowStockItems: "Low Stock Items"
    },
    sw: {
        // Login
        login: "Ingia",
        username: "Jina la Mtumiaji",
        password: "Nenosiri",
        logout: "Toka",
        
        // Navigation
        dashboard: "Dashibodi",
        items: "Bidhaa",
        purchases: "Manunuzi",
        sales: "Mauzo",
        expenses: "Matumizi",
        reports: "Ripoti",
        
        // Common
        add: "Ongeza",
        edit: "Hariri",
        delete: "Futa",
        save: "Hifadhi",
        cancel: "Ghairi",
        search: "Tafuta",
        total: "Jumla",
        date: "Tarehe",
        actions: "Vitendo",
        
        // Items
        itemName: "Jina la Bidhaa",
        buyingPrice: "Bei ya Kununulia",
        sellingPrice: "Bei ya Kuuza",
        stock: "Hisa",
        addItem: "Ongeza Bidhaa",
        
        // Purchases
        purchaseDate: "Tarehe ya Kununua",
        quantity: "Idadi",
        unitPrice: "Bei ya Kimoja",
        totalAmount: "Jumla ya Fedha",
        addPurchase: "Ongeza Nunua",
        selectItem: "Chagua Bidhaa",
        
        // Sales
        saleDate: "Tarehe ya Mauzo",
        addSale: "Ongeza Mauzo",
        
        // Expenses
        description: "Maelezo",
        amount: "Kiasi",
        addExpense: "Ongeza Matumizi",
        
        // Reports
        purchaseReport: "Ripoti ya Manunuzi",
        salesReport: "Ripoti ya Mauzo",
        stockValuation: "Thamani ya Hisa",
        profitLoss: "Faida na Hasara",
        fromDate: "Kutoka Tarehe",
        toDate: "Hadi Tarehe",
        generate: "Tengeneza",
        revenue: "Mapato",
        costOfGoods: "Gharama ya Bidhaa",
        grossProfit: "Faida ya Jumla",
        totalExpenses: "Jumla ya Matumizi",
        netProfit: "Faida halisi",
        
        // Dashboard
        todaysSales: "Mauzo ya Leo",
        currentStockValue: "Thamani ya Hisa Sasa",
        lowStockItems: "Bidhaa Zenye Hisa Chini"
    }
};

// Simple bcrypt hash comparison (for demo - use proper auth in production)
const users = {
    'admin': '$2b$10$YourBcryptHashHere',
    'brother': '$2b$10$YourBcryptHashHere'
};

let currentUser = null;
let currentLanguage = 'en';

// Language functions
function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelector('#languageDropdown').textContent = 
        lang === 'en' ? 'English' : 'Swahili';
    updateTranslations();
}

function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Login function
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (replace with Supabase auth in production)
    if ((username === 'admin' || username === 'brother') && password === 'admin123') {
        currentUser = username;
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('app').classList.remove('d-none');
        showSection('dashboard');
        loadDashboard();
    } else {
        document.getElementById('loginMessage').textContent = 
            currentLanguage === 'en' ? 'Invalid credentials' : 'Nenosiri au jina la mtumiaji si sahihi';
        document.getElementById('loginMessage').classList.remove('d-none');
    }
});

function logout() {
    currentUser = null;
    document.getElementById('app').classList.add('d-none');
    document.getElementById('loginScreen').classList.remove('d-none');
    document.getElementById('loginForm').reset();
}

// Section navigation
function showSection(sectionName) {
    document.getElementById('content').innerHTML = '';
    
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'items':
            loadItems();
            break;
        case 'purchases':
            loadPurchases();
            break;
        case 'sales':
            loadSales();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Load Dashboard
async function loadDashboard() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's sales
    const { data: todaySales } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('sale_date', today);
    
    const totalSales = todaySales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0) || 0;
    
    // Get all items for stock valuation
    const { data: items } = await supabase.from('items').select('*');
    const stockValue = items?.reduce((sum, item) => sum + (item.stock * item.buying_price), 0) || 0;
    
    // Get low stock items (less than 10)
    const lowStock = items?.filter(item => item.stock < 10) || [];
    
    const html = `
        <div class="row">
            <div class="col-md-4">
                <div class="stat-card primary">
                    <h5 data-i18n="todaysSales">Today's Sales</h5>
                    <h3>${totalSales.toFixed(2)}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card success">
                    <h5 data-i18n="currentStockValue">Current Stock Value</h5>
                    <h3>${stockValue.toFixed(2)}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card warning">
                    <h5 data-i18n="lowStockItems">Low Stock Items</h5>
                    <h3>${lowStock.length}</h3>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5 data-i18n="lowStockItems">Low Stock Items</h5>
                    </div>
                    <div class="card-body">
                        ${lowStock.length > 0 ? `
                            <ul class="list-group">
                                ${lowStock.map(item => `
                                    <li class="list-group-item d-flex justify-content-between">
                                        <span>${item.name}</span>
                                        <span class="badge bg-warning">${item.stock} left</span>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p>No low stock items</p>'}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Sales</h5>
                    </div>
                    <div class="card-body">
                        <!-- Recent sales will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = html;
    updateTranslations();
}

// Load Items Management
async function loadItems() {
    const { data: items } = await supabase.from('items').select('*').order('name');
    
    const html = `
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <h5 data-i18n="items">Items</h5>
                <button class="btn btn-primary btn-sm" onclick="showAddItemForm()" data-i18n="addItem">Add Item</button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th data-i18n="itemName">Item Name</th>
                                <th data-i18n="buyingPrice">Buying Price</th>
                                <th data-i18n="sellingPrice">Selling Price</th>
                                <th data-i18n="stock">Stock</th>
                                <th data-i18n="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${parseFloat(item.buying_price).toFixed(2)}</td>
                                    <td>${parseFloat(item.selling_price).toFixed(2)}</td>
                                    <td>${item.stock}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" onclick="editItem('${item.id}')" data-i18n="edit">Edit</button>
                                        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')" data-i18n="delete">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = html;
    updateTranslations();
}

// Load Purchases
async function loadPurchases() {
    const { data: purchases } = await supabase
        .from('purchases')
        .select(`
            *,
            items (name)
        `)
        .order('purchase_date', { ascending: false });
    
    const { data: items } = await supabase.from('items').select('id, name').order('name');
    
    const html = `
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <h5 data-i18n="purchases">Purchases</h5>
                <button class="btn btn-primary btn-sm" onclick="showAddPurchaseForm()" data-i18n="addPurchase">Add Purchase</button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th data-i18n="date">Date</th>
                                <th data-i18n="itemName">Item Name</th>
                                <th data-i18n="quantity">Quantity</th>
                                <th data-i18n="unitPrice">Unit Price</th>
                                <th data-i18n="totalAmount">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchases.map(purchase => `
                                <tr>
                                    <td>${purchase.purchase_date}</td>
                                    <td>${purchase.items.name}</td>
                                    <td>${purchase.quantity}</td>
                                    <td>${parseFloat(purchase.unit_price).toFixed(2)}</td>
                                    <td>${parseFloat(purchase.total_amount).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Add Purchase Form (hidden) -->
        <div id="addPurchaseForm" class="card mt-4 d-none">
            <div class="card-header">
                <h5 data-i18n="addPurchase">Add Purchase</h5>
            </div>
            <div class="card-body">
                <form id="purchaseForm">
                    <div class="row">
                        <div class="col-md-4">
                            <label data-i18n="selectItem">Select Item</label>
                            <select class="form-control" id="purchaseItem" required>
                                <option value="">-- Select --</option>
                                ${items.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label data-i18n="quantity">Quantity</label>
                            <input type="number" class="form-control" id="purchaseQuantity" required min="1">
                        </div>
                        <div class="col-md-3">
                            <label data-i18n="unitPrice">Unit Price</label>
                            <input type="number" class="form-control" id="purchaseUnitPrice" required min="0" step="0.01">
                        </div>
                        <div class="col-md-3">
                            <label data-i18n="purchaseDate">Purchase Date</label>
                            <input type="date" class="form-control" id="purchaseDate" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary" data-i18n="save">Save</button>
                        <button type="button" class="btn btn-secondary" onclick="cancelAddPurchase()" data-i18n="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = html;
    updateTranslations();
    
    // Add form submit handler
    document.getElementById('purchaseForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const itemId = document.getElementById('purchaseItem').value;
        const quantity = parseInt(document.getElementById('purchaseQuantity').value);
        const unitPrice = parseFloat(document.getElementById('purchaseUnitPrice').value);
        const purchaseDate = document.getElementById('purchaseDate').value;
        
        const { error } = await supabase
            .from('purchases')
            .insert([{
                item_id: itemId,
                quantity: quantity,
                unit_price: unitPrice,
                total_amount: quantity * unitPrice,
                purchase_date: purchaseDate
            }]);
        
        if (!error) {
            alert('Purchase recorded successfully!');
            cancelAddPurchase();
            loadPurchases();
        } else {
            alert('Error: ' + error.message);
        }
    });
}

// Similar functions for Sales, Expenses, and Reports
// Due to length, I'll show structure for others:

async function loadSales() {
    // Similar to purchases but for sales
    // Add sales form with item selection, quantity, unit price
}

async function loadExpenses() {
    // Simple expense form with description, amount, date
}

async function loadReports() {
    // Generate reports with date filters
    // 1. Purchase Report
    // 2. Sales Report
    // 3. Stock Valuation (current stock * buying price)
    // 4. Profit & Loss (Revenue - COGS - Expenses)
}

// Form display functions
function showAddItemForm() {
    // Show form to add new item
}

function showAddPurchaseForm() {
    document.getElementById('addPurchaseForm').classList.remove('d-none');
}

function cancelAddPurchase() {
    document.getElementById('addPurchaseForm').classList.add('d-none');
    document.getElementById('purchaseForm').reset();
}

// Initialize
updateTranslations();
