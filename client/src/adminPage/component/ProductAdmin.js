import { Col, Container, Row } from "react-bootstrap";
import SideBar from "./SideBar";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatNumber from "../../function/formatMoney";
import { message, Pagination, Button, Modal } from "antd";
import { BASE_URL } from "../../constant/constant";

const ProductAdmin = () => {
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("admin"))?.token;
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5); // Number of products per page

    useEffect(() => {
        if (!token) {
            // Chuyển hướng đến trang đăng nhập nếu không có token
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            setProduct(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            message.error("Failed to fetch products. Please try again later.");
        }
    };

    const viewDetailProduct = (product) => {
        navigate(`/admin/products/${product._id}`);
    };

    const deleteProduct = (productId) => {
        Modal.confirm({
            title: "Confirm Deletion",
            content: "Are you sure you want to delete this product?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/api/products/remove/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    message.success("Product deleted successfully.");
                    setProduct(product.filter((item) => item._id !== productId)); // Update product list
                } catch (error) {
                    console.error("Error deleting product:", error);
                    message.error("Failed to delete product. Please try again.");
                }
            },
            onCancel: () => {
                message.info("Product deletion canceled.");
            },
        });
    };

    // Calculate the indices for the products on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = product.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2}>
                        <SideBar />
                    </Col>
                    <Col xs={10} style={{ paddingRight: "30px" }}>
                        <Container style={{ background: "#FCFCFC" }}>
                            <Row style={{ padding: "10px 0" }}>
                                <Col xs={4}>Hình ảnh sản phẩm</Col>
                                <Col xs={2}>Tên sản phẩm</Col>
                                <Col xs={1}>Giá</Col>
                                <Col xs={3}>Mô tả</Col>
                                <Col xs={2}>Actions</Col>
                            </Row>
                            <Row style={{ marginLeft: 0 }}>
                                {currentProducts.map((product, index) => (
                                    <Col
                                        className="row"
                                        key={product._id}
                                        xs={12}
                                        style={{
                                            background: "white",
                                            padding: "5px",
                                            border: "1px solid #F5F5F5",
                                            borderRadius: "10px"
                                        }}
                                    >
                                        <Col
                                            xs={4}
                                            style={{
                                                padding: "10px",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #F5F5F7"
                                            }}
                                            onClick={() => viewDetailProduct(product)}
                                        >
                                            {product.image.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={product.name}
                                                    style={{ maxWidth: "20%" }}
                                                />
                                            ))}
                                        </Col>
                                        <Col xs={2} onClick={() => viewDetailProduct(product)} style={{ cursor: "pointer" }}>
                                            <div
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    lineHeight: "1.5",
                                                    maxHeight: "4.5em"
                                                }}
                                            >
                                                {product.name}
                                            </div>
                                        </Col>
                                        <Col xs={1} style={{ fontSize: "15px" }}>
                                            {formatNumber(product.price)} đ
                                        </Col>
                                        <Col xs={3}>
                                            <div
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    lineHeight: "1.5",
                                                    maxHeight: "4.5em"
                                                }}
                                            >
                                                {product.description}
                                            </div>
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                type="primary"
                                                onClick={() => viewDetailProduct(product)}
                                                style={{ marginRight: 10 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="danger"
                                                onClick={() => deleteProduct(product._id)}
                                            >
                                                Delete
                                            </Button>
                                        </Col>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                        <div
                            className="p"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                                alignItems: "center"
                            }}
                        >
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={product.length}
                                onChange={paginate}
                            />
                        </div>
                        <br />
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    );
};

export default ProductAdmin;
