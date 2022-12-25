import React, {useContext, useEffect} from 'react';
import { useReducer } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {Store} from "../../Store";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import {getError} from "../../utils";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import product from "../product/product";

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
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true};
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false};
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false};
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false};
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true};
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false};
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false};
        default:
            return state;
    }
};

export default function ProductListScreen() {
    const [{ loading, error, products, pages, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const { search, pathname } = useLocation();
    const sp = new  URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/products/admin?page=${page}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        };

        if (successDelete) {
            dispatch({type: 'DELETE_RESET'});
        } else {
            fetchData();
        }
    }, [page, userInfo, successDelete]);

    const createHandler = async () => {
        if(window.confirm('Bạn có chắc muốn tạo không?')) {
            try {
                dispatch({type: 'CREATE_REQUEST'});
                const { data } = await axios.post(
                  '/api/products',
                  {},
                  {
                             headers: { Authorization: `Bearer ${userInfo.token}`},
                        }
                );
                toast.success('Đã tạo sản phẩm thành công');
                dispatch({type: 'CREATE_SUCCESS'});
                navigate(`/admin/product/${data.product._id}`);
            } catch (err) {
                toast.error(getError(error));
                dispatch({type: 'CREATE_FAIL'});
            }
        }
    };

    const deleteHandler = async (product) => {
        if (window.confirm('Bạn có chắc muốn xóa không?')) {
            try {
                await axios.delete(`/api/products/${product._id}`, {
                   headers: { Authorization: `Bearer ${userInfo.token}`}
                });
                toast.success('Sản phẩm đã xóa thành công');
                dispatch({type: 'DELETE_SUCCESS'});
            } catch (err) {
                toast.error(getError(error));
                dispatch({type: 'DELETE_FAIL'});
            }
        }
    };

    return (
        <div>
            <Row>
                <Col>
                    <h1>Sản Phẩm</h1>
                </Col>
                <Col className="col text-end">
                    <div>
                        <Button type="button" onClick={createHandler}>
                            Tạo sản phẩm
                        </Button>
                    </div>
                </Col>
            </Row>

            {loadingCreate && <LoadingBox></LoadingBox>}
            {loadingDelete && <LoadingBox></LoadingBox>}

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
                                <th>Hành động</th>
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
                                <td>
                                    <Button type="button"
                                            variant="light"
                                            onClick={() => navigate(`/admin/product/${product._id}`)}
                                    >Chỉnh sửa</Button>
                                    &nbsp;
                                    <Button type="button"
                                            variant="light"
                                            onClick={() => deleteHandler(product)}
                                    >Xóa</Button>
                                </td>
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