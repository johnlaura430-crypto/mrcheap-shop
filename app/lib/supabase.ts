import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SIMPLE Product type - matches your actual table
export type Product = {
  id: number;
  name: string;
  category?: string;
  buying_price?: number;
  selling_price?: number;
  stock?: number;
  barcode?: string;
  description?: string;
  created_at?: string;
  // Add any other columns you see in your table
};

// Get all products
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    return data as Product[];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Add a product
export async function addProduct(product: {
  name: string;
  category?: string;
  buying_price?: number;
  selling_price?: number;
  stock?: number;
  barcode?: string;
  description?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id: number) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
