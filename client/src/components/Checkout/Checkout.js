import React, { useContext, useEffect, useState } from 'react';
import { CartItemsContext } from '../../Context/CartItemsContext';
import './Checkout.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Checkout = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const cartItems = useContext(CartItemsContext);
    const navigate = useNavigate();
    
    const shippingFee = 20; // Phí ship

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setName(userDetails.name || '');
            setPhone(userDetails.phone || '');
            setAddress(userDetails.address || '');
        }
    }, []);

    const handlePayment = () => {
        if (cartItems.items.length > 0) {
            const orderDetails = {
                name,
                phone,
                address,
                paymentMethod,
                items: cartItems.items,
                totalAmount: cartItems.totalAmount + shippingFee // Cộng phí ship vào tổng số tiền
            };
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            setOpenSnackbar(true);
            setSnackbarMessage('Đặt hàng thành công! Bạn sẽ được chuyển đến trang thanh toán.');
        } else {
            // Hiển thị thông báo nếu giỏ hàng trống
            setOpenSnackbar(true);
            setSnackbarMessage('Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        if (cartItems.items.length > 0) {
            navigate('/payment');
        }
    };

    return (

        <div className="checkout__container">
            <h2>Checkout</h2>
            <div className="checkout__content">
                <div className="checkout__form">
                    <label>Tên người nhận:</label>
                    <p>{name}</p>
                    <label>Số điện thoại:</label>
                    <p>{phone}</p>

                    <label>Địa chỉ:</label>
                    <p>{address}</p>
                </div>

                <div className="checkout__items">
                    <h3>Danh sách sản phẩm</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>{item.quantity || 1}</td>
                                    <td>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total__amount">
                        <p>Tổng tiền sản phẩm: ${cartItems.totalAmount.toFixed(2)}</p>
                        <p>Phí ship: ${shippingFee}.00</p>
                        <p>Tổng cộng: ${(cartItems.totalAmount + shippingFee).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="checkout__payment-method">
                <h3>Phương thức thanh toán</h3>
                <div>
                    <input 
                        type="radio" 
                        id="cod" 
                        name="paymentMethod" 
                        value="COD" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')} 
                    />
                    <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div>
                    <input 
                        type="radio" 
                        id="vnpay" 
                        name="paymentMethod" 
                        value="VNPay" 
                        checked={paymentMethod === 'VNPay'} 
                        onChange={() => setPaymentMethod('VNPay')} 
                    />
                    <label htmlFor="vnpay">Thanh toán qua VNPay</label>

                </div>

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handlePayment}
            >
                Thanh toán
            </Button>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={cartItems.items.length > 0 ? "success" : "error"}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Checkout;
