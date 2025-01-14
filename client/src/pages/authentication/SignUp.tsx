import styles from './SignUp.module.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/auth-model/auth-form-components/Input';
import SubmitButton from '../../components/auth-model/auth-form-components/SubmitButton';
import PasswordStrengthIndicator from '../../components/auth-model/auth-form-components/PasswordStrengthIndicator';
import LoadingBar from '../../components/loading/LoadingBar';
import { userSignUp } from '../../utils/authApiCalls';

const SignUp = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");

    const navigate = useNavigate();

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!name || !email || !password) {
            return;
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await userSignUp(name, email, password);

            setLoading(false);
            setMessageSuccess(response.data.message);
            setTimeout(() => setMessageSuccess(""), 3000);
            resetForm();

            navigate("/email-verification");
        } catch (error: any) {
            setLoading(false);
            setMessageFailed(error.response.data.message);
            setTimeout(() => setMessageFailed(""), 3000);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                <h1>Create your account</h1>
                <form className={styles.input} action="" onSubmit={handleSignup}>
                    <Input
                        type="text"
                        placeholder='Full name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <PasswordStrengthIndicator password={password}/>
                    <SubmitButton title="Sign Up" disabled={!name || !email || !password}/>
                    { loading && <LoadingBar /> }
                    { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                    { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                    <div className={styles.noticeAlreadyHaveAccount}>
                        <span className={styles.noticeSpan}>
                            Already have an account?
                            <span>&nbsp;</span>
                        </span>
                        <Link className={styles.loginDirect} to={"/login"}>Please login.</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
