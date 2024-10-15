import { Link } from 'react-router-dom';
import './ResetPasswordCard.css';
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../constant/constant';
import { Spin } from 'antd';
import Swal from 'sweetalert2';

const ResetPasswordCard = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const resetPassword = async (event) => {
        setLoading(true)
        event.preventDefault()
        try {
            const response = await axios.post(`${BASE_URL}/api/users/resetPassword`,
                { email: email, username: username }
            )
            if (response.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Reset successful',
                    showConfirmButton: false,
                    html: '<p>Please check your email</p>',
                    timer: 1500,
                });
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <Spin spinning={loading}>
            <div className="reset__card__container">
                <div className="reset__card">
                    <div className="reset__header">
                        <h1>Reset Password</h1>
                    </div>
                    <form className="reset__inputs" onSubmit={resetPassword}>
                        <div className="email__input__container reset__input__container">
                            <label className="email__label input__label">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="email__input reset__input" placeholder='example@gmail.com' />
                        </div>
                        <div className="email__input__container reset__input__container">
                            <label className="email__label input__label">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" className="email__input reset__input" />
                        </div>
                        <div className="reset__button__container">
                            <button type='submit' className="reset__button" >Reset Password</button>
                        </div>
                    </form>
                    <div className="reset__other__actions">
                        <div className="reset__login__account">Already have account? <Link style={{ textDecoration: "underline" }} to="/account/login">Login</Link></div>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default ResetPasswordCard;