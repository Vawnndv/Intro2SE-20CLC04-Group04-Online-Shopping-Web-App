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

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // const signoutHandler = () => {
  //   ctxDispatch({ type: 'USER_LOGOUT' });
  //   localStorage.removeItem('userInfo');
  //   localStorage.removeItem('shippingAddress');
  // }
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentInfoScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
