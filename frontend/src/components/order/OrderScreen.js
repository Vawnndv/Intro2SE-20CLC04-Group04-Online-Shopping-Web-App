import React, { useContext, useEffect, useReducer } from 'react';
import LoadingBox from '../loadingbox/LoadingBox';
import MessageBox from '../messagebox/MessageBox';
import { Store } from '../../Store';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatPrice, getError } from '../../utils';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        case 'DELIVER_REQUEST':
            return {...state, loadingDeliver: true};
        case 'DELIVER_SUCCESS':
            return {...state, loadingDeliver: false, successDeliver: true};
        case 'DELIVER_FAIL':
            return {...state, loadingDeliver: false};
        case 'DELIVER_RESET':
            return {...state, loadingDeliver: false, successDeliver: false};
        default:
            return state;
    }
}

export default function OrderScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [{ loading, error, order, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: ""
    });

    useEffect(() => {
        const fetchOrder = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        }
        if (!userInfo) {
            return navigate('/login');
        }

        if (!order._id || successDeliver || (order.id && order.id !== orderId)) {
            fetchOrder();
            if (successDeliver) {
                dispatch({type: 'DELIVER_RESET'});
            }
        }
    }, [order, userInfo, orderId, navigate, successDeliver]);

    async function deliverOrderHandler () {
        try {
            dispatch({type: 'DELIVER_REQUEST'})
            const {data} = await axios.put(`/api/orders/${order._id}/deliver`, {}, {
                headers: { authorization: `bearer ${userInfo.token}`}
            });
            dispatch({type: 'DELIVER_SUCCESS', payload: data});
            toast.success('Đơn hàng đã giao');
        } catch (err) {
            toast.error(getError(err));
            dispatch({type: 'DELIVER_FAIL'});
        }
    }

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <div className="container">
                <h1 className="my-4 text-center ord_h1">Đơn hàng {orderId}</h1>
                <Row>
                    <Col sm={12} md={9} lg={8}>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Thông tin khách hàng</Card.Title>
                                </div>
                                <Card.Text as="div" className="mb-3">
                                    <Row className="my-2">
                                        <Col xs={2}>Họ tên:</Col>
                                        <Col xs={10}>{order.shippingAddress.fullName}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Số điện thoại:</Col>
                                        <Col xs={10}>{order.shippingAddress.phone}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Địa chỉ:</Col>
                                        <Col xs={10}>{order.shippingAddress.address}</Col>
                                    </Row>
                                </Card.Text>
                                {order.isDelivered ? (
                                    <MessageBox variant='success'>
                                        Đã giao hàng lúc {order.deliveredAt}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant='danger'>Chưa giao hàng</MessageBox>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Thanh toán</Card.Title>
                                </div>
                                <Card.Text as="div" className="mb-3">
                                    <Row className="my-2">
                                        <Col xs={2}>Hình thức:</Col>
                                        <Col xs={10}>{order.paymentInfo.paymentMethod}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Voucher:</Col>
                                        <Col xs={10}>{order.paymentInfo.voucher}</Col>
                                    </Row>
                                </Card.Text>
                                {order.isPaid ? (
                                    <MessageBox variant='success'>
                                        Đã thanh toán lúc {order.deliveredAt}
                                    </MessageBox>
                                ) : (
                                    <MessageBox variant='danger'>Chưa thanh toán</MessageBox>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body className="order">
                                <div className="d-flex align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Sản phẩm thanh toán</Card.Title>
                                </div>
                                <div>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col></Col>
                                                <Col className="text-center">Sản phẩm</Col>
                                                <Col className="text-center">Số lượng</Col>
                                                <Col className="text-end">Giá tổng</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {order.orderItems.map((item) => (
                                            <ListGroup.Item key={item._id}>
                                                <Row className="my-2">
                                                    <Col className="d-flex align-items-center">
                                                        <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />
                                                    </Col>
                                                    <Col className="d-flex  align-items-center">
                                                        <Link className="ord-links" to={`/product/${item.slug}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col className="d-flex justify-content-center align-items-center">{item.quantity}</Col>
                                                    <Col className="d-flex justify-content-end align-items-center">{formatPrice(item.price)}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={12} md={3} lg={4}>
                        <Card className="p-3 border-dark">
                            <Card.Body>
                                <Card.Title className="ord-card-title">Tổng kết</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <span>Hóa đơn gốc:</span>
                                            </Col>
                                            <Col>
                                                <span>{formatPrice(order.itemsPrice)}</span>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <span>Giá giảm:</span>
                                            </Col>
                                            <Col>
                                                <span>{formatPrice(order.voucherSales)}</span>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <span>Tổng hóa đơn:</span>
                                            </Col>
                                            <Col>
                                                <span>{formatPrice(order.totalPrice)}</span>
                                            </Col>
                                        </Row>
                                        {userInfo.isAdmin && !order.isDelivered && (
                                            <ListGroup.Item>
                                                {loadingDeliver && <LoadingBox></LoadingBox>}
                                                <div className="d-grid">
                                                    <Button type="button" onClick={deliverOrderHandler}>Đã giao</Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
