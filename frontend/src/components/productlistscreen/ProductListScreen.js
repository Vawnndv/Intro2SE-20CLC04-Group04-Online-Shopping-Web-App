import React, {useContext, useEffect} from 'react';
import { useReducer } from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import {Store} from "../../Store";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import {getError} from "../../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: true, error: action.payload };
        default:
            return state;
    }
};

export default function ProductListScreen() {
    const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { search, pathname } = useLocation();
    const sp = new  URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;
    console.log("Toi day r 1");
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/products/admin?page=${page}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                console.log("Toi day r 2");
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        };
        fetchData();
    }, [page, userInfo]);
    console.log("Toi day r 3");
    return (
        <div>
            <h1>Sản Phẩm</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Loại</th>
                                <th>Nhãn hiệu</th>
                            </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};