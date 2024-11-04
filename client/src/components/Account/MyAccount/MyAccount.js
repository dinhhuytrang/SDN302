import { Button } from 'react-bootstrap';
import Account from '../Account';
import './MyAccount.css';
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../Header/Header';

const MyAccount = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/account/login');
    }
    return (
        <div>
            <Header />
            <Account>
                <div className="order__history__container">
                    <div className="order__history">
                        <div className="order__history__header">Order History</div>
                        <div className="order__history__detail">You have not place any orders yet</div>
                    </div>
                </div>
                <div className="account__details__container">
                    <div className="account__details__header">
                        <div className="details__header">Account Details</div>
                        <Button onClick={e => handleLogout(e)}>Logout</Button>
                    </div>
                    <div className="account__details">
                        <div className="account__holder__name">Account holder name</div>
                        <div className="account__holder__email">Account holder email</div>
                        <div className="manage__account__action">
                            <Link to="/account/manage">Manage account</Link>
                        </div>
                    </div>
                </div>
            </Account>
        </div>

    );
}

export default MyAccount;