import { supabase } from './supabaseClient';

export type Product = {
  id: number;
  nama_produk: string;
  harga_satuan: number;
  quantity: number;
};

export const fetchProducts = async (): Promise<{ data: Product[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  
  return { data, error };
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  return { data, error };
};

export const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id'>>): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteProduct = async (id: number): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  return { error };
};