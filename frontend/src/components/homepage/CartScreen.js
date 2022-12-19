import './CartScreen.css'
import {Store} from "../../Store";
import React, {useContext} from "react";
import {Helmet} from "react-helmet-async";
import {Card, Col} from "react-bootstrap";
import {Row} from "react-bootstrap";
import MessageBox from "../messagebox/MessageBox";
import {Link, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import {formatPrice} from "../../utils";
import axios from "axios";

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
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
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
            </Row>
        </div>
    );
}
