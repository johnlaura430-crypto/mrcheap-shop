'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Upload,
  Tag,
  DollarSign,
  Hash,
  RefreshCw
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { supabase, getProducts, addProduct, deleteProduct } from '../lib/supabase';

interface Product {
  id: number;
  item_code: string;
  name: string;
  description: string | null;
  category: string;
  buying_price: number;
  selling_price: number;
  stock: number;
  min_stock: number;
  barcode: string | null;
  image_url: string | null;
  created_at: string;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    buying_price: '',
    selling_price: '',
    stock: '',
    barcode: '',
    description: '',
  });
  const [adding, setAdding] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    (product.barcode && product.barcode.includes(search))
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newProduct.name.trim()) {
      alert('Product name is required!');
      return;
    }
    
    if (!newProduct.buying_price || parseFloat(newProduct.buying_price) <= 0) {
      alert('Buying price must be greater than 0!');
      return;
    }
    
    if (!newProduct.selling_price || parseFloat(newProduct.selling_price) <= 0) {
      alert('Selling price must be greater than 0!');
      return;
    }
    
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      alert('Stock must be 0 or greater!');
      return;
    }
    
    try {
      setAdding(true);
      
      const productData = {
        name: newProduct.name.trim(),
        category: newProduct.category,
        buying_price: parseFloat(newProduct.buying_price),
        selling_price: parseFloat(newProduct.selling_price),
        stock: parseInt(newProduct.stock),
        barcode: newProduct.barcode.trim() || null,
        description: newProduct.description.trim() || null,
      };
      
      const addedProduct = await addProduct(productData);
      
      // Add to local state
      setProducts([addedProduct, ...products]);
      
      // Reset form
      setNewProduct({
        name: '',
        category: 'Electronics',
        buying_price: '',
        selling_price: '',
        stock: '',
        barcode: '',
        description: '',
      });
      
      setShowAddForm(false);
      alert('✅ Product added successfully!');
      
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(`❌ Failed to add product: ${error.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteProduct(id);
      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
      alert('✅ Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(`❌ Failed to delete product: ${error.message}`);
    }
  };

  const calculateProfit = (buying: number, selling: number) => selling - buying;
  const calculateProfitMargin = (buying: number, selling: number) => 
    buying > 0 ? (((selling - buying) / buying) * 100).toFixed(1) : '0.0';

  // Format currency for Tanzania (TZS)
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString('en-TZ')}`;
  };

  // Stock status color
  const getStockColor = (stock: number, minStock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < minStock) return 'text-orange-600';
    return 'text-green-600';
  };

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
            <p className="text-gray-600">Add, edit, and manage your shop products</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Search and Filter */}
        {!loading && (
          <>
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products by name, category, or barcode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                >
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Home & Kitchen</option>
                  <option>Stationery</option>
                </select>
              </div>
            </div>

            {/* Add Product Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Add New Product</h2>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={adding}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., Wireless Earphones"
                          disabled={adding}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          disabled={adding}
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Home & Kitchen">Home & Kitchen</option>
                          <option value="Stationery">Stationery</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Cosmetics">Cosmetics</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Other">Other</option>
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
                            value={newProduct.buying_price}
                            onChange={(e) => setNewProduct({...newProduct, buying_price: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="0.00"
                            disabled={adding}
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
                            value={newProduct.selling_price}
                            onChange={(e) => setNewProduct({...newProduct, selling_price: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="0.00"
                            disabled={adding}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="0"
                            disabled={adding}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Scan or enter barcode"
                            disabled={adding}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Product description..."
                          rows={2}
                          disabled={adding}
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={adding}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {adding ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Adding...
                            </>
                          ) : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                          disabled={adding}
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buying Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Selling Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Barcode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.item_code && (
                            <div className="text-xs text-gray-500">Code: {product.item_code}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{formatCurrency(product.buying_price)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-green-600 font-medium">
                            {formatCurrency(product.selling_price)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-green-600 font-medium">
                            {formatCurrency(calculateProfit(product.buying_price, product.selling_price))}
                          </div>
                          <div className="text-xs text-gray-500">
                            {calculateProfitMargin(product.buying_price, product.selling_price)}% margin
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-medium ${getStockColor(product.stock, product.min_stock)}`}>
                            {product.stock} units
                          </div>
                          {product.stock < product.min_stock && product.stock > 0 && (
                            <div className="text-xs text-orange-500">Low stock!</div>
                          )}
                          {product.stock === 0 && (
                            <div className="text-xs text-red-500">Out of stock!</div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">
                          {product.barcode || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => alert(`Edit ${product.name} - Coming soon!`)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {search ? 'No products found matching your search' : 'No products yet'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {search ? 'Try a different search term' : 'Click "Add Product" to get started'}
                  </p>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            {products.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-700">Total Products</div>
                  <div className="text-2xl font-bold text-blue-800">{products.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-700">Total Stock Value</div>
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(products.reduce((sum, p) => sum + (p.buying_price * p.stock), 0))}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-700">Avg. Profit Margin</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {(
                      products.reduce((sum, p) => 
                        sum + parseFloat(calculateProfitMargin(p.buying_price, p.selling_price)), 0) / 
                      (products.length || 1)
                    ).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-700">Low Stock Items</div>
                  <div className="text-2xl font-bold text-red-800">
                    {products.filter(p => p.stock < p.min_stock).length}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
