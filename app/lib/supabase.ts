import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your existing table
export interface Product {
  id: number;
  name: string;
  category?: string;
  buying_price?: number;
  selling_price?: number;
  stock?: number;
  barcode?: string;
  description?: string;
  created_at?: string;
  // Add other columns you see in your table
}

// Helper function to get products
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

// Helper function to add product
export async function addProduct(product: {
  name: string;
  category?: string;
  buying_price?: number;
  selling_price?: number;
  stock?: number;
  barcode?: string;
  description?: string;
}): Promise<Product | null> {
  try {
    // Clean up data - convert empty strings to null
    const cleanProduct: any = {};
    
    if (product.name) cleanProduct.name = product.name.trim();
    if (product.category) cleanProduct.category = product.category;
    if (product.buying_price) cleanProduct.buying_price = parseFloat(product.buying_price.toString());
    if (product.selling_price) cleanProduct.selling_price = parseFloat(product.selling_price.toString());
    if (product.stock) cleanProduct.stock = parseInt(product.stock.toString());
    if (product.barcode && product.barcode.trim()) cleanProduct.barcode = product.barcode.trim();
    if (product.description && product.description.trim()) cleanProduct.description = product.description.trim();
    
    console.log('Adding product:', cleanProduct);
    
    const { data, error } = await supabase
      .from('products')
      .insert([cleanProduct])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      console.error('Error details:', error.details, error.hint, error.message);
      throw error;
    }
    
    console.log('Product added successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error in addProduct:', error);
    throw error;
  }
}

// Helper function to delete product
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
}
