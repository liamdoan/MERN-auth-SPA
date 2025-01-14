import React, { useState } from 'react';
import styles from "./EditInfoPopup.module.css";
import LoadingBar from '../loading/LoadingBar';

interface EditInfoPopupProps {
    initialName: string;
    initialEmail: string;
    loadingState: boolean;
    onConfirm: (name: string, email: string) => void;
    onCancel: () => void;
}

const EditInfoPopup: React.FC<EditInfoPopupProps> = ({
    initialName, initialEmail, loadingState, onConfirm, onCancel
}) => {
    const [name, setName] = useState<string>(initialName);
    const [email, setEmail] = useState<string>(initialEmail);
    return (
        <div className={styles.wrapper}>
            <div className={styles.popup}>
                <p>User Information:</p>
                <div className={styles.inputsWrapper}>
                    <label className={styles.inputFieldHolder} htmlFor="">
                        <span className={styles.inputName}>Name:</span>
                        <input
                            className={styles.inputField}
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </label>
                    <label className={styles.inputFieldHolder} htmlFor="">
                        <span className={styles.inputName}>Email:</span>
                        <input
                            className={styles.inputField}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </label>
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                    <button className={styles.confirmUpdateButton} onClick={() => onConfirm(name, email)}>Update</button>
                </div>
                {loadingState && <LoadingBar />}
            </div>
        </div>
    )
}

export default EditInfoPopup
