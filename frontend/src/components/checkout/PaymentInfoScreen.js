import react, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from './checkoutsteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Store } from '../../Store';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar, faTicket } from '@fortawesome/free-solid-svg-icons';

export default function PaymentInfoScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress, paymentInfo }
    } = state;

    const [paymentMethod, setPaymentMethod] = useState(paymentInfo.paymentMethod || 'cash');
    const [voucher, setVoucher] = useState(paymentInfo.voucher || 'none');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
        if (!userInfo) {
            navigate('/login?redirect=/payment');
        }
    }, [userInfo, shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_PAYMENT_INFO',
            payload: {
                paymentMethod,
                voucher
            }
        });
        localStorage.setItem(
            'paymentInfo',
            JSON.stringify({
                paymentMethod,
                voucher
            })
        );
        navigate('/placeorder');
    };

    return <div>
        <Helmet>
            <title>Payment Info</title>
        </Helmet>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <div className="container d-flex flex-column align-items-center">
            <h1 className="my-4 text-center cko-h1">Thông tin thanh toán </h1>
            <Form onSubmit={submitHandler} className="cko-form-container d-flex flex-column">
                <Form.Group className="mb-4" controlId="paymentMethod">
                    <Form.Label className="cko-label">
                        <FontAwesomeIcon className='me-3' icon={faMoneyCheckDollar} />
                        Chọn hình thức thanh toán
                    </Form.Label>
                    <Form.Select
                        className="cko-select"
                        defaultValue={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="cash">Tiền mặt</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4" controlId="paymentMethod">
                    <Form.Label className="cko-label">
                        <FontAwesomeIcon className='me-3' icon={faTicket} />
                        Chọn voucher
                    </Form.Label>
                    <Form.Select
                        className="cko-select"
                        defaultValue={voucher}
                        onChange={(e) => setVoucher(e.target.value)}>
                        <option value="voucher1">Voucher1</option>
                        <option value="voucher2">Voucher2</option>
                        <option value="none">Không sử dụng</option>
                    </Form.Select>
                </Form.Group>
                <div className="mb-3 align-self-center">
                    <Button className="cko-submit-btn d-flex" variant="primary" type="Submit">
                        Tiếp tục
                    </Button>
                </div>
            </Form>
        </div>
    </div>;
};
