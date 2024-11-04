import LoginCard from '../../Card/LoginCard/LoginCard';
import Header from '../../Header/Header';
import './Login.css';

const Login = () => {
    return (
        <div>
            <Header />
            <div className="login__auth__container">
                <div className="login__auth">
                    <LoginCard />
                </div>
            </div>
        </div>
    );
}

export default Login;