// Supabase configuration
const SUPABASE_URL = 'https://vnuipfkdhtajjbuwmkbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudWlwZmtkaHRhampidXdta2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTQzNzksImV4cCI6MjA4Mzg3MDM3OX0.Qq2q3pqoQ3No6PO2LEQuYpZZckCmP6M2b50tx719M5Q';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Translation dictionary
const translations = {
    en: {
        // Login
        login: "Login",
        username: "Username",
        password: "Password",
        logout: "Logout",
        invalidCredentials: "Invalid username or password",
        
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
        invalidCredentials: "Nenosiri au jina la mtumiaji si sahihi",
        
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

// Simple user credentials (for demo - in production use Supabase Auth)
const users = {
    'admin': 'admin123',
    'mlawa': 'admin123'
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
            if (element.type === 'submit' || element.type === 'button') {
                element.value = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// Login function
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication check
    if (users[username] && users[username] === password) {
        currentUser = username;
        document.getElementById('loginScreen').classList.add('d-none');
        document.getElementById('app').classList.remove('d-none');
        showSection('dashboard');
        loadDashboard();
    } else {
        const message = currentLanguage === 'en' 
            ? 'Invalid username or password' 
            : 'Nenosiri au jina la mtumiaji si sahihi';
        document.getElementById('loginMessage').textContent = message;
        document.getElementById('loginMessage').classList.remove('d-none');
    }
});

function logout() {
    currentUser = null;
    document.getElementById('app').classList.add('d-none');
    document.getElementById('loginScreen').classList.remove('d-none');
    document.getElementById('loginForm').reset();
    document.getElementById('loginMessage').classList.add('d-none');
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
    const { data: todaySales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('sale_date', today);
    
    if (salesError) {
        console.error('Error fetching sales:', salesError);
    }
    
    const totalSales = todaySales?.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0) || 0;
    
    // Get all items for stock valuation
    const { data: items, error: itemsError } = await supabase.from('items').select('*');
    
    if (itemsError) {
        console.error('Error fetching items:', itemsError);
    }
    
    const stockValue = items?.reduce((sum, item) => sum + (item.stock * parseFloat(item.buying_price)), 0) || 0;
    
    // Get low stock items (less than 10)
    const lowStock = items?.filter(item => item.stock < 10) || [];
    
    // Get recent sales
    const { data: recentSales, error: recentError } = await supabase
        .from('sales')
        .select(`
            *,
            items (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
    
    const html = `
        <div class="row">
            <div class="col-md-4">
                <div class="stat-card primary">
                    <h5 data-i18n="todaysSales">Today's Sales</h5>
                    <h3>$${totalSales.toFixed(2)}</h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card success">
                    <h5 data-i18n="currentStockValue">Current Stock Value</h5>
                    <h3>$${stockValue.toFixed(2)}</h3>
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
                        ${recentSales && recentSales.length > 0 ? `
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentSales.map(sale => `
                                        <tr>
                                            <td>${sale.items.name}</td>
                                            <td>${sale.quantity}</td>
                                            <td>$${parseFloat(sale.total_amount).toFixed(2)}</td>
                                            <td>${sale.sale_date}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : '<p>No recent sales</p>'}
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
    const { data: items, error } = await supabase.from('items').select('*').order('name');
    
    if (error) {
        alert('Error loading items: ' + error.message);
        return;
    }
    
    const html = `
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
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
                                    ${items && items.length > 0 ? items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>$${parseFloat(item.buying_price).toFixed(2)}</td>
                                            <td>$${parseFloat(item.selling_price).toFixed(2)}</td>
                                            <td>${item.stock}</td>
                                            <td>
                                                <button class="btn btn-sm btn-warning" onclick="editItem('${item.id}')" data-i18n="edit">Edit</button>
                                                <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')" data-i18n="delete">Delete</button>
                                            </td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="5" class="text-center">No items found</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add Item Form (hidden initially) -->
        <div id="addItemForm" class="card mt-4 d-none">
            <div class="card-header">
                <h5 data-i18n="addItem">Add Item</h5>
            </div>
            <div class="card-body">
                <form id="itemForm">
                    <div class="row">
                        <div class="col-md-3">
                            <label data-i18n="itemName">Item Name</label>
                            <input type="text" class="form-control" id="itemName" required>
                        </div>
                        <div class="col-md-3">
                            <label data-i18n="buyingPrice">Buying Price</label>
                            <input type="number" class="form-control" id="itemBuyingPrice" required min="0" step="0.01">
                        </div>
                        <div class="col-md-3">
                            <label data-i18n="sellingPrice">Selling Price</label>
                            <input type="number" class="form-control" id="itemSellingPrice" required min="0" step="0.01">
                        </div>
                        <div class="col-md-3">
                            <label data-i18n="stock">Initial Stock</label>
                            <input type="number" class="form-control" id="itemStock" value="0" min="0">
                        </div>
                    </div>
                    <div class="mt-3">
                        <button type="submit" class="btn btn-primary" data-i18n="save">Save</button>
                        <button type="button" class="btn btn-secondary" onclick="cancelAddItem()" data-i18n="cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = html;
    updateTranslations();
    
    // Add form submit handler for item form
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('itemName').value;
            const buyingPrice = parseFloat(document.getElementById('itemBuyingPrice').value);
            const sellingPrice = parseFloat(document.getElementById('itemSellingPrice').value);
            const stock = parseInt(document.getElementById('itemStock').value) || 0;
            
            const { error } = await supabase
                .from('items')
                .insert([{
                    name: name,
                    buying_price: buyingPrice,
                    selling_price: sellingPrice,
                    stock: stock
                }]);
            
            if (!error) {
                alert('Item added successfully!');
                cancelAddItem();
                loadItems();
            } else {
                alert('Error: ' + error.message);
            }
        });
    }
}

function showAddItemForm() {
    document.getElementById('addItemForm').classList.remove('d-none');
}

function cancelAddItem() {
    document.getElementById('addItemForm').classList.add('d-none');
    document.getElementById('itemForm').reset();
}

async function editItem(itemId) {
    // You can implement this later
    alert('Edit functionality coming soon!');
}

async function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);
        
        if (!error) {
            alert('Item deleted successfully!');
            loadItems();
        } else {
            alert('Error: ' + error.message);
        }
    }
}

// Initialize
updateTranslations();
