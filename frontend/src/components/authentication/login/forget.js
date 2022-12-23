import {Button, Container} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import './login.css'
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import '../../fontawesome/FontAwesome'
import { Link } from "react-router-dom";
import Axios from 'axios'
import {Store} from '../../../Store';
import { getError } from "../../../utils";
import auth from '../../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Forget() {
    const navigate = useNavigate();
    const {search} = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;

    const [email, setEmail] = useState('');
   
    const submitHandler = async(e) => {
        e.preventDefault();
       
        auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Đã gửi email thay đổi mật khẩu đến hòm thư của bạn");
        })
        .catch(mess => {
            if(mess.code === "auth/user-not-found")
                alert("Không tồn tại tài khoản với email này, vui lòng kiểm tra lại")
        })
    }

    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <Container className="small-container">
            <div className="login-container">
                <div>
                    <Helmet>
                        <title>Quên mật khẩu</title>
                    </Helmet>

                    <div className="redirect-nav">
                        <h4 className="my-3 register">Quên mật khẩu</h4>

                    </div>
                </div>

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3 email" controlId="email">
                        <div><Form.Label>Địa chỉ Email</Form.Label></div>
                        <Form.Control size="sm" className="input-email" type="text" onChange={(e) => setEmail(e.target.value)} required placeholder="Nhập email"/>
                    </Form.Group>

                  
                    <Link to={`/login?redirect=${redirect}`} style={{ textDecoration: 'none' }}><p className="my-3 "><FontAwesomeIcon icon={faArrowLeft} /> Về trang đăng nhập</p></Link>
                    <div className="mb-3 submit-button"><Button type="submit">Đổi mật khẩu</Button></div>
                </Form>

            </div>
        </Container>
    )
}
export default Forget;