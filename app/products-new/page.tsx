'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  DollarSign,
  Tag,
  Hash,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Simple Product Type
type Product = {
  id: number;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  barcode?: string;
  description?: string;
  createdAt: string;
};

export default function ProductsNewPage() {
  // Load products from localStorage on initial render
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mrcheap-products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved products:', e);
          return [];
        }
      }
    }
    return [];
  });

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    buyingPrice: '',
    sellingPrice: '',
    stock: '',
    barcode: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Save to localStorage whenever products change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mrcheap-products', JSON.stringify(products));
    }
  }, [products]);

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    (product.barcode && product.barcode.includes(search))
  );

  // Handle Add Product - SIMPLE & WORKING!
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newProduct.name.trim()) {
      alert('❌ Please enter product name!');
      return;
    }
    
    if (!newProduct.buyingPrice || parseFloat(newProduct.buyingPrice) <= 0) {
      alert('❌ Buying price must be greater than 0!');
      return;
    }
    
    if (!newProduct.sellingPrice || parseFloat(newProduct.sellingPrice) <= 0) {
      alert('❌ Selling price must be greater than 0!');
      return;
    }
    
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      alert('❌ Stock must be 0 or greater!');
      return;
    }
    
    // Create new product
    const product: Product = {
      id: Date.now(), // Simple ID using timestamp
      name: newProduct.name.trim(),
      category: newProduct.category,
      buyingPrice: parseFloat(newProduct.buyingPrice),
      sellingPrice: parseFloat(newProduct.sellingPrice),
      stock: parseInt(newProduct.stock),
      barcode: newProduct.barcode.trim() || undefined,
      description: newProduct.description.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    
    // Add to products array
    setProducts(prev => [product, ...prev]);
    
    // Show success message
    setSuccessMessage(`✅ "${product.name}" added successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset form
    setNewProduct({
      name: '',
      category: 'Electronics',
      buyingPrice: '',
      sellingPrice: '',
      stock: '',
      barcode: '',
      description: ''
    });
    
    // Close form
    setShowForm(false);
  };

  // Handle Delete
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('✅ Product deleted!');
    }
  };

  // Calculate profit
  const calculateProfit = (buying: number, selling: number) => selling - buying;
  const calculateMargin = (buying: number, selling: number) => 
    buying > 0 ? (((selling - buying) / buying) * 100).toFixed(1) : '0.0';

  // Format currency
  const formatTZS = (amount: number) => 
    `TZS ${amount.toLocaleString('en-TZ')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Product Management
            </h1>
            <p className="text-gray-600">Add and manage your shop products</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
            
            <button
              onClick={() => {
                const dataStr = JSON.stringify(products, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const link = document.createElement('a');
                link.setAttribute('href', dataUri);
                link.setAttribute('download', 'mrcheap-products-backup.json');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('✅ Products backed up to JSON file!');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Backup Products
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, category, or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Wireless Earphones"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Electronics">📱 Electronics</option>
                      <option value="Clothing">👕 Clothing</option>
                      <option value="Home & Kitchen">🏠 Home & Kitchen</option>
                      <option value="Stationery">📚 Stationery</option>
                      <option value="Footwear">👟 Footwear</option>
                      <option value="Cosmetics">💄 Cosmetics</option>
                      <option value="Groceries">🛒 Groceries</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Buying Price (TZS) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={newProduct.buyingPrice}
                        onChange={(e) => setNewProduct({...newProduct, buyingPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Selling Price (TZS) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={newProduct.sellingPrice}
                        onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Initial Stock *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode (Optional)
                      </label>
                      <input
                        type="text"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="8901234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Product details..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {search ? 'Try a different search term' : 'Add your first product to get started'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
                <div className="text-sm text-gray-600">
                  Total Value: {formatTZS(products.reduce((sum, p) => sum + (p.buyingPrice * p.stock), 0))}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prices
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                            {product.barcode && (
                              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {product.barcode}
                              </span>
                            )}
                          </div>
                          {product.description && (
                            <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="text-gray-600">Buy: </span>
                              <span className="font-medium">{formatTZS(product.buyingPrice)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Sell: </span>
                              <span className="font-medium text-green-600">{formatTZS(product.sellingPrice)}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-green-600">
                              {formatTZS(calculateProfit(product.buyingPrice, product.sellingPrice))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {calculateMargin(product.buyingPrice, product.sellingPrice)}% margin
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className={`font-medium ${
                            product.stock === 0 ? 'text-red-600' :
                            product.stock < 5 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {product.stock} units
                          </div>
                          {product.stock < 5 && product.stock > 0 && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                              <AlertCircle className="w-3 h-3" />
                              Low stock
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                              <AlertCircle className="w-3 h-3" />
                              Out of stock
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newStock = prompt(`Enter new stock for "${product.name}":`, product.stock.toString());
                                if (newStock !== null && !isNaN(parseInt(newStock))) {
                                  setProducts(prev => prev.map(p => 
                                    p.id === product.id ? {...p, stock: parseInt(newStock)} : p
                                  ));
                                  alert('✅ Stock updated!');
                                }
                              }}
                              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                            >
                              Update Stock
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        {products.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Total Products</div>
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Total Stock Value</div>
              <div className="text-2xl font-bold text-green-600">
                {formatTZS(products.reduce((sum, p) => sum + (p.buyingPrice * p.stock), 0))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Low Stock Items</div>
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.stock < 5).length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock === 0).length}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
