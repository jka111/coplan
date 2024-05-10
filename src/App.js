import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Nav from "./components/Nav"
import AddFoof from './pages/AddFoof';
import Om from './pages/Om';
import Måltid from './pages/Måltid';

function App() {

  
  return (
    <div className="App">
<Router>
<Nav/>
<Routes>
  <Route path="/" element={ <Home/>} />
  <Route path="/addfood" element={ <AddFoof/> } />  {/* ja det skulle stå food:P */}
  <Route path="/om" element={ <Om/> } />  
  <Route path="/:foodId" element={ <Måltid/> } />  




</Routes>
</Router>


    </div>
  );
}

export default App;
