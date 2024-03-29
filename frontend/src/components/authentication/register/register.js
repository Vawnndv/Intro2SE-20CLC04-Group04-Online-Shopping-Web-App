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
import auth from '../../../firebase';

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

    const dataHandler = async(e) => {
        try{
            const {data} = await Axios.post('/api/users/register', {
                email,
                password,
                name,
                address,
                phone,
                dob
            });

            // ctxDispatch({type: 'USER_LOGIN', payload: data})
            // localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/login')
        }catch(error){
        }
    }
    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== reenterPassword){
            alert('Mật khẩu không trùng khớp')
            return;
        }

        auth.createUserWithEmailAndPassword(email , password)
        .then((userCredential)=>{
          // send verification mail.
            userCredential.user.sendEmailVerification();
            auth.signOut();
            alert("Đã gửi email xác nhận đăng ký vào hòm thư của bạn");
            
           
            dataHandler(e);
        })
        .catch(alert);
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

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3 email" controlId="name">
                        <div><Form.Label>Họ tên</Form.Label></div>
                        <Form.Control size="lg" className="input-name" 
                        type="text" required placeholder="Nhập email" onChange={(e) => setName(e.target.value)} style={{width: '300px'}}/>
                    </Form.Group>

                    <Form.Group className="mb-3 dob" controlId="dob">
                        <div><Form.Label>Ngày sinh</Form.Label></div>
                        <Form.Control size="lg" className="input-dob" 
                        type="date" onChange={(e) => setDOB(e.target.value)} required placeholder="Nhập ngày sinh"/>
                    </Form.Group>

                    <Form.Group className="mb-3 address" controlId="address">
                        <div><Form.Label>Địa chỉ</Form.Label></div>
                        <Form.Control size="lg" className="input-address" 
                        type="text" onChange={(e) => setAddress(e.target.value)} required placeholder="Nhập địa chỉ"/>
                    </Form.Group>

                    <Form.Group className="mb-3 email" controlId="phone">
                        <div><Form.Label>Số điện thoại</Form.Label></div>
                        <Form.Control size="lg" className="input-phone" 
                        type="text" onChange={(e) => setPhone(e.target.value)} required placeholder="Nhập số điện thoại" maxLength='10'/>
                    </Form.Group>

                    <Form.Group className="mb-3 email" controlId="email">
                        <div><Form.Label>Địa chỉ Email</Form.Label></div>
                        <Form.Control size="lg" className="input-email" 
                        type="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Nhập email"/>
                    </Form.Group>

                    <Form.Group className="mb-3 password" controlId="password">
                        <div><Form.Label>Mật khẩu</Form.Label></div>
                        
                        <div className="password-section">
                            <Form.Control size="lg" className="input-password" 
                                type={passwordType} required placeholder="Nhập mật khẩu" 
                                onChange={(e) => {handlePasswordChange(e); setPassword(e.target.value)}} value={passwordInput}></Form.Control>

                            <div>
                                <button type='button' className="btn-outline-primary" onClick={togglePassword}>
                                    { passwordType==="password"? <i className="fas fa-eye"></i> :<i className="fas fa-eye-slash"></i> }</button>
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 password" controlId="repassword">
                        <div><Form.Label>Xác nhận mật khẩu</Form.Label></div>
                        
                        <div className="password-section">
                            <Form.Control size="lg" className="input-password" 
                                type={repasswordType} required placeholder="Nhập lại mật khẩu" 
                                onChange={(e) => {handlerePasswordChange(e); setReenterPassword(e.target.value)}} value={repasswordInput}></Form.Control>

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