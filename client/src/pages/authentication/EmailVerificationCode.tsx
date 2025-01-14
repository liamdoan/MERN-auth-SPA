import styles from "./EmailVerificationCode.module.css";
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SubmitButton from '../../components/auth-model/auth-form-components/SubmitButton';
import LoadingBar from '../../components/loading/LoadingBar';
import { emailVerificationCode } from '../../utils/authApiCalls';

const EmailVerificationCode = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]); 
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [userTypedCode, setUserTypedCode] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>("");
    const [messageFailed, setMessageFailed] = useState<string>("");

    const navigate = useNavigate();

    const handleInputChange = (value: string, index: number) => {
        if (isNaN(Number(value)) || value.length > 1) return;
    
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
    
        const isAllInputsFilled = newCode.every((digit) => digit !== "");

        if (isAllInputsFilled) {
            setIsButtonDisabled(false);
            setUserTypedCode(newCode.join(""));
        } else if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && code[index] === "") {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setCode(["", "", "", "", "", ""]);
        setIsButtonDisabled(true);

        try {
            const response = await emailVerificationCode(userTypedCode);

            setLoading(false);
            setMessageSuccess(response.data.message);
            setTimeout(() => setMessageSuccess(""), 3000);

            navigate('/login');
        } catch (error: any) {
            setLoading(false);
            setMessageFailed(error.response.data.message);
            setTimeout(() => setMessageFailed(""), 3000);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Enter verification code sent to your email</h1>
                <form className={styles.formWrapper} onSubmit={handleSubmitCode}>
                    <div className={styles.inputWrapper}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={styles.inputField}
                            />
                        ))}
                    </div>
                    <SubmitButton title="Send code" disabled={isButtonDisabled}/>
                    { loading && <LoadingBar /> }
                    { messageSuccess && <span className={styles.messageSuccess}>{messageSuccess}</span> }
                    { messageFailed && <span className={styles.messageFailed}>{messageFailed}</span> }
                </form>
            </div>
            <p className={styles.footer}>
                Should any issue arise, please contact us!
            </p>
        </div>
    );
};

export default EmailVerificationCode

// Planned flow of the code auth (twisted from cab-booking app):
// validate if input is number, and each input can only has 1 value.
// validate if all inputs are filled with number.
// If all inputs are filled, join values as a string, enable button.
// If code is correct, authorization is ok.
// After clicking button, reset all values, exit focus, disable button.
// if current input has value, and it's not the last input, switch focus to next one.
// If user hits backspace, focus will switch to previous input andits digit will be removed.
