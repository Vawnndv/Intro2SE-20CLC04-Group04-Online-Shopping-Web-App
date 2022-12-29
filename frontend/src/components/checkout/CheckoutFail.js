import { useContext } from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Store } from "../../Store";
import CheckoutSteps from "./checkoutsteps/CheckoutSteps";


export default function CheckoutFail() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart
    } = state;

    return (
        <div>
            <Helmet>
                <title>Error</title>
            </Helmet>
            <CheckoutSteps step3_fail></CheckoutSteps>
            <div className="container d-flex flex-column align-items-center">
                <h1 className="my-4 text-center cko-h1">Đã có lỗi xảy ra !</h1>
                <h4 className="mb-3 text-center cko-h4">Các sản phẩm sau không còn đủ số lượng bạn đã chọn trong giỏ hàng:</h4>
                <div className="container">
                    <ListGroup>
                        <ListGroup.Item>
                            <Row>
                                <Col></Col>
                                <Col className="text-center">Sản phẩm</Col>
                                <Col className="text-center">Số lượng đã chọn</Col>
                                <Col className="text-center">Số lượng còn</Col>
                            </Row>
                        </ListGroup.Item>
                        {cart.failItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row className="my-2">
                                    <Col className="d-flex align-items-center">
                                        <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />
                                    </Col>
                                    <Col className="d-flex  align-items-center">
                                        <Link className="ord-links" to={`/product/${item.slug}`}>{item.name}</Link>
                                    </Col>
                                    <Col className="d-flex justify-content-center align-items-center">{item.orderedQuantity}</Col>
                                    <Col className="d-flex justify-content-center align-items-center">{item.quantity}</Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div className="container d-flex justify-content-around mt-2">
                            <Link className="btn btn-primary" to="/">Về trang chủ</Link>
                            <Link className="btn btn-primary" to="/cart">Về giỏ hàng</Link>
                </div>
            </div>
        </div>
    )
}
