import "./Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Badge from "react-bootstrap/Badge";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {Store} from "../../Store";

export default function Header() {
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart, userInfo} = state;

    const logoutHandler = () => {
        ctxDispatch({type: 'USER_LOGOUT'});
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentInfo');
    }

    return (
        <header>
            <div className="navbar-container container-fluid">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <div className="navbar-nav ms-auto d-flex align-items-center">
                            <a href="/" className="nav-item nav-link ms-5">About us</a>
                            
                            {/* user exist ? */}
                            {(userInfo) ? (
                                <div className="nav-item dropdown ms-5" title={userInfo.name}>
                                    <a href="/" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{userInfo.name}</a>
                                    
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <Link to="/profile" className="dropdown-item">Tài khoản</Link>
                                        <Link to="/order" className="dropdown-item">Đơn hàng</Link>
                                        <Link to="#signout" onClick={logoutHandler} className="dropdown-item">Đăng xuất</Link>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="nav-login" style={{textDecoration: 'none'}}>Đăng nhập</Link>
                            )}
                            
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
                            <Nav className="">
                                <Link to="/cart" className="nav-link">
                                    <FontAwesomeIcon icon="fa-solid fa-cart-shopping" id="cart-icon"/>
                                </Link>
                                <div className="d-flex flex-column align-items-start" id="cart-info">
                                    <span>Your shopping cart</span>
                                    <span>
                                        {cart.cartItems.length === 0 && (
                                            <Badge pill>
                                                0
                                            </Badge>
                                        )}
                                        {cart.cartItems.length > 0 && (
                                            <Badge pill>
                                                {cart.cartItems.reduce((a,c) => a + c.quantity, 0)}
                                            </Badge>
                                        )}
                                        &nbsp; products
                                    </span>
                                </div>
                            </Nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}