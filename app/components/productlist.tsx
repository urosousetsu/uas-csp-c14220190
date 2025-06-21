"use client"

import { useEffect, useState } from 'react';
import { Product, deleteProduct, fetchProducts } from '../lib/productApi';
import FormModal from './formModal';

type ProductListProps = {
  isAdmin: boolean;
};

export default function ProductList({ isAdmin }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    const { data, error } = await fetchProducts();
    if (data && !error) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await deleteProduct(id);
      if (!error) {
        loadProducts();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#2a2a2a] rounded w-1/4"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-1/2"></div>
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition duration-150"
          >
            Add New Product
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.nama_produk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${product.harga_satuan.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.quantity}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={isAdmin ? 4 : 3} 
                  className="px-6 py-8 text-center text-sm text-gray-400"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadProducts}
        product={selectedProduct}
        isEditing={isEditing}
      />
    </div>
  );
}