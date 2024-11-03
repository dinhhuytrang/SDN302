import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link here
import { Row, Col, Carousel } from "react-bootstrap";
import axios from "axios";
import "../Whitehouse/addwhite.css";
import { BASE_URL } from "../../constant/constant";
function ViewDetailWhiteHouse() {
  const { id } = useParams(); // Get the 'id' parameter from the route
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Fetch product details using the dynamic 'id' from useParams
    axios
      .get(`${BASE_URL}/api/warehouse/${id}`)
      .then((response) => {
        setProductData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]); // Add 'id' as a dependency to re-fetch if it changes

  if (!productData) {
    return <p>Loading...</p>;
  }

  const { product, status, quantity, supplier } = productData;
  const { name, image, price, remain, description } = product;

  return (
    <div className="container mt-4">
      <Row className="box-content-detail">
        <Col md={6} className="content-left">
          <Carousel>
            {image.map((imgUrl, index) => (
              <Carousel.Item key={index}>
                <img
                  src={imgUrl}
                  width={500}
                  height={500}
                  alt={`${name} - View ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6} className="content-right">
          <h2>{name}</h2>
          <p>
            <strong>Status: </strong>
            <span className={`text-${status === "In" ? "success" : "danger"}`}>
              {status === "In" ? "In" : "Out"}
            </span>
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Price:</strong> {price} VND
          </p>
          <p>
            <strong>Supplier:</strong> {supplier}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
        </Col>
        <Row className="button-update">
          <Col md={12} className="text-center">
            <Link to={`/admin/warehouse/update/${productData._id}`}>
              <button className="btn btn-warning">Update</button>
            </Link>
          </Col>
        </Row>
      </Row>
    </div>
  );
}

export default ViewDetailWhiteHouse;
