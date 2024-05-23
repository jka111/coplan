// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav';
import AddFoof from './/pages/AddFoof';
import Om from './pages/Om';
import Måltid from './pages/Måltid';
import Mealplanner from './components/Mealplanner';

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/addfood" element={<AddFoof />} />
          <Route path="/om" element={<Om />} />
          <Route path="/:foodId" element={<Måltid />} />
          <Route path="/mealplanner" element={<Mealplanner />} /> {/* Mealplanner-fanen */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
