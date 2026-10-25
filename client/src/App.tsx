import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Route-level code splitting for fast initial storefront loading
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage').then((m) => ({ default: m.ShippingPolicyPage })));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage').then((m) => ({ default: m.ReturnPolicyPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then((m) => ({ default: m.FAQPage })));

// Sleek minimal loading fallback
const PageLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-8 h-8 border-2 border-white/10 border-t-[#C5A880] rounded-full animate-spin" />
    <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">লোড হচ্ছে...</span>
  </div>
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-9 h-9 border-2 border-slate-700 border-t-[#C5A880] rounded-full animate-spin" />
    <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">ADMIN PANEL LOADING...</span>
  </div>
);

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
        {/* Dedicated Standalone Admin Routes (completely isolated from public storefront layout) */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminDashboardPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminDashboardPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminDashboardPage />
              </Suspense>
            </AdminProtectedRoute>
          }
        />

        {/* Public Storefront Layout with Store Header, Announcement & Footer */}
        <Route path="/" element={<MainLayout cartCount={totalItems} />}>
          <Route index element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route
            path="shop"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage onAddToCart={handleAddToCart} />
              </Suspense>
            }
          />
          <Route
            path="category/:category"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage onAddToCart={handleAddToCart} />
              </Suspense>
            }
          />
          <Route
            path="new-arrivals"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage onAddToCart={handleAddToCart} />
              </Suspense>
            }
          />
          <Route
            path="sale"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShopPage onAddToCart={handleAddToCart} />
              </Suspense>
            }
          />
          <Route
            path="product/:slug"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ProductDetailsPage onAddToCart={handleAddToCart} />
              </Suspense>
            }
          />
          <Route
            path="cart"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CartPage />
              </Suspense>
            }
          />
          <Route
            path="checkout"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CheckoutPage />
              </Suspense>
            }
          />
          <Route
            path="order-success"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <OrderSuccessPage />
              </Suspense>
            }
          />
          <Route
            path="order-tracking"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <OrderTrackingPage />
              </Suspense>
            }
          />
          <Route
            path="shipping-policy"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ShippingPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="return-policy"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <ReturnPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="faq"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <FAQPage />
              </Suspense>
            }
          />

          {/* Fallback to Storefront Home */}
          <Route path="*" element={<HomePage onAddToCart={handleAddToCart} />} />
        </Route>
      </Routes>
    </>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
