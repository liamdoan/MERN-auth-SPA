import React from 'react'
import styles from './continueWithOAuth.module.css'

interface ContinueWithOAuthProps {
    title: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ContinueWithOAuth: React.FC<ContinueWithOAuthProps> = ({ title }) => {
    const handleOAuth = () => {
        window.location.href = `${BASE_URL}/google`;
    }
    
    return (
        <div className={styles.oAuthButtonWrapper}>
            <div className={styles.separator}>
                <div className={styles.line}></div>
                <span className={styles.orText}>OR</span>
                <div className={styles.line}></div>
            </div>
            <button
                type='button'
                className={styles.oAuthButton}
                onClick={handleOAuth}
            >
                    {title}
            </button>
        </div>
    )
}

export default ContinueWithOAuth
