import "./stylesheet/Header.css";

var Header = () => {
    return (
        <header className="container-fluid">
            <div className="container">
            <nav className="navbar navbar-expand-md">
                <div className="navbar-nav me-auto">
                <a href="/" className="nav-item nav-link ms-5">About us</a>
                </div>
                <div className="navbar-nav ms-auto">
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
            <div className="container">
            <div className="row">
                <div className="col-2 d-flex justify-content-center align-items-center">
                <h1 className="logo">HKVTV</h1>
                </div>
                <div className="col-8">
                <div className="search">
                    <input type="text" className="form-control" placeholder="Search product" />
                    <button className="btn btn-primary">Search</button>
                </div>
                </div>
                <div className="col-2 d-flex justify-content-end align-items-center">
                <i className="fa-solid fa-cart-shopping" id="cart-icon" />
                <div className="d-flex flex-column" id="cart-info">
                    <span>Your shopping cart</span>
                    <span>(0) product</span>
                </div>
                </div>
            </div>
            </div>
        </header>
    );
};
export default Header;