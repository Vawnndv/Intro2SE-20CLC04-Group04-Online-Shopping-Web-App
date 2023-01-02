import React, { useContext, useEffect } from "react";
import { useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../../Store";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import { getError } from "../../utils";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import product from "../product/product";
import {
  faTrashCan,
  faPenToSquare,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import "./ProductListScreen.css";
import { formatPrice } from "../../utils";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: true, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm("Bạn có chắc muốn tạo không?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          "/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("Đã tạo sản phẩm thành công");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Sản phẩm đã xóa thành công");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Danh sách sản phẩm</title>
      </Helmet>

      <Row>
        <Col>
          <h1>Danh sách sản phẩm</h1>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <MDBTable className="table" responsive="lg md sm" size="sm">
            <MDBTableHead dark>
              <tr className="trProductDetails">
                <th scope="col" className="productHeader">
                  ID
                </th>
                <th scope="col" className="productHeader">
                  Hình ảnh sản phẩm
                </th>
                <th scope="col" className="productHeader">
                  Tên sản phẩm
                </th>
                <th scope="col" className="productHeader">
                  Giá
                </th>
                <th scope="col" className="productHeader">
                  Loại
                </th>
                <th scope="col" className="productHeader">
                  Nhãn hiệu
                </th>
                <th scope="col" className="productHeader">
                  Hành động
                </th>
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {products.map((product) => (
                <tr key={product._id} className="productTableRow">
                  <th className="productHeader" scope="row">
                    {product._id}
                  </th>
                  <td>
                    <div className=" d-flex align-items-center justify-content-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "130px", height: "100px" }}
                        className="rounded"
                      ></img>
                    </div>
                  </td>
                  <td style={{ width: "200px" }} className="productListTD">
                    {product.name}
                  </td>
                  <td className="productListTD">
                    <h5>
                      <MDBBadge color="primary">
                        {formatPrice(product.price)}
                      </MDBBadge>
                    </h5>
                  </td>
                  <td className="productListTD">
                    <h5>
                      <MDBBadge color="success">{product.category}</MDBBadge>
                    </h5>
                  </td>
                  <td className="productListTD">
                    <h5>
                      <MDBBadge color="secondary">{product.brand}</MDBBadge>
                    </h5>
                  </td>
                  <td className="productListTD buttonGroup">
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      className="editButton"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh sửa
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="danger"
                      className="deleteButton"
                      onClick={() => deleteHandler(product)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <Row>
            <Col className="col text-end createProductCol justify-content-center d-flex">
              <div>
                <Button
                  type="button"
                  className="createProductButton"
                  onClick={createHandler}
                >
                  <FontAwesomeIcon icon={faPlusSquare} /> Thêm sản phẩm
                </Button>
              </div>
            </Col>
          </Row>

          <div className="productPagination">
            {[...Array(pages).keys()].map((x) => (
              Number(page) - 1 === x + 1 || Number(page) === x + 1 || Number(page) + 1 === x + 1   ? (
                <Link
                  className={
                    x + 1 === Number(page) ? "btn btn-primary" : "btn btn-light"
                  }
                  key={x + 1}
                  to={`/admin/products?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ): (<></>)
            ))}
          </div>
        </>
      )}
    </div>
  );
}
