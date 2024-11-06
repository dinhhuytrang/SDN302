import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Col, Row, InputGroup } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../products/addproduct.css";
import { MEN, WOMEN, KIDS,BASE_URL } from "../../constant/constant";
import uploadImg from "../../function/uploadImg"; // Ensure this function handles file uploads

const NewProductForm = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // Store the files for uploading
  const navigate = useNavigate(); // Initialize navigate
  const token = JSON.parse(localStorage.getItem("admin"))?.accessToken

  useEffect(() => {
    if (!token) {
        navigate('/admin/signin');
    } 
}, [token, navigate]);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      numberOfSale: "",
      remain: "",
      category: "",
      option: "",
      rate: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      category: Yup.string().required("Must select category before submitting"),
      price: Yup.number().required("Price is required").positive(),
      numberOfSale: Yup.number().min(0, "Must be positive"),
      remain: Yup.number().min(0, "Must be positive"),
    }),
    onSubmit: async (values) => {
      try {
        const arrUrl = await Promise.all(files.map((file) => uploadImg(file)));

        const flattenedUrls = arrUrl.flat();

        const data = {
          ...values,
          image: flattenedUrls,
          option: values.option ? values.option.split(",") : [],
        };

        const response = await axios.post(`${BASE_URL}/api/products/create`, data );
        console.log(response.data);

        // Success Alert
        Swal.fire({
          icon: "success",
          title: "Product Created!",
          text: "The product has been added successfully.",
        }).then(() => {
          navigate("/shop"); // Navigate to the shop page
        });
      } catch (error) {
        console.error("Error creating product:", error);

        // Error Alert
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again.",
        });
      }
    },
  });

  const handleAddImage = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    // Update state with new images and files
    setImages((prevImages) => [...prevImages, ...imageUrls]);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index)); // Also remove the file from files array
  };

  return (
    <Form onSubmit={formik.handleSubmit} className="p-4 border rounded">
      <h4 style={{ marginLeft: "70px", marginTop: "10px" }}>Add New Product</h4>
      <Row>
        <Col md={6}>
          <div className="product-info">
            <h5>Product Information</h5>
            <Form.Group controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                {...formik.getFieldProps("name")}
                isInvalid={!!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                {...formik.getFieldProps("description")}
                isInvalid={!!formik.errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="product-price">
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter base price"
                  {...formik.getFieldProps("price")}
                  isInvalid={!!formik.errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.price}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="numberOfSale">
              <Form.Label>Number of Sales</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of sales"
                {...formik.getFieldProps("numberOfSale")}
                isInvalid={!!formik.errors.numberOfSale}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.numberOfSale}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="remain">
              <Form.Label>Remain</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter remaining stock"
                {...formik.getFieldProps("remain")}
                isInvalid={!!formik.errors.remain}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.remain}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>

        <Col md={6}>
          <div className="product-images">
            <h5>Product Media</h5>
            <Form.Group controlId="productImage">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control type="file" onChange={handleAddImage} multiple />
            </Form.Group>
            <div className="d-flex flex-wrap mt-2">
              {images.map((image, index) => (
                <div key={index} className="position-relative me-2">
                  <img
                    src={image} // Image URL here
                    alt="Product"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{
                      transform: "translate(50%, -50%)",
                      borderRadius: "50%",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="category-content">
            <h5 className="mt-4">Category</h5>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select {...formik.getFieldProps("category")}>
                <option value="">Select category</option>
                <option value={MEN}>Male</option>
                <option value={WOMEN}>Female</option>
                <option value={KIDS}>Kids</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="option" className="mt-3">
              <Form.Label>Options (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter options, e.g., Size M - White, Size L - White"
                {...formik.getFieldProps("option")}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>

      <Button type="submit" className="button-submit" aria-label="Submit form">
        Submit
      </Button>
    </Form>
  );
};

export default NewProductForm;
