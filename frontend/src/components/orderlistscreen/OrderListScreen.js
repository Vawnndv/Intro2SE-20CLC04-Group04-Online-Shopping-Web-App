import axios from 'axios';
import React, {useContext, useEffect, useReducer} from 'react';
import { Store } from '../../Store';
import {getError} from "../../utils";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import {Helmet} from "react-helmet-async";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false};
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

export default function OrderListScreen() {
    const navigate = useNavigate();
    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
       loading: true,
        error: '',
    });

    useEffect(() =>{
        const fetchData = async () => {
          try {
            dispatch({type: 'FETCH_REQUEST'});
            const {data} = await axios.get(`/api/orders`, {
               headers: { Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: 'FETCH_SUCCESS', payload: data});
          } catch (err) {
              dispatch({type: 'FETCH_FAIL', payload: getError(err)});
          }
        };
    }, [userInfo]);

    return (
      <div>
          <Helmet>
              <title>Đơn hàng</title>
          </Helmet>
          <h1>Đơn hàng</h1>
          {loading ? (
              <LoadingBox></LoadingBox>
          ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Ngày</th>
                        <th>Tổng</th>
                        <th>Đã thanh toán</th>
                        <th>Vận chuyển</th>
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
                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Không'}</td>
                        <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Không'}</td>
                        <td>
                            <Button type="button" variant="light" onClick={() => {
                                navigate(`/order/${order._id}`);
                            }}></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          )}
      </div>
    );
}