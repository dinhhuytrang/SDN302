import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterCard.css';

const RegisterCard = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use navigate for redirecting

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!username || !name  || !email || !password || !phone || !address || !birthday) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:9999/api/users/register`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    email,
                    phone,
                    address,
                    birthday,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Something went wrong. Please try again.');
                return;
            }

            // Redirect to login page after successful registration
            navigate('/account/login');
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return ( 
        <div className="register__card__container">
            <div className="register__card">
                <div className="register__header">
                    <h1>Create Account</h1>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form className="register__inputs" onSubmit={handleSubmit}>
                    <div className="username__input__container reg__input__container">
                        <label className="username__label input__label">Username</label>
                        <input
                            type="text"
                            className="username__input register__input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="name__input__container reg__input__container">
                        <label className="name__label input__label">Name</label>
                        <input
                            type="text"
                            className="name__input register__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="email__input__container reg__input__container">
                        <label className="email__label input__label">Email</label>
                        <input
                            type="email"
                            className="email__input register__input"
                            placeholder='example@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="phone__input__container reg__input__container">
                        <label className="phone__label input__label">Phone</label>
                        <input
                            type="tel"
                            className="phone__input register__input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="address__input__container reg__input__container">
                        <label className="address__label input__label">Address</label>
                        <input
                            type="text"
                            className="address__input register__input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="password__input__container reg__input__container">
                        <label className="password__label input__label">Password</label>
                        <input
                            type="password"
                            className="password__input register__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="birthday__input__container reg__input__container">
                        <label className="birthday__label input__label">Birthday</label>
                        <input
                            type="date"
                            className="birthday__input register__input"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                    <div className="register__button__container">
                        <button type="submit" className="register__button">Create Account</button>
                    </div>
                </form>
                <div className="register__other__actions">
                    <div className="register__login__account">
                        Already have an account? <Link to="/account/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCard;
