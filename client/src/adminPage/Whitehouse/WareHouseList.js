import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Form, Pagination, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../../constant/constant";
import Swal from "sweetalert2";
import Header from "../Header";
import SideBar from "../component/SideBar";

export default function ListWareHouse() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate()
  const token = JSON.parse(localStorage.getItem("admin"))?.accessToken
  useEffect(() => {
    if (!token) {
      navigate('/admin/signin');
    }
  }, [token, navigate]);
  useEffect(() => {
    fetchWarehouseData(currentPage);
  }, [currentPage]);

  const fetchWarehouseData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/warehouse/list`, {
        params: { page },
      });
      setData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/api/warehouse/delete/${productId}`);
        Swal.fire("Deleted!", "The product has been deleted.", "success");
        fetchWarehouseData(currentPage); // Refresh the list
      } catch (error) {
        console.error("Error deleting product: ", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the product.",
          "error"
        );
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Row>
        <Col xs={2}>
          <SideBar />
        </Col>
        <Col xs={10}>
          <div className="container mt-4">
            <h2>Quản lý xuất/ nhập kho</h2>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong style={{ marginLeft: 10 }}>All ({totalItems})</strong>
              <Link to="/admin/warehouse/addnew">
                <Button variant="primary">
                  ADD NEW <FaPlus />
                </Button>
              </Link>
            </div>

            <Table hover responsive>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={item.product?.image[0]}
                        alt={item.product?.name || "Product"}
                        className="rounded"
                        width="80"
                        height="80"
                      />
                    </td>
                    <td>
                      <Link to={`/admin/warehouse/detail/${item._id}`}>
                        {item.product?.name}
                      </Link>
                    </td>
                    <td>{item?.quantity}</td>
                    <td>{item?.product?.price}</td>
                    <td>{item?.supplier}</td>
                    <td>
                      <Badge bg={item.status === "In" ? "success" : "danger"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td style={{ display: "flex", alignItems: "center", borderBottom: "none" }}>
                      <Link to={`/admin/warehouse/update/${item._id}`}>
                        <FaEdit style={{ marginRight: "8px" }} />
                      </Link>
                      <span
                        onClick={() => handleDelete(item._id)}
                        style={{ cursor: "pointer", marginLeft: "8px" }}
                      >
                        <MdDelete />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
      </Row>

    </div>

  );
}
