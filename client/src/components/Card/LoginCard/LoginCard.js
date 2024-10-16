import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginCard.css';

const LoginCard = () => {
    // Khai báo state cho email và password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    // Hàm xử lý khi nhấn nút LOGIN
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login failed:', data.message);
                alert(data.message); // Thông báo lỗi nếu đăng nhập không thành công
            } else {
                console.log('Login successful:', data);
                // Chuyển hướng hoặc thực hiện hành động sau khi đăng nhập thành công
                navigate('/');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Đã có lỗi xảy ra trong quá trình đăng nhập.'); // Thông báo lỗi cho người dùng
        }
    };

    return ( 
        <div className="login__card__container">
            <div className="login__card">
                <div className="login__header">
                    <h1>Login</h1>
                </div>
                <div className="login__inputs">
                    <div className="email__input__container input__container">
                        <label className="email__label input__label">Email</label>
                        <input 
                            type="email" 
                            className="email__input login__input" 
                            placeholder='example@gmail.com' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Cập nhật giá trị email
                        />
                    </div>
                    <div className="password__input__container input__container">
                        <label className="password__label input__label">Password</label>
                        <input 
                            type="password" 
                            className="password__input login__input" 
                            placeholder='**********'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Cập nhật giá trị password
                        />
                    </div>
                    <div className="login__button__container">
                        <button className="login__button" onClick={handleLogin}>LOGIN</button>
                    </div>
                </div>
                <div className="login__other__actions">
                    <div className="login__forgot__password">
                        <Link to="/account/resetpassword">Forgot password?</Link>
                    <span style={{marginLeft:"20px"}}>
                        <Link to="/account/changepw">Change Password ?</Link>
                    </span>
                    
                    </div>
                    <div className="login__new__account">Don't have account? <Link to="/account/register">Create account</Link></div>
                </div>
            </div>
        </div>
    );
}
 
export default LoginCard;
