import "./Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

var Header = () => {
    return (
        <header>
            <div className="navbar-container container-fluid">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <div className="navbar-nav ms-auto d-flex align-items-center">
                            <a href="/" className="nav-item nav-link ms-5">About us</a>
                            <div className="nav-item dropdown ms-5">
                                <a href="/" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">User</a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a href="/" className="dropdown-item">My account</a>
                                    <a href="/" className="dropdown-item">My orders</a>
                                    <a href="/" className="dropdown-item">Sign out</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="hero-container container-fluid d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-2 d-flex justify-content-center align-items-center">
                            <h1 className="logo">HKVTV</h1>
                        </div>
                        <div className="col-8">
                            <div className="search">
                                <input type="text" className="form-control" placeholder="Search product" />
                                <button className="btn btn-primary">
                                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                                </button>
                            </div>
                        </div>
                        <div className="col-2 d-flex justify-content-end align-items-center">
                            <FontAwesomeIcon icon="fa-solid fa-cart-shopping" id="cart-icon"/>
                            <div className="d-flex flex-column align-items-start" id="cart-info">
                                <span>Your shopping cart</span>
                                <span>(0) product</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;