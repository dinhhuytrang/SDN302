import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { useEffect, useState } from "react";

const Header = () => {
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("admin"))?.accessToken;
    
    useEffect(() => {
        if (!token) {
            navigate('/admin/signin');
        } else {
            fetchData();
        }
    }, [token, navigate]);

    useEffect(() => {
        const adminLocal = JSON.parse(localStorage.getItem("admin"));

        setAdmin(adminLocal);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const items = [
        {
            label: "Tài khoản",
            key: "/admin/profile",
        },
        {
            label: "Đăng xuất",
            key: "logout",
        },
    ];

    const handleDropdownItemClick = (e) => {
        if (e.key === "logout") {
            localStorage.removeItem("admin");
            localStorage.removeItem("isAdminAuthenticated");
            navigate("/admin/signin");
        } else {
            navigate(e.key);
        }
    };

    return (
        <div style={{ borderBottom: "3px solid #F5F5F7", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)", marginBottom: "5px" }}>
            <Container style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="col-sm-2" style={{ height: "130px", paddingTop: "20px" }}>
                    <Link to="/"><img src="../images/logo2.png" alt="Logo" style={{ width: "auto", height: "80%" }} /></Link>
                </div>
                <div style={{ height: "130px", display: "flex" }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        <Dropdown
                            menu={{ onClick: handleDropdownItemClick, items: items }}
                            arrow
                            placement="bottom"
                            style={{ marginTop: "20px" }}
                        >
                            {admin?.avatar ? (
                                <Avatar src={admin?.avatar} style={{ height: "45px", width: "auto" }}></Avatar>
                            ) : (
                                <Avatar>{admin?.username[0].toUpperCase()}</Avatar>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;
