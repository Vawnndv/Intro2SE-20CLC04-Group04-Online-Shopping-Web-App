import react, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../checkoutsteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../Store';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils';
import './PlaceOrderScreen.css';

export default function () {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart
    } = state;

    cart.itemPrice = cart.cartItems.reduce((accum, item) => {
        return accum + item.quantity * item.price;
    }, 0);
    cart.voucherSales = 0;
    cart.totalPrice = cart.itemPrice - cart.voucherSales;

    const placOrderHandler = async  () => {
        return;
    };

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
        // if (!cart.paymentInfo) {
        //     navigate('/payment');
        // }
        if (!userInfo) {
            navigate('/');
        }
    }, [cart, userInfo, navigate]);

    return (
        <div>
            <Helmet>
                <title>Payment Info</title>
            </Helmet>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <div className="container">
                <h1 className="my-4 text-center">Xác nhận đơn hàng</h1>
                <Row>
                    <Col sm={12} md={9} lg={8}>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title>Thông tin khách hàng</Card.Title>
                                    <Link className="btn btn-primary" to="/shipping">Chỉnh sửa</Link>
                                </div>
                                <Card.Text className="grid-container">
                                    <span>Họ tên:</span>
                                    <span>{cart.shippingAddress.fullName}</span>
                                    <span>Số điện thoại:</span>
                                    <span>{cart.shippingAddress.phone}</span>
                                    <span>Địa chỉ:</span>
                                    <span>{cart.shippingAddress.address}</span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title>Thanh toán</Card.Title>
                                    <Link className="btn btn-primary" to="/payment">Chỉnh sửa</Link>
                                </div>
                                <Card.Text className="grid-container">
                                    <span>Hình thức:</span>
                                    <span>{cart.paymentInfo.paymentMethod}</span>
                                    <span>Voucher:</span>
                                    <span>{cart.paymentInfo.voucher}</span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body className="cart">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title>Sản phẩm thanh toán</Card.Title>
                                    <Link className="btn btn-primary" to="/cart">Chỉnh sửa</Link>
                                </div>
                                <div>
                                    <ListGroup variant="flush">
                                        {cart.cartItems.map((item) => (
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
                                                <span>{formatPrice(cart.itemPrice)}</span>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <span>Giá giảm:</span>
                                            </Col>
                                            <Col>
                                                <span>{formatPrice(cart.voucherSales)}</span>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <span>Tổng hóa đơn:</span>
                                            </Col>
                                            <Col>
                                                <span>{formatPrice(cart.totalPrice)}</span>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-grid mt-4">
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={placOrderHandler}
                                                disabled={cart.cartItems.length === 0}>
                                                Đặt hàng
                                            </Button>
                                        </div>
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
