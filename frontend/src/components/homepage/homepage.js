import './homepage.css'
import '../stylesheet/style.css'

import Product from '../product/product'

// import data from '../../../../backend/'
import {Link} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import axios from "axios";
import logger from 'use-reducer-logger';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Helmet} from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import {getError} from "../../utils";

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
                dispatch({type: 'FETCH_FAIL', payload: getError(err) });
            };

            // setProduct(result.data);
        };
        fetchData();
    }, []);
    return (
        <div className="Homepage-main">
            <Helmet>
                <title>HKVTV</title>
            </Helmet>
            <h1>Các sản phẩm nổi bật</h1>
            <div className="products">
                {   loading ? (
                        <LoadingBox />
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <Row>
                            {products.map((product) => (
                                <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                                    <Product product={product}></Product>
                                </Col>
                            ))}
                        </Row>
                    )
                }
            </div>
        </div>
    );
};
export default Homepage;