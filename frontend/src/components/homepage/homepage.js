import './homepage.css'
import '../stylesheet/style.css'
import data from '../../data.js'

var Homepage = () => {
    return (
        <main>
            <h1>Các sản phẩm nổi bật</h1>
            <div className="products">
            {
                data.products.map((product) => (
                    <div className="product" key={product.slug}>
                        <a href={`/product/${product.slug}`}>
                            <img src={product.image} alt={product.name} />
                        </a>
                        
                        <a href={`/product/${product.slug}`}>
                            <div className="product-info">
                                <p>{product.name}</p>
                                <p>{product.price}đ</p>
                            </div>
                        </a>
                        
                    </div>
                ))
            }
            </div>
        </main>
    );
};
export default Homepage;