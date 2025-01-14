import styles from "./PasswordStrengthIndicator.module.css";

interface PasswordStrengthIndicatorProps {
    password: string
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({password}) => {
    const conditions = [
        {
            name: "At least 6 character",
            test: password.length > 5
        },
        {
            name: "Contain 1 uppercase",
            test: /[A-Z]/.test(password)
        },
        {
            name: "Contain 1 lowercase",
            test: /[a-z]/.test(password)
        },
        {
            name: "Contain a number",
            test: /\d/.test(password)
        },
        {
            name: "Contain a special character",
            test:  /[^A-Za-z0-9]/.test(password)
        }
    ];

    const metConditions = conditions.map((condition) => condition.test);
    const strength = metConditions.filter(Boolean).length; //filter away all falsey values

    const strengthLevels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    const strengthLevel = strengthLevels[strength - 1] || "";

    return (
        <div className={styles.passwordStrengthIndicator}>
            <div className={styles.strengthLabel}>{strengthLevel}</div>
            <div className={styles.strengthBars}>
                {Array.from({length: conditions.length}).map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.strengthBar} ${index < strength ? styles.active : ""}`}
                    />
                ))}
            </div>
            <ul className={styles.conditionsList}>
                {conditions.map((condition, index) => (
                    <li
                        key={condition.name}
                        className={`${styles.condition} ${metConditions[index] ? styles.passed : styles.notPassed}`}
                    >
                        {condition.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PasswordStrengthIndicator
