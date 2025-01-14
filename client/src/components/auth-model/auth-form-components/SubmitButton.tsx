import React from "react";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
    title: string,
    disabled?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ title, disabled }) => {
  return (
    <button className={styles.button} type="submit" disabled={disabled}>
        {title}
    </button>
  )
}

export default SubmitButton
