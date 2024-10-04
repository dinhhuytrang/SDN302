import ResetPasswordCard from "../../Card/ResetPassword/ResetPasswordCard";
import './ResetPassword.css'

const ResetPassword = () => {
    return ( 
        <div className="resetPassword__auth__container">
            <div className="resetPassword__auth">
                <ResetPasswordCard />
            </div>
        </div>
     );
}
 
export default ResetPassword;