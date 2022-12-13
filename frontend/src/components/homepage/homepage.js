import './homepage.css'
import '../stylesheet/style.css'
import data from '../../data.js'
import {Link} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import axios from "axios";
import logger from 'use-reducer-logger';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, products: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading:false, error: action.payload};
        default:
            return state;
    }
};

let Homepage = () => {
    //const [products, setProduct] = useState([]);
    const [{loading, error, products}, dispatch] = useReducer(logger(reducer), {
        loading: true,
        error: '',
        products: [],
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST'});
            try {
                const result = await axios.get('/api/products');
                dispatch({type: 'FETCH_SUCCESS', payload: result.data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message});
            };

            // setProduct(result.data);
        };
        fetchData();
    }, []);
    return (
        <div className="Homepage-main">
            <h1>Các sản phẩm nổi bật</h1>
            <div className="products">
                {   loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                    products.map((product) => (
                        <div className="product" key={product.slug}>
                            <Link to={`/product/${product.slug}`}>
                                <img src={product.image} alt={product.name}/>
                            </Link>

                            <Link to={`/product/${product.slug}`}>
                                <div className="product-info">
                                    <p>{product.name}</p>
                                    <p>{product.price}đ</p>
                                </div>
                            </Link>
                        </div>

                    )))
                }
            </div>
        </div>
    );
};
export default Homepage;