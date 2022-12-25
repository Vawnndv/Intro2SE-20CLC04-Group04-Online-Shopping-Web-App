import React, {useContext, useEffect, useReducer} from 'react';
import {Store} from "../../Store";
import axios from "axios";
import {getError} from "../../utils";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return { ...state, users: action.payload, loading: false};
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

export default function UserListScreen() {
    const [{ loading, error, users}, dispatch] = useReducer(reducer, {
       loading: true,
       error: '',
    });

    const {state} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();

    useEffect(() =>{
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/users`, {
                    headers: { Authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        };
        fetchData();
    }, [userInfo]);

    return <div>
        <Helmet>
            <title>Người dùng</title>
        </Helmet>
        <h1>Người dùng</h1>
        {loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'Có' : 'Không'}</td>
                        <td>
                            <Button type="button" variant="light" onClick={() => {
                                navigate(`/admin/user/${user._id}`);
                            }}>Chỉnh sửa</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
    </div>;
}