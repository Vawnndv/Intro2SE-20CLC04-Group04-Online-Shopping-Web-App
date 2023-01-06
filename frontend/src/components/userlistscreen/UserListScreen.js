import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../../Store";
import axios from "axios";
import { getError } from "../../utils";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../loadingbox/LoadingBox";
import MessageBox from "../messagebox/MessageBox";
import Button from "react-bootstrap/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./UserListScreen.css";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
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

export default function UserListScreen() {
  const [
    { loading, error, users, loadingDelete, successDelete, pages },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users?page=${page}`, {
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
  }, [userInfo, successDelete, page]);

  const deleteHandler = async (user) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Đã xóa thành công người dùng");
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
        <title>Danh sách người dùng</title>
      </Helmet>
      <h1>Danh sách người dùng</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <MDBTable className="table" responsive="lg md sm" size="sm">
            <MDBTableHead dark>
              <tr>
                <th scope="col" className="userHeader">
                  ID
                </th>
                <th scope="col" className="userHeader">
                  Tên
                </th>
                <th scope="col" className="userHeader">
                  Email
                </th>
                <th scope="col" className="userHeader">
                  Admin
                </th>
                <th scope="col" className="userHeader">
                  Hành động
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {users.map((user) => (
                <tr key={user._id} className="userTableRow">
                  <td className="userHeader">{user._id}</td>
                  <td className="userListTD">{user.name}</td>
                  <td className="userListTD">{user.email}</td>
                  <td className="userListTD">
                    <h5>
                      <MDBBadge color={user.isAdmin ? "success" : "danger"}>
                        {user.isAdmin ? "Có" : "Không"}
                      </MDBBadge>
                    </h5>
                  </td>
                  <td className="buttonGroup">
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => {
                        navigate(`/admin/user/${user._id}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenSquare} /> Chỉnh sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <div className="productPagination">
            {[...Array(pages).keys()].map((x) =>
              Number(page) - 1 === x + 1 ||
              Number(page) === x + 1 ||
              Number(page) + 1 === x + 1 ? (
                <Link
                  className={
                    x + 1 === Number(page) ? "btn btn-primary" : "btn btn-light"
                  }
                  key={x + 1}
                  to={`/admin/users?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ) : (
                <></>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
