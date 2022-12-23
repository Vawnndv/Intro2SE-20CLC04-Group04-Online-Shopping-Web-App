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
import './login.css'
function Login() {
    const navigate = useNavigate();
    const {search} = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    
    const [passwordType, setPasswordType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    let isVerified = false;
   
    const handlePasswordChange = (evnt)=>{
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

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = async(e) => {
        try {
            const {data} = await Axios.post('/api/users/login', {
                email,
                password,
                isVerified,
            });
            
            console.log(isVerified)
            // console.log(data);
            ctxDispatch({type: 'USER_LOGIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/')
            
        } catch (error) {
            
        }
    }

    const submitHandler = async(e) => {
        e.preventDefault();
       
        auth.signInWithEmailAndPassword(email , password)
        .then((userCredential)=>{
            const temp = auth.currentUser.emailVerified
            isVerified = temp;
            
            if(isVerified)
                loginHandler(e);
            else{
                alert("Email chưa xác nhận, đã gửi lại mail xác nhận mới đến hòm thư của bạn");
                userCredential.user.sendEmailVerification();
            }
        })
        .catch(mess => {
            if(mess.code === "auth/too-many-requests")
                alert("Tài khoản tạm thời bị khóa vì nhập sai mật khẩu nhiều lần")
            else if(mess.code === "auth/wrong-password")
                alert("Sai mật khẩu, vui lòng kiểm tra lại")
            else if(mess.code === "auth/user-not-found")
                alert("Không tìm thấy tài khoản trong hệ thống, vui lòng kiểm tra lại, có thể tài khoản chưa đăng ký")
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
                        <title>Đăng nhập</title>
                    </Helmet>

                    <div className="redirect-nav">
                        <h4 className="my-3 signin">Đăng nhập</h4>

                        <Link to={`/register?redirect=${redirect}`} style={{ textDecoration: 'none' }}><h4 className="my-3 register">Đăng ký</h4></Link>
                    </div>
                </div>

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3 email" controlId="email">
                        <div><Form.Label>Địa chỉ Email</Form.Label></div>
                        <Form.Control size="sm" className="input-email" type="text" onChange={(e) => setEmail(e.target.value)} required placeholder="Nhập email"/>
                    </Form.Group>

                    <Form.Group className="mb-3 password" controlId="password">
                        <div><Form.Label>Mật khẩu</Form.Label></div>
                        
                        <div className="password-section">
                            <Form.Control size="sm" className="input-password" 
                                type={passwordType} required placeholder="Nhập mật khẩu" 
                                onChange={(e) => {handlePasswordChange(e); setPassword(e.target.value)}} value={passwordInput}></Form.Control>

                            <div>
                                <button type="button" className="btn-outline-primary" onClick={togglePassword}>
                                    { passwordType==="password"? <i className="fas fa-eye"></i> :<i className="fas fa-eye-slash"></i> }</button>
                            </div>
                        </div>
                    </Form.Group>

                    <div className="mb-3 submit-button"><Button type="submit">Đăng nhập</Button></div>
                </Form>

                <Link className="forget-password-container" to={`/forget`}>
                    <button className="forget-btn bg-secondary" >Quên mật khẩu</button>
                </Link>
            </div>
        </Container>
    )
}
export default Login;