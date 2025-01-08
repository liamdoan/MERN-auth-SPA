import styles from "./PasswordReset.module.css";
import { useState } from "react";
import Input from "../../components/auth-form-components/Input";
import SubmitButton from "../../components/auth-form-components/SubmitButton";
import LoadingBar from "../../components/loading/LoadingBar";
import { Link, useParams } from "react-router-dom";
import IconTick from "../../components/auth-form-components/IconTick";
import { resetPassword } from "../../utils/authApiCalls";

const PasswordReset = () => {
    const {token} = useParams();
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmedNewPassword, setConfirmedNewPassword] = useState<string>("");

    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");
    const [submitSuccess, setSubmitSuccess] = useState<Boolean>(false);

    const messageConfirmString = "Passwords don't match.";
    const [messageConfirm, setMessageConfirm] = useState<string>("");

    const checkPasswordsMatch = () => {
        if (newPassword !== confirmedNewPassword) {
            setLoading(false);
            setMessageConfirm(messageConfirmString);
            return false;
        } else {
            return true;
        };
    };

    const handleSubmitResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!checkPasswordsMatch()) {
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await resetPassword(token, newPassword);

            setLoading(false);
            setNewPassword("");
            setConfirmedNewPassword("");
            setMessageSuccess(response.data.message);
            setMessageFailed("");
            setSubmitSuccess(true);
        } catch (error: any) {
            setLoading(false);
            setMessageSuccess("");
            setMessageFailed(error.response.data.message);
            setSubmitSuccess(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <h1>Reset your password</h1>
                {!submitSuccess 
                    ? <>
                        <form className={styles.formInput} action="" onSubmit={handleSubmitResetPassword}>
                            <Input
                                type="text"
                                placeholder='New Password'
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value),
                                    setMessageConfirm("")
                                }}
                            />
                            <Input
                                type="text"
                                placeholder='Confirm New Password'
                                value={confirmedNewPassword}
                                onChange={(e) => {
                                    setConfirmedNewPassword(e.target.value),
                                    setMessageConfirm("")
                                }}
                            />
                            <SubmitButton title="Confirm new password" disabled={!newPassword || !confirmedNewPassword}/>
                            { loading && <LoadingBar /> }
                            { messageConfirm && <span className={styles.messageFailed}>{messageConfirm}</span> }
                            { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                            
                        </form>
                    </> 
                    : <div className={styles.footer}>
                            <IconTick />
                            { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                            <Link className={styles.backToLogin} to={"/login"}>&larr; Back to login page</Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default PasswordReset
