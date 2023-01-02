import './SearchScreen.css';
import { useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import axios from 'axios';
import { getError } from "../../utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../rating/rating";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import Product from "../product/product";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const prices = [
    {
        name: 'Dưới 1 triệu',
        value: '0-1000000',
    },
    {
        name: '1 - 5 triệu',
        value: '1000000-5000000',
    },
    {
        name: '5 - 20 triệu',
        value: '5000000-20000000',
    },
    {
        name: 'Trên 20 triệu',
        value: '20000000-9990000000',
    },
];

export const ratings = [
    {
        name: '4stars & up',
        rating: 4,
    },

    {
        name: '3stars & up',
        rating: 3,
    },

    {
        name: '2stars & up',
        rating: 2,
    },

    {
        name: '1stars & up',
        rating: 1,
    },
];

export default function SearchScreen(props) {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || '1';

    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            // dispatch({ type: 'FETCH_REQUEST'});
            try {
                const { data } = await axios.get(
                    `/api/products/search/?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                );
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err) });
            };
        };
        fetchData();
    }, [page, query, category, price, order, rating, error]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/search/?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`;
    }

    return (
        <div className="body">
            <Helmet>
                <title>Search Products</title>
                <style>{'body { background-color: #f8f8fc; }'}</style>
            </Helmet>
            <Row>
                <Col md={2} className="filter-wrapper">
                    <div className="filter-bar">
                        <div className="filter-criteria filter-category">
                            <div className="filter-label">
                                {/* <FontAwesomeIcon icon="faBars" /> */}
                                <span>Danh mục</span>
                            </div>
                            <ul>
                            <li>
                                <Link
                                    className={'all' === category ? 'text-bold' : ''}
                                    to={getFilterUrl({ category: 'all' })}
                                >
                                Tất cả
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li key={c}>
                                <Link
                                    className={c === category ? 'text-bold' : ''}
                                    to={getFilterUrl({ category: c })}
                                >
                                    {c}
                                </Link>
                                </li>
                            ))}
                            </ul>
                        </div>
                        <div className="filter-criteria filter-price">
                            <div className="filter-label">
                                <span>Giá bán</span>
                            </div>
                            <ul>
                            <li>
                                <Link
                                    className={'all' === price ? 'text-bold' : ''}
                                    to={getFilterUrl({ price: 'all' })}
                                >
                                Tất cả
                                </Link>
                            </li>
                            {prices.map((p) => (
                                <li key={p.value}>
                                <Link
                                    to={getFilterUrl({ price: p.value })}
                                    className={p.value === price ? 'text-bold' : ''}
                                >
                                    {p.name}
                                </Link>
                                </li>
                            ))}
                            </ul>
                        </div>
                        <div className="filter-criteria filter-rating">
                            <div className="filter-label">
                                <span>Đánh giá</span>
                            </div>
                            <ul>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                <Link
                                    to={getFilterUrl({ rating: r.rating })}
                                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                                >
                                    <Rating caption={' & up'} rating={r.rating}></Rating>
                                </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to={getFilterUrl({ rating: 'all' })}
                                    className={rating === 'all' ? 'text-bold' : ''}
                                >
                                <Rating caption={' & up'} rating={0}></Rating>
                                </Link>
                            </li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col md={10} className="p-0">
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <div>
                        <div className="sort-bar">
                            <div className="sort-label">
                                {/* <i class="fa-solid fa-sort"></i> */}
                                <span>Sắp xếp theo</span>
                            </div>
                            <div className="sort-select d-flex align-items-center">
                                <select value={order} onChange={(e) => {
                                    navigate(getFilterUrl({ order: e.target.value }));
                                }}>
                                    <option value="lowest">Giá thấp đến cao</option>
                                    <option value="highest">Giá cao đến thấp</option>
                                    <option value="toprated">Được yêu thích nhất</option>
                                </select>
                            </div>
                            <div className="text-end sort-result">
                                <div>
                                    {countProducts === 0 ? 'No' : countProducts} Results
                                    {query !== 'all' && ' : ' + query}
                                    {category !== 'all' && ' : ' + category}
                                    {price !== 'all' && ' : Price ' + price}
                                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                                    {query !== 'all' ||
                                    category !== 'all' ||
                                    rating !== 'all' ||
                                    price !== 'all' ? (
                                    <Button className="sort-clear"
                                        variant="light"
                                        onClick={() => navigate('/search')}
                                    >
                                        <i className="fas fa-times-circle"></i>
                                    </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        {products.length === 0 && (
                            <MessageBox>No Product Found</MessageBox>
                        )}
                        <div className="product-list">
                            {products.map((product) => (
                                <Col className="product-card mb-3" key={product._id}>
                                    <Product product={product}></Product>
                                </Col>
                            ))}
                        </div>
                        <div>
                            {[...Array(pages).keys()].map((x) => (
                                <LinkContainer
                                    key={x + 1}
                                    className="mx-1"
                                    to={getFilterUrl({ page: x + 1 })}
                                >
                                    <Button
                                        className={Number(page) === x + 1 ? 'text-bold' : ''}
                                        variant="light"
                                    >
                                        {x + 1}
                                    </Button>
                                </LinkContainer>
                            ))}
                        </div>
                    </div>
                )}</Col>
            </Row>
        </div>
    )
}