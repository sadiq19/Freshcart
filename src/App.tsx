import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './state/CartContext';
import { UserProvider } from './state/UserContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AllProductsPage } from './pages/AllProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { RecipesPage } from './pages/RecipesPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './App.css';

function App() {
    return (
        <Router>
            <UserProvider>
                <CartProvider>
                    <div className="app">
                        <Header />
                        <main className="main">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<AllProductsPage />} />
                                <Route path="/products/:categorySlug" element={<CategoryPage />} />
                                <Route path="/product/:id" element={<ProductDetailPage />} />
                                <Route path="/recipes" element={<RecipesPage />} />
                                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/orders/:id" element={<OrderTrackingPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </CartProvider>
            </UserProvider>
        </Router>
    );
}

export default App;
