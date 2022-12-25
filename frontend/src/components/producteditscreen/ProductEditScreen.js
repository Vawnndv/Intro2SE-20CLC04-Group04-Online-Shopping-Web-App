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

export default function ProductEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: productId } = params;

    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{ loading, error, loadingUpdate}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setQuantity(data.quantity);
                setBrand(data.brand);
                setDescription(data.description);
                dispatch({ type: 'FETCH_SUCCESS'});
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error)})
            }
        }
        fetchData();
    }, [productId]);

    const  submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`/api/products/${productId}`, {
                _id: productId,
                name,
                slug,
                price,
                image,
                category,
                brand,
                quantity,
                description,
            },{
                headers: { Authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({ type: 'UPDATE_SUCCESS'});
            toast.success('Sản phẩm đã được cập nhật thành công');
            navigate('/admin/products');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL'})
        }
    }

    return <Container className="small-container row">
        <Helmet>
            <title>Chỉnh sửa sản phẩm ${productId}</title>
        </Helmet>
        <h1>Chỉnh sửa sản phẩm {productId}</h1>

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
                    <Form.Label>Slug</Form.Label>
                    <Form.Control
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Giá</Form.Label>
                    <Form.Control
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="image">
                    <Form.Label>Ảnh</Form.Label>
                    <Form.Control
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Loại</Form.Label>
                    <Form.Control
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                <Form.Group className="mb-3" controlId="brand">
                    <Form.Label>Hãng</Form.Label>
                    <Form.Control
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
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