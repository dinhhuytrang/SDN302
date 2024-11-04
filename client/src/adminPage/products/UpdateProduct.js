import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Alert, Image, Form } from 'react-bootstrap';
import "../products/UpdateProduct.css";
import Swal from 'sweetalert2';
import { BASE_URL } from '../../constant/constant';

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    remain: '',
    category: '',
    description: '',
    options: [], // Add options array in state
  });
  const [newOption, setNewOption] = useState(''); // To store the new option being added
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        try {
          const productResponse = await axios.get(`${BASE_URL}/api/products/${id}`);
          const productData = productResponse.data.data;
          setProductData({
            name: productData.name,
            price: productData.price,
            remain: productData.remain,
            category: productData.category._id,
            description: productData.description,
            options: productData.option || [], // Load existing options
          });
          if (productData.image && productData.image.length > 0) {
            setSelectedImage(productData.image[0]);
          }
          
          const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
          setCategories(categoriesResponse.data);
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

  const handleAddOption = () => {
    if (newOption.trim()) {
      setProductData({
        ...productData,
        options: [...productData.options, newOption.trim()],
      });
      setNewOption(''); // Clear the input after adding
    }
  };

  const handleRemoveOption = (index) => {
    setProductData({
      ...productData,
      options: productData.options.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    const { name, price, remain, category, description, options } = productData;

    if (!name || !price || !remain || !category) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.put(`${BASE_URL}/api/products/update/${id}`, {
        name,
        price,
        remain,
        category,
        description,
        option: options, // Send updated options
      });
      setSuccessMessage('Product updated successfully!');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product updated successfully!',
      }).then(() => {
        navigate('/admin/products');
      });
    } catch (error) {
      setErrorMessage('Failed to update product. Please try again.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) {
    return <div>Loading...</div>;
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
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </Form.Group>
              <Form.Group controlId="productCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="productPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="productRemain">
                <Form.Label>Remain</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Remain"
                  name="remain"
                  value={productData.remain}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="productDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="productOptions">
                <Form.Label>Options</Form.Label>
                {productData.options.map((option, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      readOnly
                      value={option}
                      className="mr-2"
                    />
                    <Button variant="danger" size="sm" onClick={() => handleRemoveOption(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Form.Control
                  type="text"
                  placeholder="Add new option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <Button className="mt-2" onClick={handleAddOption}>
                  Add Option
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default UpdateProduct;
