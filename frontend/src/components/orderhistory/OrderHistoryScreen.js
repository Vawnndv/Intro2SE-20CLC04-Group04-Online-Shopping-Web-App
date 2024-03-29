import React, { useContext } from 'react';

import { Store } from '../../Store';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../loadingbox/LoadingBox';
import MessageBox from '../messagebox/MessageBox';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { getError } from '../../utils';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, orders: action.payload, loading: false};
        case 'FETCH_FAIL':
            return {...state, loading:false, error: action.payload};
        default:
            return state;
    }
};

let OrderHistoryScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ orders, loading, error }, dispatch] = useReducer(reducer, {
        orders: [], 
        loading: true,
        error: ''
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST'});
            try {
                const { data } = await axios.get(
                    `/api/orders/mine`,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err) });
            };
        };
        fetchData();
    }, [userInfo]);

    return (
        <div>
            <Helmet>
                <title>Order History</title>
            </Helmet>

            <h1>Đơn hàng của bạn</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className='text-center'>Ngày đặt</th>
                            <th className='text-center'>Tổng hóa đơn</th>
                            <th className='text-center'>Thanh toán</th>
                            <th className='text-center'>Giao hàng</th>
                            <th className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td className='text-center'>{order.createdAt.substring(0, 10)}</td>
                                <td className='text-center'>{order.totalPrice.toFixed(2)}</td>
                                <td className='text-center'>{order.isPaid ? order.paidAt.substring(0, 10) : 'Chưa thanh toán'}</td>
                                <td className='text-center'>
                                    {order.isDelievered
                                    ? order.deliveredAt.substring(0,10)
                                    : 'Chưa giao hàng'}
                                </td>
                                <td>
                                    <Button type="button" variant="light" 
                                    onClick={() => {
                                        navigate(`/order/${order._id}`);
                                    }}>
                                    Details
                                    </Button>
                                </td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>
            )}
        </div>
    )
}
export default OrderHistoryScreen;