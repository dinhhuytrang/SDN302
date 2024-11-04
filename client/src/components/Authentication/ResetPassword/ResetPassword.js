import ResetPasswordCard from "../../Card/ResetPassword/ResetPasswordCard";
import Header from "../../Header/Header";
import './ResetPassword.css'

const ResetPassword = () => {
    return (
        <div>
            <Header />
            <div className="resetPassword__auth__container">
                <div className="resetPassword__auth">
                    <ResetPasswordCard />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;