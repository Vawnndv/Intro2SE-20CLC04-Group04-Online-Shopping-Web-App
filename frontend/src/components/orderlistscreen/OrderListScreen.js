import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import "./OrderListScreen.css";
import { formatPrice } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faInfoCircle,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Đơn hàng đã xóa thành công");
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
        <title>Danh sách đơn hàng</title>
      </Helmet>
      <h1>Danh sách đơn hàng</h1>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <MDBTable className="table" responsive="lg md sm" size="sm">
          <MDBTableHead dark>
            <tr>
              <th scope="col" className="orderHeader">
                ID
              </th>
              <th scope="col" className="orderHeader">
                Khách hàng
              </th>
              <th scope="col" className="orderHeader">
                Ngày
              </th>
              <th scope="col" className="orderHeader">
                Tổng
              </th>
              <th scope="col" className="orderHeader">
                Đã thanh toán
              </th>
              <th scope="col" className="orderHeader">
                Đã giao hàng
              </th>
              <th scope="col" className="orderHeader">
                Hành động
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {orders.map((order) => (
              <tr key={order._id} className="orderTableRow">
                <th scope="row" className="orderHeader">
                  {order._id}
                </th>
                <td className="orderListTD">
                  {order.user ? order.user.name : "Đã xóa người dùng"}
                </td>
                <td className="orderListTD">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="orderListTD">
                  <h5>
                    <MDBBadge color="primary">
                      {formatPrice(order.totalPrice)}
                    </MDBBadge>
                  </h5>
                </td>
                <td className="orderListTD">
                  {order.isPaid ? (
                    <h5>
                      <MDBBadge color="success lg">
                        {order.paidAt.substring(0, 10)}
                      </MDBBadge>
                    </h5>
                  ) : (
                    <h5>
                      <MDBBadge color="danger">Chưa</MDBBadge>
                    </h5>
                  )}
                </td>
                <td className="orderListTD">
                  {order.isDelivered ? (
                    <h5>
                      <MDBBadge color="success">
                        {order.deliveredAt.substring(0, 10)}
                      </MDBBadge>
                    </h5>
                  ) : (
                    <h5>
                      <MDBBadge color="danger">Chưa</MDBBadge>
                    </h5>
                  )}
                </td>
                <td className="orderListTD buttonGroup">
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> Chi tiết
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => deleteHandler(order)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} /> Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      )}
    </div>
  );
}
