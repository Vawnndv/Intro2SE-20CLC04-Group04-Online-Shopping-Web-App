import './App.css';
import './components/fontawesome/FontAwesome.js';
import Header from './components/header/Header.js';
import Homepage from './components/homepage/homepage';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductScreen from "./components/homepage/ProductScreen";
import {Container} from "react-bootstrap";
import Login from './components/authentication/login/login';
import Register from './components/authentication/register/register';

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <Header/>
          <main>
              <Container className="mt-3">
                  <Routes>
                      <Route path="/product/:slug" element={<ProductScreen />} />
                      <Route path="/" element={<Homepage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                  </Routes>
              </Container>
          </main>
        </div>
    </BrowserRouter>
  );
}

export default App;
