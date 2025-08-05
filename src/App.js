import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Page1 from './Components/Page1';
import Page2 from './Components/Page2';
import Admin from './Components/Admin';
import Data from './Components/Data';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </Router>
  );
}

export default App;