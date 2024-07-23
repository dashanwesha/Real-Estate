
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';


const App = () => {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing/>} />
        </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
