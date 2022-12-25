import React from "react";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import './CheckoutSteps.css';
import '../checkout.css';
import { Stepper, Step, StepLabel, Typography } from "@material-ui/core";

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

        <Stepper alternativeLabel className="checkout-steps">
            <Step key={1} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
                active={props.step1 ? true : false}
                completed={props.step2 || props.step3 ? true : false}
            >
                <Typography className="text-center">Thông tin khách hàng</Typography>
                <StepLabel></StepLabel>
            </Step>
            <Step key={2} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
                active={props.step2 ? true : false}
                completed={props.step3 ? true : false}
            >
                <Typography className="text-center">Thông tin thanh toán</Typography>
                <StepLabel></StepLabel>
            </Step>
            <Step key={3} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }} active={props.step3 ? true : false}>
                <Typography className="text-center">Xác nhận đơn hàng</Typography>
                <StepLabel></StepLabel>
            </Step>
        </Stepper>
    );
};