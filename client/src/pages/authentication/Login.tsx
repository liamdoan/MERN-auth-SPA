import styles from './Login.module.css';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '../../components/auth-model/auth-form-components/Input';
import SubmitButton from '../../components/auth-model/auth-form-components/SubmitButton';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailed, loginStart, loginSuccessful } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';
import { userLogin } from '../../utils/authApiCalls';
import LoadingBar from '../../components/loading/LoadingBar';
import Spinner from '../../components/loading/Spinner';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");

    const isCheckingUserAuthenticated = useSelector((state: RootState) => state.user.isCheckingUserAuthenticated);
    const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (isCheckingUserAuthenticated) {
        return <div className={styles.spinnerWrapper}><Spinner /></div>;
    }

    if (isUserAuthenticated) {
        return <Navigate to="/home" />;
    }

    const resetForm = () => {
        setEmail('');
        setPassword('');
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        dispatch(loginStart());

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await userLogin(email, password);

            if (response.data.user) {
                const {_id, name, email, roles, createdAt, lastLogin} = response.data.user;
                dispatch(loginSuccessful({_id, name, email, roles, createdAt, lastLogin}));
            };

            setLoading(false);
            setMessageSuccess(response.data.message);
            setTimeout(() => setMessageSuccess(""), 3000);
            resetForm();

            navigate("/home");
        } catch (error: any) {
            dispatch(loginFailed(error.response.data.message));
            
            setLoading(false);
            setMessageFailed(error.response.data.message);
            setTimeout(() => setMessageFailed(""), 3000);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <h1>Log in</h1>
                <form className={styles.formInput} action="" onSubmit={handleLogin}>
                    <Input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <SubmitButton title="Log In"/>
                    { loading && <LoadingBar /> }
                    { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                    { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                    <div className={styles.noticeForgotPassword}>
                        <span className={styles.noticeSpan}>
                            Forgot your password?
                            <span>&nbsp;</span>
                        </span>
                        <Link className={styles.forgotPasswordDirect} to={"/forgot-password"}>Click here.</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
