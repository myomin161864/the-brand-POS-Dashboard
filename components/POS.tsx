import React, { useState, useMemo } from 'react';
import { Product, CartItem, Sale } from '../types';
import ProductCard from './ProductCard';
import Cart from './Cart';

interface POSProps {
  products: Product[];
  onAddSale: (newSale: Omit<Sale, 'id' | 'date'>) => void;
}

const POS: React.FC<POSProps> = ({ products, onAddSale }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.product.id !== productId);
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const handleCheckout = (total: number) => {
    if (cartItems.length > 0) {
      onAddSale({ items: cartItems, total });
      setCartItems([]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
            <input 
                type="text" 
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedCategory === category ? 'bg-brand-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-96 flex-shrink-0">
        <Cart 
            items={cartItems} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout} 
        />
      </div>
    </div>
  );
};

export default POS;