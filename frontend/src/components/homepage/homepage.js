import './homepage.css'
import data from '../../data.js'

var Homepage = () => {
    return (
        <main>
            <h1>Các sản phẩm nổi bật</h1>
            <div className="products">
            {
                data.products.map((product) => (
                <div className="product" key={product.slug}>
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
                <p>{product.price}</p>
                </div>))
            }
            </div>
        </main>
    );
};
export default Homepage;