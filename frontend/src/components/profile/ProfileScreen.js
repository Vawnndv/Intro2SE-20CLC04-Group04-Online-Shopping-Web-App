import React, { useContext } from "react";
import { Store } from "./../../Store";
import { Helmet } from "react-helmet-async";
import { Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "./../../utils";
import axios from "axios";
import auth from "../../firebase";
import "./profile.css";
import Card from "react-bootstrap/Card";
import { formatDate } from "./../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

let ProfileScreen = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");

  const [repasswordType, setrePasswordType] = useState("password");
  const [repasswordInput, setrePasswordInput] = useState("");

  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handlerePasswordChange = (evnt) => {
    setrePasswordInput(evnt.target.value);
  };

  const togglerePassword = () => {
    if (repasswordType === "password") {
      setrePasswordType("text");
      return;
    }
    setrePasswordType("password");
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [address, setAddress] = useState(userInfo.address);
  const [phone, setPhone] = useState(userInfo.phone);
  const [dob, setDOB] = useState(formatDate(userInfo.dob));
  const [newEmail, setNewEmail] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    alert(dob)
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          phone,
          address,
          dob
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Cập nhật tài khoản thành công")
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const emailDataChange = async (e) => {
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        {
          newEmail,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };
  const emailChangeHandler = async (e) => {
    e.preventDefault();
    
    if (
      window.confirm(
        "Bạn sẽ tự động đăng xuất nếu quá trình thay đổi email diễn ra thành công! \nVui lòng xác nhận hành động này"
      )
    ) {
      auth
        .signInWithEmailAndPassword(email, reenterPassword)
        .then((userCredential) => {
          userCredential.user
            .verifyBeforeUpdateEmail(newEmail)
            .then(() => {
              alert(
                "Một email xác nhận đã được gửi đến địa chỉ mail mới, email hiện tại sẽ không thể sử dụng được nữa, khi bạn nhấn tiếp tục tài khoản sẽ tự động đăng xuất"
              );
              emailDataChange(e);
              auth.signOut();
              ctxDispatch({ type: "USER_LOGOUT" });
              localStorage.removeItem("userInfo");
              localStorage.removeItem("cartItems");
              localStorage.removeItem("shippingAddress");
              localStorage.removeItem("paymentInfo");
            })
            .catch((alertMSG) => {
              if (
                alertMSG ===
                "Error: The email address is already in use by another account."
              ) {
                alert(
                  "Địa chỉ email này đã được đăng ký với một tài khoản khác"
                );
              } else if (
                alertMSG ===
                "Error: The password is invalid or the user does not have a password."
              ) {
                alert("Mật khẩu không đúng, vui lòng thử lại");
              }
            });
        })
        .catch(alert);
    }
  };

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth
          .sendPasswordResetEmail(email)
          .then(() => {
            alert(
              "Link đổi mật khẩu đã được gửi đến hòm thư của bạn, vui lòng kiểm tra email để đổi mật khẩu"
            );
          })
          .catch(alert);
      })
      .catch(alertMSG => {
        if("Error: The password is invalid or the user does not have a password.")
            alert("Mật khẩu không chính xác")
      });
  };

  return (
    <div className="container">
      <Helmet>
        <title>Thông tin người dùng</title>
      </Helmet>
      <div className="d-flex flex-column">
        <h1 className="my-3">Thông tin người dùng</h1>

        <Row className="info-row">
          <Col>
            <form onSubmit={submitHandler}>
              <Card>
                <Card.Header as="h5">Đổi thông tin cá nhân</Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="dob">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                          type="date"
                          value={dob}
                          size="lg"
                          onChange={(e) => setDOB(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <div className="mb-3 changeInfo-form">
                      <Button type="submit" style={{ width: "100px" }}>
                        Cập nhật
                      </Button>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </form>
          </Col>
        </Row>

        <Row>
          <Col>
            <form onSubmit={passwordChangeHandler}>
              <Card>
                <Card.Header as="h5">Đổi mật khẩu</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3 password" controlId="password">
                    <div>
                      <Form.Label>Mật khẩu hiện tại</Form.Label>
                    </div>

                    <div className="password-section">
                      <Form.Control
                        size="lg"
                        className="input-password"
                        type={passwordType}
                        placeholder="Nhập mật khẩu hiện tại"
                        onChange={(e) => {
                          handlePasswordChange(e);
                          setPassword(e.target.value);
                        }}
                        value={passwordInput}
                      ></Form.Control>

                      <div>
                        <button
                          type="button"
                          className="btn-outline-primary"
                          onClick={togglePassword}
                        >
                          {passwordType === "password" ? (
                            <i className="fas fa-eye"></i>
                          ) : (
                            <i className="fas fa-eye-slash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form.Group>

                  <div className="mb-3 changePassword-form">
                    <Button type="submit" style={{ width: "125px" }}>
                      Đổi mật khẩu
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </form>
          </Col>

          <Col>
            <form onSubmit={emailChangeHandler}>
              <Card>
                <Card.Header as="h5">Đổi Email</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email hiện tại</Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email mới</Form.Label>
                    <Form.Control
                      // value={email}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Điền Email mới"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 password" controlId="password">
                    <div>
                      <Form.Label>Mật khẩu</Form.Label>
                    </div>
                    <div className="password-section">
                      <Form.Control
                        size="lg"
                        className="input-password"
                        type={repasswordType}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => {
                          handlerePasswordChange(e);
                          setReenterPassword(e.target.value);
                        }}
                        value={repasswordInput}
                      ></Form.Control>

                      <div>
                        <button
                          type="button"
                          className="btn-outline-primary"
                          onClick={togglerePassword}
                        >
                          {repasswordType === "password" ? (
                            <i className="fas fa-eye"></i>
                          ) : (
                            <i className="fas fa-eye-slash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form.Group>
                  <div className="mb-3 changeEmail-form">
                    <Button type="submit" style={{ width: "100px" }}>
                      Đổi email
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </form>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ProfileScreen;
