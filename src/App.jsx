import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Facilities from './pages/Facilities';
import Nearby from './pages/Nearby';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import DailyBooking from './pages/DailyBooking.jsx';
import Admin from './pages/Admin.jsx';

import ScrollToTop from './components/ScrollToTop';
import FloatingSocial from './components/FloatingSocial/FloatingSocial';

function App() {
  return (
    <>
      <ScrollToTop />
      <FloatingSocial />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/daily-booking" element={<DailyBooking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
