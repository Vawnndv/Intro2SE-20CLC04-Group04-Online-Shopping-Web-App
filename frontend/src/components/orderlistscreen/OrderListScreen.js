import axios from 'axios';
import React, {useContext, useEffect, useReducer} from 'react';
import { Store } from '../../Store';
import {getError} from "../../utils";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload.orders, page: action.payload.page,
                pages: action.payload.pages, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false};
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true};
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false};
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false};
        default:
            return state;
    }
}

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete, pages }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
    const { search, pathname } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete, page]);

    const deleteHandler = async (order) => {
        if (window.confirm('Bạn có chắc muốn xóa không?')) {
            try {
                dispatch({type: 'DELETE_REQUEST'})
                await axios.delete(`/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}`}
                });
                toast.success('Đơn hàng đã xóa thành công');
                dispatch({type: 'DELETE_SUCCESS'});
            } catch (err) {
                toast.error(getError(error));
                dispatch({type: 'DELETE_FAIL'});
            }
        }
    };

    return (
      <div>
          <Helmet>
              <title>Đơn hàng</title>
          </Helmet>
          <h1>Đơn hàng</h1>
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
                            <th>Khách hàng</th>
                            <th>Ngày</th>
                            <th>Tổng</th>
                            <th>Đã thanh toán</th>
                            <th>Đã giao hàng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user ? order.user.name : 'Đã xóa người dùng'}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Chưa'}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Chưa'}</td>
                            <td>
                                <Button type="button" variant="light" onClick={() => {
                                    navigate(`/order/${order._id}`);
                                }}>Chi tiết</Button>
                                &nbsp;
                                <Button type="button" variant="light" onClick={() => deleteHandler(order)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="productPagination">
                    {[...Array(pages).keys()].map((x) => (
                        Number(page) - 1 === x + 1 || Number(page) === x + 1 || Number(page) + 1 === x + 1   ? (
                            <Link
                                className={
                                    x + 1 === Number(page) ? "btn btn-primary" : "btn btn-light"
                                }
                                key={x + 1}
                                to={`/admin/orders?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ): (<></>)
                    ))}
                </div>
            </>
          )}
      </div>
    );
}