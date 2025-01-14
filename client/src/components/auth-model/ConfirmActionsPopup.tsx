import React from 'react';
import styles from "./ConfirmActionsPopup.module.css";
import LoadingBar from '../loading/LoadingBar';

interface ConfirmActionsPopupProps {
    loadingState?: boolean;
    message: any;
    onConfirm: () => void;
    onCancel: () => void
};

const ConfirmActionsPopup: React.FC<ConfirmActionsPopupProps> = ({loadingState, message, onConfirm, onCancel}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.popup}>
                {message}
                <div className={styles.buttonWrapper}>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                    <button className={styles.confirmDeleteButton} onClick={onConfirm}>Delete</button>
                </div>
                {loadingState && <LoadingBar />}
            </div>
        </div>
    )
}

export default ConfirmActionsPopup
