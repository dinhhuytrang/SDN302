import ChangePassword from '../../Card/ChangePassword/ChangePassword';
import Header from '../../Header/Header';
import './ChangePassword.css';

const ChangePasswordScreen = () => {
    return (
        <div>
            <Header />
            <div className="change__auth__container">
                <div className="change__auth">
                    <ChangePassword />
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordScreen;