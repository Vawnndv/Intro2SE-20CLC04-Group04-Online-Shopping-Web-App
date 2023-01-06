import './CartScreen.css'
import {Store} from "../../Store";
import React, {useContext} from "react";
import {Helmet} from "react-helmet-async";
import {Card, Col, Container} from "react-bootstrap";
import {Row} from "react-bootstrap";
import MessageBox from "../messagebox/MessageBox";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import {formatPrice} from "../../utils";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default  function CartScreen() {
    const navigate = useNavigate();
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;

    const updateCartHandler = async (item, quantity) => {
        const {data} = await axios.get(`/api/products/${item._id}`);
        if(data.quantity < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: {...item, quantity },
        });
    }

    const removeItemHandler = (item) => {
        ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item});
    }
    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    }
    return (
        <div className="wrapper">
            <Helmet>
                <title>Giỏ hàng</title>
                <style>{'body { background-color: #f8f8fc; }'}</style>
            </Helmet>
            <h3 className="cart-title">Giỏ hàng</h3>


            {/* New Cart start */}
            <Container>
                <Row className="control-bar topbar">
                    <Col md={1} className="cb"></Col>
                    <Col md={4}>
                        <span>Sản phẩm</span>
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        <span>Đơn giá</span>
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        <span>Số lượng</span>
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        <span>Số tiền</span>
                    </Col>
                    <Col md={1} className="d-flex justify-content-center">
                        <span>Thao tác</span>
                    </Col>
                </Row>
            </Container>
            <Container className="list-wrapper">
                {cartItems.length === 0 ?
                    (
                    <MessageBox>
                        Cart is empty. <Link to="/">Go shopping</Link>
                    </MessageBox>
                    ): (
                        <div>
                            {cartItems.map((item) => (
                                <Row key={item._id} className="item align-items-center">
                                    <Col md={1} className="cb"></Col>
                                    <Col md={4} className="item-info d-flex flex-row">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="img-fluid rounded img-thumbnail">
                                        </img>
                                        <div className="text-wrap d-flex align-items-center">
                                            <Link className="item-name" to={`/product/${item.slug}`}>{item.name}</Link>
                                        </div>
                                    </Col>
                                    <Col md={2} className="d-flex justify-content-center">
                                        <span>{formatPrice(item.price)}</span>
                                    </Col>
                                    <Col md={2} className="d-flex justify-content-center align-items-center">
                                        <div className="quantity-control d-flex justify-content-center align-items-center">
                                            <Button
                                                className="quantity-btn"
                                                variant="light"
                                                onClick={() => updateCartHandler(item, item.quantity - 1)}
                                                disabled={item.quantity === 1}>
                                                <i className="fas fa-minus"></i>
                                            </Button>
                                            <span>{item.quantity}</span>{' '}
                                            <Button
                                                className="quantity-btn"
                                                variant="light"
                                                onClick={() => updateCartHandler(item, item.quantity + 1)}
                                                disabled={item.quantity === item.quanity}>
                                                <i className="fas fa-plus"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={2} className="d-flex justify-content-center">
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </Col>
                                    <Col md={1}  className="d-flex justify-content-center">
                                        <span className="item-action" onClick={() => removeItemHandler(item)}>
                                            Xóa
                                        </span>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    )
                }
            </Container>
            {/* <Container>
                <Row className="control-bar voucher-bar"> 
                    <Col md={10} className="d-flex justify-content-end">
                        <span className="voucher-title">HKVTV Voucher</span>
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        <span className="voucher-action">Chọn phiếu giảm giá</span>
                    </Col>
                </Row>
            </Container> */}
            <Container>
                <Row className="control-bar bottombar">
                    <Col md={1}></Col>
                    <Col md={9} className="d-flex justify-content-start">
                        <span>Tổng thanh toán ({cartItems.reduce((a, c) => a + c.quantity, 0)} Sản Phẩm):</span>
                        <span className="total-bill">{formatPrice(cartItems.reduce((a, c) => a + c.price * c.quantity, 0))}</span>
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        <Button
                            className="checkout-btn"
                            type="button"
                            variant="primary"
                            onClick={checkoutHandler}
                            disabled={cartItems.length === 0}>
                            Mua Hàng
                        </Button>
                    </Col>
                </Row>
            </Container>
            {/* New Cart end */}

            {/* <Row>
                <Col md={8}>
                    {cartItems.length === 0 ?
                        (
                        <MessageBox>
                            Cart is empty. <Link to="/">Go shopping</Link>
                        </MessageBox>
                        ):
                        (
                            <ListGroup>
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={4} className="d-flex align-items-center justify-content-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail">
                                                </img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <Button
                                                    variant="light"
                                                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                                                    disabled={item.quantity === 1}>
                                                    <i className="fas fa-minus-circle"></i>
                                                </Button>{''}
                                                <span>{item.quantity}</span>{' '}
                                                <Button
                                                    variant="light"
                                                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                                                    disabled={item.quantity === item.quanity}>
                                                    <i className="fas fa-plus-circle"></i>
                                                </Button>{''}
                                            </Col>
                                            <Col md={3}>{formatPrice(item.price)}</Col>
                                            <Col md={2}>
                                                <Button
                                                    onClick={() => removeItemHandler(item)}
                                                    variant="light">
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )
                    }
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) :
                                    </h3>
                                    <h3>
                                        {formatPrice(cartItems.reduce((a, c) => a + c.price * c.quantity, 0))}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                        Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}
        </div>
    );
}
