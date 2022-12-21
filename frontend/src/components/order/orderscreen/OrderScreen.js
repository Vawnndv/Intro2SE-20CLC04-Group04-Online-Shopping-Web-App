import React, { useContext, useEffect, useReducer } from 'react';
import LoadingBox from '../../loadingbox/LoadingBox';
import MessageBox from '../../messagebox/MessageBox';
import { Store } from '../../../Store';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatPrice, getError } from '../../../utils';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import './OrderScreen.css';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
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

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
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

        if (!order._id || (order.id && order.id != orderId)) {
            fetchOrder();
        }
    }, [order, userInfo, orderId, navigate]);


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
                <h1 className="my-4 text-center">Đơn hàng {orderId}</h1>
                <Row>
                    <Col sm={12} md={9} lg={8}>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex align-items-center mb-2">
                                    <Card.Title>Thông tin khách hàng</Card.Title>
                                </div>
                                <Card.Text className="grid-container">
                                    <span>Họ tên:</span>
                                    <span>{order.shippingAddress.fullName}</span>
                                    <span>Số điện thoại:</span>
                                    <span>{order.shippingAddress.phone}</span>
                                    <span>Địa chỉ:</span>
                                    <span>{order.shippingAddress.address}</span>
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
                                    <Card.Title>Thanh toán</Card.Title>
                                </div>
                                <Card.Text className="grid-container">
                                    <span>Hình thức:</span>
                                    <span>{order.paymentInfo.paymentMethod}</span>
                                    <span>Voucher:</span>
                                    <span>{order.paymentInfo.voucher}</span>
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
                                    <Card.Title>Sản phẩm thanh toán</Card.Title>
                                </div>
                                <div>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col></Col>
                                                <Col>Sản phẩm</Col>
                                                <Col>Số lượng</Col>
                                                <Col>Giá tổng</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {order.orderItems.map((item) => (
                                            <ListGroup.Item key={item._id}>
                                                <Row className="my-2">
                                                    <Col>
                                                        <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col><span>{item.quantity}</span></Col>
                                                    <Col><span>{formatPrice(item.price)}</span></Col>
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
                                <Card.Title>Tổng kết</Card.Title>
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
