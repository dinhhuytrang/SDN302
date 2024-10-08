import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { message } from "antd"
import formatDate from "../../function/formatDate"
import Footer from "../Footer"
import { BASE_URL } from "../../constant/constant"

const DetailAccount = () => {
    const [user, setUser] = useState()
    const location = useLocation()
    const [order, setOrder] = useState()
    const token = JSON.parse(localStorage.getItem("admin"))?.token;
    const navigate = useNavigate()
    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);


    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams(location.search);
            const idUser = queryParams.get("idUser")
            if (idUser !== null) {
                const userApi = await axios.post(`${BASE_URL}/reloadUser?idUser=${idUser}`)
                setUser(userApi.data);

                const orderApi = await axios.get(`${BASE_URL}/order?idUser=${idUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setOrder(orderApi.data)
            }
        } catch (error) {
            console.log(error);
        }

    }

    const resetPassword = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/resetPassword?idUser=${user?.id}`)
            message.success(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const trStyle = {
        height: "40px"
    }
    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ background: "#FCFCFC" }}>
                        <Container className="row">
                            <Col xs={4}>
                                <div >
                                    <img src={user?.avatar} alt="Chưa có ảnh" style={{ width: "100%", height: "auto" }} />
                                </div>
                                <div style={{ fontSize: "18px", marginTop: "30px" }}>
                                    <div>
                                        Tên đăng nhập: <span style={{ marginLeft: "10px", color: "#8E92BC" }}>{user?.username}</span>
                                    </div>
                                    <div>
                                        <Link onClick={() => resetPassword()} style={{ fontSize: "15px" }}>Đặt lại mật khẩu</Link>
                                    </div>
                                </div>

                            </Col>
                            <Col xs={8} style={{ fontSize: "18px" }}>
                                <table>
                                    <tbody>
                                        <tr style={trStyle}>
                                            <td style={{ width: "200px" }}>Họ tên </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.name}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Email </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.email}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Số điện thoại </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.phone}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Địa chỉ nhận hàng </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.address ? user?.address : "Chưa có địa chỉ"}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Sinh nhật </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.birthday ? user?.birthday : "Chưa có thông tin"}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Địa chỉ lấy hàng </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.pickupAddress ? user?.pickupAddress : "Chưa có thông tin"}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Ngày tham gia </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.dateSignup ? formatDate(user?.dateSignup) : "Chưa có thông tin"}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Đơn hàng đã đặt </td>
                                            <td style={{ color: "#8E92BC" }}>{order?.length}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Trạng thái tài khoản </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.status ? (<span style={{ color: "green" }}>Bình thường</span>) : (<span style={{ color: "red" }}>Đã bị khóa</span>)}</td>
                                        </tr>
                                        <tr style={trStyle}>
                                            <td>Xác nhận tài khoản </td>
                                            <td style={{ color: "#8E92BC" }}>{user?.activeEmail ? (<span style={{ color: "green" }}>Đã kích hoạt</span>) : (<span style={{ color: "red" }}>Chưa kích hoạt</span>)}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </Col>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <br /><br />
            <Footer />
        </div>
    )
}
export default DetailAccount