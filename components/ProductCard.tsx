import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg group overflow-hidden flex flex-col">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-md font-semibold text-gray-100 truncate">{product.name}</h4>
        <p className="text-sm text-gray-400 mb-2">{product.category}</p>
        <div className="mt-auto">
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-positive">${product.price.toFixed(2)}</p>
                <button
                onClick={() => onAddToCart(product)}
                className="bg-brand-primary text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transform transition-transform active:scale-95"
                >
                Add
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;