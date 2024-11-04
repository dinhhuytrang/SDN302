import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Alert, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import "../products/UpdateProduct.css";
import { BASE_URL } from '../../constant/constant';
import uploadImg from '../../function/uploadImg'; // Import the uploadImg function

function UpdateProduct() {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    remain: '',
    category: '',
    description: '',
    options: [],
    images: [], // Array to hold image URLs
  });
  const [newOption, setNewOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch product data
        const productResponse = await axios.get(`${BASE_URL}/api/products/${id}`);
        const productData = productResponse.data.data;
        setProductData({
          name: productData.name,
          price: productData.price,
          remain: productData.remain,
          category: productData.category._id,
          description: productData.description,
          options: productData.option || [],
          images: productData.image || [], // Load existing images if any
        });
        
        // Fetch categories
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
  }, [id]);

  // Handle file input change
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    try {
      const uploadedImages = await uploadImg(files); // Use the uploadImg function to upload images
      // Update the productData images state with the new image URLs
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...uploadedImages],
      }));
    } catch (error) {
      setErrorMessage('Failed to upload images. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setProductData({
        ...productData,
        options: [...productData.options, newOption.trim()],
      });
      setNewOption(''); // Clear the input field
    }
  };

  const handleRemoveOption = (index) => {
    setProductData({
      ...productData,
      options: productData.options.filter((_, i) => i !== index),
    });
  };

  const handleRemoveImage = (index) => {
    setProductData({
      ...productData,
      images: productData.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    const { name, price, remain, category, description, options, images } = productData;

    // Validate required fields
    if (!name || !price || !remain || !category) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Update the product with the provided data
      await axios.put(`${BASE_URL}/api/products/update/${id}`, {
        name,
        price,
        remain,
        category,
        description,
        option: options,
        image: images, // Send the image URLs
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
            <h4>Product Images</h4>
            <div className="content-image-list" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {productData.images.map((image, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '120px' }}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
              multiple // Allow multiple file uploads
            />
            <Button className="mt-2" onClick={() => fileInputRef.current.click()}>
              Add Image
            </Button>
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
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                  <Form.Control
                    type="text"
                    placeholder="Add option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <Button onClick={handleAddOption} style={{ marginLeft: '5px' }}>Add</Button>
                </div>
                <div>
                  {productData.options.map((option, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{option}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ marginLeft: '10px' }}
                        onClick={() => handleRemoveOption(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default UpdateProduct;
