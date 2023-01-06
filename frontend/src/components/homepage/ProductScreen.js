import "./ProductScreen.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
// import Card from 'react-bootstrap/Card';
// import Rating from '../rating/rating.css';
import ListGroup from "react-bootstrap/ListGroup";
import Rating from "../rating/rating";
import { Card, Nav } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import { formatPrice, getError } from "../../utils";
import { Store } from "../../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_REVIEW_CREATE_REQUEST":
      return { ...state, loadingReviewCreate: true };
    case "FETCH_REVIEW_CREATE_SUCCESS":
      return {
        ...state,
        loadingReviewCreate: false,
        successReviewCreate: true,
        review: action.payload,
      };
    case "FETCH_REVIEW_CREATE_FAIL":
      return {
        ...state,
        loadingReviewCreate: false,
        errorReviewCreate: action.payload,
      };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [
    {
      loading,
      error,
      product,
      loadingReviewCreate,
      errorReviewCreate,
      successReviewCreate,
      review,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
    loadingReviewCreate: false,
    errorReviewCreate: "",
    successReviewCreate: false,
    review: [],
  });

  console.log({
    loading,
    error,
    product,
    loadingReviewCreate,
    errorReviewCreate,
    successReviewCreate,
    review,
  });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    if (successReviewCreate) {
      window.alert("Review Submitted Successfully");
      setRating("");
      setComment("");
      return;
    }
  }, [slug, successReviewCreate]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const { userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.quantity < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const createReview = async (productId, review) => {
    dispatch({ type: "FETCH_REVIEW_CREATE_REQUEST" });
    try {
      const data = await axios.post(
        `/api/products/slug/${product._id}/reviews`,
        review,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "FETCH_REVIEW_CREATE_SUCCESS", payload: data.review });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: "FETCH_REVIEW_CREATE_FAIL", payload: message });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(product._id, { rating, comment, name: userInfo.name })
      );
    } else {
      alert("Please enter comment and rating");
    const submitHandler = (e) => {
        e.preventDefault();
        if(comment && rating) {
            dispatch(
                createReview(product._id, {comment, rating, name: userInfo.name})
            );
        } else {
            alert('Please enter comment and rating')
        }
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 className="productName">{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.reviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Decription:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{formatPrice(product.price)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.quantity > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unvailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.quantity > 0 && (
                  <>
                    {userInfo && userInfo.isAdmin ? (
                      <></>
                    ) : (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button onClick={addToCartHandler} variant="primary">
                            Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  </>
                )}
              </ListGroup>
            </Card>
          </Card>
        </Col>
      </Row>
      <Row>
        <h2 id="reviews">Reviews</h2>
        {product.customerReviews.length === 0 && (
          <MessageBox>There is no review</MessageBox>
        )}
        <ul>
          {product.customerReviews.map((review) => (
            <li key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </li>
          ))}
          <li>
            {userInfo ? (
              <form className="form" onSubmit={submitHandler}>
                <div>
                  <h2>Write a customer review</h2>
                </div>
                <div>
                  <label htmlFor="rating">Rating</label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="0">Select...</option>
                    <option value="1">1- Poor</option>
                    <option value="2">2- Fair</option>
                    <option value="3">3- Good</option>
                    <option value="4">4- Very good</option>
                    <option value="5">5- Excelent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label />
                  <button className="primary" type="submit">
                    Submit
                  </button>
                </div>
                <div>
                  {loadingReviewCreate && <LoadingBox></LoadingBox>}
                  {errorReviewCreate && (
                    <MessageBox variant="danger">
                      {errorReviewCreate}
                    </MessageBox>
                  )}
                </div>
              </form>
            ) : (
              <MessageBox>
                Please <Link to="/login">Sign In</Link> to write a review
              </MessageBox>
            )}
          </li>
        </ul>
      </Row>
    </div>
  );
    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={6}><img className="img-large" src={product.image} alt={product.name}></img></Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating rating={product.rating} numReviews={product.reviews}></Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price : ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Decription:
                            <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>{formatPrice(product.price)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.quantity > 0 ? (
                                                <Badge bg="success">In Stock</Badge>
                                            ) : (
                                                <Badge bg="danger">Unvailable</Badge>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.quantity > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">Add to Cart</Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row>
                <div  id="reviews" className="d-flex align-items-center">
                    <h2>
                        Đánh giá sản phẩm
                    </h2>
                    <Rating rating={product.rating} numReviews={product.reviews}></Rating>
                </div>

                {product.customerReviews.length === 0 && (
                    <MessageBox>There is no review</MessageBox>
                )}
                <ul>
                    {product.customerReviews.map((review) => (
                        <li key={review._id} className="review_section">
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption=" "></Rating>
                            <p className="mb-0">{review.createdAt.substring(0, 10)}</p>
                            <h5>{review.comment}</h5>
                        </li>
                    ))}
                    <li>
                        {userInfo ? (
                            <form className="form" onSubmit={submitHandler}>
                                <div>
                                    <h2>Write a customer review</h2>
                                </div>
                                <div>
                                    <label htmlFor="rating">Rating</label>
                                    <select
                                        id="rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="1">1- Poor</option>
                                        <option value="2">2- Fair</option>
                                        <option value="3">3- Good</option>
                                        <option value="4">4- Very good</option>
                                        <option value="5">5- Excelent</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="comment">Comment</label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label />
                                    <button className="primary" type="submit">
                                        Submit
                                    </button>
                                </div>
                                <div>
                                    {loadingReviewCreate && <LoadingBox></LoadingBox>}
                                    {errorReviewCreate && (
                                        <MessageBox variant="danger">
                                            {errorReviewCreate}
                                        </MessageBox>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <MessageBox>
                                Please <Link to="/login">Sign In</Link> to write a review
                            </MessageBox>
                        )}
                    </li>
                </ul>
            </Row>

        </div>
    );
}
export default ProductScreen;