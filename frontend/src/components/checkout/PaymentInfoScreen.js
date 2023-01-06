import { useContext, useEffect, useReducer, useState } from 'react';
import CheckoutSteps from './checkoutsteps/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Store } from '../../Store';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar, faTicket } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getError } from '../../utils';
import LoadingBox from '../loadingbox/LoadingBox';
import MessageBox from '../messagebox/MessageBox';

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, vouchersList: action.payload, loading: false };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function PaymentInfoScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const [{ loading, vouchersList, error }, dispatch] = useReducer(reducer, {
        loading: true,
        vouchersList: [],
        error: ''
    });
    const {
        userInfo,
        cart: { shippingAddress, paymentInfo }
    } = state;

    const [paymentMethod, setPaymentMethod] = useState(paymentInfo.paymentMethod || 'cash');
    const [voucher, setVoucher] = useState(paymentInfo.voucher || {code: 'none'});

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
        if (!userInfo) {
            navigate('/login?redirect=/payment');
        }

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const { data } = await axios.get('/api/vouchers/all');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            };
        };
        fetchData();

    }, [userInfo, paymentInfo, shippingAddress, navigate]);

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
        <CheckoutSteps step2></CheckoutSteps>
        <div className="container d-flex flex-column align-items-center">
            <Form onSubmit={submitHandler} className="cko-form-container d-flex flex-column">
                <h1 className="my-4 text-center cko-h1">Thông tin thanh toán </h1>
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
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <Form.Select
                            className="cko-select"
                            defaultValue={voucher.code || 'none'}
                            onChange={(e) => setVoucher(
                                {...vouchersList.find(v => v.code == e.target.value)}
                            )}>
                            {vouchersList.map((v) => (
                                <option key={v.code} value={v.code}>{v.code} - {v.name}</option>
                            ))}
                            <option value="none">Không sử dụng</option>
                        </Form.Select>)}
                </Form.Group>
                <div className="mb-3 align-self-center">
                    <Button className="cko-submit-btn d-flex" variant="primary" type="Submit">
                        Tiếp tục
                    </Button>
                </div>
            </Form>
        </div>
    </div >;
};
