import './App.css';
import './components/fontawesome/FontAwesome.js';
import Header from './components/header/Header.js';
import Homepage from './components/homepage/homepage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductScreen from "./components/homepage/ProductScreen";
import { Container } from "react-bootstrap";
import Login from './components/authentication/login/login';
import Register from './components/authentication/register/register';
import ProfileScreen from './components/profile/ProfileScreen';
import CartScreen from "./components/homepage/CartScreen";
import { useContext } from 'react';
import { Store } from './Store';
import ShippingScreen from './components/checkout/ShippingScreen';
import PaymentInfoScreen from './components/checkout/PaymentInfoScreen';
import PlaceOrderScreen from './components/order/PlaceOrderScreen';
import OrderHistoryScreen from './components/orderhistory/OrderHistoryScreen';
import OrderScreen from './components/order/OrderScreen';
import { useState } from 'react';
import { useEffect } from 'react';
import { getError } from './utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import SearchScreen from './components/searchscreen/SearchScreen';
import Forget from './components/authentication/login/forget';
import ProtectedRoute from "./components/protectedroute/ProtectedRoute";
import AdminRoute from "./components/adminroute/AdminRoute";
import ProductListScreen from "./components/productlistscreen/ProductListScreen";
import ProductEditScreen from "./components/producteditscreen/ProductEditScreen";
import OrderListScreen from "./components/orderlistscreen/OrderListScreen";
import UserListScreen from "./components/userlistscreen/UserListScreen";
import UserEditScreen from "./components/usereditscreen/UserEditScreen";
import CheckoutFail from './components/checkout/CheckoutFail';
import VoucherListScreen from "./components/voucherlistscreen/VoucherListScreen";
import VoucherEditScreen from "./components/vouchereditscreen/VoucherEditScreen";
import Footer from './components/footer/Footer';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // const signoutHandler = () => {
  //   ctxDispatch({ type: 'USER_LOGOUT' });
  //   localStorage.removeItem('userInfo');
  //   localStorage.removeItem('shippingAddress');
  // }

  // const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    }
  })

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/forget" element={<Forget />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentInfoScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/checkoutfail" element={<CheckoutFail />} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
              <Route path="/admin/vouchers" element={<AdminRoute><VoucherListScreen /></AdminRoute>} />
              <Route path="/admin/voucher/:id" element={<AdminRoute><VoucherEditScreen /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>} />
              <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>} />
            </Routes>
          </Container>
        </main>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
