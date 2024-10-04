import ChangePassword from '../../Card/ChangePassword/ChangePassword';
import './ChangePassword.css';

const ChangePasswordScreen = () => {
    return ( 
        <div className="change__auth__container">
            <div className="change__auth">
                <ChangePassword />
            </div>
        </div>
     );
}
 
export default ChangePasswordScreen;