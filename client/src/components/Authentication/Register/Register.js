import RegisterCard from "../../Card/RegisterCard/RegisterCard";
import Header from "../../Header/Header";
import './Register.css'

const Register = () => {
    return (
        <div>
            <Header />
            <div className="register__auth__container">
                <div className="register__auth">
                    <RegisterCard />
                </div>
            </div>
        </div>
    );
}

export default Register;