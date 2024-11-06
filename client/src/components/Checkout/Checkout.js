import React, { useContext, useEffect, useState } from 'react';
import { CartItemsContext } from '../../Context/CartItemsContext';
import './Checkout.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from '../Header/Header';

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
    const [isSuccess, setIsSuccess] = useState(null); // Trạng thái thành công hoặc lỗi
    const cartItems = useContext(CartItemsContext);
    const navigate = useNavigate();
    
    const shippingFee = 20000; // Phí ship

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
            // Tính toán tổng tiền đơn hàng (cộng thêm phí ship)
            const totalAmount = cartItems.items.reduce(
                (total, item) => total + (item.price * (item.quantity || 1)),
                0
            );
            
            // Tổng tiền đơn hàng + phí ship
            const finalTotal = totalAmount + shippingFee;
    
            // Tạo thông tin đơn hàng
            const orderDetails = {
                name: name,
                phone: phone,
                address: address,
                paymentMethod: paymentMethod,
                items: cartItems.items.map(item => ({
                    productId: item._id, // Sử dụng _id của sản phẩm
                    quantity: item.quantity || 1 // Nếu không có quantity, mặc định là 1
                })),
                totalOrder: finalTotal // Tổng số tiền (bao gồm phí ship)
            };
    
            // Log dữ liệu gửi đi để kiểm tra
            console.log('Dữ liệu gửi đi:', JSON.stringify(orderDetails, null, 2));
    
            // Gửi yêu cầu tạo đơn hàng lên server
            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails), // Đảm bảo gửi dữ liệu đúng định dạng
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);  // Debug phản hồi từ server
                
                if (data.success) {
                    setIsSuccess(true); // Đặt trạng thái thành công
                    setOpenSnackbar(true);
                    setSnackbarMessage('Đặt hàng thành công! Bạn sẽ được chuyển đến trang thanh toán.');
                    localStorage.setItem('orderDetails', JSON.stringify(orderDetails)); // Lưu thông tin đơn hàng vào localStorage
                } else {
                    setIsSuccess(false); // Đặt trạng thái lỗi
                    setOpenSnackbar(true);
                    setSnackbarMessage(`Lỗi: ${data.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setIsSuccess(false); // Đặt trạng thái lỗi nếu có lỗi
                setOpenSnackbar(true);
                setSnackbarMessage(`Đã xảy ra lỗi khi tạo đơn hàng: ${error.message || 'Vui lòng thử lại.'}`);
            });
        } else {
            setOpenSnackbar(true);
            setSnackbarMessage('Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        }
    };
       

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        if (cartItems.items.length > 0 && isSuccess) {
            navigate('/payment');
        }
    };

    return (

        <div>
            <Header />  {/* Thêm Header */}
            
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
                            <p>Tổng tiền sản phẩm: ${cartItems.items.reduce(
                                (total, item) => total + (item.price * (item.quantity || 1)),
                                0
                            ).toFixed(2)}</p>
                            <p>Phí ship: ${shippingFee}.00</p>
                            <p>Tổng cộng: ${(cartItems.items.reduce(
                                (total, item) => total + (item.price * (item.quantity || 1)),
                                0
                            ) + shippingFee).toFixed(2)}</p>
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
                        <Alert onClose={handleCloseSnackbar} severity={isSuccess ? "success" : "error"}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>

        </div>
    );
    
};

export default Checkout;
