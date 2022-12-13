import './homepage.css'
import '../stylesheet/style.css'
import data from '../../data.js'
import {Link} from "react-router-dom";

var Homepage = () => {
    return (
        <main>
            <h1>Các sản phẩm nổi bật</h1>
            <div className="products">
            {
                data.products.map((product) => (
                    <div className="product" key={product.slug}>
                        <Link to={`/product/${product.slug}`}>
                            <img src={product.image} alt={product.name} />
                        </Link>
                        
                        <Link to={`/product/${product.slug}`}>
                            <div className="product-info">
                                <p>{product.name}</p>
                                <p>{product.price}đ</p>
                            </div>
                        </Link>
                        
                    </div>
                ))
            }
            </div>
        </main>
    );
};
export default Homepage;