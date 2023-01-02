import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Store} from "../../Store";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {getError} from "../../utils";
import {toast} from "react-toastify";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return { ...state, loading: false};
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload};
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true};
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false};
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false};
        default:
            return state;
    }
}

export default function VoucherEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /voucher/:id
    const { id: voucherId } = params;

    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{ loading, error, loadingUpdate, loadingUpload}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/vouchers/${voucherId}`);
                setName(data.name);
                setCode(data.code);
                setDiscount(data.discount);
                setQuantity(data.quantity);
                setDescription(data.description);
                dispatch({ type: 'FETCH_SUCCESS'});
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error)})
            }
        }
        fetchData();
    }, [voucherId]);

    const  submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`/api/vouchers/${voucherId}`, {
                _id: voucherId,
                name,
                code,
                discount,
                quantity,
                description,
            },{
                headers: { Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({ type: 'UPDATE_SUCCESS'});
            toast.success('Voucher đã được cập nhật thành công');
            navigate('/admin/vouchers');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL'})
        }
    };

    return <Container className="small-container row">
        <Helmet>
            <title>Chỉnh sửa voucher ${voucherId}</title>
        </Helmet>
        <h1>Chỉnh sửa voucher {voucherId}</h1>

        { loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="slug">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Giảm Giá</Form.Label>
                    <Form.Control
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="quantity">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button disabled={loadingUpdate} type="submit">Cập nhật</Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                </div>
            </Form>
        )}
    </Container>
}