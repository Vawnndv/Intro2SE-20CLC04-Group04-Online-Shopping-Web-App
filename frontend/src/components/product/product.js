import {Link} from "react-router-dom";
import './product.css'
import Rating from "../rating/rating";

function Product(props) {
    const {product} = props;
    return (
        <div className="product" >
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name}/>
            </Link>

            <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    
                    <div className="product-info-bottom">
                        <div className="product-info-bottom-left">
                            <p style={{fontSize: '20px'}}>Còn {product.quanity} sản phẩm</p>
                            <p className="product-info-price">{formatPrice(product.price)}</p>
                            <Rating rating={product.rating} numReviews={product.reviews}/>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
};

function formatPrice(price){
    price = price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    return price;
}

export default Product;