import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from './HomePage';
import Login from './login';
import Signup from './signup';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import { UserProvider } from './UserContext';
import { CartProvider } from './CartContext';
import Cart from './Cart';
import AddProductPage from './AddProductPage';
import ProductList from './ProductList';
import ProductSort from './ProductSort';
import AddCardPage from './AddCardPage';
import ManageCards from './ManageCards';
import EditCard from './EditCard';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import ReceiptDetails from './ReceiptDetails';
import CompanyList from './CompanyList';
import CompanyDetail from './CompanyDetail';

function Layout() {
  const location = useLocation();
  const noNavBarRoutes = ['/login', '/signup'];

  return (
    <div>
      {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/:category" element={<ProductSort />} />
        <Route path="/:category/:subcategory" element={<ProductSort />} />
        <Route path="/editProfile" element={<EditProfile/>} />
        <Route path="/changePassword" element={<ChangePassword/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/addProduct" element={<AddProductPage/>} />
        <Route path="/products" component={ProductList} element={<ProductList/>} />
        <Route path="/addCardPage" element={<AddCardPage/>} />
        <Route path="/manageCards" element={<ManageCards/>} />
        <Route path="/editCard/:cardId" element={<EditCard/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/orderHistory" element={<OrderHistory />} />
       <Route path="/receipt/:receiptId" element={<ReceiptDetails />} />
       <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:companyName" element={<CompanyDetail />} />
        
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
