import { Link } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
    return ( 
        <div className="change__card__container">
            <div className="change__card">
                <div className="change__header">
                    <h1>Change Password</h1>
                </div>
                <div className="change__inputs">
                    <div className="current__password__input__container reg__input__container">
                        <label className="current__password__label input__label">Current Password</label>
                        <input type="password" className="current__password__input change__input" />
                    </div>
                    <div className="new__password__input__container reg__input__container">
                        <label className="new__password__label input__label">New Password</label>
                        <input type="password" className="new__password__input change__input" />
                    </div>
                    <div className="confirm__password__input__container reg__input__container">
                        <label className="confirm__password__label input__label">Confirm New Password</label>
                        <input type="password" className="confirm__password__input change__input" />
                    </div>
                    <div className="change__button__container">
                        <button className="change__button">Change Password</button>
                    </div>
                </div>
                <div className="change__other__actions">
                    <div className="change__login__account">Remembered your password? <Link to="/account/login">Login</Link></div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
