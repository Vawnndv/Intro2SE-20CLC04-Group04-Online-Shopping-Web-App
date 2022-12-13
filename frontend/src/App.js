import './App.css';
import Header from './components/header/Header.js';
import Homepage from './components/homepage/homepage';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductScreen from "./components/homepage/ProductScreen";

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <Header/>
          <main>
              <Routes>
                  <Route path="/product/:slug" element={<ProductScreen />} />
                  <Route path="/" element={<Homepage />} />
              </Routes>
          </main>
        </div>
    </BrowserRouter>
  );
}

export default App;
