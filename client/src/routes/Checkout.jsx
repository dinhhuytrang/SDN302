import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from '../components/Checkout/Checkout';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
