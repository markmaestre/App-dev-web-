import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Dashboard/Home';
import Register from './Components/Dashboard/Register';
import Login from './Components/Dashboard/Login';
import AdminDashboard from './Components/Admin/adminDashboard';
import UserDashboard from './Components/Client/userDashboard';
import Learning from './Components/Client/learning';
import Chatbot from './Components/Client/chatbot';
import Market from './Components/Client/market';
import CustomerDashboard from './Components/Customer/Customer';
import CartPage from './Components/Customer/CartPage';
import MarketDetails from './Components/Customer/MarketPage';
import PaymentHistory from './Components/Customer/PaymentHistory';
import Order from './Components/Customer/Order';
import Wallet from './Components/Client/Wallet';
import LiveWeather from './Components/Client/Weather';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/assistant" element={<Chatbot/>}/>
        <Route path="/market" element={<Market />} />
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<MarketDetails />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/weather" element={<LiveWeather />} />
      </Routes>

    </Router>
  );
}

export default App;
