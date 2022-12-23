import "./Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Badge from "react-bootstrap/Badge";
import {Nav, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {Store} from "../../Store";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "../searchbox/SearchBox";

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
                                        <Link to="/orderhistory" className="dropdown-item">Đơn hàng</Link>
                                        <Link to="#signout" onClick={logoutHandler} className="dropdown-item">Đăng xuất</Link>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="nav-login" style={{textDecoration: 'none'}}>Đăng nhập</Link>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="admin-nav-dropdown">
                                    <LinkContainer to="/dashbroad">
                                        <NavDropdown.Item>Dashbroad</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/productlist">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/orderlist">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/userlist">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                            
                        </div>
                    </nav>
                </div>
            </div>
            <div className="hero-container container-fluid d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-2 d-flex justify-content-center align-items-center">
                            <LinkContainer to="/">
                                <h1 className="logo">HKVTV</h1>
                            </LinkContainer>
                        </div>
                        <div className="col-8">
                            {/* <Route
                                render={(history) => <SearchBox history={history}></SearchBox> >
                            </Route> */}
                            <SearchBox />
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