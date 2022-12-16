import {Button, Container, Helmet} from "react-bootstrap";
import { Form, useLocation } from "react-router-dom";
import './login.css'

function Login() {
    const {search} = useLocation()
    const {redirectInUrl} = new URLSearchParams(search).get('redirect');
    
    return (
        <Container className="small-container">
            <Helmet>
                <title>Đăng nhập</title>
            </Helmet>
            <h1 className="my-3">Đăng nhập</h1>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <Form.Control type="email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" required />
                </Form.Group>

                <div className="mb-3"><Button type="submit">Đăng nhập</Button></div>
            </Form>
        </Container>
    )
}
export default Login;