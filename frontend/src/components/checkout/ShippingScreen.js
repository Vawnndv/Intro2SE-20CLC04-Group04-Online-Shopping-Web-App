import { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import CheckoutSteps from './checkoutsteps/CheckoutSteps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen, faPhone, faAddressBook } from '@fortawesome/free-solid-svg-icons';

export default function ShippingScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart,
        cart: { shippingAddress }
    } = state;

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [address, setAddress] = useState(shippingAddress.address || '');

    useEffect(() => {
        if (cart.cartItems.length === 0) {
            navigate('/');
        }
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        }
    }, [userInfo, cart, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                phone,
                address
            }
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                phone,
                address
            })
        );
        navigate('/payment');
    };

    return <div>
        <Helmet>
            <title>Shipping</title>
        </Helmet>
        <CheckoutSteps step1></CheckoutSteps>
        <div className="container d-flex flex-column align-items-center">
            

            <Form onSubmit={submitHandler} className="cko-form-container d-flex flex-column">
            <h1 className="my-4 text-center cko-h1">Thông tin và địa chỉ liên lạc </h1>
                <Form.Group className="mb-4" controlId="fullName">
                    <Form.Label className="cko-label">
                        <FontAwesomeIcon className='me-3' icon={faUserPen} />
                        Họ và tên
                    </Form.Label>
                    <Form.Control
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="phone">
                    <Form.Label className="cko-label">
                        <FontAwesomeIcon className='me-3' icon={faPhone} />
                        Số điện thoại
                    </Form.Label>
                    <Form.Control
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="address">
                    <Form.Label className="cko-label">
                        <FontAwesomeIcon className='me-3' icon={faAddressBook} />
                        Địa chỉ
                    </Form.Label>
                    <Form.Control
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className="mb-3 align-self-center">
                    <Button className="cko-submit-btn d-flex" variant="primary" type="Submit">
                        Tiếp tục
                    </Button>
                </div>
            </Form>
        </div>
    </div>
}
