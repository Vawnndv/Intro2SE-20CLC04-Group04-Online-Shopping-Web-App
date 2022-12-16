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
                    <img src={product.image} alt={product.name}/>
                    {/* <div className="buffer">Xem chi tiết</div> */}
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
        </div>
    )
};

export default Product;