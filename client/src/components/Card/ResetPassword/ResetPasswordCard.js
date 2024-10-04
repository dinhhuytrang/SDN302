import { Link } from 'react-router-dom';
import './ResetPasswordCard.css';

const ResetPasswordCard = () => {
    return ( 
        <div className="reset__card__container">
            <div className="reset__card">
                <div className="reset__header">
                    <h1>Reset Password</h1>
                </div>
                <div className="reset__inputs">
                    <div className="email__input__container reset__input__container">
                        <label className="email__label input__label">Email</label>
                        <input type="email" className="email__input reset__input" placeholder='example@gmail.com' />
                    </div>
                    <div className="password__input__container reset__input__container">
                        <label className="password__label input__label">OTP</label>
                        <input type="text" className="password__input reset__input" />
                    </div>
                    <div className="reset__button__container">
                        <button className="reset__button" >Reset</button>
                    </div>
                </div>
                <div className="reset__other__actions">
                    <div className="reset__login__account">Already have account? <Link to="/account/login">Login</Link></div>
                </div>
            </div>
        </div>
     );
}
 
export default ResetPasswordCard;