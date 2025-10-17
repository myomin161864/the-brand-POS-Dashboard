import React from 'react';
import { CartItem } from '../types';
import { TrashIcon, PlusIcon, MinusIcon } from './Icons';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: (total: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemoveFromCart, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckoutClick = () => {
    onCheckout(total);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 h-full flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-gray-100">Current Order</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>Your cart is empty</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.product.id} className="flex items-center space-x-4">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-100">{item.product.name}</p>
                <p className="text-sm text-positive">${item.product.price.toFixed(2)}</p>
                <div className="flex items-center mt-1">
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
                        <MinusIcon className="w-4 h-4 text-gray-300"/>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
                        <PlusIcon className="w-4 h-4 text-gray-300"/>
                    </button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-bold text-positive">${(item.product.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => onRemoveFromCart(item.product.id)} className="text-negative hover:opacity-75 mt-2">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-5 border-t border-gray-800 mt-auto">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span className="font-medium text-positive">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax (8%)</span>
              <span className="font-medium text-positive">${tax.toFixed(2)}</span>
            </div>
            <hr className="my-2 border-gray-700"/>
            <div className="flex justify-between font-bold text-xl text-positive">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckoutClick}
            disabled={items.length === 0}
            className="w-full bg-brand-accent text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;