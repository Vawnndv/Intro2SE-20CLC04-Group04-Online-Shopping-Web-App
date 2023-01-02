import {Link} from "react-router-dom";
import './product.css'
import Rating from "../rating/rating";
import {formatPrice} from '../../utils'

function Product(props) {
    const {product} = props;
    return (
        <div className="product" >
            <div className="hover-text">Xem chi tiết</div>
            <div className="details">
                <Link to={`/product/${product.slug}`} className="product-thumbnail" style={{ textDecoration: 'none' }}>
                    <img className="product-img" src={product.image} alt={product.name}/>
                    {/* <div className="buffer">Xem chi tiết</div> */}
                </Link>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="product-info">
                        <div className="product-name">
                            <span>{product.name}</span>
                        </div>
                        <div className="product-quantity">
                            <span>Còn {product.quantity} sản phẩm</span>
                        </div>
                        <div className="product-price">
                            <span>{formatPrice(product.price)}</span>
                        </div>
                        <div className="product-rating">
                            <Rating rating={product.rating} numReviews={product.reviews}/>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
};

export default Product;