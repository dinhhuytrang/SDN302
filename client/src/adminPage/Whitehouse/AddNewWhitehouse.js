import React, { useEffect, useRef, useState } from "react";
import "../Whitehouse/addwhite.css";
import { Button, Col, Row, Image, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BASE_URL} from "../../constant/constant"
const AddProductPage = () => {
  const fileInputRef = useRef(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [productData, setProductData] = useState({
    productName: "",
    status: "",
    supplier: "",
    quantity: "",
    note: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productName") {
      const selectedProduct = productOptions.find((product) => product._id === value);
      setSelectedImage(selectedProduct ? selectedProduct.image[0] : "");
    }

    setProductData({ ...productData, [name]: value });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        setProductOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSave = async () => {
    if (!productData.productName || !productData.status || !productData.quantity || !productData.supplier) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        product: productData.productName,
        status: productData.status,
        quantity: parseInt(productData.quantity, 10),
        supplier: productData.supplier,
        ...(productData.note && { note: productData.note })
      };

      const warehouseResponse = await axios.post(`${BASE_URL}/api/warehouse/create`, payload);
      
      if (warehouseResponse.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product warehouse created successfully."
        }).then(() => {
          navigate("/admin/warehouse"); // Navigate after successful save
        });

        setProductData({
          productName: "",
          status: "",
          supplier: "",
          quantity: "",
          note: ""
        });
        setSelectedImage("");
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);

      // Display SweetAlert error notification
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data.message || "A network error occurred. Please check your connection and try again."
      });
    }
  };

  return (
    <div className="container mt-4">
      <Row>
        <div className="button-box">
          <Button variant="danger">Cancel</Button>
          <Button style={{ marginLeft: 5 }} variant="outline-primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row>
        <div className="box-content">
          <Col xs={4}>
            <div className="box-content-left">
              <h4>Thumbnail</h4>
              <div className="content-image">
                <Image
                  src={selectedImage || "https://via.placeholder.com/150"} 
                  alt="Product Thumbnail"
                  fluid
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
          </Col>

          <Col xs={8}>
            <div className="box-content-right">
              <h4>Product Information</h4>
              <Form>
                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="productName"
                    value={productData.productName}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a product</option>
                    {productOptions.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="productStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={productData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select status</option>
                    <option value="In">In</option>
                    <option value="Out">Out</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="productSupplier">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter supplier name"
                    name="supplier"
                    value={productData.supplier}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="productQuantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter quantity"
                    name="quantity"
                    value={productData.quantity}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="productNote">
                  <Form.Label>Note (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter additional notes (optional)"
                    name="note"
                    value={productData.note}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </div>
      </Row>
    </div>
  );
};

export default AddProductPage;
