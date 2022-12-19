import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './CheckoutSteps.css';

export default function CheckoutSteps(props) {
    return (
        <Row className="checkout-steps">
            <Col className={props.step1 ? "active" : ""}>
                Đăng nhập
                <span>1</span>
            </Col>
            <Col className={props.step2 ? "active" : ""}>
                Thông tin liên lạc
                <span>2</span>
            </Col>
            <Col className={props.step3 ? "active" : ""}>
                Thông tin thanh toán
                <span>3</span>
            </Col>
            <Col className={props.step4 ? "active" : ""}>
                Xác nhận
                <span>4</span>
            </Col>
        </Row>
    );
};