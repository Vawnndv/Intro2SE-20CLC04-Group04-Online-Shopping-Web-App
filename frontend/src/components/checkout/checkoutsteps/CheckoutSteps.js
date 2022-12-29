import React from "react";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import './CheckoutSteps.css';
import '../checkout.css';
import { Stepper, Step, StepLabel } from "@material-ui/core";

export default function CheckoutSteps(props) {
    return (
        // <Row className="checkout-steps">
        //     <Col className={props.step1 ? "active" : ""}>
        //         Đăng nhập
        //         <span>1</span>
        //     </Col>
        //     <Col className={props.step2 ? "active" : ""}>
        //         Thông tin khách hàng
        //         <span>2</span>
        //     </Col>
        //     <Col className={props.step3 ? "active" : ""}>
        //         Thông tin thanh toán
        //         <span>3</span>
        //     </Col>
        //     <Col className={props.step4 ? "active" : ""}>
        //         Xác nhận
        //         <span>4</span>
        //     </Col>
        // </Row>

        <Stepper alternativeLabel className="checkout-steps mt-3">
            <Step key={1}
                active={props.step1 ? true : false}
                completed={props.step2 || props.step3 || props.step3_fail ? true : false}
            >
                <StepLabel>Thông tin khách hàng</StepLabel>
            </Step>
            <Step key={2}
                active={props.step2 ? true : false}
                completed={props.step3 || props.step3_fail ? true : false}
            >
                <StepLabel>Thông tin thanh toán</StepLabel>
            </Step>
            <Step key={3}
                active={props.step3 ? true : false}>
                <StepLabel error={props.step3_fail ? true : false}>Xác nhận đơn hàng</StepLabel>
            </Step>
        </Stepper>
    );
};