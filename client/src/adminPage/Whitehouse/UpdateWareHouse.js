import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Changed from Navigate to useNavigate
import axios from 'axios';
import { Row, Col, Button, Alert, Image, Form } from 'react-bootstrap';
import "../Whitehouse/addwhite.css";
import Swal from 'sweetalert2';
import { BASE_URL} from '../../constant/constant'
function UpdateWareHouse() {
  const { id } = useParams(); // Extract `id` from the route parameters
  const navigate = useNavigate(); // Use navigate hook for programmatic navigation
  const [productData, setProductData] = useState({
    productName: '',
    status: '',
    supplier: '',
    quantity: '',
    note: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const fileInputRef = useRef(null);

  // Fetch product data if id is provided
  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/warehouse/${id}`);
          const data = response.data.data; // Access the data object

          if (data.product) {
            setProductData({
              productName: data.product.name, // Set the product name
              status: data.status,
              supplier: data.supplier,
              quantity: data.quantity,
              note: data.note,
            });
            if (data.product.image && data.product.image.length > 0) {
              setSelectedImage(data.product.image[0]); 
            }
          } else {
            setErrorMessage("Product data is missing in the response.");
          }
        } catch (error) {
          setErrorMessage("Error fetching product data. Please try again.");
          console.error(error);
        } finally {
          setLoading(false); 
        }
      };

      fetchProductData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const { status, quantity, supplier, note } = productData;

    // Validation for the fields that need to be updated
    if (!status || !quantity || !supplier || !note) {
      setErrorMessage('All fields must be filled out.');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send only the fields that need to be updated
      await axios.put(`${BASE_URL}/api/warehouse/update/${id}`, {
        status,
        supplier,
        quantity,
        note,
      });
      setSuccessMessage('Product warehouse updated successfully!');

      // Show alert and navigate back after successful save
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product warehouse updated successfully!',
      }).then(() => {
        navigate('/admin/warehouse'); // Navigate back to the warehouse page
      });
    } catch (error) {
      setErrorMessage('Failed to update product warehouse. Please try again.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/warehouse'); // Navigate back without saving
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <div className="container mt-4">
      <Row>
        <div className="button-box">
          <Button variant="danger" onClick={handleCancel}>Cancel</Button>
          <Button style={{ marginLeft: 5 }} variant="outline-primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row style={{ marginBottom: 20 }}>
        <Col xs={4}>
          <div className="box-content-left">
            <h4>Thumbnail</h4>
            <div className="content-image">
              <Image
                src={selectedImage || 'https://via.placeholder.com/150'}
                alt="Product Thumbnail"
                fluid
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
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
                  type="text"
                  name="productName"
                  value={productData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  disabled
                />
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
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter additional notes"
                  name="note"
                  value={productData.note}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default UpdateWareHouse;
