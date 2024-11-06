import { Col, Container, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import formatMoney from "../../function/formatMoney";
import { message, Modal, notification, Pagination, Rate } from "antd";
import { BASE_URL, CANCEL, COMPLETED, PREPARING_ORDER, SHIPPING, WAIT_FOR_CONFIRM_ORDER } from "../../constant/constant";
import TextArea from "antd/es/input/TextArea";
import { FaStar } from "react-icons/fa";
import Header from "../Header/Header";

const PurchaseOrder = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [orders, setOrders] = useState()
    const [allItem, setAllItem] = useState()
    const [openRate, setOpenRate] = useState(false)
    const [idProductRate, setIdProductRate] = useState()
    const [idItemRate, setIdItemRate] = useState()
    const [star, setStar] = useState(1)
    const [review, setReview] = useState()
    const [filterStatus, setFilterStatus] = useState("Tất cả")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate()
    const [openCancelOrder, setOpenCancelOrder] = useState(false)
    const [reasonCancel, setReasonCancel] = useState('')
    const [idOrderCancel, setIdOrderCancel] = useState()
    const [searchOrderByCode, setSearchOrderByCode] = useState('')

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"))
        if (!user) {
            navigate('/signin')
        } else {
            setUser(userLocal);
            fetchData(userLocal?.id)
        }
    }, [navigate]);

    const fetchData = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/orders?idUser=${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                })
            console.log(response.data.orders);

            setOrders(response.data.orders.map((order) => ({
                ...order
            }))
                .reverse());

            const listItemApi = await axios.get(`${BASE_URL}/api/orders/orderItems?idUser=${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                })
            console.log(listItemApi.data.orderItems);

            // const updatedListItem = await Promise.all(listItemApi.data.map(async (item) => {
            //     const rate = await getRate(item?.id)
            //     return { ...item, rate: rate.star };
            // }))
            setAllItem(listItemApi.data.orderItems.reverse())
        } catch (error) {
            console.log(error);
        }
    }
    // const getRate = async (idOrderItem) => {
    //     try {
    //         const response = await axios.post(`${BASE_URL}/rateOfItem?idOrderItem=${idOrderItem}`)
    //         return response.data
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const checkQuantityOfItemOfOrder = (idOrder) => {
        const listItemOfOrder = allItem?.filter(item => item.order._id === idOrder)
        return listItemOfOrder?.length
    }
    const viewDetailProduct = (product) => {
        navigate(`/product/${product.idProduct}`)
    }
    const buttonFilterStyle = {
        border: "none",
        padding: "15px 0",
        borderRight: "solid 1px #F0F0F0",
    }
    const changeStatusOrder = async (idOrder) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/orders/changeStatus?idOrder=${idOrder}`)
            console.log(response.data);
            if (response) {
                notification.open({
                    message: "Thông báo",
                    description: response.data.message,
                    placement: "topRight",
                    duration: 3, // thời gian hiển thị (giây), có thể chỉnh sửa
                    style: {
                        backgroundColor: response.status === 200 ? "green" : "#f8d7da",
                        color: response.status === 200 ? "#FFFFFF" : "#721c24"
                    },
                });
            }
            fetchData(user?.id)
        } catch (error) {
            console.log(error);
        }
    }

    const showRateForm = (idProduct, idItem) => {
        setIdProductRate(idProduct)
        setIdItemRate(idItem)
        setOpenRate(true)
    }
    const handleOk = async (e) => {
        e.preventDefault()
        console.log(star);
        console.log(review);
        const rate = {
            idProduct: idProductRate,
            idUser: user.id,
            idOrderItem: idItemRate,
            star: star,
            review: review
        }
        try {
            const response = await axios.post(`${BASE_URL}/rateProduct`, rate)
            console.log(response.data);
            fetchData()
        } catch (error) {
            console.log(error);
        }

        setOpenRate(false);
    };

    const handleCancel = () => {
        setOpenRate(false);
    };

    const okCancel = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/cancelOrder?idOrder=${idOrderCancel}`)
            if (response.status === 200) {
                message.success("Hủy thành công")
            } else {
                message.error(response.data)
            }
            setOpenCancelOrder(false)
        } catch (error) {
            console.log(error);
        }
        fetchData(user?.id)
    }

    const viewDetailOrder = (idOrder) => {
        navigate(`/purchaseOrder/detail?idOrder=${idOrder}`)
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders
        ?.filter(order => searchOrderByCode !== '' ? order.code === searchOrderByCode : order)
        ?.filter(order => filterStatus === "Tất cả" || order?.status === filterStatus)
        ?.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <Header />
            <Container style={{ background: "#F5F5F5" }}>

                <Row style={{ background: "white", margin: "0 0 10px 0" }}>
                    <button onClick={() => setFilterStatus("Tất cả")} className="col-2"
                        style={{ ...buttonFilterStyle, backgroundColor: filterStatus === "Tất cả" ? '' : "white" }}>Tất cả</button>
                    <button onClick={() => setFilterStatus(WAIT_FOR_CONFIRM_ORDER)} className="col-2" style={{ ...buttonFilterStyle, backgroundColor: filterStatus === WAIT_FOR_CONFIRM_ORDER ? '' : "white" }}>Chờ xác nhận</button>
                    <button onClick={() => setFilterStatus(PREPARING_ORDER)} className="col-2" style={{ ...buttonFilterStyle, backgroundColor: filterStatus === PREPARING_ORDER ? '' : "white" }}>Đang chuẩn bị hàng</button>
                    <button onClick={() => setFilterStatus(SHIPPING)} className="col-2" style={{ ...buttonFilterStyle, backgroundColor: filterStatus === SHIPPING ? '' : "white" }}>Đang vận chuyển</button>
                    <button onClick={() => setFilterStatus(COMPLETED)} className="col-2" style={{ ...buttonFilterStyle, backgroundColor: filterStatus === COMPLETED ? '' : "white" }}>Hoàn thành</button>
                    <button onClick={() => setFilterStatus(CANCEL)} className="col-2" style={{ ...buttonFilterStyle, backgroundColor: filterStatus === CANCEL ? '' : "white" }}>Đã hủy</button>
                </Row>
                <div style={{ background: "#EAEAEA" }}>
                    <CiSearch style={{ width: "35px", height: "auto", padding: "5px" }} />
                    <input onChange={(e) => setSearchOrderByCode(e.target.value)} style={{ width: "96%", background: "#EAEAEA", border: "none", padding: "10px 0" }} placeholder="Nhập mã đơn hàng để tìm kiếm" />
                </div>
                <div style={{ margin: "10px 0 15px 0" }}>
                    {currentOrders
                        ?.filter(order =>
                            filterStatus === "Tất cả" || order?.status === filterStatus
                        )
                        ?.map(order => (
                            <div key={order?._id} style={{ marginBottom: "20px", background: "white", borderRadius: "10px" }}>
                                {checkQuantityOfItemOfOrder(order._id) === 1 ? (
                                    <div>
                                        {allItem?.map(item =>
                                            item.order._id === order._id ? (
                                                <Container key={item._id}>
                                                    <div style={{ borderBottom: "1px solid #7F7F7F", padding: "20px 10px" }}>
                                                        {order?.status === COMPLETED ? (
                                                            item?.rate ? (
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar
                                                                            key={i}
                                                                            style={{ color: i < item?.rate ? "#F0D24A" : "#e4e5e9" }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                    <div>
                                                                        Code: {order?.orderCode}
                                                                    </div>
                                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "fit-content", gap: "10px" }}>
                                                                        <div style={{ width: 200 }}>
                                                                            {order?.status}
                                                                        </div>
                                                                        <button onClick={() => showRateForm(item?.product.idProduct, item?.id)} style={{ color: "#EE4D2D", border: "none", background: "none", margin: 0 }}>Đánh giá</button>
                                                                    </div>
                                                                </div>

                                                            )
                                                        ) : (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <div>
                                                                    Code: {order?.orderCode}
                                                                </div>
                                                                <div style={{ color: "red" }}>
                                                                    {order?.status}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Row onClick={() => viewDetailOrder(order?._id)} style={{ marginTop: "10px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                                                        <Col xs={2}>
                                                            <img src={`${item?.product.image[0]}`}
                                                                alt="imgPro"
                                                                style={{ width: "100%" }}
                                                            />
                                                        </Col>
                                                        <Col xs={8}>
                                                            <div style={{ fontSize: "18px" }}>{item?.product.name}</div>
                                                            <div>x {item?.quantity}</div>
                                                        </Col>
                                                        <Col xs={2}>
                                                            {item?.product.sale ? (
                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                    <div style={{ fontSize: "15px", textDecoration: "line-through", color: "#7F7F7F", marginRight: "5px" }}>{formatMoney(item?.product.price * item?.quantity)} đ</div>
                                                                    <div style={{ fontSize: "15px", color: "#EE4D2D" }}>{formatMoney(item?.product.price * item?.quantity * (100 - item?.product.sale) / 100)} đ</div>
                                                                </div>
                                                            ) : (
                                                                <div style={{ color: "#EE4D2D", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                    {formatMoney(item?.product.price)} đ
                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    <div style={{ textAlign: "end", padding: "50px 0 20px 0" }}>
                                                        <div>Thành tiền: <span style={{ fontSize: "22px", color: "#EE4D2D" }}>{formatMoney(order?.totalOrder)}</span> đ</div>
                                                        <div>{(() => {
                                                            if (order?.status === "Hoàn thành" || order?.status === "Đã hủy") {
                                                                return <button
                                                                    onClick={() => viewDetailProduct(item?.product)}
                                                                    style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                                >Mua lại</button>;
                                                            } else if (order?.status === "Chờ xác nhận" || order?.status === "Đang chờ thanh toán") {
                                                                return <button onClick={() => {
                                                                    setOpenCancelOrder(true)
                                                                    setIdOrderCancel(order?.id)
                                                                }}
                                                                    style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                                >Hủy đơn</button>;
                                                            } else if (order?.status === "Đang vận chuyển") {
                                                                return <button onClick={() => changeStatusOrder(order?._id)}
                                                                    style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                                >Đã nhận được hàng</button>;
                                                            } else {
                                                                return <button disabled
                                                                    style={{ background: "#6C6C6C", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                                >Đã nhận được hàng</button>;
                                                            }
                                                        })()}
                                                            <button style={{ background: "white", border: "solid 1px #6C6C6C", width: "150px", padding: "10px 0", borderRadius: "5px", marginLeft: "10px" }}
                                                            >Chat với người bán</button>
                                                        </div>
                                                    </div>
                                                </Container>
                                            ) : null
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <Container style={{ display: "flex", borderBottom: "1px solid #7F7F7F" }}>
                                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "20px", padding: "20px 10px" }}>Code: {order?.orderCode}</div>

                                        </Container>
                                        {allItem?.map(item =>
                                            item.order._id === order._id ? (
                                                <Container key={item._id}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                                                        <div>

                                                        </div>
                                                        {order?.status === COMPLETED ? (
                                                            item?.rate ? (
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar
                                                                            key={i}
                                                                            style={{ color: i < item?.rate ? "#F0D24A" : "#e4e5e9" }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: "flex" }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: "150px" }}>
                                                                        {order?.status}
                                                                    </div>
                                                                    <button onClick={() => showRateForm(item?.product._id, item?.id)} style={{ color: "#EE4D2D", border: "none", background: "none", margin: 0 }}>Đánh giá</button>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: "red" }}>
                                                                    {order?.status}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Row onClick={() => viewDetailOrder(order?._id)} style={{ marginTop: "10px", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                                                        <Col xs={2}>
                                                            <img src={`${item?.product.image[0]}`}
                                                                alt="imgPro"
                                                                style={{ width: "100%" }}
                                                            />
                                                        </Col>
                                                        <Col xs={8}>
                                                            <div style={{ fontSize: "18px" }}>{item?.product.name}</div>
                                                            <div>x {item?.quantity}</div>
                                                        </Col>
                                                        <Col xs={2}>
                                                            {item?.product.sale ? (
                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                    <div style={{ fontSize: "15px", textDecoration: "line-through", color: "#7F7F7F", marginRight: "5px" }}>{formatMoney(item?.product.price * item?.quantity)} đ</div>
                                                                    <div style={{ fontSize: "15px", color: "#EE4D2D" }}>{formatMoney(item?.product.price * item?.quantity * (100 - item?.product.sale) / 100)} đ</div>
                                                                </div>
                                                            ) : (
                                                                <div style={{ color: "#EE4D2D", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                    {formatMoney(item?.product.price)} đ
                                                                </div>
                                                            )}
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            ) : null
                                        )}
                                        <Container>
                                            <div style={{ textAlign: "end", padding: "50px 0 20px 0" }}>
                                                <div>Thành tiền: <span style={{ fontSize: "22px", color: "#EE4D2D" }}>{formatMoney(order?.totalOrder)}</span> đ</div>
                                                <div>{(() => {
                                                    if (order?.status === "Hoàn thành" || order?.status === "Đã hủy") {
                                                        return <button
                                                            onClick={() => viewDetailProduct(allItem.filter(item => item.order.id === order.id)[0].product)}
                                                            style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                        >Mua lại</button>;
                                                    } else if (order?.status === "Đang vận chuyển") {
                                                        return <button onClick={() => changeStatusOrder(order?._id)}
                                                            style={{ background: "#EE4D2D", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                        >Đã nhận được hàng</button>;
                                                    } else {
                                                        return <button disabled
                                                            style={{ background: "#6C6C6C", color: "white", border: "none", width: "150px", padding: "10px 0", borderRadius: "5px" }}
                                                        >Đã nhận được hàng</button>;
                                                    }
                                                })}
                                                    <button style={{ background: "white", border: "solid 1px #6C6C6C", width: "150px", padding: "10px 0", borderRadius: "5px", marginLeft: "10px" }}
                                                    >Chat với người bán</button>
                                                </div>
                                            </div>
                                        </Container>
                                    </div>
                                )}

                            </div>
                        ))}

                </div>
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={orders
                        ?.filter(order => searchOrderByCode !== '' ? order.code === searchOrderByCode : order)
                        ?.filter(order => filterStatus === "Tất cả" || order?.status === filterStatus)?.length || 0}
                    onChange={paginate}
                />
                <Modal
                    title="Bạn muốn hủy đơn hàng ?"
                    open={openCancelOrder}
                    onOk={okCancel}
                    onCancel={() => setOpenCancelOrder(false)}
                >
                    <div>Lý do: </div>
                    <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={reasonCancel} onChange={e => setReasonCancel(e.target.value)}></TextArea>
                </Modal>
                <Modal
                    title="Phiếu đánh giá"
                    open={openRate}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Rate style={{ fontSize: "30px" }} onChange={setStar} value={star} />
                    <div>Cảm nhận của bạn về sản phẩm thế nào ? </div>
                    <TextArea style={{ width: "100%", height: "100px", marginTop: "10px" }} value={review} onChange={e => setReview(e.target.value)}></TextArea>
                </Modal>

            </Container>
        </div>
    )
}
export default PurchaseOrder

