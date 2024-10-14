import { Link, useNavigate } from 'react-router-dom';
import './ChangePassword.css';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePw } from '../../../services/authenticationAPI';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirmation do not match.");
            return;
        }

        try {
            await changePw(currentPassword, newPassword, confirmPassword);
            toast.success('Password changed successfully!');
            navigate('/account/login'); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="change__card__container">
            <ToastContainer />
            <div className="change__card">
                <div className="change__header">
                    <h1>Change Password</h1>
                </div>
                <form className="change__inputs" onSubmit={handleChangePassword}>
                    <div className="current__password__input__container reg__input__container">
                        <label className="current__password__label input__label">Current Password</label>
                        <input
                            type="password"
                            className="current__password__input change__input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="new__password__input__container reg__input__container">
                        <label className="new__password__label input__label">New Password</label>
                        <input
                            type="password"
                            className="new__password__input change__input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="confirm__password__input__container reg__input__container">
                        <label className="confirm__password__label input__label">Confirm New Password</label>
                        <input
                            type="password"
                            className="confirm__password__input change__input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="change__button__container">
                        <button type="submit" className="change__button">Change Password</button>
                    </div>
                </form>
                <div className="change__other__actions">
                    <div className="change__login__account">
                        Remembered your password?  <span style={{ marginLeft: '20px' }}><Link to="/account/login">Login</Link> </span>      
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
