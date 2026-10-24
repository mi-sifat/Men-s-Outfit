import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { FAQPage } from './pages/FAQPage';
import { CartProvider, useCart } from './context/CartContext';

function AppContent() {
  const { totalItems, addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.productId || product.id,
      variantId: product.variantId || `${product.id}-${product.size || 'M'}-${product.color || 'Black'}`,
      title: product.title,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '',
      size: product.size || 'M',
      color: product.color || 'Jet Black',
      quantity: product.quantity || 1,
      maxStock: product.maxStock || 20,
    });

    toast.success(`"${product.title}" (${product.size || 'M'}) কার্টে যোগ হয়েছে!`, {
      style: {
        background: '#0F172A',
        color: '#fff',
        fontSize: '13px',
        border: '1px solid rgba(197, 168, 128, 0.3)',
      },
      iconTheme: {
        primary: '#C5A880',
        secondary: '#0F172A',
      },
    });
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<MainLayout cartCount={totalItems} />}>
          <Route index element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
          <Route path="category/:category" element={<ShopPage onAddToCart={handleAddToCart} />} />
          <Route path="new-arrivals" element={<ShopPage onAddToCart={handleAddToCart} />} />
          <Route path="sale" element={<ShopPage onAddToCart={handleAddToCart} />} />
          <Route path="product/:slug" element={<ProductDetailsPage onAddToCart={handleAddToCart} />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="order-tracking" element={<OrderTrackingPage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="return-policy" element={<ReturnPolicyPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage onAddToCart={handleAddToCart} />} />
        </Route>
      </Routes>
    </>
  );
}

export function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
