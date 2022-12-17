import {Button, Container} from "react-bootstrap";
import {useLocation} from "react-router-dom";
import './login.css'
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useContext, useState } from "react";
import '../../fontawesome/FontAwesome'
import { Link } from "react-router-dom";
import Axios from 'axios'
import {Store} from '../../../Store';

function Login() {
    const {search} = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    
    const [passwordType, setPasswordType] = useState("password");
    const [passwordInput, setPasswordInput] = useState("");
    
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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            const {data} = await Axios.post('/api/users/login', {
                email,
                password,
            });
            
            ctxDispatch({type: 'USER_SIGIN', payload: data})
            // if(data === 'invalid'){
            //     alert("Email hoặc mật khẩu không đúng")
            // }
        } catch (error) {
            console.log(error);
        }
    }

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

                <span className="forget-password-container">
                    <button className="forget-btn bg-secondary">Quên mật khẩu</button>
                </span>
            </div>
        </Container>
    )
}
export default Login;