'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Tag,
  DollarSign,
  Hash,
  RefreshCw
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { getProducts, addProduct, deleteProduct, type Product } from '../lib/supabase';

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

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search)
  );

  // Add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name.trim()) {
      alert('Product name required!');
      return;
    }
    
    try {
      setAdding(true);
      
      const productData = {
        name: newProduct.name.trim(),
        category: newProduct.category,
        buying_price: newProduct.buying_price ? parseFloat(newProduct.buying_price) : 0,
        selling_price: newProduct.selling_price ? parseFloat(newProduct.selling_price) : 0,
        stock: newProduct.stock ? parseInt(newProduct.stock) : 0,
        barcode: newProduct.barcode.trim() || undefined,
        description: newProduct.description.trim() || undefined,
      };
      
      const added = await addProduct(productData);
      setProducts([added, ...products]);
      
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
      alert('✅ Product added!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  // Delete product
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      alert('✅ Deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Delete failed');
    }
  };

  // Helper functions
  const formatPrice = (price?: number) => 
    price ? `TZS ${price.toLocaleString()}` : 'N/A';
  
  const calculateProfit = (buy?: number, sell?: number) => 
    (buy && sell) ? sell - buy : 0;
  
  const calculateMargin = (buy?: number, sell?: number) => 
    (buy && sell && buy > 0) ? (((sell - buy) / buy) * 100).toFixed(1) : '0.0';

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
            <p className="text-gray-600">Manage your shop products</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Add Product</h2>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <input
                        type="text"
                        required
                        placeholder="Product Name *"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Home & Kitchen</option>
                        <option>Stationery</option>
                      </select>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          placeholder="Buying Price *"
                          value={newProduct.buying_price}
                          onChange={(e) => setNewProduct({...newProduct, buying_price: e.target.value})}
                          className="px-3 py-2 border rounded-lg"
                        />
                        
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          placeholder="Selling Price *"
                          value={newProduct.selling_price}
                          onChange={(e) => setNewProduct({...newProduct, selling_price: e.target.value})}
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Stock *"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          className="px-3 py-2 border rounded-lg"
                        />
                        
                        <input
                          type="text"
                          placeholder="Barcode (Optional)"
                          value={newProduct.barcode}
                          onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                          className="px-3 py-2 border rounded-lg"
                        />
                      </div>
                      
                      <textarea
                        placeholder="Description (Optional)"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={2}
                      />
                      
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={adding}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {adding ? 'Adding...' : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
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
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No products found</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buying</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{product.name}</div>
                            {product.description && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {product.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatPrice(product.buying_price)}</td>
                          <td className="px-4 py-3 text-green-600 font-medium">
                            {formatPrice(product.selling_price)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-green-600 font-medium">
                              {formatPrice(calculateProfit(product.buying_price, product.selling_price))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {calculateMargin(product.buying_price, product.selling_price)}% margin
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`font-medium ${
                              !product.stock ? 'text-red-600' :
                              product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {product.stock || 0} units
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => alert(`Edit ${product.name} - Coming soon!`)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id, product.name || '')}
                                className="text-red-600 hover:text-red-900 p-1"
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
              )}
            </div>

            {/* Stats */}
            {products.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-700">Total Products</div>
                  <div className="text-2xl font-bold text-blue-800">{products.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-700">In Stock Value</div>
                  <div className="text-2xl font-bold text-green-800">
                    TZS {products.reduce((sum, p) => sum + ((p.buying_price || 0) * (p.stock || 0)), 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-700">Low Stock Items</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {products.filter(p => (p.stock || 0) < 10).length}
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
