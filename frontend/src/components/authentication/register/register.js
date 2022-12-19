import './register.css'
import {Button, Container} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useContext, useState } from "react";
import '../../fontawesome/FontAwesome'
import { Link } from "react-router-dom";
import { Store } from '../../../Store';
import Axios from 'axios'

export default function Register () {
    const navigate = useNavigate();
    const {search} = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [passwordType, setPasswordType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");

    const [repasswordType, setrePasswordType] = useState("password");
    const [repasswordInput, setrePasswordInput] = useState("");

    const handlePasswordChange =(evnt)=>{
        setPasswordInput(evnt.target.value);
    }

    const togglePassword =()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       return;
      }
      setPasswordType("password")
    }

    const handlerePasswordChange =(evnt)=>{
        setrePasswordInput(evnt.target.value);
    }

    const togglerePassword =()=>{
      if(repasswordType==="password")
      {
       setrePasswordType("text")
       return;
      }
      setrePasswordType("password")
    }

    const [name, setName] = useState('');
    const [dob, setDOB] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');

    const {state, dispatch: ctxDispatch} = useContext(Store);

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const {data} = await Axios.post('/api/users/register', {
                email,
                password,
            });
        } catch (error) {
            
        }
    }

    return(
        <div>
            <Container className="small-container">
            <div className="register-container">
                <div>
                    <Helmet>
                        <title>Đăng ký</title>
                    </Helmet>

                    <div className="redirect-nav">
                        <Link to={`/login`} style={{ textDecoration: 'none' }}><h4 className="my-3 signin-res">Đăng nhập</h4></Link>
                        <h4 className="my-3 register-res">Đăng ký</h4>
                    </div>
                </div>

                <Form>
                    <Form.Group className="mb-3 email" controlId="name">
                        <div><Form.Label>Họ tên</Form.Label></div>
                        <Form.Control size="sm" className="input-name" type="text" required placeholder="Nhập email" style={{width: '300px'}}/>
                    </Form.Group>

                    <Form.Group className="mb-3 dob" controlId="dob">
                        <div><Form.Label>Ngày sinh</Form.Label></div>
                        <Form.Control size="sm" className="input-dob" type="date" required placeholder="Nhập ngày sinh"/>
                    </Form.Group>

                    <Form.Group className="mb-3 address" controlId="address">
                        <div><Form.Label>Địa chỉ</Form.Label></div>
                        <Form.Control size="sm" className="input-address" type="text" required placeholder="Nhập địa chỉ"/>
                    </Form.Group>

                    <Form.Group className="mb-3 email" controlId="phone">
                        <div><Form.Label>Số điện thoại</Form.Label></div>
                        <Form.Control size="sm" className="input-phone" type="text" required placeholder="Nhập số điện thoại" maxLength='10'/>
                    </Form.Group>

                    <Form.Group className="mb-3 email" controlId="email">
                        <div><Form.Label>Địa chỉ Email</Form.Label></div>
                        <Form.Control size="sm" className="input-email" type="email" required placeholder="Nhập email"/>
                    </Form.Group>

                    <Form.Group className="mb-3 password" controlId="password">
                        <div><Form.Label>Mật khẩu</Form.Label></div>
                        
                        <div className="password-section">
                            <Form.Control size="sm" className="input-password" 
                                type={passwordType} required placeholder="Nhập mật khẩu" 
                                onChange={handlePasswordChange} value={passwordInput}></Form.Control>

                            <div>
                                <button type='button' className="btn-outline-primary" onClick={togglePassword}>
                                    { passwordType==="password"? <i className="fas fa-eye"></i> :<i className="fas fa-eye-slash"></i> }</button>
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 password" controlId="repassword">
                        <div><Form.Label>Xác nhận mật khẩu</Form.Label></div>
                        
                        <div className="password-section">
                            <Form.Control size="sm" className="input-password" 
                                type={repasswordType} required placeholder="Nhập lại mật khẩu" 
                                onChange={handlerePasswordChange} value={repasswordInput}></Form.Control>

                            <div>
                                <button type="button" className="btn-outline-primary" onClick={togglerePassword}>
                                    { repasswordType==="password"? <i className="fas fa-eye"></i> :<i className="fas fa-eye-slash"></i> }</button>
                            </div>
                        </div>
                    </Form.Group>

                    <div className="mb-3 submit-button"><Button type="submit">Đăng ký</Button></div>
                </Form>
            </div>
        </Container>
        </div>
    );
}