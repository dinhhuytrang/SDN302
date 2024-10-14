import { Link } from 'react-router-dom';
import './ResetPasswordCard.css';
import { useState } from 'react';

const ResetPasswordCard = () => {
    const [email, setEmail] = useState('')

    const resetPassword = () => {
        
    }

    return (
        <div className="reset__card__container">
            <div className="reset__card">
                <div className="reset__header">
                    <h1>Reset Password</h1>
                </div>
                <form className="reset__inputs">
                    <div className="email__input__container reset__input__container">
                        <label className="email__label input__label">Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" className="email__input reset__input" placeholder='example@gmail.com' />
                    </div>
                    <div className="reset__button__container">
                        <button onClick={resetPassword} className="reset__button" >Reset Password</button>
                    </div>
                </form>
                <div className="reset__other__actions">
                    <div className="reset__login__account">Already have account? <Link style={{ textDecoration: "underline" }} to="/account/login">Login</Link></div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordCard;