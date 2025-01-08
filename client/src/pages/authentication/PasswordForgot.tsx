
import styles from "./PasswordForgot.module.css";
import SubmitButton from '../../components/auth-form-components/SubmitButton';
import Input from '../../components/auth-form-components/Input';
import LoadingBar from '../../components/loading/LoadingBar';
import { useState } from 'react';
import IconTick from "../../components/auth-form-components/IconTick";
import { forgotPassword } from "../../utils/authApiCalls";

const PasswordForgot = () => {
    const [email, setEmail] = useState<string>("");
    
    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");
    const [submitSuccess, setSubmitSuccess] = useState<Boolean>(false);

    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await forgotPassword(email);

            setLoading(false);
            setEmail("");
            setMessageSuccess(response.data.message);
            setMessageFailed("");
            setSubmitSuccess(true);
        } catch (error: any) {
            setLoading(false);
            setMessageSuccess("");
            setMessageFailed(error.response.data.message)
            setSubmitSuccess(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <h1>Forgot Password</h1>
                {!submitSuccess
                    ? <>
                        <p className={styles.description}>
                            After entering your email, a link to reset your password will be sent to your provided email address.
                        </p>
                        <form className={styles.formInput} action="" onSubmit={handleSubmitEmail}>
                            <Input
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <SubmitButton title="Send me reset password link" disabled={!email}/>
                            { loading && <LoadingBar /> }
                            { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                        </form>
                    </>
                    : <>
                        <IconTick />
                        { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                    </>
                }
            </div>
        </div>
    )
}

export default PasswordForgot
