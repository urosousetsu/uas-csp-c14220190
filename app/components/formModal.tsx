"use client"

import { useEffect, useState } from 'react';
import { Product, addProduct, updateProduct } from '../lib/productApi';

type FormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product;
  isEditing: boolean;
};

export default function FormModal({ isOpen, onClose, onSave, product, isEditing }: FormModalProps) {
  const [formData, setFormData] = useState({
    nama_produk: '',
    harga_satuan: '',  
    quantity: '',      
  });
  
  const [errors, setErrors] = useState({
    nama_produk: '',
    harga_satuan: '',
    quantity: '',
  });

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        nama_produk: product.nama_produk,
        harga_satuan: product.harga_satuan.toString(),  
        quantity: product.quantity.toString(),      
      });
    } else {
      setFormData({
        nama_produk: '',
        harga_satuan: '', 
        quantity: '',      
      });
    }
  }, [product, isEditing, isOpen]);

  const validate = () => {
    let valid = true;
    const newErrors = { nama_produk: '', harga_satuan: '', quantity: '' };

    if (!formData.nama_produk.trim()) {
      newErrors.nama_produk = 'Product name is required';
      valid = false;
    }

    const price = parseFloat(formData.harga_satuan);
    if (isNaN(price) || price <= 0) {
      newErrors.harga_satuan = 'Price must be greater than 0';
      valid = false;
    }


    const qty = parseInt(formData.quantity);
    if (isNaN(qty) || qty < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const productData = {
      nama_produk: formData.nama_produk,
      harga_satuan: parseFloat(formData.harga_satuan),
      quantity: parseInt(formData.quantity),
    };

    if (isEditing && product) {
      await updateProduct(product.id, productData);
    } else {
      await addProduct(productData);
    }
    
    onSave();
    onClose();
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-md transform rounded-lg bg-[#1a1a1a] p-6 shadow-xl transition-all">
            <h3 className="text-lg font-medium leading-6 mb-4">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nama_produk" className="block text-sm font-medium text-gray-300">
                  Product Name
                </label>
                <input
                  id="nama_produk"
                  type="text"
                  value={formData.nama_produk}
                  onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
                {errors.nama_produk && <p className="mt-1 text-sm text-red-400">{errors.nama_produk}</p>}
              </div>
              
              <div>
                <label htmlFor="harga_satuan" className="block text-sm font-medium text-gray-300">
                  Price
                </label>
                <input
                  id="harga_satuan"
                  type="number"
                  value={formData.harga_satuan}
                  onChange={(e) => setFormData({ ...formData, harga_satuan: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter price"
                  step="0.01"
                />
                {errors.harga_satuan && <p className="mt-1 text-sm text-red-400">{errors.harga_satuan}</p>}
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-400">{errors.quantity}</p>}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}