import React, { useContext, useState } from 'react';
import { CartItemsContext } from '../../Context/CartItemsContext';
import './Checkout.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const Checkout = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const cartItems = useContext(CartItemsContext);
    const navigate = useNavigate();

    // Hàm xử lý khi nhấn nút thanh toán
    const handlePayment = () => {
        // Kiểm tra nếu các thông tin đã được nhập đầy đủ
        if (name && phone && address && cartItems.items.length > 0) {
            // Lưu thông tin người nhận và chi tiết giỏ hàng vào localStorage (hoặc gửi lên server)
            const orderDetails = {
                name,
                phone,
                address,
                items: cartItems.items,
                totalAmount: cartItems.totalAmount
            };
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

            // Chuyển sang trang thanh toán
            navigate('/payment');
        } else {
            alert('Vui lòng nhập đầy đủ thông tin và kiểm tra lại giỏ hàng.');
        }
    };

    return (
        <div>
            <Header />
            <div className="checkout__container">
                <h2>Checkout</h2>
                <div className="checkout__form">
                    <label>Tên người nhận</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên người nhận"
                    />

                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                    />

                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nhập địa chỉ giao hàng"
                    />
                </div>

                <div className="checkout__items">
                    <h3>Danh sách sản phẩm</h3>
                    <ul>
                        {cartItems.items.map(item => (
                            <li key={item._id}>
                                {item.name} - ${item.price} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                    <div className="total__amount">
                        Tổng cộng: ${cartItems.totalAmount}.00
                    </div>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePayment}
                >
                    Thanh toán
                </Button>
            </div>
        </div>
    );
};

export default Checkout;
