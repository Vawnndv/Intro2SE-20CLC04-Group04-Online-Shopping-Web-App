import './Footer.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Container } from 'react-bootstrap';

export default function Footer(){
    return (
      <Container className="FooterContainer" fluid id='footer'>
        <Row className="footerRow">
          <Col xs={1} className="uLogoContainer">
            <img
              className="uLogo"
              src="../../images/logoHCMUS.png"
              alt="Logo Trường"
            ></img>
          </Col>
          <Col xs={3}>
            <p className="primaryFooterTitle">
              WEBSITE THƯƠNG MẠI ĐIỆN TỬ HKVTV
            </p>
            <p className="secondaryFooterTitle">
              Trường Đại học Khoa học Tự nhiên
            </p>
            <p className="normalFooterFont">Đại học Quốc gia TP.HCM</p>
            <p className="normalFooterFont">
              Đồ Án Cuối Kì Nhập Môn Công Nghệ Phần Mềm
            </p>
          </Col>
          <Col xs={2}>
            <p className="primaryFooterTitle">Giáo viên hướng dẫn:</p>
            <p className="normalFooterFont">T.s Nguyễn Minh Huy</p>
            <p className="normalFooterFont">Th.s Hồ Tuấn Thanh</p>
          </Col>
          <Col xs={3}>
            <p className="primaryFooterTitle">Các thành viên trong nhóm:</p>
            <p className="normalFooterFont">20127662 - Nguyễn Đình Văn</p>
            <p className="normalFooterFont">20127643 - Trương Gia Tiến</p>
            <p className="normalFooterFont">20127425 - Lê Trần Phi Hùng</p>
            <p className="normalFooterFont">20127669 - Ngô Anh Vũ</p>
            <p className="normalFooterFont">20127545 - Trần Anh Kiệt</p>
          </Col>
          <Col xs={2}>
            <p className="primaryFooterTitle">Địa chỉ trụ sở chính: </p>
            <p className="normalFooterFont">
              Số 227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh
            </p>
          </Col>
        </Row>
      </Container>
    );
}