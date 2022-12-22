import { useContext, useEffect, useReducer} from 'react';
import CheckoutSteps from '../checkout/checkoutsteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice} from '../../utils';
// import { toast } from 'react-toastify';
import './order.css';
import Axios from 'axios';
import LoadingBox from '../loadingbox/LoadingBox.js';

const reducer = (state, action) => {
    switch (action.type) {
        case "CREATE_REQUEST":
            return { ...state, loading: true };
        case "CREATE_SUCCESS":
            return { ...state, loading: false };
        case "CREATE_FAIL":
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default function PlaceOrderScreen() {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart
    } = state;

    cart.itemsPrice = cart.cartItems.reduce((accum, item) => {
        return accum + item.quantity * item.price;
    }, 0);
    cart.voucherSales = 0;
    cart.totalPrice = cart.itemsPrice - cart.voucherSales;

    const placOrderHandler = async () => {
        try {
            dispatch({ type: "CREATE_REQUEST" });
            const { data } = await Axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentInfo: cart.paymentInfo,
                    itemsPrice: cart.itemsPrice,
                    voucherSales: cart.voucherSales,
                    totalPrice: cart.totalPrice
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    }
                }
            );
            ctxDispatch({ type: "CART_CLEAR" });
            dispatch({ type: "CREATE_SUCCESS" });

            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        } catch (error) {
            dispatch({ type: "CREATE_FAIL" });
            // toast.error(getError(err));
            alert(error);
        }
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
                <h1 className="my-4 text-center ord_h1">Xác nhận đơn hàng</h1>
                <Row>
                    <Col sm={12} md={9} lg={8}>
                        <Card className="p-3 mb-3 border-dark ord-card--darker">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Thông tin khách hàng</Card.Title>
                                    <Link className="btn btn-primary" to="/shipping">Chỉnh sửa</Link>
                                </div>
                                <Card.Text as="div">
                                    <Row className="my-2">
                                        <Col xs={2}>Họ tên:</Col>
                                        <Col xs={10}>{cart.shippingAddress.fullName}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Số điện thoại:</Col>
                                        <Col xs={10}>{cart.shippingAddress.phone}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Địa chỉ:</Col>
                                        <Col xs={10}>{cart.shippingAddress.address}</Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark ord-card--darker">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Thanh toán</Card.Title>
                                    <Link className="btn btn-primary" to="/payment">Chỉnh sửa</Link>
                                </div>
                                <Card.Text as="div">
                                    <Row className="my-2">
                                        <Col xs={2}>Hình thức:</Col>
                                        <Col xs={10}>{cart.paymentInfo.paymentMethod}</Col>
                                    </Row>
                                    <Row className="my-2">
                                        <Col xs={2}>Voucher:</Col>
                                        <Col xs={10}>{cart.paymentInfo.voucher}</Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="p-3 mb-3 border-dark">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title className="ord-card-title">Sản phẩm thanh toán</Card.Title>
                                    <Link className="btn btn-primary" to="/cart">Chỉnh sửa</Link>
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
                                        {cart.cartItems.map((item) => (
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
                                                <span>{formatPrice(cart.itemsPrice)}</span>
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
                                        {loading && <LoadingBox></LoadingBox>}
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
